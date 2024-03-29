import {
  span, div, a, input, button, h4, ul, li,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  getAuthorization, getCommerceBase, isLoggedInUser,
  makeCoveoApiRequest,
} from '../../scripts/commerce.js';
import { getCookie } from '../../scripts/scripts.js';

const baseURL = getCommerceBase();

const COVEO_SEARCH_HUB = 'DanaherMainSearch';
const COVEO_PIPELINE = 'Danaher Marketplace';
const COVEO_MAX_RECENT_SEARCHES = 3;

let selectedSuggestionIndex = -1;

function shortName(user) {
  if (user) {
    return `${user.fname[0].toUpperCase()}${user.lname[0].toUpperCase()}`;
  }
  return '';
}

function getUser() {
  if (isLoggedInUser()) {
    return { fname: getCookie('first_name'), lname: getCookie('last_name') };
  }
  return undefined;
}

function formatSuggestionString(highlightedText, inputText) {
  return highlightedText.replace(/\[([^\]]+)\]/g, inputText ? '<span class="font-bold">$1</span>' : '$1').replace(/\{([^}]+)\}/g, '$1');
}

function getRecentSearches() {
  const recentSearchesString = localStorage.getItem('coveo-recent-queries');
  const recentSearches = recentSearchesString ? JSON.parse(recentSearchesString) : [];
  return recentSearches;
}

function setRecentSearches(searchValue) {
  const recentSearches = getRecentSearches();
  const searchValueIndex = recentSearches.findIndex((search) => search === searchValue);
  if (searchValueIndex > -1) recentSearches.splice(searchValueIndex, 1);
  recentSearches.unshift(searchValue);
  localStorage.setItem('coveo-recent-queries', JSON.stringify(recentSearches.slice(0, COVEO_MAX_RECENT_SEARCHES)));
}

function toggleSearchBoxMobile(e) {
  e.preventDefault();
  const searchBox = document.querySelector('.mobile-search');
  searchBox.classList.toggle('show', '!block');
  if (!searchBox.classList.contains('show')) searchBox.querySelector('input').focus();
}

function getCoveoApiPayload(searchValue, type) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTimestamp = new Date().toISOString();
  const clientId = getCookie('coveo_visitorId');
  const searchHistoryString = localStorage.getItem('__coveo.analytics.history');
  const searchHistory = searchHistoryString ? JSON.parse(searchHistoryString) : [];
  const payload = {
    analytics: {
      clientId,
      clientTimestamp: userTimestamp,
      documentLocation: window.location.href,
      documentReferrer: document.referrer,
      originContext: 'Search',
    },
    locale: 'en',
    pipeline: COVEO_PIPELINE,
    q: searchValue,
    searchHub: COVEO_SEARCH_HUB,
    timezone: userTimeZone,
    visitorId: clientId,
  };

  if (type === 'search') {
    payload.actionsHistory = searchHistory.map(({ time, value, name }) => ({ time, value, name }));
    payload.clientId = clientId;
    payload.clientTimestamp = userTimestamp;
    payload.originContext = 'Search';
    payload.count = 8;
    payload.referrer = document.referrer;
  }
  return payload;
}

async function submitSearchQuery(searchInput, actionCause = '') {
  let searchLocation = '/us/en/search.html';
  const redirectList = [];
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    const requestPayload = getCoveoApiPayload(searchTerm, 'search');
    const triggerRequestPayload = getCoveoApiPayload(searchTerm, 'trigger');
    requestPayload.analytics.actionCause = actionCause || searchInput.getAttribute('data-action-cause') || 'searchFromLink';
    await makeCoveoApiRequest('/rest/search/v2', 'searchKey', requestPayload);
    const triggerResponseData = await makeCoveoApiRequest('/rest/search/v2/plan', 'searchKey', triggerRequestPayload);
    const { preprocessingOutput } = triggerResponseData;
    const { triggers } = preprocessingOutput;
    if (triggers != null && triggers.length > 0) {
      triggers.forEach(({ content, type }) => {
        if (type === 'redirect') {
          redirectList.push(content);
        }
      });
    }
    setRecentSearches(searchTerm);
    searchLocation = `${searchLocation}#q=${encodeURIComponent(searchTerm)}`;
  }
  if (redirectList.length > 0) {
    const [redirect] = redirectList;
    window.location = redirect;
  } else {
    window.location = searchLocation;
  }
}

