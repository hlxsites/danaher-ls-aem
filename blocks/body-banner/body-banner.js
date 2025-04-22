import {
  div,  p, h2,a,img, button,section

} from '../../scripts/dom-builder.js';
export default function decorate(block) {
  block.textContent = "";
const bodyBannerSection = section({
  class: `
    flex flex-col md:flex-row items-center justify-between
    px-10 py-16 rounded-md overflow-hidden mt-12
  `.trim()
});
bodyBannerSection.style.width = "100%";
bodyBannerSection.style.maxWidth = "1440px";
bodyBannerSection.style.margin = "0 auto";

// === Left: Image Section ===
const bannerImageContainer = div({
  class: 'flex-1 flex flex-col justify-center items-center text-white mb-8 md:mb-0'
},
  div({
    class: 'text-left mb-6 w-full'
  },
    h2({
      class: 'text-2xl md:text-3xl font-bold leading-snug text-black'
    }, 'We see away to reduce 85% less steps to first image')
  ),
  img({
    src: '/icons/media_1a2df0a2c69ad948b8b4ae21889e27b8caeb5ab9f.webp',
    alt: 'Ivesta 3 Greenough Stereo Microscopes',
    class: 'h-[460px] object-contain'
  })
);

// === Right Text Section ===
const bannerTextWrapper = div({
  class: `
    flex-1 text-left px-8 py-10 
    bg-fuchsia-700 text-white rounded-md 
    min-h-[460px] flex flex-col justify-center
  `.trim()
},
  p({ class: 'text-sm font-semibold mb-2' }, 'Stereo Microscopes'),
  h2({
    class: 'text-2xl md:text-3xl font-semibold mb-4 leading-snug text-white'
  }, 'Ivesta 3 Greenough Stereo Microscopes'),
  p({
    class: 'text-sm mb-2 leading-relaxed'
  }, 'For manufacturers or suppliers, increasing efficiency for inspection is a priority.'),
  p({
    class: 'text-sm mb-4 leading-relaxed'
  }, 'You can optimize your visual inspection and rework while achieving reliable, consistent results with Ivesta 3 Greenough stereo microscope.'),
  div({ class: 'mt-2' },
    button({
      class: `
        border border-blue-600 bg-white text-blue-600 
        text-sm font-semibold px-6 py-3 rounded-full 
        hover:bg-blue-600 hover:text-white 
        transition duration-300
      `.trim()
    }, 'Learn More')
  )
);

// Final Assembly
bodyBannerSection.append(bannerImageContainer, bannerTextWrapper);

// Append to DOM
block.appendChild(bodyBannerSection);
}