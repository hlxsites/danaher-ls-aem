class AttributesRemover implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {}
	element(element: Element) {
		element.removeAttribute('id');
		for (const [attrName] of element.attributes) {
            element.removeAttribute(attrName);
        }
	}
}

export default AttributesRemover;
