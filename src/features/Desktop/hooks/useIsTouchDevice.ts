import { useEffect, useState } from "react";
import {
  isAndroid,
  isIPad13,
  isIPhone13,
  isWinPhone,
  isMobileSafari,
  isTablet,
} from "react-device-detect";
import { useDesktopStore } from "@/features/Desktop/store/useDesktopStore";

function isTouchDevice() {
  if (typeof window === "undefined") return false;

  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");

  function mq(query: string) {
    return typeof window !== "undefined" && window.matchMedia(query).matches;
  }

  if (
    "ontouchstart" in window ||
    // @ts-expect-error: DocumentTouch is a legacy non-standard property
    (window?.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
    ""
  );
  return mq(query);
}

function getTouchCheck() {
  return (
    isAndroid ||
    isIPad13 ||
    isIPhone13 ||
    isWinPhone ||
    isMobileSafari ||
    isTablet ||
    isTouchDevice()
  );
}

export default function useIsTouchDevice() {
  const [isTouch] = useState(getTouchCheck);
  const setIsTouchDeviceState = useDesktopStore((state) => state.setIsTouchDevice);

  useEffect(() => {
    setIsTouchDeviceState(isTouch);
  }, [isTouch, setIsTouchDeviceState]);

  return isTouch;
}
