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
import { shippingAddressModule } from "./shippingAddress.js";
import { checkoutSummary } from "./checkoutSummary.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import {
  formValidate,
  postApiData,
  getApiData,
  baseURL,
  authenticationToken,
} from "../../scripts/common-utils.js";
import {
  getAuthorization,
  getCommerceBase,
  makeCoveoApiRequest,
} from "../../scripts/commerce.js";

// function to initialize the google place api .....
export function initializeAutocomplete(inputId, callback) {
  const input = document.getElementById(inputId);
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["geocode"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (callback) {
      callback(place);
    }
  });
}

// shipping countries will get from api
export const shippingCountries = {
  data: [
    {
      id: "AR",
      name: "Argentina",
    },
    {
      id: "AW",
      name: "Aruba",
    },
    {
      id: "AU",
      name: "Australia",
    },
    {
      id: "AT",
      name: "Austria",
    },
    {
      id: "BS",
      name: "Bahamas",
    },
    {
      id: "BD",
      name: "Bangladesh",
    },
    {
      id: "BE",
      name: "Belgium",
    },
    {
      id: "BM",
      name: "Bermuda",
    },
    {
      id: "BR",
      name: "Brazil",
    },
    {
      id: "BG",
      name: "Bulgaria",
    },
    {
      id: "KY",
      name: "Cayman Islands",
    },
    {
      id: "CL",
      name: "Chile",
    },
    {
      id: "CN",
      name: "China",
    },
    {
      id: "CO",
      name: "Colombia",
    },
    {
      id: "CR",
      name: "Costa Rica",
    },
    {
      id: "HR",
      name: "Croatia",
    },
    {
      id: "CU",
      name: "Cuba",
    },
    {
      id: "CY",
      name: "Cyprus",
    },
    {
      id: "CZ",
      name: "Czech Republic",
    },
    {
      id: "DK",
      name: "Denmark",
    },
    {
      id: "DO",
      name: "Dominican Republic",
    },
    {
      id: "EC",
      name: "Ecuador",
    },
    {
      id: "EG",
      name: "Egypt",
    },
    {
      id: "SV",
      name: "El Salvador",
    },
    {
      id: "GQ",
      name: "Equatorial Guinea",
    },
    {
      id: "FI",
      name: "Finland",
    },
    {
      id: "FR",
      name: "France",
    },
    {
      id: "GF",
      name: "French Guiana",
    },
    {
      id: "DE",
      name: "Germany",
    },
    {
      id: "GR",
      name: "Greece",
    },
    {
      id: "GL",
      name: "Greenland",
    },
    {
      id: "GD",
      name: "Grenada",
    },
    {
      id: "GU",
      name: "Guam",
    },
    {
      id: "GT",
      name: "Guatemala",
    },
    {
      id: "HT",
      name: "Haiti",
    },
    {
      id: "VA",
      name: "Holy See (Vatican City State)",
    },
    {
      id: "HN",
      name: "Honduras",
    },
    {
      id: "HK",
      name: "Hong Kong",
    },
    {
      id: "HU",
      name: "Hungary",
    },
    {
      id: "IS",
      name: "Iceland",
    },
    {
      id: "IN",
      name: "India",
    },
    {
      id: "ID",
      name: "Indonesia",
    },
    {
      id: "IE",
      name: "Ireland",
    },
    {
      id: "IL",
      name: "Israel",
    },
    {
      id: "IT",
      name: "Italy",
    },
    {
      id: "JM",
      name: "Jamaica",
    },
    {
      id: "JP",
      name: "Japan",
    },
    {
      id: "JO",
      name: "Jordan",
    },
    {
      id: "LI",
      name: "Liechtenstein",
    },
    {
      id: "LU",
      name: "Luxembourg",
    },
    {
      id: "MO",
      name: "Macau",
    },
    {
      id: "MK",
      name: "Macedonia",
    },
    {
      id: "MG",
      name: "Madagascar",
    },
    {
      id: "MT",
      name: "Malta",
    },
    {
      id: "MQ",
      name: "Martinique",
    },
    {
      id: "MX",
      name: "Mexico",
    },
    {
      id: "NL",
      name: "Netherlands",
    },
    {
      id: "AN",
      name: "Netherlands Antilles",
    },
    {
      id: "NZ",
      name: "New Zealand",
    },
    {
      id: "NO",
      name: "Norway",
    },
    {
      id: "PA",
      name: "Panama",
    },
    {
      id: "PE",
      name: "Peru",
    },
    {
      id: "PH",
      name: "Philippines",
    },
    {
      id: "PL",
      name: "Poland",
    },
    {
      id: "PT",
      name: "Portugal",
    },
    {
      id: "PR",
      name: "Puerto Rico",
    },
    {
      id: "RO",
      name: "Romania",
    },
    {
      id: "RU",
      name: "Russian Federation",
    },
    {
      id: "MP",
      name: "Saipan",
    },
    {
      id: "SA",
      name: "Saudi Arabia",
    },
    {
      id: "RS",
      name: "Serbia",
    },
    {
      id: "SG",
      name: "Singapore",
    },
    {
      id: "SK",
      name: "Slovakia (Slovak Republic)",
    },
    {
      id: "SI",
      name: "Slovenia",
    },
    {
      id: "ZA",
      name: "South Africa",
    },
    {
      id: "KR",
      name: "South Korea",
    },
    {
      id: "ES",
      name: "Spain",
    },
    {
      id: "LK",
      name: "Sri Lanka",
    },
    {
      id: "SE",
      name: "Sweden",
    },
    {
      id: "CH",
      name: "Switzerland",
    },
    {
      id: "TW",
      name: "Taiwan",
    },
    {
      id: "TH",
      name: "Thailand",
    },
    {
      id: "TT",
      name: "Trinidad And Tobago",
    },
    {
      id: "TN",
      name: "Tunisia",
    },
    {
      id: "TR",
      name: "Turkey",
    },
    {
      id: "TC",
      name: "Turks And Caicos Islands",
    },
    {
      id: "UA",
      name: "Ukraine",
    },
    {
      id: "AE",
      name: "United Arab Emirates",
    },
    {
      id: "GB",
      name: "United Kingdom",
    },
    {
      id: "US",
      name: "United States",
    },
    {
      id: "UM",
      name: "United States Minor Outlying Islands",
    },
    {
      id: "UZ",
      name: "Uzbekistan",
    },
    {
      id: "VE",
      name: "Venezuela",
    },
    {
      id: "VN",
      name: "Vietnam",
    },
    {
      id: "VG",
      name: "Virgin Islands (British)",
    },
    {
      id: "VI",
      name: "VIRGIN ISLANDS (U.S.)",
    },
    {
      id: "YU",
      name: "Yugoslavia",
    },
  ],
};

