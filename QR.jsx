import { hash } from "../utils";

export function QR({ seed, size = 108 }) {
  let h = hash(seed) || 1; const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  const N = 21, cells = [];
  const fin = (x, y) => { for (const [ox, oy] of [[0, 0], [14, 0], [0, 14]]) { const lx = x - ox, ly = y - oy; if (lx >= 0 && lx <= 6 && ly >= 0 && ly <= 6) return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4); if (lx >= -1 && lx <= 7 && ly >= -1 && ly <= 7) return false; } return null; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const f = fin(x, y); const on = f === null ? rnd() > 0.52 : f; if (on) cells.push(<rect key={x + "-" + y} x={x} y={y} width="1" height="1" />); }
  return <svg width={size} height={size} viewBox="0 0 21 21" fill="#121A33" shapeRendering="crispEdges" role="img" aria-label="Ticket code">{cells}</svg>;
}
