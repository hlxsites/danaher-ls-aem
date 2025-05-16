import {
  div,
  p,
  h2,
  input,
  label,
  span,
  button,
  select,
  option,
} from "../../scripts/dom-builder.js";
import {
  postApiData,
  putApiData,
  patchApiData,
  getApiData,
  baseURL,
  getAuthenticationToken,
  closeUtilityModal,
  updateBasketDetails,
  showPreLoader,
  removePreLoader,
  getBasketDetails,
} from "../../scripts/common-utils.js";
import { shippingAddressModule } from "./shippingAddress.js";
import { shippingMethodsModule } from "./shippingMethods.js";
import { checkoutSummary } from "./checkoutSummary.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

/*
 ::::::::::::::
 shipping states will get from api based on the selected country
 ::::::::::::::
 */
export const shippingStates = "";

/* 
::::::::::::::
shipping address list will get it from the api under my-account -  get addresses
::::::::::::::
*/
export async function addressList(type) {
  const getAddressesData = await getAddresses();

  if (getAddressesData.status === "success") {
    return getAddressesData.data.filter((adr) =>
      type === "billing" ? adr.usage[0] === true : adr.usage[1] === true
    );
  } else {
    return [];
  }
}
/*  
:::::::::::::::::::::: 
generate country and state slect fields  
:::::::::::::::::::::::::::::::
*/
export const buildCountryStateSelectBox = (
  lable,
  field,
  inputName,
  required,
  dtName,
  itemsList,
  selected = ""
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";

  let selectOptions = [];
  if (itemsList.length > 0) {
    selectOptions = itemsList.map((item) => {
      const value = item.id;
      const options =
        selected === value
          ? option({ value, selected }, item.name)
          : option({ value }, item.name);
      return options;
    });
  }
  selectOptions.unshift(
    option({ value: "", selected: true }, "Select an option")
  );

  return div(
    { class: "space-y-2 field-wrapper  mt-4" },
    label(
      {
        for: lable,
        class: "font-normal text-sm leading-4",
      },
      field,
      dataRequired
    ),
    select(
      {
        id: inputName,
        "aria-label": dtName,
        name: inputName,
        "data-required": required,
        class:
          "input-focus text-base w-full block px-2 py-4 font-extralight border border-solid border-gray-300",
      },
      ...selectOptions
    ),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
};

/*
 ::::::::::::::
 get default address either shipping or billing
 :::::::::::::::::
 */
export const getDefaultAddress = () => {
  const address = "";
  return address;
};

/*
*
*
 ::::::::::::::
 handle the interaction when user click on proceed button or the steps icons
 ::::::::::::::
*
*
*
 */
export const changeStep = async (step) => {
  const currentTab = step.getAttribute("data-tab");
  const activeTab = step.getAttribute("data-activeTab");
  if (activeTab && activeTab === "shippingMethods") {
    const getShippingNotesField = document.querySelector("#shippingNotes");

    if (getShippingNotesField) {
      showPreLoader();
      if (getShippingNotesField.value.trim() === "") {
        getShippingNotesField.classList.add("border-red-500");
        removePreLoader();
        return false;
      } else {
        /*
 :::::::::::::
 get current basket details
 :::::::::::::
*/
        const getCurrentBasketDetails = await getBasketDetails();

        /*
 :::::::::::::
 check if basket has the shipping notes attribute
 :::::::::::::
*/
        if (getCurrentBasketDetails?.data?.data?.attributes) {
          const getNotes = getCurrentBasketDetails.data.data.attributes[0];

          /*
 :::::::::::::
 check if notes with same value esists
 :::::::::::::
*/
          if (
            getNotes.name === "GroupShippingNote" &&
            getNotes.value.trim() === getShippingNotesField.value.trim()
          ) {
            removePreLoader();
          } else {
            /*
 :::::::::::::
 if basket has the shipping notes attribute and has value. Update the shipping notes
 :::::::::::::
*/
            if (getShippingNotesField.classList.contains("border-red-500")) {
              getShippingNotesField.classList.remove("border-red-500");
            }
            const shippingNotesPayload = {
              name: "GroupShippingNote",
              value: getShippingNotesField.value,
              type: "String",
            };
            const updateShippingNotesResponse = await updateShippingNotes(
              shippingNotesPayload
            );
            if (updateShippingNotesResponse.status === "error") {
              removePreLoader();
              getShippingNotesField.classList.add("border-red-500");
              return false;
            }
            if (updateShippingNotesResponse.status === "success") {
              await updateBasketDetails();
              removePreLoader();
            }
          }
        } else {
          /*
 :::::::::::::
 if basket has the shipping notes attribute and doesn't has value. Add the shipping notes
 :::::::::::::
*/
          if (getShippingNotesField.classList.contains("border-red-500")) {
            getShippingNotesField.classList.remove("border-red-500");
          }
          const shippingNotesPayload = {
            name: "GroupShippingNote",
            value: getShippingNotesField.value,
            type: "String",
          };
          const setShippingNotesResponse = await setShippingNotes(
            shippingNotesPayload
          );
          if (setShippingNotesResponse.status === "error") {
            getShippingNotesField.classList.add("border-red-500");
          }
          if (setShippingNotesResponse.status === "success") {
            await updateBasketDetails();
            removePreLoader();
          }
        }
        //return false;
      }
    } else {
      //return false;
    }
  }
  const activateModule = document.querySelector(
    `#checkout-${currentTab}-module`
  );

  const modules = document.querySelectorAll(".checkout-module");
  const segment1 = document.getElementById("checkout-segment1");
  const segment2 = document.getElementById("checkout-segment2");
  const proceedButton = document.querySelector("#proceed-button");

  if (activateModule) {
    modules.forEach((m) => {
      if (m.classList.contains("active")) {
        m.classList.remove("active");
        m.classList.add("hidden");
      }
    });
    activateModule.classList.add("active");
    if (activateModule.classList.contains("hidden")) {
      activateModule.classList.remove("hidden");
    }
  }

  /*
  ::::::::::::::
  Update line segments between steps
  ::::::::::::::
  */
  switch (currentTab) {
    case "shippingAddress":
      segment1.style.width = "0";
      segment2.style.width = "0";
      proceedButton.setAttribute("data-tab", "shippingMethods");
      proceedButton.setAttribute("data-activeTab", "shippingAddress");
      proceedButton.textContent = "Proceed to Shipping";
      break;
    case "shippingMethods":
      segment1.style.width = "50%";
      segment2.style.width = "0";
      proceedButton.textContent = "Proceed to Payment";
      proceedButton.setAttribute("data-activeTab", "shippingMethods");
      proceedButton.setAttribute("data-tab", "payment");
      break;
    case "payment":
      segment2.style.width = "50%";
      proceedButton.setAttribute("data-activeTab", "paymentMethods");
      break;
  }
};

/*
 ::::::::::::::
 Create modules.. used for shipping address, shipping methods and payment module
 :::::::::::::: 
 */
export const createModule = (id, isActive, content, buttons) => {
  const module = div({
    class: `checkout-module ${isActive ? "active" : "hidden"}`,
    id: id,
  });

  module.append(content);

  buttons.forEach((buttonData) => {
    const proceedButton = button(
      {
        class:
          "proceed-button btn btn-lg font-medium btn-primary-purple rounded-full px-6 mt-6",
        id: "proceed-button",
        "data-tab": buttonData.tab,
      },
      buttonData.text
    );

    proceedButton.addEventListener("click", function (event) {
      event.preventDefault();
      changeStep(this);
    });
    module.appendChild(proceedButton);
  });

  return module;
};

/*
:::::::::::::: 
render the modules
::::::::::::::
*/

export const loadModule = async (module) => {
  const moduleWrapper = div({
    class: `checkout-${module}-container`,
  });
  const moduleContent = div({
    class: `checkout-${module}-content`,
  });
  const moduleHeader = div({
    class: `checkout-${module}-header`,
  });
  const moduleTitle = h2({});
  const moduleDescription = p({});
  if (module === "shippingAddress") {
    const loadShippingAddressModule = await shippingAddressModule();

    moduleContent.append(loadShippingAddressModule);
  }
  if (module === "summary") {
    const summaryModule = await checkoutSummary();
    moduleContent.append(summaryModule);
  }
  if (module === "shippingMethods") {
    const loadShippingMethodsModule = await shippingMethodsModule();
    moduleContent.append(loadShippingMethodsModule);
  }
  if (module === "payment") {
    moduleTitle.textContent = "Choose your payment method";
    moduleDescription.textContent =
      "Selecting or enter your preferred payment method.";
    moduleContent.textContent = "Payment methods Details Content Goes Here";
  }
  moduleHeader.append(moduleTitle);
  moduleHeader.append(moduleDescription);

  moduleWrapper.append(moduleHeader);

  moduleWrapper.append(moduleContent);
  return moduleWrapper;
};

/*
  ::::::::::::::
  gerenarte the progressbar...for the checkout module to enhance user interaction
  .::::::::::::::
  */
export const progressModule = () => {
  /*
  ::::::::::::::
  Create progress-bar
  ::::::::::::::
  */
  const progressBar = div({
    class:
      "checkout-progress-bar flex items-center justify-between mb-[60px] relative w-full",
  });

  // Add elements to progress-bar
  const line = div({
    class: "checkout-line",
  });

  const segment1 = div({
    class: "checkout-line-segment",
    id: "checkout-segment1",
  });

  const segment2 = div({
    class: "checkout-line-segment",
    id: "checkout-segment2",
  });

  const address = div({
    class: "checkout-step active relative cursor-pointer",
    id: "checkout-shippingAddress",
    "data-tab": "shippingAddress",
    "data-activeTab": "shippingAddress",
  });
  address.innerHTML =
    '<span data-tab= "shippingAddress" data-activeTab= "shippingAddress" class="checkout-progress-bar-icons"></span> <span  data-tab= "shippingAddress" data-activeTab= "shippingAddress" >Address</span>';

  const shipping = div({
    class: "checkout-step cursor-pointer relative",
    id: "checkout-shippingMethods",
    "data-tab": "shippingMethods",
    "data-activeTab": "shippingMethods",
  });
  shipping.innerHTML =
    '<span data-tab= "shippingMethods" data-activeTab= "shippingMethods"  class="checkout-progress-bar-icons"></span> <span  data-tab= "shippingMethods" data-activeTab= "shippingMethods" >Shipping</span>';

  const payment = div({
    class: " checkout-step cursor-pointer relative",
    id: "checkout-payment",
    "data-tab": "payment",
    "data-activeTab": "paymentMethods",
  });
  payment.innerHTML =
    '<span data-tab="payment" data-activeTab="paymentMethods"  class="checkout-progress-bar-icons"></span> <span  data-tab="payment" data-activeTab="paymentMethods" >Payment</span>';

  /*
 :::::::::::::: 
 Append steps and segments to progress-bar
 ::::::::::::::
 */
  progressBar.append(line, segment1, segment2, address, shipping, payment);
  // progressBar.addEventListener("click", function (event) {
  //   event.preventDefault();
  //   console.log(event.target);

  //   if (event.target.hasAttribute("data-activetab")) {
  //     changeStep(this);
  //   }
  // });

  const checkoutSteps = progressBar.querySelectorAll(".checkout-step");
  checkoutSteps.forEach((step) => {
    step.addEventListener("click", function () {
      changeStep(this);
    });
  });
  return progressBar;
};

/* 
::::::::::::::
initialize module to render at page load.
.::::::::::::::
 */
export const initializeModules = async () => {
  const authenticationToken = await getAuthenticationToken();

  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }

  const shippingAddressModule = await loadModule("shippingAddress");
  const detailsModule = await loadModule("summary");
  const shippingMethodsModule = await loadModule("shippingMethods");
  const paymentModule = await loadModule("payment");
  /*
   ::::::::::::::
   Define module details
   ::::::::::::::
   */
  const modules = [
    createModule(
      "checkout-shippingAddress-module",
      true,
      shippingAddressModule,
      []
    ),
    ,
    createModule("checkout-details", false, detailsModule, []),
    createModule(
      "checkout-shippingMethods-module",
      false,
      shippingMethodsModule,
      []
    ),
    createModule("checkout-payment-module", false, paymentModule, []),
  ];
  return modules;
};

