import {
  div, p, img, a, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  const [
    offerBannerTitle,
    offerBannerImage,
    offerBannerLink,
    offerBannerLinkTarget,
    offerBannerLinkLabel,
    offerBannerBgColor,
  ] = block.children;
console.log('offerBannerTitle:  ',offerBannerTitle);
console.log('offerBannerImage:  ',offerBannerImage);
console.log('offerBannerLink:  ',offerBannerLink);
console.log('offerBannerLinkTarget:  ',offerBannerLinkTarget);
console.log('offerBannerLinkLabel:  ',offerBannerLinkLabel);
console.log('offerBannerBgColor:  ',offerBannerBgColor);

  const titleEl = offerBannerTitle?.textContent.trim() || '';
  const imgEl = offerBannerImage?.querySelector('img');
  const linkTextEl = offerBannerLink?.textContent.trim() || '';
  const linkTarget = offerBannerLinkTarget?.textContent?.trim() || '';
  const linkLabelEl = offerBannerLinkLabel?.textContent.trim() || '';
  const bgColorEl = offerBannerBgColor.textContent.trim() || '#E5E7EB';

  const title = titleEl;
  const imgSrc = imgEl?.getAttribute('src').replace(/<[^>]*>/g, '') || '';
  const imgAlt = imgEl?.getAttribute('alt') || 'Banner image';
  const linkText = linkTextEl;
  const linkTargetEl = linkTarget ? '_blank' : '_self';
  const linkLabel = linkLabelEl;
  const bgColor = bgColorEl;

  const bannerSection = div(
    {
      style: `background-color: ${bgColor};`,
      class:
        'flex flex-col md:flex-row items-start md:items-center gap-16  dhls-container mx-5 dhlsBp:mx-auto p-6 md:p-12',
    },

    // Logo
    imgSrc
      ? img({
        src: imgSrc.replace(/<[^>]*>/g, ''),
        alt: imgAlt.replace(/<[^>]*>/g, ''),
        class: 'h-16 w-auto',
      })
      : '',

    // Text Block
    div(
      { class: 'flex flex-col items-start max-w-3xl' },

      // Main Message
      p({ class: 'text-3xl font-medium text-black leading-10 md:pl-8' }, title),

      // Discover Link
      linkText
        ? a(
          {
            href: linkTextEl || '#',
            target: linkTargetEl,
            class:
                'text-base text-danaherpurple-500 hover:text-danaherpurple-800 [&_svg>use]:hover:stroke-danaherpurple-800 font-semibold mt-4 flex items-center  md:pl-8',
          },
          linkLabel || '',
          span({
            class:
                'icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
        )
        : '',
    ),
  );
  decorateIcons(bannerSection);
  block.innerHTML = '';
  block.appendChild(bannerSection);
}
