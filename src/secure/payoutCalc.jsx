export const calculatePayout = (
  initialBet,
  totalTiles = 25,
  totalBombs,
  safeTilesOpened,
  houseEdge = 1
) => {
  const totalSafeTiles = totalTiles - totalBombs;

  let payoutMultiplier = 1;
  for (let i = 0; i < safeTilesOpened; i++) {
    payoutMultiplier *= (totalTiles - i) / (totalSafeTiles - i);
  }

  const theoreticalPayout = initialBet * payoutMultiplier;

  const adjustedPayout = theoreticalPayout * (1 - houseEdge / 100);
  return adjustedPayout.toFixed(2);
};
