import type { Route } from '../types';
import config from '../config/config'

const Content: Route = async (req, ctx) => {
	const { log, env } = ctx;
	log.debug('[AEM Content] handle GET: ', ctx.url.pathname);

	const upstream = `${env.CONTENT_UPSTREAM}${ctx.url.pathname}${ctx.url.search}`;
	log.debug('[AEM Content] upstream: ', upstream);

	const resp = await fetch(upstream);

	let rewriter = new HTMLRewriter()

	for (const selector of Object.keys(config.mapping)) {
		const transformerClass = config.mapping[selector];
		rewriter.on(selector, new transformerClass(ctx))
	}

	return rewriter.transform(resp);
};

export default Content;
