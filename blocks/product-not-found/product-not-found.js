import {
  div, h1, h2, p, a, img,
} from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  document.title = 'Product not found';
  block.innerHTML = '';
  block.parentElement.classList.add(...'max-w-7xl mx-auto w-full'.split(' '));
  block.classList.add(...'relative bg-white grid lg:grid-cols-7'.split(' '));
  const notFound = div(
    { class: 'lg:col-span-3 px-4 sm:px-6 lg:max-w-7xl lg:px-8' },
    div(
      { class: 'relative sm:pt-8 lg:pt-14 pt-12 md:pb-24 lg:pb-80 xl:col-start-1' },
      h2({ class: 'text-sm font-semibold text-indigo-300 tracking-wide uppercase' }),
      p({ class: 'text-sm font-semibold text-danaherblue-600 uppercase tracking-wide' }, '404 error'),
      h1({ class: 'mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl' }, 'Product not found'),
      p({ class: 'mt-2 text-base text-gray-500' }, 'Sorry, we couldn’t find the product you’re looking for.'),
      div(
        { class: 'mt-6' },
        a({ href: '/', title: 'Go back', class: 'group inline-flex items-center font-medium text-danaherblue-600 hover:text-danaherblue-500' }),
      ),
      div({ class: 'mt-12 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2' }),
    ),
  );
  const notFoundImg = img({
    class: 'h-full w-full object-cover lg:col-span-4',
    src: 'https://lifesciences.danaher.com/content/dam/danaher/backgrounds/group-gathered-large.jpg',
    alt: 'Danaher Background',
  });

  notFound.querySelector('a').innerHTML = "Go back home <svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:tracking-wide group-hover:font-semibold transition' fill='currentColor' viewBox='0 0 16 16'>"
    + "<path fill-rule='evenodd' d='M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8'/>"
    + '</svg>';

  block.append(notFound, notFoundImg);
}