function buildSearchSuggestion(searchText, suggestionType = 'suggestion') {
  const searchSuggestion = button(
    {
      class: 'suggestion flex px-4 min-h-[40px] items-center text-left cursor-pointer hover:bg-danahergray-100',
      'data-suggestion-type': suggestionType,
    },
    div(
      {
        class: 'flex items-center',
      },
      span({
        class: 'w-4 h-4 mr-2 shrink-0 search-suggestion-icon',
      }),
      span({ class: 'search-suggestion-text break-all line-clamp-2' }),
    ),
  );
  searchSuggestion.querySelector('span.search-suggestion-icon').innerHTML = suggestionType === 'recent'
    ? `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" fill="none">
        <circle r="7.5" cy="8" cx="8"></circle><path d="m8.5 4.5v4"></path><path d="m10.3066 10.1387-1.80932-1.5768"></path>
      </svg>
    `
    : `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="m6.4 0c3.5 0 6.4 2.9 6.4 6.4 0 1.4-.4 2.7-1.2 3.7l4 4c.4.4.4 1 .1 1.5l-.1.1c-.2.2-.5.3-.8.3s-.6-.1-.8-.3l-4-4c-1 .7-2.3 1.2-3.7 1.2-3.4-.1-6.3-3-6.3-6.5s2.9-6.4 6.4-6.4zm0 2.1c-2.3 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3z"></path>
      </svg>
    `;
  searchSuggestion.querySelector('span.search-suggestion-text').innerHTML = searchText;
  searchSuggestion.addEventListener('click', async (e) => {
    const searchInput = e.target.closest('.searchbox').querySelector('input');
    searchInput.value = e.target.closest('button').querySelector('span.search-suggestion-text').innerText;
    searchInput.focus();
    await submitSearchQuery(searchInput, suggestionType === 'recent' ? 'searchFromLink' : 'omniboxFromLink');
  });
  return searchSuggestion;
}

async function buildSearchSuggestions(searchbox) {
  selectedSuggestionIndex = -1;
  const searchboxInput = searchbox.querySelector('input');
  const inputText = searchboxInput.value;
  const requestPayload = getCoveoApiPayload(inputText, 'search');
  const suggestionsResponseData = await makeCoveoApiRequest('/rest/search/v2/querySuggest', 'searchKey', requestPayload);
  const suggestions = suggestionsResponseData.completions;
  const wrapper = searchbox.querySelector('.search-suggestions-wrapper');
  const searchSuggestions = wrapper.querySelector('.search-suggestions');
  searchSuggestions.innerHTML = '';
  const recentSearches = getRecentSearches();
  if (!inputText && recentSearches.length > 0) {
    const recentSearchesHeading = div(
      { class: 'flex items-center px-4 py-2 text-danahergrey-900' },
      span({ class: 'font-bold' }, 'Recent Searches'),
      button({
        class: 'ml-auto text-sm hover:text-cyan-600',
        onclick: () => {
          localStorage.removeItem('coveo-recent-queries');
          buildSearchSuggestions(searchbox);
          searchboxInput.focus();
        },
      }, 'Clear'),
    );
    searchSuggestions.append(recentSearchesHeading);
    recentSearches.forEach((recentSearch) => searchSuggestions.append(buildSearchSuggestion(recentSearch, 'recent')));
  }
  suggestions.forEach((suggestion) => searchSuggestions.append(
    buildSearchSuggestion(formatSuggestionString(suggestion.highlighted, inputText), 'suggestion'),
  ));
}

