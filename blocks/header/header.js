import {
  span, div, a, input, button, h3, h4, ul, li, p, h1,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  getAuthorization, getCommerceBase, isLoggedInUser,
  makeCoveoApiRequest,
} from '../../scripts/commerce.js';
import { createRequest, debounce, getCookie } from '../../scripts/scripts.js';
import {
  facetSelect,
  finishType,
  suggestions,
} from './coveo-body-requests.js';

let payload = { ...finishType };
const facetsCollection = {};
let searchString = '';

const baseURL = getCommerceBase();

const COVEO_SEARCH_HUB = 'DanaherMainSearch';
const COVEO_PIPELINE = 'Danaher Marketplace';
const COVEO_MAX_RECENT_SEARCHES = 3;

const organizationId = window.DanaherConfig.searchOrg;
const bearerToken = window.DanaherConfig.searchKey;

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
  searchBox.closest('.navbar-wrapper')?.classList.toggle('pb-0');
  if (!searchBox.classList.contains('show')) searchBox.querySelector('input').focus();
}

function getCoveoApiPayload(searchValue, type) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTimestamp = new Date().toISOString();
  const clientId = getCookie('coveo_visitorId');
  const searchHistoryString = localStorage.getItem('__coveo.analytics.history');
  const searchHistory = searchHistoryString ? JSON.parse(searchHistoryString) : [];
  const coveoPayload = {
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
    // eslint-disable-next-line max-len
    coveoPayload.actionsHistory = searchHistory.map(({ time, value, name }) => ({ time, value, name }));
    coveoPayload.clientId = clientId;
    coveoPayload.clientTimestamp = userTimestamp;
    coveoPayload.originContext = 'Search';
    coveoPayload.count = 8;
    coveoPayload.referrer = document.referrer;
  }
  return coveoPayload;
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
}

