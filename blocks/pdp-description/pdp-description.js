import { div } from '../../scripts/dom-builder.js';

// Performance enhancement wrapper - add loading state and async processing
(function enhanceDescriptionPerformance() {
  // Enhanced async version
  window.pdpDescriptionDecorateAsync = async function (block) {
    // Show skeleton loading immediately
    block.innerHTML = '<div class="description-skeleton">Loading description...</div>';

    // Add performance CSS
    if (!document.querySelector('#desc-perf-enhance')) {
      const style = document.createElement('style');
      style.id = 'desc-perf-enhance';
      style.textContent = `
        .pdp-description{contain:layout style;transform:translateZ(0)}
        .pdp-description img{aspect-ratio:16/9;object-fit:cover;loading:lazy;decoding:async;max-width:100%;height:auto}
        .pdp-description p{contain:layout;margin-bottom:1rem}
        .pdp-description h1,.pdp-description h2,.pdp-description h3{contain:layout}
      `;
      document.head.appendChild(style);
    }

    const startTime = performance.now();

    try {
      // Process asynchronously for better performance
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          const children = [...block.querySelectorAll(':scope > *:not(.description-skeleton)')];
          const fragment = document.createDocumentFragment();

          children.forEach((child) => {
            // Enhanced image optimization
            const images = child.querySelectorAll('img');
            images.forEach((img) => {
              img.loading = 'lazy';
              img.decoding = 'async';
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.aspectRatio = '16/9';
              img.style.objectFit = 'cover';
              img.style.borderRadius = '4px';
            });

            // Apply containment to text elements
            const textElements = child.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div');
            textElements.forEach((el) => {
              if (el.textContent.trim().length > 50) {
                el.style.contain = 'layout';
              }
            });

            fragment.appendChild(child);
          });

          // Smooth entrance animation
          block.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          block.style.transform = 'translateY(10px)';
          block.style.opacity = '0';
          block.innerHTML = '';
          block.appendChild(fragment);

          requestAnimationFrame(() => {
            block.style.opacity = '1';
            block.style.transform = 'translateY(0)';
          });

          resolve();
        });
      });

      console.log(`Enhanced Description: ${(performance.now() - startTime).toFixed(2)}ms`);
    } catch (error) {
      console.error('Description enhancement error:', error);
      block.innerHTML = '<div>Description content unavailable</div>';
    }
  };
}());

export default async function decorate(block) {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  block.replaceChildren();
  block.id = 'overview-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.innerHTML = response?.raw?.richlongdescription || '';
  block.prepend(div({ class: 'text-2xl text-black' }, 'Description'));
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}
