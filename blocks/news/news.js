import {
  div,  h3, p, h2,a,img,section
} from '../../scripts/dom-builder.js';
export default function decorate(block) {
// news section
// === Section Wrapper ===
const newsSection = section({
  class: "max-w-[1440px] mx-auto px-6 py-12"
});

// === Header (Title + See All)
const headerWrapper = div(
  {
    class: "flex justify-between items-center mb-8"
  },
  h2({ class: "text-2xl font-semibold" }, "Leica Microsystems in the news"),
  a({
    href: "#",
    class: "text-fuchsia-600 text-sm font-semibold hover:underline hover:text-fuchsia-700"
  }, "See all →")
);

// === Cards Wrapper
const cardsWrapper = div({
  class: "grid grid-cols-1 md:grid-cols-3 gap-8"
});

// === Card Data
const newsItems = [
  {
    img: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/news1.jpeg",
    meta: "Leica Microsystems",
    date: "February 28, 2025  ·  2 min read",
    title: "Leica Microsystems Acquires ATTO-TEC to Advance Microscope Imaging Workflows",
    link: "Read Article →"
  },
  {
    img: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/news2.jpeg",
    meta: "Leica Microsystems",
    date: "October 29, 2024  ·  2 min read",
    title: "Access 3D high-plex spatial information across scales",
    link: "Read Article →"
  },
  {
    img: "https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/news3.jfif",
    meta: "Leica Microsystems",
    date: "October 22, 2024  ·  2 min read",
    title: "Leica Microsystems unveils SpectraPlex for Life Sciences research",
    link: "Read Article →"
  }
];

// === Generate Cards
newsItems.forEach(({ cardsimg, meta, date, title, link }) => {
  const card = div(
    { class: "group transition-transform duration-300 ease-in-out" },
    img({
      src: cardsimg,
      alt: title,
      class: "w-full h-[200px] object-cover rounded-md transform group-hover:scale-105 transition duration-300 ease-in-out"
    }),
    p({ class: "text-sm text-gray-600 mt-3" }, meta),
    p({ class: "text-sm text-gray-600 mb-3" }, date),
    h3({ class: "text-lg font-semibold mb-4 transition duration-300 group-hover:scale-[1.02]" }, title),
    a({ href: "#", class: "text-fuchsia-600 font-semibold text-sm hover:underline" }, link)
  );

  cardsWrapper.appendChild(card);
});

// === Final Assembly
newsSection.append(headerWrapper, cardsWrapper);
block.appendChild(newsSection);
}