function handleSearchClear(searchBox, searchInput) {
  const clearIcon = searchBox.querySelector('.searchbox-clear');
  if (searchInput.value) {
    clearIcon.classList.remove('hidden');
  } else {
    clearIcon.classList.add('hidden');
  }
}

async function handleSearchInput(e) {
  const { target } = e;
  const searchBox = target.closest('.searchbox');
  handleSearchClear(searchBox, target);
  await buildSearchSuggestions(searchBox);
}

function addEventToSearchInput(searchBlock) {
  const searchbox = searchBlock.querySelector('.searchbox');
  const searchInput = searchbox.querySelector('input');
  searchBlock.querySelector('.searchbox-clear').addEventListener('click', async (e) => {
    const { target } = e;
    searchInput.value = '';
    searchInput.focus();
    target.closest('.searchbox-clear').classList.add('hidden');
    await buildSearchSuggestions(searchbox);
  });
  searchInput.addEventListener('input', handleSearchInput);
  searchInput.addEventListener('focusin', async () => {
    await buildSearchSuggestions(searchbox);
    searchbox.querySelector('.search-suggestions-wrapper').classList.remove('hidden');
  });
  searchInput.addEventListener('focusout', (e) => {
    setTimeout(() => {
      if (!searchInput.matches(':focus')) {
        e.target.closest('.searchbox').querySelector('.search-suggestions-wrapper').classList.add('hidden');
      }
    }, 200);
  });
  searchInput.addEventListener('keydown', async (e) => {
    const { key } = e;
    const suggestionChildren = Array.from(searchbox.querySelectorAll('.search-suggestions button.suggestion')) || [];
    const suggestionCount = suggestionChildren.length;
    const handleKeyNavigation = () => {
      searchInput.value = suggestionChildren[selectedSuggestionIndex].querySelector('span.search-suggestion-text').innerText;
      setTimeout(() => {
        searchInput.selectionStart = searchInput.value.length;
        searchInput.selectionEnd = searchInput.value.length;
        handleSearchClear(searchbox, searchInput);
      }, 100);
      suggestionChildren.forEach((suggestionItem, idx) => {
        suggestionItem.classList.toggle('selected', idx === selectedSuggestionIndex);
      });
      const actionCause = suggestionChildren[selectedSuggestionIndex].getAttribute('data-suggestion-type') === 'recent'
        ? 'searchFromLink' : 'omniboxFromLink';
      searchInput.setAttribute('data-action-cause', actionCause);
    };
    if (key === 'Enter') {
      await submitSearchQuery(searchInput);
    } else if (e.key === 'ArrowUp') {
      selectedSuggestionIndex = selectedSuggestionIndex > 0
        ? selectedSuggestionIndex - 1
        : suggestionCount - 1;
      handleKeyNavigation();
    } else if (e.key === 'ArrowDown') {
      selectedSuggestionIndex = selectedSuggestionIndex < suggestionCount - 1
        ? selectedSuggestionIndex + 1
        : 0;
      handleKeyNavigation();
    }
  });
  searchBlock.querySelector('.searchbox .search-enter-button').addEventListener('click', async () => {
    await submitSearchQuery(searchInput);
  });
}

