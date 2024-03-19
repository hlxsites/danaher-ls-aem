export const suggestions = {
  count: 8,
  q: "",
  locale: 'en',
  timezone: 'America/New_York',
  pipeline: 'Danaher Marketplace',
  searchHub: 'DanaherMainSearch',
  visitorId: 'd8c6a2a1-84e4-4d6f-b262-b91ad50a4c44',
}

export const facetSelect = {
  locale: 'en',
  timezone: 'America/New_York',
  pipeline: 'Danaher Marketplace',
  searchHub: 'DanaherMainSearch',
  visitorId: '87f2e820-f08c-48c8-bf0a-de04825619f9',
  "debug": false,
  "tab": "default",
  "referrer": "https://stage.lifesciences.danaher.com/",
  "context": {
    "host": "stage.lifesciences.danaher.com",
    "internal": false
  },
  "fieldsToInclude": [
    "author",
    "language",
    "urihash",
    "objecttype",
    "collection",
    "source",
    "permanentid",
    "date",
    "filetype",
    "parents",
    "ec_price",
    "ec_name",
    "ec_description",
    "ec_brand",
    "ec_category",
    "ec_item_group_id",
    "ec_shortdesc",
    "ec_thumbnails",
    "ec_images",
    "ec_promo_price",
    "ec_in_stock",
    "ec_rating",
    "brand",
    "images",
    "sku",
    "title",
    "description",
    "richdescription",
    "opco",
    "contenttype",
    "documenttype",
    "pagetype",
    "shortspecifications",
    "specificationsjson",
    "bundlepreviewjson"
  ],
  "q": "",
  "enableQuerySyntax": false,
  "sortCriteria": "relevancy",
  "numberOfResults": 10,
  "firstResult": 0,
  "facetOptions": {
    "freezeFacetOrder": true
  },
  "facets": [
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "Document",
          "state": "selected"
        },
        {
          "value": "Product",
          "state": "idle"
        },
        {
          "value": "Webpage",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": true,
      "isFieldExpanded": false,
      "preventAutoSelect": true,
      "facetId": "ContentType",
      "field": "contenttype"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "Blog",
          "state": "idle"
        },
        {
          "value": "Document",
          "state": "idle"
        },
        {
          "value": "News",
          "state": "idle"
        },
        {
          "value": "Other",
          "state": "idle"
        },
        {
          "value": "Product",
          "state": "idle"
        },
        {
          "value": "Technical Library",
          "state": "idle"
        },
        {
          "value": "Workflow",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "PageType",
      "field": "pagetype"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "Beckman Coulter Life Sciences",
          "state": "idle"
        },
        {
          "value": "Phenomenex",
          "state": "idle"
        },
        {
          "value": "Leica Microsystems",
          "state": "idle"
        },
        {
          "value": "Molecular Devices",
          "state": "idle"
        },
        {
          "value": "SCIEX",
          "state": "idle"
        },
        {
          "value": "Beckman Coulter",
          "state": "idle"
        },
        {
          "value": "IDBS",
          "state": "idle"
        },
        {
          "value": "Leica Microsystems;Molecular Devices",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "Brand",
      "field": "opco"
    },
    {
      "delimitingCharacter": "|",
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "occurrences",
      "basePath": [],
      "filterByBasePath": true,
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "hierarchical",
      "facetId": "ProductType",
      "field": "categoriesname"
    },
    {
      "delimitingCharacter": "|",
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "occurrences",
      "basePath": [],
      "filterByBasePath": true,
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "hierarchical",
      "facetId": "ProcessStep",
      "field": "workflowname"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "SubBrand",
      "field": "brand"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "ProductClass",
      "field": "productclass"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "DocumentType",
      "field": "documenttype"
    }
  ]
}

