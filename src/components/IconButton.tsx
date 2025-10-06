import { ComponentProps } from "react";
import { Button } from "./ui/button";

export function IconButton({
  icon,
  ...props
}: ComponentProps<typeof Button> & { icon: React.ReactNode }) {
  return (
    <Button {...props}>
      <div className="w-4 h-4">{icon}</div>
    </Button>
  );
}
