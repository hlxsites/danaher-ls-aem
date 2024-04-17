const { exec } = require('child_process');

// Define input and output file mappings
const fileMappings = [
  {
    input: './styles/tailwind.css',
    output: './styles/styles.css',
  },
  {
    input: './blocks/page-jump-menu/page-jump-menu-dev.css',
    output: './blocks/page-jump-menu/page-jump-menu.css',
  },
  {
    input: './blocks/cards/cards-dev.css',
    output: './blocks/cards/cards.css',
  },
  {
    input: './blocks/header/header-dev.css',
    output: './blocks/header/header.css',
  },
  {
    input: './blocks/columns/columns-dev.css',
    output: './blocks/columns/columns.css',
  },
  {
    input: './blocks/product-hero/product-hero-dev.css',
    output: './blocks/product-hero/product-hero.css',
  },
  {
    input: './blocks/page-tabs/page-tabs-dev.css',
    output: './blocks/page-tabs/page-tabs.css',
  },
  {
    input: './blocks/timeline/timeline-dev.css',
    output: './blocks/timeline/timeline.css',
  },
  {
    input: './blocks/carousel/carousel-dev.css',
    output: './blocks/carousel/carousel.css',
  },
  {
    input: './blocks/footer/footer-dev.css',
    output: './blocks/footer/footer.css',
  },
  {
    input: './blocks/side-nav/side-nav-dev.css',
    output: './blocks/side-nav/side-nav.css',
  },
  {
    input: './blocks/workflow-carousel/workflow-carousel-dev.css',
    output: './blocks/workflow-carousel/workflow-carousel.css',
  },
  {
    input: './blocks/product-category/product-category-dev.css',
    output: './blocks/product-category/product-category.css',
  },
  {
    input: './templates/processStep/processStep-dev.css',
    output: './templates/processStep/processStep.css',
  },
  {
    input: './templates/library/library-dev.css',
    output: './templates/library/library.css',
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
    input: './templates/topic/topic-dev.css',
    output: './templates/topic/topic.css',
  },
];

const minify = process.argv[2];
const watch = process.argv[3];

// Loop through each file mapping and run Tailwind CSS CLI
fileMappings.forEach(({ input, output }) => {
  const command = `npx tailwindcss -i ${input} -o ${output} ${minify} ${watch}`;
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
