class HeroVideo implements HTMLRewriterElementContentHandlers {
	constructor(ctx) {}
	element(element: Element) {
		const percentage = element.getAttribute('percentage');
		const btntextt = element.getAttribute('btntextt');
		const videoid = element.getAttribute('videoid');
		const description = element.getAttribute('description');
		const title = element.getAttribute('title');
		const imagealt = element.getAttribute('imagealt');
		const videoElemHTML = `<a href="https://player.vimeo.com/video/${videoid}?loop=1&app_id=122963">https://player.vimeo.com/video/${videoid}?loop=1&app_id=122963</a>`
		const heroElemHTML = `<div class="hero">
  <div>
    ${videoElemHTML}
  </div>
</div>`;
        element
		.replace(heroElemHTML, {html: true});
	}
}

export default HeroVideo;
