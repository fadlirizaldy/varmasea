import { useEffect, useState, useCallback } from "react";

export const useDebounce = (text: string, delay: number = 500) => {
  const [tmp, setTmp] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setTmp(text);
    }, delay);
    return () => {
      clearTimeout(timerId);
    };
  });
  return tmp;
};
