export default function decorate(block) {
  const main = document.querySelector('main');
  const content = main.querySelector('div');
  const innerContent = content?.querySelector('div');
  if (!innerContent) return;

  innerContent.classList.add(
    'items-center',
    'flex',
    'justify-start',
    'my-4',
    'w-full',
    'col-span-2',
  );

  const wrapper = document.querySelector('.article-info-new-wrapper');
  if (!wrapper) return;

  let infoBlock = wrapper.querySelector('.article-info-new');
  if (!infoBlock) return;

  // Get all props
  const props = {
    authorName: '',
    authorTitle: '',
    image: '',
    publishDate: '',
    articleOpco: '',
    readingTime: '',
  };

  // Extract values from existing <p data-aue-prop>
  Object.keys(props).forEach((prop) => {
    const el = infoBlock.querySelector(`[data-aue-prop="${prop}"]`);
    props[prop] = el?.textContent.trim() || '';
  });

  // Format the publish date for display only (do not overwrite data-aue-prop)
  const rawDate = props.publishDate;
  const parsedDate = new Date(rawDate);
  const formattedDate = isNaN(parsedDate)
    ? ''
    : parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });

  // Add formatted date display (after the real property)
  if (rawDate && !infoBlock.querySelector('.formatted-publish-date')) {
    const display = document.createElement('p');
    display.className = 'formatted-publish-date';
    display.textContent = formattedDate;
    const publishDateEl = infoBlock.querySelector('[data-aue-prop="publishDate"]');
    if (publishDateEl) {
      publishDateEl.insertAdjacentElement('afterend', display);
    }
  }

  // Append block to section if not already added
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
