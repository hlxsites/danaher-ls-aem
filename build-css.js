const { exec } = require('child_process');

// Define input and output file mappings
const fileMappings = [
  {
    input: './styles/tailwind.css',
    output: './styles/styles.css',
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
    input: './blocks/workflow-carousel/workflow-carousel-dev.css',
    output: './blocks/workflow-carousel/workflow-carousel.css',
  },
  {
    input: './blocks/product-category/product-category-dev.css',
    output: './blocks/product-category/product-category.css',
  },
  {
    input: './styles/coveo-atomic.css',
    output: './blocks/product-resources/product-resources.css',
  },
  {
    input: './styles/coveo-atomic.css',
    output: './blocks/product-children/product-children.css',
  },
  {
    input: './templates/processStep/processStep-dev.css',
    output: './templates/processStep/processStep.css',
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
fileMappings.forEach(({ content, input, output }) => {
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
