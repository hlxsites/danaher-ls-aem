import {
    div,
    span,
    img,
    p,
  } from "../../scripts/dom-builder.js";
  export default async function decorate(block) {
    const main = document.querySelector('main');
  
    const heading = block.querySelector('[data-aue-prop="content_heading"]')?.textContent || '';
    const subHeading = block.querySelector('[data-aue-prop="content_heading1"]')?.textContent || '';
    const longDescription = block.querySelector('[data-aue-prop="content_heading2"]')?.textContent || '';
    const shortDescription = block.querySelector('[data-aue-prop="content_desc"]')?.textContent || '';
    const button1 = block.querySelector('[data-aue-prop="carousel_button1Text"]')?.textContent || '';
    const button2 = block.querySelector('[data-aue-prop="carousel_button2"]')?.textContent || '';
    const imageEl = block.querySelector('img[data-aue-prop="category_image"]');
    const image = imageEl?.getAttribute('src') || '';
    const alt = imageEl?.getAttribute('alt') || 'category image';
  
    // Clear original content
    block.innerHTML = '';
  
    // Create elements using helper functions
    const categoryBanner = div({
      class: 'category_banner flex flex-col lg:flex-row self-stretch justify-start items-center',
    });
  
    const categoryBannerLeft = div({
      class: 'category_banner-left ml-4 w-80 lg:w-[600px] pt-6 lg:pt-12 flex flex-col justify-start items-start',
    });
  
    const categoryBannerRight = div({
      class: 'category_banner-right mr-4 w-80 lg:w-[600px] relative flex flex-col justify-start items-start',
    });
  
    const categoryBannerTitle = p({
      class: 'text-black text-4xl font-normal leading-[48px]',
    }, heading);
  
    const categoryBannerCta = div({
      class: 'category_banner-cta flex flex-wrap justify-start items-start mb-4 mt-4',
    }, div({
      class: 'px-6 py-3 bg-violet-600 rounded-[30px] shadow-md flex justify-center items-center overflow-hidden',
    }, div({
      class: 'text-white text-base font-normal leading-snug',
    }, subHeading)));
  
    const categoryBannerDescription = div({
      class: 'category_banner-description text-gray-800 text-base font-extralight leading-snug',
    }, longDescription);
  
    const categoryBannerLinks = div({
      class: 'category_banner-links self-stretch flex flex-col mt-4',
    },
      div({ class: 'text-violet-600 text-base font-bold leading-snug' }, button1),
      div({ class: 'text-violet-600 text-base font-bold leading-snug' }, button2)
    );
  
    const categoryBannerIcon = img({
      src: image,
      alt,
      class: 'h-[460px] object-contain',
    });
  
    const categoryBannerDetails = div({
      class: 'category_banner-details w-full justify-start',
    },
      span({
        class: 'text-black text-base font-extralight leading-snug',
      }, shortDescription),
      span({
        class: 'text-violet-600 text-base font-bold leading-snug ml-2',
      }, 'Read More')
    );
  
    // Build DOM structure
    categoryBannerLeft.append(categoryBannerTitle, categoryBannerCta, categoryBannerDescription, categoryBannerLinks);
    categoryBannerRight.append(categoryBannerIcon, categoryBannerDetails);
    categoryBanner.append(categoryBannerLeft, categoryBannerRight);
    block.append(categoryBanner);
  }
  