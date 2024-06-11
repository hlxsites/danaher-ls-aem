import {
  a, div, li, ul,
} from '../../scripts/dom-builder.js';
import ffetch from '../../scripts/ffetch.js';

const TEMPLATE_PATH_PATTERN = /\/us\/en\/[^/]+\/topics-template/;

async function getItems() {
  // get the breadcrumb items from the page path, only after '/us/en'
  const path = window.location.pathname;
  const pathParts = path.split('/');
  const itemPaths = pathParts.length > 2 ? pathParts.slice(3).map((_, i) => pathParts.slice(0, i + 4).join('/')) : [];
  const articles = await ffetch('/us/en/article-index.json')
    .filter((article) => itemPaths.includes(article.path))
    .all();

  // map over itemPaths to create items
  return itemPaths.map((itemPath) => {
    // get the title from the article, based on its path
    const article = articles.find((entry) => entry.path === itemPath);
    const title = (article && article.navTitle !== '') ? article.navTitle : itemPath.split('/').pop();
    return {
      title,
      href: `${itemPath}.html`,
    };
  });
}

export default async function decorate(block) {
  if (!block.querySelector('div > ul')) {
    const items = await getItems();
    const listItems = items.map((item) => li({}, a({ href: item.href }, item.title)));
    block.innerHTML = '';
    block.append(
      div(
        {},
        div(
          {},
          ul(
            {},
            ...listItems,
          ),
        ),
      ),
    );
  }
  const entries = block.querySelector('div > ul');
  entries.className = 'max-w-screen-xl w-full mx-auto px-4 flex gap-4 sm:px-6 lg:px-7 overflow-x-auto';
  entries.setAttribute('role', 'list');
  const homeIconLi = document.createElement('li');
  homeIconLi.className = 'flex items-center gap-x-3 text-sm font-medium text-gray-500 whitespace-nowrap hover:text-gray-700';
  homeIconLi.innerHTML = '<a href="/" title="Home"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="flex-shrink-0 h-5 w-5" data-di-rand="1697430026535"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path></svg></a>';
  entries.prepend(homeIconLi);
  Array.from(entries.children).forEach((element, index) => {
    element.classList.add(...'flex items-center gap-x-3 text-sm font-medium text-gray-500 whitespace-nowrap hover:text-gray-700'.split(' '));
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('data-acsb-hidden', 'true');
    element.setAttribute('data-acsb-force-hidden', 'true');
    const anchor = element.children[0];
    anchor.setAttribute('tabindex', '-1');
    if ((entries.children.length - 1) !== index) element.innerHTML = "<svg class='w-6 h-5/6 flex-shrink-0 text-gray-300' viewBox='0 0 24 44' preserveAspectRatio='none' fill='currentColor' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' data-acsb-hidden='true' data-acsb-force-hidden='true' data-di-rand='1697196048881'><path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z'></path></svg>";
    element.prepend(anchor);

    // special handling for template pages
    if (TEMPLATE_PATH_PATTERN.test(anchor.href)) {
      anchor.href = anchor.href.replace('topics-template', 'topics');
    }
  });
  const breadcrumbWrapper = block.parentElement;
  breadcrumbWrapper.classList.add(...'flex bg-white border-b border-gray-200'.split(' '));
  breadcrumbWrapper.innerHTML = '';
  breadcrumbWrapper.append(entries);
  const breadcrumbSection = breadcrumbWrapper.parentElement;
  const mainElement = document.querySelector('main');
  mainElement.parentNode.insertBefore(breadcrumbWrapper, mainElement);
  breadcrumbSection.remove();
}
