class CustomTagToClassDiv implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {
	}
	element(element: Element) {
		const appendOpts = { html: true };
		element.removeAndKeepContent()
			.prepend(`<div class="${element.getAttribute('class')}">`, appendOpts)
			.append('</div>', appendOpts);

	}
}

export default CustomTagToClassDiv;
