export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  if (!main) {
    console.warn('Main element not found');
    return;
  }

  const section = main.querySelector(':scope > div:nth-child(2)');
  if (!section) {
    console.warn('Second div inside <main> not found');
    return;
  }

  let blogH1 = '';
  let blogHeroP1 = '';
  let blogHeroP2 = '';
  const firstThreeChildren = Array.from(section.children).slice(0, 3);

  firstThreeChildren.every((child) => {
    if (child.tagName === 'H1' && !blogH1) {
      blogH1 = child;
    } else if (child.tagName === 'P' && !blogHeroP1) {
      blogHeroP1 = child;
    } else if (child.tagName === 'P' && !blogHeroP2) {
      blogHeroP2 = child;
    }

    const imgElement = child.querySelector(':scope > picture, :scope > img');
    if (imgElement) return false;
    return true;
  });

  if (!blogH1) {
    console.warn('Blog heading (h1) not found.');
    return;
  }

  section.removeChild(blogH1);

  let columnElements = '';
  let blogHeroImage;

  if (blogHeroP2) {
    blogHeroImage = blogHeroP2.querySelector(':scope > picture, :scope > img');
    section.removeChild(blogHeroP1);
    section.removeChild(blogHeroP2);
    const divEl = div();
    divEl.append(blogH1, blogHeroP1);
    if (blogHeroImage) moveImageInstrumentation(blogHeroImage);
    columnElements = [[divEl, blogHeroImage]];
  } else if (blogHeroP1) {
    blogHeroImage = blogHeroP1.querySelector(':scope > picture, :scope > img');
    if (blogHeroImage) moveImageInstrumentation(blogHeroImage);
    section.removeChild(blogHeroP1);
    columnElements = [[blogHeroImage, blogH1]];
  } else {
    columnElements = [blogH1];
  }

  section.prepend(
    buildBlock('social-media', { elems: [] }),
    buildBlock('columns', columnElements),
    buildBlock('article-info', { elems: [] })
  );

  const additionalContentSection = document.createElement('div');
  additionalContentSection.append(
    buildBlock('tags-list', { elems: [] }),
    buildBlock('related-articles', { elems: [] })
  );
  section.after(additionalContentSection);

  buildArticleSchema();

  section.parentElement.prepend(section);
}
