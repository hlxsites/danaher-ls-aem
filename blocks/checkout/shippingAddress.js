import {
  h2,
  h3,
  h5,
  span,
  div,
  p,
  button,
  form,
} from "../../scripts/dom-builder.js";

// prebuilt function to render icons based on the class used i.e: icon icon-search
import { decorateIcons } from "../../scripts/lib-franklin.js";

// import  functions / modules from checkout utilities...
import {
  shippingCountries,
  shippingStates,
  shippingAddressList,
  buildCountryStateSelectBox,
  buildSearchWithIcon,
  initializeAutocomplete,
} from "./checkoutUtilities.js";
// import  functions / modules from common utilities...
import {
  buildInputElement,
  buildButton,
  createModal,
  buildCheckboxElement,
  closeUtilityModal,
} from "../../scripts/common-utils.js";

// google place api to autopopulate the address fields
function handlePlaceSelection(place) {
  if (!place.address_components) return;

  const addressComponents = place.address_components;
  const componentForm = {
    street_number: "shippingAddress1",
    route: "shippingAddress1",
    locality: "shippingCity",
    administrative_area_level_1: "shippingState",
    country: "shippingCountry",
    postal_code: "shippingZipCode",
  };

  addressComponents.forEach((component) => {
    const field = componentForm[component.types[0]];
    if (field) {
      document.getElementById(field).value = component.long_name;
    }
  });
}

// Initialize autocomplete on address input field
document.addEventListener("DOMContentLoaded", () => {
  initializeAutocomplete("shippingAddress1", handlePlaceSelection);
});

//default shipping address if available when user lands on checkout page
const defaultShippingAddress = (address) => {
  const defaultAddress = div(
    {
      class: "hidden",
      id: "defaultShippingAddress",
    },
    div(
      {
        class: " flex flex-col ",
      },
      h5(
        {
          class: "font-bold",
        },
        "Cell Line Lab"
      ),
      p(
        {
          class: "text-black text-base font-extralight",
        },
        "555 Second Ave"
      ),
      p(
        {
          class: "text-black text-base font-extralight",
        },
        "San Francisco, CA 35328"
      ),
      button(
        {
          class:
            "flex mt-4 justify-start bg-white  text-danaherpurple-500 p-0 text-base font-bold",
          id: "editShippingAddress",
        },
        "Edit / Change"
      )
    )
  );

  const showShippingAddressModal = defaultAddress.querySelector(
    "#editShippingAddress"
  );
  if (showShippingAddressModal) {
    showShippingAddressModal.addEventListener("click", function (e) {
      e.preventDefault();

      // load modal for shipping address list...
      const shippingAddressesModal = shippingAddressListModal();
      createModal(shippingAddressesModal, false, true);
    });
  }
  return defaultAddress;
};

//default billing address if available when use lands on checkout page
const defaultBillingAddress = (address) => {
  const defaultAddress = div(
    {
      class: "hidden",
      id: "defaultBillingAddress",
    },
    div(
      {
        class: "flex flex-col",
      },
      h5(
        {
          class: "font-bold",
        },
        "Company Headquarters"
      ),
      p(
        {
          class: "text-black text-base font-extralight",
        },
        "1459 Main street"
      ),
      p(
        {
          class: "text-black text-base font-extralight",
        },
        "Suite 205"
      ),
      p(
        {
          class: "text-black text-base font-extralight",
        },
        "New York, NY 10992"
      ),
      button(
        {
          class:
            "flex mt-4 justify-start bg-white  text-danaherpurple-500 p-0 text-base font-bold",
          id: "editBillingAddress",
        },
        "Edit / Change"
      )
    )
  );

  const showShippingAddressModal = defaultAddress.querySelector(
    "#editBillingAddress"
  );
  if (showShippingAddressModal) {
    showShippingAddressModal.addEventListener("click", function (e) {
      e.preventDefault();
      const shippingAddressesModal = shippingAddressListModal();
      createModal(shippingAddressesModal, false, true);
    });
  }
  return defaultAddress;
};

