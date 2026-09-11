export function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-55 opacity-[0.06]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0px, transparent 1px, transparent 2px)",
      }}
    />
  );
}