// shipping states will get from api based on the selected country
export const shippingStates = "";

// shipping address list will get it from the api under my-account -  get addresses
export const shippingAddressList = async () => {
  try {
    const addressesDetailsList = [];
    const addressesList = await getShippingAdresses();

    const outputList = await Promise.all(
      addressesList.elements.map((address) => {
        const addressURI = address.uri.split("customers")[1];
        return getAdressDetails(`customers${addressURI}`);
      })
    );
    return outputList;
  } catch (error) {
    console.error(error);
  }
};

// custom function to build a search input field with icon...
export const buildSearchWithIcon = (
  lable,
  field,
  inputType,
  inputName,
  autoCmplte,
  required,
  dtName,
  placeholder
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";
  const searchElement = div(
    {
      class: "space-y-2 field-wrapper relative",
      id: "shippingAddressListSearch",
    },
    div(
      {
        class: "search-with-icon relative",
      },
      span({
        class: " icon icon-search absolute top-1/2 mt-2 ml-2",
      }),
      input({
        type: inputType,
        name: inputName,
        id: inputName,
        placeholder: placeholder,
        autocomplete: autoCmplte,
        "data-required": required,
        class:
          " min-w-[320px] h-10 rounded-md pl-9 input-focus text-base w-full block px-2 py-4 text-gray-600 font-extralight border border-solid border-gray-300",
        "aria-label": dtName,
      })
    ),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
  decorateIcons(searchElement);
  return searchElement;
};

export const buildCountryStateSelectBox = (
  lable,
  field,
  inputName,
  required,
  dtName,
  itemsList
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";

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
      ...itemsList.map((item) => {
        const value = item.id;
        const options = option({ value }, item.name);
        return options;
      })
    ),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
};

// get default address either shipping or biling:::::::::::::::::
export const getDefaultAddress = () => {
  const address = "";
  return address;
};

