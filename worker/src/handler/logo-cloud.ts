const decodeHtmlEntity = (x: string): string => {
	return x.replace(/&#(\d+);/g, function (match, dec) {
		return String.fromCharCode(dec);
	});
};

class LogoCloud implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {
		this.log = ctx.log;
	}
	element(element: Element) {
		this.log.debug(element);

		const content = 'MH - Logo Cloud Content goes here';
		
		const logoJson = JSON.parse(decodeHtmlEntity(element.getAttribute('logos')));
		const logos = logoJson.map((logo) => {
			return `<li><a href="${logo.imageLink}"><img src="${logo.image}" alt="${logo.imageAlt}"/></a></li>`
		})

		const test = `<div class="logo-cloud"><div><div>${content}</div></div><div><div>${logos.join(' ')}</div></div></div>`;

		element.replace(test, { html: true });
	}
}

export default LogoCloud;
