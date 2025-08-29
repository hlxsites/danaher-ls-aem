/*
  *
  :::::::::::
     include / exclude eds page for Prod and Stage
  ::::::::::::::
  *
*/
// production paths to go through converter
export const excludeProdPaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo'];

// include pro paths
export const includeProdPaths = ['e-buy', 'products/', 'brands', 'products.html', 'blog-eds', 'news-eds'];

// exclude stage paths
export const excludeStagePaths = ['products/family', 'products/sku', 'products/bundle', 'products/product-coveo', 'topics-jck1'];

// include stage paths
export const includeStagePaths = ['e-buy', 'products/', 'brands', 'products.html', 'blog', 'news', 'we-see-a-way'];
