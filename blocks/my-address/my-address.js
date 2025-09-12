import { div } from "../../scripts/dom-builder.js";
import dashboardSidebar from "../dashboardSideBar/dashboardSideBar.js";
import { removePreLoader, showPreLoader } from "../../scripts/common-utils.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import { addressList } from "../../scripts/cart-checkout-utils.js";
import { renderAddressList, addressListModal } from "../checkout/shippingAddress.js";

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const wrapper = div({
    id: "dashboardWrapper",
    class:
      "flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12",
  });
  const dashboardSideBarContent = await dashboardSidebar();
  const addressWrapper  = div({
    class: "w-[70%] inline-flex flex-col justify-start items-start gap-5 ",
  });
  const addressTitleDiv = div(
    {
      class: 'self-stretch p-6 flex flex-col justify-start items-start gap-4',
    },
    div({
      class: 'self-stretch justify-start text-black text-3xl font-normal leading-10',
    }, 'My Address'),
    div({
      class: 'self-stretch justify-start text-black text-base font-extralight leading-snug',
    }, 'Manage your shipping and billing info—your address book is always within reach.'),
  );
    const quoteWrapper = div(
    {
      class:
          'w-full ml-[20px] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center',
      id: 'orderWrapper',
    },
  );
   const addressItems = div({
    class:
      'w-full flex flex-col gap-6 pt-0',
    id: `shippingAddressListItemsWrapper`,
  });
  const addressListData = await addressList("shipping");
const addressListWrapperClass = div({
    class: 'w-full flex flex-col',
    id: `shippingAddressListModal`,
  });
    // addressItems.textContent = '';
    const addressesModal = await addressListModal("shipping", addressItems, addressListWrapperClass);
    console.log("addressesModal", addressesModal)
    // const loadShippingMethodsModule = renderAddressList(addressItems, addressListData, "shipping");
    // console.log("renderlist", renderAddressList(addressItems, addressListData, "shipping"))
    quoteWrapper.append(addressesModal);
    // quoteWrapper.append(loadShippingMethodsModule);
  addressWrapper.append(addressTitleDiv);
  addressWrapper.append(quoteWrapper)
  wrapper.append(dashboardSideBarContent, addressWrapper );
  block.innerHTML = "";
  block.textContent = "";
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}
