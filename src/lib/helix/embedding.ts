const DIM = 8;
const EPS = 1e-6;

function normalize(v: number[]): number[] {
  let n = 0;
  for (const x of v) n += x * x;
  n = Math.sqrt(n);
  if (n < EPS) return v;
  return v.map((x) => x / n);
}

export function embed(text: string): number[] {
  const acc = new Array(DIM).fill(0);
  const blob = (text || "").toLowerCase();
  const tokens = blob.match(/[a-z0-9]+/g) || [blob];
  let i = 0;

  for (const tok of tokens) {
    for (let n = 1; n <= 3; n++) {
      for (let k = 0; k <= Math.max(0, tok.length - n); k++) {
        const g = tok.slice(k, k + n);
        let h = 2166136261;
        for (let c = 0; c < g.length; c++) {
          h = Math.imul(h ^ g.charCodeAt(c), 16777619);
        }
        const idx = Math.abs(h) % DIM;
        const sign = h & 1 ? 1 : -1;
        acc[idx] += sign * (1 / (1 + i * 0.02));
        i += 1;
      }
    }
  }

  return normalize(acc);
}

export function embeddingDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < DIM; i++) {
    const delta = (a[i] || 0) - (b[i] || 0);
    sum += delta * delta;
  }
  return Math.sqrt(sum);
}

export const EMBEDDING_EPSILON = EPS;
