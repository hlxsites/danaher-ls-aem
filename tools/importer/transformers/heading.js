const createBlogHeader = (main, document) => {
  const headings = main.querySelectorAll('div.heading');
  [...headings].forEach((heading) => {
    const headingEL = heading?.querySelector('heading');
    const hTag = headingEL?.getAttribute('headingtag') ? headingEL?.getAttribute('headingtag') : 'h1';
    const headEl = document.createElement(hTag);
    headEl.textContent = headingEL?.getAttribute('heading');
    if (headEl.innerHTML) {
      heading.append(headEl);
    }

    const p = document.createElement('p');
    p.innerHTML = headingEL?.getAttribute('subheadingtext');
    if (p.innerHTML) {
      heading.append(p);
    }
  });
};
export default createBlogHeader;
