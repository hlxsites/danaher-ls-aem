import ffetch from '../../scripts/ffetch.js';
import {
  ul, a, div, span,
} from '../../scripts/dom-builder.js';
import { getMetadata, toClassName } from '../../scripts/lib-franklin.js';
import createArticleCard from './articleCard.js';
import createLabCard from './newLabCard.js';
import createLibraryCard from './libraryCard.js';
import createApplicationCard from './applicationCard.js';
import { makePublicUrl } from '../../scripts/scripts.js';
 
// Performance optimizations - consolidated
(function() {
  // Add critical CSS inline for immediate performance
  if (!document.querySelector('#card-list-performance-css')) {
    const criticalCSS = `
      .card-list{contain:layout style;text-rendering:optimizeSpeed}
      .loading-state{min-height:200px;display:flex;align-items:center;justify-content:center;contain:layout style paint;transform:translateZ(0)}
      .card-list .container.grid{display:grid;gap:1rem;grid-template-columns:1fr;contain:layout;content-visibility:auto;contain-intrinsic-size:0 400px}
      .card-list .flex.flex-wrap{contain:layout style}
      .card-list .flex.flex-wrap a{contain:layout style;backface-visibility:hidden;transform:translateZ(0)}
      .card-list img{width:100%;height:auto;contain:layout;content-visibility:auto}
      .card-list li,.card-list .card,.card-list .article-card{contain:layout style;transform:translateZ(0);backface-visibility:hidden}
      @media (max-width:767px){.card-list .flex.flex-wrap a{transition:none}.card-list .rounded-full{border-radius:12px}.card-list .shadow{box-shadow:none}.card-list *{text-rendering:optimizeSpeed}}
      @media (min-width:768px){.card-list .grid.md\\:grid-cols-2{grid-template-columns:repeat(2,1fr)}}
      @media (min-width:1024px){.card-list .grid.lg\\:grid-cols-3{grid-template-columns:repeat(3,1fr)}}
    `;
   
    const style = document.createElement('style');
    style.id = 'card-list-performance-css';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
 
  // Preconnect to fonts for better performance
  if (!document.querySelector('link[rel="preconnect"][href*="fonts.googleapis"]')) {
    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
 
  // Optimize images when DOM loads
  const optimizeImages = () => {
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';
      if (!img.style.aspectRatio && !img.width && !img.height) {
        img.style.aspectRatio = '16/9';
      }
    });
  };
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImages);
  } else {
    optimizeImages();
  }
})();
 
let tagName = '';
switch (getMetadata('template')) {
  case 'wsaw':
    tagName = 'solutions';
    break;
  case 'promotions':
    tagName = 'topics';
    break;
  default:
    tagName = 'topics';
}
 
const getSelectionFromUrl = () => (window.location.pathname.indexOf(tagName) > -1 ? toClassName(window.location.pathname.replace('.html', '').split('/').pop()) : '');
const getPageFromUrl = () => toClassName(new URLSearchParams(window.location.search).get('page')) || '';
 
const createTopicUrl = (currentUrl, keyword = '') => {
  if (currentUrl.indexOf(tagName) > -1) {
    return currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + toClassName(keyword).toLowerCase();
  }
  return `${currentUrl.replace('.html', '')}/${tagName}/${toClassName(keyword).toLowerCase()}`;
};
 
const patchBannerHeading = () => {
  document.querySelector('body .banner h1').textContent = getMetadata('heading');
};
 
const createPaginationLink = (page, label, current = false) => {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('page', page);
  const link = a(
    {
      href: newUrl.toString(),
      class:
        'font-medium text-sm leading-5 pt-4 px-4 items-center inline-flex hover:border-t-2 hover:border-gray-300 hover:text-gray-700',
    },
    label || page,
  );
  if (current) {
    link.setAttribute('aria-current', 'page');
    link.classList.add('text-danaherpurple-500', 'border-danaherpurple-500', 'border-t-2');
  } else {
    link.classList.add('text-danahergray-700');
  }
  return link;
};
 
