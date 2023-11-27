export default function decorate(block) {
  block.parentNode.prepend(document.createElement('hr'));
  block.classList.add(...'flex flex-row my-16'.split(' '));
  [...block.children].forEach((element) => {
    element.classList.add(...'pr-60 w-full'.split(' '));
    element.querySelector('img')?.classList.add(...'py-1'.split(' '));
    element.querySelector('h3')?.classList.add(...'text-base p-0 my-1 sm:text-sm font-normal'.split(' '));
    const link = element.querySelector('a');
    if (link) {
      element.querySelector('a').classList.remove(...'btn btn-outline-primary'.split(' '));
      element.querySelector('a').innerHTML += ` <svg xmlns="http://www.w3.org/2000/svg" style="display:inline !important" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-4 h-4 ml-0.5" data-di-res-id="e64c7d67-741d6760" data-di-rand="1701088803659">
            <path fill-rule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clip-rule="evenodd"></path>
            </svg>`;
      element.querySelector('a').classList.add(...'text-sm font-medium text-danaherpurple-500'.split(' '));
    }
  });
  block.parentNode.append(document.createElement('hr'));
  block.parentNode.classList.add(...'py-6'.split(' '));
}
