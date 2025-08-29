/*
  *
  :::::::::::
     include / exclude eds page for Prod and Stage
  ::::::::::::::
  *
*/
// production paths to go through converter
export const excludeProdPaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo'];

// exclude stage paths
export const excludeStagePaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo'];

// include stage paths
export const includeStagePaths = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'we-see-a-way'];
