export default function decorate(block, slidesData = []) {
  // Hide parent H1 if exists
  block.parentElement.parentElement.querySelector('h1')?.classList.add('hidden');
  
  // If no data provided, fallback to existing HTML behavior
  if (!slidesData.length) {
    // existing styling logic continues...
    // ...
  } else {
    // Build slides from JSON
    slidesData.forEach((data, index) => {
      const li = document.createElement('li');
      li.className = 'card carousel-slider flex snap-start list-none bg-white flex-col duration-1000 ease-in-out inset-0 transition-transform transform';
      li.setAttribute('data-carousel-item', index + 1);
      
      // Add content wrapper
      const contentDiv = document.createElement('div');
      contentDiv.className = 'lg:w-1/2 px-4 lg:px-8 xl:pr-10';
      
      // Subheading
      const pSub = document.createElement('p');
      pSub.textContent = data.left_subheading;
      contentDiv.appendChild(pSub);
      
      // Heading
      const h2 = document.createElement('h2');
      h2.textContent = data.left_main_heading;
      contentDiv.appendChild(h2);
      
      // Product info paragraph
      const pInfo = document.createElement('p');
      pInfo.textContent = data.left_product_info;
      contentDiv.appendChild(pInfo);

      // CTA buttons
      [1, 2].forEach((n) => {
        const text = data[`left_cta_${n}_text`];
        const link = data[`left_cta_${n}_link`];
        if (text && link) {
          const pBtn = document.createElement('p');
          pBtn.className = 'button-container';
          const a = document.createElement('a');
          if (n === 1) a.setAttribute('title', 'link');
          a.href = link;
          a.textContent = text;
          pBtn.appendChild(a);
          contentDiv.appendChild(pBtn);
        }
      });

      // Ensure same wrapping logic as original
      const contentWrapper = div({ class: 'lg:m-auto w-full h-auto max-w-7xl py-8 lg:py-0 overflow-hidden' }, contentDiv);
      li.appendChild(contentWrapper);

      // Image
      if (data.right_image) {
        const picture = document.createElement('picture');
        const img = document.createElement('img');
        img.src = data.right_image;
        img.alt = data.left_main_heading;
        picture.appendChild(img);
        li.appendChild(div({ class: 'relative h-48 w-full md:h-[35rem] block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2' }, picture));
      }

      block.appendChild(li);
    });

    // Apply rest of carousel setup (controls, pagination, Carousel init)
    // You can reuse existing code for navigation, pagination, autoplay...
  }
}
