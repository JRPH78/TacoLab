import { OUTFIT, PAPEL } from "../utilities/PaleteColors";
export default function Watermark({ label, top }: { label: string; top: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-[38vw] font-black italic leading-none md:text-[22vw]"
      style={{ top, color: PAPEL, opacity: 0.035, fontFamily: OUTFIT }}
    >
      {label}
    </span>
  );
}
