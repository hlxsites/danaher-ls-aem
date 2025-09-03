const { exec } = require('child_process');

// Define input and output file mappings
const fileMappings = [
  {
    input: './styles/tailwind.css',
    output: './styles/styles.css',
  },
  {
    content: './blocks/accordion/accordion.js',
    output: './blocks/accordion/accordion.css',
    wrapper: 'accordion-wrapper',
  },
  {
    content: './blocks/article-info/article-info.js',
    output: './blocks/article-info/article-info.css',
    wrapper: 'article-info-wrapper',
  },
  {
    content: [
      './blocks/articles-list/articles-list.js',
      './blocks/card-list/articleCard.js',
    ],
    output: './blocks/articles-list/articles-list.css',
    wrapper: 'articles-list-wrapper',
  },
  {
    content: './blocks/banner/banner.js',
    output: './blocks/banner/banner.css',
    wrapper: 'banner',
  },
  {
    content: './blocks/blog-hero/blog-hero.js',
    output: './blocks/blog-hero/blog-hero.css',
    wrapper: 'blog-hero-wrapper',
  },
  {
    content: './blocks/breadcrumb/breadcrumb.js',
    output: './blocks/breadcrumb/breadcrumb.css',
    wrapper: 'breadcrumb-wrapper',
  },
  {
    content: './blocks/call-to-action/call-to-action.js',
    output: './blocks/call-to-action/call-to-action.css',
    wrapper: 'call-to-action-wrapper',
  },
  {
    content: [
      './blocks/card-list/card-list.js',
      './blocks/card-list/applicationCard.js',
      './blocks/card-list/articleCard.js',
      './blocks/card-list/libraryCard.js',
    ],
    output: './blocks/card-list/card-list.css',
    wrapper: 'card-list-wrapper',
  },
  {
    content: './blocks/cards/cards.js',
    output: './blocks/cards/cards.css',
    wrapper: 'cards-wrapper',
  },
  {
    content: './blocks/carousel/carousel.js',
    output: './blocks/carousel/carousel.css',
    wrapper: 'carousel-wrapper',
  },
  {
    content: './blocks/columns/columns.js',
    output: './blocks/columns/columns.css',
    wrapper: 'columns-wrapper',
  },
  {
    content: './blocks/download/download.js',
    output: './blocks/download/download.css',
    wrapper: 'download-wrapper',
  },
  {
    content: './blocks/embed/embed.js',
    output: './blocks/embed/embed.css',
    wrapper: 'embed-wrapper',
  },
  {
    content: ['./blocks/footer/footer.js', './fragments/footer.html'],
    output: './blocks/footer/footer.css',
    wrapper: 'footer-wrapper',
  },
  {
    content: './blocks/header/header.js',
    output: './blocks/header/header.css',
    wrapper: 'header-wrapper',
  },
  {
    content: './blocks/hero/hero.js',
    output: './blocks/hero/hero.css',
    wrapper: 'hero-wrapper',
  },
  {
    content: './blocks/logo-clouds/logo-clouds.js',
    output: './blocks/logo-clouds/logo-clouds.css',
    wrapper: 'logo-clouds-wrapper',
  },
  {
    content: './blocks/marketo-form/marketo-form.js',
    output: './blocks/marketo-form/marketo-form.css',
    wrapper: 'marketo-form-wrapper',
  },
  {
    content: './blocks/mini-teasers/mini-teasers.js',
    output: './blocks/mini-teasers/mini-teasers.css',
    wrapper: 'mini-teasers-wrapper',
  },
  {
    content: './blocks/spline-viewer/spline-viewer.js',
    output: './blocks/spline-viewer/spline-viewer.css',
    wrapper: 'spline-viewer-wrapper',
  },
  {
    content: [
      './blocks/page-jump-menu/page-jump-menu.js',
      './blocks/page-tabs/page-tabs.js',
    ],
    output: './blocks/page-jump-menu/page-jump-menu.css',
    wrapper: 'page-jump-menu-wrapper',
  },
  {
    content: './blocks/page-tabs/page-tabs.js',
    output: './blocks/page-tabs/page-tabs.css',
    wrapper: 'page-tabs-wrapper',
  },
  {
    content: './blocks/workflow-tabs/workflow-tabs.js',
    output: './blocks/workflow-tabs/workflow-tabs.css',
    wrapper: 'workflow-tabs-wrapper',
  },
  {
    content: './blocks/popular-articles/popular-articles.js',
    output: './blocks/popular-articles/popular-articles.css',
    wrapper: 'popular-articles-wrapper',
  },
  {
    content: './blocks/product-card/product-card.js',
    output: './blocks/product-card/product-card.css',
    wrapper: 'product-card-wrapper',
  },
  {
    content: './blocks/product-category/product-category.js',
    output: './blocks/product-category/product-category.css',
    wrapper: 'product-category-wrapper',
  },
  {
    content: [
      './blocks/product-category-list/product-category-list.js',
      './blocks/product-category-list/filter.js',
    ],
    output: './blocks/product-category-list/product-category-list.css',
    wrapper: 'product-category-list-wrapper',
  },
  {
    content: './blocks/product-citations/product-citations.js',
    output: './blocks/product-citations/product-citations.css',
    wrapper: 'product-citations-wrapper',
  },
  {
    content: './blocks/product-hero/product-hero.js',
    output: './blocks/product-hero/product-hero.css',
    wrapper: 'product-hero-wrapper',
  },
  {
    content: './blocks/product-menu/product-menu.js',
    output: './blocks/product-menu/product-menu.css',
    wrapper: 'product-menu-wrapper',
  },
  {
    content: './blocks/product-overview/product-overview.js',
    output: './blocks/product-overview/product-overview.css',
    wrapper: 'product-overview-wrapper',
  },
  {
    content: './blocks/product-parts/product-parts.js',
    output: './blocks/product-parts/product-parts.css',
    wrapper: 'product-parts-wrapper',
  },
  {
    content: [
      './blocks/product-recommendations/product-recommendations.js',
      './blocks/product-card/product-card.js',
    ],
    output: './blocks/product-recommendations/product-recommendations.css',
    wrapper: 'product-recommendations-wrapper',
  },
  {
    content: './blocks/product-specifications/product-specifications.js',
    output: './blocks/product-specifications/product-specifications.css',
    wrapper: 'product-specifications-wrapper',
  },
  {
    content: './blocks/recent-articles/recent-articles.js',
    output: './blocks/recent-articles/recent-articles.css',
    wrapper: 'recent-articles-wrapper',
  },
  {
    content: [
      './blocks/related-articles/related-articles.js',
      './blocks/card-list/articleCard.js',
    ],
    output: './blocks/related-articles/related-articles.css',
    wrapper: 'related-articles-wrapper',
  },
  {
    content: './blocks/side-nav/side-nav.js',
    output: './blocks/side-nav/side-nav.css',
    wrapper: 'side-nav-wrapper',
  },
  {
    content: './blocks/social-feeds/social-feeds.js',
    output: './blocks/social-feeds/social-feeds.css',
    wrapper: 'social-feeds-wrapper',
  },
  {
    content: './blocks/social-media/social-media.js',
    output: './blocks/social-media/social-media.css',
    wrapper: 'social-media-wrapper',
  },
  {
    content: './blocks/stats/stats.js',
    output: './blocks/stats/stats.css',
    wrapper: 'stats-wrapper',
  },
  {
    content: './blocks/timeline/timeline.js',
    output: './blocks/timeline/timeline.css',
    wrapper: 'timeline-wrapper',
  },
  {
    content: ['./blocks/talk-to-an-expert-form/talk-to-an-expert-form.js'],
    output: './blocks/talk-to-an-expert-form/talk-to-an-expert-form.css',
    wrapper: 'talk-to-an-expert-form-wrapper',
  },
  {
    input: './templates/application/application-dev.css',
    output: './templates/application/application.css',
  },
  {
    input: './templates/brandHome/brandHome-dev.css',
    output: './templates/brandHome/brandHome.css',
  },
  {
    content: ['./blocks/join-today-form/join-today-form.js'],
    output: './blocks/join-today-form/join-today-form.css',
    wrapper: 'join-today-form-wrapper',
  },
  {
    content: './blocks/tiled-viewer/tiled-viewer.js',
    output: './blocks/tiled-viewer/tiled-viewer.css',
    wrapper: 'tiled-viewer-wrapper',
  },
  {
    content: './blocks/separator-line/separator-line.js',
    output: './blocks/separator-line/separator-line.css',
    wrapper: 'separator-line-wrapper',
  },
  {
    content: './blocks/accordion-container/accordion-container.js',
    output: './blocks/accordion-container/accordion-container.css',
    wrapper: 'accordion-container-wrapper',
  },
  {
    content: './blocks/learn-more/learn-more.js',
    output: './blocks/learn-more/learn-more.css',
    wrapper: 'learn-more-wrapper',
  },
  {
    content: './blocks/opco-grid/opco-grid.js',
    output: './blocks/opco-grid/opco-grid.css',
    wrapper: 'opco-grid-wrapper',
  },
  {
    content: './blocks/dual-carousel/dual-carousel.js',
    output: './blocks/dual-carousel/dual-carousel.css',
    wrapper: 'dual-carousel-wrapper',
  },
  {
    content: [
      './blocks/product-family/product-family.js',
      './blocks/product-family/gridData.js',
      './blocks/product-family/listData.js',
    ],
    output: './blocks/product-family/product-family.css',
    wrapper: 'product-family-wrapper',
  },
  {
    content: './blocks/product-category/product-category.js',
    output: './blocks/product-category/product-category.css',
    wrapper: 'product-category-wrapper',
  },
  {
    content: './blocks/product-categories/product-categories.js',
    output: './blocks/product-categories/product-categories.css',
    wrapper: 'product-categories-wrapper',
  },
  {
    content: './blocks/shop-featured-products/shop-featured-products.js',
    output: './blocks/shop-featured-products/shop-featured-products.css',
    wrapper: 'shop-featured-products-wrapper',
  },
  {
    content: './blocks/product-banner/product-banner.js',
    output: './blocks/product-banner/product-banner.css',
    wrapper: 'product-banner-wrapper',
  },
  {
    content: './blocks/product-hero-content/product-hero-content.js',
    output: './blocks/product-hero-content/product-hero-content.css',
    wrapper: 'product-hero-content-wrapper',
  },
  {
    content: './blocks/product-info-list/product-info-list.js',
    output: './blocks/product-info-list/product-info-list.css',
    wrapper: 'product-info-list-wrapper',
  },
  {
    content: [
      './blocks/top-selling/top-selling.js',
      './blocks/top-selling/listData.js',
      './blocks/top-selling/gridData.js',
    ],
    output: './blocks/top-selling/top-selling.css',
    wrapper: 'top-selling-wrapper',
  },
  {
    content: [
      './blocks/top-purchased-products/top-purchased-products.js',
      './blocks/top-purchased-products/gridData.js',
    ],
    output: './blocks/top-purchased-products/top-purchased-products.css',
    wrapper: 'top-purchased-products-wrapper',
  },
  {
    content: [
      './blocks/top-selling-products/top-selling-products.js',
      './blocks/top-selling-products/gridData.js',
    ],
    output: './blocks/top-selling-products/top-selling-products.css',
    wrapper: 'top-selling-products-wrapper',
  },
  {
    content: './blocks/offer-banner/offer-banner.js',
    output: './blocks/offer-banner/offer-banner.css',
    wrapper: 'offer-banner-wrapper',
  },
  {
    content: './blocks/offer-advertisement/offer-advertisement.js',
    output: './blocks/offer-advertisement/offer-advertisement.css',
    wrapper: 'offer-advertisement-wrapper',
  },
  {
    content: './blocks/simple-text/simple-text.js',
    output: './blocks/simple-text/simple-text.css',
    wrapper: 'simple-text-wrapper',
  },
  {
    content: './blocks/opco-banner/opco-banner.js',
    output: './blocks/opco-banner/opco-banner.css',
    wrapper: 'opco-banner-wrapper',
  },
  {
    content: './blocks/insight/insight.js',
    output: './blocks/insight/insight.css',
    wrapper: 'insight-wrapper',
  },
  {
    content: './blocks/separator-line/separator-line.js',
    output: './blocks/separator-line/separator-line.css',
    wrapper: 'separator-line-wrapper',
  },
  {
    content: './blocks/body-banner/body-banner.js',
    output: './blocks/body-banner/body-banner.css',
    wrapper: 'body-banner-wrapper',
  },
  {
    content: './blocks/register/register.js',
    output: './blocks/register/register.css',
    wrapper: 'register-wrapper',
  },
  {
    content: './blocks/login/login.js',
    output: './blocks/login/login.css',
    wrapper: 'login-wrapper',
  },
  {
    content: ['./blocks/dashboard/dashboard.js',
      './blocks/dashboard/orderStatus.js',
      './blocks/dashboard/dashboardutils.js',
      './scripts/common-utils.js',
      './blocks/dashboard/recentOrder.js',
      './blocks/dashboardSideBar/dashboardSideBar.js',
    ],
    output: './blocks/dashboard/dashboard.css',
    wrapper: 'dashboard-wrapper',
  },
  {
    content: ['./blocks/dashboardSideBar/dashboardSideBar.js',
    ],
    output: './blocks/dashboardSideBar/dashboardSideBar.css',
    wrapper: 'dashboardSideBar-wrapper',
  },
  {
    content: ['./blocks/order-status/order-status.js', './blocks/dashboardSideBar/dashboardSideBar.js'],
    output: './blocks/order-status/order-status.css',
    wrapper: 'order-status-wrapper',
  },
  {
    content: ['./blocks/requested-quote/requested-quote.js', './blocks/dashboardSideBar/dashboardSideBar.js'],
    output: './blocks/requested-quote/requested-quote.css',
    wrapper: 'requested-quote-wrapper',
  },
    {
    content: ['./blocks/approved-quote/approved-quote.js', 
              './blocks/dashboardSideBar/dashboardSideBar.js',
            ],
    output: './blocks/approved-quote/approved-quote.css',
    wrapper: 'approved-quote-wrapper',
  },
  {
    content: ['./blocks/order-details/order-details.js', 
              './blocks/dashboardSideBar/dashboardSideBar.js',
              './blocks/order-details/customerInformation.js',
              './blocks/order-details/orderItems.js',
              './blocks/order-details/orderSummary.js'
            ],
    output: './blocks/order-details/order-details.css',
    wrapper: 'order-details-wrapper',
  },

  {
    content: ['./blocks/quote-details/quote-details.js', 
              './blocks/quote-details/quotesummary.js',
              './blocks/quote-details/quoteItems.js',
              './blocks/quote-details/requesterInformation.js',
              './blocks/dashboardSideBar/dashboardSideBar.js',
            ],
    output: './blocks/quote-details/quote-details.css',
    wrapper: 'quote-details-wrapper',
  },
  {
    content: [
      './blocks/cartlanding/cartlanding.js',
      './blocks/cartlanding/cartItem.js',
      './blocks/cartlanding/addproducts.js',
      './blocks/cartlanding/addproducts.js',
      './blocks/cartlanding/mycart.js',
      './blocks/cartlanding/price.js',
      './blocks/cartlanding/recommendedproducts.js',
      './blocks/cartlanding/emptyCart.js',
      './blocks/cartlanding/cartDetails.js',
      './blocks/cartlanding/grid-data.js',
      './blocks/cartlanding/listData.js',
      './blocks/cartlanding/noProduct.js',
      './blocks/cartlanding/related-products.js',
      './scripts/cart-checkout-utils.js',
      './scripts/common-utils.js',
    ],
    output: './blocks/cartlanding/cartlanding.css',
    wrapper: 'cartlanding-wrapper',
  },
  {
    content: [
      './blocks/checkout/checkout.js',
      './blocks/checkout/checkoutUtilities.js',
      './blocks/checkout/paymentModule.js',
      './blocks/checkout/shippingAddress.js',
      './blocks/checkout/shippingMethods.js',
      './scripts/cart-checkout-utils.js',
      './scripts/common-utils.js',
      './blocks/cartlanding/cartlanding.js',
      './blocks/cartlanding/cartItem.js',
    ],
    output: './blocks/checkout/checkout.css',
    wrapper: 'checkout',
  },
  {
    content: './blocks/order-submit/order-submit.js',
    output: './blocks/order-submit/order-submit.css',
    wrapper: 'order-submit-wrapper',
  },
];

const watch = process.argv[2];

// Loop through each file mapping and run Tailwind CSS CLI
fileMappings.forEach(({
  content, input, output, wrapper,
}) => {
  process.env.IMPORTANT_WRAPPER = `.${wrapper}`;
  const command = `npx tailwindcss ${
    input ? `-i ${input}` : './styles/proxy-tailwind.css'
  } ${content ? `--content ${content}` : ''} -o ${output} ${
    watch ? '--watch' : ''
  }`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(`Error compiling ${input}:`, error);
      return;
    }
    // eslint-disable-next-line no-console
    console.log(stdout);
    // eslint-disable-next-line no-console
    console.error(stderr);
  });
});
