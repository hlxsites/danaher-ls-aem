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

  const wrapper = block.closest('.article-info-new-wrapper') || block;
  const infoBlock = wrapper.querySelector('.article-info-new') || block;
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

  // Set formatted date text in the paragraph
  if (paragraphs[3]) {
    paragraphs[3].textContent = formattedDate;
  }

  // ALSO set the value of the input if present, so the form saves the date
  const publishDateDiv = infoBlock.querySelector('[data-aue-prop="publishDate"]');
  if (publishDateDiv) {
    const inputField = publishDateDiv.querySelector('input');
    if (inputField) {
      // Convert formattedDate back to yyyy-mm-dd for input[type="date"] value format
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      inputField.value = `${yyyy}-${mm}-${dd}`;
    }
  }

  // Append block to the section
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
