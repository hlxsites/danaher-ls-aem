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
    content: ['./blocks/articles-list/articles-list.js', './blocks/card-list/articleCard.js'],
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
    content: ['./blocks/card-list/card-list.js', './blocks/card-list/applicationCard.js', './blocks/card-list/articleCard.js', './blocks/card-list/libraryCard.js'],
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
    content: './blocks/category-family/category-family.js',
    output: './blocks/category-family/category-family.css',
    wrapper: 'category-family-wrapper',
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
    content: ['./blocks/page-jump-menu/page-jump-menu.js', './blocks/page-tabs/page-tabs.js'],
    output: './blocks/page-jump-menu/page-jump-menu.css',
    wrapper: 'page-jump-menu-wrapper',
  },
  {
    content: './blocks/page-tabs/page-tabs.js',
    output: './blocks/page-tabs/page-tabs.css',
    wrapper: 'page-tabs-wrapper',
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
    content: ['./blocks/product-category-list/product-category-list.js', './blocks/product-category-list/filter.js'],
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
    content: ['./blocks/product-recommendations/product-recommendations.js', './blocks/product-card/product-card.js'],
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
    content: './blocks/related-articles/related-articles.js',
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
    input: './templates/application/application-dev.css',
    output: './templates/application/application.css',
  },
  {
    input: './templates/brandHome/brandHome-dev.css',
    output: './templates/brandHome/brandHome.css',
  },
];

const watch = process.argv[2];

// Loop through each file mapping and run Tailwind CSS CLI
fileMappings.forEach(({
  content, input, output, wrapper,
}) => {
  process.env.IMPORTANT_WRAPPER = `.${wrapper}`;
  const command = `npx tailwindcss ${input ? `-i ${input}` : './styles/proxy-tailwind.css'} ${content ? `--content ${content}` : ''} -o ${output} ${watch ? '--watch' : ''}`;
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
