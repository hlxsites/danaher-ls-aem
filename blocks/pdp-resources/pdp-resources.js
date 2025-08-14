import { resourcePager, resourceResultList } from '../../scripts/coveo/controller/controllers.js';
import { resourceEngine } from '../../scripts/coveo/engine.js';
import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block.id = 'resources-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.replaceChildren();
  block.append(div({ class: 'block-pdp-resources' }, 'PDP Resources Block'));
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));

  // 5️. Subscribe to changes and log results
  resourceResultList.subscribe(() => {
    console.log(
      `📄 Page ${resourcePager.state.currentPage} of ${resourcePager.state.maxPage}`,
    );
    console.log(
      `🔹 Showing ${resourceEngine.state.pagination.numberOfResults} results per page`,
    );
    console.table(resourceResultList.state.results, [
      'title',
      'clickUri',
      'raw.opco',
      'raw.documenttype',
    ]);
    console.log(
      '%cUse nextResults(), prevResults(), or gotoPage(n) to navigate',
      'color: green',
    );
  });

  // 6️. Expose helper functions for navigation in the browser console
  window.nextResults = () => {
    if (resourcePager.state.hasNextPage) {
      resourcePager.nextPage();
    } else {
      console.warn('🚫 No more pages');
    }
  };

  window.prevResults = () => {
    if (resourcePager.state.hasPreviousPage) {
      resourcePager.previousPage();
    } else {
      console.warn('🚫 Already at first page');
    }
  };

  window.gotoPage = (page) => {
    if (page >= 1 && page <= resourcePager.state.maxPage) {
      resourcePager.selectPage(page);
    } else {
      console.warn(`Page out of bounds, pick 1 - ${resourcePager.state.maxPage}`);
    }
  };

  // 7️. Disable analytics if needed
  // if (!isOTEnabled()) {
  //   resourceEngine.disableAnalytics();
  // }

  // 8️. Run the initial search
  resourceEngine.executeFirstSearch();
}
