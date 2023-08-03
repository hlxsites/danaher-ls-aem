class Wesee implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {}
	element(element: Element) {
        element
		.replace(`<div class="wesee"></div>`, {html: true});
	}
}

export default Wesee;
