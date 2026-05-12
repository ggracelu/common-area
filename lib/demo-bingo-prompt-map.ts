import { demoData } from "@/lib/demo-data";

const challengeTiles = () => demoData.bingoTiles.filter((tile) => tile.kind === "challenge");

export function getChallengeTileIndex(tileId: string): number {
  return challengeTiles().findIndex((tile) => tile.id === tileId);
}

export function getDemoChallengeTileIdByOneBasedOrder(order: number): string | null {
  return challengeTiles()[order - 1]?.id ?? null;
}
