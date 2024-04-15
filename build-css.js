const { exec } = require('child_process');

// Define input and output file mappings
const fileMappings = [
  {
    input: './styles/tailwind.css',
    output: './styles/styles.css',
  },
  {
    input: './blocks/page-jump-menu/page-jump-menu.less',
    output: './blocks/page-jump-menu/page-jump-menu.css',
  },
  {
    input: './blocks/cards/cards.less',
    output: './blocks/cards/cards.css',
  },
  {
    input: './blocks/header/header.less',
    output: './blocks/header/header.css',
  },
  {
    input: './blocks/columns/columns.less',
    output: './blocks/columns/columns.css',
  },
  {
    input: './blocks/product-hero/product-hero.less',
    output: './blocks/product-hero/product-hero.css',
  },
  {
    input: './blocks/page-tabs/page-tabs.less',
    output: './blocks/page-tabs/page-tabs.css',
  },
  {
    input: './blocks/timeline/timeline.less',
    output: './blocks/timeline/timeline.css',
  },
  {
    input: './templates/processStep/processStep.less',
    output: './templates/processStep/processStep.css',
  },
  {
    input: './templates/library/library.less',
    output: './templates/library/library.css',
  },
  {
    input: './templates/application/application.less',
    output: './templates/application/application.css',
  },
  {
    input: './templates/brandHome/brandHome.less',
    output: './templates/brandHome/brandHome.css',
  },
];

const watch = process.argv[2];

// Loop through each file mapping and run Tailwind CSS CLI
fileMappings.forEach(({ input, output }) => {
  const command = `npx tailwindcss -i ${input} -o ${output} ${watch}`;
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