// generate the shipping address form..........
function shippingAddressForm(data = {}) {
  const shippingAdressForm = form(
    {
      id: "shippingAddressForm",
      class:
        "shipping-address-form text-sm w-full max-w-xl box-border overflow-hidden rounded-xl",
      action: "",
      method: "POST",
    },
    div(
      {
        class: "form-title flex  gap-2",
      },
      h3(
        {
          class:
            "justify-start text-black text-2xl font-normal font-['TWK_Lausanne_Pan'] leading-loose",
        },
        "Add new shipping address"
      )
    ),
    buildInputElement(
      "firstName",
      "First Name",
      "text",
      "firstName",
      false,
      true,
      "firstName"
    ),
    buildInputElement(
      "lastName",
      "Last Name",
      "text",
      "lastName",
      false,
      true,
      "lastName"
    ),
    buildInputElement(
      "companyName2",
      "Company Name",
      "text",
      "companyName2",
      false,
      true,
      "companyName2"
    ),
    buildInputElement(
      "addressLine1",
      "Street Address",
      "text",
      "addressLine1",
      false,
      true,
      "addressLine1"
    ),
    buildInputElement(
      "addressLine2",
      "Street Address Line 2",
      "text",
      "addressLine2",
      false,
      false,
      "addressLine2"
    ),
    buildCountryStateSelectBox(
      "countryCode",
      "Country / Region",
      "countryCode",
      true,
      "countryCode",
      shippingCountries.data
    ),
    buildCountryStateSelectBox(
      "mainDivision",
      "State",
      "mainDivision",
      true,
      "mainDivision",
      shippingCountries.data
    ),
    buildInputElement("city", "City", "text", "city", false, true, "city"),
    buildInputElement(
      "postalCode",
      "Zipcode",
      "text",
      "postalCode",
      false,
      true,
      "postalCode"
    ),
    buildButton(
      "Save",
      "saveShippingAddress",
      " proceed-button text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple mt-6 rounded-full px-6"
    )
  );
  return shippingAdressForm;
}

// generates the shipping address module for the checkout module/page........
export const shippingAddressModule = () => {
  const moduleContent = div({});
  const moduleShippingDetails = div(
    {
      class: "border-b border-black border-solid flex flex-col pt-6 pb-4 mb-4",
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
          "self-stretch justify-start text-black text-base font-extralight font-['TWK_Lausanne_Pan'] ",
      },
      "Where should we ship your products to? Add a new address or picked from your saved addresses to streamline your checkout process."
    )
  );
  const moduleBillingDetails = div(
    {
      class: "border-b border-black border-solid flex flex-col pt-6 pb-4 mb-4",
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
          "self-stretch justify-start text-black text-base font-extralight font-['TWK_Lausanne_Pan'] ",
      },
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id commodo erat, et vulputate lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
    )
  );
  const shippingAsBillingAddress = buildCheckboxElement(
    "shippingAsBillingAddress",
    "Same as shipping address",
    "checkbox",
    "shippingAsBillingAddress",
    true,
    false
  );
  // handle the checkbox to set/unset shipping as billing address
  const shippingAsBillingAddressInput =
    shippingAsBillingAddress.querySelector("input");
  if (shippingAsBillingAddressInput) {
    shippingAsBillingAddressInput.addEventListener("change", function () {
      const showDefaultBillingAddress = document.querySelector(
        "#defaultBillingAddress"
      );
      if (shippingAsBillingAddressInput.checked) {
        if (showDefaultBillingAddress) {
          showDefaultBillingAddress.classList.add("hidden");
        }
      } else {
        if (showDefaultBillingAddress) {
          if (showDefaultBillingAddress.classList.contains("hidden")) {
            showDefaultBillingAddress.classList.remove("hidden");
          }
        }
      }
    });
  }

  const shippingForm = shippingAddressForm();

  const showDefaultShippingAddress = defaultShippingAddress(true);
  const showDefaultBillingAddress = defaultBillingAddress(true);
  moduleContent.append(moduleShippingDetails);
  moduleContent.append(shippingForm);

  if (showDefaultShippingAddress) {
    moduleContent.append(showDefaultShippingAddress);
  }

  moduleContent.append(moduleBillingDetails);
  moduleContent.append(shippingAsBillingAddress);

  if (showDefaultBillingAddress) {
    moduleContent.append(showDefaultBillingAddress);
  }
  return moduleContent;
};

