export default function decorate(block) {
  const main = document.querySelector('main');
  const content = block.querySelector('div');
  const innerContent = content?.querySelector('div');

  if (!innerContent) {
    return;
  }

  // Add utility classes to the inner wrapper
  const classes = ['items-center', 'flex', 'justify-start', 'my-4', 'w-full', 'col-span-2'];
  innerContent.classList.add(...classes);

  const authorName = innerContent.querySelector('.authorName');
  const authorTitle = innerContent.querySelector('.authorTitle');
  const image = innerContent.querySelector('.image');
  const imageAlt = innerContent.querySelector('.imageAlt');
  const articleOpco = innerContent.querySelector('.articleOpco');
  const publishDateEl = innerContent.querySelector('.publishDate');
  const readingTime = innerContent.querySelector('.readingTime');
  const textClasses = ['text-danaherblack-500', 'font-medium'];

  const elements = [
    authorName,
    authorTitle,
    image,
    imageAlt,
    articleOpco,
    readingTime,
    publishDateEl,
  ];

  elements.forEach((el) => {
    if (el) {
      el.classList.add(...textClasses);
    }
  });

  // Format publish date if present
  if (publishDateEl?.textContent) {
    const rawDate = new Date(publishDateEl.textContent.trim());
    const formattedDate = rawDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    publishDateEl.textContent = formattedDate;
  }
  const section = main.querySelector('section');
  if (section) {
    section.appendChild(block);
  }
}