/*
 ::::::::::::::
 tax exempt module.feed the create modal function with tax exempt content
 ::::::::::::::
 */
export const taxExemptModal = () => {
  const taxExemptWrapper = div(
    {
      class: "flex w-full flex-col gap-[30px]",
      id: "taxExemptWrapper",
    },
    /*
    :::::::::::::::
     tax exempt header
     ::::::::::::::
     */
    div(
      {
        class: "tax-exempt-header flex  flex-col gap-4",
      },
      div(
        {
          class: "flex w-full  flex-col",
        },
        div(
          {
            class: "tax-exempt-file flex items-center gap-4",
          },
          span({
            class:
              "fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
          }),
          p(
            {
              class: "text-gray-900 text-3xl font-bold",
            },
            "Tax Exempt"
          )
        )
      ),
      p(
        {
          class: "text-extralight text-center",
        },
        "Please upload the tax exempt certificate for our team to validate Formats: .JPG, .PNG, .PDF, .DOC and .DOCX"
      )
    ),
    /*
    :::::::::::::: 
    tax exempt body
    ::::::::::::::
    */
    div(
      {
        class: "tax-exempt-body cursor-pointer flex flex-col items-center",
        id: "taxExemptUpload",
      },
      div(
        {
          class: "tax-exempt-upload",
        },
        span({
          class: "h-28 w-28",
        })
      ),
      input({
        type: "file",
        name: "taxExemptFileInput",
        id: "taxExemptFileInput",
        class: "hidden",
      }),
      p(
        {
          class: "text-center text-2xl font-500",
        },
        "Upload File"
      ),
      div(
        {
          class: "text-red-500 text-md font-500 hidden",
          id: "taxExemptModalErrorContainer",
        },
        "Error Uploading File. Only JPG, .PNG, .PDF, .DOC and .DOCX are allowed."
      )
    ),

    /*
     ::::::::::::::
     tax exempt footer
     ::::::::::::::
     */
    div(
      {
        class: "tax-exempt-footer bg-danaherpurple-50 p-4 flex flex-col",
      },
      div(
        {
          class: "flex w-full flex-col",
        },
        p(
          {
            class: " text-black text-md font-extrabold",
          },
          "Tax Exempt tip."
        )
      ),
      p(
        {
          class: "text-extralight",
        },
        "Please upload a clearly scanned copy of the tax exempt certificate for a quick review process."
      )
    )
  );
  /*
    ::::::::::::::::::::::  
    cloud file icon for tax exempt modal
     :::::::::::::::::::::::::::::::
    */
  const cloudFileIcon = taxExemptWrapper.querySelector(".tax-exempt-file span");
  cloudFileIcon.innerHTML =
    '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="24" fill="#F5EFFF"/><path d="M21 24H27M21 28H27M29 33H19C17.8954 33 17 32.1046 17 31V17C17 15.8954 17.8954 15 19 15H24.5858C24.851 15 25.1054 15.1054 25.2929 15.2929L30.7071 20.7071C30.8946 20.8946 31 21.149 31 21.4142V31C31 32.1046 30.1046 33 29 33Z" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /*
    :::::::::::::::::::::: 
    upload file icon for tax exempt modal
     :::::::::::::::::::::::::::::::
    */
  const cloudUloadIcon = taxExemptWrapper.querySelector(
    ".tax-exempt-upload span"
  );
  cloudUloadIcon.innerHTML =
    '<svg width="122" height="122" viewBox="0 0 122 122" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Cloud upload"><path id="Icon" d="M40.6667 86.4167C26.6294 86.4167 15.25 75.0372 15.25 61C15.25 48.5536 24.1963 38.1968 36.0091 36.0091C38.1968 24.1963 48.5536 15.25 61 15.25C73.4464 15.25 83.8032 24.1963 85.9909 36.0091C97.8038 38.1968 106.75 48.5536 106.75 61C106.75 75.0372 95.3706 86.4167 81.3333 86.4167M45.75 61L61 45.75M61 45.75L76.25 61M61 45.75V106.75" stroke="#7523FF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';

  const taxExemptUploadButton =
    taxExemptWrapper.querySelector("#taxExemptUpload");

  const taxExemptFileInput = taxExemptWrapper.querySelector(
    "#taxExemptFileInput"
  );
  if (taxExemptUploadButton && taxExemptFileInput) {
    taxExemptUploadButton.addEventListener("click", function () {
      taxExemptFileInput.click();
    });
  }
  if (taxExemptFileInput) {
    taxExemptFileInput.addEventListener("change", (f) => {
      f.preventDefault();
      const file = f.target.files[0];
      if (file) {
        // Allowed formats
        const allowedTaxExemptFileFormats = [
          "jpg",
          "jpeg",
          "png",
          "pdf",
          "doc",
          "docx",
        ];
        const fileName = file.name;
        const fileType = fileName.split(".")[1].toLowerCase();
        if (allowedTaxExemptFileFormats.includes(fileType)) {
          const taxExemptUploadedFile = div(
            {
              class: " flex flex-1 justify-between",
              id: "taxExemptUploadedFile",
            },
            div(
              {},
              p(
                {
                  class: "text-black text-md",
                },
                "Tax Exempt Document"
              ),
              p(
                {
                  class: "text-danaherpurple-500 text-md",
                },
                fileName
              )
            ),
            div(
              {
                class: "close-button",
                name: "close",
              },
              span({
                class: "icon icon-close cursor-pointer",
                id: "removeTaxExemptUploadedFile",
              })
            )
          );

          const checkoutSummaryTax = document.querySelector(
            "#checkoutSummaryTax"
          );
          if (checkoutSummaryTax) {
            const checkoutSummaryTaxExempt = checkoutSummaryTax.querySelector(
              "#checkoutSummaryTaxExempt"
            );
            if (checkoutSummaryTaxExempt) {
              checkoutSummaryTaxExempt.classList.add("hidden");
            }
            decorateIcons(taxExemptUploadedFile);
            checkoutSummaryTax.classList.add("flex-wrap");
            checkoutSummaryTax.append(taxExemptUploadedFile);
            closeUtilityModal();
          }
        } else {
          const taxExemptModalErrorContainer = document.querySelector(
            "#taxExemptModalErrorContainer"
          );
          if (taxExemptModalErrorContainer) {
            if (taxExemptModalErrorContainer.classList.contains("hidden")) {
              taxExemptModalErrorContainer.classList.remove("hidden");
            }
            setTimeout(function () {
              taxExemptModalErrorContainer.classList.add("hidden");
            }, 10000);
          }
        }

        const removeTaxExemptUploadedFile = document.querySelector(
          "#removeTaxExemptUploadedFile"
        );
        if (removeTaxExemptUploadedFile) {
          removeTaxExemptUploadedFile.addEventListener("click", function (e) {
            const taxExemptUploadedFile = document.querySelector(
              "#taxExemptUploadedFile"
            );
            if (taxExemptUploadedFile) {
              taxExemptUploadedFile.remove();
              const checkoutSummaryTaxExempt = document.querySelector(
                "#checkoutSummaryTaxExempt"
              );
              if (checkoutSummaryTaxExempt) {
                if (checkoutSummaryTaxExempt.classList.contains("hidden")) {
                  checkoutSummaryTaxExempt.classList.remove("hidden");
                }
              }
              const checkoutSummaryTax = document.querySelector(
                "#checkoutSummaryTax"
              );
              if (checkoutSummaryTax) {
                if (checkoutSummaryTax.classList.contains("flex-wrap")) {
                  checkoutSummaryTax.classList.remove("flex-wrap");
                }
              }
            }
          });
        }
      }
    });
  }
  return taxExemptWrapper;
};

