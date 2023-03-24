import { useCallback, useEffect, useState } from "react"


export const useModalState = (defaultVal = false) => {
  // shall determine the dashboard brawer open state
  const [isOpen, setIsOpen] = useState(defaultVal);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

export const useMediaQuery = (query) => {
  // shall allow the manipulation of media queries programmatically
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const queryList = window.matchMedia(query);

    const handleChange = e => setMatches(e.matches)

    queryList.addEventListener("change", handleChange);

    return () => queryList.removeEventListener("change", handleChange);
  }, [query])

  return matches;
}