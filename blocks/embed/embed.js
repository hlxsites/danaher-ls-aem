import { loadScript, toClassName } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';

const getDefaultEmbed = (url) => `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
        scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
      </iframe>
    </div>`;

const embedPdfViewer = (block, url) => {
  loadScript('https://acrobatservices.adobe.com/view-sdk/viewer.js');

  const pdfEmbedKey = window.DanaherConfig !== undefined ? window.DanaherConfig.pdfEmbedKey : '';

  const VIEWER_CONFIG = [
    { 'sized-container': { embedMode: 'SIZED_CONTAINER' } },
    { showfullscreen: { showFullScreen: true } },
    { showdownload: { showDownloadPDF: true } },
    { showannotationtools: { showAnnotationTools: true } },
    { showprint: { showPrintPDF: true } },
  ];

  const config = [...block.classList].filter((item) => item !== 'embed' && item !== 'block').map((item) => {
    const configItem = VIEWER_CONFIG.find((cfg) => cfg[item]);
    return Object.entries(configItem)[0][1];
  });

  const embedHTML = div({ id: 'adobe-dc-view', style: 'width: 100%; height: 500px' });
  const fileName = url.pathname.split('/').pop();
  document.addEventListener('adobe_dc_view_sdk.ready', () => {
    // eslint-disable-next-line no-undef
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

const embedYoutube = (block, url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}"
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedVimeo = (block, url, autoplay) => {
  const video = url.pathname.split('/').pop();
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  const embedHTML = `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${suffix}"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

// To play vidyard videos
const embedVidyard = (block, url, autoplay) => {
  const video = url.pathname.split('/').pop();
  const suffix = autoplay ? '?muted=1&autoplay=1' : '';
  const embedHTML = `<div style="flex justify-center left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://play.vidyard.com/${video}${suffix}"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allowtransparency="true" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      title="video" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['vidyard'],
      embed: embedVidyard,
    },
    {
      match: ['/content/dam/danaher/', '.pdf'],
      embed: embedPdfViewer,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(block, url, autoplay);
    block.classList = `block embed embed-${toClassName(config.match[0])} my-8 mx-auto text-center`;
    block.parentNode.classList.add('w-full');
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed my-8 mx-auto text-center';
  }
  block.classList.add('embed-is-loaded');
};

function styleEmbedContainer(embedBlock) {
  // Traverse up to find the nearest section parent
  const parentSection = embedBlock.closest('.section');

  if (parentSection && !parentSection.classList.contains('embed-container-processed')) {
    // Check if this is a video container (has grey background)
    const isVideoContainer = parentSection.classList.contains('video-container')
                            || parentSection.classList.contains('video-padded')
                            || parentSection.classList.contains('bg-gray-100');

    if (isVideoContainer) {
      // Apply responsive container styles
      parentSection.style.maxWidth = '100%';
      parentSection.style.margin = '0 auto';
      parentSection.style.padding = '24px 0';

      // Calculate dynamic width based on viewport
      const calculateContainerWidth = () => {
        const viewportWidth = window.innerWidth;
        let containerWidth;

        if (viewportWidth >= 2560) {
          containerWidth = '50%';
        } else if (viewportWidth >= 1440) {
          containerWidth = '90%';
        } else {
          containerWidth = '90%';
        }

        parentSection.style.width = containerWidth;
        embedBlock.style.maxWidth = '100%';
        embedBlock.style.margin = '0 auto';
      };

      // Set initial width
      calculateContainerWidth();

      // Update on resize
      window.addEventListener('resize', calculateContainerWidth);

      // Add background and padding if not already present
      if (!parentSection.classList.contains('bg-gray-100')) {
        parentSection.style.backgroundColor = '#f3f4f6'; // gray-100 equivalent
      }
      parentSection.style.paddingLeft = '24px';
      parentSection.style.paddingRight = '24px';
    }

    // Add a marker class so we don't process the same section multiple times
    parentSection.classList.add('embed-container-processed');
  }
}

export default function decorate(block) {
  const link = block.querySelector('a').href;
  block.textContent = '';

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      setTimeout(() => {
        loadEmbed(block, link);
        styleEmbedContainer(block);
      }, 2000);
    }
  });
  observer.observe(block);
}
