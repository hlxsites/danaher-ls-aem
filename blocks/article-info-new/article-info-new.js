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

  const infoBlock = wrapper.querySelector('.article-info-new');
  if (!infoBlock) return;

   // Grab paragraphs by data attribute so we know which is which
  const authorNameEl = infoBlock.querySelector('[data-aue-prop="authorName"]');
  const authorTitleEl = infoBlock.querySelector('[data-aue-prop="authorTitle"]');
  const imageEl = infoBlock.querySelector('[data-aue-prop="image"]');
  const publishDateEl = infoBlock.querySelector('[data-aue-prop="publishDate"]');
  const articleOpcoEl = infoBlock.querySelector('[data-aue-prop="articleOpco"]');
  const readingTimeEl = infoBlock.querySelector('[data-aue-prop="readingTime"]');

   // Extract raw publish date text from the property element
  const rawPublishDate = publishDateEl ? publishDateEl.textContent.trim() : '';

  // Format or set publish date for display only
  let date;
  if (rawPublishDate) {
    date = new Date(rawPublishDate);
  } else {
    date = new Date();
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  let formattedDateEl = infoBlock.querySelector('[data-aue-prop="formattedPublishDate"]');

  formattedDateEl.textContent = formattedDate;

  // Append block to the section
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}