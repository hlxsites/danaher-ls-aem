import {
  div,p, h2,a,section,h3

} from '../../scripts/dom-builder.js';
export default function decorate(block) {
//Eye to insight section
// === Main Section
// === Section Wrapper ===
const eyesection = section({
  class: `
    flex flex-col md:flex-row justify-between gap-10
    px-6 py-10 mt-12 rounded-md
    max-w-[1440px] w-full mx-auto
  `.trim()
});
const eyetoInsightinfo = [
  {
    heading:
      "Leica – From Eye to Insight",
      desc:"Leica Microsystems is one of the market leaders in microscopy and scientific imaging. The company develops highly advanced instruments for the analysis of microstructures and nanostructures – increasingly harnessing the power of machine learning, automation, and data analytics to provide greater insights to scientists than ever before.",
      workflowHeading:"Workflow solutions",
      workflowDesc: "Discover workflow solutions utilizing the latest technology from Leica Microsystems",
      applications:"Applications",
      applicationsInfo:"View our applications",
      talkexp:"Talk to an expert",
      talkexpInfo:"Speak to one of our world-leading life sciences experts",
      newsLetter:"Signup for our newsletter",
      newsLetterInfo:"Stay connected with us and receive exciting news and announcements",
  },
];
const { heading, desc,workflowHeading,workflowDesc,newsLetter,newsLetterInfo,applications,talkexpInfo,talkexp,applicationsInfo } = eyetoInsightinfo[0];
// === Left Column (Title + Description) ===
const leftCol = div({ class: 'flex-1' },
  h2({ class: 'text-2xl md:text-3xl font-semibold mb-4' }, heading),
  p({
    class: 'text-base text-gray-700 leading-relaxed'
  }, desc)
);

// === Right Column (Items) ===
const rightCol = div({ class: 'flex-1 space-y-10' });

const items = [
  {
    eyetitle: workflowHeading,
    desc: workflowDesc,
    link: "View Solutions →"
  },
  {
    eyetitle: applications,
    desc: applicationsInfo,
    link: "View Applications →"
  },
  {
    eyetitle: talkexp,
    desc: talkexpInfo,
    link: "Connect with us →"
  },
  {
    eyetitle: newsLetter,
    desc: newsLetterInfo,
    link: "Subscribe now →"
  }
];

items.forEach(({ eyetitle, desc, link }) => {
  const container = div({ class: 'border-b border-gray-300 pb-6' },
    h3({ class: 'text-xl font-semibold mb-1' }, eyetitle),
    p({ class: 'text-sm text-gray-700 mb-3' }, desc),
    a({
      href: '#',
      class: 'text-blue-600 text-sm font-semibold hover:underline'
    }, link)
  );

  rightCol.appendChild(container);
});

// === Final Assembly ===
eyesection.append(leftCol, rightCol);
block.appendChild(eyesection);
}
