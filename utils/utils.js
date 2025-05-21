import { updateCartQuantity } from "../blocks/cartlanding/mycart.js";
import {
  updateCart,
  updateProductQuantityValue,
} from "../blocks/cartlanding/cartItem.js";
import { updateCartButton } from "../blocks/cartlanding/recommendedproducts.js";
import {
  addItemToBasket,
  productData,
  getAllItemsFromBasket,
  getProductDetailObject,
} from "../blocks/cartlanding/myCartService.js";
import {
  getBasketDetails,
  updateBasketDetails,
  createBasket,
  getAuthenticationToken,
  baseURL,
  patchApiData,
  deleteApiData,
} from "../scripts/common-utils.js";

export let cartItemsValue = [];

export let recommendedProduct = [
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "DMIL Fluorescence for Fluorescence Cell Culture with Documentation",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "dmil-fluorescence-for-fluorescence-cell-culture-with-documentation",
    productName:
      "DMIL Fluorescence for Fluorescence Cell Culture with Documentation",
    longDescription:
      "The DM IL LED, equipped with a K3C camera, is tailored for phase contrast and  fluorescence imaging of cell cultures and individual cells.  The system and the intuitive LASX software  document seamlessly routine tasks in cell culture labs like confluence estimation and  transfection efficiency checks.  Elevate your cell culture research with the DM IL LED, featuring a color camera for seamless image capture and providing superior fluorescence capabilities for enhanced visualization and insights into dynamic cell culture phenomena.",
    productTypes: ["PRODUCT_BUNDLE"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: true,
    manufacturer: "Sciex",
    listPrice: {
      type: "ProductPrice",
      value: 15000.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 15000.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    bundles:
      "DANAHERLS-LSIG-Site/-/products/dmil-fluorescence-for-fluorescence-cell-culture-with-documentation/bundles",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    images: [
      {
        name: "primary M",
        type: "Image",
        effectiveUrl:
          "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dm-il-led-3",
        viewID: "primary",
        typeID: "M",
        primaryImage: true,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle:
        "DMIL Fluorescence for Fluorescence Cell Culture with Documentation",
      metaDescription:
        "DMIL Fluorescence for Fluorescence Cell Culture with Documentation",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
  },
  {
    name: "Vi-CELL BLU Cell Viability Analyzer",
    type: "Product",
    sku: "vi-cell-blu-cell-viability-analyzers",
    productName: "Vi-CELL BLU Cell Viability Analyzer",
    longDescription:
      "The faster Vi-CELL BLU cell analyzers automates the Trypan Blue Dye Exclusion method for cell viability analysis.\nThe Vi-CELL BLU expedites processing by now having the option to use a 24-position sample carousel or a 96 well plate for sample delivery.\n\nAdditional enhancements incorporated in the Vi-CELL BLU include:\n\nFully automated sample preparation, analysis and post-run cleaning\nSmall sample size\nFast sample processing time\nLog-in samples on the fly\nSingle sign-on with Active Directory\nSmall laboratory footprint\nFlexible sample introduction – carousel or 96 well plate\nUser-friendly reagent system\nCell viability reported in percentage, concentration, and cell count\nLarge sample capacity\nData integrity tools for 21 CFR Part 11 compliance\n\n\nVi-CELL BLU Cell Viability Analyzer Features\nIncreased Productivity\nFAST mode\n24-position carousel\nSupports 96 well plate sample introduction\nCustomizable analysis parameters\nFlexibility and Ease of Use\nEasy sample vial dispensing\nEasy load reagent pak\nLoad on the go processing\nClean room kit option\nReagent Pack\nRFID Tracking of reagent part number, lot number, activities, and expiration date\nEasy load for automated sample prep\nReagent pack complete with Trypan Blue dye, buffer, disinfectant and cleaning solutions\nData Integrity and Compliance\nAudit trail\nError log files\nElectronic signature capability\nSecure user sign-on\nUser level permissions\nAdministrative configuration tools\nIQ/OQ",
    productTypes: ["PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Beckman Coulter Life Sciences",
    listPrice: {
      type: "ProductPrice",
      value: 0.0,
      currencyMnemonic: "N/A",
      currency: "N/A",
    },
    salePrice: {
      type: "ProductPrice",
      value: 0.0,
      currencyMnemonic: "N/A",
      currency: "N/A",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    images: [
      {
        name: "primary M",
        type: "Image",
        effectiveUrl:
          "https://s7d9.scene7.com/is/image/danaherstage/beckman-vi-cell-blu-cell-viability-analyzer-carousel-201901-hero",
        viewID: "primary",
        typeID: "M",
        primaryImage: true,
      },
    ],
    attributeGroups: {},
    seoAttributes: {
      metaTitle: "Vi-CELL BLU Cell Viability Analyzer",
      metaDescription: "Vi-CELL BLU Cell Viability Analyzer",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
  {
    name: "Base Plate DMi8",
    type: "Product",
    attributes: [
      {
        name: "show_add_to_cart",
        type: "String",
        value: "True",
      },
    ],
    sku: "158000640",
    productName: "Base Plate DMi8",
    longDescription: "Base Plate DMi8",
    productTypes: ["BUNDLED_PRODUCT"],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: "0.0",
    averageRating: "0.0",
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: "Leica Microsystems",
    listPrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    salePrice: {
      type: "ProductPrice",
      value: 1653.0,
      currencyMnemonic: "USD",
      currency: "USD",
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: "",
    shippingMethods: [
      {
        name: "2-Business Day - Leica",
        type: "ShippingMethod",
        id: "STD_2DAY",
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: "Standard Ground - Phenomenex",
        type: "ShippingMethod",
        id: "STD_GROUND_Phenomenex",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: "Standard Ground - Common",
        type: "ShippingMethod",
        id: "STD_GROUND",
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: "PRODUCT_DETAIL_ATTRIBUTES",
        attributes: [
          {
            name: "show_add_to_cart",
            type: "String",
            value: "True",
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: "Base Plate DMi8",
      metaDescription: "Base Plate DMi8",
      robots: ["index", "follow"],
    },
    numberOfReviews: 0,
    supplierSKU: "",
    src: "https://placehold.co/91x85",
  },
];
export const getProductQuantity = async (newItem) => {
  let basketDetail = await getBasketDetails();
  if (basketDetail) console.log("basketdetaill", basketDetail);
  let totalProductQuantity;
  const basketData = JSON.parse(sessionStorage.getItem("basketData"));

  if (basketData) {
    totalProductQuantity = basketData.totalProductQuantity;
    const updatedCart = await updateCart(newItem);
    if (updatedCart) {
      const cartQuantityResponse = await updateCartQuantity(
        totalProductQuantity
      );
      if (cartQuantityResponse) {
        return cartQuantityResponse;
      }
    }
  }
};

export const updateCartItemQunatity = async (item) => {
  console.log("item to be updated", item);

  let totalProductQuantity;
  if (item.type == "delete-item") {
    const authenticationToken = await getAuthenticationToken();
    if (!authenticationToken) {
      return { status: "error", data: "Unauthorized access." };
    }
    const defaultHeader = new Headers({
      "Content-Type": "Application/json",
      "Authentication-Token": authenticationToken.access_token,
      Accept: "application/vnd.intershop.basket.v1+json",
    });
    console.log(
      "DELETE ITEM FROM BASKET API CALLLED HERE WITH: ",
      defaultHeader
    );
    const url = `${baseURL}/baskets/current/items/${item.lineItemId}`;
    try {
      const response = await deleteApiData(url, defaultHeader);
      if (response && response.status === "success") {
        console.log("responseeeee  :", response);
        const basketDetails = await updateBasketDetails();
        // if basket exists add product and update the cart
        if (basketDetails) {
          totalProductQuantity = basketDetails.data.totalProductQuantity;
          console.log("responseeeee  :", totalProductQuantity);
          if (totalProductQuantity == 0) {
            const qunatityUpdate = await updateProductQuantityValue(
              item.type,
              0,
              item.lineItemId,
              item.manufacturer
            );
            if (qunatityUpdate) {
              const cartQuantityResponse = await updateCartQuantity(
                totalProductQuantity
              );
              if (cartQuantityResponse) {
                return qunatityUpdate;
              }
            }
          } else {
            const cartQuantityResponse = await updateCartQuantity(
              totalProductQuantity
            );
            console.log("baskettt", basketDetails, item.type);
            const qunatityUpdate = await updateProductQuantityValue(
              item.type,
              0,
              item.lineItemId,
              item.manufacturer
            );
            if (qunatityUpdate) {
              return qunatityUpdate;
            }
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  } else {
    const authenticationToken = await getAuthenticationToken();
    if (!authenticationToken) {
      return { status: "error", data: "Unauthorized access." };
    }
    const defaultHeader = new Headers({
      "Content-Type": "Application/json",
      "Authentication-Token": authenticationToken.access_token,
      Accept: "application/vnd.intershop.basket.v1+json",
    });
    console.log(
      "UPDATE SINGLE ITEM QUANTITY API CALLED HERE WITH: ",
      defaultHeader
    );

    const url = `${baseURL}/baskets/current/items/${item.lineItemId}`;
    console.log("uuurrrrrllll", url);

    try {
      const data = {
        quantity: {
          value: Number(item.value),
          unit: "",
        },
      };
      const response = await patchApiData(
        url,
        JSON.stringify(data),
        defaultHeader
      );
      if (response && response.status === "success") {
        console.log("responseeeee  :", response);
        const prodQuantity = response.data.data.quantity.value;
        const basketDetails = await updateBasketDetails();
        // if basket exists add product and update the cart
        if (basketDetails) {
          totalProductQuantity = basketDetails.data.totalProductQuantity;
          console.log("responseeeee  :", totalProductQuantity);
          const cartQuantityResponse = await updateCartQuantity(
            totalProductQuantity
          );
          console.log("baskettt", basketDetails);
          console.log("quantrity", prodQuantity);
          const qunatityUpdate = await updateProductQuantityValue(
            item.type,
            prodQuantity,
            item.lineItemId,
            item.manufacturer
          );
          if (qunatityUpdate) {
            return qunatityUpdate;
          }
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};

// Add item to cart
export const addItemToCart = async (item) => {
  console.log("item to be updated", item);
  let basketDetails = await getBasketDetails();
  // if basket exists add product and update the cart
  if (basketDetails) {
    const addItem = await addItemToBasket(item);
    console.log("addItem", addItem);
    if (addItem) {
      if (addItem.status === "success") {
        let updateCartItem = await updateCartItems(addItem);
        return getProductQuantity(updateCartItem);
      } else {
        return {
          data: addItem.data,
          status: "error",
        };
      }
    }
    return { status: "error", data: addItem.data };
  }
  // if basket doesn't exists create basket and then add item
  else {
    const response = await createBasket();
    if (response) {
      if (response.status === "success") {
        sessionStorage.setItem(
          "basketData",
          JSON.stringify(response.data.data)
        );
        const addItem = await addItemToBasket(item);
        console.log("addItem", addItem);

        if (addItem) {
          if (addItem.status === "success") {
            let updateCartItem = await updateCartItems(addItem);
            return getProductQuantity(updateCartItem);
          } else {
            return {
              data: addItem.data,
              status: "error",
            };
          }
        }
        return { status: "error", data: addItem.data };
      } else {
        return {
          data: addItem.data,
          status: "error",
        };
      }
    }
    return { status: "error", data: response.data };
  }
};

export const productDetails = async (getItemsFromBasket) => {
  const getItemFromBasket = getItemsFromBasket.data
    ? getItemsFromBasket.data
    : getItemsFromBasket;
  const productDetailsList = await Promise.all(
    getItemFromBasket.map(async (product) => {
      return await productData(product);
    })
  );
  return productDetailsList;
};

export const updateCartItems = async (addItem) => {
  const updatedBasket = await updateBasketDetails();
  if (updateBasketDetails) {
    const productDetailsObject = await getProductDetailObject();
    const cartValue = updatedBasket.data.totalProductQuantity;
    if (productDetailsObject) {
      let totalCount = 0;
      productDetailsObject.data.forEach((entry) => {
        const manufacturer = Object.keys(entry)[0]; // e.g., "Leica Microsystems"
        const products = entry[manufacturer]; // array of products
        const count = products.length;
        console.log(`${manufacturer} has ${count} product(s).`);
        totalCount += count;
      });
      if (totalCount == cartValue) {
        console.log("samee values object is upto date");
        cartItemsValue = productDetailsObject;
      } else {
        if (addItem) {
          const addNewItem = addItem.data
            ? addItem.data.data
              ? addItem.data.data
              : addItem.data
            : "";
          const productDetail = await productDetails(addNewItem);
          if (productDetail) {
            console.log("productDetail", productDetail);
            return productDetail;
          }
        }
      }
    } else {
      console.log("error");
      return "error fetching product object";
    }
  }
};
