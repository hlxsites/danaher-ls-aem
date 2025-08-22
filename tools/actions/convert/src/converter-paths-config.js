/*
  *
  :::::::::::
     include / exclude eds page for Prod and Stage
  ::::::::::::::
  *
*/

// production paths to skip converter
/*
export const includeProdEdsPaths = ['news-eds', 'blog-eds', 'videos-eds', 'products/brands', 'products/2d-3d-cell-culture-systems', 'products/antibodies', 'products/capillary-electrophoresis-systems', 'products/cell-lines-lysates', 'products/extraction-kits', 'products/proteins-peptides', 'products/centrifuges', 'products/clone-screening-systems', 'products/sample-preparation-detection', 'products/flow-cytometers', 'products/chromatography-columns']; 
*/

// stage paths
/*
export const includeStageEdsPaths = ['news', 'blog', 'videos-eds', 'we-see-a-way', 'products/brands', 'products-eds', 'e-buy', 'products.html', 'products/antibodies', 'products/assay-kits', 'products-eds.html', 'e-buy', 'products-eds/brands', 'products/extraction-kits', 'products/dna-extraction', 'products/rna-extraction', 'products/liquid-handlers', 'products/capillary-electrophoresis-systems', 'products/2d-3d-cell-culture-systems', 'products/cell-lines-lysates', 'products/biochemicals', 'products/cell-counters-analyzers', 'products/cellular-imaging-systems', 'products/proteins-peptides', 'products/centrifuges', 'products/clone-screening-systems', 'products/sample-preparation-detection', 'products/flow-cytometers', 'products/chromatography-columns']; 
*/

// production paths to go through converter
export const excludeProdPaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo'];

// exclude stage paths
export const excludeStagePaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo'];