export const facetDeselect = {
  locale: 'en',
  timezone: 'America/New_York',
  pipeline: 'Danaher Marketplace',
  searchHub: 'DanaherMainSearch',
  visitorId: '87f2e820-f08c-48c8-bf0a-de04825619f9',
  "debug": false,
  "tab": "default",
  "referrer": "https://stage.lifesciences.danaher.com/",
  "actionsHistory": [
    {
      "name": "Query",
      "time": "\"2024-03-04T22:37:36.935Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T22:35:04.728Z\""
    },
    {
      "name": "PageView",
      "time": "2024-03-04T22:35:03.607Z",
      "value": "/content/danaher/ls/us/en/search"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T20:08:10.233Z\"",
      "value": "cell"
    },
    {
      "name": "PageView",
      "time": "2024-03-04T20:08:09.518Z",
      "value": "/content/danaher/ls/us/en/search"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T20:07:45.709Z\"",
      "value": "cell"
    },
    {
      "name": "PageView",
      "time": "2024-03-04T20:07:45.160Z",
      "value": "/content/danaher/ls/us/en/search"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T20:07:13.126Z\"",
      "value": "cell"
    },
    {
      "name": "PageView",
      "time": "2024-03-04T20:07:11.840Z",
      "value": "/content/danaher/ls/us/en/search"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T20:01:54.478Z\"",
      "value": "mic"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T19:58:14.143Z\"",
      "value": "mic"
    },
    {
      "name": "PageView",
      "time": "2024-03-04T19:58:12.728Z",
      "value": "/content/danaher/ls/us/en/search"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:48:09.863Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:45:25.428Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:42:36.513Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:41:15.301Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:35:14.401Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:34:12.218Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:30:34.952Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T15:27:39.498Z\""
    }
  ],
  "context": {
    "host": "stage.lifesciences.danaher.com",
    "internal": false
  },
  "fieldsToInclude": [
    "author",
    "language",
    "urihash",
    "objecttype",
    "collection",
    "source",
    "permanentid",
    "date",
    "filetype",
    "parents",
    "ec_price",
    "ec_name",
    "ec_description",
    "ec_brand",
    "ec_category",
    "ec_item_group_id",
    "ec_shortdesc",
    "ec_thumbnails",
    "ec_images",
    "ec_promo_price",
    "ec_in_stock",
    "ec_rating",
    "brand",
    "images",
    "sku",
    "title",
    "description",
    "richdescription",
    "opco",
    "contenttype",
    "documenttype",
    "pagetype",
    "shortspecifications",
    "specificationsjson",
    "bundlepreviewjson"
  ],
  "q": "",
  "enableQuerySyntax": false,
  "sortCriteria": "relevancy",
  "queryCorrection": {
    "enabled": false,
    "options": {
      "automaticallyCorrect": "whenNoResults"
    }
  },
  "enableDidYouMean": true,
  "facets": [
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "Document",
          "state": "idle"
        },
        {
          "value": "Product",
          "state": "idle"
        },
        {
          "value": "Webpage",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": true,
      "isFieldExpanded": false,
      "preventAutoSelect": true,
      "facetId": "ContentType",
      "field": "contenttype"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "Document",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "PageType",
      "field": "pagetype"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
          {
            "value": "Beckman Coulter Life Sciences",
            "state": "idle"
          },
          {
            "value": "IDBS",
            "state": "idle"
          },
          {
            "value": "Leica Microsystems",
            "state": "idle"
          },
          {
            "value": "Molecular Devices",
            "state": "idle"
          },
          {
            "value": "Phenomenex",
            "state": "idle"
          },
          {
            "value": "SCIEX",
            "state": "idle"
          }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "Brand",
      "field": "opco"
    },
    {
      "delimitingCharacter": "|",
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "occurrences",
      "basePath": [],
      "filterByBasePath": true,
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "hierarchical",
      "facetId": "ProductType",
      "field": "categoriesname"
    },
    {
      "delimitingCharacter": "|",
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "occurrences",
      "basePath": [],
      "filterByBasePath": true,
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "hierarchical",
      "facetId": "ProcessStep",
      "field": "workflowname"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "SubBrand",
      "field": "brand"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "ProductClass",
      "field": "productclass"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "DocumentType",
      "field": "documenttype"
    }
  ],
  "numberOfResults": 10,
  "firstResult": 0,
  "facetOptions": {
    "freezeFacetOrder": true
  }
}

