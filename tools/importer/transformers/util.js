/* global WebImporter */
const decodeHTML = (encodedString) => encodedString.replaceAll('&#x3C;', '<')
  .replaceAll('&lt;', '<')
  .replaceAll('<u>', '')
  .replaceAll('</u>', '')
  .replaceAll('&nbsp;', ' ');

const cleanUpHTML = (html) => {
  // clean up unwanted tags
  html.querySelectorAll('h2 > b, h3 > b, h4 > b').forEach((boldHeading) => {
    boldHeading.parentElement.innerHTML = boldHeading.innerHTML;
  });

  html.querySelectorAll('a > b').forEach((boldLink) => {
    const anchor = boldLink.parentElement;
    anchor.insertBefore(boldLink.firstChild, boldLink);
  });

  html.querySelectorAll('p > b').forEach((boldLink) => {
    const anchor = boldLink.firstElementChild;
    if (anchor && anchor.tagName === 'A') boldLink.parentElement.replaceChild(anchor, boldLink);
  });

  // clean up all empty elements
  const elements = html.getElementsByTagName('*');
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    const element = elements[i];
    if (!element.textContent.trim() && !element.hasChildNodes()) {
      element.parentNode.removeChild(element);
    }
  }

  // combine multiple <ul> tags into one
  html.querySelectorAll('ul + ul, ol + ol').forEach((list) => {
    const prevUl = list.previousElementSibling;
    prevUl.append(...list.childNodes);
    list.remove();
  });

  // to remove /content/danaher/ls from internal URL
  html.querySelectorAll('a').forEach((anc) => {
    anc.href = anc.href.replace('/content/danaher/ls', '');
  });

  return html;
};

export const getFutureSectionCard = (featureSectionCardDiv, document) => {
  const featureSectionCardEL = featureSectionCardDiv?.querySelector('featuresection-card');
  const title = featureSectionCardEL?.getAttribute('title');
  const description = featureSectionCardEL?.getAttribute('description');
  const image = featureSectionCardEL?.getAttribute('card-image');
  const imgEl = document.createElement('img');
  imgEl.src = image;
  featureSectionCardDiv.append(imgEl);
  const titleDivEl = document.createElement('div');
  const strongEl = document.createElement('strong');
  strongEl.textContent = title;
  titleDivEl.append(strongEl);
  featureSectionCardDiv.append(titleDivEl);
  const pEl = document.createElement('p');
  pEl.textContent = description;
  featureSectionCardDiv.append(pEl);
};

export const mapTable = (table, document) => {
  const tRows = table.querySelectorAll('tr');
  tRows.forEach((row) => {
    const tDatas = row.querySelectorAll('td');
    tDatas.forEach((data) => {
      data.removeAttribute('colspan');
      data.removeAttribute('rowspan');
    });
  });
  let tHead = table.querySelector('thead');
  if (!tHead) {
    tHead = table.createTHead();
  }
  if (tHead) {
    const row = tHead.insertRow(0);
    const th = document.createElement('th');
    th.textContent = 'Table';
    row.appendChild(th);
  }
};

export const getHeading = (heading, document) => {
  const headingEL = heading?.querySelector('heading');
  if (headingEL) {
    if (heading.nextElementSibling && [...heading.nextElementSibling.classList].includes('featureimage')) {
      const text = document.createElement('strong');
      text.textContent = headingEL?.getAttribute('heading');
      heading.append(text);
    } else {
      const hTag = headingEL?.getAttribute('headingtag') ? headingEL?.getAttribute('headingtag') : 'h2';
      const headEl = document.createElement(hTag);
      headEl.textContent = headingEL?.getAttribute('heading');
      heading.append(headEl);
    }
  }
};

export const getAEMHeading = (aemHeading, document) => {
  if (aemHeading.nextElementSibling && [...aemHeading.nextElementSibling.classList].includes('featureimage')) {
    const text = document.createElement('strong');
    text.textContent = aemHeading.firstElementChild.textContent;
    aemHeading.innerHTML = '';
    aemHeading.append(text);
  } else {
    aemHeading.append(aemHeading.firstElementChild);
  }
};

export const featureImage = (featureImg, document) => {
  const featureImageEL = featureImg?.querySelector('feature-image');
  if (featureImageEL?.getAttribute('title')) {
    const headingTag = featureImageEL?.getAttribute('titleheading');
    const title = headingTag ? document.createElement(headingTag) : document.createElement('h2');
    title.textContent = featureImageEL.getAttribute('title');
    featureImg.append(title);
  }

  if (featureImageEL?.getAttribute('description')) {
    let p = document.createElement('p');
    p.innerHTML = decodeHTML(featureImageEL.getAttribute('description'));
    p = cleanUpHTML(p);
    p.querySelectorAll('table').forEach((table) => {
      mapTable(table, document);
    });
    featureImg.append(p);
  }

  const image = featureImageEL?.getAttribute('img') ? document.createElement('img') : null;
  if (image) {
    image.src = featureImageEL?.getAttribute('img');
    image.alt = featureImageEL?.getAttribute('imgalt') ? featureImageEL?.getAttribute('imgalt') : 'Danaher Corporation';
    featureImg.append(image);
  }

  if (featureImageEL?.getAttribute('btnhref')) {
    const anc = document.createElement('a');
    anc.href = featureImageEL?.getAttribute('btnhref');
    if (featureImageEL?.getAttribute('asLink')) anc.title = 'link';
    anc.textContent = featureImageEL?.getAttribute('btntext');
    featureImg.append(anc);
  }
  if (featureImageEL) featureImageEL.remove();
  return featureImg;
};

