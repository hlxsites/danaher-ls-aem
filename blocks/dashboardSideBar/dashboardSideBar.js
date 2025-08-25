import {
  div, p, span, a,
} from '../../scripts/dom-builder.js';
import {
  capitalizeFirstLetter,
} from '../../scripts/common-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

// eslint-disable-next-line
export default async function dashboardSidebar() {
// //   showPreLoader();
//   block?.parentElement?.parentElement?.removeAttribute('class');
//   block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const authenticationToken = await getAuthenticationToken();
  const sidepanelList = [
    { name: 'My Profile', icon: 'User' },
    { name: 'My address', icon: 'Location-marker' },
    { name: 'Payment Methods', icon: 'Currency-dollar' },
    { name: 'Dashboard', icon: 'Home' },
    { name: 'Order status', icon: 'Cube' },
    { name: 'Requested Quotes', icon: 'chat' },
    { name: 'Approved Quotes', icon: 'Document-duplicate' },
    // { name: 'Invoices', icon: 'document-text' },
    // { name: 'Communities', icon: 'Users' },
    // { name: 'Personalized Catalog', icon: 'shopping-cart' },
    // { name: 'Training', icon: 'Academic-cap' },
    // { name: 'Kowledge Center', icon: 'Light-bulb' },
    // { name: 'Manage Equipment', icon: 'Server' },
    // { name: 'Report Product Complaint', icon: 'Emoji-sad' }
  ];
  const sidePanelDiv = (name, icon) => {
    const url = name.replace(/\s+/g, '').toLowerCase();
    const innerDiv = div(
      {
        class:
          'self-stretch px-6 inline-flex justify-start items-center gap-28',

      },
      div(
        {
          class: 'sidePanel-content flex justify-start items-center gap-3',

        },
        span({
          class: `icon icon-${icon} [&_svg>use]:stroke-black !w-[60px] !h-[60px] p-[18px]`,
        }),
        a(
          {
            href: `/us/en/e-buy/${url}`,
            class: 'justify-start text-base font-medium leading-snug',
            id: name.replace(/\s+/g, ''),
          },
          name,
        ),
        // div(
        //   {
        //     class:
        //       'justify-start text-base font-medium leading-snug',
        //     id: name.replace(/\s+/g, ''),
        //   },
        //   name,
        // ),
      ),
    );
    return innerDiv;
  };

  let userData = {};
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  userData = JSON.parse(authenticationToken.user_data);

  const sidebar = div(
    {
      id: 'dashboardSidebar',
      class: 'bg-white gap-5 w-full md:w-[25%] flex flex-col items-center border-l border-r border-b border-t border-gray-300',
    },
    div(
      { class: 'w-full px-6 flex flex-col items-center gap-5' },
      div({
        class:
          'h-[131px] w-full mt-4 w-full bg-danaherpurple-800 justify-center  flex flex-col items-center',
      }),
      div(
        {
          class:
            'h-[100px] w-[100px] mt-[-75px] border-2 bg-danaherpurple-500 border-white rounded-full flex items-center justify-center',
        },
        p(
          {
            class: 'text-white !text-4xl font-medium leading-[48px]',
          },
          userData?.userData?.firstName?.charAt(0).toUpperCase(),
          userData?.userData?.lastName?.charAt(0).toUpperCase(),
        ),
      ),
      p(
        {
          class: 'text-xl text-black font-medium leading-7',
        },
        `${capitalizeFirstLetter(
          userData?.userData?.firstName,
        )} ${capitalizeFirstLetter(userData?.userData?.lastName)}`,
      ),
      p(
        {
          class: 'text-sm  text-black font-medium leading-tight',
        },
        capitalizeFirstLetter(userData?.customerData?.companyName),
      ),
    ),
    div({
      class: 'w-full h-[2px]',
    }),
    div(
      { class: 'w-full px-6 flex flex-col' },
      a(
        {
          href: '/us/en/e-buy/cartlanding',
          class:
            'w-full text-base  border-danaherpurple-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        },
        'View Cart',
      ),
    ),
    div(
      { class: 'w-full px-6 flex flex-col' },
      a(
        {
          href: '/us/en/e-buy/orderSubmit?orderId=10000123',
          class:
            'w-full text-base  border-danaherpurple-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        },
        'View Order Submit',
      ),
    ),

  );
  const listDiv = div({
    class: 'self-stretch relative bg-white border-t border-gray-300 inline-flex flex-col justify-start items-start gap-1.5',
  });
  sidebar.append(listDiv);
  sidepanelList.map((item) => listDiv.append(sidePanelDiv(item.name, item.icon)));
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  let targetedPage = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  console.log("targetedPage", targetedPage);
  if(targetedPage === "Orderdetails"){
    targetedPage = "Orderstatus"
  }
  //   listDiv.addEventListener('click', (event) => {
  const allItemsInDiv = listDiv.querySelectorAll('.sidePanel-content');
  allItemsInDiv.forEach((itemsInDiv) => {
    const childWithId = itemsInDiv.querySelector(`#${targetedPage.replace(/\s+/g, '')}`);
    if (childWithId) {
      const borderOfDiv = childWithId.parentElement.parentElement;
      const itemClicked = childWithId.parentElement;
      const iconSpan = itemClicked.querySelector('.icon');
      borderOfDiv.classList.remove(
        'border-l',
        'border-gray-300',
      );
      borderOfDiv.classList.add(
        'border-l-[4px]',
        'border-danaherpurple-500',
      );
      iconSpan.classList.remove('[&_svg>use]:stroke-black');
      iconSpan.classList.add('[&_svg>use]:stroke-danaherpurple-500');
      childWithId.classList.add('text-danaherpurple-500');
    } else {
      const borderDiv = itemsInDiv.parentElement;
      // console.log('event.target.textContent', borderDiv);
      const itemsNotclicked = itemsInDiv;
      const iconSpan = itemsNotclicked.querySelector('.icon');
      borderDiv.classList.remove(
        'border-l-[4px]',
        'border-danaherpurple-500',
      );
      itemsInDiv.querySelector('a').classList.remove('text-danaherpurple-500');
      itemsInDiv.querySelector('a').classList.add('text-black');
      iconSpan.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
      iconSpan.classList.add('[&_svg>use]:stroke-black');
    }
  });
  //   });
  decorateIcons(sidebar);
  return sidebar;
}
