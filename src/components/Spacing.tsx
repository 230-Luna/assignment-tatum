type SpacingProps = {
  size: number | string;
  direction?: "vertical" | "horizontal";
};

export function Spacing({ size, direction = "vertical" }: SpacingProps) {
  const style =
    direction === "vertical"
      ? { height: typeof size === "number" ? `${size}px` : size, width: "100%" }
      : {
          width: typeof size === "number" ? `${size}px` : size,
          height: "100%",
        };

  return (
    <div
      className={
        direction === "vertical" ? "flex-none w-full" : "flex-none h-full"
      }
      style={style}
    />
  );
}