// get checkout / basket default configurations from the api call ......
export const checkoutConfig = () => {
  const configData = {
    data: {
      application: {
        id: "application",
        applicationId: null,
        applicationType: "danaher.SMBResponsive",
        displayName: null,
        urlIdentifier: "-",
        default: true,
      },
      basket: {
        id: "basket",
        expirationType: "Time",
        lineItemPositionHandling: "AssignOnly",
        addProductBehaviour: "NoControls",
        lifetime: "28800.0",
        maxItemSize: "50",
        maxItemQuantity: "100",
        minTotalValue: null,
        maxTotalValue: null,
        acceleration: false,
        termsAndConditions: false,
        emailOptIn: false,
        displayTaxesAndFees: "ConsolidatedTaxes",
        desiredDeliveryDate: true,
        deliveryExcludeSaturday: true,
        deliveryExcludeSunday: true,
        packSlipMessage: true,
        packSlipMessageMaxLength: "1000",
        giftWrap: true,
        giftMessage: true,
        giftMessageMaxLength: "1000",
      },
      captcha: {
        id: "captcha",
        redemptionOfGiftCardsAndCertificates: true,
        forgotPassword: true,
        contactUs: true,
        emailShoppingCart: true,
        register: true,
      },
      general: {
        id: "general",
        defaultCurrency: "USD",
        defaultLocale: "en_US",
        currencies: ["USD"],
        locales: ["en_US"],
        customerTypeForLoginApproval: [],
      },
      preferences: {
        id: "preferences",
        ChannelPreferences: {
          id: "ChannelPreferences",
          EnableAdvancedVariationHandling: "false",
          PasswordRetrievalEmailSubject: "Password Retrieval",
          ContactFormUserServiceEmailFrom: "info@test.intershop.de",
          PasswordReminderEmailFrom: "Customer_eXperience@dhlifesciences.com",
        },
        ShippingPreferences: {
          id: "ShippingPreferences",
          MultipleShipmentsSupported: "false",
        },
        UserCredentialPreferences: {
          id: "UserCredentialPreferences",
          UserRegistrationLoginType: "email",
        },
      },
      pricing: {
        id: "pricing",
        priceType: "net",
        privateCustomerPriceDisplayType: "net",
        smbCustomerPriceDisplayType: "net",
        defaultCustomerTypeForPriceDisplay: "SMB",
      },
      services: {
        id: "services",
      },
      shipping: {
        deliveryExcludeSaturday: true,
        deliveryExcludeSunday: true,
        desiredDeliveryDate: true,
        desiredDeliveryDaysMax: "90",
        desiredDeliveryDaysMin: "2",
        id: "shipping",
        multipleShipmentsSupported: false,
        pickupInStoreEnabled: false,
      },
    },
  };
  return configData;
};

// get checkout / basket details to populate the checkout summary module
export const getCheckoutSummary = () => {
  const checkoutSummary = {
    data: {
      approval: {
        approvalRequired: false,
      },
      buckets: ["-2047976031"],
      buyer: {
        accountID: "sumit.lakawde@dhlscontractors.com",
        companyName: "Intershop",
        customerNo: "100001",
        email: "sumit.lakawde@dhlscontractors.com",
        firstName: "S",
        lastName: "L",
        userNo: "100001000",
      },
      calculated: true,
      commonShippingMethod: "STD_GROUND",
      coveredByLimitedTenders: false,
      customer: "100001",
      discounts: {},
      id: "RcgKAQAHOBQAAAGWi81fIjfM",
      lineItems: ["HLYKAQAHqU8AAAGW4csYdz1G"],
      purchaseCurrency: "USD",
      surcharges: {
        bucketSurcharges: [
          {
            amount: {
              gross: {
                currency: "USD",
                value: 1500.0,
              },
              net: {
                currency: "USD",
                value: 1500.0,
              },
            },
            name: "Shipping Overage",
            taxes: [
              {
                calculatedTax: {
                  currency: "USD",
                  value: 0.0,
                },
                effectiveTaxRate: 0.0,
              },
            ],
          },
        ],
      },
      totalProductQuantity: 1.0,
      totals: {
        grandTotal: {
          gross: {
            currency: "USD",
            value: 16500.0,
          },
          net: {
            currency: "USD",
            value: 16500.0,
          },
          tax: {
            currency: "USD",
            value: 10.0,
          },
        },
        paymentCostsTotal: {},
        undiscountedItemTotal: {
          gross: {
            currency: "USD",
            value: 15000.0,
          },
          net: {
            currency: "USD",
            value: 15000.0,
          },
        },
        undiscountedShippingTotal: {
          gross: {
            currency: "USD",
            value: 50.0,
          },
          net: {
            currency: "USD",
            value: 50.0,
          },
          tax: {
            currency: "USD",
            value: 0.0,
          },
        },
        itemTotal: {
          gross: {
            currency: "USD",
            value: 15000.0,
          },
          net: {
            currency: "USD",
            value: 15000.0,
          },
        },
        shippingTotal: {
          gross: {
            currency: "USD",
            value: 30.0,
          },
          net: {
            currency: "USD",
            value: 30.0,
          },
        },
        surchargeTotal: {
          gross: {
            currency: "USD",
            value: 1500.0,
          },
          net: {
            currency: "USD",
            value: 1500.0,
          },
          tax: {
            currency: "USD",
            value: 0.0,
          },
        },
      },
      user: "sumit.lakawde@dhlscontractors.com",
    },
  };
  return checkoutSummary;
};

