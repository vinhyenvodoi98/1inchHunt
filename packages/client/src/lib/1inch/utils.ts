/**
 * Gets token icon/emoji based on symbol or name
 */
export function getTokenIcon(symbol: string, name: string): string {
  const symbolLower = symbol.toLowerCase();
  const nameLower = name.toLowerCase();

  const tokenIcons: { [key: string]: string } = {
    'eth': '🔵',
    'ethereum': '🔵',
    'btc': '🟡',
    'bitcoin': '🟡',
    'usdc': '💙',
    'usdt': '💚',
    'dai': '🟡',
    'matic': '🟣',
    'polygon': '🟣',
    'link': '🔗',
    'chainlink': '🔗',
    'uni': '🦄',
    'uniswap': '🦄',
    'aave': '🟢',
    'comp': '🔵',
    'compound': '🔵',
    'sushi': '🍣',
    'sushiswap': '🍣',
    'crv': '🟠',
    'curve': '🟠',
    'bal': '🔵',
    'balancer': '🔵',
    'yfi': '🟡',
    'yearn': '🟡',
    'snx': '🟣',
    'synthetix': '🟣',
    'ren': '🟢',
    'renvm': '🟢',
    '1inch': '🔵',
    'wbtc': '🟡',
    'weth': '🔵',
  };

  if (tokenIcons[symbolLower]) {
    return tokenIcons[symbolLower];
  }

  if (tokenIcons[nameLower]) {
    return tokenIcons[nameLower];
  }

  if (nameLower.includes('usd') || nameLower.includes('stable')) {
    return '💵';
  }
  if (nameLower.includes('wrapped') || nameLower.includes('w')) {
    return '📦';
  }
  if (nameLower.includes('governance') || nameLower.includes('gov')) {
    return '🗳️';
  }
  if (nameLower.includes('liquidity') || nameLower.includes('lp')) {
    return '💧';
  }

  return '🪙';
}

/**
 * Gets token color gradient based on symbol or name
 */
export function getTokenColor(symbol: string, name: string): string {
  const symbolLower = symbol.toLowerCase();
  const nameLower = name.toLowerCase();

  const tokenColors: { [key: string]: string } = {
    'eth': 'from-blue-400 to-blue-600',
    'ethereum': 'from-blue-400 to-blue-600',
    'btc': 'from-yellow-400 to-orange-500',
    'bitcoin': 'from-yellow-400 to-orange-500',
    'usdc': 'from-blue-400 to-cyan-500',
    'usdt': 'from-green-400 to-green-600',
    'dai': 'from-yellow-400 to-yellow-600',
    'matic': 'from-purple-400 to-purple-600',
    'polygon': 'from-purple-400 to-purple-600',
    'link': 'from-blue-500 to-blue-700',
    'chainlink': 'from-blue-500 to-blue-700',
    'uni': 'from-pink-400 to-purple-600',
    'uniswap': 'from-pink-400 to-purple-600',
    'aave': 'from-green-400 to-green-600',
    'comp': 'from-blue-400 to-blue-600',
    'compound': 'from-blue-400 to-blue-600',
    'sushi': 'from-pink-400 to-red-500',
    'sushiswap': 'from-pink-400 to-red-500',
    'crv': 'from-orange-400 to-orange-600',
    'curve': 'from-orange-400 to-orange-600',
    'bal': 'from-blue-400 to-blue-600',
    'balancer': 'from-blue-400 to-blue-600',
    'yfi': 'from-yellow-400 to-yellow-600',
    'yearn': 'from-yellow-400 to-yellow-600',
    'snx': 'from-purple-400 to-purple-600',
    'synthetix': 'from-purple-400 to-purple-600',
    'ren': 'from-green-400 to-green-600',
    'renvm': 'from-green-400 to-green-600',
    '1inch': 'from-blue-400 to-blue-600',
    'wbtc': 'from-yellow-400 to-orange-500',
    'weth': 'from-blue-400 to-blue-600',
  };

  if (tokenColors[symbolLower]) {
    return tokenColors[symbolLower];
  }

  if (tokenColors[nameLower]) {
    return tokenColors[nameLower];
  }

  if (nameLower.includes('usd') || nameLower.includes('stable')) {
    return 'from-green-400 to-green-600';
  }
  if (nameLower.includes('wrapped') || nameLower.includes('w')) {
    return 'from-gray-400 to-gray-600';
  }
  if (nameLower.includes('governance') || nameLower.includes('gov')) {
    return 'from-purple-400 to-purple-600';
  }
  if (nameLower.includes('liquidity') || nameLower.includes('lp')) {
    return 'from-blue-400 to-cyan-500';
  }

  return 'from-gray-400 to-gray-600';
}