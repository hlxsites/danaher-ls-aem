/*
 * Convert all /content/dam/danaher/system/icons/... icons to SVG placeholders
 */
const postProcessSVGIcons = (main) => {
  main.querySelectorAll('img').forEach((img) => {
    const imgSrc = img.getAttribute('src');
    if (imgSrc.includes('/content/dam/danaher/system/icons/') && imgSrc.includes('.svg')) {
      const svgFileName = imgSrc.split('/').pop().split('.')[0].replace(' ', '_');
      img.outerHTML = `:dam-${svgFileName}:`;
    }
  });
};
export default postProcessSVGIcons;
