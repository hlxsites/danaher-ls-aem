import {
  span, div, nav, a, input, button,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getCookie, getUser, setCookie } from '../../scripts/scripts.js';

const COVEO_SEARCH_HUB = 'DanaherMainSearch';
const COVEO_PIPELINE = 'Danaher Marketplace';
const COVEO_MAX_RECENT_SEARCHES = 3;

const baseURL = window.danaherConfig !== undefined ? window.danaherConfig.intershopDomain + window.danaherConfig.intershopPath : 'https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-';

let selectedSuggestionIndex = -1;
let refresh = false;

function shortName(user) {
  if (user) {
    return `${user.fname[0].toUpperCase()}${user.lname[0].toUpperCase()}`;
  }
  return '';
}

function formatSuggestionString(highlightedText, inputText) {
  return highlightedText.replace(/\[([^\]]+)\]/g, inputText ? '<span class="font-bold">$1</span>' : '$1').replace(/\{([^}]+)\}/g, '$1');
}

function getMenuIdFromPath(menuPath) {
  const menuPathTokens = menuPath.split('|');
  const menuId = menuPathTokens.join('--').toLowerCase().replace(' ', '-');
  return menuId;
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
  searchBox.classList.toggle('hidden');
  if (!searchBox.classList.contains('hidden')) searchBox.querySelector('input').focus();
}

function getCoveoApiPayload(searchValue) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTimestamp = new Date().toISOString();
  const clientId = getCookie('coveo_visitorId');
  const searchHistoryString = localStorage.getItem('__coveo.analytics.history');
  const searchHistory = searchHistoryString ? JSON.parse(searchHistoryString) : [];
  const payload = {
    actionsHistory: searchHistory.map(({ time, value, name }) => ({ time, value, name })),
    analytics: {
      clientId,
      clientTimestamp: userTimestamp,
      documentLocation: window.location.href,
      documentReferrer: document.referrer,
      originContext: 'Search',
    },
    clientId,
    clientTimestamp: userTimestamp,
    originContext: 'Search',
    count: 8,
    locale: 'en',
    pipeline: COVEO_PIPELINE,
    q: searchValue,
    searchHub: COVEO_SEARCH_HUB,
    referrer: document.referrer,
    timezone: userTimeZone,
    visitorId: clientId,
  };
  return payload;
}

async function makeCoveoApiRequest(path, payload = {}) {
  const accessToken = window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchKey
    : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
  const organizationId = window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : 'danahernonproduction1892f3fhz';
  const resp = await fetch(`https://${organizationId}.org.coveo.com${path}?organizationId=${organizationId}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const jsonData = await resp.json();
  return jsonData;
}

async function submitSearchQuery(searchTerm) {
  let searchLocation = 'https://lifesciences.danaher.com/us/en/search.html';
  if (searchTerm) {
    const requestPayload = getCoveoApiPayload(searchTerm);
    requestPayload.analytics.actionCause = 'searchboxSubmit';
    await makeCoveoApiRequest('/rest/search/v2', requestPayload);
    setRecentSearches(searchTerm);
    searchLocation = `${searchLocation}#q=${encodeURIComponent(searchTerm)}`;
  }
  window.location = searchLocation;
}

function buildSearchSuggestion(searchText, suggestionType) {
  const searchSuggestion = button(
    {
      class: 'suggestion flex px-4 min-h-[40px] items-center text-left cursor-pointer hover:bg-danahergray-100',
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
    await submitSearchQuery(searchInput.value);
  });
  return searchSuggestion;
}

async function buildSearchSuggestions(searchbox) {
  selectedSuggestionIndex = -1;
  const inputText = searchbox.querySelector('input').value;
  const requestPayload = getCoveoApiPayload(inputText);
  const suggestionsResponseData = await makeCoveoApiRequest('/rest/search/v2/querySuggest', requestPayload);
  const suggestions = suggestionsResponseData.completions;
  const wrapper = searchbox.querySelector('.search-suggestions-wrapper');
  const searchSuggestions = wrapper.querySelector('.search-suggestions');
  searchSuggestions.innerHTML = '';
  if (!inputText) {
    const recentSearches = getRecentSearches();
    recentSearches.forEach((recentSearch) => searchSuggestions.append(buildSearchSuggestion(recentSearch, 'recent')));
  }
  suggestions.forEach((suggestion) => searchSuggestions.append(
    buildSearchSuggestion(formatSuggestionString(suggestion.highlighted, inputText)),
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
  searchInput.addEventListener('change', handleSearchInput);
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
    const searchValue = searchInput.value;
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
    };
    if (key === 'Enter') {
      await submitSearchQuery(searchValue);
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
    await submitSearchQuery(searchInput.value);
  });
}

