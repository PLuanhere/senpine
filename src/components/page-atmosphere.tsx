export function PageAtmosphere({ variant }: { variant: "careers" | "contact" }) {
  return <div className={`page-atmosphere page-atmosphere-${variant}`} aria-hidden="true">
    <div className="atmosphere-orbit atmosphere-orbit-one" /><div className="atmosphere-orbit atmosphere-orbit-two" />
    <svg className="atmosphere-lines" viewBox="0 0 1200 750" fill="none" preserveAspectRatio="xMidYMid slice">{Array.from({ length: 6 }, (_, index) => <path key={index} d={`M-80 ${570 + index * 19}C${210 + index * 15} ${140 + index * 20} ${750 + index * 18} ${920 - index * 30} 1290 ${180 + index * 19}`} pathLength="1" stroke="currentColor" strokeWidth=".8" />)}</svg>
    {[0, 1, 2, 3].map((index) => <span className={`atmosphere-seed atmosphere-seed-${index}`} key={index} />)}
    <span className="atmosphere-flower">✳</span>
  </div>;
}
