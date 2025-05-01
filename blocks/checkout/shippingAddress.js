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
  addressList,
  buildCountryStateSelectBox,
  initializeAutocomplete,
  getAddressDetails,
  updateAddresses,
  getAddresses,
  updateAddressToDefault,
} from "./checkoutUtilities.js";
// import  functions / modules from common utilities...
import {
  buildInputElement,
  buildButton,
  createModal,
  buildCheckboxElement,
  closeUtilityModal,
  buildSearchWithIcon,
  preLoader,
  removePreLoader,
  capitalizeFirstLetter,
  submitForm,
  getStates,
  getCountries,
  removeObjectKey,
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

//default shipping/billing address if available when user lands on checkout page
function defaultAddress(address, type) {
  const getDefaultAddressWrapper = document.querySelector(
    `#default${capitalizeFirstLetter(type)}Address`
  );
  if (getDefaultAddressWrapper) {
    getDefaultAddressWrapper.remove();
  }
  if (address) {
    const defaultAddress = div(
      {
        class: "hidden",
        id: `default${capitalizeFirstLetter(type)}Address`,
      },
      div(
        {
          class: " flex flex-col ",
        },
        h5(
          {
            class: "font-bold",
          },
          address.companyName2
        ),
        p(
          {
            class: "text-black text-base font-extralight",
          },
          address.addressLine1
        ),
        p(
          {
            class: "text-black text-base font-extralight",
          },
          address.city
        ),
        p(
          {
            class: "text-black text-base font-extralight",
          },
          `${address.mainDivision}, ${address.countryCode}, ${address.postalCode}`
        ),
        button(
          {
            class:
              "flex mt-4 justify-start bg-white  text-danaherpurple-500 p-0 pl-0 text-base font-bold",
            id: `edit${capitalizeFirstLetter(type)}Address`,
          },
          "Edit / Change"
        )
      )
    );

    const showAddressModal = defaultAddress.querySelector(
      `#edit${capitalizeFirstLetter(type)}Address`
    );
    if (showAddressModal) {
      showAddressModal.addEventListener("click", async function (e) {
        e.preventDefault();

        // load modal for shipping address list...
        const addressesModal = await addressListModal(type);
        createModal(addressesModal, false, true);
      });
    }
    return defaultAddress;
  } else {
    return false;
  }
}
// generate the shipping address form..........
async function addressForm(data = {}, type) {
  let countriesList = await getCountries();

  const adressForm = form(
    {
      id: `${type}AddressForm`,
      class: `${type}-address-form text-sm w-full max-w-xl box-border overflow-hidden rounded-xl`,
      action: "",
      method: "POST",
    },
    div(
      {
        class: "form-title flex  gap-2",
      },
      h3(
        {
          class: "justify-start text-black text-2xl font-normal  leading-loose",
        },
        `Add new ${type} address`
      )
    ),
    buildInputElement(
      "firstName",
      "First Name",
      "text",
      "firstName",
      false,
      true,
      "firstName",
      data ? data.firstName : ""
    ),
    buildInputElement(
      "lastName",
      "Last Name",
      "text",
      "lastName",
      false,
      true,
      "lastName",
      data ? data.lastName : ""
    ),
    buildInputElement(
      "companyName2",
      "Company Name",
      "text",
      "companyName2",
      false,
      true,
      "companyName2",
      data ? data.companyName2 : ""
    ),
    buildInputElement(
      "addressLine1",
      "Street Address",
      "text",
      "addressLine1",
      false,
      true,
      "addressLine1",
      data ? data.addressLine1 : ""
    ),
    buildInputElement(
      "addressLine2",
      "Street Address Line 2",
      "text",
      "addressLine2",
      false,
      false,
      "addressLine2",
      data ? data.addressLine2 : ""
    ),
    buildInputElement(
      `preferred${capitalizeFirstLetter(type)}Address`,
      "",
      "hidden",
      `preferred${capitalizeFirstLetter(type)}Address`,
      false,
      false,
      `preferred${capitalizeFirstLetter(type)}Address`,
      true
    ),
    buildCountryStateSelectBox(
      "countryCode",
      "Country / Region",
      "countryCode",
      true,
      "countryCode",
      countriesList,
      data ? data.countryCode : ""
    ),
    buildCountryStateSelectBox(
      "mainDivision",
      "State",
      "mainDivision",
      true,
      "mainDivision",
      data ? [data.mainDivision] : "",
      data ? data.mainDivision : ""
    ),
    buildInputElement(
      "city",
      "City",
      "text",
      "city",
      false,
      true,
      "city",
      data ? data.city : ""
    ),
    buildInputElement(
      "postalCode",
      "Zipcode",
      "text",
      "postalCode",
      false,
      true,
      "postalCode",
      data ? data.postalCode : ""
    ),
    buildButton(
      "Save",
      `save${capitalizeFirstLetter(type)}Address`,
      " proceed-button text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6"
    )
  );
  const saveAddressButton = adressForm.querySelector(
    `#save${capitalizeFirstLetter(type)}Address`
  );
  const selectedCountry = adressForm.querySelector(`#countryCode`);
  if (selectedCountry) {
    selectedCountry.addEventListener("change", async function (event) {
      const selectedCountryCode = event.target.value;
      const getCountryStates = await getStates(selectedCountryCode);
      const getStatesField = adressForm.querySelector("#mainDivision");
      getStatesField.innerHTML = "";
      getCountryStates.forEach((stateData) => {
        const stateOption = document.createElement("option");
        stateOption.value = stateData.id;
        stateOption.textContent = stateData.name;
        if (getStatesField) {
          getStatesField.appendChild(stateOption);
        }
      });
    });
  }
  if (saveAddressButton) {
    saveAddressButton.addEventListener("click", async function (event) {
      event.preventDefault();
      try {
        saveAddressButton.insertAdjacentElement("afterend", preLoader());
        /// submitting form::::::::::::::::::::::::::::::::::::::::::::::::::::

        const formToSubmit = document.querySelector(`#${type}AddressForm`);
        const formData = new FormData(formToSubmit);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        if (data) {
          removeObjectKey(`preferred${capitalizeFirstLetter(type)}Address`);
          Object.assign(formObject, { id: data.id, type: "MyAddress" });
        }
        type === "shipping" ? (formObject.usage = [false, true]) : "";
        type === "billing" ? (formObject.usage = [true, false]) : "";

        let method = data ? "PUT" : "POST";

        const addAddressResponse = await submitForm(
          `${type}AddressForm`,
          "/customers/-/myAddresses",
          method,
          formObject
        );
        if (typeof addAddressResponse === undefined) {
          saveAddressButton.insertAdjacentElement(
            "afterend",
            p(
              {
                class: "text-red-500 pl-6 text-xl",
              },
              "Error submitting address 1."
            )
          );
          return;
        }

        if (addAddressResponse.status === "success") {
          if (addAddressResponse.data.data.type === "Link") {
            const formToSubmit = document.querySelector(`#${type}AddressForm`);
            formToSubmit.classList.add("hidden");
            const showDefaultAddress = document.querySelector(
              `#${type}AddressHeader`
            );

            if (showDefaultAddress) {
              const addressURI =
                addAddressResponse.data.data.uri.split("myAddresses")[1];
              const address = await getAddressDetails(
                `customers/-/addresses${addressURI}`,
                type
              );
              const renderDefaultAddress = defaultAddress(address, type);
              if (showDefaultAddress) {
                if (renderDefaultAddress) {
                  // set this address as default address :::::::::::::
                  showDefaultAddress.insertAdjacentElement(
                    "afterend",
                    renderDefaultAddress
                  );
                  if (renderDefaultAddress.classList.contains("hidden")) {
                    renderDefaultAddress.classList.remove("hidden");
                  }
                  //:::::::::::: remove preloader :::::::::::::
                  removePreLoader();

                  // close utility modal ::::::::::::::
                  closeUtilityModal();

                  // update address list ::::::::::::::
                  await updateAddresses();
                }
              }
            }
          } else if (addAddressResponse.data.data.type === "Address") {
            const formToSubmit = document.querySelector(`#${type}AddressForm`);
            formToSubmit.classList.add("hidden");

            //:::::::::::: remove preloader :::::::::::::
            removePreLoader();

            // close utility modal ::::::::::::::
            closeUtilityModal();

            // update address list ::::::::::::::
            await updateAddresses();
          } else {
            saveAddressButton.insertAdjacentElement(
              "afterend",
              p(
                {
                  class: "text-red-500 pl-6 text-xl",
                },
                "Error submitting address."
              )
            );
            removePreLoader();
          }
        } else {
          saveAddressButton.insertAdjacentElement(
            "afterend",
            p(
              {
                class: "text-red-500 pl-6 text-xl",
              },
              "Error submitting address."
            )
          );

          removePreLoader();
          return;
        }
      } catch (error) {
        saveAddressButton.insertAdjacentElement(
          "afterend",
          p(
            {
              class: "text-red-500 pl-6 text-xl",
            },
            error.message
          )
        );

        removePreLoader();
        return;
      }
    });
  }
  return adressForm;
}

// generates the shipping address module for the checkout module/page........
export const shippingAddressModule = async () => {
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
  const shippingAsBillingAddress = buildCheckboxElement(
    "shippingAsBillingAddress",
    "Same as shipping address",
    "checkbox",
    "shippingAsBillingAddress",
    true,
    false,
    "border-t border-black border-solid pt-6 mt-4",
    false
  );
  // handle the checkbox to set/unset shipping as billing address
  const shippingAsBillingAddressInput =
    shippingAsBillingAddress.querySelector("input");
  try {
    if (shippingAsBillingAddressInput) {
      shippingAsBillingAddressInput.addEventListener("change", function () {
        const showDefaultBillingAddress = document.querySelector(
          "#defaultBillingAddress"
        );
        const showDefaultBillingAddressButton = document.querySelector(
          "#defaultBillingAddressButton"
        );
        if (shippingAsBillingAddressInput.checked) {
          if (showDefaultBillingAddress) {
            showDefaultBillingAddress.classList.add("hidden");
          }
          if (showDefaultBillingAddressButton) {
            showDefaultBillingAddressButton.classList.add("hidden");
          }
        } else {
          if (showDefaultBillingAddress) {
            if (showDefaultBillingAddress.classList.contains("hidden")) {
              showDefaultBillingAddress.classList.remove("hidden");
            }
          }
          if (showDefaultBillingAddressButton) {
            if (showDefaultBillingAddressButton.classList.contains("hidden")) {
              showDefaultBillingAddressButton.classList.remove("hidden");
            }
          }
        }
      });
    }
    // fetch shipping address form
    const shippingForm = await addressForm("", "shipping");

    moduleContent.append(moduleShippingDetails);

    const shippingAddressHeader = moduleContent.querySelector(
      "#shippingAddressHeader"
    );
    if (shippingAddressHeader) {
      shippingAddressHeader.insertAdjacentElement("afterend", preLoader());
    }

    const getAddressesResponse = await getAddresses();
    if (getAddressesResponse.length > 0) {
      const address = getAddressesResponse.filter((adr) => {
        return adr.preferredShippingAddress === "true";
      });

      const getShippingAdressesModuleHeader = moduleContent.querySelector(
        "#shippingAddressHeader"
      );
      if (address.length > 0) {
        const showDefaultShippingAddress = defaultAddress(
          address[0],
          "shipping"
        );
        if (getShippingAdressesModuleHeader) {
          if (getShippingAdressesModuleHeader) {
            const removePreLoader = moduleContent.querySelector("#preLoader");

            if (removePreLoader) {
              removePreLoader.remove();
            }
            if (showDefaultShippingAddress) {
              getShippingAdressesModuleHeader.insertAdjacentElement(
                "afterend",
                showDefaultShippingAddress
              );
              if (showDefaultShippingAddress.classList.contains("hidden")) {
                showDefaultShippingAddress.classList.remove("hidden");
              }
            }
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
      } else {
        if (getShippingAdressesModuleHeader) {
          if (shippingForm) {
            const removePreLoader = document.querySelector(
              ".checkout-shippingAddress-content #preLoader"
            );
            if (removePreLoader) {
              removePreLoader.remove();
            }
            getShippingAdressesModuleHeader.insertAdjacentElement(
              "afterend",
              shippingForm
            );
            if (shippingForm.classList.contains("hidden")) {
              shippingForm.classList.remove("hidden");
            }
          }
        }
      }
    }

    moduleContent.append(moduleBillingDetails);
    moduleBillingDetails.append(shippingAsBillingAddress);

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
    if (defaultBillingAddressButton) {
      defaultBillingAddressButton.addEventListener("click", function (event) {
        event.preventDefault();

        // load modal for billing form modal...
        closeUtilityModal();
        const addressFormModal = addressForm("", "billing");
        if (addressFormModal) {
          createModal(addressFormModal, true, true);
        }
      });
    }
    // set default billing address

    if (getAddressesResponse.length > 0) {
      const address = getAddressesResponse.filter((adr) => {
        return adr.preferredBillingAddress === "true";
      });

      if (address.length > 0) {
        const defaultBillingAddress = defaultAddress(address[0], "billing");
        if (defaultBillingAddress) {
          moduleContent.append(defaultBillingAddress);
        }
      } else {
        if (defaultBillingAddressButton) {
          moduleContent.append(defaultBillingAddressButton);
          closeUtilityModal();
        }
      }
    }
    return moduleContent;
  } catch (error) {
    return { status: "error", data: error.message };
  }
};

// generate the shipping address list module.....
const addressListModal = async (type) => {
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
          class:
            "icon icon-plus-circle fill-current cursor-pointer [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
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
      addNewAddress.addEventListener("click", async function () {
        closeUtilityModal();

        const addressFormModal = await addressForm("", type);
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
  addressItems.append(preLoader());
  const addressListData = await addressList(type);

  addressItems.textContent = "";
  renderAddressList(addressItems, addressListData, type);

  // search functionality for search for address list popup
  const addressListSearchInput = addressListHeader.querySelector(
    `#searchWithIcon input`
  );
  if (addressListSearchInput) {
    addressListSearchInput.addEventListener("input", function (e) {
      e.preventDefault();

      const searchTerm = e.target.value.toLowerCase();
      const searchedAddress = addressListData.filter((address) => {
        if (typeof address !== "undefined") {
          return address.addressLine1.toLowerCase().includes(searchTerm);
        }
      });
      renderAddressList(addressItems, searchedAddress, type);
    });
  }

  if (addressListHeader) decorateIcons(addressListHeader);
  if (addressItems) decorateIcons(addressItems);
  if (addressListHeader) addressListWrapper.append(addressListHeader);
  if (addressItems) addressListContent.append(addressItems);
  if (addressListContent) addressListWrapper.append(addressListContent);

  return addressListWrapper;
};

const renderAddressList = (addressItems, addressList, type) => {
  if (typeof addressList !== "undefined" && addressList.length > 0) {
    addressItems.textContent = "";

    addressList.forEach((item, index) => {
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
                class: `${type}-address-use-buttontext-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6`,
              },
              "Use address"
            )
          )
        );

        // button to set the ${type} address as the default  address.........
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
              class: `text-right not-default-${type}-address`,
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

        const listItem = addressListItem.querySelector(
          `.${type}-address-list-item-actions`
        );

        if (listItem) {
          listItem.append(makeDefaultButton);
        }
        addressItems.append(addressListItem);
      }
    });
    addressItems.addEventListener("click", async function (event) {
      event.preventDefault();
      if (
        event.target.parentElement.classList.contains(
          `not-default-${type}-address`
        )
      ) {
        const getParent = event.target.parentElement;
        if (getParent.classList.contains(`not-default-${type}-address`)) {
          const setAddressDetails = JSON.parse(
            getParent.getAttribute("data-address")
          );
          type === "shipping"
            ? Object.assign(setAddressDetails, {
                preferredShippingAddress: "true",
              })
            : Object.assign(setAddressDetails, {
                preferredBillingAddress: "true",
              });
          Object.assign(setAddressDetails, { type: "MyAddress" });
          const renderDefaultAddress = defaultAddress(setAddressDetails, type);
          const getDefaultAddressWrapper = document.querySelector(
            `#${type}AddressHeader`
          );
          if (getDefaultAddressWrapper) {
            if (renderDefaultAddress) {
              // set this address as default address :::::::::::::
              getDefaultAddressWrapper.insertAdjacentElement(
                "afterend",
                renderDefaultAddress
              );
              if (renderDefaultAddress.classList.contains("hidden")) {
                renderDefaultAddress.classList.remove("hidden");
              }

              // close utility modal ::::::::::::::
              closeUtilityModal();

              // update address ::::::::::::::
              await updateAddressToDefault(setAddressDetails);

              // update address list ::::::::::::::
              await updateAddresses();
            }
          }
        }
      }

      if (event.target.classList.contains(`edit-${type}-address-button`)) {
        const editAddress = JSON.parse(
          event.target.getAttribute("data-address")
        );
        if (editAddress) {
          const addressFormModal = await addressForm(editAddress, type);
          if (addressFormModal) {
            closeUtilityModal();
            createModal(addressFormModal, true, true);
          }
        }
      }
      // check if the address is default ${type} address...
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
      addNewAddressButton.addEventListener("click", function () {
        closeUtilityModal();
        const addressFormModal = addressForm("", "shipping");
        createModal(addressFormModal, true, true);
      });
    }

    if (clearSearchButton) {
      clearSearchButton.addEventListener("click", function () {
        // clear search functionality for search for address list popup
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
