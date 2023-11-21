/* global WebImporter */
const decodeHTML = (encodedString) => encodedString.replaceAll('&#x3C;', '<')
  .replaceAll('&lt;', '<')
  .replaceAll('<u>', '')
  .replaceAll('</u>', '')
  .replaceAll('&nbsp;', '');

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

  // add missing space after <b> tag
  html.querySelectorAll('b').forEach((bold) => {
    bold.outerHTML = bold.outerHTML.replace(/<\/b>/g, '</b> ');
  });

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

export const mapTable = (table, document) => {
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

export const featureimage = (featureImg, document) => {
  const featureImageEL = featureImg?.querySelector('feature-image');
  if (featureImageEL?.getAttribute('title')) {
    const title = document.createElement('h2');
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
    image.alt = featureImageEL?.getAttribute('imgalt') ? featureImageEL?.getAttribute('imgalt') : '';
    featureImg.append(image);
  }

  if (featureImageEL?.getAttribute('btnhref')) {
    const anc = document.createElement('a');
    anc.href = featureImageEL?.getAttribute('btnhref');
    anc.textContent = featureImageEL?.getAttribute('btntext');
    featureImg.append(anc);
  }
  if (featureImageEL) featureImageEL.remove();
  return featureImg;
};

export const imagetext = (imgText, document) => {
  const imagetextEL = imgText?.querySelector('imagetext');
  const image = document.createElement('img');
  image.src = imagetextEL?.getAttribute('image');
  image.alt = imagetextEL?.getAttribute('imageAlt');
  imgText.append(image);
  return imgText;
};

export const appendText = (text) => {
  text.append(text?.firstElementChild?.firstElementChild);
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
  const anc = document.createElement('a');
  anc.href = videoEl.getAttribute('src');
  anc.textContent = 'Video Player';
  embedEl.replaceWith(anc);
};

export const productcitations = (citations) => {
  citations.innerHTML = citations.outerHTML;
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

export const c2a = (cta, document) => {
  const ctaSection = cta.querySelector('CTAsection');
  if (ctaSection) {
    const title = ctaSection.getAttribute('title');
    const btnText1 = ctaSection.getAttribute('btntext1');
    const rfqBtn1 = ctaSection.getAttribute('rfqbtn1');
    const btnhref1 = ctaSection.getAttribute('btnhref1');
    const btnText2 = ctaSection.getAttribute('btntext2');
    const rfqBtn2 = ctaSection.getAttribute('rfqbtn2');
    const btnhref2 = ctaSection.getAttribute('btnhref2');
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = title;
    if (h2) {
      div.append(h2);
    }
    const btn1 = document.createElement('button');
    btn1.textContent = btnText1;
    if (rfqBtn1 && btn1.textContent) {
      div.append(btn1);
    }
    if (btnhref1 && btn1.textContent) {
      const p1 = document.createElement('p');
      const a1 = document.createElement('a');
      a1.setAttribute('href', btnhref1);
      a1.textContent = btn1.textContent;
      p1.append(a1);
      div.append(p1);
    }
    const btn2 = document.createElement('button');
    btn2.textContent = btnText2;
    if (rfqBtn2 && btn2.textContent) {
      div.append(btn2);
    }
    if (btnhref2 && btn2.textContent) {
      const p2 = document.createElement('p');
      const a2 = document.createElement('a');
      a2.setAttribute('href', btnhref2);
      a2.textContent = btn2.textContent;
      p2.append(a2);
      div.append(p2);
    }
    const cells = [
      ['call-to-action'], [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    if (ctaSection.closest('div.bg-danaherlightblue-50')) ctaSection.append(document.createElement('hr'));
    cta.append(block);
  }
};
