import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HashScrollManager() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }

    const id = hash.replace(/^#/, "");

    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (!target) {
        return false;
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };

    if (scrollToTarget()) {
      return;
    }

    const timeoutId = window.setTimeout(scrollToTarget, 120);
    return () => window.clearTimeout(timeoutId);
  }, [hash, pathname]);

  return null;
}
