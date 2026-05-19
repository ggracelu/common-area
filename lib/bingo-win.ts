import type { DemoBingoTile } from "@/lib/demo-data";

export type BingoLineType = "row" | "col" | "diagonal";

export type BingoLine = {
  type: BingoLineType;
  index: number;
  /** Tile indices 0–24 in row-major order on the 5×5 board. */
  cells: number[];
};

const ROWS = 5;
const COLS = 5;

export function isTileMarked(tile: DemoBingoTile, completedTileIds: string[]): boolean {
  if (tile.kind === "free") return true;
  return completedTileIds.includes(tile.id);
}

export function getMarkedIndices(tiles: readonly DemoBingoTile[], completedTileIds: string[]): Set<number> {
  const marked = new Set<number>();
  tiles.forEach((tile, index) => {
    if (isTileMarked(tile, completedTileIds)) marked.add(index);
  });
  return marked;
}

export function detectBingoLines(marked: Set<number>): BingoLine[] {
  const lines: BingoLine[] = [];

  for (let row = 0; row < ROWS; row += 1) {
    const cells = Array.from({ length: COLS }, (_, col) => row * COLS + col);
    if (cells.every((index) => marked.has(index))) {
      lines.push({ type: "row", index: row, cells });
    }
  }

  for (let col = 0; col < COLS; col += 1) {
    const cells = Array.from({ length: ROWS }, (_, row) => row * COLS + col);
    if (cells.every((index) => marked.has(index))) {
      lines.push({ type: "col", index: col, cells });
    }
  }

  const diagonalMain = [0, 6, 12, 18, 24];
  const diagonalAnti = [4, 8, 12, 16, 20];
  if (diagonalMain.every((index) => marked.has(index))) {
    lines.push({ type: "diagonal", index: 0, cells: diagonalMain });
  }
  if (diagonalAnti.every((index) => marked.has(index))) {
    lines.push({ type: "diagonal", index: 1, cells: diagonalAnti });
  }

  return lines;
}

export function getWinningCellIndices(lines: BingoLine[]): Set<number> {
  const cells = new Set<number>();
  for (const line of lines) {
    for (const index of line.cells) cells.add(index);
  }
  return cells;
}
