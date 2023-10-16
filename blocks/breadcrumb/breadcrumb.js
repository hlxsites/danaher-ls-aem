export default function decorate(block) {
  const clonedBlock = block.cloneNode(true);
  const listsClone = clonedBlock.querySelector('div > ul').cloneNode(true);
  listsClone.className = 'max-w-screen-xl w-full mx-auto px-4 flex gap-4 sm:px-6 lg:px-7 overflow-x-auto';
  listsClone.setAttribute('role', 'list');
  Array.from(listsClone.children).forEach((element) => {
    element.className = 'flex items-center gap-x-3 text-sm font-medium text-gray-500 whitespace-nowrap hover:text-gray-700';
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('data-acsb-hidden', 'true');
    element.setAttribute('data-acsb-force-hidden', 'true');
    const anchorText = element.textContent;
    element.innerHTML = "<svg class='w-6 h-5/6 flex-shrink-0 text-gray-300' viewBox='0 0 24 44' preserveAspectRatio='none' fill='currentColor' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' data-acsb-hidden='true' data-acsb-force-hidden='true' data-di-rand='1697196048881'><path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z'></path></svg>";
    element.prepend(anchorText);
  });
  document.getElementsByClassName('breadcrumb-wrapper')[0].innerHTML = '';
  document.getElementsByClassName('breadcrumb-wrapper')[0].append(listsClone);
  const mainElement = document.querySelector('main');
  mainElement.parentNode.insertBefore(document.getElementsByClassName('breadcrumb-wrapper')[0], mainElement);
}
