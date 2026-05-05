import type { ReactNode } from "react";
import { createPortal } from "react-dom";

type FilterPortalProps = {
  children: ReactNode;
};

export const FilterPortal: React.FC<FilterPortalProps> = ({ children }) => {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
};
