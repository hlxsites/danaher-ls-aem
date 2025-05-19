import { createElement } from '../../scripts/scripts.js';

const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title').innerText;
  }
  return '';
};

const getAllPathsExceptCurrent = async (paths) => {
  const result = [];
  const pathsList = paths.replace(/^\/|\/$/g, '').split('/');

  let prevPath = '';
  const fetchPromises = [];

  for (let i = 0; i < pathsList.length - 1; i += 1) {
    const pathPart = pathsList[i];
    prevPath = `${prevPath}/${pathPart}`;
    const path = `${prevPath}.html`;
    const url = `${window.location.origin}${path}`;

    // Push the promise to the array
    fetchPromises.push(getPageTitle(url).then((name) => {
      if (name) {
        result.push({ path, name, url });
      }
    }));
  }

  await Promise.all(fetchPromises);

  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  pathLink.innerText = path.name;
  pathLink.classList.add('breadcrumb-link');
  return pathLink;
};

export default async function decorate(block) {
  const breadcrumb = createElement('nav', '', {
    'aria-label': 'Breadcrumb',
  });
  block.innerHTML = '';

  const HomeLink = createLink({ path: '', name: 'Home', url: window.location.origin });
  const breadcrumbLinks = [HomeLink.outerHTML];

  window.setTimeout(async () => {
    const path = window.location.pathname;
    const paths = await getAllPathsExceptCurrent(path);

    paths.forEach((pathPart) => breadcrumbLinks.push(createLink(pathPart).outerHTML));

    const currentPath = document.createElement('span');
    currentPath.innerText = document.querySelector('title').innerText;
    currentPath.style.fontWeight = 'bold';
    currentPath.style.color = 'black';
    breadcrumbLinks.push(currentPath.outerHTML);

    const separator = '<span class="breadcrumb-separator">></span>';

    breadcrumb.innerHTML = breadcrumbLinks.join(separator);
    block.append(breadcrumb);
  }, 1000);
}
