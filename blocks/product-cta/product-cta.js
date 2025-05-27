import { div, span, a } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const titleEl = block.querySelector('[data-aue-prop="offer_title"]');
  const bgColorEl = block.querySelector('[data-aue-prop="bg-color"]');
  const descriptionEl = block.querySelector(
    '[data-aue-prop="brand-description"]',
  );
  const offerUrl = block.querySelector('a')?.textContent || '#';
  const buttonEl = block.querySelector('[data-aue-prop="quote-label"]');
  const title = titleEl?.textContent?.trim() || 'Can’t find what you need?';
  const bgColor = bgColorEl?.textContent?.trim() || 'bg-gray-100';
  const buttonContent = buttonEl?.textContent?.trim() || 'Request a quote';
  const description = descriptionEl?.textContent?.trim() || "Don't worry, we're here to help! Request a quote now and let our team of experts assist you in finding the perfect solution. We're committed to meeting your unique needs and providing the products you require.";
  const bannerSection = div(
    {
      class: `${bgColor} py-10  flex flex-col md:flex-row items-center gap-16 max-w-[1200px] mx-auto rounded-md`,
    },

    div(
      {
        class:
          'self-stretch h-56 px-14 py-16 bg-violet-900 inline-flex justify-start items-center gap-6',
      },
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-start items-start gap-4',
        },
        div(
          {
            class: 'self-stretch justify-start text-white text-3xl font-normal',
          },
          title,
        ),
        div(
          {
            class:
              'w-[1012px] justify-start text-white text-base font-extralight',
          },
          description,
        ),
      ),

      a(
        {
          href: offerUrl,
          class:
            'w-[13rem] px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span(
          {
            class: 'justify-start text-violet-600 text-base font-normal',
          },
          buttonContent,
        ),
      ),
    ),
  );
  block.innerHTML = '';
  block.appendChild(bannerSection);
}
