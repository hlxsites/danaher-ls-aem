import{r as t,g as s}from"./p-591772f1.js";import{M as i}from"./p-95642beb.js";import{R as e,a as r,m as o}from"./p-938f1f56.js";import"./p-3eb3e1ff.js";import"./p-a5540571.js";import"./p-eab67c09.js";import"./p-d2151deb.js";import"./p-4328fcc3.js";import"./p-2a438118.js";var h=function(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var h=t.length-1;h>=0;h--)(o=t[h])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n};const n=class{constructor(s){t(this,s),this.matchConditions=[],this.conditions=[],this.mustMatch={},this.mustNotMatch={},this.error=void 0,this.conditions=[],this.ifDefined=void 0,this.ifNotDefined=void 0,this.resultTemplateCommon=new e({host:this.host,setError:t=>{this.error=t},validParents:["atomic-insight-result-list","atomic-insight-folded-result-list"],allowEmpty:!0})}componentWillLoad(){this.conditions=r(this.ifDefined,this.ifNotDefined),this.resultTemplateCommon.matchConditions=o(this.mustMatch,this.mustNotMatch)}async getTemplate(){return this.resultTemplateCommon.getTemplate(this.conditions,this.error)}render(){return this.resultTemplateCommon.renderIfError(this.error)}get host(){return s(this)}};h([i({splitValues:!0})],n.prototype,"mustMatch",void 0),h([i({splitValues:!0})],n.prototype,"mustNotMatch",void 0);export{n as atomic_insight_result_template};