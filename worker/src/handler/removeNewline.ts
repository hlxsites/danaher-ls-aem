class RemoveNewline implements HTMLRewriterElementContentHandlers {
	opts: { enclose?: boolean; };
	constructor(ctx, opts?) {
		this.opts = opts || {};
	}
	text(text: Text) {
		text.replace(text.text.replace(/\n/igm, '')).replace(text.text.replace(/\s\s/igm, ''));
	}
}

export default RemoveNewline;
