class Remover implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {}
	element(element: Element) {
		element.remove();
	}
}

export default Remover;
