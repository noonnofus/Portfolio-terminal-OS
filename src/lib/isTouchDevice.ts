import { useEffect, useState } from "react";
import {
  isAndroid,
  isIPad13,
  isIPhone13,
  isWinPhone,
  isMobileSafari,
  isTablet,
} from "react-device-detect";
import { useDispatch } from "react-redux";
import { setIsTouchDevice } from "@/app/store/features/desktopSlice";

function isTouchDevice() {
  if (typeof window === "undefined") return false;

  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");

  function mq(query: string) {
    return typeof window !== "undefined" && window.matchMedia(query).matches;
  }

  if (
    "ontouchstart" in window ||
    // @ts-ignore
    (window?.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
    ""
  );
  return mq(query);
}

export default function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  const dispatch = useDispatch();

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
    dispatch(setIsTouchDevice(touchCheck));
  }, []);

  return isTouch;
}
