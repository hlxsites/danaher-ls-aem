/* eslint-disable */
import { buildStandaloneSearchBox } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { searchEngine }  from './carouselDetailEngine.js';

export const standaloneSearchBoxController = buildStandaloneSearchBox(searchEngine, {
  options: {
    // redirectionUrl: '/search-results',
    redirectionUrl: '/products',
    numberOfSuggestions: 5,
    highlightOptions: {
      notMatchDelimiters: {
        open: '<strong>',
        close: '</strong>',
      },
      correctionDelimiters: {
        open: '<i>',
        close: '</i>',
      },
    },
  },
});