export const imageText = (imgText, document) => {
  const imagetextEL = imgText?.querySelector('imagetext') ? imgText?.querySelector('imagetext') : imgText;
  const image = document.createElement('img');
  image.src = imagetextEL?.getAttribute('image');
  image.alt = imagetextEL?.getAttribute('imageAlt') ? imagetextEL?.getAttribute('imageAlt') : 'Danaher Corporation';
  imgText.append(image);
  return imgText;
};

export const getButton = (button, document) => {
  const buttonEl = button?.querySelector('buttontrending') ? button?.querySelector('buttontrending') : button?.querySelector('button');
  const btn = document.createElement('a');
  btn.textContent = buttonEl.getAttribute('btntext');
  btn.href = buttonEl.getAttribute('btnhref');
  button.append(btn);
  return button;
};

export const appendText = (text) => {
  if (text.textContent.trim() !== '') {
    text.append(text?.firstElementChild?.firstElementChild);
  }
  return text;
};

export const pdfembed = (embedEl, document) => {
  const pdfEl = embedEl?.querySelector('div.cmp-pdfviewer');
  const data = JSON.parse(decodeURIComponent(pdfEl.getAttribute('data-cmp-viewer-config-json')));
  const blockOptions = [];
  if (data.embedMode) blockOptions.push(data.embedMode);
  if (data.showFullScreen) blockOptions.push('showFullScreen');
  if (data.showDownloadPDF) blockOptions.push('showDownload');
  if (data.showPrintPDF) blockOptions.push('showPrint');
  const anc = document.createElement('a');
  anc.href = pdfEl.getAttribute('data-cmp-document-path');
  anc.textContent = 'PDF Viewer';
  const block = [[`embed (${blockOptions.join(',')})`], [anc]];
  const table = WebImporter.DOMUtils.createTable(block, document);
  embedEl.append(table);
};

export const videoembed = (embedEl, document) => {
  const videoEl = embedEl?.querySelector('iframe');
  embedEl.innerHTML = '';
  const anc = document.createElement('a');
  let href = videoEl.getAttribute('src');
  if (!href.startsWith('https:') && href.includes('vidyard')) {
    if (href[href.length - 1] === '?') href = href.slice(0, -1);
    href = `https:${href}`;
  }
  anc.href = href;
  anc.textContent = 'Video Player';
  embedEl.append(anc);
  return embedEl;
};

export const productcitations = (citations, document) => {
  const objectEl = citations.querySelector('object');
  const id = objectEl?.getAttribute('id');
  const dataURL = objectEl?.getAttribute('data');
  const anc = document.createElement('a');
  anc.title = id;
  anc.href = dataURL;
  citations.innerHTML = '';
  citations.append(anc);
  return citations;
};

export const testimonial = (testimonialElement, document) => {
  const testimonialEl = testimonialElement?.querySelector('testimonial');
  const block = [['Testimonial'], []];
  const image = testimonialEl?.getAttribute('imagepath');
  if (image) {
    const img = document.createElement('img');
    img.src = image;
    block[1].push(img);
  }
  block[1].push(testimonialEl?.getAttribute('testimonial'));
  if (testimonialEl?.hasAttribute('customername') && testimonialEl?.getAttribute('customername').trim() !== '') {
    block[1].push(testimonialEl.getAttribute('customername').trim());
  }
  if (testimonialEl?.hasAttribute('company') && testimonialEl?.getAttribute('company').trim() !== '') {
    block[1].push(testimonialEl.getAttribute('company').trim());
  }

  const table = WebImporter.DOMUtils.createTable(block, document);
  testimonialEl.replaceWith(table);
};

export const render = {
  featureimage: (item, row, document) => {
    const featureImages = (item.content) ? item.content.querySelectorAll('div.featureimage') : [item];
    featureImages.forEach((featureImageEL) => {
      if (featureImageEL?.firstElementChild?.localName === 'feature-image') {
        featureImage(featureImageEL, document);
        WebImporter.DOMUtils.remove(featureImageEL, ['feature-image']);
      }
      if (featureImageEL) {
        row.push(featureImageEL);
      }
    });
    return row;
  },

  imagetext: (item, row, document) => {
    const imageTextEl = item.content
      ? imageText(item.content, document)
      : imageText(item, document);
    if (imageTextEl) {
      row.push(imageTextEl);
    }
  },

  heading: (item, row, document) => {
    const heading = item.content ? item.content.querySelector('div.heading') : item;
    if (heading) {
      getHeading(heading, document);
      row.push(heading);
    }
  },

  'heading-aem': (item, row, document) => {
    const aemHeading = (item.content) ? item.content.querySelector('div.heading-aem') : item;
    if (aemHeading) {
      getAEMHeading(aemHeading, document);
      row.push(aemHeading);
    }
  },

  'featuresection-card': (item, row, document) => {
    const featureSectionCardEl = (item.content) ? item.content.querySelector('div.featuresection-card') : item;
    if (featureSectionCardEl) {
      getFutureSectionCard(featureSectionCardEl, document);
      row.push(featureSectionCardEl);
    }
  },

  script: (item, row) => {
    const featureImageEl = item.querySelector('div.featureimage');
    if (featureImageEl) {
      row.push(featureImageEl);
    }
  },

  text: (item, row) => {
    if (item) row.push(item);
  },

  video: (item, row, document) => {
    const videoEl = item.content ? item.content.querySelector('div.video') : item;
    row.push(videoembed(videoEl, document));
  },

  table: (item, row) => {
    row.push(item.querySelector('template')?.content?.querySelector('table'));
  },

  buttontrending: (item, row, document) => {
    row.push(getButton(item, document));
  },

  button: (item, row, document) => {
    row.push(getButton(item, document));
  },
};
