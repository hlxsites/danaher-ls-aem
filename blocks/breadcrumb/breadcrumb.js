export default function decorate(block) {
  const clonedBlock = block.cloneNode(true);
  const listsClone = clonedBlock.querySelector('div > ul').cloneNode(true);
  listsClone.className = 'max-w-screen-xl w-full mx-auto px-4 flex gap-4 sm:px-6 lg:px-7 overflow-x-auto';
  listsClone.setAttribute('role', 'list');
  const homeIconLi = document.createElement('li');
  homeIconLi.className = 'flex items-center gap-x-3 text-sm font-medium text-gray-500 whitespace-nowrap hover:text-gray-700';
  homeIconLi.innerHTML = '<a href="/" title="Home"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="flex-shrink-0 h-5 w-5" data-di-rand="1697430026535"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path></svg></a>';
  listsClone.prepend(homeIconLi);
  Array.from(listsClone.children).forEach((element, index) => {
    element.classList.add(...'flex items-center gap-x-3 text-sm font-medium text-gray-500 whitespace-nowrap hover:text-gray-700'.split(' '));
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('data-acsb-hidden', 'true');
    element.setAttribute('data-acsb-force-hidden', 'true');
    const anchor = element.children[0];
    anchor.setAttribute('tabindex', '-1');
    if ((listsClone.children.length - 1) !== index) element.innerHTML = "<svg class='w-6 h-5/6 flex-shrink-0 text-gray-300' viewBox='0 0 24 44' preserveAspectRatio='none' fill='currentColor' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' data-acsb-hidden='true' data-acsb-force-hidden='true' data-di-rand='1697196048881'><path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z'></path></svg>";
    element.prepend(anchor);
  });
  const breadcrumbWrapper = document.getElementsByClassName('breadcrumb-wrapper')[0];
  breadcrumbWrapper.classList.add(...'flex bg-white border-b border-gray-200'.split(' '));
  breadcrumbWrapper.innerHTML = '';
  breadcrumbWrapper.append(listsClone);
  const mainElement = document.querySelector('main');
  mainElement.parentNode.insertBefore(breadcrumbWrapper, mainElement);
}
