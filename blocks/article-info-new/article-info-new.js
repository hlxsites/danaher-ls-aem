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

  const articleInfoDefaults = {
    authorName: '',
    authorTitle: '',
    image: '',
    publishDate: '',
    articleOpco: '',
    readingTime: '',
  };

  // Extract existing property values from <p> tags
  const paragraphs = infoBlock.querySelectorAll('p');
  const articleInfo = {};

  paragraphs.forEach((p) => {
    const prop = p.getAttribute('data-aue-prop');
    if (prop) articleInfo[prop] = p.textContent.trim();
  });

  // If publishDate is not set, assign current date (ISO string)
  if (!articleInfo.publishDate) {
    articleInfo.publishDate = new Date().toISOString(); // AEM-compatible raw date
  }

  // Create formatted version for UI display
  const formattedDate = new Date(articleInfo.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  // Clear existing block content
  infoBlock.innerHTML = '';

  // Rebuild property-bound <p> tags
  for (const [prop, value] of Object.entries(articleInfo)) {
    const p = document.createElement('p');
    p.setAttribute('data-aue-prop', prop);
    p.setAttribute('data-aue-type', 'text');
    p.setAttribute('data-aue-label', prop);
    p.textContent = value;
    infoBlock.appendChild(p);
  }

  // Add formatted display-only date (for visual display)
  const formattedDateEl = document.createElement('p');
  formattedDateEl.className = 'formatted-publish-date';
  formattedDateEl.textContent = formattedDate;
  infoBlock.appendChild(formattedDateEl);

  // Append block to the section if not already added
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
