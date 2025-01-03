import { useEffect, useState } from 'react';
import { 
  isAndroid, 
  isIPad13, 
  isIPhone13, 
  isWinPhone, 
  isMobileSafari, 
  isTablet 
} from 'react-device-detect';

function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  
  function mq(query: string) {
    return typeof window !== 'undefined' && window.matchMedia(query).matches;
  }
  
  // @ts-ignore
  if ('ontouchstart' in window || (window?.DocumentTouch && document instanceof DocumentTouch)) {
    return true;
  }
  
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

export default function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const touchCheck = 
      isAndroid || 
      isIPad13 || 
      isIPhone13 || 
      isWinPhone || 
      isMobileSafari || 
      isTablet || 
      isTouchDevice();
      
    setIsTouch(touchCheck);
  }, []);

  return isTouch;
}