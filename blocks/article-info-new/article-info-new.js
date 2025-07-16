export default function decorate(block) {
  const main = document.querySelector('main');
  const content = block.querySelector('div');
  const innerContent = content?.querySelector('div');
  innerContent.classList.add(...'items-center flex justify-start my-4 w-full col-span-2'.split(' '));

  const authorName = innerContent?.querySelector('authorName');
  authorName.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));

  const authorTitle = innerContent?.querySelector('authorTitle');
  authorTitle.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));

  const image = innerContent?.querySelector('image');
  image.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));

  const imageAlt = innerContent?.querySelector('imageAlt');
  imageAlt.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));

  const articleOpco = innerContent?.querySelector('articleOpco');
  articleOpco.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));

  const publishDate = innerContent?.querySelector('publishDate');
  publishDate.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));
  
  const readingTime = innerContent?.querySelector('readingTime');
  readingTime.classList.add(...'!text-4xl font-extrabold tracking-tight text-white'.split(' '));

  main.parentNode.insertBefore(block, main);
}
