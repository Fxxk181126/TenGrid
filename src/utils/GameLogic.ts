import { BlockShape } from '../types/BlockTypes';

export interface GameState {
  board: string[][]; // 存储颜色信息，空格子为空字符串
  score: number;
  bestScore: number;
  currentBlocks: BlockShape[];
  gameOver: boolean;
}

// 初始化游戏板
export const initializeBoard = (): string[][] => {
  return Array(10).fill(null).map(() => Array(10).fill(''));
};

// 检查方块是否可以放置在指定位置
export const canPlaceBlock = (
  board: string[][],
  block: BlockShape,
  startRow: number,
  startCol: number
): boolean => {
  const { pattern } = block;
  
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col] === 1) {
        const boardRow = startRow + row;
        const boardCol = startCol + col;
        
        // 检查是否超出边界
        if (boardRow < 0 || boardRow >= 10 || boardCol < 0 || boardCol >= 10) {
          return false;
        }
        
        // 检查位置是否已被占用
        if (board[boardRow][boardCol] !== '') {
          return false;
        }
      }
    }
  }
  
  return true;
};

// 在游戏板上放置方块
export const placeBlock = (
  board: string[][],
  block: BlockShape,
  startRow: number,
  startCol: number
): string[][] => {
  const newBoard = board.map(row => [...row]);
  const { pattern, color } = block;
  
  console.log('placeBlock执行:', {
    blockId: block.id,
    pattern,
    color,
    startRow,
    startCol
  });
  
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col] === 1) {
        const boardRow = startRow + row;
        const boardCol = startCol + col;
        console.log(`放置单元格: (${boardRow}, ${boardCol}) = ${color}`);
        newBoard[boardRow][boardCol] = color; // 存储方块的颜色
      }
    }
  }
  
  return newBoard;
};

// 检查并清除完整的行和列
export const clearCompleteLines = (board: string[][]): { newBoard: string[][], clearedLines: number } => {
  let newBoard = board.map(row => [...row]);
  let clearedLines = 0;
  
  console.log('开始检查完整行列');
  
  // 检查并清除完整的行
  for (let row = 0; row < 10; row++) {
    if (newBoard[row].every(cell => cell !== '')) {
      console.log('清除完整行:', row);
      newBoard[row] = Array(10).fill('');
      clearedLines++;
    }
  }
  
  // 检查并清除完整的列
  for (let col = 0; col < 10; col++) {
    if (newBoard.every(row => row[col] !== '')) {
      console.log('清除完整列:', col);
      for (let row = 0; row < 10; row++) {
        newBoard[row][col] = '';
      }
      clearedLines++;
    }
  }
  
  console.log('清除完成，总清除行列数:', clearedLines);
  return { newBoard, clearedLines };
};

// 计算分数
export const calculateScore = (clearedLines: number, blockSize: number): number => {
  let score = blockSize * 10; // 放置方块的基础分数
  
  if (clearedLines > 0) {
    score += clearedLines * 100; // 每清除一行/列获得100分
    
    // 连击奖励
    if (clearedLines > 1) {
      score += (clearedLines - 1) * 50; // 额外奖励
    }
  }
  
  return score;
};

// 检查游戏是否结束
export const isGameOver = (board: string[][], blocks: BlockShape[]): boolean => {
  // 检查是否还有任何方块可以放置
  for (const block of blocks) {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (canPlaceBlock(board, block, row, col)) {
          return false;
        }
      }
    }
  }
  return true;
};

// 获取方块的大小（占用的格子数）
export const getBlockSize = (block: BlockShape): number => {
  let size = 0;
  for (const row of block.pattern) {
    for (const cell of row) {
      if (cell === 1) {
        size++;
      }
    }
  }
  return size;
};

// 坐标转换：将屏幕坐标转换为游戏板坐标
export const screenToBoard = (
  screenX: number,
  screenY: number,
  boardStartX: number,
  boardStartY: number,
  cellSize: number
): { row: number, col: number } => {
  const col = Math.floor((screenX - boardStartX) / cellSize);
  const row = Math.floor((screenY - boardStartY) / cellSize);
  return { row, col };
};