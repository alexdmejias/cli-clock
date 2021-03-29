export interface IClock {
  rows: number;
  columns: number;
  currentSet: characterSet;
  font: font;
  fc: string;
  bc: string;
  coin: string;
  twelveHourFormat: boolean;
}

export type font = {
  name: string;
  width: number;
  height: number;
  padding: number;
  characters: Record<string, string[]>;
}

export type characterSet = [string, string]

export type cliArgs = {
  background?: string;
  foreground?: string;
  colors?: unknown; // TODO
  font?: string; // TODO
  twelveHours?: boolean;
  coin?: string;
  interval?: number;
}
