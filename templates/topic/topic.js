import { buildBlock } from '../../scripts/lib-franklin.js';

const social = `
  <a href="javascript:history.back()" aria-label="back" class="back-btn">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" data-di-rand="1697724519641"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 14.7071C7.31658 15.0976 6.68342 15.0976 6.2929 14.7071L2.29289 10.7071C1.90237 10.3166 1.90237 9.68342 2.29289 9.29289L6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289C8.09763 5.68342 8.09763 6.31658 7.70711 6.70711L5.41421 9L17 9C17.5523 9 18 9.44771 18 10C18 10.5523 17.5523 11 17 11L5.41421 11L7.70711 13.2929C8.09763 13.6834 8.09763 14.3166 7.70711 14.7071Z" fill="#4B5563"></path></svg>
    <span class="my-auto">Back</span>
  </a>
  <div class="social-links">
    <a href="javascript:window.print();" aria-label="print" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-print"></span>
    </a>
    <a href="javascript:window.open('//twitter.com/intent/tweet?' + location.href + '&title=' + encodeURI(document.title) )" aria-label="twitter" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-twitter"></span>
    </a>
    <a href="javascript:window.open('//www.linkedin.com/shareArticle?mini=true&url=' + location.href + '&title=' + document.title )" aria-label="linkedin" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-linkedin"></span>
    </a>
  </div>
`;

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const firstWrapper = main.querySelector(':scope > div');
  firstWrapper.prepend(
    buildBlock('social-media', { elems: [social] }),
  );
  const lastWrapper = main.querySelector(':scope > div:last-of-type');
  lastWrapper.append(
    buildBlock('social-media', { elems: [social] }),
  );
}