function getSearchInput() {
  const inputWrapper = div(
    {
      class: 'w-full relative flex bg-gray-50 border border-gray-600 rounded-lg focus-within:ring focus-within:border-primary focus-within:ring-ring-primary',
    },
    div(
      {
        class: 'grow flex items-center',
      },
      input({
        type: 'text',
        placeholder: 'Search',
        class: 'h-full outline-none bg-transparent w-full grow px-4 py-3.5 text-lg',
        title: 'Search field with suggestions. Suggestions may be available under this field. To send, press Enter.',
      }),
    ),
    div(
      { class: 'py-2' },
      button(
        {
          class: 'hidden searchbox-clear shrink-0 transparent w-8 h-8 fill-danahergrey-900 hover:fill-cyan-600',
          'aria-label': 'Clear',
        },
        div({ class: 'w-3 h-3 mx-auto search-clear-icon' }),
      ),
    ),
    div(
      { class: 'p-2' },
      button(
        {
          class: 'search-enter-button btn-primary-purple flex items-center justify-center w-9 h-full rounded-md -my-px -mr-px shrink-0',
          title: 'Search field with suggestions. Suggestions may be available under this field. To send, press Enter.',
          'aria-label': 'Search',
        },
        span({ class: 'w-4 h-4 searchbox-icon', style: 'filter: brightness(0) invert(1);' }),
      ),
    ),
  );
  inputWrapper.querySelector('span.searchbox-icon').innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="m6.4 0c3.5 0 6.4 2.9 6.4 6.4 0 1.4-.4 2.7-1.2 3.7l4 4c.4.4.4 1 .1 1.5l-.1.1c-.2.2-.5.3-.8.3s-.6-.1-.8-.3l-4-4c-1 .7-2.3 1.2-3.7 1.2-3.4-.1-6.3-3-6.3-6.5s2.9-6.4 6.4-6.4zm0 2.1c-2.3 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3z"></path>
    </svg>
  `;
  inputWrapper.querySelector('.searchbox-clear .search-clear-icon').innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="w-3 h-3">
      <path d="m18 2-1.8-2-7.1 7.1-7.1-7.1-2 2 7.1 7.1-7.1 7.1 2 1.8 7.1-6.9 7.1 6.9 1.8-1.8-6.9-7.1z"></path>
    </svg>
  `;

  const searchSuggestionsWrapper = div(
    {
      class: 'search-suggestions-wrapper hidden flex w-full z-10 absolute left-0 top-full rounded-md bg-white border',
    },
    div({
      class: 'search-suggestions flex flex-grow basis-1/2 flex-col',
    }),
  );
  const searchbox = div(
    { class: 'searchbox relative flex-grow' },
    inputWrapper,
    searchSuggestionsWrapper,
  );

  return searchbox;
}

function showFlyoutMenu() {
  document.querySelector('#menu-flyout')?.classList.remove('hidden');
}

function hideFlyoutMenu() {
  document.querySelector('#menu-flyout')?.classList.add('hidden');
}

function sortFlyoutMenus(menuPath) {
  const menuList = document.querySelector('#menu-flyout ul');
  const heading = menuPath.split('|');
  if (heading) document.querySelector('#menu-flyout h4').textContent = heading[heading.length - 1];
  [...menuList.children].forEach((menu) => {
    if (menu.getAttribute('data-content') !== menuPath && menu.getAttribute('data-content') !== menuPath) {
      menu.classList.add('hidden');
    } else {
      menu.classList.remove('hidden');
      const href = menu.getAttribute('data-href');
      const backFlyout = document.querySelector('#back-flyout');
      const exploreFlyout = document.querySelector('#explore-flyout');
      const redirectLink = menu.getAttribute('data-content').split('|').slice(0, -1).join('|');
      if (redirectLink) {
        backFlyout.setAttribute('data-redirect', redirectLink);
        backFlyout.classList.remove('hidden');
      } else backFlyout.classList.add('hidden');
      if (href) {
        exploreFlyout.setAttribute('href', href);
        exploreFlyout.classList.remove('hidden');
      } else exploreFlyout.classList.add('hidden');
    }
  });
}

