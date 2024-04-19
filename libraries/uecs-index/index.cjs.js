"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class t{static typeFor(t){return this.ensure(t)[0]}static instFor(t){return this.ensure(t)[1]}static ensure(e){const n=e.toString();let s=t.cache[n];if(null==s){const e=Object.defineProperty(class{},"name",{value:`T$${n}`}),i=new e;t.cache[n]=s=[e,i]}return s}}t.cache={};class e{constructor(t,e){this.path=[],this.seqIdx=[],this.pathLen=0,this.reset(t,e)}reset(t,e){return null!=e&&(this.path[0]=e),null!=t&&(this.seq=t),this.pathLen=0,null!=this.seq&&(this.seqIdx.length=this.seq.length),this.seqIdx[0]=0,this.value=void 0,this}next(){var t;const e=this.path[0];if(null==this.seq||null==e)return!1;if(null==this.value&&0===this.pathLen){const t=e.value;if(null!=t)return this.value=t,!0}const n=this.seq.length;for(;;){let e=this.pathLen;const s=this.path[e],i=this.seq[this.seqIdx[e]],o=null===(t=s.branches)||void 0===t?void 0:t.get(i);if(null!=o&&(this.pathLen=++e,this.path[e]=o,this.seqIdx[e]=this.seqIdx[e-1]+1,null!=o.value))return this.value=o.value,!0;if(null==o||this.seqIdx[e]>=n){for(;++this.seqIdx[e]>=n;){if(this.seqIdx[e]=-1,0===e)return!1;this.path[e]=void 0,--e}this.pathLen=e}}}}const n=Symbol.for("$iS"),s=Symbol.for("$addVer"),i=Symbol.for("$remVer");class o{constructor(t,e){this.indexBase=t,this.names=e,this.entity=NaN;const o=this.names.length;this[n]=-1-o,this[s]=t.observeAddVer(),this[i]=t.observeRemVer()}start(){const t=this.names.length;this[n]=-1-t;const{names:e}=this;this.entity=NaN;for(let n=0;n<t;++n)this[e[n]]=void 0;return this}next(){const{indexBase:{storage:t},names:e}=this,s=t.length,i=e.length;let o,r=this[n];do{if(r+=1+i,r>=s){this[n]=r,this.entity=NaN;for(let t=0;t<i;++t)this[e[t]]=void 0;return!1}o=t[r]}while(void 0===o);this[n]=r,this.entity=o;for(let n=0;n<i;++n)this[e[n]]=t[r+n+1];return!0}first(){return this.start().next()?this:void 0}wasChanged(){return this.wasAddedTo()||this.wasRemovedFrom()}wasAddedTo(){const t=this.indexBase.observeAddVer();return this[s]!=t&&(this[s]=t,!0)}wasRemovedFrom(){const t=this.indexBase.observeRemVer();return this[i]!=t&&(this[i]=t,!0)}}class r{constructor(t){this.types=t,this.entityISByEntity=new Map,this.storage=[],this.freeISs=[],this.addVer=0,this.addVerObserved=!0,this.remVer=0,this.remVerObserved=!0}add(t,e){var n,s;const{storage:i,entityISByEntity:o}=this,r=null!==(s=null!==(n=o.get(t))&&void 0!==n?n:this.freeISs.pop())&&void 0!==s?s:i.length;this.entityISByEntity.set(t,r);const h=this.types.length;i[r]=t;for(let t=0;t<h;++t)i[r+t+1]=e[t];this.addVerObserved&&(this.addVer++,this.addVerObserved=!1)}emplace(t,e,n){const s=this.entityISByEntity.get(t);if(void 0===s)return!1;const i=this.types,o=i.length;for(let t=0;t<o;++t)if(i[t]==e)return this.storage[s+t+1]=n,!0;throw new Error(`Type ${e} is not in the index <${i.join(",")}>`)}remove(t){const{storage:e,entityISByEntity:n}=this,s=n.get(t);if(void 0===s)return!1;n.delete(t),this.freeISs.push(s);const i=this.types.length;e[s]=void 0;for(let t=0;t<i;++t)e[s+t+1]=void 0;return this.remVerObserved&&(this.remVer++,this.remVerObserved=!1),!0}observeAddVer(){return this.addVerObserved=!0,this.addVer}observeRemVer(){return this.remVerObserved=!0,this.remVer}}class h{constructor(t,e){this.view=function(t,e){const n=e.length;let s="";const i=[];for(let t=0;t<n;++t){const n=e[t].name,o=`${l.storage}${n}`;s+=`const ${o} = ${l.world}.components["${n}"];\n`,i.push(o)}let o="";const r=[];for(let t=0;t<n;++t){const n=`${e[t].name}${t}`;o+=`const ${n} = ${i[t]}[${l.entity}];\n`,r.push(n)}let h="if (";for(let t=0;t<n;++t)h+=`${r[t]} === undefined`,t!==n-1&&(h+=" || ");h+=") continue;\n";const c=`${s}return function(${l.callback}) {\nfor (const ${l.entity} of ${l.world}.entities.values()) {\n${o}${h}if (${l.callback}(${l.entity},${function(t,e){let n="";const s=t.length-1;for(let i=0;i<s;++i)n+=t[i]+e;return n+=t[s],n}(r,",")}) === false) return;\n}\n}`;return new Function(l.world,c)(t)}(t,e)}each(t){this.view(t)}}const l={world:"_$WORLD",entity:"_$ENTITY",callback:"_$CALLBACK",storage:"_$STORAGE"};exports.Null=-1,exports.Tag=t,exports.World=class{constructor(){this.entitySequence=0,this.entities=new Set,this.components={},this.views={},this.singletonEntity=-2,this.indexesByComponent=new Map,this.indexByComponents={},this.indexByComponentsSubIt=new e([],this.indexByComponents),this.create_typesP=[],this.create_ecs=[],this.index_specs=[],this.index_ecs=[]}trackEntities(t){this.entityTracker=t}registerSingleton(t){this.entities.has(this.singletonEntity)||this.entities.add(this.singletonEntity),this.emplace(this.singletonEntity,t)}getSingleton(t){return this.get(this.singletonEntity,t)}removeSingleton(t){this.entities.has(this.singletonEntity)&&this.remove(this.singletonEntity,t)}create(...t){var e,n,s;const i=this.entitySequence++;null===(n=null===(e=this.entityTracker)||void 0===e?void 0:e.entityAdded)||void 0===n||n.call(e,i),this.entities.add(i);const o=this.create_typesP,r=this.components,h=t.length;for(let e=0;e<h;++e){const n=t[e];null===(s=n.added)||void 0===s||s.call(n,i);const h=n.constructor.name;null==r[h]&&(r[h]={}),r[h][i]=n,o[e]=h}let l;o.length=h,o.sort();for(let t=0;t<h;++t){const e=o[t];if(e===l)throw o.length=0,new Error(`Duplicate component type ${e} in World.create <${o}>.`);l=e}const c=this.create_ecs;for(const t=this.indexByComponentsSubIt.reset(o);t.next();){const e=t.value,n=e.types,s=n.length;for(let t=0;t<s;++t)c[t]=r[n[t]][i];e.add(i,c)}return o.length=0,c.length=0,i}insert(t,...e){var n,s;t>this.entitySequence&&(this.entitySequence=t+1),this.entities.has(t)||null===(s=null===(n=this.entityTracker)||void 0===n?void 0:n.entityAdded)||void 0===s||s.call(n,t),this.entities.add(t);for(let n=0,s=e.length;n<s;++n)this.emplace(t,e[n]);return t}exists(t){return this.entities.has(t)}destroy(t){var e,n,s;null===(n=null===(e=this.entityTracker)||void 0===e?void 0:e.entityRemoved)||void 0===n||n.call(e,t),this.entities.delete(t);const i=[],o=[];let r=0;for(const e in this.components){const n=this.components[e],h=n[t];null!=h&&(i[r++]=h.constructor.name,null===(s=h.removed)||void 0===s||s.call(h,t),null!=h.free&&o.push(h)),delete n[t]}i.length=r,i.sort();for(const e=this.indexByComponentsSubIt.reset(i);e.next();){e.value.remove(t)}i.length=0;for(let e=0;e<o.length;e++){const n=o[e];null!=n.free&&n.free(this,t)}}get(t,e){const n="string"==typeof e?e:e.name,s=this.components[n];if(void 0!==s)return s[t]}getAll(t){const e=[];return Object.entries(this.components).forEach((([n,s])=>{const i=s[t];i&&e.push(i)})),e}has(t,e){const n=e.name,s=this.components[n];return void 0!==s&&void 0!==s[t]}emplace(t,e){var n;const s=e.constructor.name;if(!this.entities.has(t))throw new Error(`Cannot set component "${s}" for dead entity ID ${t}`);null==this.components[s]&&(this.components[s]={}),this.components[s][t]=e,null===(n=e.added)||void 0===n||n.call(e,t);const{components:i,indexesByComponent:o,index_ecs:r}=this,h=o.get(s);if(null!=h){const n=h.length;t:for(let o=0;o<n;++o){const n=h[o];if(n.emplace(t,s,e))continue;const l=n.types,c=l.length;for(let e=0;e<c;++e){const n=i[l[e]][t];if(void 0===n)continue t;r[e]=n}n.add(t,r)}r.length=0}}remove(t,e){var n;const s="string"==typeof e?e:e.name,i=this.components[s];if(void 0===i)return;const o=i[t];if(delete i[t],void 0===o)return o;null===(n=o.removed)||void 0===n||n.call(o,t);const r=this.indexesByComponent.get(s);if(void 0===r)return o;const h=null==r?void 0:r.length;for(let e=0;e<h;++e){r[e].remove(t)}return o}size(t){return null==t?this.entities.size:Object.keys(this.components[t.name]).length}view(...t){let e="";for(let n=0;n<t.length;++n)e+=t[n].name;if(!(e in this.views)){for(let e=0;e<t.length;++e)void 0===this.components[t[e].name]&&(this.components[t[e].name]={});this.views[e]=new h(this,t)}return this.views[e]}index_indexComponentSpecOrd(t,e){return t[1]==e[1]?0:t[1]<e[1]?-1:1}index(t,e=!1){const n=this.index_specs;n.length=0;for(const e of Object.keys(t)){const s=t[e].name;n.push([e,s]),void 0===this.components[s]&&(this.components[s]={})}n.sort(this.index_indexComponentSpecOrd);const s=n.length,i=[],h=new Array(s);let l;for(let e=0;e<s;++e){i[e]=n[e][0];const s=h[e]=n[e][1];if(s===l)throw n.length=0,new Error(`Duplicate component type ${s} in index <${t}>.`);l=s}n.length=0;const c=this.indexByComponents;let d=function(t,e){var n;let s=t;const i=e.length;for(let t=0;t<i;++t){const i=e[t],o=null===(n=s.branches)||void 0===n?void 0:n.get(i);if(null==o)return;s=o}return s.value}(c,h);if(null!=d)return new o(d,i);d=new r(h),function(t,e,n){var s,i;let o=t;const r=e.length;for(let t=0;t<r;++t){const n=e[t];null==o.branches&&(o.branches=new Map);let r=null===(s=o.branches)||void 0===s?void 0:s.get(n);null==r&&(r={},null===(i=o.branches)||void 0===i||i.set(n,r)),o=r}o.value=n}(c,h,d);const a=this.indexesByComponent;for(let t=0;t<s;++t){const e=h[t],n=a.get(e);null!=n?n.push(d):a.set(e,[d])}const u=this.entities,v=this.components,p=this.index_ecs;t:for(const t of u.values()){for(let e=0;e<s;++e){const n=v[h[e]][t];if(void 0===n)continue t;p[e]=n}d.add(t,p)}return p.length=0,new o(d,i)}clear(){for(const t of this.entities.values())this.destroy(t)}all(){return this.entities.values()}};
