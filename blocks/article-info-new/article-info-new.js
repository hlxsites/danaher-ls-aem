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

  // Find the publishDate div that holds the ISO string
  const publishDateDiv = infoBlock.querySelector('[data-aue-prop="publishDate"]');
  if (!publishDateDiv) return;

  // Get the ISO date string
  const isoDateStr = publishDateDiv.textContent.trim();
  let date;
  if (isoDateStr) {
    date = new Date(isoDateStr);
  } else {
    date = new Date();
  }

  // Format the date nicely for display
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  // KEEP the original ISO string in the publishDate div (for CMS data binding)
  publishDateDiv.textContent = isoDateStr;

  // Add or update a sibling or child element that shows the formatted date visually
  let displayDateSpan = infoBlock.querySelector('.formatted-publish-date');
  if (!displayDateSpan) {
    displayDateSpan = document.createElement('span');
    displayDateSpan.className = 'formatted-publish-date';
    publishDateDiv.insertAdjacentElement('afterend', displayDateSpan);
  }
  displayDateSpan.textContent = formattedDate;

  // Append block to the section if needed
  const section = main.querySelector('section');
  if (section && !section.contains(block)) {
    section.appendChild(block);
  }
}
