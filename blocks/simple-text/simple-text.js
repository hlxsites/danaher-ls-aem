import {
    div, p,img,a,h2,span
  } from '../../scripts/dom-builder.js';
export default function decorate(block) {
    // Function to build div elements
    function div({ class: className, ...attributes }, ...children) {
      const element = document.createElement('div');
      if (className) element.className = className;
      Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));
      children.forEach(child => {
        if (typeof child === 'string') {
          element.textContent = child;
        } else {
          element.appendChild(child);
        }
      });
      return element;
    }
  
    // Create the left side div with normal text
    const leftSide = div(
      { class: 'w-1/2 p-4' },  // Tailwind for width and padding
      'This is the left side with normal text.'
    );
  
    // Create the right side div with bold text
    const rightSide = div(
      { class: 'w-1/2 p-4 font-bold' },  // Tailwind for bold text and padding
      'This is the right side with bold text.'
    );
  
    // Create the parent container div with flex
    const container = div(
      { class: 'flex' },  // Tailwind for flex container
      leftSide,
      rightSide
    );
  
    // Append the container to the block element
    block.appendChild(container);
  }
  