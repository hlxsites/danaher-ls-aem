import {
  div, p,img,h3,a,section
} from '../../scripts/dom-builder.js';
export default function decorate(block) {
//digital microscope banner
// === Section Container
// === Section Wrapper ===
const micaSection = section({
  class: `
    flex flex-col md:flex-row items-center justify-between
    max-w-[1440px] mx-auto px-6 py-12 gap-8
  `.trim()
});
const microscopeBannerInfo = [
  {
    heading:
      "Mica",
      descLine1:"More than a highly automated microscope, Mica unites widefield and confocal imaging in a sample protecting, incubating environment. With the simple push of a button, you have everything you need - all in one place - to supercharge fluorescence imaging workflows and get meaningful scientific results faster.",
      descLine2:"Now you can focus on your science, not figuring out your microscope.",
    buttonText: "Learn More",
    text:"Digital Microscopes",
  },
];
const { heading, buttonText,descLine1,descLine2,text } = microscopeBannerInfo[0];


// === Image Element ===
const micaImage = img({
  src: "/icons/mica.webp",
  alt: "Mica Microscope",
  class: "w-full max-w-md object-contain"
});

// === Right Content Box ===
const rightBox = div({
  class: 'bg-fuchsia-700 text-white p-8 rounded-md max-w-xl w-full'
}, 
  p({ class: 'text-sm font-semibold mb-2' }, text),
  h3({ class: 'text-3xl font-semibold text-white mb-4' }, heading),
  p({ class: 'text-sm leading-relaxed mb-4' },descLine1
  ),
  p({ class: 'text-sm leading-relaxed mb-6' },descLine2
  ),
  a({
    href: '#',
    class: `
      inline-block px-6 py-2 rounded-full border border-blue-600
      bg-white text-blue-600 font-medium text-sm
      hover:bg-blue-600 hover:text-white transition
    `.trim()
  }, buttonText)
);

// === Final Assembly ===
micaSection.append(micaImage, rightBox);
block.appendChild(micaSection);
}