export const finishType = {
  "locale": "en",
  "debug": false,
  "tab": "default",
  "referrer": "default",
  "timezone": "America/New_York",
  "visitorId": "147f954b-ddc1-4834-8f71-0de880f7283f",
  "actionsHistory": [
      {
          "name": "Query",
          "time": "\"2024-03-04T22:26:29.769Z\""
      },
      {
          "name": "Query",
          "time": "\"2024-03-04T22:25:42.258Z\"",
          "value": "men"
      },
      {
          "name": "Query",
          "time": "\"2024-03-04T22:25:35.892Z\""
      },
      {
          "name": "Query",
          "time": "\"2024-03-04T22:25:02.692Z\"",
          "value": "sand"
      },
      {
          "name": "Query",
          "time": "\"2024-03-04T22:24:46.716Z\""
      }
  ],
  "fieldsToInclude": [
      "author",
      "language",
      "urihash",
      "objecttype",
      "collection",
      "source",
      "permanentid",
      "date",
      "filetype",
      "parents",
      "ec_price",
      "ec_name",
      "ec_description",
      "ec_brand",
      "ec_category",
      "ec_item_group_id",
      "ec_shortdesc",
      "ec_thumbnails",
      "ec_images",
      "ec_promo_price",
      "ec_in_stock",
      "ec_rating",
      "cat_rating_count"
  ],
  "pipeline": "Search",
  "q": "",
  "enableQuerySyntax": false,
  "searchHub": "MainSearch",
  "facets": [
      {
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "automatic",
          "resultsMustMatch": "atLeastOneValue",
          "type": "specific",
          "currentValues": [
              {
                  "value": "Document",
                  "state": "idle"
              },
              {
                  "value": "Product",
                  "state": "idle"
              },
              {
                  "value": "Webpage",
                  "state": "idle"
              }
          ],
          "freezeCurrentValues": true,
          "isFieldExpanded": false,
          "preventAutoSelect": true,
          "facetId": "ContentType",
          "field": "contenttype"
      },
      {
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "automatic",
          "resultsMustMatch": "atLeastOneValue",
          "type": "specific",
          "currentValues": [
              {
                  "value": "Document",
                  "state": "idle"
              }
          ],
          "freezeCurrentValues": false,
          "isFieldExpanded": false,
          "preventAutoSelect": false,
          "facetId": "PageType",
          "field": "pagetype"
      },
      {
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "automatic",
          "resultsMustMatch": "atLeastOneValue",
          "type": "specific",
          "currentValues": [
              {
                  "value": "Beckman Coulter Life Sciences",
                  "state": "idle"
              },
              {
                  "value": "IDBS",
                  "state": "idle"
              },
              {
                  "value": "Leica Microsystems",
                  "state": "idle"
              },
              {
                  "value": "Molecular Devices",
                  "state": "idle"
              },
              {
                  "value": "Phenomenex",
                  "state": "idle"
              },
              {
                  "value": "SCIEX",
                  "state": "idle"
              }
          ],
          "freezeCurrentValues": false,
          "isFieldExpanded": false,
          "preventAutoSelect": false,
          "facetId": "Brand",
          "field": "opco"
      },
      {
          "delimitingCharacter": "|",
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "occurrences",
          "basePath": [],
          "filterByBasePath": true,
          "resultsMustMatch": "atLeastOneValue",
          "currentValues": [],
          "preventAutoSelect": false,
          "type": "hierarchical",
          "facetId": "ProductType",
          "field": "categoriesname"
      },
      {
          "delimitingCharacter": "|",
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "occurrences",
          "basePath": [],
          "filterByBasePath": true,
          "resultsMustMatch": "atLeastOneValue",
          "currentValues": [],
          "preventAutoSelect": false,
          "type": "hierarchical",
          "facetId": "ProcessStep",
          "field": "workflowname"
      },
      {
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "automatic",
          "resultsMustMatch": "atLeastOneValue",
          "type": "specific",
          "currentValues": [],
          "freezeCurrentValues": false,
          "isFieldExpanded": false,
          "preventAutoSelect": false,
          "facetId": "SubBrand",
          "field": "brand"
      },
      {
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "automatic",
          "resultsMustMatch": "atLeastOneValue",
          "type": "specific",
          "currentValues": [],
          "freezeCurrentValues": false,
          "isFieldExpanded": false,
          "preventAutoSelect": false,
          "facetId": "ProductClass",
          "field": "productclass"
      },
      {
          "filterFacetCount": true,
          "injectionDepth": 1000,
          "numberOfValues": 8,
          "sortCriteria": "automatic",
          "resultsMustMatch": "atLeastOneValue",
          "type": "specific",
          "currentValues": [],
          "freezeCurrentValues": false,
          "isFieldExpanded": false,
          "preventAutoSelect": false,
          "facetId": "DocumentType",
          "field": "documenttype"
      }
  ],
  "sortCriteria": "relevancy",
  "analytics": {
      "clientId": "147f954b-ddc1-4834-8f71-0de880f7283f",
      "clientTimestamp": "2024-03-04T22:28:18.381Z",
      "documentReferrer": "default",
      "originContext": "Search",
      "documentLocation": "https://atomicv2-mcgfqb.stackblitz.io/examples/fashion.html",
      "capture": false
  },
  "enableDidYouMean": true,
  "numberOfResults": 4
}

