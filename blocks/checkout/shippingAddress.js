import { h2, h3, h5, span, div, p, button } from "../../scripts/dom-builder.js";
/*
 ::::::::::::::
 prebuilt function to render icons based on the class used i.e: icon icon-search
 ::::::::::::::
 */
import { decorateIcons } from "../../scripts/lib-franklin.js";

/*
::::::::::::::::
import  functions / modules from common utilities
... :::::::::::::::::
*/
import {
  buildCheckboxElement,
  buildSearchWithIcon,
  capitalizeFirstLetter,
  closeUtilityModal,
  createModal,
  removePreLoader,
  showPreLoader,
} from "../../scripts/common-utils.js";
/*
::::::::::::::::::
import  functions / modules from checkout utilities...
:::::::::::::
*/
import {
  addressForm,
  addressList,
  defaultAddress,
  getAddresses,
  getBasketDetails,
  getUseAddresses,
  setUseAddress,
  updateBasketDetails,
  updateAddresses,
  updateAddressToDefault,
} from "../../scripts/cart-checkout-utils.js";

/*
 :::::::::::::::::::::::::::::
 Render Adress list for the address modal for shipping/billing
 ::::::::::::::::::::::::::::::
 * @param {HTML} id - The ID of the current address.
 * @param {Array} addressList - Shipping/Billing address list array.
 * @param {String} type - shipping/billing.
 */
