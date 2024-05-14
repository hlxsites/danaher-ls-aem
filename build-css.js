const { exec } = require('child_process');

// Define input and output file mappings
const fileMappings = [
  {
    input: './styles/tailwind.css',
    output: './styles/styles.css',
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
    content: './blocks/product-recommendations/product-recommendations.js',
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
  const command = `npx tailwindcss ${input ? `-i ${input}` : ''} ${content ? `--content ${content}` : ''} -o ${output} ${watch ? '--watch' : ''}`;
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
