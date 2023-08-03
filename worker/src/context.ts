import type { Context, Environment } from './types';

const setupEnv = (penv: Partial<Environment>): Environment => {
	const env = penv as Environment;

	if (process.env.NODE_ENV !== 'development') {
		return env;
	}

	return env;
};

export default function setupContext(request: Request, env: Partial<Environment>): Context {
	const ctx: Context = {
		log: console,
		env: setupEnv(env),
		url: new URL(request.url),
		rewriter: new HTMLRewriter(),
		dom: {
			cards: []
		}
	};
	return ctx;
}