const renderAddressList = (addressItems, addressListArray, type) => {
  if (typeof addressListArray !== "undefined" && addressListArray.length > 0) {
    addressItems.textContent = "";

    addressListArray.forEach((item, index) => {
      if (typeof item !== "undefined") {
        let defaultBgClass = "";
        if (type === "shipping" && typeof item !== "undefined") {
          if (item.preferredShippingAddress) {
            defaultBgClass = `is-default-${type}-address`;
          }
        }
        if (type === "billing" && typeof item !== "undefined") {
          if (item.preferredBillingAddress) {
            defaultBgClass = `is-default-${type}-address`;
          }
        }
        const addressListItem = div(
          {
            class: `:hover:bg-gray-100 flex justify-between ${type}-address-list-item ${defaultBgClass}`,
          },
          div(
            {
              class: `flex flex-col ${type}-address-list-item-content`,
              id: `${type}AddressListContentActions-${index}`,
            },
            h5(
              {
                class: "font-bold",
              },
              typeof item.companyName2 !== "undefined" ? item.companyName2 : ""
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              item.addressLine1
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              item.city
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              `${item.mainDivision}, ${item.countryCode}, ${item.postalCode}`
            ),
            div(
              {
                class: "flex gap-4",
              },
              span(
                {
                  class: `text-danaherpurple-500 cursor-pointer edit-${type}-address-button flex mt-4 justify-start  text-base font-bold  border-solid border-danaherblue-500 border-r  pr-4`,
                  "data-address": JSON.stringify(item),
                },
                "Edit"
              ),
              span(
                {
                  class:
                    "flex mt-4 justify-start  text-base font-bold text-danaherpurple-500 cursor-pointer",
                  "data-address": JSON.stringify(item),
                },
                "Copy"
              )
            )
          ),
          div(
            {
              class: `${type}-address-list-item-actions`,
              id: `${type}AddressListItemActions-${index}`,
            },
            button(
              {
                id: item.id,
                class: `${type}-address-use-button text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6`,
              },
              "Use address"
            )
          )
        );

        /*
        ::::::::::::::
        button to set the ${type} address as the default  address
        ::::::::::::::
        */
        let makeDefaultButton = "";
        if (item.preferredShippingAddress || item.preferredBillingAddress) {
          makeDefaultButton = div(
            {
              class: `flex justify-between items-center gap-1 is-default-${type}-address`,
            },
            span({
              class: "icon icon-check-circle",
            }),
            span(
              {
                class: "text-black",
              },
              "Default Address"
            )
          );
        } else {
          makeDefaultButton = div(
            {
              class: `relative text-right not-default-${type}-address`,
              "data-address": JSON.stringify(item),
            },
            span(
              {
                class: "text-md text-danaherpurple-500 ",
              },
              "Make Default"
            )
          );
        }

        /*
:::::::::::::::::::::::::::::
click use address button to set the address as default for current order
:::::::::::::::::::::::::::::
        */
        const useAddressButton = addressListItem.querySelector(
          `.${type}-address-use-button`
        );
        useAddressButton?.addEventListener("click", async (event) => {
          event.preventDefault();

          showPreLoader();
          const useAddressId = event.target.id;

          const useAddressButtonResponse = await setUseAddress(
            useAddressId,
            type
          );

          if (useAddressButtonResponse?.status === "success") {
            const invoiceToAddress = div(
              {
                id: "checkoutSummaryCommonBillToAddress",
                class:
                  "flex-col w-full border-solid border-2 rounded border-gray-400 px-4",
              },
              div(
                {
                  class: " flex flex-col pb-2",
                },
                h5(
                  {
                    class: "font-bold mb-2 mt-2",
                  },
                  "Bill to Address"
                ),
                h5(
                  {
                    class: "font-normal m-0",
                  },
                  useAddressButtonResponse?.data?.invoiceToAddress
                    ?.companyName2 ?? ""
                ),
                p(
                  {
                    class: "text-black text-base font-extralight",
                  },
                  useAddressButtonResponse?.data?.invoiceToAddress
                    ?.addressLine1 ?? ""
                ),
                p(
                  {
                    class: "text-black text-base font-extralight",
                  },
                  useAddressButtonResponse?.data?.invoiceToAddress?.city ?? ""
                ),
                p(
                  {
                    class: "text-black text-base font-extralight",
                  },
                  `${
                    useAddressButtonResponse?.data?.invoiceToAddress
                      ?.mainDivision ?? ""
                  }, ${
                    useAddressButtonResponse?.data?.invoiceToAddress
                      ?.countryCode ?? ""
                  }, ${
                    useAddressButtonResponse?.data?.invoiceToAddress
                      ?.postalCode ?? ""
                  }`
                )
              )
            );
            const checkoutSummaryWrapper = document.querySelector(
              "#checkoutSummaryWrapper"
            );
            checkoutSummaryWrapper
              ?.querySelector("#checkoutSummaryCommonBillToAddress")
              ?.remove();
            checkoutSummaryWrapper?.insertAdjacentElement(
              "afterbegin",
              invoiceToAddress
            );
            const renderDefaultAddress = defaultAddress(
              type === "shipping"
                ? useAddressButtonResponse.data?.commonShipToAddress
                : useAddressButtonResponse.data?.invoiceToAddress,
              type
            );
            const getDefaultAddressWrapper = document.querySelector(
              `#${type}AddressHeader`
            );
            if (getDefaultAddressWrapper && renderDefaultAddress) {
              /*
                ::::::::::::::
                show this address as default address
                :::::::::::::
                */
              getDefaultAddressWrapper.insertAdjacentElement(
                "afterend",
                renderDefaultAddress
              );
              if (renderDefaultAddress.classList.contains("hidden")) {
                renderDefaultAddress.classList.remove("hidden");
              }
            }

            /*
            ::::::::::::::
            update address list
            ::::::::::::::
            */
            await updateAddresses();
            /*
            ::::::::::::::
            update basket with the current use address
            ::::::::::::::
            */
            await updateBasketDetails();
            removePreLoader();
            /*
            ::::::::::::::
            close utility modal
            :::::::::::::::::::
            */
            closeUtilityModal();
          } else {
            removePreLoader();
            closeUtilityModal();
          }
        });

        const listItem = addressListItem.querySelector(
          `.${type}-address-list-item-actions`
        );

        if (listItem) {
          listItem.append(makeDefaultButton);
        }
        addressItems.append(addressListItem);
      }
    });
    addressItems.addEventListener("click", async (event) => {
      event.preventDefault();
      showPreLoader();
      if (
        event.target.parentElement.classList.contains(
          `not-default-${type}-address`
        )
      ) {
        const getParent = event.target.parentElement;
        if (getParent.classList.contains(`not-default-${type}-address`)) {
          if (event.target.textContent === "Make Default") {
            showPreLoader();
            const setAddressDetails = JSON.parse(
              getParent.getAttribute("data-address")
            );
            if (type === "shipping") {
              Object.assign(setAddressDetails, {
                preferredShippingAddress: "true",
              });
            } else {
              Object.assign(setAddressDetails, {
                preferredBillingAddress: "true",
              });
            }
            Object.assign(setAddressDetails, { type: "MyAddress" });

            /*
            ::::::::::::::
            update address
            ::::::::::::::
            */
            await updateAddressToDefault(setAddressDetails);
          }
          /*
          ::::::::::::::
          update address list
          ::::::::::::::
          */
          await updateAddresses();
          /*
          ::::::::::::::
          close utility modal
          ::::::::::::::
          */
          removePreLoader();
          closeUtilityModal();
        }
      }

      if (event.target.classList.contains(`edit-${type}-address-button`)) {
        const editAddress = JSON.parse(
          event.target.getAttribute("data-address")
        );
        if (editAddress) {
          const addressFormModal = await addressForm(type, editAddress);
          if (addressFormModal) {
            closeUtilityModal();
            createModal(addressFormModal, true, true);
            removePreLoader();
          }
        }
      }
      /*
      ::::::::::::::
      check if the address is default ${type} address
      ::::::::::::::
      */
      const isDefaultAddress = addressItems.querySelector(
        `.is-default-${type}-address`
      );
      if (isDefaultAddress) {
        isDefaultAddress.style.background = "rgba(245, 239, 255, 1)";
      }
    });
  } else {
    addressItems.textContent = "";
    const emptyAddressListWrapper = div(
      {
        class: "flex flex-col justify-between items-center w-full",
      },
      h3(
        {
          class: "text-black text-center flex items-center justify-center",
        },
        "Hmm, it looks like there are no addresses that match"
      ),
      p(
        {
          class: "text-gray-500 mb-6",
        },
        "Lets see how we can fix that"
      ),
      div(
        {
          class: "flex w-full justify-center gap-4 items-center mt-6",
        },
        button(
          {
            class:
              "text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple mt-6 rounded-full px-6",
            id: `addNew${capitalizeFirstLetter(type)}AddressButton`,
          },
          "Add new address"
        ),
        button(
          {
            class:
              "text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6",
            id: `clear${capitalizeFirstLetter(type)}AddressListSearch`,
          },
          "Clear Search"
        )
      )
    );
    addressItems.append(emptyAddressListWrapper);

    const addNewAddressButton = addressItems.querySelector(
      `#addNew${capitalizeFirstLetter(type)}AddressButton`
    );
    const clearSearchButton = addressItems.querySelector(
      `#clear${capitalizeFirstLetter(type)}AddressListSearch`
    );

    if (addNewAddressButton) {
      addNewAddressButton.addEventListener("click", async () => {
        closeUtilityModal();
        const addressFormModal = await addressForm(type, "");
        if (addressFormModal) {
          createModal(addressFormModal, true, true);
        }
      });
    }

    if (clearSearchButton) {
      clearSearchButton.addEventListener("click", () => {
        /*
        ::::::::::::::
        clear search functionality for search for address list popup
        ::::::::::::::
        */
        const addressListSearchInput = document.querySelector(
          "#searchWithIcon input"
        );
        if (addressListSearchInput) {
          addressListSearchInput.value = "";
          addressListSearchInput.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }
      });
    }
  }
  return addressItems;
};