export const quickSearch = {
  locale: 'en',
  timezone: 'America/New_York',
  searchHub: 'default',
  visitorId: '48e4da72-35f0-43ec-9c61-a6aed682e6c3',
  "debug": false,
  "tab": "default",
  "referrer": "default",
  "actionsHistory": [
    {
      "name": "Query",
      "time": "\"2024-03-04T22:19:01.829Z\"",
      "value": "this is beacon testing"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T22:17:18.017Z\"",
        "value": "promega corporation"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T22:17:10.215Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T20:02:41.386Z\"",
      "value": "bank"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T20:02:32.491Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T18:21:47.520Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T18:20:23.534Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T16:53:48.016Z\"",
      "value": "bank"
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T16:52:20.699Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-03-04T16:47:47.427Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-02-21T14:10:02.721Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-02-20T18:58:45.364Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-02-20T18:45:48.757Z\""
    },
    {
      "name": "Query",
      "time": "\"2024-02-20T18:43:58.682Z\""
    },
    {
      "name": "Query",
      "time": "\"2023-12-07T19:35:58.897Z\""
    },
    {
      "name": "Query",
      "time": "\"2023-12-07T19:34:42.960Z\""
    },
    {
      "name": "Query",
      "time": "\"2023-12-07T19:34:33.361Z\"",
      "value": "covid"
    },
    {
      "name": "Query",
      "time": "\"2023-12-07T19:33:31.851Z\""
    },
    {
      "name": "Query",
      "time": "\"2023-12-07T19:33:28.699Z\"",
      "value": "bank"
    },
    {
      "name": "Query",
      "time": "\"2023-12-07T19:33:26.959Z\"",
      "value": "the bank"
    }
  ],
  "fieldsToInclude": [
    "author",
    "language",
    "urihash",
    "objecttype",
    "collection",
    "source",
    "permanentid",
    "date",
    "filetype",
    "parents",
    "ec_price",
    "ec_name",
    "ec_description",
    "ec_brand",
    "ec_category",
    "ec_item_group_id",
    "ec_shortdesc",
    "ec_thumbnails",
    "ec_images",
    "ec_promo_price",
    "ec_in_stock",
    "ec_rating",
    "snrating",
    "sncost"
  ],
  "q": "",
  "enableQuerySyntax": false,
  "sortCriteria": "relevancy",
  "queryCorrection": {
    "enabled": false,
    "options": {
      "automaticallyCorrect": "whenNoResults"
    }
  },
  "enableDidYouMean": true,
  "facets": [
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 6,
      "sortCriteria": "occurrences",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "Image",
          "state": "idle"
        },
        {
          "value": "lithiummessage",
          "state": "idle"
        },
        {
          "value": "lithiumthread",
          "state": "idle"
        },
        {
          "value": "pdf",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "filetype",
      "field": "filetype"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "Coveo Sample - Lithium Community",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "source",
      "field": "source"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "2021",
          "state": "idle"
        },
        {
          "value": "2022",
          "state": "idle"
        },
        {
          "value": "2023",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "year",
      "field": "year"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 7,
      "sortCriteria": "descending",
      "rangeAlgorithm": "even",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [
        {
          "start": "2024/03/04@17:19:01",
          "end": "2034/03/04@17:19:01",
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": "2024/03/04@16:19:01",
          "end": "2024/03/04@17:19:01",
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": "2024/03/03@17:19:01",
          "end": "2024/03/04@17:19:01",
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": "2024/02/26@17:19:01",
          "end": "2024/03/04@17:19:01",
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": "2024/02/04@17:19:01",
          "end": "2024/03/04@17:19:01",
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": "2023/12/04@17:19:01",
          "end": "2024/03/04@17:19:01",
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": "2023/03/04@17:19:01",
          "end": "2024/03/04@17:19:01",
          "endInclusive": false,
          "state": "idle"
        }
      ],
      "preventAutoSelect": false,
      "type": "dateRange",
      "facetId": "date",
      "field": "date",
      "generateAutomaticRanges": false
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 1,
      "sortCriteria": "ascending",
      "rangeAlgorithm": "even",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "dateRange",
      "facetId": "date_input_range",
      "generateAutomaticRanges": true,
      "field": "date"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 0,
      "sortCriteria": "ascending",
      "rangeAlgorithm": "even",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "dateRange",
      "facetId": "date_input",
      "field": "date",
      "generateAutomaticRanges": false
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 6,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "inat_kingdom",
      "field": "inat_kingdom",
      "hasBreadcrumbs": false
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [
        {
          "value": "mardueng",
          "state": "idle"
        }
      ],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "author",
      "field": "author"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "inat_family",
      "field": "inat_family"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "automatic",
      "resultsMustMatch": "atLeastOneValue",
      "type": "specific",
      "currentValues": [],
      "freezeCurrentValues": false,
      "isFieldExpanded": false,
      "preventAutoSelect": false,
      "facetId": "inat_class",
      "field": "inat_class"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "ascending",
      "rangeAlgorithm": "equiprobable",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "numericalRange",
      "facetId": "sncost",
      "field": "sncost",
      "generateAutomaticRanges": true
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 1,
      "sortCriteria": "ascending",
      "rangeAlgorithm": "equiprobable",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "numericalRange",
      "generateAutomaticRanges": true,
      "facetId": "ytviewcount_input_range",
      "field": "ytviewcount"
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 0,
      "sortCriteria": "ascending",
      "rangeAlgorithm": "even",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "numericalRange",
      "facetId": "ytviewcount_input",
      "field": "ytviewcount",
      "generateAutomaticRanges": false
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 5,
      "sortCriteria": "descending",
      "rangeAlgorithm": "even",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [
        {
          "start": 5,
          "end": 5,
          "endInclusive": true,
          "state": "idle"
        },
        {
          "start": 4,
          "end": 5,
          "endInclusive": true,
          "state": "idle"
        },
        {
          "start": 3,
          "end": 5,
          "endInclusive": true,
          "state": "idle"
        },
        {
          "start": 2,
          "end": 5,
          "endInclusive": true,
          "state": "idle"
        },
        {
          "start": 1,
          "end": 5,
          "endInclusive": true,
          "state": "idle"
        }
      ],
      "preventAutoSelect": false,
      "type": "numericalRange",
      "facetId": "snrating_range",
      "field": "snrating",
      "generateAutomaticRanges": false
    },
    {
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 5,
      "sortCriteria": "descending",
      "rangeAlgorithm": "even",
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [
        {
          "start": 5,
          "end": 6,
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": 4,
          "end": 5,
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": 3,
          "end": 4,
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": 2,
          "end": 3,
          "endInclusive": false,
          "state": "idle"
        },
        {
          "start": 1,
          "end": 2,
          "endInclusive": false,
          "state": "idle"
        }
      ],
      "preventAutoSelect": false,
      "type": "numericalRange",
      "facetId": "snrating",
      "field": "snrating",
      "generateAutomaticRanges": false
    },
    {
      "delimitingCharacter": ";",
      "filterFacetCount": true,
      "injectionDepth": 1000,
      "numberOfValues": 8,
      "sortCriteria": "occurrences",
      "basePath": [],
      "filterByBasePath": true,
      "resultsMustMatch": "atLeastOneValue",
      "currentValues": [],
      "preventAutoSelect": false,
      "type": "hierarchical",
      "facetId": "geographicalhierarchy",
      "field": "geographicalhierarchy"
    }
  ],
  "numberOfResults": 10,
  "firstResult": 0,
  "facetOptions": {
    "freezeFacetOrder": false
  }
}