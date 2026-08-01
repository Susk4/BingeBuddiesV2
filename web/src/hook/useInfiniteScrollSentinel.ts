import { useEffect } from "react";
import type { RefObject } from "react";

export const useInfiniteScrollSentinel = (
  sentinelRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  onLoadMore: () => void,
) => {
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, onLoadMore, sentinelRef]);
};
