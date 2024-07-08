export function sampleRUM(checkpoint,data={}){sampleRUM.defer=sampleRUM.defer||[];const defer=fnname=>{sampleRUM[fnname]=sampleRUM[fnname]||((...args)=>sampleRUM.defer.push({fnname:fnname,args:args}))};sampleRUM.drain=sampleRUM.drain||((dfnname,fn)=>{sampleRUM[dfnname]=fn;sampleRUM.defer.filter((({fnname:fnname})=>dfnname===fnname)).forEach((({fnname:fnname,args:args})=>sampleRUM[fnname](...args)))});sampleRUM.always=sampleRUM.always||[];sampleRUM.always.on=(chkpnt,fn)=>{sampleRUM.always[chkpnt]=fn};sampleRUM.on=(chkpnt,fn)=>{sampleRUM.cases[chkpnt]=fn};defer("observe");defer("cwv");try{window.hlx=window.hlx||{};if(!window.hlx.rum){const usp=new URLSearchParams(window.location.search);const weight=usp.get("rum")==="on"?1:20;const id=Array.from({length:75},((_,i)=>String.fromCharCode(48+i))).filter((a=>/\d|[A-Z]/i.test(a))).filter((()=>Math.random()*75>70)).join("");const random=Math.random();const isSelected=random*weight<1;const firstReadTime=Date.now();const urlSanitizers={full:()=>window.location.href,origin:()=>window.location.origin,path:()=>window.location.href.replace(/\?.*$/,"")};window.hlx.rum={weight:weight,id:id,random:random,isSelected:isSelected,firstReadTime:firstReadTime,sampleRUM:sampleRUM,sanitizeURL:urlSanitizers[window.hlx.RUM_MASK_URL||"path"]}}const{weight:weight,id:id,firstReadTime:firstReadTime}=window.hlx.rum;if(window.hlx&&window.hlx.rum&&window.hlx.rum.isSelected){const knownProperties=["weight","id","referer","checkpoint","t","source","target","cwv","CLS","FID","LCP","INP"];const sendPing=(pdata=data)=>{const body=JSON.stringify({weight:weight,id:id,referer:window.hlx.rum.sanitizeURL(),checkpoint:checkpoint,t:Date.now()-firstReadTime,...data},knownProperties);const url=`https://rum.hlx.page/.rum/${weight}`;navigator.sendBeacon(url,body);console.debug(`ping:${checkpoint}`,pdata)};sampleRUM.cases=sampleRUM.cases||{cwv:()=>sampleRUM.cwv(data)||true,lazy:()=>{const script=document.createElement("script");script.src="https://rum.hlx.page/.rum/@adobe/helix-rum-enhancer@^1/src/index.js";document.head.appendChild(script);return true}};sendPing(data);if(sampleRUM.cases[checkpoint]){sampleRUM.cases[checkpoint]()}}if(sampleRUM.always[checkpoint]){sampleRUM.always[checkpoint](data)}}catch(error){}}export async function loadCSS(href){return new Promise(((resolve,reject)=>{if(!document.querySelector(`head > link[href="${href}"]`)){const link=document.createElement("link");link.rel="stylesheet";link.href=href;link.onload=resolve;link.onerror=reject;document.head.append(link)}else{resolve()}}))}export async function loadScript(src,attrs){return new Promise(((resolve,reject)=>{if(!document.querySelector(`head > script[src="${src}"]`)){const script=document.createElement("script");script.src=src;if(attrs){for(const attr in attrs){script.setAttribute(attr,attrs[attr])}}script.onload=resolve;script.onerror=reject;document.head.append(script)}else{resolve()}}))}export function getMetadata(name){const attr=name&&name.includes(":")?"property":"name";const meta=[...document.head.querySelectorAll(`meta[${attr}="${name}" i]`)].map((m=>m.content)).join(", ");return meta||""}export function toClassName(name){return typeof name==="string"?name.toLowerCase().replace(/[^0-9a-z]/gi,"-").replace(/-+/g,"-").replace(/^-|-$/g,""):""}export function toCamelCase(name){return toClassName(name).replace(/-([a-z])/g,(g=>g[1].toUpperCase()))}export function getAllMetadata(scope){return[...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)].reduce(((res,meta)=>{const id=toClassName(meta.name?meta.name.substring(scope.length+1):meta.getAttribute("property").split(":")[1]);res[id]=meta.getAttribute("content");return res}),{})}const ICONS_CACHE={};export async function decorateIcons(element){let svgSprite=document.getElementById("franklin-svg-sprite");if(!svgSprite){const div=document.createElement("div");div.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';svgSprite=div.firstElementChild;document.body.append(div.firstElementChild)}const icons=[...element.querySelectorAll("span.icon")];await Promise.all(icons.map((async span=>{const iconName=Array.from(span.classList).find((c=>c.startsWith("icon-"))).substring(5);if(!ICONS_CACHE[iconName]){ICONS_CACHE[iconName]=true;try{let iconSource=`${window.hlx.codeBasePath}/icons/${iconName}.svg`;if(iconName.startsWith("dam-")){const isPublicDomain=window.location.hostname.includes("lifesciences.danaher.com");iconSource=isPublicDomain?"":"https://lifesciences.danaher.com";iconSource+=`/content/dam/danaher/system/icons/${iconName.substring(4).replace("_"," ")}.svg`}const response=await fetch(iconSource);if(!response.ok){ICONS_CACHE[iconName]=false;return}const svg=await response.text();if(svg.match(/(<style | class=)/)){ICONS_CACHE[iconName]={styled:true,html:svg}}else{ICONS_CACHE[iconName]={html:svg.replace("<svg",`<symbol id="icons-sprite-${iconName}"`).replace(/ width=".*?"/,"").replace(/ height=".*?"/,"").replace("</svg>","</symbol>")}}}catch(error){ICONS_CACHE[iconName]=false;console.error(error)}}})));const symbols=Object.keys(ICONS_CACHE).filter((k=>!svgSprite.querySelector(`#icons-sprite-${k}`))).map((k=>ICONS_CACHE[k])).filter((v=>!v.styled)).map((v=>v.html)).join("\n");svgSprite.innerHTML+=symbols;icons.forEach((span=>{const iconName=Array.from(span.classList).find((c=>c.startsWith("icon-"))).substring(5);const parent=span.firstElementChild?.tagName==="A"?span.firstElementChild:span;if(ICONS_CACHE[iconName].styled){parent.innerHTML=ICONS_CACHE[iconName].html}else{parent.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg"><use href="#icons-sprite-${iconName}"/></svg>`}}))}export async function fetchPlaceholders(prefix="default"){window.placeholders=window.placeholders||{};const loaded=window.placeholders[`${prefix}-loaded`];if(!loaded){window.placeholders[`${prefix}-loaded`]=new Promise(((resolve,reject)=>{fetch(`${prefix==="default"?"":prefix}/placeholders.json`).then((resp=>{if(resp.ok){return resp.json()}throw new Error(`${resp.status}: ${resp.statusText}`)})).then((json=>{const placeholders={};json.data.filter((placeholder=>placeholder.Key)).forEach((placeholder=>{placeholders[toCamelCase(placeholder.Key)]=placeholder.Text}));window.placeholders[prefix]=placeholders;resolve()})).catch((error=>{window.placeholders[prefix]={};reject(error)}))}))}await window.placeholders[`${prefix}-loaded`];return window.placeholders[prefix]}export function decorateBlock(block){const shortBlockName=block.classList[0];if(shortBlockName){block.classList.add("block");block.dataset.blockName=shortBlockName;block.dataset.blockStatus="initialized";const blockWrapper=block.parentElement;blockWrapper.classList.add(`${shortBlockName}-wrapper`);const section=block.closest(".section");if(section)section.classList.add(`${shortBlockName}-container`)}}export function readBlockConfig(block){const config={};block.querySelectorAll(":scope > div").forEach((row=>{if(row.children){const cols=[...row.children];if(cols[1]){const col=cols[1];const name=toClassName(cols[0].textContent);let value="";if(col.querySelector("a")){const as=[...col.querySelectorAll("a")];if(as.length===1){value=as[0].href}else{value=as.map((a=>a.href))}}else if(col.querySelector("img")){const imgs=[...col.querySelectorAll("img")];if(imgs.length===1){value=imgs[0].src}else{value=imgs.map((img=>img.src))}}else if(col.querySelector("p")){const ps=[...col.querySelectorAll("p")];if(ps.length===1){value=ps[0].textContent}else{value=ps.map((p=>p.textContent))}}else value=row.children[1].textContent;config[name]=value}}}));return config}export function decorateSections(main){main.querySelectorAll(":scope > div").forEach((section=>{const wrappers=[];let defaultContent=false;[...section.children].forEach((e=>{if(e.tagName==="DIV"||!defaultContent){const wrapper=document.createElement("div");wrappers.push(wrapper);defaultContent=e.tagName!=="DIV";if(defaultContent)wrapper.classList.add("default-content-wrapper")}wrappers[wrappers.length-1].append(e)}));wrappers.forEach((wrapper=>section.append(wrapper)));section.classList.add("section");section.dataset.sectionStatus="initialized";section.style.display="none";const sectionMeta=section.querySelector("div.section-metadata");if(sectionMeta){const meta=readBlockConfig(sectionMeta);Object.keys(meta).forEach((key=>{if(key==="style"){const styles=meta.style.split(",").map((style=>toClassName(style.trim())));styles.forEach((style=>section.classList.add(style)))}else{section.dataset[toCamelCase(key)]=meta[key]}}));sectionMeta.parentNode.remove()}}))}export function updateSectionsStatus(main){const sections=[...main.querySelectorAll(":scope > div.section")];for(let i=0;i<sections.length;i+=1){const section=sections[i];const status=section.dataset.sectionStatus;if(status!=="loaded"){const loadingBlock=section.querySelector('.block[data-block-status="initialized"], .block[data-block-status="loading"]');if(loadingBlock){section.dataset.sectionStatus="loading";break}else{section.dataset.sectionStatus="loaded";section.style.display=null}}}}export function decorateBlocks(main){main.querySelectorAll("div.section > div > div").forEach(decorateBlock)}export function buildBlock(blockName,content){const table=Array.isArray(content)?content:[[content]];const blockEl=document.createElement("div");blockEl.classList.add(blockName);table.forEach((row=>{const rowEl=document.createElement("div");row.forEach((col=>{const colEl=document.createElement("div");const vals=col.elems?col.elems:[col];vals.forEach((val=>{if(val){if(typeof val==="string"){colEl.innerHTML+=val}else{colEl.appendChild(val)}}}));rowEl.appendChild(colEl)}));blockEl.appendChild(rowEl)}));return blockEl}async function loadModule(name,jsPath,cssPath,...args){const cssLoaded=cssPath?loadCSS(cssPath):Promise.resolve();const decorationComplete=jsPath?new Promise((resolve=>{(async()=>{let mod;try{mod=await import(jsPath);if(mod.default){await mod.default.apply(null,args)}}catch(error){console.log(`failed to load module for ${name}`,error)}resolve(mod)})()})):Promise.resolve();return Promise.all([cssLoaded,decorationComplete]).then((([,api])=>api))}function getBlockConfig(block){const{blockName:blockName}=block.dataset;const jsPath=blockName?`${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.js`:"";const cssPath=blockName?`${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.css`:"";const original={blockName:blockName,jsPath:jsPath};return(window.hlx.patchBlockConfig||[]).filter((fn=>typeof fn==="function")).reduce(((config,fn)=>fn(config,original)),{blockName:blockName,jsPath:jsPath,cssPath:cssPath})}const cssExpectionalBlocks=[];export async function loadBlock(block){const status=block.dataset.blockStatus;if(status!=="loading"&&status!=="loaded"){block.dataset.blockStatus="loading";const{blockName:blockName,jsPath:jsPath,cssPath:cssPath}=getBlockConfig(block);try{if(cssExpectionalBlocks.includes(blockName)){await loadModule(blockName,jsPath,undefined,block)}else{await loadModule(blockName,jsPath,cssPath,block)}}catch(error){console.log(`failed to load block ${blockName}`,error)}block.dataset.blockStatus="loaded"}}export async function loadBlocks(main){updateSectionsStatus(main);const blocks=[...main.querySelectorAll("div.block")];for(let i=0;i<blocks.length;i+=1){await loadBlock(blocks[i]);updateSectionsStatus(main)}}export function createOptimizedPicture(src,alt="",eager=false,breakpoints=[{media:"(min-width: 600px)",width:"2000"},{width:"750"}]){const url=new URL(src,window.location.href);const picture=document.createElement("picture");const{pathname:pathname}=url;const ext=pathname.substring(pathname.lastIndexOf(".")+1);breakpoints.forEach((br=>{const source=document.createElement("source");if(br.media)source.setAttribute("media",br.media);source.setAttribute("type","image/webp");source.setAttribute("srcset",`${pathname}?width=${br.width}&format=webply&optimize=medium`);picture.appendChild(source)}));breakpoints.forEach(((br,i)=>{if(i<breakpoints.length-1){const source=document.createElement("source");if(br.media)source.setAttribute("media",br.media);source.setAttribute("srcset",`${pathname}?width=${br.width}&format=${ext}&optimize=medium`);picture.appendChild(source)}else{const img=document.createElement("img");img.setAttribute("loading",eager?"eager":"lazy");img.setAttribute("alt",alt);picture.appendChild(img);img.setAttribute("src",`${pathname}?width=${br.width}&format=${ext}&optimize=medium`)}}));return picture}export function normalizeHeadings(el,allowedHeadings){const allowed=allowedHeadings.map((h=>h.toLowerCase()));el.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((tag=>{const h=tag.tagName.toLowerCase();if(allowed.indexOf(h)===-1){let level=parseInt(h.charAt(1),10)-1;while(allowed.indexOf(`h${level}`)===-1&&level>0){level-=1}if(level===0){while(allowed.indexOf(`h${level}`)===-1&&level<7){level+=1}}if(level!==7){tag.outerHTML=`<h${level} id="${tag.id}">${tag.textContent}</h${level}>`}}}))}export function decorateTemplateAndTheme(){const addClasses=(element,classes)=>{classes.split(",").forEach((c=>{element.classList.add(toClassName(c.trim()))}))};const template=getMetadata("template");if(template)addClasses(document.body,template);const theme=getMetadata("theme");if(theme)addClasses(document.body,theme)}export function decorateButtons(element){element.querySelectorAll("a").forEach((a=>{a.title=a.title||a.textContent;if(a.href!==a.textContent&&a.title!=="link"){const up=a.parentElement;const twoup=a.parentElement.parentElement;if(!a.querySelector("img")&&twoup.tagName!=="LI"&&!a.closest(".call-to-action")&&!a.closest(".mini-teasers")&&!a.closest(".bg-color-right")){if(up.childNodes.length===1&&(up.tagName==="P"||up.tagName==="DIV")){a.className="btn btn-outline-primary";up.classList.add("button-container")}if(up.childNodes.length===1&&up.tagName==="STRONG"&&twoup.childNodes.length===1&&twoup.tagName==="P"){a.className="btn btn-outline-primary";twoup.classList.add("button-container")}if(up.childNodes.length===1&&up.tagName==="EM"&&twoup.childNodes.length===1&&twoup.tagName==="P"){a.className="btn btn-outline-secondary";twoup.classList.add("button-container")}}}}))}export async function waitForLCP(lcpBlocks){const block=document.querySelector("main .block");const hasLCPBlock=block&&lcpBlocks.includes(block.dataset.blockName);if(hasLCPBlock)await loadBlock(block);document.body.style.display=null;const lcpCandidate=document.querySelector("main img");await new Promise((resolve=>{if(lcpCandidate&&!lcpCandidate.complete){lcpCandidate.setAttribute("loading","eager");lcpCandidate.addEventListener("load",resolve);lcpCandidate.addEventListener("error",resolve)}else{resolve()}}))}export function loadHeader(header){const headerBlock=buildBlock("header","");header.append(headerBlock);decorateBlock(headerBlock);return loadBlock(headerBlock)}export function loadFooter(footer){const footerBlock=buildBlock("footer","");footer.append(footerBlock);decorateBlock(footerBlock);return loadBlock(footerBlock)}function parsePluginParams(id,config){const pluginId=!config?id.split("/").splice(id.endsWith("/")?-2:-1,1)[0].replace(/\.js/,""):id;const pluginConfig={load:"eager",...typeof config==="string"||!config?{url:(config||id).replace(/\/$/,"")}:config};pluginConfig.options||={};return{id:pluginId,config:pluginConfig}}export const executionContext={createOptimizedPicture:createOptimizedPicture,getAllMetadata:getAllMetadata,getMetadata:getMetadata,decorateBlock:decorateBlock,decorateButtons:decorateButtons,decorateIcons:decorateIcons,loadBlock:loadBlock,loadCSS:loadCSS,loadScript:loadScript,sampleRUM:sampleRUM,toCamelCase:toCamelCase,toClassName:toClassName};class PluginsRegistry{#plugins;constructor(){this.#plugins=new Map}add(id,config){const{id:pluginId,config:pluginConfig}=parsePluginParams(id,config);this.#plugins.set(pluginId,pluginConfig)}get(id){return this.#plugins.get(id)}includes(id){return!!this.#plugins.has(id)}async load(phase){[...this.#plugins.entries()].filter((([,plugin])=>plugin.condition&&!plugin.condition(document,plugin.options,executionContext))).map((([id])=>this.#plugins.delete(id)));return Promise.all([...this.#plugins.entries()].filter((([,plugin])=>(!plugin.condition||plugin.condition(document,plugin.options,executionContext))&&phase===plugin.load&&plugin.url)).map((async([key,plugin])=>{try{const pluginApi=await loadModule(key,!plugin.url.endsWith(".js")?`${plugin.url}/${key}.js`:plugin.url,!plugin.url.endsWith(".js")?`${plugin.url}/${key}.css`:null,document,plugin.options,executionContext)||{};this.#plugins.set(key,{...plugin,...pluginApi})}catch(err){console.error("Could not load specified plugin",key)}})))}async run(phase){return[...this.#plugins.values()].reduce(((promise,plugin)=>plugin[phase]&&(!plugin.condition||plugin.condition(document,plugin.options,executionContext))?promise.then((()=>plugin[phase](document,plugin.options,executionContext))):promise),Promise.resolve())}}class TemplatesRegistry{add(id,url){if(Array.isArray(id)){id.forEach((i=>window.hlx.templates.add(i)));return}const{id:templateId,config:templateConfig}=parsePluginParams(id,url);templateConfig.condition=()=>toClassName(getMetadata("template"))===templateId;window.hlx.plugins.add(templateId,templateConfig)}get(id){return window.hlx.plugins.get(id)}includes(id){return window.hlx.plugins.includes(id)}}export function setup(){window.hlx=window.hlx||{};window.hlx.RUM_MASK_URL="full";window.hlx.codeBasePath="";window.hlx.lighthouse=new URLSearchParams(window.location.search).get("lighthouse")==="on";window.hlx.patchBlockConfig=[];window.hlx.plugins=new PluginsRegistry;window.hlx.templates=new TemplatesRegistry;const scriptEl=document.querySelector('script[src$="/scripts/scripts.js"]');if(scriptEl){try{const scriptURL=new URL(scriptEl.src,window.location);if(scriptURL.host===window.location.host){[window.hlx.codeBasePath]=scriptURL.pathname.split("/scripts/scripts.js")}else{[window.hlx.codeBasePath]=scriptURL.href.split("/scripts/scripts.js")}}catch(error){console.log(error)}}}function init(){setup();sampleRUM("top");window.addEventListener("load",(()=>sampleRUM("load")));window.addEventListener("unhandledrejection",(event=>{sampleRUM("error",{source:event.reason.sourceURL,target:event.reason.line})}));window.addEventListener("error",(event=>{sampleRUM("error",{source:event.filename,target:event.lineno})}))}init();