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
      { class: 'text-lg w-1/2 p-4 font-bold' },  // Tailwind for width and padding
      'We see a way to reduce over 60% of manual process steps through system intelligence during advanced imagingWorkflows.'
    );
  
    // Create the right side div with bold text
    const rightSide = div(
      { class: 'w-1/2 p-4 ' },  // Tailwind for bold text and padding
      'By pushing the limits of resoulution, speed and ease, Leica Microsystems enables scientists to gain new INSIGHTS beyond what has been possible and visible before. This advances scientific duscovery and understanding to protect our health.'
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
  