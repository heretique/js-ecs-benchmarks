"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class e{constructor(e,o){this.view=function(e,o){const r=o.length;let c=`const ${i} = []\n`;const l=[];for(let e=0;e<r;++e){const n=o[e].name,s=`${i}${n}`;c+=`const ${s} = ${t}.components["${n}"];\n${i}.push(${s});\n`,l.push(s)}let h="";const a=[];for(let e=0;e<r;++e){const t=`${o[e].name}${e}`;h+=`const ${t} = ${l[e]}[${n}];\n`,a.push(t)}let u="if (";for(let e=0;e<r;++e)u+=`${a[e]} === undefined`,e!==r-1&&(u+=" || ");u+=") continue;\n";const f=c+`return function(${s}) {\nlet index = 0;\nlet min = Math.Infinity;\n`+`for (let i = 0;  i < ${i}.length; i++) {\n`+`const length = ${i}[i].length;\nif (length < min) { min = length; index = i;}\n}\n`+`for (const ${n} of ${i}[index].entities.values()) {\n`+h+u+`if (${s}(${n},${function(e,t){let n="";const s=e.length-1;for(let i=0;i<s;++i)n+=e[i]+t;return n+=e[s],n}(a,",")}) === false) return;\n}\n}`;return new Function(t,f)(e)}(e,o)}each(e){this.view(e)}}const t="_$WORLD",n="_$ENTITY",s="_$CALLBACK",i="_$STORAGE";class o{static for(e){const t=e.toString();let n=o.cache[t];return null==n&&(n=Object.defineProperty(class{},"name",{value:"T$"+t}),o.cache[t]=n),n}}o.cache={},exports.Null=-1,exports.Tag=o,exports.World=class{constructor(){this.entitySequence=0,this.entities=new Set,this.components={},this.views={}}create(...e){const t=this.entitySequence++;this.entities.add(t);for(let n=0,s=e.length;n<s;++n)this.emplace(t,e[n]);return t}insert(e,...t){e>=this.entitySequence&&(this.entitySequence=e+1),this.entities.add(e);for(let n=0,s=t.length;n<s;++n)this.emplace(e,t[n]);return e}exists(e){return this.entities.has(e)}destroy(e){this.entities.delete(e);for(const t in this.components){const n=this.components[t],s=n[e];void 0!==s&&void 0!==s.free&&s.free(),delete n[e],n.entities.delete(e)}}get(e,t){const n=t.name,s=this.components[n];if(void 0!==s)return s[e]}has(e,t){const n=t.name,s=this.components[n];return null==s?void 0:s.entities.has(e)}emplace(e,t){var n;const s=null!==(n=t.name)&&void 0!==n?n:t.constructor.name;if(!this.entities.has(e))throw new Error(`Cannot set component "${s}" for dead entity ID ${e}`);null==this.components[s]&&(this.components[s]={entities:new Set}),this.components[s][e]=t,this.components[s].entities.add(e)}remove(e,t){const n=t.name,s=this.components[n];if(void 0===s)return;const i=s[e];return delete s[e],s.entities.delete(e),i}size(){return this.entities.size}view(...t){let n="";for(let e=0;e<t.length;++e)n+=t[e].name;if(!(n in this.views)){for(let e=0;e<t.length;++e)void 0===this.components[t[e].name]&&(this.components[t[e].name]={entities:new Set});this.views[n]=new e(this,t)}return this.views[n]}clear(){for(const e of this.entities.values())this.destroy(e)}all(){return this.entities.values()}};
