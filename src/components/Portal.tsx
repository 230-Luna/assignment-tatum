import {
  useState,
  startTransition,
  ReactNode,
  createContext,
  useContext,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

const PortalContext = createContext<HTMLDivElement | null>(null);

export function PortalProvider({ children }: PortalProps) {
  const [portalContainerRef, setPortalContainerRef] =
    useState<HTMLDivElement | null>(null);

  return (
    <PortalContext.Provider value={portalContainerRef}>
      {children}
      <div
        id="portal-container"
        ref={(el) => {
          if (portalContainerRef !== null || el === null) {
            return;
          }

          startTransition(() => {
            setPortalContainerRef(el);
          });
        }}
      />
    </PortalContext.Provider>
  );
}

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const portalContainerRef = useContext(PortalContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || portalContainerRef === null) {
    return null;
  }

  return createPortal(children, portalContainerRef);
}
