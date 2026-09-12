/** Central scoring policy. Metric implementations will consume this in the engine stage. */
export const scoringConfig = {
  weights: {
    hierarchy: 0.24,
    readability: 0.2,
    safeZone: 0.16,
    collision: 0.16,
    visibility: 0.14,
    balance: 0.1,
  },
  maxScore: 100,
} as const
