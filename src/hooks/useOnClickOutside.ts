import React, { useEffect } from 'react';

export function useOnClickOutside(
  ref: React.MutableRefObject<HTMLElement | HTMLDivElement | null>,
  handler: (value: Event) => void,
  parentRef: React.MutableRefObject<HTMLElement | HTMLDivElement | null>,
): void {
  useEffect(
    () => {
      const listener = (event: Event): void => {
        // Do nothing if clicking ref's element or descendent elements
        const target = event.target as HTMLElement;

        if (
          !ref.current ||
          !parentRef.current ||
          ref.current.contains(target) ||
          parentRef.current.contains(target)
        ) {
          return;
        }
        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Хук проверяет, содержит ли ref.current цель события event.target,
    // и если содержит выполняет handler.
    [ref, parentRef, handler],
  );
}

export function useOnClickOutsideMenu(
  ref: React.RefObject<HTMLElement>,
  handler: (e: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    function listener(this: Document, event: MouseEvent | TouchEvent): void {
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return;
      }
      handler(event);
    }

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
