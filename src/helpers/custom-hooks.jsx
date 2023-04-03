import { useCallback, useEffect, useState } from 'react';
import { Notification, toaster } from 'rsuite';
import { database } from '../misc/firebase';
import { useRef } from 'react';

export const useModalState = (defaultVal = false) => {
  // shall determine the dashboard brawer open state
  const [isOpen, setIsOpen] = useState(defaultVal);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
};

export const useMediaQuery = query => {
  // this hook shall allow the manipulation of media queries programmatically

  const getMatches = query => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(false);

  const handleChange = useCallback(
    () => setMatches(getMatches(query)),
    [query]
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);

    handleChange(); // shall be trigged on first client-side load or if query changes

    queryList.addEventListener('change', handleChange);

    return () => queryList.removeEventListener('change', handleChange);
  }, [query, handleChange]);

  return matches;
};

export const toggleToasterPush = (
  type,
  header,
  message = '',
  placement,
  duration
) => {
  toaster.push(
    <Notification type={type} header={header}>
      {message}
    </Notification>,
    {
      placement: placement,
      duration: duration,
    }
  );
};

export const usePresence = uid => {
  // shall return the info abt the presence status of a certain user
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    const userStatusRef = database.ref(`/status/${uid}`);

    userStatusRef.on('value', snap => {
      if (snap.exists()) {
        const data = snap.val();
        setPresence(data);
      }
    });

    return () => {
      userStatusRef.off();
    };
  }, [uid]);

  return presence;
};

export const useHover = () => {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);
      }
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current] // Recall only if ref changes
  );
  return [ref, value];
};
