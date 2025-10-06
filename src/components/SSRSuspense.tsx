import { useIsMounted } from "@/hooks/useIsMounted";
import { ComponentProps, Suspense } from "react";

export function SSRSuspense(props: ComponentProps<typeof Suspense>) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return props.fallback ?? <></>;
  }

  return <Suspense {...props} />;
}
