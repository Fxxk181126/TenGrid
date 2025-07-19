import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { GameBoard } from '../components/GameBoard';
import { DraggableBlock } from '../components/DraggableBlock';
import { BlockShape, getRandomBlocks } from '../types/BlockTypes';
import {
  GameState,
  initializeBoard,
  canPlaceBlock,
  placeBlock,
  clearCompleteLines,
  calculateScore,
  isGameOver,
  getBlockSize,
  screenToBoard,
} from '../utils/GameLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 10;
const BOARD_START_Y = height * 0.2; // 游戏板开始的Y坐标

export const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    score: 0,
    bestScore: 0,
    currentBlocks: getRandomBlocks(3),
    gameOver: false,
  });

  // 加载最高分
  useEffect(() => {
    loadBestScore();
  }, []);

  // 保存最高分
  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      saveBestScore(gameState.score);
      setGameState(prev => ({ ...prev, bestScore: gameState.score }));
    }
  }, [gameState.score]);

  const loadBestScore = async () => {
    try {
      const bestScore = await AsyncStorage.getItem('bestScore');
      if (bestScore !== null) {
        setGameState(prev => ({ ...prev, bestScore: parseInt(bestScore, 10) }));
      }
    } catch (error) {
      console.error('加载最高分失败:', error);
    }
  };

  const saveBestScore = async (score: number) => {
    try {
      await AsyncStorage.setItem('bestScore', score.toString());
    } catch (error) {
      console.error('保存最高分失败:', error);
    }
  };

  const handleBlockDrop = useCallback(
    (x: number, y: number, block: BlockShape) => {
      if (gameState.gameOver) return;

      // 将屏幕坐标转换为游戏板坐标
      const { row, col } = screenToBoard(x, y, 20, BOARD_START_Y, CELL_SIZE);

      // 检查是否可以放置方块
      if (canPlaceBlock(gameState.board, block, row, col)) {
        // 放置方块
        let newBoard = placeBlock(gameState.board, block, row, col);
        
        // 清除完整的行和列
        const { newBoard: clearedBoard, clearedLines } = clearCompleteLines(newBoard);
        
        // 计算分数
        const blockSize = getBlockSize(block);
        const earnedScore = calculateScore(clearedLines, blockSize);
        
        // 移除已使用的方块
        const newBlocks = gameState.currentBlocks.filter(b => b.id !== block.id);
        
        // 如果所有方块都用完了，生成新的方块
        const finalBlocks = newBlocks.length === 0 ? getRandomBlocks(3) : newBlocks;
        
        // 更新游戏状态
        const newGameState = {
          ...gameState,
          board: clearedBoard,
          score: gameState.score + earnedScore,
          currentBlocks: finalBlocks,
        };
        
        // 检查游戏是否结束
        if (isGameOver(clearedBoard, finalBlocks)) {
          newGameState.gameOver = true;
          Alert.alert(
            '游戏结束',
            `最终分数: ${newGameState.score}\n最高分: ${Math.max(newGameState.score, gameState.bestScore)}`,
            [
              { text: '重新开始', onPress: resetGame },
              { text: '确定', style: 'cancel' },
            ]
          );
        }
        
        setGameState(newGameState);
      }
    },
    [gameState]
  );

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      score: 0,
      bestScore: gameState.bestScore,
      currentBlocks: getRandomBlocks(3),
      gameOver: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 分数显示 */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>分数</Text>
          <Text style={styles.scoreValue}>{gameState.score}</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>最高分</Text>
          <Text style={styles.scoreValue}>{gameState.bestScore}</Text>
        </View>
      </View>

      {/* 游戏板 */}
      <GameBoard board={gameState.board} />

      {/* 当前方块 */}
      <View style={styles.blocksContainer}>
        <View style={styles.blocksRow}>
          {gameState.currentBlocks.map((block, index) => (
            <DraggableBlock
              key={`${block.id}-${index}`}
              block={block}
              cellSize={CELL_SIZE}
              onDragEnd={handleBlockDrop}
              disabled={gameState.gameOver}
            />
          ))}
        </View>
      </View>

      {/* 重新开始按钮 */}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>重新开始</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  blocksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  blocksTitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  blocksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  resetButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 30,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});