function buildLogosBlock(headerBlock) {
  const logoHtmlBlock = headerBlock.children[0];
  logoHtmlBlock.className = 'bg-danahergray-150 hidden lg:block';
  const logoUl = logoHtmlBlock.querySelector('ul');
  logoUl.className = 'h-14 flex justify-center';
  const logoLis = logoUl.querySelectorAll(':scope > li');
  logoLis.forEach((logoLi) => {
    logoLi.className = 'group md:mx-5 mx-10';
    const logoLink = logoLi.querySelector(':scope > a');
    const logoPicture = logoLi.querySelector(':scope > picture');
    const logoImg = logoPicture.querySelector('img');
    logoImg.className = 'h-7 w-auto px-4';
    const logoTitle = logoLink.textContent;
    logoImg.setAttribute('alt', logoTitle);
    logoImg.setAttribute('style', 'filter: brightness(0) invert(1);');
    logoLink.textContent = '';
    logoLink.className = 'h-full flex items-center group-hover:bg-danahergray-200';
    logoLink.append(logoPicture);
    logoLi.innerHTML = '';
    logoLi.append(logoLink);
  });
}

function buildSearchBlockMobile() {
  const searchBlockMobile = div(
    { class: 'mobile-search w-full bg-black py-4 hidden' },
    div(
      { class: 'flex items-center gap-2 md:block mx-6 lg:my-4' },
      getSearchInput(),
      div({ class: 'close', onclick: toggleSearchBoxMobile }),
    ),
  );
  searchBlockMobile.querySelector('div.close').innerHTML = `
    <svg data-v-7a6a1796="" class="w-8 h-8 md:hidden" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
      <path data-v-7a6a1796="" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
    </svg>
  `;
  addEventToSearchInput(searchBlockMobile);
  return searchBlockMobile;
}