/*
::::::::::::::
generate the shipping address list module
::::::::::::::
*/
export const addressListModal = async (type) => {
  const addressListWrapper = div({
    class: "flex flex-col",
    id: `${type}AddressListModal`,
  });
  const addressListHeader = div(
    {
      class: "flex flex-col",
      id: `${type}AddressListModalHeader`,
    },
    p(
      {
        class: "text-bold text-3xl",
      },
      "My Addresses"
    ),
    p(
      {
        class: "text-extralight text-sm",
      },
      "Select an address below"
    ),
    div(
      {
        class: "flex justify-between items-center my-4 py-4",
        id: `${type}AddressListHeaderActions`,
      },
      buildSearchWithIcon(
        "search",
        "search",
        "text",
        "search",
        false,
        false,
        "search",
        "Search addresses"
      ),
      div(
        {
          class: "flex justify-between gap-2",
          id: `${type}AddressListAddButton`,
        },
        span({
          class: "icon icon-plus-circle",
          id: "plusCircleIcon",
        }),
        p(
          {
            class: "flex justify-between text-danaherpurple-500 cursor-pointer",
          },
          "Add New Address"
        )
      )
    )
  );
  if (addressListHeader) {
    const addNewAddress = addressListHeader.querySelector(
      `#${type}AddressListAddButton`
    );
    if (addNewAddress) {
      addNewAddress.addEventListener("click", async () => {
        closeUtilityModal();
        /*
         :::::::::::::::::::::::
         generates addresses form
         ::::::::::::::::::::::::::::::::::::::
         */
        const addressFormModal = await addressForm(type, "");
        if (addressFormModal) {
          createModal(addressFormModal, true, true);
        }
      });
    }
  }
  const addressListContent = div({
    class: "flex flex-col",
    id: `${type}AddressListModalContent`,
  });
  const addressItems = div({
    class:
      "py-8 max-h-97 overflow-auto pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500",
    id: `${type}AddressListItemsWrapper`,
  });
  showPreLoader();
  /*
  :::::::::::::::::::::::
  get addresses from the Address API
  ::::::::::::::::::::::::::::::::::::::
  */
  const addressListData = await addressList(type);

  addressItems.textContent = "";
  renderAddressList(addressItems, addressListData, type);

  /*
  ::::::::::::::
  search functionality for search for address list popup
  ::::::::::::::
  */
  const addressListSearchInput = addressListHeader.querySelector(
    "#searchWithIcon input"
  );
  if (addressListSearchInput) {
    addressListSearchInput.addEventListener("input", (e) => {
      e.preventDefault();

      const searchTerm = e.target.value.toLowerCase();

      const searchedAddress = addressListData.filter((ad) => {
        const lowerCaseAddressLine1 = ad?.addressLine1?.toLowerCase();
        const lowerCasefirstName = ad?.firstName?.toLowerCase();
        const lowerCaselastName = ad?.lastName?.toLowerCase();
        const lowerCasestreet = ad?.street?.toLowerCase();
        const lowerCasestate = ad?.state?.toLowerCase();
        const lowerCasecountry = ad?.country?.toLowerCase();
        const lowerCasecity = ad?.city?.toLowerCase();
        const lowerCasemainDivisionName = ad?.mainDivisionName?.toLowerCase();
        const lowerCasepostalCode = ad?.postalCode;
        return (
          lowerCaseAddressLine1?.includes(searchTerm) ||
          lowerCasefirstName?.includes(searchTerm) ||
          lowerCaselastName?.includes(searchTerm) ||
          lowerCasestreet?.includes(searchTerm) ||
          lowerCasestate?.includes(searchTerm) ||
          lowerCasestreet?.includes(searchTerm) ||
          lowerCasecountry?.includes(searchTerm) ||
          lowerCasecity?.includes(searchTerm) ||
          lowerCasepostalCode?.includes(searchTerm) ||
          lowerCasemainDivisionName?.includes(searchTerm)
        );
      });
      renderAddressList(addressItems, searchedAddress, type);
    });
  }

  if (addressListHeader) addressListWrapper.append(addressListHeader);
  if (addressItems) addressListContent.append(addressItems);
  if (addressListContent) addressListWrapper.append(addressListContent);
  decorateIcons(addressListWrapper);

  return addressListWrapper;
};