/*
 ::::::::::::::::::::::::::::: 
 get addresses to be shown in UI 
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function getUseAddresses() {
  const cachedAddress = JSON.parse(sessionStorage.getItem("useAddress"));
  if (cachedAddress) return cachedAddress;
  const useAddressData = await getBasketDetails();

  if (useAddressData?.status === "success") {
    const useAddressObjectData = await setUseAddressObject(useAddressData.data);

    if (useAddressObjectData?.status === "success") {
      sessionStorage.setItem(
        "useAddress",
        JSON.stringify({ status: "success", data: useAddressObjectData })
      );
      return { status: "success", data: useAddressObjectData };
    } else {
      return { status: "error", data: {} };
    }
  } else {
    return { status: "error", data: {} };
  }
}
/*
 ::::::::::::::::::::::::::::: 
 get addresses to be shown on ui 
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function getAddresses() {
  const cachedAddress = sessionStorage.getItem("addressList");
  return cachedAddress ? JSON.parse(cachedAddress) : await updateAddresses();
}

/*
::::::::::::::::::::::::::::: 
update addresses to be shown on ui 
::::::::::::::::::::::::::::::::::::::::::::
 */
export async function updateAddresses() {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  sessionStorage.removeItem("addressList");
  const url = `${baseURL}/customers/-/addresses`;
  const defaultHeaders = new Headers();
  defaultHeaders.append("Content-Type", "Application/json");
  defaultHeaders.append(
    "authentication-token",
    authenticationToken.access_token
  );
  try {
    const response = await getApiData(url, defaultHeaders);
    if (response?.status !== "success") return [];
    const addressDetailsList = await Promise.all(
      response.data.elements.map(async (address) => {
        const addressURI = address.uri.split("addresses")[1];
        return await getAddressDetails(`customers/-/addresses${addressURI}`);
      })
    );
    if (addressDetailsList) {
      sessionStorage.setItem(
        "addressList",
        JSON.stringify({ status: "success", data: addressDetailsList })
      );
      return { status: "success", data: addressDetailsList };
    } else {
      return { status: "error", data: "Address Not found." };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
 ::::::::::::::::::::::::::::: 
 set address to default  
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function updateAddressToDefault(data) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  const url = `${baseURL}/customers/-/myAddresses`;
  const defaultHeaders = new Headers();
  defaultHeaders.append("Content-Type", "Application/json");
  defaultHeaders.append(
    "authentication-token",
    authenticationToken.access_token
  );
  try {
    const response = await postApiData(
      url,
      JSON.stringify(data),
      defaultHeaders
    );
    return response;
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
 ::::::::::::::::::::::::::::: 
 get single adress details based on address id 
 ::::::::::::::::::::::::::::::::::::::::::::
 * @param {string} addressURI - The ID of the Address.
 */
export async function getAddressDetails(addressURI) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    const url = `${baseURL}${addressURI}`;

    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "Application/json");
    defaultHeaders.append(
      "authentication-token",
      authenticationToken.access_token
    );
    const response = await getApiData(url, defaultHeaders);
    return response.status === "success" ? response.data : [];
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
 ::::::::::::::::::::::::::::: 
 get current shipping bucket
  ::::::::::::::::::::::::::::::::::::::::::::
 */
export const getShippingBucket = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
  } catch (error) {
    return { status: "error", data: error.message };
  }
};
/*
 ::::::::::::::::::::::::::::: 
 get shipping methods
  ::::::::::::::::::::::::::::::::::::::::::::
 */
export const getShippingMethods = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    const shippingBucket = JSON.parse(sessionStorage.getItem("basketData"));

    if (shippingBucket.status === "success") {
      const shippingMethods = JSON.parse(
        sessionStorage.getItem("shippingMethods")
      );
      if (shippingMethods.status === "success") return await shippingMethods;
      sessionStorage.removeItem("shippingMethods");
      const url = `${baseURL}baskets/current/buckets/${shippingBucket.buckets[0]}/eligible-shipping-methods`;
      const defaultHeaders = new Headers();
      defaultHeaders.append("Content-Type", "Application/json");
      defaultHeaders.append(
        "authentication-token",
        authenticationToken.access_token
      );
      defaultHeaders.append(
        "Accept",
        "application/vnd.intershop.basket.v1+json"
      );
      const response = await getApiData(url, defaultHeaders);

      if (response.status === "success") {
        sessionStorage.setItem(
          "shippingMethods",
          JSON.stringify({ status: "success", data: response.data.data })
        );
        return { status: "success", data: response.data.data };
      } else {
        return { status: "error", data: "" };
      }
    } else {
      return { status: "error", data: "Error getting shipping methods:" };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
};

/*
 :::::::::::::::::::::::::::::
  set shipping method to default based on the method ID 
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {string} methodId - The ID of the Shipping method.
 */
export const setShippingMethod = async (methodId) => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    sessionStorage.removeItem("useShippingMethod");
    const url = `${baseURL}baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrumentnclude=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrument`;
    const data = {
      commonShippingMethod: methodId,
    };
    const defaultHeaders = new Headers({
      "Content-Type": "Application/json",
      "Authentication-Token": authenticationToken.access_token,
      Accept: "application/vnd.intershop.basket.v1+json",
    });
    const response = await patchApiData(
      url,
      JSON.stringify(data),
      defaultHeaders
    );

    if (response.status === "success") {
      sessionStorage.setItem(
        "useShippingMethod",
        JSON.stringify({
          status: "success",
          data: response.data.data.commonShippingMethod,
        })
      );
      return {
        status: "success",
        data: response.data.data.commonShippingMethod,
      };
    } else {
      return { status: "error", data: response.data };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
};
/*
 ::::::::::::::::::::::::::::: 
 set shipping notes to default based on the method ID
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {Object} shippingNotesPayload - The payload to pass with the set shipping notes API call
 */
export async function setShippingNotes(shippingNotesPayload) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    sessionStorage.removeItem("useShippingNotes");
    const url = `${baseURL}baskets/current/attributes`;

    const defaultHeaders = new Headers({
      "Content-Type": "Application/json",
      "Authentication-Token": authenticationToken.access_token,
      Accept: "application/vnd.intershop.basket.v1+json",
    });

    const response = await postApiData(
      url,
      JSON.stringify(shippingNotesPayload),
      defaultHeaders
    );

    if (response.status === "success") {
      sessionStorage.setItem(
        "useShippingNotes",
        JSON.stringify({ status: "success", data: response.data.data.value })
      );
      return { status: "success", data: response.data.data.value };
    } else {
      return { status: "error", data: response };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
 ::::::::::::::::::::::::::::: 
 update shipping notes based on the method ID 
 ::::::::::::::::::::::::::::::::::::::::::::
 * @param {Object} shippingNotesPayload - The payload to pass with the set shipping notes API call
 */
export async function updateShippingNotes(shippingNotesPayload) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    sessionStorage.removeItem("useShippingNotes");
    const url = `${baseURL}baskets/current/attributes/GroupShippingNote`;

    const defaultHeaders = new Headers({
      "Content-Type": "Application/json",
      "Authentication-Token": authenticationToken.access_token,
      Accept: "application/vnd.intershop.basket.v1+json",
    });

    const response = await patchApiData(
      url,
      JSON.stringify(shippingNotesPayload),
      defaultHeaders
    );

    if (response.status === "success") {
      sessionStorage.setItem(
        "useShippingNotes",
        JSON.stringify({ status: "success", data: response.data.data.value })
      );
      return { status: "success", data: response.data.data.value };
    } else {
      return { status: "error", data: response };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
 :::::::::::::::::::::::::::::
  set use address to  show on ui based on adress id and type
   ::::::::::::::::::::::::::::::::::::::::::::
 * @param {string} id - The ID of the current address.
 * @param {string} type - Shipping/Billing.
 */
export const setUseAddress = async (id, type) => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    const url = `${baseURL}baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
    const data = {};
    type === "shipping"
      ? Object.assign(data, { commonShipToAddress: id })
      : Object.assign(data, { invoiceToAddress: id });
    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "Application/json");
    defaultHeaders.append(
      "authentication-token",
      authenticationToken.access_token
    );
    const response = await patchApiData(
      url,
      JSON.stringify(data),
      defaultHeaders
    );

    if (response.status === "success") {
      const useAddressData = await setUseAddressObject(response.data);

      if (useAddressData.status === "success") {
        sessionStorage.removeItem("useAddress");
        sessionStorage.setItem("useAddress", JSON.stringify(useAddressData));
        return useAddressData;
      }
    } else {
      return { status: "error", data: response };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
};

/*
 ::::::::::::::::::::::::::::: 
 update use address object with cuyrrent address
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {Object} response - Response from the Set default address API.
 */
async function setUseAddressObject(response) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    const useAddressObject = {};
    let addressDetails = "";
    let addressURI = "";
    if (response?.data?.invoiceToAddress) {
      addressURI = response.data.invoiceToAddress.split(":")[4];
      addressDetails = await getAddressDetails(
        `customers/-/addresses/${addressURI}`
      );
      Object.assign(useAddressObject, { invoiceToAddress: addressDetails });
    }
    if (response?.data?.commonShipToAddress) {
      addressURI = response.data.commonShipToAddress.split(":")[4];
      addressDetails = await getAddressDetails(
        `customers/-/addresses/${addressURI}`
      );
      Object.assign(useAddressObject, {
        commonShipToAddress: addressDetails,
      });
    }

    if (Object.keys(useAddressObject).length !== 0) {
      return { status: "success", data: useAddressObject };
    } else {
      return { status: "error", data: {} };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
 ::::::::::::::::::::::::::::: 
 Get promotion details based on promotion ID
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {String} promotionId - promotionId from the Basket Details API.
 */
export const getPromotionDetails = async (promotionId) => {
  try {
    const autoDiscount = JSON.parse(sessionStorage.getItem("autoDiscount"));
    if (autoDiscount.status === "success") return autoDiscount;
    const getBasket = await getBasketDetails();
    if (getBasket.status === "success") {
      const getBasketDiscount =
        getBasket.data.data.discounts.valueBasedDiscounts;
      if (getBasketDiscount) {
        const getBasketDiscountId =
          getBasket.data.included.discounts[getBasketDiscount].id;
        const getAutoDiscountDetails = await getApiData(
          `promotions/${getBasketDiscountId}`
        );
        if (getAutoDiscountDetails.status === "success") {
          sessionStorage.setItem(
            "autoDiscount",
            JSON.stringify({
              status: "success",
              data: getAutoDiscountDetails,
            })
          );
          return getAutoDiscountDetails;
        }
      }
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
};