function buildLoginBlock(loginLink) {
  loginLink.className = 'text-black hover:text-black relative lg:inline-flex text-xs font-semibold';
  const loginIcon = loginLink.querySelector('span');
  loginIcon.className = '';
  loginIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 rounded-full">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
    </svg>
  `;
  const loginSpan = span({ class: 'w-12 pl-2 lg:block hidden lg:inline' }, loginLink.textContent);
  loginLink.setAttribute('aria-label', loginLink.textContent.trim());
  loginLink.textContent = '';
  loginLink.append(loginIcon);
  loginLink.append(loginSpan);
}

function buildLoggedInUserBlock(loginLink, user) {
  loginLink.className = 'relative flex items-center justify-between h-15 w-15';
  loginLink.href = '/us/en/signin/dashboard.html';
  const loginUser = span({ class: 'w-12 h-12 p-2 mb-2 overflow-hidden border rounded-full bg-danaherlightblue-500' }, span(shortName(user)));
  const loginSpan = span({ class: 'pl-1 text-xs font-semibold text-black' }, 'My Account');
  loginLink.setAttribute('aria-label', 'My Account');
  loginLink.textContent = '';
  loginLink.append(loginUser);
  loginLink.append(loginSpan);
}

function buildSearchBlock(headerBlock) {
  const searchHtmlBlock = headerBlock.children[1];
  searchHtmlBlock.className = 'navbar-wrapper bg-white z-50 py-2 md:py-4 lg:pt-4 lg:pb-1 mb-[2px] space-y-2 shadow-sm';
  searchHtmlBlock.id = 'sticky-header';
  const searchHtmlBlockInner = div({ class: 'w-full flex flex-row flex-wrap justify-between' });
  const searchNewBlock = div({ class: 'bg-white flex items-center mx-auto max-w-7xl flex-row lg:px-8' });
  const extendedSectionBlock = div({ class: 'extended-section md:w-full grid grid-rows-1 lg:grid-rows-2 ml-auto md:ml-14 mr-2 md:mr-4' });
  extendedSectionBlock.id = 'extended-section';

  // danaher logo
  const logoPictureBlock = searchHtmlBlock.querySelector(':scope > p > picture');
  const logoLinkBlock = searchHtmlBlock.querySelector(':scope > p > a');
  logoPictureBlock.setAttribute('alt', logoLinkBlock.textContent);
  if (window.location.pathname === '/') logoLinkBlock.href = 'https://danaher.com/?utm_source=dhls_website&utm_medium=referral&utm_content=header';
  const logoImg = logoPictureBlock.querySelector('img');
  logoImg.className = 'brand-logo max-w-full w-14 md:w-20 lg:w-44 h-full object-contain';
  logoLinkBlock.className = 'ml-2 mb-2';
  logoLinkBlock.innerHTML = '';
  logoLinkBlock.append(logoPictureBlock);

  const hamburgerIcon = button({
    id: 'nav-hamburger',
    type: 'button',
    class: 'open-side-menu block lg:hidden btn btn-sm h-full my-auto bg-transparent hover:bg-transparent text-danaherpurple-500 hover:text-danaherpurple-800',
    'aria-label': 'Menu',
    'aria-expanded': false,
    'aria-controls': 'mega-menu-icons',
    'data-collapse-toggle': 'mega-menu-icons',
  });
  hamburgerIcon.innerHTML = '<svg xmlns=\'http://www.w3.org/2000/svg\' aria-hidden=\'true\' viewBox=\'0 0 24 24\' fill=\'currentColor\' class=\'w-8 h-8\'><path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75zM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75z" clip-rule="evenodd"/></svg>';

  searchNewBlock.append(hamburgerIcon);
  searchNewBlock.append(logoLinkBlock);

  // log in
  const loginBlock = div({ class: 'flex flex-row justify-end items-center gap-5 order-none md:order-last pr-3' });
  // const loginBlockInner = div({ class: 'flex flex-row items-center
  // lg:justify-start justify-end gap-2', id: 'login-block' });
  const searchLinks = searchHtmlBlock.querySelectorAll(':scope > ul > li > a');
  const loginLink = searchLinks[0];

  const user = getUser();
  if (user) buildLoggedInUserBlock(loginLink, user);
  else buildLoginBlock(loginLink);

  // quote
  const quoteLink = searchLinks[1];
  quoteLink.className = 'quote text-black hover:text-black relative lg:inline-flex text-xs font-semibold';
  const quoteIcon = quoteLink.querySelector('span');
  quoteIcon.className = '';
  quoteIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 rounded-full">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
    </svg>
  `;
  const quoteSpan = span({ class: 'w-12 pl-2 lg:block hidden lg:inline' }, quoteLink.textContent);
  const quoteCount = span({ class: 'quantity absolute lg:pl-2 top-4 left-6 text-danaherpurple-500' }, 0);
  const quoteDot = span(
    { class: 'dot hidden absolute top-0 flex w-2 h-2 ml-1 left-4' },
    span({ class: 'absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-danaherorange-500' }),
    span({ class: 'relative inline-flex w-2 h-2 rounded-full bg-danaherpurple-500' }),
  );

  quoteLink.textContent = '';
  quoteLink.append(quoteIcon);
  quoteLink.append(quoteSpan);
  quoteLink.append(quoteCount);
  quoteLink.append(quoteDot);
  const searchIcon = div({ class: 'search-icon md:hidden' });
  searchIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="text-black" aria-hidden="true" class="h-6 w-6">
      <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd"></path>
    </svg>
  `;
  loginBlock.append(searchIcon);
  loginBlock.append(loginLink);
  loginBlock.append(quoteLink);
  // loginBlock.append(loginBlockInner);
  searchHtmlBlockInner.append(loginBlock);

  // search box
  searchHtmlBlockInner.append(div(
    { class: 'hidden md:block w-full md:w-3/5 order-last md:order-none' },
    getSearchInput(),
  ));

  // aggregation
  extendedSectionBlock.append(searchHtmlBlockInner);
  searchNewBlock.append(extendedSectionBlock);
  searchHtmlBlock.innerHTML = searchNewBlock.outerHTML;
  searchHtmlBlock.append(buildSearchBlockMobile());
  searchHtmlBlock.querySelector('div.search-icon').addEventListener('click', toggleSearchBoxMobile);
  searchHtmlBlock.querySelector('#nav-hamburger').addEventListener('click', (e) => {
    e.preventDefault();
    showFlyoutMenu('Menu');
  });
  addEventToSearchInput(searchHtmlBlock);
}

function buildNavBlock(headerBlock) {
  const extendedSectionBlock = headerBlock.querySelector('div.extended-section');
  const menuLinks = [];
  [...headerBlock.children].slice(2).forEach((menuItemEl) => {
    menuItemEl.className = menuItemEl.innerHTML ? 'menu-flyout hidden' : '';
    if (menuItemEl.querySelector(':scope > p')?.textContent === 'Menu') {
      menuItemEl.querySelectorAll(':scope > ul > li').forEach((childMenuItem) => {
        menuLinks.push(childMenuItem);
      });
    }
  });
  const navHtmlBlock = div({ class: 'mega-menu-off-scroll hidden lg:flex items-center gap-x-4' });

  // home link
  const homeLink = a({ class: 'hidden lg:flex text-danaherpurple-500 hover:text-danaherpurple-800 lifesciences-logo-link font-semibold', href: '/' }, 'Life Sciences');

  // main nav
  navHtmlBlock.append(homeLink);
  menuLinks.forEach((item) => {
    const menuItemName = item.innerText;
    const expandIcon = item.querySelector('span.icon-arrow-right');
    const menuItemEl = a(
      {
        class: 'btn !bg-transparent !text-black !font-medium !ring-0 !border-0 !ring-offset-0 group relative',
        href: item.querySelector('a')?.href || '#',
      },
      menuItemName,
    );
    if (expandIcon) {
      menuItemEl.innerHTML += `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="chevy h-5 w-5 fill-danaherpurple-500 transition group-hover:rotate-180 ml-1">
        <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd"></path>
      </svg>`;
      menuItemEl.addEventListener('click', (e) => {
        e.preventDefault();
        showFlyoutMenu();
        sortFlyoutMenus(`Menu|${menuItemName}`);
      });
    }
    navHtmlBlock.append(menuItemEl);
  });
  extendedSectionBlock.append(navHtmlBlock);
}

function buildFlyoutMenus(headerBlock) {
  const allFlyout = headerBlock.querySelectorAll('.menu-flyout');
  const closeFlyout = button({ class: 'block ml-auto mx-2 p-1 rounded hover:bg-gray-200/30' });
  closeFlyout.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="w-6 h-6 stroke-2 stroke-gray-500/70"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>';
  closeFlyout.addEventListener('click', hideFlyoutMenu);

  const backFlyout = button({ id: 'back-flyout', class: 'flex items-center gap-x-1 group' });
  backFlyout.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/></svg> Back';
  backFlyout.addEventListener('click', () => sortFlyoutMenus(backFlyout.getAttribute('data-redirect')));

  const exploreFlyout = a({ id: 'explore-flyout', class: 'flex items-center gap-x-1 group', href: '#' });
  exploreFlyout.innerHTML = 'Explore all <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current transition-transform group-hover:-translate-x-0.5" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/></svg>';

  const navigateActions = div(
    { class: 'flex justify-between text-base text-danaherpurple-500 font-bold mx-2' },
    backFlyout,
    exploreFlyout,
  );

  const menuWrapper = ul({ class: 'flex flex-col gap-y-2 mt-3 [&>li.active]:bg-danaherpurple-50 [&>li.active]:font-bold' });
  [...allFlyout].forEach((flyMenu) => {
    const contentText = flyMenu.children[0]?.textContent;
    const anchorHref = flyMenu.children[0].querySelector('a')?.href;

    [...flyMenu.children[1].children].map((flyMenuChild) => {
      const contextPath = `${contentText}|${flyMenuChild.textContent}`;
      const liTag = li(
        {
          class: 'inline-flex justify-between items-center hover:bg-danaherpurple-50 font-extralight text-base hover:font-bold tracking-wider px-2 py-1 select-none cursor-pointer [&>a]:w-full transition group',
          'data-content': contentText,
          ...(anchorHref && { 'data-href': anchorHref }),
        },
      );
      if (flyMenuChild.querySelector('span.icon')) {
        liTag.setAttribute('data-redirect', contextPath);
        liTag.innerHTML += `${flyMenuChild.textContent} <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-danaherpurple-500 shrink-0 group-hover:fill-black group-hover:-translate-x-0.5" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/></svg>`;
        liTag.addEventListener('click', () => sortFlyoutMenus(contextPath));
      } else liTag.append(a({ href: flyMenuChild.querySelector('a')?.href }, flyMenuChild.textContent));
      menuWrapper.append(liTag);
      return flyMenuChild;
    });
    flyMenu.outerHTML = '';
  });

  const flyout = div(
    {
      id: 'menu-flyout',
      class: 'w-full hidden fixed top-0 left-0 z-40 h-screen transition-all ease-out backdrop-brightness-50',
    },
    div(
      { class: 'min-w-[320px] max-w-sm fixed h-full bg-white overflow-auto px-3 py-4 ease-out transition-all' },
      closeFlyout,
      h4({ class: 'text-2xl font-normal text-gray-900 mt-0 mx-2 mb-2' }, 'Flyout Menu Heading'),
      navigateActions,
      div({ class: 'border-b border-black pt-1 pb-2 mx-2' }),
      menuWrapper,
    ),
  );
  flyout.addEventListener('click', (event) => {
    if (event.target.id === 'menu-flyout') hideFlyoutMenu();
  });
  return flyout;
}

