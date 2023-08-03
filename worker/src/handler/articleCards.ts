import { Context } from "../types";

class ArticleCards implements HTMLRewriterElementContentHandlers {
	ctx: Context;
	constructor(ctx) {
		this.ctx = ctx;
	}
	element(element: Element) {
		console.dir(this.ctx.dom.cards)
		const elemHTML = `<div class="cards">\n${this.ctx.dom.cards.join("\n")}\n</div>`;
		element.replace(elemHTML, {html: true});
	}
}

export default ArticleCards;
