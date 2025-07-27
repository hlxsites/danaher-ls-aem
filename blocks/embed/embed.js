import { loadScript, toClassName } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';

// Generic fallback embed
const getDefaultEmbed = (url) => `
  <div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allowfullscreen="" scrolling="no" allow="encrypted-media"
      title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

// Adobe PDF viewer
const embedPdfViewer = (block, url) => {
  loadScript('https://acrobatservices.adobe.com/view-sdk/viewer.js');

  const pdfEmbedKey = window.DanaherConfig?.pdfEmbedKey || '';
  const VIEWER_CONFIG = [
    { 'sized-container': { embedMode: 'SIZED_CONTAINER' } },
    { showfullscreen: { showFullScreen: true } },
    { showdownload: { showDownloadPDF: true } },
    { showannotationtools: { showAnnotationTools: true } },
    { showprint: { showPrintPDF: true } },
  ];

  const config = [...block.classList]
    .filter((item) => item !== 'embed' && item !== 'block')
    .map((item) => Object.entries(VIEWER_CONFIG.find((cfg) => cfg[item]) || {})[0]?.[1])
    .filter(Boolean);

  const embedHTML = div({ id: 'adobe-dc-view', style: 'width: 100%; height: 500px' });
  const fileName = url.pathname.split('/').pop();

  document.addEventListener('adobe_dc_view_sdk.ready', () => {
    const adobeDCView = new AdobeDC.View({
      clientId: pdfEmbedKey,
      divId: 'adobe-dc-view',
    });
    adobeDCView.previewFile(
      {
        content: { location: { url: url.pathname } },
        metaData: { fileName },
      },
      Object.assign({}, ...config),
    );
  });

  return embedHTML.outerHTML;
};

// YouTube embed
const embedYoutube = (block, url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  const embedPath = url.origin.includes('youtu.be') ? `/embed/${url.pathname.split('/')[1]}` : `/embed/${vid}?rel=0&v=${vid}${suffix}`;

  return `
    <div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${embedPath}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
        allowfullscreen="" scrolling="no" title="Content from YouTube" loading="lazy">
      </iframe>
    </div>`;
};

// Vimeo embed
const embedVimeo = (block, url, autoplay) => {
  const video = url.pathname.split('/').pop();
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  return `
    <div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
        title="Content from Vimeo" loading="lazy">
      </iframe>
    </div>`;
};

// Vidyard embed
const embedVidyard = (block, url, autoplay) => {
  const video = url.pathname.split('/').pop();
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  return `
    <div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://play.vidyard.com/${video}${suffix}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        frameborder="0" allowtransparency="true" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
        title="video" loading="lazy">
      </iframe>
    </div>`;
};

// Embed resolver
const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) return;

  const EMBEDS_CONFIG = [
    { match: ['youtube', 'youtu.be'], embed: embedYoutube },
    { match: ['vimeo'], embed: embedVimeo },
    { match: ['vidyard'], embed: embedVidyard },
    { match: ['/content/dam/danaher/', '.pdf'], embed: embedPdfViewer },
  ];

  const url = new URL(link);
  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));

  // Use matching embed method or fallback
  block.innerHTML = config
    ? config.embed(block, url, autoplay)
    : getDefaultEmbed(url);

  block.classList = `block embed ${config ? `embed-${toClassName(config.match[0])}` : ''} my-8 mx-auto text-center`;
  block.classList.add('embed-is-loaded');

  if (block.parentNode) {
    block.parentNode.classList.add('w-full');
  }
};

// Decorate block (main entry point)
export default function decorate(block) {
  const anchor = block.querySelector('a');
  if (!anchor) return;

  const link = anchor.href;

  // Reinsert raw URL as hidden anchor tag (for AEM compatibility)
  const visibleLink = document.createElement('a');
  visibleLink.href = link;
  visibleLink.textContent = link;
  visibleLink.style.display = 'none';

  // Clear block and insert raw URL anchor
  block.textContent = '';
  block.appendChild(visibleLink);

  // Also store in dataset
  block.dataset.url = link;

  // Optional: detect autoplay from class
  const autoplay = block.classList.contains('autoplay');

  // Lazy-load embed when in view
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      setTimeout(() => loadEmbed(block, link, autoplay), 2000);
    }
  });
  observer.observe(block);
}