function getSearchInput() {
  const inputWrapper = div(
    {
      class: 'flex bg-white w-full border rounded-lg focus-within:ring focus-within:border-primary focus-within:ring-ring-primary relative h-12.5',
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
          class: 'search-enter-button btn-primary flex items-center justify-center w-9 h-full rounded-md -my-px -mr-px shrink-0',
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
    { class: 'searchbox relative' },
    inputWrapper,
    searchSuggestionsWrapper,
  );
  // await buildSearchSuggestions(searchbox);

  return searchbox;
}

function showFlyoutMenu(menuPath) {
  const menuId = getMenuIdFromPath(menuPath);
  const menuEl = document.getElementById(menuId);
  menuEl.classList.remove('hidden');
}

function hideFlyoutMenu(e) {
  e.preventDefault();
  const { target } = e;
  target.closest('.menu-flyout').classList.add('hidden');
}

function buildLogosBlock(headerBlock) {
  const logoHtmlBlock = headerBlock.children[0];
  logoHtmlBlock.className = 'bg-danaherblue-900 hidden lg:block';
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
    logoPicture.setAttribute('style', 'filter: brightness(0) invert(1);');
    logoLink.textContent = '';
    logoLink.className = 'h-full flex items-center group-hover:bg-danaherblue-700';
    logoLink.append(logoPicture);
    logoLi.innerHTML = '';
    logoLi.append(logoLink);
  });
}

