import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const orderDetailsWrapper = div({
    class: 'self-stretch inline-flex flex-col justify-start items-start gap-5 ',
  });
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
          'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const goBackToOrderStatusLink = div(
    {
      class: 'inline-flex justify-start items-start gap-2',
    },
    div(
      {
        class:
              'w-6 h-6 relative overflow-hidden cursor-pointer',
      },
      span({
        class:
              'icon icon-arrow-left cursor-pointer pointer-events-none w-4 h-2 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
    div({
      class: 'justify-start text-violet-600 text-base font-bold leading-snug',
    }, 'Go Back to Order Status'),
  );

  orderDetailsWrapper.append(goBackToOrderStatusLink);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, orderDetailsWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}