function handleScroll() {
  if (window.scrollY >= 95) {
    document.getElementById('sticky-header').classList.add('remove-descedents', 'fixed', 'inset-x-0', 'top-0', 'w-full', 'lg:!pb-4', 'shadow-lg');
    document.getElementById('sticky-header').firstElementChild.classList.add('bg-white');
  } else if (window.scrollY < 95) {
    document.getElementById('sticky-header').classList.remove('remove-descedents', 'fixed', 'inset-x-0', 'top-0', 'w-full', 'lg:!pb-4', 'shadow-lg');
    document.getElementById('sticky-header').firstElementChild.classList.remove('bg-danaherblue-600');
  }
}

async function getQuote(headerBlock, authHeader) {
  const quoteRequest = await fetch(`${baseURL}/rfqcart/-`, { headers: authHeader });
  if (quoteRequest.ok) {
    const data = await quoteRequest.json();
    if (data && data.items) {
      const rfqQuantity = data.items.length;
      if (rfqQuantity !== 0) {
        const quantityElement = headerBlock.querySelector('a.quote span.quantity');
        if (quantityElement) quantityElement.textContent = rfqQuantity;
        const dotElement = headerBlock.querySelector('a.quote span.dot');
        if (dotElement) dotElement.classList.remove('hidden');
      }
    }
  } else if (quoteRequest.status !== 404) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load quote cart');
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const resp = await fetch('/fragments/header/master.plain.html');

  if (resp.ok) {
    const html = await resp.text();

    // build header DOM
    const headerBlock = div({ class: 'nav-container pt-0 pb-0 md:p-0 bg-danaherpurple-800 relative z-20' });
    headerBlock.innerHTML = html;

    buildLogosBlock(headerBlock);
    buildSearchBlock(headerBlock);
    buildNavBlock(headerBlock);
    const flyout = buildFlyoutMenus(headerBlock);

    decorateIcons(headerBlock);

    window.addEventListener('scroll', handleScroll);
    block.innerHTML = '';
    block.append(headerBlock);
    block.append(flyout);

    const authHeader = getAuthorization();
    if (authHeader && (authHeader.has('authentication-token') || authHeader.has('Authorization'))) {
      getQuote(headerBlock, authHeader);
    }
  }

  return block;
}
