import { useId } from "react";

// Proposed vector silhouettes, not photographs of production products.
const silhouettes = [
  "M154 91 110 107 61 163 94 202 124 174 119 350 Q200 369 281 350 L276 174 306 202 339 163 290 107 246 91 226 79 174 79Z",
  "M155 71 175 65 182 90 Q200 101 218 90 L225 65 245 71 253 152 235 184 Q240 233 287 354 Q200 385 113 354 C140 293 164 228 165 184 L147 152Z",
  "M107 80 Q167 65 232 89 L287 305 252 359 195 350 157 220 120 330 84 303 137 155Z",
  "M105 146 Q200 131 295 146 L311 331 Q200 368 89 331Z",
  "M125 146 Q125 103 200 101 Q275 103 275 146 L291 230 Q328 250 329 275 Q200 310 71 275 Q72 250 109 230Z",
  "M83 153 Q85 142 100 142 L295 142 Q310 143 311 158 L311 282 Q309 296 294 296 L98 296 Q83 294 83 281Z",
];

export function CollectionArtwork({ id, className = "" }: { id: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const sage = id === 1 || id === 4;
  const fabric = `${uid}-fabric`;
  const weave = `${uid}-weave`;
  const clip = `${uid}-clip`;

  return (
    <svg className={`collection-object collection-object-${id} ${className}`} viewBox="0 0 400 440" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={fabric} x1="85" y1="110" x2="310" y2="345" gradientUnits="userSpaceOnUse">
          <stop stopColor={sage ? "#becab1" : "#f9f4e6"} />
          <stop offset=".38" stopColor={sage ? "#98ad90" : "#e8ddc4"} />
          <stop offset=".68" stopColor={sage ? "#afbea2" : "#faf3e3"} />
          <stop offset="1" stopColor={sage ? "#778e71" : "#cdbd9d"} />
        </linearGradient>
        <pattern id={weave} width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 1H5M1 0V5" stroke={sage ? "#4b6549" : "#8b7857"} strokeOpacity=".18" strokeWidth=".55" />
          <path d="M0 3H5M3 0V5" stroke="#fff" strokeOpacity=".3" strokeWidth=".65" />
        </pattern>
        <clipPath id={clip}><path d={silhouettes[id]} /></clipPath>
      </defs>
      <g className="collection-object-body">
        {id === 3 && <><path d="M139 158V108C139 35 261 35 261 108V158" stroke="#a99570" strokeWidth="15" /><path d="M139 158V108C139 35 261 35 261 108V158" stroke="#efe5cd" strokeWidth="10" /><path d="M139 158V108C139 35 261 35 261 108V158" stroke="#baa98a" strokeWidth="1" strokeDasharray="2 3" /></>}
        <path d={silhouettes[id]} fill={`url(#${fabric})`} stroke={sage ? "#74866b" : "#b7a585"} strokeWidth="1.3" strokeLinejoin="round" />
        <path d={silhouettes[id]} fill={`url(#${weave})`} />
        <g clipPath={`url(#${clip})`} stroke={sage ? "#617758" : "#b3a180"} strokeWidth="1.1" strokeOpacity=".65">
          {id === 0 && <>
            <path d="M154 91 175 129 200 101 226 129 246 91M200 103V364M207 132V359M125 174 137 111M276 174 263 112M122 340Q200 358 278 340M63 161 99 190M301 190 337 161" />
            <path d="M154 91 175 126 197 101 177 81ZM246 91 226 126 203 101 223 81Z" fill="#e9dec7" strokeOpacity=".8" />
            <path d="M222 160H260V203Q239 214 222 203Z" fill="#eadfc9" /><path d="M223 164H259M222 168H260" />
            {[147, 183, 219, 255, 291, 327].map(y => <circle key={y} cx="202" cy={y} r="2.7" fill="#f8f3e7" />)}
            <path d="M142 219Q138 282 145 330M265 212Q256 262 262 334" strokeWidth="2" strokeOpacity=".22" />
          </>}
          {id === 1 && <><path d="M164 178Q200 194 236 178M163 183Q200 199 237 183M177 91Q200 110 223 91M120 348Q200 376 280 348M174 207 150 352M189 210 178 361M213 210 222 361M230 207 254 352" /><path d="M174 73 180 90M226 73 220 90" strokeWidth="4" /><path d="M174 186Q152 204 143 215M228 188Q255 202 260 215" /><path d="M177 199Q198 212 229 197" strokeWidth="4" strokeOpacity=".17" /></>}
          {id === 2 && <><path d="M121 84 205 329M143 80 232 345M168 80 257 340M139 162 118 302M150 194 128 317" strokeWidth="3" strokeOpacity=".25" /><path d="M94 290 122 315M201 337 266 341M98 282 124 307M199 330 270 333" strokeDasharray="1 3" strokeWidth="5" /></>}
          {id === 3 && <><path d="M106 159Q200 145 294 159M100 324Q200 356 301 324M120 159 111 325M281 159 290 325" /><path d="M137 144V170M263 144V170" strokeWidth="12" strokeOpacity=".28" /><path d="M165 207H235V268Q200 277 165 268Z" fill="#e9ddc1" /><path d="M169 212H231" strokeDasharray="3 2" /></>}
          {id === 4 && <><path d="M126 150Q200 167 274 150M111 229Q200 252 290 229M110 235Q200 259 291 235M78 271Q200 301 322 271M89 260Q200 287 311 260M107 249Q200 273 293 249M146 113 133 230M254 113 267 230" /><path d="M153 112Q200 124 247 112" strokeOpacity=".22" /></>}
          {id === 5 && <><path d="M90 155H304V282H90ZM86 200H309M91 205H304" strokeDasharray="3 3" /><path d="M86 158 122 202H280L306 158" fill="#eee4cd" /><path d="M261 202V261H310" strokeWidth="2" /><path d="M104 222H228M104 247H203" strokeOpacity=".2" /><circle cx="274" cy="228" r="5" fill="#aa9061" /></>}
        </g>
        {(id === 0 || id === 3 || id === 5) && <g transform={id === 0 ? "translate(230 187)" : id === 3 ? "translate(188 229)" : "translate(173 262)"}><rect width="25" height="13" rx="1" fill="#e7dbc0" /><path d="M6 9V4L12 9V4M16 9V4H20" stroke="#6c795d" strokeWidth=".9" /></g>}
        {id === 2 && <g stroke="#b3a180" strokeWidth="1.2">{Array.from({ length: 15 }, (_, i) => <path key={i} d={`M${197 + i * 4} ${349 + i * .45}l${i % 2 ? 3 : -2} ${12 + i % 4 * 2}`} />)}{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${84 + i * 4} ${301 + i * 3}l-4 13`} />)}</g>}
      </g>
    </svg>
  );
}
