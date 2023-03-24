import { useCallback, useState } from "react"


export const useModalState = (defaultVal = false) => {
  const [isOpen, setIsOpen] = useState(defaultVal);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}