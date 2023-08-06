import type { Route } from '../types';

const Ping: Route = async (req, ctx) => {
	const { log } = ctx;
	log.debug('[Ping] handle GET: ', ctx.url.pathname);

	const data = {
		api: 'ping',
	};

	const json = JSON.stringify(data, null, 2);

	return new Response(json, {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	});
};

export default Ping;
