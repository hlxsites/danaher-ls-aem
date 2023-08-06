export interface Environment {
	NODE_ENV: 'development' | undefined;
	CONTENT_UPSTREAM: string;
	BASE_PATH?: string;
	[key: string]: string;
  }

export interface Context {
	log: Console;
	env: Environment;
	url: URL;
	rewriter: HTMLRewriter;
	dom: {
		cards: any[];
	};
}

export type Route = (
	req: Request,
	ctx: Context
) => Promise<Response | undefined | void> | Response | undefined | void;
