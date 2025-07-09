import { div, hr } from '../../scripts/dom-builder.js';
import {
  baseURL,
} from '../../scripts/common-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import {
  getBasketDetails, createBasket,
  logoDiv, divider, cartItemsContainer,
} from '../../scripts/cart-checkout-utils.js';
import {
  postApiData,
} from '../../scripts/api-utils.js';

import {addProducts} from './addproducts.js';
// import {
//   updateCartQuantity, getProductDetailObject, productData, updateBasketDetails,
// } from './cartSharedFile.js';
import { updateCartQuantity, getProductDetailObject, productData, updateBasketDetails } from './cartSharedFile.js';

export const cartItemsValue = [];

export const recommendedProduct = [
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'DMIL Fluorescence for Fluorescence Cell Culture with Documentation',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: 'dmil-fluorescence-for-fluorescence-cell-culture-with-documentation',
    productName:
      'DMIL Fluorescence for Fluorescence Cell Culture with Documentation',
    longDescription:
      'The DM IL LED, equipped with a K3C camera, is tailored for phase contrast and  fluorescence imaging of cell cultures and individual cells.  The system and the intuitive LASX software  document seamlessly routine tasks in cell culture labs like confluence estimation and  transfection efficiency checks.  Elevate your cell culture research with the DM IL LED, featuring a color camera for seamless image capture and providing superior fluorescence capabilities for enhanced visualization and insights into dynamic cell culture phenomena.',
    productTypes: ['PRODUCT_BUNDLE'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: true,
    manufacturer: 'Sciex',
    listPrice: {
      type: 'ProductPrice',
      value: 15000.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 15000.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    bundles:
      'DANAHERLS-LSIG-Site/-/products/dmil-fluorescence-for-fluorescence-cell-culture-with-documentation/bundles',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    images: [
      {
        name: 'primary M',
        type: 'Image',
        effectiveUrl:
          'https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dm-il-led-3',
        viewID: 'primary',
        typeID: 'M',
        primaryImage: true,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle:
        'DMIL Fluorescence for Fluorescence Cell Culture with Documentation',
      metaDescription:
        'DMIL Fluorescence for Fluorescence Cell Culture with Documentation',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
  },
  {
    name: 'Vi-CELL BLU Cell Viability Analyzer',
    type: 'Product',
    sku: 'vi-cell-blu-cell-viability-analyzers',
    productName: 'Vi-CELL BLU Cell Viability Analyzer',
    longDescription:
      'The faster Vi-CELL BLU cell analyzers automates the Trypan Blue Dye Exclusion method for cell viability analysis.\nThe Vi-CELL BLU expedites processing by now having the option to use a 24-position sample carousel or a 96 well plate for sample delivery.\n\nAdditional enhancements incorporated in the Vi-CELL BLU include:\n\nFully automated sample preparation, analysis and post-run cleaning\nSmall sample size\nFast sample processing time\nLog-in samples on the fly\nSingle sign-on with Active Directory\nSmall laboratory footprint\nFlexible sample introduction – carousel or 96 well plate\nUser-friendly reagent system\nCell viability reported in percentage, concentration, and cell count\nLarge sample capacity\nData integrity tools for 21 CFR Part 11 compliance\n\n\nVi-CELL BLU Cell Viability Analyzer Features\nIncreased Productivity\nFAST mode\n24-position carousel\nSupports 96 well plate sample introduction\nCustomizable analysis parameters\nFlexibility and Ease of Use\nEasy sample vial dispensing\nEasy load reagent pak\nLoad on the go processing\nClean room kit option\nReagent Pack\nRFID Tracking of reagent part number, lot number, activities, and expiration date\nEasy load for automated sample prep\nReagent pack complete with Trypan Blue dye, buffer, disinfectant and cleaning solutions\nData Integrity and Compliance\nAudit trail\nError log files\nElectronic signature capability\nSecure user sign-on\nUser level permissions\nAdministrative configuration tools\nIQ/OQ',
    productTypes: ['PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Beckman Coulter Life Sciences',
    listPrice: {
      type: 'ProductPrice',
      value: 0.0,
      currencyMnemonic: 'N/A',
      currency: 'N/A',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 0.0,
      currencyMnemonic: 'N/A',
      currency: 'N/A',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    images: [
      {
        name: 'primary M',
        type: 'Image',
        effectiveUrl:
          'https://s7d9.scene7.com/is/image/danaherstage/beckman-vi-cell-blu-cell-viability-analyzer-carousel-201901-hero',
        viewID: 'primary',
        typeID: 'M',
        primaryImage: true,
      },
    ],
    attributeGroups: {},
    seoAttributes: {
      metaTitle: 'Vi-CELL BLU Cell Viability Analyzer',
      metaDescription: 'Vi-CELL BLU Cell Viability Analyzer',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
  {
    name: 'Base Plate DMi8',
    type: 'Product',
    attributes: [
      {
        name: 'show_add_to_cart',
        type: 'String',
        value: 'True',
      },
    ],
    sku: '158000640',
    productName: 'Base Plate DMi8',
    longDescription: 'Base Plate DMi8',
    productTypes: ['BUNDLED_PRODUCT'],
    availability: true,
    retailSet: false,
    inStock: true,
    productMaster: false,
    mastered: false,
    roundedAverageRating: '0.0',
    averageRating: '0.0',
    minOrderQuantity: 1,
    productBundle: false,
    manufacturer: 'Leica Microsystems',
    listPrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    salePrice: {
      type: 'ProductPrice',
      value: 1653.0,
      currencyMnemonic: 'USD',
      currency: 'USD',
    },
    maxOrderQuantity: 0,
    stepOrderQuantity: 1,
    packingUnit: '',
    shippingMethods: [
      {
        name: '2-Business Day - Leica',
        type: 'ShippingMethod',
        id: 'STD_2DAY',
        shippingTimeMin: 1,
        shippingTimeMax: 2,
      },
      {
        name: 'Standard Ground - Phenomenex',
        type: 'ShippingMethod',
        id: 'STD_GROUND_Phenomenex',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
      {
        name: 'Standard Ground - Common',
        type: 'ShippingMethod',
        id: 'STD_GROUND',
        shippingTimeMin: 3,
        shippingTimeMax: 7,
      },
    ],
    attributeGroups: {
      PRODUCT_DETAIL_ATTRIBUTES: {
        name: 'PRODUCT_DETAIL_ATTRIBUTES',
        attributes: [
          {
            name: 'show_add_to_cart',
            type: 'String',
            value: 'True',
          },
        ],
      },
    },
    seoAttributes: {
      metaTitle: 'Base Plate DMi8',
      metaDescription: 'Base Plate DMi8',
      robots: ['index', 'follow'],
    },
    numberOfReviews: 0,
    supplierSKU: '',
    src: 'https://placehold.co/91x85',
  },
];

export async function updateCart(newItem) {
  const getProductDetailsObject = await getProductDetailObject();
  if (getProductDetailsObject) {
    console.log("getProductDetailsObject", getProductDetailsObject);
    const response = getProductDetailsObject.data.map((itemToBeDisplayed) => {
      console.log("itemToBeDisplayed", itemToBeDisplayed);
      const opcoBe = Object.keys(itemToBeDisplayed);
      const imgsrc = opcoBe[0].split(" ")[0];
      if (newItem[0].data.manufacturer == opcoBe[0]) {
        const quantityElement = document.getElementById(
          `product-Quantity-${opcoBe[0]}`
        );
        const cartContainer = document.getElementById(opcoBe[0]);
        if (cartContainer) {
          cartContainer.append(cartItemsContainer(newItem[0].data)); // Add updated item
          quantityElement.innerHTML = ` ${itemToBeDisplayed[opcoBe].length} Items`;
          return cartContainer;
        } else {
          console.log("inside else");
          const cartItemContainer =
            document.getElementById("cartItemContainer");
          if (cartItemContainer.hasChildNodes() === false) {
            console.log("inside if");
            const cartListContainer = div({
              class: "w-full",
              id: "cartListContainer",
            });
            const addProductListContainer = div({
              class: "",
              id: "addProductListContainer",
            });
            const cartItemDisplayContainer = div({
              class: "",
              id: opcoBe[0],
            });

            let logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
            console.log("logoDivDisplay: 381", logoDivDisplay);
            // cartListContainer.append(divider(300));
            cartListContainer.append(logoDivDisplay);
            // cartListContainer.append(divider(200));
            itemToBeDisplayed[opcoBe].forEach((item) => {
              cartItemDisplayContainer.append(divider(200));
              cartItemDisplayContainer.append(cartItemsContainer(item));
              
            });

            cartListContainer.append(cartItemDisplayContainer);
            // cartListContainer.append(divider(300));
            console.log("cartItemDisplayContainer 181: ", cartItemContainer);
            const dividerMain = hr({
              class: `w-full border-black-400`,
            });

            addProductListContainer.append(addProducts());
            addProductListContainer.append(dividerMain);
            cartItemContainer.append(cartListContainer);
            // cartItemContainer.append(addProductListContainer);
            return cartItemContainer;
          } else {
            const cartListContainer =
              document.getElementById("cartListContainer");
            console.log("inside else", cartListContainer);
            const cartItemDisplayContainer = div({
              class: "w-full",
              id: opcoBe[0],
            });

            let logoDivDisplay = logoDiv(itemToBeDisplayed, opcoBe, imgsrc);
            console.log("logoDivDisplay 411", logoDivDisplay);
            // cartListContainer.append(divider(300));
            cartListContainer.append(logoDivDisplay);
            // cartListContainer.append(divider(200));
            itemToBeDisplayed[opcoBe].forEach((item) => {
              cartItemDisplayContainer.append(divider(200));
              cartItemDisplayContainer.append(cartItemsContainer(item));
              
            });
            cartListContainer.append(cartItemDisplayContainer);
            // cartListContainer.append(divider(300));
            return cartItemContainer;
          }
        }
      }
    });
    console.log("responseeee", response);
    if (response[0] == undefined) return response[1];
    else return response[0];
  }
}

// function to add item to basket
export const addItemToBasket = async (item) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    Accept: 'application/vnd.intershop.basket.v1+json',
  });
  const url = `${baseURL}/baskets/current/items?include=cross-sell`;
  const data = [
    {
      product: item.sku.value,
      calculated: true,
    },
  ];
  try {
    const response = await postApiData(
      url,
      JSON.stringify(data),
      defaultHeader,
    );
    if (response) {
      return response;
    }
    return 'error';
  } catch (error) {
    // console.log('error', error);
    return 'error';
  }
};

export const getProductQuantity = async (newItem) => {
  // const basketDetail = await getBasketDetails();
  let totalProductQuantity;
  const basketData = JSON.parse(sessionStorage.getItem('basketData'));

  if (basketData) {
    totalProductQuantity = basketData.totalProductQuantity;
    const updatedCart = await updateCart(newItem);
    if (updatedCart) {
      const cartQuantityResponse = await updateCartQuantity(
        totalProductQuantity,
      );
      if (cartQuantityResponse) {
        return cartQuantityResponse;
      }

      return 'error in cart quantity';
    }
    return 'error in update cart.';
  }
  return 'no basket object found.';
};

export const productDetails = async (getItemsFromBasket) => {
  const getItemFromBasket = getItemsFromBasket.data
    ? getItemsFromBasket.data
    : getItemsFromBasket;
  const productDetailsList = await Promise.all(
    getItemFromBasket.map(async (product) => {
      const productDataResponse = await productData(product);
      return productDataResponse;
    }),
  );
  return productDetailsList;
};

// update cart items
export const updateCartItems = async (addItem) => {
  const updatedBasket = await updateBasketDetails();
  if (updatedBasket) {
    const productDetailsObject = await getProductDetailObject();
    const cartValue = updatedBasket.data.totalProductQuantity;
    if (productDetailsObject) {
      let totalCount = 0;
      productDetailsObject.data.forEach((entry) => {
        const manufacturer = Object.keys(entry)[0]; // e.g., "Leica Microsystems"
        const products = entry[manufacturer]; // array of products
        const count = products.length;
        totalCount += count;
      });
      if (totalCount === cartValue) {
        cartItemsValue.push(productDetailsObject);
      } else if (addItem) {
        let addNewItem = '';
        if (addItem.data) {
          if (addItem.data.data) {
            addNewItem = addItem.data.data;
          } else {
            addNewItem = addItem.data;
          }
        } else {
          addNewItem = '';
        }
        const productDetail = await productDetails(addNewItem);
        if (productDetail) {
          return productDetail;
        }
        return 'error in getting product details';
      } else {
        return 'error';
      }
    } else {
      // console.log('error');
      return 'error fetching product object';
    }
  } else {
    return 'no data fetched from update basket details.';
  }
  //  add a default return to satisfy consistent-return rule
  return null;
};

// Add item to cart
export const addItemToCart = async (item) => {
  const basketDetails = await getBasketDetails();
  // if basket exists add product and update the cart
  if (basketDetails) {
    const addItem = await addItemToBasket(item);
    if (addItem) {
      if (addItem.status === 'success') {
        const updateCartItem = await updateCartItems(addItem);
        return getProductQuantity(updateCartItem);
      }
      return {
        data: addItem.data,
        status: 'error',
      };
    }
    return { status: 'error', data: addItem.data };
  }
  // if basket doesn't exists create basket and then add item

  const response = await createBasket();
  if (response) {
    if (response.status === 'success') {
      sessionStorage.setItem(
        'basketData',
        JSON.stringify(response.data.data),
      );
      const addItem = await addItemToBasket(item);

      if (addItem) {
        if (addItem.status === 'success') {
          const updateCartItem = await updateCartItems(addItem);
          return getProductQuantity(updateCartItem);
        }
        return {
          data: addItem.data,
          status: 'error',
        };
      }
      return { status: 'error', data: addItem.data };
    }
    return {
      data: response.data,
      status: 'error',
    };
  }
  return { status: 'error', data: response.data };
};
