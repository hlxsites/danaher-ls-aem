export default function decorate(block) {
  const main = document.querySelector('main');
  console.log('main', main);
  const content = main.querySelector('div');
  console.log('content', content);
  const innerContent = content?.querySelector('div');
  console.log('innerContent', innerContent);
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

  const paragraphs = infoBlock.querySelectorAll('p');
  const values = Array.from(paragraphs).map((p) => p.textContent.trim());

  const [authorName, authorTitle, image, publishDate, articleOpco, readingTime] = values;

  const articleInfo = {
    authorName,
    authorTitle,
    image,
    publishDate,
    articleOpco,
    readingTime,
  };

  console.log('publishDate', publishDate);
  // Format or set publish date
  let date;
  if (articleInfo.publishDate) {
    date = new Date(articleInfo.publishDate);
  } else {
    date = new Date();
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  articleInfo.publishDate = formattedDate;

  if (paragraphs[3]) {
    paragraphs[3].textContent = formattedDate;
  }

  // Append block to the section
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
