import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./isa";

export type Dir = 1 | 2 | 3 | 4; // U D L R
export type SnakeState = {
  length: number;
  segments: [number, number][];
  food: [number, number];
  direction: Dir;
  score: number;
  alive: boolean;
};

const KEY_TO_DIR: Record<string, Dir> = {
  ArrowUp: 1,
  w: 1,
  W: 1,
  ArrowDown: 2,
  s: 2,
  S: 2,
  ArrowLeft: 3,
  a: 3,
  A: 3,
  ArrowRight: 4,
  d: 4,
  D: 4,
};

const DELTA: Record<Dir, [number, number]> = {
  1: [0, -1],
  2: [0, 1],
  3: [-1, 0],
  4: [1, 0],
};

export function defaultSnake(): SnakeState {
  return {
    length: 3,
    segments: [
      [10, 5],
      [9, 5],
      [8, 5],
    ],
    food: [15, 5],
    direction: 4,
    score: 0,
    alive: true,
  };
}

export function parseSnake(raw: string): SnakeState {
  try {
    const parsed = JSON.parse(raw) as Partial<SnakeState>;
    const base = defaultSnake();
    return {
      ...base,
      ...parsed,
      segments: parsed.segments?.length ? parsed.segments : base.segments,
      food: parsed.food ?? base.food,
      direction: (parsed.direction as Dir) || 4,
      alive: parsed.alive !== false,
    };
  } catch {
    return defaultSnake();
  }
}

function occupancy(state: SnakeState) {
  const set = new Set(state.segments.map(([x, y]) => `${x},${y}`));
  return set;
}

function spawnFood(state: SnakeState): [number, number] {
  const taken = occupancy(state);
  for (let i = 0; i < 200; i++) {
    const x = Math.floor(Math.random() * SCREEN_WIDTH);
    const y = Math.floor(Math.random() * SCREEN_HEIGHT);
    if (!taken.has(`${x},${y}`)) return [x, y];
  }
  return [0, 0];
}

export function turnSnake(state: SnakeState, key: string): SnakeState {
  const next = KEY_TO_DIR[key];
  if (!next || !state.alive) return state;
  const opp: Record<Dir, Dir> = { 1: 2, 2: 1, 3: 4, 4: 3 };
  if (opp[state.direction] === next) return state;
  return { ...state, direction: next };
}

export function stepSnake(state: SnakeState): SnakeState {
  if (!state.alive) return state;
  const [dx, dy] = DELTA[state.direction];
  const [hx, hy] = state.segments[0];
  const nx = hx + dx;
  const ny = hy + dy;
  if (nx < 0 || ny < 0 || nx >= SCREEN_WIDTH || ny >= SCREEN_HEIGHT) {
    return { ...state, alive: false };
  }
  const taken = occupancy(state);
  if (taken.has(`${nx},${ny}`)) return { ...state, alive: false };
  const ate = nx === state.food[0] && ny === state.food[1];
  const segments: [number, number][] = [[nx, ny], ...state.segments];
  if (!ate) segments.pop();
  const next: SnakeState = {
    ...state,
    segments,
    length: segments.length,
    score: state.score + (ate ? 1 : 0),
    food: ate ? spawnFood({ ...state, segments }) : state.food,
  };
  return next;
}

export function renderSnake(state: SnakeState): string[] {
  const rows = Array.from({ length: SCREEN_HEIGHT }, () =>
    Array.from({ length: SCREEN_WIDTH }, () => " "),
  );
  const [fx, fy] = state.food;
  if (rows[fy]) rows[fy][fx] = "*";
  state.segments.forEach(([x, y], i) => {
    if (!rows[y]) return;
    rows[y][x] = i === 0 ? (state.alive ? "@" : "X") : "o";
  });
  return rows.map((r) => r.join(""));
}
