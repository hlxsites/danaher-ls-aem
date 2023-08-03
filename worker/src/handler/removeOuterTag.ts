class RemoveOuterTag implements HTMLRewriterElementContentHandlers {
	opts: { enclose?: boolean; };
	constructor(ctx, opts?) {
		this.opts = opts || {};
	}
	element(element: Element) {
		const appendOpts = { html: true };
		element.removeAndKeepContent()
		
		if (this.opts.enclose) {
			element.prepend(`<div class="coverted-from:${element.tagName}">`, appendOpts)
				.append('</div>', appendOpts);
		}
	}
}

export default RemoveOuterTag;