// handle the interaction when user click on proceed button or the steps icons....
export const changeStep = (step) => {
  const currentTab = step.getAttribute("data-tab");
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

  // Update line segments between steps
  switch (currentTab) {
    case "shippingAddress":
      segment1.style.width = "0";
      segment2.style.width = "0";
      proceedButton.setAttribute("data-tab", "shippingMethods");
      proceedButton.textContent = "Proceed to Shipping";
      break;
    case "shippingMethods":
      segment1.style.width = "50%";
      segment2.style.width = "0";
      proceedButton.textContent = "Proceed to Payment";
      proceedButton.setAttribute("data-tab", "payment");
      break;
    case "payment":
      segment2.style.width = "50%";
      break;
  }
};

// Create modules.. responsible for shipping address, shipping methods and payment module...
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

    proceedButton.addEventListener("click", function () {
      changeStep(this);
    });
    module.appendChild(proceedButton);
  });

  return module;
};

// render the modules...
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
    const loadShippingAddressModule = shippingAddressModule();
    moduleContent.append(loadShippingAddressModule);
  }
  if (module === "summary") {
    const summaryModule = await checkoutSummary();
    moduleContent.append(summaryModule);
  }
  if (module === "shippingMethods") {
    moduleTitle.textContent = "Confirm your shipping method(s)";
    moduleDescription.textContent =
      "Your choice, your speed. Select your preferred shipping method. Have a special note thats okay add that to the notes field and we will do our best to facilitate.";
    moduleContent.textContent = "Shipping Methods Details Content Goes Here";
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

// gerenarte the progressbar...for the checkout module to enhance user interaction.
export const progressModule = () => {
  // Create progress-bar
  const progressBar = div({
    class:
      "checkout-progress-bar flex items-center justify-between mb-[100px] relative w-full",
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
  });
  address.innerHTML =
    '<span class="checkout-progress-bar-icons"></span> <span>Address</span>';

  const shipping = div({
    class: "checkout-step cursor-pointer relative",
    id: "checkout-shippingMethods",
    "data-tab": "shippingMethods",
  });
  shipping.innerHTML =
    '<span class="checkout-progress-bar-icons"></span> <span>Shipping</span>';

  const payment = div({
    class: " checkout-step cursor-pointer relative",
    id: "checkout-payment",
    "data-tab": "payment",
  });
  payment.innerHTML =
    '<span class="checkout-progress-bar-icons"></span> <span>Payment</span>';

  // Append steps and segments to progress-bar
  progressBar.append(line, segment1, segment2, address, shipping, payment);

  const checkoutSteps = progressBar.querySelectorAll(".checkout-step");
  checkoutSteps.forEach((step) => {
    step.addEventListener("click", function () {
      changeStep(this);
    });
  });
  return progressBar;
};

// initialize module to render at page load..
export const initializeModules = async () => {
  const shippingAddressModule = await loadModule("shippingAddress");
  const detailsModule = await loadModule("summary");
  const shippingMethodsModule = await loadModule("shippingMethods");
  const paymentModule = await loadModule("payment");
  // Define module details
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

// tax exempt module.......feed the create modal function with tax exempt content
export const taxExemptModal = () => {
  const taxExemptWrapper = div(
    {
      class: "flex w-full flex-col gap-[30px]",
      id: "taxExemptWrapper",
    },
    // tax exempt header
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
    // tax exempt body
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

    // tax exempt footer
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
  const cloudFileIcon = taxExemptWrapper.querySelector(".tax-exempt-file span");
  cloudFileIcon.innerHTML =
    '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="24" fill="#F5EFFF"/><path d="M21 24H27M21 28H27M29 33H19C17.8954 33 17 32.1046 17 31V17C17 15.8954 17.8954 15 19 15H24.5858C24.851 15 25.1054 15.1054 25.2929 15.2929L30.7071 20.7071C30.8946 20.8946 31 21.149 31 21.4142V31C31 32.1046 30.1046 33 29 33Z" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

// utility function to close the modal...can be imported and used globally for the modal created using checkout-utlility createModal function
export const closeUtilityModal = () => {
  const utilityModal = document.querySelector("#utilityModal");
  if (utilityModal) {
    utilityModal.remove();
  }
};

async function getShippingAdresses() {
  if (authenticationToken) {
    const url = `${baseURL}/customers/-/addresses`;

    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "Application/json");
    defaultHeaders.append("authentication-token", authenticationToken);
    return await getApiData(url, defaultHeaders);
  }
}

async function getAdressDetails(addressURI) {
  try {
    if (authenticationToken) {
      const url = `${baseURL}${addressURI}`;

      const defaultHeaders = new Headers();
      defaultHeaders.append("Content-Type", "Application/json");
      defaultHeaders.append("authentication-token", authenticationToken);
      const response = await getApiData(url, defaultHeaders);
      return response;
    }
  } catch (errors) {
    console.log(errors);
  }
}
