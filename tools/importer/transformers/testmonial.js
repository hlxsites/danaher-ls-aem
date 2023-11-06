import { testimonial } from './util.js';

const createTestimonial = (main, document) => {
  const testimonials = main.querySelectorAll('div.testimonial');
  [...testimonials].forEach((testimonialEl) => {
    testimonial(testimonialEl, document);
  });
};
export default createTestimonial;
