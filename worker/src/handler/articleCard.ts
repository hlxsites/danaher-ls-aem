import { Context } from "../types";

class ArticleCard implements HTMLRewriterElementContentHandlers {
	ctx: Context;
	constructor(ctx) {
		this.ctx = ctx;
	}
	element(element: Element) {
		const cardhref = element.getAttribute('cardhref');
		const cardimg = element.getAttribute('cardimg');
		const isusedamasset = element.getAttribute('isusedamasset');
		const cardtitle = element.getAttribute('cardtitle');
		const cardcategory = element.getAttribute('cardcategory');
		const carddescription = element.getAttribute('carddescription');
        const linktext = element.getAttribute('linktext');

		const elemHTML = `
<div>
  <div>
    <h1>${cardtitle}</h1>
    <h3>${cardcategory || 'Uncategorized'}</h3>
    <p>${carddescription}</p>
    <img src="${cardimg}" />
    <a href="${cardhref}">${linktext}</a>
  </div>
</div>
		`;

        element.replace(elemHTML, {html: true});
		
		this.ctx.dom.cards.push(elemHTML);
	}
}

export default ArticleCard;