function addEventToSearchInput(searchBlock) {
  const searchbox = searchBlock.querySelector('.searchbox');
  const searchInput = searchbox.querySelector('input');
  searchInput.addEventListener('input', handleSearchInput);
  searchInput.addEventListener('focusin', async () => {
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
  const coveoSearch = div(
    {
      class: 'grow flex items-center',
    },
    input({
      type: 'text',
      placeholder: 'Search',
      id: 'search-by-coveo',
      class: 'h-full outline-none bg-transparent w-full grow px-4 py-3.5 text-lg',
      title: 'Search field with suggestions. Suggestions may be available under this field. To send, press Enter.',
    }),
  );
  const inputWrapper = div(
    {
      class: 'w-full relative flex bg-gray-50 border border-gray-600 rounded-lg focus-within:ring focus-within:border-primary focus-within:ring-ring-primary',
    },
    coveoSearch,
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
    { class: 'mobile-search w-full bg-black py-4 hidden md:hidden' },
    div(
      { class: 'flex items-center gap-2 md:block mx-6 lg:my-4' },
      getSearchInput(),
      div({ class: 'close', onclick: toggleSearchBoxMobile }, span({ class: 'icon icon-close [&_svg]:stroke-white' })),
    ),
  );
  addEventToSearchInput(searchBlockMobile);
  return searchBlockMobile;
}

function buildLoginBlock(loginLink) {
  loginLink.className = 'text-black hover:text-black relative lg:inline-flex text-xs font-semibold';
  const loginIcon = loginLink.querySelector('span');
  loginIcon.className = '';
  loginIcon.append(span({ class: 'icon icon-user [&_svg]:w-7 [&_svg]:h-7' }));
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

  const hamburgerIcon = button(
    {
      id: 'nav-hamburger',
      type: 'button',
      class: 'open-side-menu block lg:hidden btn btn-sm h-full my-auto bg-transparent hover:bg-transparent text-danaherpurple-500 hover:text-danaherpurple-800',
      'aria-label': 'Menu',
      'aria-expanded': false,
      'aria-controls': 'mega-menu-icons',
      'data-collapse-toggle': 'mega-menu-icons',
    },
    span({ class: 'icon icon-dam-Menu w-8 h-8 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800' }),
  );

  searchNewBlock.append(hamburgerIcon);
  searchNewBlock.append(logoLinkBlock);

  // log in
  const loginBlock = div({ class: 'flex flex-row justify-end items-center gap-5 order-none md:order-last pr-3' });
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
  const searchIcon = div({ class: 'search-icon md:hidden cursor-pointer' }, span({ class: 'icon icon-search w-6 h-6 flex [&_svg>use]:stroke-black' }));
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
  searchHtmlBlock.querySelector('#nav-hamburger').addEventListener('click', (e) => {
    e.preventDefault();
    showFlyoutMenu();
    sortFlyoutMenus('Menu');
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
        class: 'btn relative bg-transparent hover:bg-transparent text-black font-medium ring-0 border-0 ring-offset-0 group',
        href: item.querySelector('a')?.href || '#',
      },
      menuItemName,
    );
    if (expandIcon) {
      menuItemEl.append(span({ class: 'icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 transition group-hover:rotate-180 ml-1' }));
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
  const closeFlyout = button({ class: 'flex ml-auto mx-2 p-1 rounded hover:bg-gray-200/30' }, span({ class: 'icon icon-x w-6 h-6 [&_svg>use]:stroke-2 [&_svg>use]:stroke-gray-500/70' }));
  closeFlyout.addEventListener('click', hideFlyoutMenu);

  const backFlyout = button({ id: 'back-flyout', class: 'flex items-center gap-x-1 group' }, span({ class: 'icon icon-arrow-left [&_svg>use]:stroke-danaherpurple-500 w-4 h-4 transition-transform group-hover:translate-x-0.5' }), 'Back');
  backFlyout.addEventListener('click', () => sortFlyoutMenus(backFlyout.getAttribute('data-redirect')));

  const exploreFlyout = a({ id: 'explore-flyout', class: 'flex items-center gap-x-1 group', href: '#' }, 'Explore all', span({ class: 'icon icon-arrow-right [&_svg>use]:stroke-danaherpurple-500 w-4 h-4 transition-transform group-hover:-translate-x-0.5' }));

  const navigateActions = div(
    { class: 'flex justify-between text-base text-danaherpurple-500 font-bold mx-2' },
    backFlyout,
    exploreFlyout,
  );

  decorateIcons(closeFlyout);
  decorateIcons(backFlyout);
  decorateIcons(exploreFlyout);

  const menuWrapper = ul({ class: 'h-full flex flex-col gap-y-2 mt-3 overflow-auto [&>li.active]:bg-danaherpurple-50 [&>li.active]:font-bold' });
  [...allFlyout].forEach((flyMenu) => {
    const contentText = flyMenu.children[0]?.textContent;
    const anchorHref = flyMenu.children[0].querySelector('a')?.href;

    [...flyMenu.children[1].children].map((flyMenuChild) => {
      const contextPath = `${contentText}|${flyMenuChild.textContent}`;
      const liTag = li(
        {
          class: 'inline-flex justify-between items-center hover:bg-danaherpurple-50 font-extralight text-base hover:font-medium tracking-wider px-2 py-2 select-none cursor-pointer [&>a]:w-full transition group',
          'data-content': contentText,
          ...(anchorHref && { 'data-href': anchorHref }),
        },
      );
      if (flyMenuChild.querySelector('span.icon')) {
        liTag.setAttribute('data-redirect', contextPath);
        liTag.innerHTML += flyMenuChild.textContent;
        liTag.append(span({ class: 'icon icon-arrow-right shrink-0 [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-black w-4 h-4 group-hover:-translate-x-0.5' }));
        liTag.addEventListener('click', () => sortFlyoutMenus(contextPath));
      } else liTag.append(a({ href: flyMenuChild.querySelector('a')?.href }, flyMenuChild.textContent));
      decorateIcons(liTag);
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
      { class: 'w-[360px] max-w-sm fixed h-full bg-white px-3 py-4 ease-out transition-all' },
      closeFlyout,
      h4({ class: 'text-2xl font-medium text-gray-900 mt-0 mx-2 mb-2' }, 'Flyout Menu Heading'),
      navigateActions,
      div({ class: 'border-b border-black py-2 mx-2' }),
      menuWrapper,
    ),
  );
  flyout.addEventListener('click', (event) => {
    if (event.target.id === 'menu-flyout') hideFlyoutMenu();
  });
  return flyout;
}

function handleScroll() {
  const stickyHeader = document.getElementById('sticky-header');
  const hamburgerIcon = document.getElementById('nav-hamburger');
  const extendedSection = document.getElementById('extended-section');
  const megaMenus = stickyHeader.querySelector('.mega-menu-off-scroll');
  const brandLogo = stickyHeader.querySelector('.brand-logo');
  if (window.scrollY >= 95) {
    stickyHeader.classList.add('remove-descedents', 'fixed', 'inset-x-0', 'top-0', 'w-full', 'lg:!pb-4', 'shadow-lg');
    stickyHeader.firstElementChild.classList.add('bg-white');
    hamburgerIcon?.classList.remove('lg:hidden');
    hamburgerIcon?.classList.add('lg:block');
    extendedSection?.classList.remove('lg:lg:grid-rows-2');
    extendedSection?.classList.add('lg:lg:grid-rows-1');
    megaMenus?.classList.remove('lg:block');
    megaMenus?.classList.add('lg:hidden');
    brandLogo?.classList.remove('h-full');
    brandLogo?.classList.add('h-10');
  } else if (window.scrollY < 95) {
    stickyHeader.classList.remove('remove-descedents', 'fixed', 'inset-x-0', 'top-0', 'w-full', 'lg:!pb-4', 'shadow-lg');
    stickyHeader.firstElementChild.classList.remove('bg-danaherblue-600');
    hamburgerIcon?.classList.add('lg:hidden');
    hamburgerIcon?.classList.remove('lg:block');
    extendedSection?.classList.remove('lg:lg:grid-rows-1');
    extendedSection?.classList.add('lg:lg:grid-rows-2');
    megaMenus?.classList.remove('lg:hidden');
    megaMenus?.classList.add('lg:block');
    brandLogo?.classList.remove('h-10');
    brandLogo?.classList.add('h-full');
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

async function makeCoveoSearchRequest(url, stringifiedPayload) {
  const request = await createRequest({
    url,
    method: 'POST',
    authToken: bearerToken,
    body: stringifiedPayload,
  });
  // eslint-disable-next-line no-unused-vars
  const response = await request.json();
  return response;
}

function decorateViewResultsURL() {
  const queryParam = new URLSearchParams('');
  if (
    (
      Object.keys(payload).length > 0
      && payload.q && payload.q !== ''
    )
    || Object.keys(facetsCollection).length > 0
  ) {
    if (Object.keys(payload).length > 0 && payload.q && payload.q !== '') {
      queryParam.append('q', encodeURI(payload.q));
    }
    if (Object.keys(facetsCollection).length > 0) {
      Object.keys(facetsCollection).forEach((facetCollectKey) => {
        queryParam.append(`f-${facetCollectKey}`, encodeURI(facetsCollection[facetCollectKey].join(',')));
      });
    }
    const allSearchResultAnchors = document.querySelectorAll('#search-container a');
    const queryParameters = queryParam.toString().replaceAll('25', '').replaceAll('%2C', ',');
    if (allSearchResultAnchors.length > 0) {
      allSearchResultAnchors.forEach((searchResultAnchors) => {
        searchResultAnchors.href = `https://lifesciences.danaher.com/us/en/search.html#${queryParameters}`;
      });
      document.querySelector('#search-container .icon-search').addEventListener('click', () => {
        window.location = `https://lifesciences.danaher.com/us/en/search.html#${queryParameters}`;
      });
    }
  }
}

const facetAction = debounce(async (selected, listType, mode) => {
  const url = `https://${organizationId}.org.coveo.com/rest/search/v2`;
  const query = document.querySelector('#search-input')?.value;
  const payloadJSON = {
    ...payload,
    ...{
      facets: payload?.facets.map((facet) => {
        if (facet.facetId === listType) {
          facet.currentValues.forEach((curFacVal, curFacValIndex) => {
            if (curFacVal.value === selected.value) {
              facet.currentValues[curFacValIndex].state = (mode === 'select') ? 'selected' : 'idle';
            }
          });
        }
        return facet;
      }),
      q: query,
      fieldsToInclude: facetSelect.fieldsToInclude,
      pipeline: facetSelect.pipeline,
      context: facetSelect.context,
      searchHub: facetSelect.searchHub,
      sortCriteria: facetSelect.sortCriteria,
    },
  };
  const { facets, totalCount = 0 } = await makeCoveoSearchRequest(url, JSON.stringify(payloadJSON));
  payload = { ...payload, ...{ q: query, facets: payloadJSON?.facets } };
  // eslint-disable-next-line no-use-before-define
  decorateSearchPopup(facets, totalCount);
}, 100);

function decorateSearchPopup(facets, totalCount) {
  const searchContent = document.querySelector('#search-content');
  searchContent.innerHTML = '';
  if (facets && facets.length > 0) {
    const facetWithContent = facets.filter((facet) => facet.values.length > 0);
    for (
      let facetCategoryIndex = 0;
      facetCategoryIndex < facetWithContent.length;
      facetCategoryIndex += 1
    ) {
      const { values: facetValues, facetId } = facetWithContent[facetCategoryIndex];
      const listType = facetId;
      const facetGroup = div({ class: 'flex flex-col' });
      const facetList = ul({ class: 'flex flex-row flex-wrap md:flex-col gap-x-2 gap-y-3 pl-3 border-l-0 md:border-l border-black' });
      if (facetValues.length > 0) {
        for (let facetIndex = 0; facetIndex < facetValues.length; facetIndex += 1) {
          const searchExistingFacet = listType in facetsCollection
            && facetsCollection[listType].includes(facetValues[facetIndex].value);
          if (
            facetValues[facetIndex].value
            && (!searchExistingFacet)
            && facetValues[facetIndex].numberOfResults
            && facetValues[facetIndex].numberOfResults > 0
          ) {
            const facetElement = li(
              {
                class: 'w-max px-4 py-2 rounded-full select-none bg-danaherpurple-25 hover:bg-danaherpurple-50 text-base leading-5 text-danaherpurple-800 font-normal flex items-center gap-x-2 cursor-pointer',
                title: facetValues[facetIndex].value,
                onclick: () => {
                  facetsCollection[listType] = Object.keys(facetsCollection).length > 0
                    && listType in facetsCollection ? facetsCollection[listType] : [];
                  facetsCollection[listType].push(facetValues[facetIndex].value);
                  facetAction(facetValues[facetIndex], listType, 'select');
                  const searchInput = document.querySelector('#search-input');
                  const selectedFacet = span(
                    {
                      id: `facet-${facetValues[facetIndex].value}`,
                      class: 'flex gap-x-2 pr-[5px] py-[5px] pl-4 text-white bg-danaherpurple-500 rounded-full select-none cursor-pointer facet-selected group',
                      title: facetValues[facetIndex].value,
                      onclick: () => {
                        if (listType in facetsCollection) {
                          if (facetsCollection[listType].length === 0) {
                            delete facetsCollection[listType];
                          } else {
                            // eslint-disable-next-line max-len
                            const facetItemIndex = facetsCollection[listType].indexOf(facetValues[facetIndex].value);
                            facetsCollection[listType].splice(facetItemIndex, 1);
                          }
                        }
                        facetAction(facetValues[facetIndex], listType, 'idle');
                        searchInput.parentElement.removeChild(selectedFacet);
                      },
                    },
                    span(
                      { class: 'max-w-24 truncate' },
                      facetValues[facetIndex].value,
                    ),
                    span({ class: 'icon icon-close w-5 h-5 my-auto p-1 text-black fill-current cursor-pointer bg-danaherpurple-25 group-hover:bg-danaherpurple-25/60 rounded-full [&_svg]:transition-transform [&_svg]:group-hover:scale-110' }),
                  );
                  decorateIcons(selectedFacet);
                  searchInput.parentElement.insertBefore(selectedFacet, searchInput);
                },
              },
              span(
                { class: 'max-w-[7rem] truncate' },
                facetValues[facetIndex].value,
              ),
              span(
                { class: 'text-xs font-normal bg-white text-danaher-purple-800 rounded-full py-1 px-2' },
                facetValues[facetIndex]?.numberOfResults,
              ),
            );
            facetList.append(facetElement);
          }
        }
        if (facetList.children.length > 0) {
          facetGroup.append(h3({ class: 'font-medium text-black text-2xl leading-8 mb-2 pl-3 md:pl-0' }, facetId.replace(/([A-Z])/g, ' $&')));
          facetGroup.append(facetList);
          searchContent.append(facetGroup);
        }
      }
    }
    decorateViewResultsURL();
  }
  document.querySelector('#total-result-count').innerHTML = totalCount;
}

const fetchFinishType = debounce(async (value) => {
  const url = `https://${organizationId}.org.coveo.com/rest/search/v2`;
  let facetContainer = [];
  if (payload.facets) {
    facetContainer = [...payload.facets];
  } else {
    facetContainer = [...finishType.facets];
  }
  const selectedFacets = {
    ...finishType,
    q: value,
    facets: facetContainer,
  };
  // eslint-disable-next-line max-len
  const { facets, totalCount = 0 } = await makeCoveoSearchRequest(url, JSON.stringify(selectedFacets));
  payload = { ...payload, ...{ q: value, facets: facetContainer } };
  // CREATING THE LAYOUT
  decorateSearchPopup(facets, totalCount);
}, 800);

const fetchSuggestions = debounce(async (value) => {
  try {
    const url = `https://${organizationId}.org.coveo.com/rest/search/v2/querySuggest`;
    suggestions.q = value;
    const { completions } = await makeCoveoSearchRequest(url, JSON.stringify(suggestions));
    // CREATING THE LAYOUT
    const suggestionsBox = document.querySelector('#search-suggestions');
    suggestionsBox.innerHTML = '';
    if (completions && completions.length > 0) {
      for (
        let suggestionIndex = 0;
        suggestionIndex < completions.length;
        suggestionIndex += 1
      ) {
        const suggestionRes = completions[suggestionIndex];
        const suggestion = li(
          {
            class: 'flex items-center gap-x-3 px-1 py-1 select-none cursor-pointer hover:bg-gray-600/40',
            onclick: () => {
              document.querySelector('#search-input').value = suggestionRes.expression;
              fetchFinishType(suggestionRes.expression);
              document.querySelector('#search-suggestions').innerHTML = '';
            },
          },
          span({ class: 'icon w-min h-min icon-arrow-up [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-current' }),
          span(suggestionRes.expression),
        );
        suggestionsBox.append(suggestion);
      }
    } else {
      suggestionsBox.append(li({ class: 'text-center' }, 'No Results Found'));
      setTimeout(() => {
        suggestionsBox.innerHTML = '';
      }, 1500);
    }
    decorateIcons(suggestionsBox);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Something happenned during request submission', e);
  }
});

function buildSearchBackdrop(headerBlock) {
  const searchBackdropContainer = div(
    { id: 'search-container', class: 'w-screen h-screen fixed top-0 left-0 bg-white opacity-100 z-50 transition-all -translate-y-full [&_#search-product]:hidden [&_#search-content]:hidden' },
    div(
      {
        id: 'search-product',
        class: 'container mx-auto sm:py-7',
      },
      div(
        { class: 'hidden md:flex justify-between items-center mb-4' },
        h1({ class: 'text-5xl text-black mb-3' }, 'Search'),
        p({ class: 'w-96 ml-28' }, 'Search by keyword phrase, products, or applications across the Life Science Companies of Danaher'),
        p(
          { class: 'flex items-center' },
          'Close',
          span({ id: 'close-search-container', class: 'icon icon-close w-12 h-12 text-black/70 fill-current p-3 mx-auto cursor-pointer' }),
        ),
      ),
      div(
        { class: 'relative' },
        div(
          { class: 'flex flex-col md:flex-row gap-x-2 gap-y-4 px-4 md:px-0' },
          div(
            { class: 'w-full relative sm:border border-b sm:border-solid rounded flex flex-wrap gap-1 py-0 md:py-1 lg:py-2 px-8 md:px-14 mt-6 md:mt-0 bg-[#F5EFFF]' },
            span({
              class: 'icon icon-search bg-transparent text-black absolute ms-2 md:ms-1 p-1 md:p-0 inset-y-0 start-0 w-6 my-auto md:w-10 [&_svg]:fill-current cursor-pointer',
            }),
            input({
              class: 'w-auto relative py-1 pl-2 md:pl-0 flex flex-grow text-gray-400 font-medium bg-transparent tracking-wider text-lg sm:text-xl placeholder-grey-300 outline-none',
              id: 'search-input',
              placeholder: 'Search here...',
              type: 'text',
              autocomplete: 'off',
            }),
            span({ class: 'icon icon-close absolute me-2 md:me-1 inset-y-0 right-0 w-6 my-auto md:w-10 text-black fill-current cursor-pointer', id: 'empty-searchbar' }),
          ),
          a({ href: '#', class: 'btn btn-primary-purple flex h-max my-auto px-5 py-3 rounded-full font-bold' }, 'View Results'),
        ),
        div(
          { class: 'absolute bg-black text-white z-10' },
          ul({ id: 'search-suggestions', class: 'min-w-80 max-w-xl flex flex-col gap-y-2 px-4 py-2 empty:hidden' }),
        ),
      ),
    ),
    div({ id: 'search-content', class: 'container h-4/5 md:h-2/4 overflow-y-scroll mt-4 mx-auto mb-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-max gap-x-12 gap-y-3' }),
    div(
      { class: 'w-full fixed bottom-0 text-black font-normal hidden' },
      div(
        { class: 'grid grid-cols-5' },
        div(
          { class: 'hidden md:col-span-2 lg:col-span-3 md:flex flex-col bg-danaherpurple-50 px-8 py-3 text-danaherpurple-800 text-sm place-content-center' },
          'Spotlight',
          a(
            { class: 'flex items-center text-base text-black' },
            'Discover the all new CellXpress.ai Automated Cell Culture System',
            span({ class: 'icon icon-arrow-right flex items-center [&_svg]:w-4 [&_svg]:h-4 [&_svg]:stroke-1 [&_svg]:text-danaherpurple-500 ml-2' }),
          ),
        ),
        div(
          { class: 'col-span-5 md:col-span-3 lg:col-span-2 bg-danaherpurple-500 px-8 py-3 text-white flex justify-between' },
          div(
            { class: 'flex flex-col place-content-center [&_p]:leading-4' },
            p({ class: 'text-2xl md:text-3xl' }, 'Total results'),
            a(
              {
                href: '#',
                class: 'flex items-center text-base font-bold mt-2',
              },
              'Visit Results',
              span({ class: 'icon icon-arrow-right flex items-center [&_svg]:w-4 [&_svg]:h-4 [&_svg]:fill-white ml-2' }),
            ),
          ),
          p({ id: 'total-result-count', class: 'text-5xl md:text-7xl lg:text-8xl' }, '0'),
        ),
      ),
    ),
  );
  decorateIcons(searchBackdropContainer);
  headerBlock.append(searchBackdropContainer);
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

    buildSearchBackdrop(headerBlock);
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

  // DISPLAY COVEO { BACKDROP } ON DESKTOP
  document.querySelector('#search-by-coveo').addEventListener('click', () => {
    document.querySelector('#search-container')?.classList.remove(...'-translate-y-full [&_#search-product]:hidden [&_#search-content]:hidden'.split(' '));
    document.querySelector('#search-input').focus();
  });
  document.querySelector('div.search-icon').addEventListener('click', () => {
    const searchContainer = document.querySelector('#search-container');
    searchContainer?.classList.remove(...'-translate-y-full [&_#search-product]:hidden [&_#search-content]:hidden'.split(' '));
    document.querySelector('#search-input').focus();
  });
  // CLOSE COVEO { BACKDROP } ON DESKTOP/MOBILE
  document.querySelector('#close-search-container').addEventListener('click', () => {
    document.querySelector('#search-container')?.classList.add(...'-translate-y-full [&_#search-product]:hidden [&_#search-content]:hidden'.split(' '));
  });
  document.querySelector('#search-input').addEventListener('keyup', (event) => {
    document.querySelector('#search-content').nextSibling.classList.remove('hidden');
    let { value } = event.target;
    value = value.trim();
    if (value === '' && value !== searchString) {
      document.querySelector('#search-content').innerHTML = '';
      document.querySelector('#search-suggestions').innerHTML = '';
    }
    if (value !== searchString) {
      fetchSuggestions(value);
      fetchFinishType(value);
    }
    searchString = value;
  });
  document.querySelector('#search-input').addEventListener('blur', () => {
    setTimeout(() => {
      document.querySelector('#search-suggestions').innerHTML = '';
    }, 200);
  });
  // NULLIFY COVEO SEARCH TYPE-VALUE & SUGGESTIONS
  document.querySelector('#empty-searchbar').addEventListener('click', () => {
    fetchFinishType('');
    document.querySelector('#search-input').value = '';
    document.querySelector('#search-suggestions').innerHTML = '';
    const allSelectedFacets = document.querySelectorAll('#search-product span.facet-selected');
    if (allSelectedFacets.length > 0) {
      allSelectedFacets.forEach((selectedFacet) => selectedFacet.remove());
      payload = {
        ...payload,
        ...{
          facets: payload?.facets.map((facet) => {
            facet.currentValues.forEach((curFacVal, curFacValIndex) => {
              facet.currentValues[curFacValIndex].state = 'idle';
            });
            return facet;
          }),
        },
      };
    }
  });

  return block;
}
