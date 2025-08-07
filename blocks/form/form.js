export default async function decorate(block) {
  // Find embedded scripts marked with data-script attribute
  const scriptBlocks = block.querySelectorAll('script[data-script]');

  scriptBlocks.forEach((scriptBlock) => {
    try {
      const code = scriptBlock.textContent || scriptBlock.innerText;
      // Execute the code safely using Function constructor
      new Function(code)();
    } catch (e) {
      console.error('Script execution error:', e);
    }
  });
}