function buildLoginBlock(loginLink) {
  loginLink.className = 'text-white hover:text-white relative lg:inline-flex text-xs pr-3 font-semibold';
  const loginIcon = loginLink.querySelector('span');
  loginIcon.className = '';
  loginIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-white rounded-full">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
    </svg>
  `;
  loginIcon.setAttribute('style', 'filter: brightness(0) invert(1);');
  const loginSpan = span({ class: 'w-12 pl-2 lg:block hidden lg:inline' }, loginLink.textContent);
  loginLink.textContent = '';
  loginLink.append(loginIcon);
  loginLink.append(loginSpan);
}

function buildLoggedInUserBlock(loginLink, user) {
  loginLink.className = 'relative flex items-center justify-between h-15 w-15';
  loginLink.href = '/us/en/signin/dashboard.html';
  const loginUser = span({ class: 'w-12 h-12 p-2 mb-2 overflow-hidden border rounded-full bg-danaherlightblue-500' }, span({ class: 'text-white' }, shortName(user)));
  const loginSpan = span({ class: 'pl-1 text-xs font-semibold text-white' }, 'My Account');
  loginLink.textContent = '';
  loginLink.append(loginUser);
  loginLink.append(loginSpan);
}

function buildSearchBlock(headerBlock) {
  const searchHtmlBlock = headerBlock.children[1];
  searchHtmlBlock.className = 'bg-danaherblue-600 flex-grow';
  const searchHtmlBlockInner = div({ class: 'flex mx-auto items-center max-w-7xl flex-col md:flex-row' });
  const searchNewBlock = div();

  // danaher logo
  const logoBlock = div({ class: 'flex items-center justify-center md:justify-start h-full w-full md:w-1/4' });
  const logoPictureBlock = searchHtmlBlock.querySelector(':scope > p > picture');
  const logoLinkBlock = searchHtmlBlock.querySelector(':scope > p > a');
  logoPictureBlock.setAttribute('alt', logoLinkBlock.textContent);
  logoPictureBlock.querySelector('img').className = 'h-full object-contain py-2 md:pb-1 lg:py-0 pr-6 md:pr-0 md:pl-2 mx-auto lg:ml-4';
  logoPictureBlock.setAttribute('style', 'filter: brightness(0) invert(1);');
  logoLinkBlock.className = 'w-44 md:w-32 lg:w-44 lg:h-8 md:rounded-bl-lg md:pb-2 lg:pb-0 bg-danaherblue-600';
  logoLinkBlock.innerHTML = '';
  logoLinkBlock.append(logoPictureBlock);
  const titleLinkBlock = div(
    { class: 'w-full overflow-hidden hidden md:block lg:hidden pr-6' },
    a({ class: 'h-full flex pl-2 py-2 items-center text-sm text-white overflow-hidden', href: '/' }, 'Life Sciences'),
  );
  const logoGroupBlock = div(
    { class: 'flex flex-col lg:py-0 mx-auto md:mx-0 bg-danaherblue-900 lg:bg-danaherblue-600' },
    logoLinkBlock,
    titleLinkBlock,
  );
  const hamburgerIcon = div({ id: 'nav-hamburger', class: 'md:bg-danaherblue-900 md:py-6 h-full lg:hidden h-full px-2 my-auto !ring-0 !ring-offset-0 cursor-pointer sticky' });
  hamburgerIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-8 w-8 text-danaherlightblue-500 hover:text-danaherlightblue-50">
      <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75zM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75z" clip-rule="evenodd"/>
    </svg>
  `;
  logoBlock.append(hamburgerIcon);
  logoBlock.append(logoGroupBlock);
  searchHtmlBlockInner.append(logoBlock);

  // log in
  const loginBlock = div({ class: 'f-col w-full md:w-1/4 my-auto order-last md:ml-auto md:mr-2 h-full md:justify-end' });
  const loginBlockInner = div({ class: 'flex flex-row items-center justify-end md:h-20 gap-2' });
  const searchLinks = searchHtmlBlock.querySelectorAll(':scope > ul > li > a');
  const loginLink = searchLinks[0];

  const user = getUser();
  if (user) {
    buildLoggedInUserBlock(loginLink, user);
  } else {
    buildLoginBlock(loginLink);
  }

  // quote
  const quoteLink = searchLinks[1];
  quoteLink.className = 'quote text-white hover:text-white relative lg:inline-flex text-xs pr-3 font-semibold';
  const quoteIcon = quoteLink.querySelector('span');
  quoteIcon.className = '';
  quoteIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-white rounded-full">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
    </svg>
  `;
  quoteIcon.setAttribute('style', 'filter: brightness(0) invert(1);');
  const quoteSpan = span({ class: 'w-12 pl-2 lg:block hidden lg:inline' }, quoteLink.textContent);
  const quoteCount = span({ class: 'quantity absolute top-4 left-6 text-lightblue-500' }, 0);
  const quoteDot = span(
    { class: 'dot hidden absolute top-0 flex w-2 h-2 ml-1 left-4' },
    span({ class: 'absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-danaherorange-500' }),
    span({ class: 'relative inline-flex w-2 h-2 rounded-full bg-danaherorange-600' }),
  );

  quoteLink.textContent = '';
  quoteLink.append(quoteIcon);
  quoteLink.append(quoteSpan);
  quoteLink.append(quoteCount);
  quoteLink.append(quoteDot);
  const searchIcon = div({ class: 'search-icon pr-3 md:hidden' });
  searchIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-6 w-6 text-white">
      <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd"></path>
    </svg>
  `;
  const mobileHomeLink = a({
    class: 'h-full flex block md:hidden bg-danaherblue-900 py-2.5 px-3 items-center text-base text-white rounded-tr-xl overflow-hidden mr-auto',
    href: '/',
  }, 'Life Sciences');
  loginBlockInner.append(mobileHomeLink);
  loginBlockInner.append(searchIcon);
  loginBlockInner.append(loginLink);
  loginBlockInner.append(quoteLink);
  loginBlock.append(loginBlockInner);
  searchHtmlBlockInner.append(loginBlock);

  // search box
  searchHtmlBlockInner.append(div(
    { class: 'hidden md:block md:w-1/2 pl-0 md:pl-12 lg:pl-0 lg:pr-12' },
    getSearchInput(),
  ));

  // aggregation
  searchNewBlock.append(searchHtmlBlockInner);
  searchHtmlBlock.innerHTML = searchNewBlock.innerHTML;
  searchHtmlBlock.querySelector('.search-icon').addEventListener('click', toggleSearchBoxMobile);
  searchHtmlBlock.querySelector('#nav-hamburger').addEventListener('click', (e) => {
    e.preventDefault();
    showFlyoutMenu('Menu');
  });
  addEventToSearchInput(searchHtmlBlock);
}

