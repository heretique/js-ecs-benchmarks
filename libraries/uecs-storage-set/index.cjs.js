"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class e{constructor(e,n){this.view=function(e,n){const s=n.length;let i="";const o=[];for(let e=0;e<s;++e){const s=n[e].name,r=`${t.storage}${s}`;i+=`const ${r} = ${t.world}.components["${s}"];\n`,o.push(r)}let r="";r+="let min = Infinity;\n",r+="let storage = undefined;\n";for(let e=0;e<s;++e)r+=`if (${o[e]}.entities.size < min) {\n    storage = ${o[e]};\n    min = ${o[e]}.entities.size;\n}\n`;r+="if (storage === undefined) return;\n",r+=`const ${t.entities} = storage.entities.keys();\n`;let c="";const l=[];for(let e=0;e<s;++e){const s=`${n[e].name}${e}`;c+=`const ${s} = ${o[e]}[${t.entity}];\n`,l.push(s)}let a="if (";for(let e=0;e<s;++e)a+=`${l[e]} === undefined`,e!==s-1&&(a+=" || ");a+=") continue;\n";const h=i+`return function(${t.callback}) {\n`+r+`for (const ${t.entity} of ${t.entities}) {\n`+c+a+`if (${t.callback}(${t.entity},${function(e,t){let n="";const s=e.length-1;for(let i=0;i<s;++i)n+=e[i]+t;return n+=e[s],n}(l,",")}) === false) return;\n}\n}`;return new Function(t.world,h)(e)}(e,n)}each(e){this.view(e)}}const t={world:"_$WORLD",entity:"_$ENTITY",entities:"_$ENTITIES",callback:"_$CALLBACK",storage:"_$STORAGE"};class n{static for(e){const t=e.toString();let s=n.cache[t];return null==s&&(s=Object.defineProperty(class{},"name",{value:"T$"+t}),n.cache[t]=s),s}}n.cache={},exports.Null=-1,exports.Tag=n,exports.World=class{constructor(){this.entitySequence=0,this.entities=new Set,this.components={},this.views={}}create(...e){const t=this.entitySequence++;this.entities.add(t);for(let n=0,s=e.length;n<s;++n)this.emplace(t,e[n]);return t}insert(e,...t){e>=this.entitySequence&&(this.entitySequence=e+1),this.entities.add(e);for(let n=0,s=t.length;n<s;++n)this.emplace(e,t[n]);return e}exists(e){return this.entities.has(e)}destroy(e){this.entities.delete(e);for(const t in this.components){const n=this.components[t],s=n[e];void 0!==s&&void 0!==s.free&&s.free(),delete n[e],n.entities.delete(e)}}get(e,t){const n=t.name,s=this.components[n];if(void 0!==s)return s[e]}has(e,t){const n=t.name,s=this.components[n];return null==s?void 0:s.entities.has(e)}emplace(e,t){var n;const s=null!==(n=t.name)&&void 0!==n?n:t.constructor.name;if(!this.entities.has(e))throw new Error(`Cannot set component "${s}" for dead entity ID ${e}`);null==this.components[s]&&(this.components[s]={entities:new Set}),this.components[s][e]=t,this.components[s].entities.add(e)}remove(e,t){const n=t.name,s=this.components[n];if(void 0===s)return;const i=s[e];return delete s[e],s.entities.delete(e),i}size(){return this.entities.size}view(...t){let n="";for(let e=0;e<t.length;++e)n+=t[e].name;if(!(n in this.views)){for(let e=0;e<t.length;++e)void 0===this.components[t[e].name]&&(this.components[t[e].name]={entities:new Set});this.views[n]=new e(this,t)}return this.views[n]}clear(){for(const e of this.entities.values())this.destroy(e)}all(){return this.entities.values()}};
