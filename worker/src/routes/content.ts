import LogoCloud from '../handler/logo-cloud';
import Remover from '../handler/remover';
import RemoveInner from '../handler/removeInner';
import type { Route } from '../types';
import RemoveOuterTag from '../handler/removeOuterTag';
import HeroVideo from '../handler/heroVideo';
import ArticleCard from '../handler/articleCard';
import ArticleCards from '../handler/articleCards';
import Footer from '../handler/footer';
import Wesee from '../handler/wesee';
import RemoveNewline from '../handler/removeNewline';
import FullLayout from '../handler/fullLayout';
import CustomTagToClassDiv from '../handler/customTagToClassDiv';

const Content: Route = async (req, ctx) => {
	const { log, env } = ctx;
	log.debug('[AEM Content] handle GET: ', ctx.url.pathname);

	const upstream = `${env.CONTENT_UPSTREAM}${ctx.url.pathname}${ctx.url.search}`;
	log.debug('[AEM Content] upstream: ', upstream);

	const resp = await fetch(upstream);

	return new HTMLRewriter()
	.on('*', new RemoveNewline(ctx))
	.on('head', new RemoveInner(ctx))
	.on('script', new Remover(ctx))
	.on('header', new RemoveInner(ctx))
    .on('logo-cloud', new LogoCloud(ctx))
    .on('.footer.experiencefragment', new Footer(ctx))
    .on('.cloudservice.testandtarget', new Remover(ctx))
	.on('.logo-cloud', new RemoveOuterTag(ctx))
	.on('herovideoplayer', new HeroVideo(ctx))
	.on('.articlecard', new RemoveOuterTag(ctx))
	.on('articlecard', new ArticleCard(ctx))
	.on('.bg-danaherlightblue-50', new CustomTagToClassDiv(ctx))
	.on('grid', new ArticleCards(ctx))
	.on('.grid', new RemoveOuterTag(ctx))
	.on('.aem-Grid', new RemoveOuterTag(ctx))
	.on('.aem-GridColumn', new RemoveOuterTag(ctx))
	.on('fulllayout', new FullLayout(ctx))
	.on('.root.responsivegrid', new RemoveOuterTag(ctx))
	.on('#danaher', new RemoveOuterTag(ctx))
	.on('wesee', new Wesee(ctx))
	.transform(resp);
};

export default Content;
