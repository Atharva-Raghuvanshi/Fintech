export const ASSET_COLORS: Record<string, string> = {
  Equity: '#3B82F6',       // Blue
  'Mutual Funds': '#8B5CF6', // Violet
  Cash: '#10B981',         // Emerald/Green
  Gold: '#F59E0B',         // Amber
  Crypto: '#EC4899',       // Pink
  Silver: '#9CA3AF',       // Gray
  Bonds: '#06B6D4',        // Cyan
};

export const getAssetColor = (assetName: string) => {
  return ASSET_COLORS[assetName] || '#6B7280';
};
