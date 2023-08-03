class Footer implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {
	}
	element(element: Element) {
		console.log('footer', element);
		element.removeAttribute('class')
		  .setAttribute('class', 'footer')
          .setInnerContent('');
	}
}

export default Footer;
