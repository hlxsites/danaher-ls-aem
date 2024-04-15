const { exec } = require('child_process');

// Define input and output file mappings
const fileMappings = [
  { input: './styles/tailwind.css', output: './styles/styles.css' },
  { input: './blocks/page-jump-menu/page-jump-menu.less', output: './blocks/page-jump-menu/page-jump-menu.css' },
];

const minify = process.argv[2];
const watch = process.argv[3];

// Loop through each file mapping and run Tailwind CSS CLI
fileMappings.forEach(({ input, output }) => {
  const command = `npx tailwindcss -i ${input} -o ${output} ${minify} ${watch}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error compiling ${input}:`, error);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
});
