export const ASSET_COLORS: Record<string, string> = {
  Equity: '#3B82F6',       // Blue
  'Mutual Funds': '#8B5CF6', // Violet
  Cash: '#0EA5E9',         // Sky Blue (Separated from semantic green)
  Gold: '#FDE047',         // Bright Yellow (Separated from semantic amber)
  Crypto: '#EC4899',       // Pink
  Silver: '#94A3B8',       // Slate
  Bonds: '#6366F1',        // Indigo
};

export const getAssetColor = (assetName: string) => {
  return ASSET_COLORS[assetName] || '#6B7280';
};
