import { paginationController } from '../controllers/pdp-controllers.js';

const renderPagination = () => {
  const paginationElement = document.getElementById('pagination');
  paginationElement.innerHTML = '';

  const {
    currentPages, hasNextPage, hasPreviousPage, currentPage,
  } = paginationController.state;

  // Container
  const pagerDiv = document.createElement('div');
  pagerDiv.className = 'flex items-center py-6 w-full justify-between';

  const pagerSpan = document.createElement('span');
  pagerSpan.className = 'border-t border-gray-200 flex items-center w-full justify-between';

  // Left container for previous button
  const leftContainer = document.createElement('div');
  leftContainer.className = 'flex items-center justify-start w-1/4';

  // Previous Button
  const prevButton = document.createElement('button');
  prevButton.innerHTML = hasPreviousPage ? ` 
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 14.7071C7.31658 15.0976 6.68342 15.0976 6.2929 14.7071L2.29289 10.7071C1.90237 10.3166 1.90237 9.68342 2.29289 9.29289L6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289C8.09763 5.68342 8.09763 6.31658 7.70711 6.70711L5.41421 9L17 9C17.5523 9 18 9.44771 18 10C18 10.5523 17.5523 11 17 11L5.41421 11L7.70711 13.2929C8.09763 13.6834 8.09763 14.3166 7.70711 14.7071Z" fill="#7523FF"/>
    </svg>
    <span class="mr-2 text-purple-700">Previous</span>
  ` : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 14.7071C7.31658 15.0976 6.68342 15.0976 6.2929 14.7071L2.29289 10.7071C1.90237 10.3166 1.90237 9.68342 2.29289 9.29289L6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289C8.09763 5.68342 8.09763 6.31658 7.70711 6.70711L5.41421 9L17 9C17.5523 9 18 9.44771 18 10C18 10.5523 17.5523 11 17 11L5.41421 11L7.70711 13.2929C8.09763 13.6834 8.09763 14.3166 7.70711 14.7071Z" fill="#9CA3AF"/>
    </svg>
    <span class="mr-2">Previous</span>`;
  prevButton.className = hasPreviousPage
    ? 'px-3 py-2 bg-white text-purple-700 flex gap-1 items-center'
    : 'py-2 opacity-60  text-gray-700 cursor-not-allowed flex gap-1 items-center ';
  prevButton.disabled = !hasPreviousPage;
  prevButton.onclick = () => {
    if (hasPreviousPage) paginationController.previousPage();
  };
  leftContainer.appendChild(prevButton);

  // Center container for page buttons
  const centerContainer = document.createElement('div');
  centerContainer.className = 'flex items-center justify-center space-x-2 w-1/2 gap-2';

  currentPages.forEach((page) => {
    const pageButton = document.createElement('button');
    const isActive = page === currentPage;
    pageButton.innerText = page.toString();
    pageButton.className = isActive
      ? 'w-10 h-42 border-t-2 border-purple-700'
      : 'w-10 h-42 text-gray-700 hover:bg-purple-50';
    pageButton.style = 'height: 42px';
    pageButton.disabled = isActive;
    pageButton.onclick = () => {
      if (!isActive) paginationController.selectPage(page);
      const target = document.getElementById('products-tab');
      if (target && !isActive) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };
    centerContainer.appendChild(pageButton);
  });

  // Right container for next button
  const rightContainer = document.createElement('div');
  rightContainer.className = 'flex items-center justify-end w-1/4';

  // Next Button
  const nextButton = document.createElement('button');
  nextButton.innerHTML = `
    <span class="mr-2 text-purple-700">Next</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2929 5.29289C12.6834 4.90237 13.3166 4.90237 13.7071 5.29289L17.7071 9.29289C18.0976 9.68342 18.0976 10.3166 17.7071 10.7071L13.7071 14.7071C13.3166 15.0976 12.6834 15.0976 12.2929 14.7071C11.9024 14.3166 11.9024 13.6834 12.2929 13.2929L14.5858 11H3C2.44772 11 2 10.5523 2 10C2 9.44772 2.44772 9 3 9H14.5858L12.2929 6.70711C11.9024 6.31658 11.9024 5.68342 12.2929 5.29289Z" fill="#7523FF"/>
    </svg>
  `;
  nextButton.className = hasNextPage
    ? 'py-2 bg-white text-gray-700 hover:bg-gray-100 flex gap-1 items-center'
    : 'px-3 py-2 opacity-60 cursor-not-allowed flex items-cente';
  nextButton.disabled = !hasNextPage;
  nextButton.onclick = () => {
    if (hasNextPage) paginationController.nextPage();
  };
  rightContainer.appendChild(nextButton);

  // Append all to pagerDiv
  pagerSpan.appendChild(leftContainer);
  pagerSpan.appendChild(centerContainer);
  pagerSpan.appendChild(rightContainer);
  pagerDiv.appendChild(pagerSpan);

  paginationElement.appendChild(pagerDiv);
};

export default renderPagination;
