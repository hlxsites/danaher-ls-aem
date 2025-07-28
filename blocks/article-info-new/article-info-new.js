export default function decorate(block) {
  const main = document.querySelector('main');
  const content = main.querySelector('div');
  const innerContent = content?.querySelector('div');
  if (!innerContent) return;

  const classes = [
    'items-center',
    'flex',
    'justify-start',
    'my-4',
    'w-full',
    'col-span-2',
  ];
  innerContent.classList.add(...classes);

  const wrapper = document.querySelector('.article-info-new-wrapper');
  if (!wrapper) return;

  let infoBlock = wrapper.querySelector('.article-info-new');
  if (!infoBlock) {
    infoBlock = document.createElement('div');
    infoBlock.className = 'article-info-new';
    wrapper.appendChild(infoBlock);
  }

  // Define expected properties
  const articleInfoDefaults = {
    authorName: '',
    authorTitle: '',
    image: '',
    publishDate: '',
    articleOpco: '',
    readingTime: '',
  };

  // Extract current property values from <p data-aue-prop="">
  const propertyEls = infoBlock.querySelectorAll('[data-aue-prop]');
  const articleInfo = { ...articleInfoDefaults };

  propertyEls.forEach((el) => {
    const prop = el.getAttribute('data-aue-prop');
    articleInfo[prop] = el.textContent.trim();
  });

  // Parse and format publishDate
  let rawDate = articleInfo.publishDate;
  let date = new Date(rawDate);
  if (isNaN(date.getTime())) {
    date = new Date(); // fallback
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  // Keep the raw publish date in the property for AEM binding
  articleInfo.publishDate = rawDate; // NOT formatted

  // Clear content
  infoBlock.innerHTML = '';

  // Rebuild <p> tags with properties
  for (const [prop, value] of Object.entries(articleInfo)) {
    const p = document.createElement('p');
    p.setAttribute('data-aue-prop', prop);
    p.setAttribute('data-aue-type', 'text');
    p.setAttribute('data-aue-label', prop);
    p.textContent = value;
    infoBlock.appendChild(p);

    // 👇 Add formatted display for publishDate right after property
    if (prop === 'publishDate') {
      const display = document.createElement('p');
      display.className = 'publish-date-display';
      display.textContent = formattedDate;
      infoBlock.appendChild(display);
    }
  }

  // Append block to section if not already
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
