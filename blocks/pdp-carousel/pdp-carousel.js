import { div, span } from '../../scripts/dom-builder.js';

import { decorateIcons } from '../../scripts/lib-franklin.js';
import renderGridCard from './gridData.js';
import { getProductRecommendationsResponse } from '../../scripts/commerce.js';

function getCardsPerPageGrid() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 4;
}

const apiCall = {
  totalCount: 8,
  totalCountFiltered: 8,
  duration: 51,
  indexDuration: 27,
  requestDuration: 35,
  searchUid: '6261e206-1e43-46f4-ade8-df1ecca10faa',
  pipeline: 'Danaher LifeSciences Product Recommendations',
  apiVersion: 2,
  queryCorrections: [],
  index: 'danaherproductionrfl96bkr-r5tqk4l3-Indexer-1-vcamtn4ijcejrwvinl6nc5kada',
  indexRegion: 'us-east-2',
  indexToken: 'ZGFuYWhlcnByb2R1Y3Rpb25yZmw5NmJrci1yNXRxazRsMy1JbmRleGVyLTEtdmNhbXRuNGlqY2Vqcnd2aW5sNm5jNWthZGE=',
  refinedKeywords: [],
  triggers: [],
  termsToHighlight: { },
  phrasesToHighlight: { },
  groupByResults: [],
  facets: [],
  suggestedFacets: [],
  categoryFacets: [],
  results: [{
    title: 'Vi-CELL MetaFLEX Bioanalyte Analyzers',
    uri: 'family://vi-cell-metaflex-bioanalyte-analyzers/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/vi-cell-metaflex-bioanalyte-analyzers.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/vi-cell-metaflex-bioanalyte-analyzers.html',
    uniqueId: '42.58494$family://vi-cell-metaflex-bioanalyte-analyzers/',
    excerpt: 'Quality Management ... Customizable QC schedule Applications R&D QC Manufacturing Ideal for micro to large scale cell culture applications, the Vi-CELL MetaFLEX is designed for ...',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1070337,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: 'uG7oh4VeQrk9bT70',
      urihash: 'uG7oh4VeQrk9bT70',
      categoriesname: ['Cell Counters and Analyzers', 'Cell Counters and Analyzers|Bio Process Monitors'],
      description: 'Fast accurate bioanalyte analysis\nSmall sample volume (65 µl)\nResults in 35 seconds\nAccurate analysis of pH, pO2, pCO2, glucose, lactate, electrolytes and more',
      permanentid: 'vi-cell-metaflex-bioanalyte-analyzers',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://danaherls.scene7.com/is/image/danaher/beckman-vi-cell-metaflex-hero', 'https://danaherls.scene7.com/is/image/danaher/beckman-cell-counting-vi-cell-metaflex-reagent-image1', 'https://danaherls.scene7.com/is/image/danaher/beckman-metabolite-analyzer-vi-cell-metaflex-cup-sample-image2', 'https://danaherls.scene7.com/is/image/danaher/beckman-metabolite-analyzer-vi-cell-metaflex-syringe-sample-image3'],
    },
    Title: 'Vi-CELL MetaFLEX Bioanalyte Analyzers',
    Uri: 'family://vi-cell-metaflex-bioanalyte-analyzers/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/vi-cell-metaflex-bioanalyte-analyzers.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/vi-cell-metaflex-bioanalyte-analyzers.html',
    UniqueId: '42.58494$family://vi-cell-metaflex-bioanalyte-analyzers/',
    Excerpt: 'Quality Management ... Customizable QC schedule Applications R&D QC Manufacturing Ideal for micro to large scale cell culture applications, the Vi-CELL MetaFLEX is designed for ...',
    FirstSentences: null,
  }, {
    title: '3D Ready™ Organoids',
    uri: 'family://3d-ready-organoids/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/3d-ready-organoids.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/3d-ready-organoids.html',
    uniqueId: '42.58494$family://3d-ready-organoids/',
    excerpt: 'Our 3D Ready™ Organoids are a convenient, easy-to-use solution for researchers who want to use organoid ... With no need for complex culturing protocols, these well-characterized, highly ...',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1060337,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: '1AhebðEra1arVOqf',
      urihash: '1AhebðEra1arVOqf',
      categoriesname: ['2D and 3D Cell Culture Systems'],
      description: 'Our 3D Ready™ Organoids are a convenient, easy-to-use solution for researchers who want to use organoid models for their own research but are held back by the high barriers to entry. With no need for complex culturing protocols, these well-characterized, highly reproducible, and physiologically relevant cell models offer a quick, simple way to get started.',
      permanentid: '3d-ready-organoids',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://danaherls.scene7.com/is/image/danaher/moleculardevices-3d-ready-organoids-hero'],
    },
    Title: '3D Ready™ Organoids',
    Uri: 'family://3d-ready-organoids/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/3d-ready-organoids.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/3d-ready-organoids.html',
    UniqueId: '42.58494$family://3d-ready-organoids/',
    Excerpt: 'Our 3D Ready™ Organoids are a convenient, easy-to-use solution for researchers who want to use organoid ... With no need for complex culturing protocols, these well-characterized, highly ...',
    FirstSentences: null,
  }, {
    title: 'MetaXpress® Acquire High-Content Image Acquisition Software',
    uri: 'family://metaxpress-acquire-high-content-image-acquisition-software/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/metaxpress-acquire-high-content-image-acquisition-software.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/metaxpress-acquire-high-content-image-acquisition-software.html',
    uniqueId: '42.58494$family://metaxpress-acquire-high-content-image-acquisition-software/',
    excerpt: 'MetaXpress® Acquire High-Content Image Acquisition Software is a comprehensive solution for high- ... An intuitive interface and guided workflows streamline even complex imaging assays, ...',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1050337,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: 'yWGHlKN1BxyGwxvv',
      urihash: 'yWGHlKN1BxyGwxvv',
      categoriesname: ['Cellular Imaging Systems', 'Cellular Imaging Systems|Cellular Image Acquisition and Analysis Software'],
      description: 'MetaXpress® Acquire High-Content Image Acquisition Software is a comprehensive solution for high-content imaging, designed for use with our ImageXpress HCS.ai High-Content Screening System. An intuitive interface and guided workflows streamline even complex imaging assays, enabling you to start generating data in minutes.',
      permanentid: 'metaxpress-acquire-high-content-image-acquisition-software',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://danaherls.scene7.com/is/image/danaher/moleculardevices-metaxpress-acquire-software-hero'],
    },
    Title: 'MetaXpress® Acquire High-Content Image Acquisition Software',
    Uri: 'family://metaxpress-acquire-high-content-image-acquisition-software/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/metaxpress-acquire-high-content-image-acquisition-software.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/metaxpress-acquire-high-content-image-acquisition-software.html',
    UniqueId: '42.58494$family://metaxpress-acquire-high-content-image-acquisition-software/',
    Excerpt: 'MetaXpress® Acquire High-Content Image Acquisition Software is a comprehensive solution for high- ... An intuitive interface and guided workflows streamline even complex imaging assays, ...',
    FirstSentences: null,
  }, {
    title: 'CloneSelect® Imager (CSI and CSI FL)',
    uri: 'family://cloneselect-imagers/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/cloneselect-imagers.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/cloneselect-imagers.html',
    uniqueId: '42.58494$family://cloneselect-imagers/',
    excerpt: '(21 CFR Part 312) ... Multichannel fluorescence imaging provides additional confidence of monoclonality and ... The software automatically calculates confluence for each imaging time point.',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1040547,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: 'pYoOM3KAZXc0mWmz',
      urihash: 'pYoOM3KAZXc0mWmz',
      categoriesname: ['Clone Screening Systems', 'Clone Screening Systems|Single-Cell Imaging Systems'],
      description: 'High-speed fluorescence and white light imaging, intelligent data analysis, and monoclonality report generation',
      permanentid: 'cloneselect-imagers',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-image1', 'https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-fl-image1', 'https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-fl-image2', 'https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-image2', 'https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-image3', 'https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-fl-image3', 'https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-fl-image4', 'https://danaherls.scene7.com/is/image/danaher/molecular-devices-clone-select-imager-fl-optimize-clonal-outgrowth-workflow', 'https://lifesciences.danaher.com/content/dam/danaher/products/molecular-devices/cloneselect-imager/molecular-devices-cloneselect-imager-monoclonality-report-feature-brochure-en.pdf', 'https://lifesciences.danaher.com/content/dam/danaher/products/molecular-devices/cloneselect-imager/molecular-devices-cloneselect-imager-system-brochure-en.pdf'],
    },
    Title: 'CloneSelect® Imager (CSI and CSI FL)',
    Uri: 'family://cloneselect-imagers/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/cloneselect-imagers.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/cloneselect-imagers.html',
    UniqueId: '42.58494$family://cloneselect-imagers/',
    Excerpt: '(21 CFR Part 312) ... Multichannel fluorescence imaging provides additional confidence of monoclonality and ... The software automatically calculates confluence for each imaging time point.',
    FirstSentences: null,
  }, {
    title: 'Human M-CSF ELISA Kit(AB100590)',
    uri: 'family://ab100590-abcam/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100590-abcam.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100590-abcam.html',
    uniqueId: '42.58494$family://ab100590-abcam/',
    excerpt: '"family://ab100590-abcam"',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1030337,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: 'xqDñNMG3oKrB7nCk',
      urihash: 'xqDñNMG3oKrB7nCk',
      categoriesname: ['Assay Kits', 'Assay Kits|Elisa Kits', 'Assay Kits|Elisa Kits|Sandwich Elisa'],
      description: 'Human M-CSF ELISA Kit is a Sandwich (quantitative) ELISA kit for the measurement of Human M-CSF in Human in Plasma, Cell culture supernatant, Serum samples.',
      permanentid: 'ab100590-abcam',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://www.abcam.com/ps/products/100/ab100590/Images/ab100590-195686-human-m-csf-elisa-kit-sample.jpg'],
    },
    Title: 'Human M-CSF ELISA Kit(AB100590)',
    Uri: 'family://ab100590-abcam/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100590-abcam.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100590-abcam.html',
    UniqueId: '42.58494$family://ab100590-abcam/',
    Excerpt: '"family://ab100590-abcam"',
    FirstSentences: null,
  }, {
    title: 'Human MMP13 ELISA Kit(AB100605)',
    uri: 'family://ab100605-abcam/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100605-abcam.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100605-abcam.html',
    uniqueId: '42.58494$family://ab100605-abcam/',
    excerpt: '"family://ab100605-abcam"',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1020337,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: '9V35ñvMPGsEfJVEu',
      urihash: '9V35ñvMPGsEfJVEu',
      categoriesname: ['Assay Kits', 'Assay Kits|Elisa Kits', 'Assay Kits|Elisa Kits|Sandwich Elisa'],
      description: 'Human MMP13 ELISA Kit is a Sandwich (quantitative) ELISA kit for the measurement of Human MMP13 in Human in Plasma, Cell culture supernatant samples.',
      permanentid: 'ab100605-abcam',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://www.abcam.com/ps/products/100/ab100605/Images/ab100605-197372-human-mmp13-elisa-kit-standard-curve.jpg'],
    },
    Title: 'Human MMP13 ELISA Kit(AB100605)',
    Uri: 'family://ab100605-abcam/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100605-abcam.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100605-abcam.html',
    UniqueId: '42.58494$family://ab100605-abcam/',
    Excerpt: '"family://ab100605-abcam"',
    FirstSentences: null,
  }, {
    title: 'Human GDNF ELISA Kit (Glial Derived Neurotrophic Factor)(AB100525)',
    uri: 'family://ab100525-abcam/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100525-abcam.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100525-abcam.html',
    uniqueId: '42.58494$family://ab100525-abcam/',
    excerpt: '"family://ab100525-abcam"',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1010337,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: '1Go7vgS9Syfr0pB0',
      urihash: '1Go7vgS9Syfr0pB0',
      categoriesname: ['Assay Kits', 'Assay Kits|Elisa Kits', 'Assay Kits|Elisa Kits|Sandwich Elisa'],
      description: 'Human GDNF ELISA Kit (Glial Derived Neurotrophic Factor) is a Sandwich (quantitative) ELISA kit for the measurement of Human GDNF (Glial Derived Neurotrophic Factor) in Human in Plasma, Cell culture supernatant samples.',
      permanentid: 'ab100525-abcam',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://www.abcam.com/ps/products/100/ab100525/Images/ab100525-194896-human-gdnf-elisa-kit-glial-derived-neurotrophic-factor-specificity.jpg'],
    },
    Title: 'Human GDNF ELISA Kit (Glial Derived Neurotrophic Factor)(AB100525)',
    Uri: 'family://ab100525-abcam/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100525-abcam.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab100525-abcam.html',
    UniqueId: '42.58494$family://ab100525-abcam/',
    Excerpt: '"family://ab100525-abcam"',
    FirstSentences: null,
  }, {
    title: 'Recombinant human AMPK alpha 2 + AMPK beta 1 +AMPK gamma 3 protein(AB184881)',
    uri: 'family://ab184881-abcam/',
    printableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab184881-abcam.html',
    clickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab184881-abcam.html',
    uniqueId: '42.58494$family://ab184881-abcam/',
    excerpt: '"family://ab184881-abcam"',
    firstSentences: null,
    summary: null,
    flags: 'HasHtmlVersion;SkipSentencesScoring;HasAllMetaDataStream',
    hasHtmlVersion: true,
    hasMobileHtmlVersion: false,
    score: 1000337,
    percentScore: 100.0,
    rankingInfo: null,
    rating: 0.0,
    isTopResult: false,
    isRecommendation: true,
    recommendation: {
      explanation: { filters: [], items: [{ skuKey: 'permanentid', sku: '3d-ready-organoid-expansion-service', action: '' }], strategy: 'frequentViewed' },
    },
    isUserActionView: false,
    rankingModifier: 'Coveo ML Product Recommendation',
    titleHighlights: [],
    firstSentencesHighlights: [],
    excerptHighlights: [],
    printableUriHighlights: [],
    summaryHighlights: [],
    parentResult: null,
    childResults: [],
    totalNumberOfChildResults: 0,
    absentTerms: [],
    raw: {
      sysurihash: 'GzpszJ7PCvmAsqIC',
      urihash: 'GzpszJ7PCvmAsqIC',
      description: 'Recombinant human AMPK alpha 2 + AMPK beta 1 +AMPK gamma 3 protein is a Human Full Length protein, expressed in Baculovirus infected Sf9, with >90% purity and suitable for SDS-PAGE, FuncS.',
      permanentid: 'ab184881-abcam',
      syssource: 'PIM Catalog Source',
      source: 'PIM Catalog Source',
      images: ['https://content.abcam.com/products/images/ab184881--sds-page-img16252.jpg'],
    },
    Title: 'Recombinant human AMPK alpha 2 + AMPK beta 1 +AMPK gamma 3 protein(AB184881)',
    Uri: 'family://ab184881-abcam/',
    PrintableUri: 'https://lifesciences.danaher.com/us/en/products/family/ab184881-abcam.html',
    ClickUri: 'https://lifesciences.danaher.com/us/en/products/family/ab184881-abcam.html',
    UniqueId: '42.58494$family://ab184881-abcam/',
    Excerpt: '"family://ab184881-abcam"',
    FirstSentences: null,
  }],
  extendedResults: { },
};
export default async function decorate(block) {
  block.parentElement.parentElement.style.padding = '0';
  block.parentElement.parentElement.style.margin = '0';
  block.style.display = 'none';

  const wrapper = block.closest('.pdp-carousel-wrapper');
  if (wrapper) wrapper.classList.add('w-full', 'md:px-10');

  const [heading] = block.children;
  const headingText = heading?.textContent.trim().replace(/<[^>]*>/g, '');

  let cardsPerPageGrid = getCardsPerPageGrid();
  let scrollIndex = 0;

  const blockWrapper = div({ class: 'pdp-rendered w-full dhls-container px-5 lg:px-10 dhlsBp:p-0 flex flex-col gap-4' });
  const carouselContainer = div({ class: 'carousel-container flex flex-col w-full py-6 pt-0 pb-0 justify-center' });
  const carouselHead = div({ class: 'w-full flex flex-col sm:flex-row justify-between items-center gap-3 pb-6' });

  const leftGroup = div({ class: 'flex flex-wrap sm:flex-nowrap items-center gap-4' });
  leftGroup.append(div({ class: 'text-black text-2xl font-medium leading-[2.5rem]' }, headingText ?? ''));

  const arrows = div({ class: 'w-full md:w-72 inline-flex justify-end items-center gap-6' });
  const arrowGroup = div({ class: 'flex justify-start items-center' });

  const prevDiv = div(
    { class: 'carousel-prev-div w-8 h-8 relative overflow-hidden cursor-pointer' },
    span({ class: 'icon icon-Arrow-circle-left cursor-pointer pointer-events-none w-8 h-8 fill-current [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-danaherpurple-800' }),
  );
  const nextDiv = div(
    { class: 'carousel-next-div w-8 h-8 relative overflow-hidden cursor-pointer' },
    span({ class: 'icon icon-Arrow-circle-right cursor-pointer w-8 h-8 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800' }),
  );

  arrowGroup.append(prevDiv, nextDiv);
  decorateIcons(arrowGroup);

  arrows.append(arrowGroup);
  carouselHead.append(leftGroup, arrows);

  const track = div({
    id: 'carouselTrack',
    class: 'flex gap-5 overflow-hidden py-2',
  });

  const carouselCards = div({ class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full duration-1000 ease-in-out transition-transform transform ' }, track);

  const paginationContainer = div({ class: 'pagination-container flex justify-center items-center gap-2 mt-8 w-full', style: 'display: none;' });

  // Coveo call to get the response
  // const response = await getProductsOnSolutionsResponse();
  // Store up to 12 products in localStorage
  const productsList = (apiCall?.results || []).slice(0, 12);
  const recommendationsResponse = await getProductRecommendationsResponse();
  console.log('Product Recommendations Response:', recommendationsResponse);
  localStorage.setItem('pdp-carousel-products', JSON.stringify(productsList));

  // Retrieve products from localStorage
  const products = JSON.parse(localStorage.getItem('pdp-carousel-products')) || [];

  products.forEach((product) => {
    const mappedProduct = {
      title: product.title,
      url: product.clickUri,
      image: product.raw?.images?.[0] || 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble',
      description: product.raw?.description || '',
    };

    track.append(renderGridCard(mappedProduct));
  });

  function updateArrows() {
    const maxIndex = Math.ceil(products.length / cardsPerPageGrid) - 1;
    const prevEnabled = scrollIndex > 0;
    const nextEnabled = scrollIndex < maxIndex;

    if (prevEnabled) {
      prevDiv.querySelector('span')?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
      prevDiv.querySelector('span')?.classList.remove('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
    } else {
      prevDiv.querySelector('span')?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
      prevDiv.querySelector('span')?.classList.add('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
    }

    if (nextEnabled) {
      nextDiv.querySelector('span')?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
      nextDiv.querySelector('span')?.classList.remove('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
    } else {
      nextDiv.querySelector('span')?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
      nextDiv.querySelector('span')?.classList.add('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
    }
  }

  function scrollCarousel(direction) {
    const card = track?.firstElementChild;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 20;
    const scrollAmount = (cardWidth + gap) * cardsPerPageGrid;

    scrollIndex += direction;
    const maxIndex = Math.ceil(products.length / cardsPerPageGrid) - 1;
    scrollIndex = Math.max(0, Math.min(scrollIndex, maxIndex));

    track.scrollTo({
      left: scrollIndex * scrollAmount,
      behavior: 'smooth',
    });

    updateArrows();
  }

  // Event listeners
  prevDiv.addEventListener('click', () => scrollCarousel(-1));
  nextDiv.addEventListener('click', () => scrollCarousel(1));

  window.addEventListener('resize', () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      scrollIndex = 0;
      scrollCarousel(0);
    }
  });

  if (products?.length > 0) {
    carouselContainer.append(carouselHead, carouselCards, paginationContainer);
  }

  blockWrapper.append(carouselContainer);

  block.textContent = '';
  block.style = '';
  block.append(blockWrapper);

  scrollCarousel(0);
}