// generate the shipping address list module.....
const shippingAddressListModal = () => {
  const addressListWrapper = div({
    class: "flex flex-col",
    id: "shippingAddressListModal",
  });
  const addressListHeader = div(
    {
      class: "flex flex-col",
      id: "shippingAddressListModalHeader",
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
        id: "shippingAddressListHeaderActions",
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
          id: "shippingAddressListAddButton",
        },
        span({
          class:
            "icon plus-circle fill-current cursor-pointer [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
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
      "#shippingAddressListAddButton"
    );
    if (addNewAddress) {
      addNewAddress.addEventListener("click", function () {
        closeUtilityModal();
        const shippingFormModal = shippingAddressForm();
        createModal(shippingFormModal, true, true);
      });
    }
  }
  const addressListContent = div({
    class: "flex flex-col",
    id: "shippingAddressListModalContent",
  });

  const addressItems = div({
    class:
      "py-8 max-h-97 overflow-auto pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500",
    id: "shippingAddressListItemsWrapper",
  });
  const addressList = shippingAddressList.data;
  if (addressList) {
    renderAddressList(addressItems, addressList);
  }

  // search functionality for search for address list popup
  const addressListSearchInput = addressListHeader.querySelector(
    "#shippingAddressListSearch input"
  );
  if (addressListSearchInput) {
    addressListSearchInput.addEventListener("input", function (e) {
      e.preventDefault();
      const searchTerm = e.target.value.toLowerCase();
      const searchedAddress = addressList.filter((address) => {
        return address.addressLine1.toLowerCase().includes(searchTerm);
      });
      renderAddressList(addressItems, searchedAddress);
    });
  }
  decorateIcons(addressListHeader);
  decorateIcons(addressItems);
  addressListWrapper.append(addressListHeader);
  addressListContent.append(addressItems);
  addressListWrapper.append(addressListContent);

  return addressListWrapper;
};

const renderAddressList = (addressItems, addressList) => {
  addressItems.textContent = "";
  if (addressList.length > 0) {
    addressList.map((item, index) => {
      let defaultBgClass = "";
      if (item.usage[1]) {
        defaultBgClass = "is-default-shipping-address";
      }
      const addressListItem = div(
        {
          class: `:hover:bg-gray-100 flex justify-between shipping-address-list-item ${defaultBgClass}`,
        },
        div(
          {
            class: "flex flex-col shipping-address-list-item-content",
            id: `shippingAddressListContentActions-${index}`,
          },
          p(
            {
              class: "text-bold text-md text-black",
            },
            item.addressLine1
          ),
          p({
            class: "text-bold text-sm text-extralight",
          }),
          p(
            {
              class: "text-bold text-sm text-extralight",
            },
            `${item.mainDivision}, ${item.countryCode}, ${item.postalCode}`
          ),
          p({
            class: "text-bold text-sm text-extralight",
          }),
          div(
            {
              class: "flex gap-4",
            },
            span(
              {
                class:
                  "text-danaherpurple-500 cursor-pointer flex mt-4 justify-start  text-base font-bold  border-solid border-danaherblue-500 border-r  pr-4",
              },
              "Edit"
            ),
            span(
              {
                class:
                  "flex mt-4 justify-start  text-base font-bold text-danaherpurple-500 cursor-pointer",
              },
              "Copy"
            )
          )
        ),
        div(
          {
            class: "shipping-address-list-item-actions",
            id: `shippingAddressListItemActions-${index}`,
          },
          button(
            {
              class:
                "shipping-address-use-buttontext-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6",
            },
            "Use address"
          )
        )
      );

      // button to set the shipping address as the default shipping address.........
      let makeDefaultButton = "";
      if (item.usage[1]) {
        makeDefaultButton = div(
          {
            class: "flex justify-between items-center gap-1",
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
          {},
          span(
            {
              class: "text-md text-danaherpurple-500 ",
            },
            "Make Default"
          )
        );
      }
      const listItem = addressListItem.querySelector(
        ".shipping-address-list-item-actions"
      );

      if (listItem) {
        listItem.append(makeDefaultButton);
      }
      addressItems.append(addressListItem);
    });
    // check if the address is default shipping address...
    const isDefaultShippingAddress = addressItems.querySelector(
      ".is-default-shipping-address"
    );
    if (isDefaultShippingAddress) {
      isDefaultShippingAddress.style.background = "rgba(245, 239, 255, 1)";
    }
  } else {
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
            id: "addNewShippingAddressButton",
          },
          "Add new address"
        ),
        button(
          {
            class:
              "text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6",
            id: "clearShippingAddressListSearch",
          },
          "Clear Search"
        )
      )
    );
    addressItems.append(emptyAddressListWrapper);

    const addNewShippingAddressButton = addressItems.querySelector(
      "#addNewShippingAddressButton"
    );
    const clearSearchButton = addressItems.querySelector(
      "#clearShippingAddressListSearch"
    );

    if (addNewShippingAddressButton) {
      addNewShippingAddressButton.addEventListener("click", function () {
        closeUtilityModal();
        const shippingFormModal = shippingAddressForm();
        createModal(shippingFormModal, true, true);
      });
    }

    if (clearSearchButton) {
      clearSearchButton.addEventListener("click", function () {
        // clear search functionality for search for address list popup
        const addressListSearchInput = document.querySelector(
          "#shippingAddressListSearch input"
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
