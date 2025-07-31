import {
  div, h1, p, span, a,
} from '../../scripts/dom-builder.js';
import {
  showPreLoader,
  removePreLoader,
  capitalizeFirstLetter,
} from '../../scripts/common-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { orderStatus } from './orderStatus.js';
import { recentOrders } from './recentOrder.js';

// eslint-disable-next-line
export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const authenticationToken = await getAuthenticationToken();
  const sidepanelList = [
                          {name: "My Profile", icon:"User"},
                          {name: "My address", icon:"Location-marker"},
                          {name: "Payment Methods", icon:"Currency-dollar"},
                          {name: "Dashboard", icon:"Home"},
                          {name: "Order status", icon:"Cube"},
                          {name: "Quote and Contracts", icon:"Document-duplicate"},
                          {name: "Invoices", icon:"document-text"},
                          {name: "Communities", icon:"Users"},
                          {name: "Personalized Catalog", icon:"shopping-cart"},
                          {name: "Training", icon:"Academic-cap"},
                          {name: "Kowledge Center", icon:"Light-bulb"},
                          {name: "Manage Equipment", icon:"Server"},
                          {name: "Report Product Complaint", icon:"Emoji-sad"}];
  const sidePanelDiv = (name, icon) => {
    const innerDiv = div(
      {
        class:
          "self-stretch px-6 inline-flex justify-start items-center gap-28",
        
      },
      div(
        {
          class: "sidePanel-content flex justify-start items-center gap-3",
         
        },
        span({
          class: `icon icon-${icon} [&_svg>use]:stroke-black !w-[60px] !h-[60px] p-[18px]`,
        }),
        div(
          {
            class:
              "justify-start text-base font-medium leading-snug",
            id: name.replace(/\s+/g, '')
          },
          name
        )
      )
    );
    return innerDiv;
  };
 
  let userData = {};
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  userData = JSON.parse(authenticationToken.user_data);

  // const dashboardTitle = block.querySelector(
  //   "[data-aue-prop='dashboardTitle']",
  // );
  const dashboardTitle = "Dashboard"

  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const sidebar = div(
    {
      id: 'dashboardSidebar',
      class: 'bg-white gap-5 w-full md:w-[20%] flex flex-col items-center border-l border-r border-b border-t border-gray-300',
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
      class: 'w-full bg-gray-100 h-[2px]',
    }),
    div(
      { class: 'w-full px-6 flex flex-col' },
      a(
        {
          href: '/us/en/e-buy/cartlanding',
          class:
            'w-full text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
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
            'w-full text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        },
        'View Order Submit',
      ),
    ),
    
  );
  const listDiv = div({
      class: "self-stretch relative bg-white border-t border-gray-300 inline-flex flex-col justify-start items-start gap-1.5"
    },
  );
  sidebar.append(listDiv);
  sidepanelList.map((item)=>{      
     return listDiv.append(sidePanelDiv(item.name, item.icon));
  });
  listDiv.addEventListener("click", (event) => {
    const allItemsInDiv = listDiv.querySelectorAll('.sidePanel-content');
    allItemsInDiv.forEach((div) => {
        const childWithId = div.querySelector(`#${event.target.textContent.replace(/\s+/g, '')}`);
        if(childWithId){  
          const borderOfDiv = childWithId.parentElement.parentElement;      
          const itemClicked = childWithId.parentElement;
          const iconSpan = itemClicked.querySelector(".icon");
          borderOfDiv.classList.remove(
            "border-l",
            "border-gray-300"
          );
          borderOfDiv.classList.add(
            "border-l-[4px]",
            "border-danaherpurple-500"
          );
          console.log("event.target.textContent", borderOfDiv);
          iconSpan.classList.remove("[&_svg>use]:stroke-black");
          iconSpan.classList.add("[&_svg>use]:stroke-danaherpurple-500");
          childWithId.classList.add("text-danaherpurple-500");
        }
        else{
          const borderDiv = div.parentElement;
          console.log("event.target.textContent", borderDiv);
          const itemsNotclicked = div;
          const iconSpan = itemsNotclicked.querySelector(".icon");
            borderDiv.classList.remove(
              "border-l-[4px]",
              "border-danaherpurple-500"
            );          
          div.querySelector("div").classList.remove("text-danaherpurple-500");
          div.querySelector("div").classList.add("text-black");
          iconSpan.classList.remove("[&_svg>use]:stroke-danaherpurple-500");
          iconSpan.classList.add("[&_svg>use]:stroke-black");
        }
 
    });
  });
  const content = div(
    {
      id: 'dashboardContent',
      class: 'flex p-6 pt-0 w-full flex-col gap-5 md:w-[80%]',
    },
    h1(
      {
        class: 'p-0 m-0',
      },
      dashboardTitle ?? '',
    ),
    div(
      {
        class: 'flex gap-5',
      },
      div(
        {
          class: 'w-[310px] h-[118px] bg-white flex items-center justify-center  gap-6 p-6',
        },
        span({
          class:
            'icon icon-shopping-cart [&_svg>use]:stroke-danaherpurple-500  bg-danaherpurple-25  rounded-full !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
        }),
        div(
          {
            class: 'flex flex-col',
          },
          p(
            {
              class: 'text-black !text-4xl font-medium leading-[48px]',
            },
            '0',
          ),
          p(
            {
              class: 'w-[178px] text-black',
            },
            'Open Order',
          ),
        ),
      ),
      div(
        {
          class: 'w-[310px] h-[118px] bg-white flex gap-6 p-6  items-center justify-center ',
        },
        span({
          class:
            'icon  icon-chat [&_svg>use]:stroke-danaherpurple-500 bg-danaherpurple-25 rounded-full  !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
        }),
        div(
          {
            class: 'flex flex-col',
          },
          p(
            {
              class: 'text-black !text-4xl font-medium leading-[48px]',
            },
            '0',
          ),
          p(
            {
              class: 'w-[178px] text-black',
            },
            'Requested Quote Item',
          ),
        ),
      ),
      div(
        {
          class: 'w-[310px] h-[118px] bg-white flex items-center justify-center  gap-6 p-6',
        },
        span({
          class:
            'icon icon-shopping-cart [&_svg>use]:stroke-danaherpurple-500  bg-danaherpurple-25  rounded-full !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
        }),
        div(
          {
            class: 'flex flex-col',
          },
          p(
            {
              class: 'text-black !text-4xl font-medium leading-[48px]',
            },
            '0',
          ),
          p(
            {
              class: 'w-[178px] text-black',
            },
            'Cancelled Order',
          ),
        ),
      ),
      // orderStatus()
    ),
  );
  const contentWrapper = div({
    class: "flex flex-col gap-[20px] w-[980px]"
  });
  // const orderBlock = await orderStatus();
  const order = recentOrders();
  contentWrapper.append(content);
  // contentWrapper.append(orderBlock);
contentWrapper.append(order);
  wrapper.append(sidebar, contentWrapper);

  decorateIcons(wrapper);
  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  removePreLoader();
}
