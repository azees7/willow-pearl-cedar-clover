export type ContextLine = {
  content: string;
  mass: number;
  transient: boolean;
};

export type ContextChannel = {
  id: string;
  category: string;
  source: string;
  lines: ContextLine[];
};

export interface ContextProvider {
  id: string;
  get(query: string): ContextChannel[];
  status?: () => string;
}