const createPagination = (entries, page, limit) => {
  const paginationNav = document.createElement('nav');
  paginationNav.className = 'flex items-center justify-between border-t py-4 md:py-0 mt-8 md:mt-12';
 
  if (entries.length > limit) {
    const maxPages = Math.ceil(entries.length / limit);
    const paginationPrev = div({ class: 'flex flex-1 w-0 -mt-px' });
    const paginationPages = div({ class: 'hidden md:flex grow justify-center w-0 -mt-px' });
    const paginationNext = div({ class: 'flex flex-1 w-0 -mt-px justify-end' });
 
    if (page > 1) {
      paginationPrev.append(createPaginationLink(page - 1, '← Previous'));
    }
    for (let i = 1; i <= maxPages; i += 1) {
      if (i === 1 || i === maxPages || (i >= page - 2 && i <= page + 2)) {
        paginationPages.append(createPaginationLink(i, i, i === page));
      } else if (
        paginationPages.lastChild && !paginationPages.lastChild.classList.contains('ellipsis')
      ) {
        paginationPages.append(
          span(
            { class: 'ellipsis font-medium text-sm leading-5 pt-4 px-4 items-center inline-flex' },
            '...',
          ),
        );
      }
    }
    if (page < maxPages) {
      paginationNext.append(createPaginationLink(page + 1, 'Next →'));
    }
 
    paginationNav.append(paginationPrev, paginationPages, paginationNext);
  }
  const listPagination = div({ class: 'mx-auto' }, paginationNav);
  return listPagination;
};
 
export function createFilters(articles, viewAll = false) {
  // collect tag filters
  const allKeywords = articles.map((item) => {
    // Check if item[tagName] exists
    if (item[tagName]) {
      return item[tagName].replace(/,\s*/g, ',').replace(/&amp;/g, '&').split(',');
    }
    return [];
  });
  const keywords = new Set([].concat(...allKeywords));
  keywords.delete('');
  keywords.delete('Blog'); // filter out generic blog tag
  keywords.delete('News'); // filter out generic news tag
 
  // render tag cloud
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('page');
  if (window.location.pathname.indexOf(tagName) > -1) {
    newUrl.pathname = window.location.pathname.substring(0, window.location.pathname.indexOf(`/${tagName}/`));
  }
  const tags = viewAll ? div(
    { class: 'flex flex-wrap gap-2 gap-y-0 mb-4' },
    a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold text-danaherpurple-500 bg-danaherpurple-50 hover:text-white hover:bg-danaherpurple-500',
        href: makePublicUrl(newUrl.toString()),
      },
      'View All',
    ),
  ) : div({ class: 'flex flex-wrap gap-2 gap-y-0 mb-4' });
 
  [...keywords].sort().forEach((keyword) => {
    let currentUrl;
    if (viewAll) {
      currentUrl = window.location.pathname;
    } else {
      currentUrl = window.location.pathname.split('/');
      currentUrl.pop();
      currentUrl = currentUrl.join('/');
    }
    newUrl.pathname = createTopicUrl(currentUrl, keyword);
    const tagAnchor = a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold text-danaherpurple-500 bg-danaherpurple-50 hover:text-white hover:bg-danaherpurple-500',
        href: makePublicUrl(newUrl.toString()),
      },
      keyword,
    );
    tags.append(tagAnchor);
  });
  [...tags.children].forEach((tag) => {
    const url = new URL(tag.href);
    if (url.pathname === window.location.pathname) {
      tag.classList.add('bg-danaherpurple-500', 'text-white');
      tag.setAttribute('aria-current', 'tag');
    } else {
      tag.classList.add('text-danaherpurple-500', 'bg-danaherpurple-50');
    }
  });
 
  // patch banner heading with selected tag only on topics pages
  if (getMetadata('heading') && window.location.pathname.indexOf(tagName) > -1) {
    patchBannerHeading();
  }
 
  return tags;
}
 
let indexTemplate = getMetadata('template');
if (window.location.href.includes('new-lab')) {
  indexTemplate = 'new-lab';
}
 
