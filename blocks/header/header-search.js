import {
  span, div, input, button,
} from '../../scripts/dom-builder.js';

const COVEO_ACCESS_TOKEN = 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
const COVEO_ORG_ID = 'danahernonproduction1892f3fhz';
const COVEO_SEARCH_HUB = 'DanaherMainSearch';
const COVEO_PIPELINE = 'Danaher Marketplace';
const COVEO_CLIENT_ID = 'f66c6310-5515-4e70-bb14-6073075ec659';

function formatSuggestionString(highlightedText, inputText) {
  return highlightedText.replace(/\[([^\]]+)\]/g, inputText ? '<span class="font-bold">$1</span>' : '$1').replace(/\{([^}]+)\}/g, '$1');
}

function goToSearchPage(searchTerm) {
  window.location = `https://lifesciences.danaher.com/us/en/search.html#q=${encodeURIComponent(searchTerm)}`;
}

async function buildSearchSuggestions(searchbox) {
  const inputText = searchbox.querySelector('input').value;
  const suggestionsResponse = await fetch(`https://${COVEO_ORG_ID}.org.coveo.com/rest/search/v2/querySuggest?organizationId=${COVEO_ORG_ID}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${COVEO_ACCESS_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      actionsHistory: [],
      analytics: {
        clientId: COVEO_CLIENT_ID,
        clientTimestamp: new Date().toISOString(),
        originContext: 'Search',
      },
      clientId: COVEO_CLIENT_ID,
      clientTimestamp: new Date().toISOString(),
      originContext: 'Search',
      count: 8,
      locale: 'en',
      pipeline: COVEO_PIPELINE,
      q: inputText,
      searchHub: COVEO_SEARCH_HUB,
      // visitorId: "f66c6310-5515-4e70-bb14-6073075ec659",
    }),
  });
  const suggestions = (await suggestionsResponse.json()).completions;
  const wrapper = searchbox.querySelector('.search-suggestions-wrapper');
  const searchSuggestions = wrapper.querySelector('.search-suggestions');
  searchSuggestions.innerHTML = '';
  suggestions.forEach((suggestion) => {
    const searchSuggestion = button(
      {
        class: 'flex px-4 min-h-[40px] items-center text-left cursor-pointer hover:bg-danahergray-100',
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
    searchSuggestion.querySelector('span.search-suggestion-icon').innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="m6.4 0c3.5 0 6.4 2.9 6.4 6.4 0 1.4-.4 2.7-1.2 3.7l4 4c.4.4.4 1 .1 1.5l-.1.1c-.2.2-.5.3-.8.3s-.6-.1-.8-.3l-4-4c-1 .7-2.3 1.2-3.7 1.2-3.4-.1-6.3-3-6.3-6.5s2.9-6.4 6.4-6.4zm0 2.1c-2.3 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3z"></path>
      </svg>
    `;
    searchSuggestion.querySelector('span.search-suggestion-text').innerHTML = formatSuggestionString(suggestion.highlighted, inputText);

    searchSuggestion.addEventListener('click', (e) => {
      const searchInput = e.target.closest('.searchbox').querySelector('input');
      searchInput.value = e.target.closest('button').querySelector('span.search-suggestion-text').innerText;
      searchInput.focus();
      goToSearchPage(searchInput.value);
    });
    searchSuggestions.append(searchSuggestion);
  });
}

async function handleSearchInput(e) {
  const { target } = e;
  const searchBox = target.closest('.searchbox');
  const clearIcon = searchBox.querySelector('.searchbox-clear');
  if (target.value) {
    clearIcon.classList.remove('hidden');
  } else {
    clearIcon.classList.add('hidden');
  }
  await buildSearchSuggestions(searchBox);
}

export function getSearchInput() {
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

export function addEventToSearchInput(searchBlock) {
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
    }, 100);
  });
  searchInput.addEventListener('keydown', (e) => {
    const { key } = e;
    const searchValue = searchInput.value;
    if (key === 'Enter' && searchValue) {
      e.preventDefault();
      goToSearchPage(searchValue);
    }
  });
  searchInput.addEventListener('keydown', (e) => {
    const { key } = e;
    const searchValue = searchInput.value;
    if (key === 'Enter' && searchValue) {
      e.preventDefault();
      goToSearchPage(searchValue);
    }
  });
  searchBlock.querySelector('.searchbox .search-enter-button').addEventListener('click', (e) => {
    e.preventDefault();
    const searchValue = searchInput.value;
    if (searchValue) goToSearchPage(searchValue);
  });
}