/*
::::::::::::::::
add event listener to show address list modal...
:::::::::::::::::
*/
document.addEventListener("click", async (e) => {
  e.preventDefault();
  if (e.target.matches(".editAddressButton")) {
    /*
      ::::::::::::::
      load modal for shipping address list
      ::::::::::::::
      */
    const type = e.target.getAttribute("data-type");
    const action = e.target.getAttribute("data-action");
    if (type && action === "edit") {
      const addressesModal = await addressListModal(type);
      createModal(addressesModal, false, true);
      removePreLoader();
      return Promise.resolve({});
    }
    return Promise.resolve({});
  }
  return Promise.resolve({});
});
/* ::::::::::::::::::::
// if the use billing address is not set, we will show default address
// else will show add billing address button
// :::::::::::::::::::::::
*/
function generateDefaultAddress(
  getDefaultAddressesResponse,
  defaultBillingAddressButton,
  moduleContent
) {
  if (getDefaultAddressesResponse?.status === "success") {
    const address = getDefaultAddressesResponse?.data?.filter(
      (adr) => adr.preferredBillingAddress === "true"
    );

    if (address.length > 0) {
      const defaultBillingAddress = defaultAddress(address[0], "billing");

      if (defaultBillingAddress) {
        moduleContent.append(defaultBillingAddress);
        if (defaultBillingAddress.classList.contains("hidden")) {
          defaultBillingAddress.classList.remove("hidden");
        }
      }
    } else if (defaultBillingAddressButton) {
      moduleContent.append(defaultBillingAddressButton);
      const checkIfDefaultAddress = moduleContent.querySelector(
        "#defaultBillingAddress"
      );
      if (checkIfDefaultAddress) {
        checkIfDefaultAddress.remove();
      }
    }
  } else if (defaultBillingAddressButton) {
    moduleContent.append(defaultBillingAddressButton);
    const checkIfDefaultAddress = moduleContent.querySelector(
      "#defaultBillingAddress"
    );
    if (checkIfDefaultAddress) {
      checkIfDefaultAddress.remove();
    }
  }
}
/*
  ::::::::::::::
  generates the shipping address module for the checkout module/page
::::::::::::::
*/
export const shippingAddressModule = async () => {
  showPreLoader();
  const moduleContent = div({});
  const moduleShippingDetails = div(
    {
      class:
        "border-b relative border-black border-solid flex flex-col pt-6 pb-4 mb-4",
      id: "shippingAddressHeader",
    },
    h2(
      {
        class: "text-black text-left text-4xl font-normal leading-[48px]",
      },
      "Shipping address"
    ),
    p(
      {
        class:
          "self-stretch justify-start text-black text-base font-extralight  ",
      },
      "Where should we ship your products to? Add a new address or picked from your saved addresses to streamline your checkout process."
    )
  );
  const moduleBillingDetails = div(
    {
      class: "flex flex-col pt-6 pb-4 mb-4",
      id: "billingAddressHeader",
    },
    h2(
      {
        class: "text-black text-4xl text-left font-normal leading-[48px]",
      },
      "Bill to address"
    ),
    p(
      {
        class:
          "self-stretch justify-start text-black text-base font-extralight  ",
      },
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id commodo erat, et vulputate lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
    )
  );
  /*
  ::::::::::::::::::::::
  generates the checkbox to set biiling as shipping address
  ::::::::::::::
  */
  const shippingAsBillingAddress = buildCheckboxElement(
    "shippingAsBillingAddress",
    "Same as shipping address",
    "checkbox",
    "shippingAsBillingAddress",
    true,
    false,
    "border-t border-black border-solid pt-6 mt-4",
    false,
    false
  );
  /*
   ::::::::::::::
   handle the checkbox to set/unset shipping as billing address
   ::::::::::::::
   */
  const shippingAsBillingAddressInput =
    shippingAsBillingAddress.querySelector("input");

  try {
    /*
   ::::::::::::::
   get all addresses details added
   ::::::::::::::
   */
    const getDefaultAddressesResponse = await getAddresses();

    /*
   ::::::::::::::
   get addresses which are set as use address for the current order shipping/billing
   ::::::::::::::
   */
    const getUseAddressesResponse = await getUseAddresses();
    /*
    *
     ::::::::::::::::::::::::
     checkbox for shipping as billing address
     ::::::::::::::::::::::::
    *
    */
    shippingAsBillingAddressInput?.addEventListener("change", async () => {
      /*
   ::::::::::::::
   get addresses which are set as use address for the current order
   ::::::::::::::
   */
      const getCurrentBasketDetails = await getBasketDetails();
      /*
    *
     ::::::::::::::::::::::::
     checkbox for shipping as billing address
     ::::::::::::::::::::::::
    *
    */
      showPreLoader();
      const checkoutSummaryBillAddress = document.querySelector(
        "#checkoutSummaryCommonBillToAddress"
      );
      const showDefaultBillingAddress = document.querySelector(
        "#defaultBillingAddress"
      );
      const showDefaultBillingAddressButton = document.querySelector(
        "#defaultBillingAddressButton"
      );

      /*
     :::::::::::::::::
     check if  checkbox for shipping as billing address is checked
      ::::::::::::::::::::::::
    */

      if (shippingAsBillingAddressInput.checked) {
        showDefaultBillingAddress?.classList.add("hidden");

        showDefaultBillingAddressButton?.classList.add("hidden");

        if (
          getCurrentBasketDetails?.data?.data?.invoiceToAddress?.split(
            ":"
          )[4] !==
          getCurrentBasketDetails?.data?.data?.commonShipToAddress?.split(
            ":"
          )[4]
        ) {
          /*
     :::::::::::::::::
     check if  we have use address is set for shipping
      ::::::::::::::::::::::::
    */
          const setAddressDetails = {
            firstName:
              getUseAddressesResponse?.data?.commonShipToAddress?.firstName ??
              "",
            lastName:
              getUseAddressesResponse?.data?.commonShipToAddress?.lastName ??
              "",
            companyName2:
              getUseAddressesResponse?.data?.commonShipToAddress
                ?.companyName2 ?? "",
            addressLine1:
              getUseAddressesResponse?.data?.commonShipToAddress
                ?.addressLine1 ?? "",
            addressLine2:
              getUseAddressesResponse?.data?.commonShipToAddress
                ?.addressLine2 ?? "",
            city:
              getUseAddressesResponse?.data?.commonShipToAddress?.city ?? "",
            mainDivision:
              getUseAddressesResponse?.data?.commonShipToAddress
                ?.mainDivision ?? "",
            countryCode:
              getUseAddressesResponse?.data?.commonShipToAddress?.countryCode ??
              "",
            postalCode:
              getUseAddressesResponse?.data?.commonShipToAddress?.postalCode ??
              "",
            usage: [true, true],
          };
          /*
          ::::::::::::::
          update address to default
          ::::::::::::::
          */
          const updatingToDefault = await updateAddressToDefault(
            setAddressDetails
          );

          if (updatingToDefault?.status === "success") {
            /*
               ::::::::::::::
               assign billing address to basket
               ::::::::::::::::
               */
            const setAddressAsShipping = await setUseAddress(
              getUseAddressesResponse?.data?.commonShipToAddress?.id,
              "billing"
            );
            if (setAddressAsShipping?.status === "success") {
              checkoutSummaryBillAddress?.classList.add("hidden");
            }
          } else if (checkoutSummaryBillAddress?.classList.contains("hidden")) {
            checkoutSummaryBillAddress?.classList.remove("hidden");
          }

          /*
            ::::::::::::::
            update basket with the current use address
            ::::::::::::::
            */

          await updateBasketDetails();

          removePreLoader();
        } else if (checkoutSummaryBillAddress?.classList.contains("hidden")) {
          checkoutSummaryBillAddress?.classList.remove("hidden");
        }
      } else {
        /*
               ::::::::::::::
               if shipping as billing address not checked
               ::::::::::::::::
               */
        if (
          showDefaultBillingAddress &&
          showDefaultBillingAddress.classList.contains("hidden")
        ) {
          showDefaultBillingAddress.classList.remove("hidden");
        }

        if (
          showDefaultBillingAddressButton &&
          showDefaultBillingAddressButton.classList.contains("hidden")
        ) {
          showDefaultBillingAddressButton.classList.remove("hidden");
        }
      }
      removePreLoader();
    });

    /*
    :::::::::::::: load shipping address form::::::::::::::
    */
    const shippingForm = await addressForm("shipping", "");

    moduleContent?.append(moduleShippingDetails);

    const getShippingAdressesModuleHeader = moduleContent.querySelector(
      "#shippingAddressHeader"
    );
    /*
    *
    *
     ::::::::::::::::::::
     if the use-shipping-address is not set,
     we will show default address
     else will show add billing address button
     :::::::::::::::::::::::
     *
     *
     */
    if (
      getUseAddressesResponse?.status === "success" &&
      getUseAddressesResponse?.data?.commonShipToAddress
    ) {
      const showDefaultShippingAddress = defaultAddress(
        getUseAddressesResponse.data?.commonShipToAddress,
        "shipping"
      );
      if (getShippingAdressesModuleHeader && showDefaultShippingAddress) {
        getShippingAdressesModuleHeader.insertAdjacentElement(
          "afterend",
          showDefaultShippingAddress
        );
        if (showDefaultShippingAddress.classList.contains("hidden")) {
          showDefaultShippingAddress.classList.remove("hidden");
        }
      }

      const defaultShippingAddressWrapper = document.querySelector(
        "#defaultShippingAddress"
      );
      if (
        defaultShippingAddressWrapper &&
        defaultShippingAddressWrapper.classList.contains("hidden")
      ) {
        defaultShippingAddressWrapper.classList.remove("hidden");
      }
    } else {
      const address = getDefaultAddressesResponse.data.filter(
        (adr) => adr.preferredShippingAddress === "true"
      );

      if (address.length > 0) {
        const showDefaultShippingAddress = defaultAddress(
          address[0],
          "shipping"
        );
        if (getShippingAdressesModuleHeader && showDefaultShippingAddress) {
          getShippingAdressesModuleHeader.insertAdjacentElement(
            "afterend",
            showDefaultShippingAddress
          );

          await setUseAddress(address[0].id, "shipping");
          if (showDefaultShippingAddress.classList.contains("hidden")) {
            showDefaultShippingAddress.classList.remove("hidden");
          }
        }
        const defaultShippingAddressWrapper = document.querySelector(
          "#defaultShippingAddress"
        );
        if (defaultShippingAddressWrapper) {
          if (defaultShippingAddressWrapper.classList.contains("hidden")) {
            defaultShippingAddressWrapper.classList.remove("hidden");
          }
        }
      } else if (getShippingAdressesModuleHeader && shippingForm) {
        getShippingAdressesModuleHeader.insertAdjacentElement(
          "afterend",
          shippingForm
        );
        shippingForm.classList.remove("hidden");
        if (shippingForm.classList.contains("defaultBillingAddressFormModal")) {
          shippingForm.classList.remove("defaultBillingAddressFormModal");
        }
        shippingForm.classList.add("defaultShippingAddressFormModal");
        if (
          !shippingForm.classList.contains("defaultShippingAddressFormModal")
        ) {
          shippingForm.classList.add("defaultShippingAddressFormModal");
        }
      }
      // :::::::::::: remove preloader :::::::::::::
      removePreLoader();
      // ::::::::::::::close utility modal :::::::::::::::::::
      closeUtilityModal();
    }

    /*
    *
     ::::::::::::::::::::::::
     add billing / shipping details to shipping module
      ::::::::::::::::::::::::
    */
    moduleContent.append(moduleBillingDetails);
    moduleBillingDetails.append(shippingAsBillingAddress);
    /*
    *
     ::::::::::::::::::::::::
     default billing address section
      ::::::::::::::::::::::::
    *
    */
    const defaultBillingAddressButton = div(
      {
        class: "flex w-full items-start mt-6 hidden justify-start",
        id: "defaultBillingAddressButton",
      },
      button(
        {
          class:
            "w-xl text-white text-xl font-extralight btn btn-lg font-medium btn-primary-purple rounded-full px-6",
        },
        "Add Billing Address"
      )
    );

    /*
::::::::::::::::::::::::::::
add click event to default billing address button
 ::::::::::::::::::::::::::::::
    */
    defaultBillingAddressButton?.addEventListener("click", async (event) => {
      event.preventDefault();

      // load modal for billing form modal...
      closeUtilityModal();
      const addressFormModal = await addressForm("billing", "");
      if (addressFormModal) {
        if (
          addressFormModal.classList.contains("defaultShippingAddressFormModal")
        ) {
          addressFormModal.classList.remove("defaultShippingAddressFormModal");
        }
        if (
          !addressFormModal.classList.contains("defaultBillingAddressFormModal")
        ) {
          addressFormModal.classList.add("defaultBillingAddressFormModal");
        }
        createModal(addressFormModal, true, true);
      }
    });

    /*
    *
    *
    *
  ::::::::::::::
  set default billing address
  ::::::::::::::

   :::::::::::::
   check if the use address is set by
   ::::::::::::::::::::::::::
   *
   */
    if (
      getUseAddressesResponse?.status === "success" &&
      getUseAddressesResponse?.data?.invoiceToAddress
    ) {
      /*
       * ::::::::::::::::::::::::::::::
       * call default address function and set the address from useAdress as default address
       * ::::::::::::::::::::::::::
       */
      const defaultBillingAddress = defaultAddress(
        getUseAddressesResponse.data?.invoiceToAddress,
        "billing"
      );

      if (defaultBillingAddress) {
        moduleContent.append(defaultBillingAddress);
        /*
::::::::::::::::::::::::::::
show default billing address else mark shippingAsBilling checkbox as checked
::::::::::::::::::::::::::::
*/
        if (
          getUseAddressesResponse?.data?.invoiceToAddress &&
          getUseAddressesResponse?.data?.invoiceToAddress?.id !==
            getUseAddressesResponse?.data?.commonShipToAddress?.id
        ) {
          defaultBillingAddress.classList.remove("hidden");
          const shippingAsBillingAddressCheckBox = moduleContent.querySelector(
            "#shippingAsBillingAddress"
          );
          if (
            shippingAsBillingAddressCheckBox &&
            !getUseAddressesResponse?.data?.commonShipToAddress
          ) {
            shippingAsBillingAddressCheckBox.parentElement.style.pointerEvents =
              "none";
            shippingAsBillingAddressCheckBox.parentElement.style.opacity =
              "0.5";
          }
        } else {
          defaultBillingAddress.classList.add("hidden");
          if (shippingAsBillingAddressInput)
            shippingAsBillingAddressInput.checked = "checked";
        }
      }
    } else {
      /*
      ::::::::::::::::::::
       if the use billing address is not set,
       we will show default address
       else will show add billing address button
       :::::::::::::::::::::::
      */
      generateDefaultAddress(
        getDefaultAddressesResponse,
        defaultBillingAddressButton,
        moduleContent,
        "billing"
      );
    }
    // :::::::::::: remove preloader :::::::::::::
    removePreLoader();

    // :::::::::::::: close utility modal ::::::::::::::
    closeUtilityModal();

    return moduleContent;
  } catch (error) {
    // :::::::::::: remove preloader :::::::::::::
    removePreLoader();

    // :::::::::::::: close utility modal ::::::::::::::
    closeUtilityModal();

    return div(
      h5({ class: "text-red" }, "Error Loading Shipping Address Module.")
    );
  }
};
