class Section implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {
	}
	element(element: Element) {
		const appendOpts = { html: true };
		element.setAttribute('class', `section`)
	}
}

export default Section;
