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

  // Find wrapper and infoBlock
  const wrapper = document.querySelector('.article-info-new-wrapper');
  if (!wrapper) return;

  let infoBlock = wrapper.querySelector('.article-info-new');
  if (!infoBlock) {
    // Create infoBlock div if missing
    infoBlock = document.createElement('div');
    infoBlock.className = 'article-info-new';
    wrapper.appendChild(infoBlock);
  }

  // Define expected properties in order with example default empty values
  const articleInfoDefaults = {
    authorName: '',
    authorTitle: '',
    image: '',
    publishDate: '',
    articleOpco: '',
    readingTime: '',
  };

  // Extract current <p> elements text to populate values if present
  const existingParagraphs = infoBlock.querySelectorAll('p');
  const existingTexts = Array.from(existingParagraphs).map(p => p.textContent.trim());

  // Fill articleInfo from existing paragraphs if possible
  const articleInfo = Object.keys(articleInfoDefaults).reduce((acc, prop, i) => {
    acc[prop] = existingTexts[i] || articleInfoDefaults[prop];
    return acc;
  }, {});

  // Format publish date if present or set to today
  let date;
  if (articleInfo.publishDate) {
    date = new Date(articleInfo.publishDate);
  } else {
    date = null;
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  articleInfo.publishDate = formattedDate;

  // Clear existing paragraphs before re-adding with data attributes and content
  infoBlock.innerHTML = '';

  // Rebuild paragraphs with data-aue-prop and updated content
  for (const [prop, value] of Object.entries(articleInfo)) {
    const p = document.createElement('p');
    p.setAttribute('data-aue-prop', prop);
    p.textContent = value;
    infoBlock.appendChild(p);
  }

  // Append block to the section if not already appended
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
