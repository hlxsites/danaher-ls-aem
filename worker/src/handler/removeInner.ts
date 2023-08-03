class RemoveInner implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {
	}
	element(element: Element) {
        element.setInnerContent('');
	}
}

export default RemoveInner;