export default async function decorate(block) {
  // Performance optimized loading state
  block.innerHTML = '<div class="loading-state" style="text-align:center;padding:1rem;color:#666;">Loading articles...</div>';
 
  let indexType = '';
  switch (indexTemplate) {
    case 'wsaw':
      indexType = 'wsaw';
      break;
    case 'new-lab':
      indexType = 'promotions';
      break;
    default:
      indexType = 'article';
  }
 
  block.setAttribute('id', 'card-list');
  const articleType = block.classList.length > 2 ? block.classList[1] : '';
  if (articleType) block.classList.remove(articleType);
 
  try {
    // Optimized data fetching
    const articles = await ffetch(`/us/en/${indexType}-index.json`)
      .chunks(200) // Reduced for better performance
      .filter(({ type }) => {
        if (!articleType) return true;
        return type && type.toLowerCase() === articleType.toLowerCase();
      })
      .filter((article) => {
        return !article.path?.includes('/topics-template');
      })
      .all();
 
    let filteredArticles = articles;
    const activeTagFilter = block.classList.contains('url-filtered') ? getSelectionFromUrl() : '';
    if (activeTagFilter) {
      filteredArticles = articles.filter(
        (item) => toClassName(item[tagName]).toLowerCase().indexOf(activeTagFilter) > -1,
      );
    }
   
    block.innerHTML = '';
   
    if (filteredArticles.length === 0) {
      block.innerHTML = '<div style="text-align:center;padding:2rem;color:#666;">No articles found</div>';
      return;
    }
 
    // Optimized rendering
    if (articleType === 'application' || articleType === 'info') {
      filteredArticles.sort((card1, card2) => card1.title.localeCompare(card2.title));
      const cardList = ul({
        class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 justify-items-center mt-3 mb-3',
      });
     
      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();
      filteredArticles.forEach((article) => {
        fragment.appendChild(createApplicationCard(article));
      });
      cardList.appendChild(fragment);
      block.append(cardList);
     
    } else {
      if (articleType === 'library') {
        filteredArticles.sort((card1, card2) => card1.title.localeCompare(card2.title));
      } else {
        filteredArticles.sort((card1, card2) => (card2.publishDate || 0) - (card1.publishDate || 0));
      }
 
      let page = parseInt(getPageFromUrl(), 10);
      page = Number.isNaN(page) ? 1 : page;
      const limitPerPage = 12; // Reduced for better mobile performance
      const start = (page - 1) * limitPerPage;
      const articlesToDisplay = filteredArticles.slice(start, start + limitPerPage);
 
      const cardList = ul({
        class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0 justify-items-center mt-3 mb-3',
      });
     
      // Performance optimized card rendering
      const fragment = document.createDocumentFragment();
      articlesToDisplay.forEach((article, index) => {
        let cardElement;
        if (articleType === 'library') {
          cardElement = createLibraryCard(article, index === 0);
        } else if (articleType === 'new-lab') {
          cardElement = createLabCard(article, index === 0);
        } else {
          cardElement = createArticleCard(article, index === 0);
        }
        if (cardElement) {
          fragment.appendChild(cardElement);
        }
      });
      cardList.appendChild(fragment);
 
      // Render filters first for immediate interaction
      const filterTags = createFilters(articles, true);
      filterTags.style.marginBottom = '45px';
      const paginationElements = createPagination(filteredArticles, page, limitPerPage);
     
      // Batch DOM updates
      block.appendChild(filterTags);
      block.appendChild(cardList);
      block.appendChild(paginationElements);
     
      // Setup simple lazy loading
      setupImageLazyLoading(block);
    }
   
  } catch (error) {
    console.error('Error loading articles:', error);
    block.innerHTML = '<div style="text-align:center;padding:2rem;color:#e74c3c;">Failed to load articles</div>';
  }
}
 
// Simple lazy loading function
function setupImageLazyLoading(container) {
  if (!('IntersectionObserver' in window)) return;
 
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, { rootMargin: '50px 0px' });
 
  container.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}