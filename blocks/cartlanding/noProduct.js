import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export const noProducts = (searchedWord) => {
  const cubeButton = div(
    {
      class: 'w-full relative overflow-hidden',
    },
    span({
      class:
        'icon icon-Cube w-[200px] h-[60px] [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
    })
  );
  decorateIcons(cubeButton);
  const noProductDiv = div(
    {
      class:
        'no-product-found w-[1358px] text-center justify-center inline-flex flex-col gap-2',
    },
    div(
      {
        class: 'w-full relative overflow-hidden',
      },
      cubeButton
    ),
    div(
      {
        class:
          'self-stretch inline-flex flex-col justify-start items-center gap-4',
      },
      div(
        {
          class:
            'w-full inline-flex flex-col text-center justify-start text-black text-2xl font-bold',
        },
        span(
          {
            class: 'text-gray-900 text-4xl font-normal',
          },
          'We’re sorry.'
        ),
        span(
          {
            class: 'text-gray-900 text-2xl font-normal',
          },
          `We could not find a product match for "${searchedWord}"`
        )
      ),
      div(
        {
          class:
            'self-stretch text-center justify-start text-black text-base font-extralight',
        },
        'Check for typos, spelling errors, search by part number or try a different keyword'
      )
    )
  );

  return noProductDiv;
};
