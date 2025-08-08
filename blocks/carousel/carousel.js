export default function decorate(block, slidesData = []) {
  const uuid = crypto.randomUUID().substring(0, 6);
  block.className = 'relative min-h-[30rem] md:min-h-[37rem] grid grid-flow-col overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 scroll-smooth';

  slidesData.forEach((data, index) => {
    const li = document.createElement('li');
    li.className = 'card carousel-slider flex snap-start list-none bg-white flex-col duration-1000 ease-in-out inset-0 transition-transform transform';
    li.setAttribute('data-carousel-item', index + 1);

    // === LEFT SIDE ===
    const content = div({ class: 'lg:w-1/2 px-4 lg:px-8 xl:pr-10' });

    if (data.left_subheading) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = data.left_subheading;
      content.appendChild(eyebrow);
    }

    if (data.left_main_heading) {
      const h2 = document.createElement('h2');
      h2.className = 'lg:text-[40px] text-2xl md:text-4xl tracking-wide md:tracking-tight m-0 font-medium leading-6 md:leading-[44px]';
      h2.textContent = data.left_main_heading;
      content.appendChild(h2);
    }

    if (data.left_product_info) {
      const para = document.createElement('p');
      para.className = 'text-xl font-extralight tracking-tight leading-7 mt-6';
      para.textContent = data.left_product_info;
      content.appendChild(para);
    }

    // === BUTTONS ===
    const actions = div({ class: 'flex flex-col md:flex-row gap-5 mt-10' });

    [1, 2].forEach((i) => {
      const text = data[`left_cta_${i}_text`];
      const link = data[`left_cta_${i}_link`];
      if (text && link) {
        const pBtn = document.createElement('p');
        pBtn.className = `btn btn-lg font-medium ${i === 1 ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
        const a = document.createElement('a');
        a.href = link;
        a.textContent = text;
        a.title = 'link';
        pBtn.appendChild(a);
        actions.appendChild(pBtn);
      }
    });

    content.appendChild(actions);

    const contentWrapper = div({ class: 'lg:m-auto w-full h-auto max-w-7xl py-8 lg:py-0 overflow-hidden' }, content);
    li.appendChild(contentWrapper);

    // === RIGHT SIDE ===
    if (data.right_text_table) {
      const tableWrapper = div({ 
        class: 'relative h-48 w-full md:h-[35rem] block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-auto p-4 bg-white' 
      });

      const tableHTML = document.createElement('div');
      tableHTML.innerHTML = data.right_text_table;
      tableWrapper.appendChild(tableHTML);

      li.appendChild(tableWrapper);
    }

    block.appendChild(li);
  });

  // === Carousel logic, same as your original setup ===
  block.parentElement.classList.add(...'relative w-full'.split(' '));
  block.parentElement.setAttribute('data-carousel', 'slide');
  block.parentElement.setAttribute('id', uuid);

  const carouselControls = div({
    class: 'relative md:absolute md:bottom-16 flex gap-x-4 items-center space-x-3 z-10 px-4 lg:px-8 xl:pr-10'
  });

  configurePagination(carouselControls, slidesData.length);
  configureNavigation(carouselControls);
  block.parentElement.append(div({ class: 'carousel-controls relative max-w-7xl mx-auto' }, carouselControls));

  setTimeout(() => {
    new Carousel({
      wrapperEl: uuid,
      mainEl: '.carousel',
      delay: SLIDE_DELAY,
      previousElAction: 'button[data-carousel-prev]',
      nextElAction: 'button[data-carousel-next]',
      isAutoPlay: true,
      copyChild: 1,
      onChange: (elPosition) => {
        const currentSlide = elPosition.target.getAttribute('data-carousel-item');
        const carouselPaginate = block?.parentElement?.querySelector('.carousel-paginate');
        if (carouselPaginate) {
          carouselPaginate.innerHTML = `${parseInt(currentSlide, 10)}/${slidesData.length}`;
        }
      },
    });
  }, 500);
}
