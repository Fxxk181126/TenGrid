// 方块形状定义
export interface BlockShape {
  id: string;
  pattern: number[][]; // 二维数组表示方块形状，1表示有方块，0表示空
  color: string;
}

// 预定义的方块形状
export const BLOCK_SHAPES: BlockShape[] = [
  // 单个方块
  {
    id: 'single',
    pattern: [[1]],
    color: '#FF6B6B',
  },
  // 2x1 直线
  {
    id: 'line2',
    pattern: [[1, 1]],
    color: '#4ECDC4',
  },
  // 3x1 直线
  {
    id: 'line3',
    pattern: [[1, 1, 1]],
    color: '#45B7D1',
  },
  // 4x1 直线
  {
    id: 'line4',
    pattern: [[1, 1, 1, 1]],
    color: '#96CEB4',
  },
  // 5x1 直线
  {
    id: 'line5',
    pattern: [[1, 1, 1, 1, 1]],
    color: '#FFEAA7',
  },
  // 竖直2x1
  {
    id: 'vline2',
    pattern: [[1], [1]],
    color: '#DDA0DD',
  },
  // 竖直3x1
  {
    id: 'vline3',
    pattern: [[1], [1], [1]],
    color: '#98D8C8',
  },
  // 竖直4x1
  {
    id: 'vline4',
    pattern: [[1], [1], [1], [1]],
    color: '#F7DC6F',
  },
  // 竖直5x1
  {
    id: 'vline5',
    pattern: [[1], [1], [1], [1], [1]],
    color: '#BB8FCE',
  },
  // 2x2 方形
  {
    id: 'square2',
    pattern: [
      [1, 1],
      [1, 1],
    ],
    color: '#F39C12',
  },
  // 3x3 方形
  {
    id: 'square3',
    pattern: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: '#E74C3C',
  },
  // L形状
  {
    id: 'L1',
    pattern: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: '#9B59B6',
  },
  // 反L形状
  {
    id: 'L2',
    pattern: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: '#3498DB',
  },
  // T形状
  {
    id: 'T1',
    pattern: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#2ECC71',
  },
  // 倒T形状
  {
    id: 'T2',
    pattern: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#E67E22',
  },
];

// 随机获取方块形状
export const getRandomBlockShape = (): BlockShape => {
  const randomIndex = Math.floor(Math.random() * BLOCK_SHAPES.length);
  return BLOCK_SHAPES[randomIndex];
};

// 获取指定数量的随机方块
export const getRandomBlocks = (count: number): BlockShape[] => {
  const blocks: BlockShape[] = [];
  for (let i = 0; i < count; i++) {
    blocks.push(getRandomBlockShape());
  }
  return blocks;
};