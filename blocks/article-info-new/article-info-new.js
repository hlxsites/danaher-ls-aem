export default function decorate(block) {
  // Scope to the current block or closest wrapper
  const wrapper = block.closest('.article-info-new-wrapper') || block;
  const infoBlock = wrapper.querySelector('.article-info-new');

  if (!infoBlock) return;

  // Find all paragraphs inside this block
  const paragraphs = infoBlock.querySelectorAll('p');
  if (paragraphs.length === 0) return;

  // Extract values from paragraphs in order:
  // [authorName, authorTitle, image, publishDate, articleOpco, readingTime]
  const values = Array.from(paragraphs).map((p) => p.textContent.trim());
  const [
    authorName,
    authorTitle,
    image,
    publishDate,
    articleOpco,
    readingTime,
  ] = values;

  // Prepare articleInfo object (optional, for future use)
  const articleInfo = {
    authorName,
    authorTitle,
    image,
    publishDate,
    articleOpco,
    readingTime,
  };

  // Format the publish date or default to today if missing/invalid
  let date;
  if (articleInfo.publishDate && !isNaN(new Date(articleInfo.publishDate))) {
    date = new Date(articleInfo.publishDate);
  } else {
    date = new Date();
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  // Update the publish date paragraph (assuming index 3)
  if (paragraphs[3]) {
    paragraphs[3].textContent = formattedDate;
  }

  // Add utility classes for styling scoped to this block
  infoBlock.classList.add(
    'items-center',
    'flex',
    'justify-start',
    'my-4',
    'w-full',
    'col-span-2'
  );
}
