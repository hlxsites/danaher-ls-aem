class FullLayout implements HTMLRewriterElementContentHandlers {
	opts: { enclose?: boolean; };
	constructor(ctx, opts?) {
		this.opts = opts || {};
	}
	element(element: Element) {
		const appendOpts = { html: true };

		element
			.removeAndKeepContent()
			.prepend(`<div class="fulllayout">`, appendOpts)
			.append('</div>', appendOpts);
	}
}

export default FullLayout;
