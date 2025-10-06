import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
  useRef,
  useImperativeHandle,
  Ref,
  forwardRef,
  ComponentType,
} from "react";

let elementId = 1;

interface Options {
  exitOnUnmount?: boolean;
}

export function useOverlay({ exitOnUnmount = true }: Options = {}) {
  const context = useContext(OverlayContext);

  if (context == null) {
    throw new Error("useOverlay is only available within OverlayProvider.");
  }

  const { mount, unmount } = context;
  const [id] = useState(() => String(elementId++));

  const overlayRef = useRef<OverlayControlRef | null>(null);

  useEffect(() => {
    return () => {
      if (exitOnUnmount) {
        unmount(id);
      }
    };
  }, [exitOnUnmount, id, unmount]);

  return useMemo(
    () => ({
      open: (
        overlayElement: ComponentType<{
          isOpen: boolean;
          close: () => void;
          onExit: () => void;
          exit: () => void;
        }>
      ) => {
        mount(
          id,
          <OverlayController
            key={Date.now()}
            ref={overlayRef}
            overlayElement={overlayElement}
            onExit={() => {
              unmount(id);
            }}
          />
        );
      },
      close: () => {
        overlayRef.current?.close();
      },
      exit: () => {
        unmount(id);
      },
    }),
    [id, mount, unmount]
  );
}

interface Props {
  overlayElement: ComponentType<{
    isOpen: boolean;
    close: () => void;
    onExit: () => void;
    exit: () => void;
  }>;
  onExit: () => void;
}

interface OverlayControlRef {
  close: () => void;
}

const OverlayController = forwardRef(function OverlayController(
  { overlayElement: OverlayElement, onExit }: Props,
  ref: Ref<OverlayControlRef>
) {
  const [isOpenOverlay, setIsOpenOverlay] = useState(false);

  const handleOverlayClose = useCallback(() => setIsOpenOverlay(false), []);

  useImperativeHandle(
    ref,
    () => {
      return { close: handleOverlayClose };
    },
    [handleOverlayClose]
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsOpenOverlay(true);
    });
  }, []);

  return (
    <OverlayElement
      isOpen={isOpenOverlay}
      close={handleOverlayClose}
      onExit={onExit}
      exit={onExit}
    />
  );
});

const OverlayContext = createContext<{
  mount(id: string, element: ReactNode): void;
  unmount(id: string): void;
} | null>(null);
if (process.env.NODE_ENV !== "production") {
  OverlayContext.displayName = "OverlayContext";
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlayById, setOverlayById] = useState<Map<string, ReactNode>>(
    new Map()
  );
  const mount = useCallback((id: string, element: ReactNode) => {
    setOverlayById((overlayById) => {
      const cloned = new Map(overlayById);
      cloned.set(id, element);
      return cloned;
    });
  }, []);

  const unmount = useCallback((id: string) => {
    setOverlayById((overlayById) => {
      const cloned = new Map(overlayById);
      cloned.delete(id);
      return cloned;
    });
  }, []);

  const context = useMemo(() => ({ mount, unmount }), [mount, unmount]);

  return (
    <OverlayContext.Provider value={context}>
      {children}
      {[...overlayById.entries()].map(([id, element]) => (
        <div key={id}>{element}</div>
      ))}
    </OverlayContext.Provider>
  );
}
