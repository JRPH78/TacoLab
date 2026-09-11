import { REACTIVO } from "../utilities/PaleteColors";
/** Textura de cuaderno de laboratorio: retícula milimetrada, casi invisible. */
export function NotebookGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
      style={{
        backgroundImage: `linear-gradient(${REACTIVO} 1px, transparent 1px), linear-gradient(90deg, ${REACTIVO} 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
      }}
    />
  );
}
