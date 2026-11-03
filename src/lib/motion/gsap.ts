import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Same plugin setup as the reference build.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.config({ force3D: 'auto' });
}

export { gsap, ScrollTrigger, SplitText };
