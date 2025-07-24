import { div, p } from '../../scripts/dom-builder.js';

// Highlight the tabs on selection
function updatePageTabs(event) {
  const allTabs = document.querySelectorAll('.p-tab');
  allTabs.forEach((tab) => {
    tab.classList.remove('text-danaherpurple-500', 'font-bold');
    tab.classList.add('text-black', 'font-medium');
  });
  event.target.classList.remove('text-black', 'font-medium');
  event.target.classList.add('text-danaherpurple-500', 'font-bold');
}

export default async function decorate(block) {
  block.append(div({ class: 'block-pdp-page-tabs' }, 'Page Tabs'));
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  console.log(response);
  const tabsList = [];

  // Description
  if (response?.raw?.richlongdescription !== undefined && response?.raw?.richlongdescription?.trim() !== '') {
    tabsList.push('Description');
  }
  // Specification
  if (response?.raw?.attributejson !== undefined && response?.raw?.attributejson?.trim() !== '') {
    tabsList.push('Specification');
  }
  // Bundle part list
  if (response?.raw?.bundlepreviewjson !== undefined && response?.raw?.bundlepreviewjson?.trim() !== '') {
    tabsList.push('Product Part List');
  }

  const tabsDiv = div({ class: 'tabs-parent' });
  tabsList.forEach((tab, index) => {
    tabsDiv.append(
      div(
        { class: 'px-6 py-4' },
        p({
          class: `p-tab ${index === 0 ? 'text-danaherpurple-500 font-bold' : 'text-black font-medium'}  cursor-pointer`,
          onclick(event) {
            updatePageTabs(event);
          },
        }, tab),
      ),
    );
  });

  const pageTabsSuperParent = div(
    { class: 'super-parent w-48' },
    tabsDiv,
  );
  block.replaceChildren();
  block.append(pageTabsSuperParent);
}
