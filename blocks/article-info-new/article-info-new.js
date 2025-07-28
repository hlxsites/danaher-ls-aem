export default function decorate(block) {
  const main = document.querySelector('main');
  const content = main.querySelector('div');
  const innerContent = content?.querySelector('div');
  if (!innerContent) return;

  // Add layout classes
  const classes = [
    'items-center',
    'flex',
    'justify-start',
    'my-4',
    'w-full',
    'col-span-2',
  ];
  innerContent.classList.add(...classes);

  // Get wrapper and article info block
  const wrapper = document.querySelector('.article-info-new-wrapper');
  if (!wrapper) return;

  let infoBlock = wrapper.querySelector('.article-info-new');
  if (!infoBlock) {
    infoBlock = document.createElement('div');
    infoBlock.className = 'article-info-new';
    wrapper.appendChild(infoBlock);
  }

  // Get all existing <p> elements
  const paragraphs = infoBlock.querySelectorAll('p');

  // Build articleInfo from existing paragraphs
  const articleInfo = {};
  paragraphs.forEach((p) => {
    const prop = p.getAttribute('data-aue-prop');
    if (prop) {
      articleInfo[prop] = p.textContent.trim();
    }
  });

  // Safely format publishDate for display, but keep original value
  let formattedDate = '';
  let rawDate = articleInfo.publishDate;

  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed)) {
      formattedDate = parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    }
  }

  // Don't clear original properties — just append formatted display
  const existingFormatted = infoBlock.querySelector('.formatted-publish-date');
  if (!existingFormatted && formattedDate) {
    const dateDisplay = document.createElement('p');
    dateDisplay.className = 'formatted-publish-date';
    dateDisplay.textContent = formattedDate;
    infoBlock.appendChild(dateDisplay);
  }

  // Append block to section if not already present
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
