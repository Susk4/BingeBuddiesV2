import { useEffect, useState } from "react";

const getColumnCount = () => {
  if (typeof window === "undefined") {
    return 1;
  }
  if (window.matchMedia("(min-width: 1024px)").matches) {
    return 3;
  }
  if (window.matchMedia("(min-width: 640px)").matches) {
    return 2;
  }
  return 1;
};

export const useResponsiveGridColumns = () => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const update = () => setColumns(getColumnCount());
    update();

    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    mqSm.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  return columns;
};
