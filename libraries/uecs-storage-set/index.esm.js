const t=-1;class e{constructor(){this.entitySequence=0,this.entities=new Set,this.components={},this.views={}}create(...t){const e=this.entitySequence++;this.entities.add(e);for(let n=0,s=t.length;n<s;++n)this.emplace(e,t[n]);return e}insert(t,...e){t>=this.entitySequence&&(this.entitySequence=t+1),this.entities.add(t);for(let n=0,s=e.length;n<s;++n)this.emplace(t,e[n]);return t}exists(t){return this.entities.has(t)}destroy(t){this.entities.delete(t);for(const e in this.components){const n=this.components[e],s=n[t];void 0!==s&&void 0!==s.free&&s.free(),delete n[t],n.entities.delete(t)}}get(t,e){const n=e.name,s=this.components[n];if(void 0!==s)return s[t]}has(t,e){const n=e.name,s=this.components[n];return null==s?void 0:s.entities.has(t)}emplace(t,e){var n;const s=null!==(n=e.name)&&void 0!==n?n:e.constructor.name;if(!this.entities.has(t))throw new Error(`Cannot set component "${s}" for dead entity ID ${t}`);null==this.components[s]&&(this.components[s]={entities:new Set}),this.components[s][t]=e,this.components[s].entities.add(t)}remove(t,e){const n=e.name,s=this.components[n];if(void 0===s)return;const i=s[t];return delete s[t],s.entities.delete(t),i}size(){return this.entities.size}view(...t){let e="";for(let n=0;n<t.length;++n)e+=t[n].name;if(!(e in this.views)){for(let e=0;e<t.length;++e)void 0===this.components[t[e].name]&&(this.components[t[e].name]={entities:new Set});this.views[e]=new n(this,t)}return this.views[e]}clear(){for(const t of this.entities.values())this.destroy(t)}all(){return this.entities.values()}}class n{constructor(t,e){this.view=function(t,e){const n=e.length;let r=`const ${c} = []\n`;const h=[];for(let t=0;t<n;++t){const n=e[t].name,i=`${c}${n}`;r+=`const ${i} = ${s}.components["${n}"];\n${c}.push(${i});\n`,h.push(i)}let l="";const a=[];for(let t=0;t<n;++t){const n=`${e[t].name}${t}`;l+=`const ${n} = ${h[t]}[${i}];\n`,a.push(n)}let u="if (";for(let t=0;t<n;++t)u+=`${a[t]} === undefined`,t!==n-1&&(u+=" || ");u+=") continue;\n";const f=r+`return function(${o}) {\nlet index = 0;\nlet min = Math.Infinity;\n`+`for (let i = 0;  i < ${c}.length; i++) {\n`+`const length = ${c}[i].length;\nif (length < min) { min = length; index = i;}\n}\n`+`for (const ${i} of ${c}[index].entities.values()) {\n`+l+u+`if (${o}(${i},${function(t,e){let n="";const s=t.length-1;for(let i=0;i<s;++i)n+=t[i]+e;return n+=t[s],n}(a,",")}) === false) return;\n}\n}`;return new Function(s,f)(t)}(t,e)}each(t){this.view(t)}}const s="_$WORLD",i="_$ENTITY",o="_$CALLBACK",c="_$STORAGE";class r{static for(t){const e=t.toString();let n=r.cache[e];return null==n&&(n=Object.defineProperty(class{},"name",{value:"T$"+e}),r.cache[e]=n),n}}r.cache={};export{t as Null,r as Tag,e as World};