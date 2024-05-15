import{sampleRUM,loadHeader,loadFooter,decorateButtons,decorateIcons,decorateSections,decorateBlocks,decorateTemplateAndTheme,waitForLCP,loadBlocks,loadCSS,toClassName,getMetadata,createOptimizedPicture,loadBlock,decorateBlock}from"./lib-franklin.js";import{div,domEl,img}from"./dom-builder.js";const LCP_BLOCKS=["breadcrumb","product-hero","carousel"],TEMPLATE_LIST={blog:"blog",news:"blog",productdetail:"productDetail",processstep:"processstep",topic:"topic",library:"library",info:"library"};function imageHelper(e,t,a=!1){return-1<e.indexOf(".scene7.com")?img({src:""+e,alt:t,loading:a?"eager":"lazy",class:"mb-2 h-48 w-full object-cover"}):((e=createOptimizedPicture(e,t,a,[{width:"500"}])).querySelector("img").className="mb-2 h-48 w-full object-cover",e)}function createOptimizedS7Picture(e,t="",a=!1){var o;return e.startsWith("/is/image")||-1<e.indexOf(".scene7.com")?((o=document.createElement("picture")).appendChild(img({src:e+"?$danaher-mobile$",alt:t,loading:a?"eager":"lazy"})),o):img({src:e,alt:t,loading:a?"eager":"lazy"})}function formatDateUTCSeconds(e,t={}){var a=new Date(0);return a.setUTCSeconds(e),a.toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric",...t})}function generateUUID(){return Math.floor(1e3+9e3*Math.random())}let originalOffset=0;function scrollJumpMenuFixed(e){var t;originalOffset||(t=e.getBoundingClientRect(),originalOffset=t.top),window.scrollY>originalOffset?(e.classList.add(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" ")),document.querySelector(".page-jump-menu-container.fixed ul")?.classList.add("shadow-none","rounded-none"),document.querySelectorAll(".page-jump-menu-container.fixed ul li")?.forEach(e=>{e?.firstElementChild?.classList.add("rounded-full"),e?.firstElementChild?.querySelector("span.icon svg use")?.classList.add("stroke-danaherpurple-500")}),document.querySelector('.page-jump-menu-container.fixed li[aria-selected="true"] a span.icon svg')?.classList.add("stroke-white"),e.classList.remove(..."[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" "))):(e.classList.remove(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-jump-menu-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" ")),document.querySelectorAll(".page-jump-menu-container ul li")?.forEach(e=>e?.firstElementChild?.classList.remove("rounded-full")),e.classList.add(..."[&_.page-jump-menu-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" ")))}let pageTabsOriginalOffset=0;function scrollPageTabFixed(e){var t;pageTabsOriginalOffset||(t=e.getBoundingClientRect(),pageTabsOriginalOffset=t.top),window.scrollY>pageTabsOriginalOffset?(e.classList.add(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" ")),e.classList.remove(..."[&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" "))):(e.classList.remove(..."w-full fixed mt-[-1px] bg-white shadow-lg inset-x-0 top-[83px] py-2 z-10 [&_.page-tabs-wrapper]:md:max-w-7xl [&_ul>li>a]:flex-row [&_ul>li>a]:items-center [&_ul>li>a]:h-full [&_li>a>span.icon-chevron-down]:hidden".split(" ")),e.classList.add(..."[&_.page-tabs-wrapper]:md:max-w-max [&_ul]:divide-x [&_ul>li>a]:h-40 [&_ul>li>a]:flex-col [&_ul>li>a]:justify-center".split(" ")))}function makePublicUrl(t){var e=window.location.hostname.includes("lifesciences.danaher.com");try{var a=new URL(t,window.location.origin);return e?a.pathname.endsWith(".html")||(a.pathname+=".html"):a.pathname.endsWith(".html")&&(a.pathname=a.pathname.slice(0,-5)),a.pathname}catch(e){return console.error("Invalid URL:",e),t}}function setJsonLd(e,t){var a=document.head.querySelector(`script[data-name="${t}"]`);a?a.innerHTML=JSON.stringify(e):((a=document.createElement("script")).type="application/ld+json",a.innerHTML=JSON.stringify(e),a.dataset.name=t,document.head.appendChild(a))}function setFavicon(){var e=document.querySelector("link[rel*='icon']")||document.createElement("link");e.type="image/x-icon",e.rel="shortcut icon",e.href=`https://${window.location.hostname}/favicon.ico`,document.getElementsByTagName("head")[0].appendChild(e)}async function getFragmentFromFile(e){var t=await fetch(e);return t.ok?await t.text()||(console.error("fragment details empty",e),null):(console.error("error loading fragment details",t),null)}function getCookie(e){let t=decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(/[\\-\\.\\+\\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null;if(t&&("{"===t.substring(0,1)&&"}"===t.substring(t.length-1,t.length)||"["===t.substring(0,1)&&"]"===t.substring(t.length-1,t.length)))try{t=JSON.parse(t)}catch(e){}return t}function isOTEnabled(){var e=getCookie("OptanonConsent");return"string"!=typeof e||e.includes("C0002:1")}function setCookie(e,t,a=2592e6,o="/"){var n=new Date,a=(n.setTime(n.getTime()+a),"expires=".concat(n.toGMTString())),n=e.concat("=").concat(t).concat(";").concat(a).concat(";path=").concat(o);document.cookie=n}async function buildVideo(e){e=e.querySelectorAll('a[href*="youtube.com"],a[href*="vimeo.com"],a[href*="vidyard.com"]');if(0<e.length){const t=(await import("../blocks/embed/embed.js"))["default"];e.forEach(e=>{null==e.closest(".embed, .hero")&&t(e.parentNode)})}}async function loadFonts(){await loadCSS(window.hlx.codeBasePath+"/styles/fonts.css");try{window.location.hostname.includes("localhost")||sessionStorage.setItem("fonts-loaded","true")}catch(e){}}function buildAutoBlocks(e){try{buildVideo(e)}catch(e){console.error("Auto Blocking failed",e)}}function decorateModals(e){const t=e.querySelector(".show-modal-btn"),a=()=>t.getAttribute("data-dialog-message")?t.getAttribute("dialog-message"):"";t?.addEventListener("click",async e=>{e.preventDefault();e=(await import("./modal.js")).default;(await e("custom-modal",a,e=>{e.querySelector('p[name="close"]')?.addEventListener("click",()=>e.close())})).showModal()})}function decorateTwoColumnSection(e){e.querySelectorAll(".section.container-two-col").forEach(o=>{o.querySelectorAll(":scope > .default-content-wrapper").forEach(e=>{[...e.children].forEach(e=>{o.appendChild(e)});let t=e.nextSibling;for(var a=[];t;)t.className.includes("-wrapper")&&a.push(t),t=t.nextSibling;o.append(...a),o.removeChild(e)});const t=div();let a=null;[...o.children].forEach(e=>{"H1"===e.tagName&&(t.appendChild(div({class:"col-left lg:w-1/3 xl:w-1/4 pt-4"})),a=div({class:"col-right w-full mt-0 md:mt-4 lg:mt-0 lg:w-2/3 xl:w-3/4 pt-6 pb-0 md:pb-10"}));e=e.cloneNode(!0);"H2"===e.tagName&&e.querySelector(":scope > strong")?(a?.classList.contains("col-right")&&t.appendChild(a),e.className="text-gray-900 text-base leading-6 font-bold pt-6 pb-4 my-0",t.appendChild(div({class:"col-left lg:w-1/3 xl:w-1/4 pt-4"},e,domEl("hr",{style:"height: 10px; width: 54px; border-width: 0px; color: rgb(216, 244, 250); background-color: rgb(216, 244, 250);"}))),a=div({class:"col-right w-full mt-4 lg:mt-0 lg:w-2/3 xl:w-3/4 pt-6 pb-10"})):a?.classList.contains("col-right")&&a.appendChild(e)}),a&&t.appendChild(a),t.classList.add("w-full","flex","flex-wrap","break-normal"),o.innerHTML=t.outerHTML,o.classList.add("mx-auto","w-full","flex","flex-wrap","mb-5")})}function updateExternalLinks(r){const i=[window.location.origin];r.querySelectorAll("a[href]").forEach(t=>{try{var{origin:e,pathname:a,hash:o}=new URL(t.href,window.location.href),n=o&&o.startsWith("#_"),l="pdf"===a.split(".").pop();e&&e!==window.location.origin&&!n||l?(t.setAttribute("target","_blank"),i.includes(e)||t.setAttribute("rel","noopener")):n&&(t.setAttribute("target",o.replace("#","")),t.href=t.href.replace(o,""))}catch(e){console.warn(`Invalid link in ${r}: `+t.href)}})}function lazyLoadHiddenPageNavTabs(e,t){var a=window.location.hash;const n=a?a.substring(1,a.length).toLowerCase():t;e.forEach(t=>{if(!t.className.includes("breadcrumb-container")&&t.getAttribute("aria-labelledby")!==n){t.querySelectorAll(".block").forEach(e=>{e.setAttribute("data-block-status","loaded"),e.setAttribute("data-block-lazy-load",!0),e.parentElement.style.display="none"});const a=e=>{e.querySelectorAll(".block[data-block-lazy-load]").forEach(async e=>{e.removeAttribute("data-block-lazy-load"),e.setAttribute("data-block-status","initialized"),await loadBlock(e),e.parentElement.style.display=""}),t.setAttribute("data-section-status","loaded")},o=new IntersectionObserver(e=>{e.some(e=>e.isIntersecting)&&(o.disconnect(),a(t))});o.observe(t),setTimeout(()=>{o.disconnect(),a(t)},5e3)}})}function decoratePageNav(t){var o=t.querySelector(".page-tabs");if(o){o=o.closest("div.section");let e=[...t.querySelectorAll("div.section")];const n=(e=e.slice(e.indexOf(o)+1)).filter(e=>e.hasAttribute("data-tabname"));let a=0;e.forEach(e=>{var t;a<n.length&&(e.classList.add("page-tab"),t=n[a].getAttribute("data-tabname")?.toLowerCase().replace(/\s+/g,"-"),e.setAttribute("aria-labelledby",t),e.hasAttribute("data-tabname"))&&(a+=1)}),lazyLoadHiddenPageNavTabs(e,n[0].getAttribute("aria-labelledby"))}}function decorateMain(e){decorateButtons(e),decorateIcons(e),buildAutoBlocks(e),decorateSections(e),decorateBlocks(e),loadHeader(document.querySelector("header")),decoratePageNav(e),decorateTwoColumnSection(e),updateExternalLinks(e)}async function decorateTemplates(e){try{var t,a,o=toClassName(getMetadata("template"));Object.keys(TEMPLATE_LIST).includes(o)&&(t=TEMPLATE_LIST[o],(a=await import(`../templates/${t}/${t}.js`)).default&&await a.default(e),document.body.classList.add(t))}catch(e){console.error("Auto Blocking failed",e)}}function decorateEmbeddedBlocks(e){e.querySelectorAll("div.section > div").forEach(decorateBlock)}async function processEmbedFragment(e){const t=div({class:"embed-fragment"});[...e.classList].forEach(e=>{t.classList.add(e)});var a=e.textContent;return a&&((a=await getFragmentFromFile(a+".plain.html"))?(t.innerHTML=a,[...t.querySelectorAll(".embed-fragment > div")].forEach(e=>{e.classList.add("section")}),decorateEmbeddedBlocks(t),decorateSections(t),loadBlocks(t)):(a=e.innerHTML,t.append(div({class:"section"})),t.querySelector(".section").innerHTML=a)),decorateButtons(t),decorateIcons(t),t}function loadATPageParams(){var e=window.location.pathname.replaceAll("/","_").replace(/\.html$/,"").substring(1),t=getMetadata("sku"),a=getMetadata("fullcategory").split("|").pop(),o=getMetadata("og:image"),n=getMetadata("og:title");return{id:e,skuId:t,categoryId:a,thumbnailURL:o,name:-1<n.indexOf("| Danaher Life Sciences")?n.split("| Danaher Life Sciences")[0]:n,message:getMetadata("og:description"),pageUrl:getMetadata("og:url"),brand:getMetadata("brand"),page:window.location.pathname.split("/")[3],tags:getMetadata("article:tag"),articleAuthor:getMetadata("authorname"),articlePostDate:getMetadata("publishdate"),articleReadTime:getMetadata("readingtime")}}function initATJS(t,e){return window.targetGlobalSettings=e,window.atPageParams=loadATPageParams(),window.targetPageParams=function(){return{at_property:"6aeb619e-92d9-f4cf-f209-6d88ff58af6a","entity.id":window.atPageParams?.id,"entity.skuId":window.atPageParams?.skuId,"entity.categoryId":window.atPageParams?.categoryId,"entity.thumbnailURL":window.atPageParams?.thumbnailURL,"entity.name":window.atPageParams?.name,"entity.message":window.atPageParams?.message,"entity.pageUrl":window.atPageParams?.pageUrl,"entity.brand":window.atPageParams?.brand,"entity.page":window.atPageParams?.page,"entity.tags":window.atPageParams?.tags,"entity.articleAuthor":window.atPageParams?.articleAuthor,"entity.articlePostDate":window.atPageParams?.articlePostDate,"entity.articleReadTime":window.atPageParams?.articleReadTime,danaherCompany:localStorage.getItem("danaher_company")?localStorage.getItem("danaher_company"):"",utmCampaign:localStorage.getItem("danaher_utm_campaign")?localStorage.getItem("danaher_utm_campaign"):"",utmSource:localStorage.getItem("danaher_utm_source")?localStorage.getItem("danaher_utm_source"):"",utmMedium:localStorage.getItem("danaher_utm_medium")?localStorage.getItem("danaher_utm_medium"):"",utmContent:localStorage.getItem("danaher_utm_content")?localStorage.getItem("danaher_utm_content"):""}},new Promise(e=>{import(t).then(e)})}function onDecoratedElement(t){document.querySelector('[data-block-status="loaded"],[data-section-status="loaded"]')&&t();var e=new MutationObserver(e=>{e.some(e=>"BODY"===e.target.tagName||"loaded"===e.target.dataset.sectionStatus||"loaded"===e.target.dataset.blockStatus)&&t()});e.observe(document.querySelector("main"),{subtree:!0,attributes:!0,attributeFilter:["data-block-status","data-section-status"]}),e.observe(document.querySelector("body"),{childList:!0})}function toCssSelector(e){return e.replace(/(\.\S+)?:eq\((\d+)\)/g,(e,t,a)=>":nth-child("+(Number(a)+1)+(t?` of ${t})`:""))}async function getElementForOffer(e){e=e.cssSelector||toCssSelector(e.selector);return document.querySelector(e)}async function getElementForMetric(e){e=toCssSelector(e.selector);return document.querySelector(e)}async function getAndApplyOffers(){const e=await window.adobe.target.getOffers({request:{execute:{pageLoad:{}}}}),{options:t=[],metrics:a=[]}=e.execute.pageLoad;onDecoratedElement(()=>{window.adobe.target.applyOffers({response:e}),t.forEach(e=>e.content=e.content.filter(e=>!getElementForOffer(e))),a.map((e,t)=>getElementForMetric(e)?t:-1).filter(e=>0<=e).reverse().map(e=>a.splice(e,1))})}let atjsPromise=Promise.resolve();const urlTarget=window.location.pathname,regex=/^\/(us\/en\/products\.html)?$/;async function loadEager(e){document.documentElement.lang="en",decorateTemplateAndTheme(),await window.hlx.plugins.run("loadEager");e=e.querySelector("main");e&&(await decorateTemplates(e),decorateMain(e),await atjsPromise,await new Promise(e=>{window.requestAnimationFrame(async()=>{document.body.classList.add("appear"),await waitForLCP(LCP_BLOCKS),e()})}));try{(900<=window.innerWidth||sessionStorage.getItem("fonts-loaded"))&&loadFonts()}catch(e){}}function getParameterByName(e,t=window.location.href){e=e.replace(/[[\]]/g,"$&"),e=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return e?e[2]?decodeURIComponent(e[2].replace(/\+/g," ")):"":null}function loadUTMprams(){["utm_campaign","utm_source","utm_medium","utm_content","utm_term","utm_previouspage"].forEach(e=>{var t=getParameterByName(e);null!==t&&window.localStorage.setItem("danaher_"+e,t)})}async function loadLazy(e){var t=e.querySelector("main"),a=(await loadBlocks(t),window.location)["hash"],o=!!a&&e.getElementById(a.substring(1));a&&o&&o.scrollIntoView(),loadFooter(e.querySelector("footer")),loadCSS(window.hlx.codeBasePath+"/styles/lazy-styles.css"),loadFonts(),window.hlx.plugins.run("loadLazy"),sampleRUM("lazy"),sampleRUM.observe(t.querySelectorAll("div[data-block-name]")),sampleRUM.observe(t.querySelectorAll("picture > img")),loadUTMprams()}function loadDelayed(){window.setTimeout(()=>(window.hlx.plugins.load("delayed"),window.hlx.plugins.run("loadDelayed"),import("./delayed.js")),4e3)}async function loadPage(){setFavicon(),await window.hlx.plugins.load("eager"),await loadEager(document),await window.hlx.plugins.load("lazy"),await loadLazy(document),loadDelayed()}function getDLPage(){var e={title:document.querySelector("title").textContent.replace(/[\n\t]/gm,""),language:"en",locale:"US",level:"top",type:"webpage",keywords:"",creationDate:getMetadata("creationdate"),updateDate:getMetadata("updatedate")},t=window.location.pathname;return"/"===t||"/us/en"===t||"/us/en.html"===t?(e.level="top",e.type="home"):t.includes("/us/en/news")?(e.level="top",e.type="news"):t.includes("/us/en/blog")?(e.level="middle",e.type="blog"):t.includes("/us/en/solutions")?(e.level="middle",e.type="solutions"):t.includes("/us/en/applications")?(e.level="middle",e.type="applications"):t.includes("/us/en/products")?t.includes("/us/en/products/family")?(e.level="bottom",e.type="family"):t.includes("/us/en/products/bundles")?(e.level="bottom",e.type="bundles"):t.includes("/us/en/products/sku")?(e.level="bottom",e.type="sku"):t.includes("/topics")?(e.level="other",e.type="topics"):(e.level="bottom",e.type="products"):t.includes("/us/en/library")?(e.level="other",e.type="library"):t.includes("/us/en/about-us")?(e.level="top",e.type="about-us"):t.includes("/us/en/expert")?(e.level="top",e.type="expert"):t.includes("/us/en/search")||t.includes("/us/en/danahersearch")?(e.level="top",e.type="search"):t.includes("/us/en/signin")?(e.level="top",e.type="signin"):t.includes("/us/en/legal")&&(e.level="top",e.type="legal"),e}regex.test(urlTarget)||(atjsPromise=initATJS("./at.js",{clientCode:"danaher",serverDomain:"danaher.tt.omtrdc.net",imsOrgId:"08333E7B636A2D4D0A495C34@AdobeOrg",bodyHidingEnabled:!1,cookieDomain:window.location.hostname,pageLoadEnabled:!1,secureOnly:!0,viewsEnabled:!1,withWebGLRenderer:!1}).catch(e=>{console.error("Error loading at.js",e)}),document.addEventListener("at-library-loaded",()=>getAndApplyOffers()));const urlParams=new URLSearchParams(window.location.search),useProd=urlParams.get("useProd");"lifesciences.danaher.com"===window.location.host||"true"===useProd?window.DanaherConfig={siteID:"ls-us-en",gtmID:"GTM-THXPLCS",munchkinID:"306-EHG-641",marketoDomain:"//306-EHG-641.mktoweb.com",quoteCartPath:"/us/en/quote-cart.html",cartPath:"/us/en/cart.html",addressesPath:"/us/en/addresses.html",shippingPath:"/us/en/shipping.html",paymentPath:"/us/en/payment.html",receiptPath:"/us/en/receipt.html",quoteSubmitPath:"/us/en/submit-quote.html",intershopDomain:"https://shop.lifesciences.danaher.com",intershopPath:"/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-",searchOrg:"danaherproductionrfl96bkr",searchKey:"xxf2f10385-5a54-4a18-bb48-fd8025d6b5d2",workflowProductKey:"xx3d1b8da5-d1e9-4989-bbed-264a248a9e22",workflowResourceKey:"xxf6a8b387-10f2-4660-af5d-6d304d0a789d",productKey:"xxfb161aa6-0fa0-419f-af37-9c6d7784bf76",familyProductKey:"xx1ecd2a4f-8391-4c70-b3c0-2d589bda56b7",familyResourceKey:"xx9dd85afc-64b6-4295-bc5d-eb8285f96d52",categoryProductKey:"xx2a299d60-2cf1-48ab-b9d5-94daeb25f1d6",categoryDetailKey:"xx61910369-c1ab-4df9-8d8a-3092b1323fcc",productRecommendationsKey:"xx107716c0-1ccd-4a61-8717-6ca36b6cdb0e",megaMenuPath:"/content/dam/danaher/system/navigation/megamenu_items_us.json",coveoProductPageTitle:"Product Page",pdfEmbedKey:"4a472c386025439d8a4ce2493557f6e7",host:"lifesciences.danaher.com"}:window.DanaherConfig={siteID:"ls-us-en",gtmID:"GTM-KCBGM2N",munchkinID:"439-KNJ-322",marketoDomain:"//439-KNJ-322.mktoweb.com",quoteCartPath:"/us/en/quote-cart.html",cartPath:"/us/en/cart.html",addressesPath:"/us/en/addresses.html",shippingPath:"/us/en/shipping.html",paymentPath:"/us/en/payment.html",receiptPath:"/us/en/receipt.html",quoteSubmitPath:"/us/en/submit-quote.html",intershopDomain:"https://stage.shop.lifesciences.danaher.com",intershopPath:"/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-",searchOrg:"danahernonproduction1892f3fhz",searchKey:"xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b",workflowProductKey:"xx26ffc727-cc72-4bbd-98e3-34052f296382",workflowResourceKey:"xx14676f1d-cf4a-4a38-94f0-eda56e9920f1",productKey:"xx32da148e-dfd0-4725-a443-c05a7793afea",familyProductKey:"xx4e3989d6-93aa-4140-a227-19da35fcd1cc",familyResourceKey:"xx8274a91e-b29c-4267-8b3a-5022a2698605",categoryProductKey:"xxdf9d160d-f6e5-4c8c-969b-8570d7b81418",categoryDetailKey:"xxf2ea9bfd-bccb-4195-90fd-7757504fdc33",productRecommendationsKey:"xxea4d2c40-26e7-4e98-9377-d8ebe3f435ea",megaMenuPath:"/content/dam/danaher/system/navigation/megamenu_items_us.json",coveoProductPageTitle:"Product Page",pdfEmbedKey:"4a472c386025439d8a4ce2493557f6e7",host:"stage.lifesciences.danaher.com"},window.dataLayer=[],window.dataLayer.push({user:{customerID:"",accountType:"guest",marketCode:"",company:"",role:"",city:"",state:"",country:"",postalCode:"",lastVisit:""}}),window.dataLayer.push({page:getDLPage()}),loadPage();export{imageHelper,createOptimizedS7Picture,formatDateUTCSeconds,generateUUID,scrollJumpMenuFixed,scrollPageTabFixed,makePublicUrl,setJsonLd,getFragmentFromFile,getCookie,isOTEnabled,setCookie,decorateModals,decorateMain,processEmbedFragment};