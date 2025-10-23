"use client";

import { useEffect, useState } from "react";

export function useIsMobile (breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handler to check screen width
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
