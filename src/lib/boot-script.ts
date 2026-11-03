import { LOCALE_STORAGE_KEY } from '@/i18n/config';
import { A11Y_STORAGE_KEY } from './a11y-settings';
import { REDUCE_MOTION_KEY, SKIP_INTRO_KEY } from './motion/state';

/**
 * Inline script executed in <head> before first paint. It applies the
 * visitor's stored preferences as classes on <html> so the page never
 * flashes in the wrong state:
 *  - reduced motion (in-site switch, else the OS setting)
 *  - accessibility settings (text size, contrast, font, spacing, underline)
 *  - first visit to "/": redirect to the saved or browser language (as the reference does)
 *  - `motion-pending`: hide elements that animate in until the motion runtime takes over
 */
export const bootScript = `(function(){
var d=document.documentElement,c=d.classList,s;
try{s=window.localStorage}catch(e){}
function get(k){try{return s&&s.getItem(k)}catch(e){return null}}
var rm=get('${REDUCE_MOTION_KEY}');
var reduce=rm==='1'||(rm!=='0'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
if(reduce)c.add('reduce-motion');
try{var a=JSON.parse(get('${A11Y_STORAGE_KEY}')||'{}');
if(a.textSize===125)c.add('a11y-text-125');if(a.textSize===150)c.add('a11y-text-150');
if(a.contrast)c.add('a11y-contrast');if(a.readableFont)c.add('a11y-readable-font');
if(a.spacing)c.add('a11y-spacing');if(a.underline)c.add('a11y-underline');}catch(e){}
try{if(sessionStorage.getItem('${SKIP_INTRO_KEY}')){sessionStorage.removeItem('${SKIP_INTRO_KEY}');c.add('skip-intro');window.__dkSkipIntro=true;}}catch(e){}
if(location.pathname==='/'){var l=get('${LOCALE_STORAGE_KEY}');
if(!l){var n=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];
for(var i=0;i<n.length;i++){var x=String(n[i]).slice(0,2).toLowerCase();if(x==='en'||x==='de'||x==='fr'){l=x;break}}}
if(l==='de'||l==='fr'){location.replace('/'+l+location.hash);return}}
if(!reduce){c.add('motion-pending');setTimeout(function(){c.remove('motion-pending')},5000)}
})();`;