function buildNavBlock(headerBlock) {
  const menuLinks = [];
  [...headerBlock.children].slice(2).forEach((menuItemEl) => {
    menuItemEl.className = menuItemEl.innerHTML ? 'menu-flyout hidden' : '';
    if (menuItemEl.querySelector(':scope > p')?.textContent === 'Menu') {
      menuItemEl.querySelectorAll(':scope > ul > li').forEach((childMenuItem) => {
        menuLinks.push(childMenuItem);
      });
    }
  });
  const navHtmlBlock = div({ class: 'bg-danaherblue-600 hidden lg:block' });

  // home link
  const homeLink = a({ class: 'flex items-center !text-white text-lg hover:text-white', href: '/' }, 'Life Sciences');
  const homeLinkImg = span({ class: 'inline-block w-5 ml-2', style: 'filter: brightness(0) invert(0.5);' });
  homeLinkImg.className = 'inline-block w-5 ml-2';
  homeLinkImg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="inline-block h-5 w-5 ml-3 text-gray-500">
      <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69z"/>
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.43z"/>
    </svg>
  `;
  homeLink.append(homeLinkImg);

  // main nav
  const navWrapper = div({ class: 'megamenu mx-auto max-w-7xl bg-danaherblue-600' });
  const pageNav = nav({ class: 'flex content-start' });
  pageNav.append(
    div(
      { class: 'flex-none flex-grow-0 ml-1 mr-14 lg:flex lg:pl-8 xl:pl-4 items-center' },
      homeLink,
    ),
  );
  menuLinks.forEach((item) => {
    const menuItemName = item.innerText;
    const expandIcon = item.querySelector('span.icon-arrow-right');
    const menuItemEl = div(
      { class: 'py-4 space-x-4 hoverable' },
      a(
        {
          class: 'btn !bg-transparent !text-white !font-medium !ring-0 !border-0 !ring-offset-0 group relative',
          href: item.querySelector('a')?.href || '#',
        },
        span(menuItemName),
        expandIcon ? span({ class: 'up hidden group-hover:block' }) : '',
        expandIcon ? span({ class: 'down group-hover:hidden' }) : '',
      ),
    );
    if (expandIcon) {
      menuItemEl.querySelector('.up').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3BC7E5" aria-hidden="true" class="chevy h-5 w-5 transition">
          <path fill-rule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5z" clip-rule="evenodd"/>
        </svg>`;
      menuItemEl.querySelector('.down').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="chevy h-5 w-5 transition">
          <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clip-rule="evenodd"></path>
        </svg>`;
      menuItemEl.querySelector('a.btn').addEventListener('click', (e) => {
        e.preventDefault();
        showFlyoutMenu(`Menu|${menuItemName}`);
      });
    }
    pageNav.append(menuItemEl);
  });
  navWrapper.append(pageNav);
  navHtmlBlock.append(navWrapper);
  headerBlock.append(navHtmlBlock);
}

function buildSearchBlockMobile(headerBlock) {
  const searchBlockMobile = div(
    { class: 'mobile-search hidden justify-center w-full bg-danaherblue-900 py-4' },
    div(
      { class: 'flex items-center gap-2 md:block mx-6 lg:my-4' },
      getSearchInput(),
      div({ class: 'close', onclick: toggleSearchBoxMobile }),
    ),
  );
  searchBlockMobile.querySelector('div.close').innerHTML = `
    <svg class="w-8 h-8 text-white md:hidden" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
    </svg>
  `;
  addEventToSearchInput(searchBlockMobile);
  headerBlock.append(searchBlockMobile);
}

function buildFlyoutMenus(headerBlock) {
  headerBlock.querySelectorAll('.menu-flyout').forEach((menuItemEl) => {
    menuItemEl.className = 'menu-flyout hidden flex fixed top-0 left-0 h-screen space-y-5 text-white duration-1000 ease-out transition-all w-full backdrop-brightness-50 z-50';
    const menuPath = menuItemEl.querySelector(':scope > p').textContent;
    const menuPathTokens = menuPath.split('|');
    menuItemEl.id = getMenuIdFromPath(menuPath);
    const menuTitle = menuPathTokens[menuPathTokens.length - 1];
    const linkList = menuItemEl.querySelector(':scope > ul');
    linkList.className = 'space-y-1';
    linkList.querySelectorAll(':scope > li').forEach((linkItem) => {
      linkItem.className = '';
      const linkItemName = linkItem.innerText;
      const linkItemArrowRight = linkItem.querySelector('span.icon-arrow-right');

      if (linkItemArrowRight) {
        const arrowRight = span({ class: 'icon-arrow-right inline-block' });
        arrowRight.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-3 h-3">
            <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd"></path>
          </svg>
        `;
        linkItem.innerHTML = '';
        linkItem.append(a(
          {
            href: '#',
            onclick: (e) => {
              e.preventDefault();
              hideFlyoutMenu(e);
              showFlyoutMenu(`${menuPath}|${linkItemName}`);
            },
          },
          span(linkItemName),
          arrowRight,
        ));
      }
      linkItem.querySelector('a').className = 'flex items-center justify-between w-72 menu-link rounded-md p-2 text-base leading-6';
    });
    const flyoutBlock = div(
      { class: 'grid grid-flow-col grid-cols-1 fixed h-full justify-evenly duration-300 ease-out transition-all' },
      div(
        { class: 'bg-white text-black overflow-auto space-y-3 max-w-sm' },
        div(
          { class: 'flex items-center justify-between px-3 mt-2' },
          a({
            class: 'back-button',
            href: '#',
            onclick: (e) => {
              e.preventDefault();
              hideFlyoutMenu(e);
              showFlyoutMenu(menuPathTokens.slice(0, menuPathTokens.length - 1).join('|'));
            },
          }),
          a({
            class: 'close-button ml-auto text-3xl text-gray-500',
            href: '#',
            onclick: hideFlyoutMenu,
          }, '×'),
        ),
        div(
          { class: 'flex flex-col px-3 secCol' },
          div(
            { class: 'inline-flex justify-between items-center mb-2' },
            span({ class: 'text-left text-xl font-bold py-2 pl-1 text-gray-900 w-1/2' }, menuTitle),
            menuItemEl.querySelector(':scope > p > a')
              ? a({ class: 'btn btn-info', href: menuItemEl.querySelector(':scope > p > a').href }, 'Explore All') : '',
          ),
          linkList,
        ),
      ),
    );
    flyoutBlock.querySelector('a.back-button').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="chevy w-5 h-5">
        <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd"></path>
      </svg>
    `;
    menuItemEl.innerHTML = '';
    menuItemEl.append(flyoutBlock);
    if (menuTitle === 'Menu') {
      menuItemEl.querySelector('a.back-button').classList.add('hidden');
    }
  });
}

async function getQuote(headerBlock) {
  // get the user login state

  const reqHeaders = new Headers();
  if (localStorage.getItem('authToken')) {
    reqHeaders.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
  } else if (getCookie('ProfileData')) {
    const { customerToken } = getCookie('ProfileData');
    reqHeaders.append('authentication-token', customerToken);
  } else if (getCookie('apiToken')) {
    const apiToken = getCookie('apiToken');
    reqHeaders.append('authentication-token', apiToken);
  } else if (!refresh) {
    refresh = true;
    const formData = 'grant_type=anonymous&scope=openid+profile&client_id=';
    const authRequest = await fetch(`${baseURL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (authRequest.ok) {
      const data = await authRequest.json();
      const expiresIn = data.expires_in * 1000;
      setCookie('apiToken', data.access_token, expiresIn, '/');
      reqHeaders.append('authentication-token', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    }
  }

  if (reqHeaders.has('authentication-token') || reqHeaders.has('Authorization')) {
    const quoteRequest = await fetch(`${baseURL}/rfqcart/-`, { headers: reqHeaders });
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
    const headerBlock = div({ class: 'px-2 pt-2 md:p-0 bg-danaherblue-600 relative z-20' });
    headerBlock.innerHTML = html;

    buildLogosBlock(headerBlock);
    buildSearchBlock(headerBlock);
    buildNavBlock(headerBlock);
    buildSearchBlockMobile(headerBlock);
    buildFlyoutMenus(headerBlock);

    decorateIcons(headerBlock);
    block.append(headerBlock);

    getQuote(headerBlock);
  }

  return block;
}
