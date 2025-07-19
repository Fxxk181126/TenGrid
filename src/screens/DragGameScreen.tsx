import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { DraggableBlockNew } from '../components/DraggableBlockNew';
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
} from '../utils/GameLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 10;

export const DragGameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    score: 0,
    bestScore: 0,
    currentBlocks: getRandomBlocks(3),
    gameOver: false,
  });
  
  const gameboardRef = useRef<View>(null);

  // 加载最高分
  useEffect(() => {
    loadBestScore();
  }, []);

  const loadBestScore = async () => {
    try {
      const savedBestScore = await AsyncStorage.getItem('bestScore');
      if (savedBestScore) {
        setGameState(prev => ({ ...prev, bestScore: parseInt(savedBestScore) }));
      }
    } catch (error) {
      console.log('加载最高分失败:', error);
    }
  };

  const saveBestScore = async (score: number) => {
    try {
      await AsyncStorage.setItem('bestScore', score.toString());
    } catch (error) {
      console.log('保存最高分失败:', error);
    }
  };

  // 处理方块拖拽放置
  const handleBlockDrop = useCallback(
    (block: BlockShape, dropX: number, dropY: number) => {
      if (gameState.gameOver) return;

      // 获取游戏板的实际位置
      if (gameboardRef.current) {
        gameboardRef.current.measure((x, y, width, height, pageX, pageY) => {
          // 计算放置位置（相对于游戏板）
          const boardRelativeX = dropX - pageX;
          const boardRelativeY = dropY - pageY;
          
          // 转换为游戏板坐标
          const col = Math.floor(boardRelativeX / CELL_SIZE);
          const row = Math.floor(boardRelativeY / CELL_SIZE);

          console.log('拖拽坐标调试:', {
            dropX, dropY, pageX, pageY,
            boardRelativeX, boardRelativeY,
            row, col, CELL_SIZE,
            blockPattern: block.pattern
          });

          // 检查是否在游戏板范围内
          if (row < 0 || row >= 10 || col < 0 || col >= 10) {
            console.log('超出游戏板范围:', { row, col });
            return; // 不在游戏板范围内，不做任何操作
          }

          // 检查是否可以放置方块并执行放置逻辑
          performBlockPlacement(block, row, col);
        });
      }
    },
    [gameState]
  );

  // 执行方块放置的具体逻辑
  const performBlockPlacement = useCallback(
    (block: BlockShape, row: number, col: number) => {

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
        const newScore = gameState.score + earnedScore;
        const newBestScore = Math.max(newScore, gameState.bestScore);
        
        const newGameState = {
          ...gameState,
          board: clearedBoard,
          score: newScore,
          bestScore: newBestScore,
          currentBlocks: finalBlocks,
        };
        
        // 检查游戏是否结束
        if (isGameOver(clearedBoard, finalBlocks)) {
          newGameState.gameOver = true;
          
          // 保存最高分
          if (newScore > gameState.bestScore) {
            saveBestScore(newScore);
          }
          
          // 延迟显示游戏结束提示，让用户看到最后的放置效果
          setTimeout(() => {
            Alert.alert(
              '游戏结束！',
              `无法继续放置方块\n\n最终分数: ${newScore}\n最高分: ${newBestScore}`,
              [
                { text: '重新开始', onPress: resetGame },
                { text: '确定', style: 'cancel' },
              ]
            );
          }, 500);
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
        {/* 标题 */}
        <View style={styles.header}>
          <Text style={styles.title}>十方世界</Text>
          <Text style={styles.subtitle}>TenGrid World</Text>
        </View>

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
        <View 
          ref={gameboardRef}
          style={styles.gameboardContainer}
        >
          <GameBoard board={gameState.board} />
        </View>

        {/* 操作提示 */}
        <Text style={styles.instructionText}>
          拖拽方块到游戏板上放置
        </Text>

        {/* 当前方块 */}
        <View style={styles.blocksContainer}>
          <Text style={styles.blocksTitle}>可用方块</Text>
          <View style={styles.blocksRow}>
            {gameState.currentBlocks.map((block, index) => (
              <View key={`${block.id}-${index}`} style={styles.blockWrapper}>
                <DraggableBlockNew
                  block={block}
                  cellSize={CELL_SIZE}
                  onDrop={handleBlockDrop}
                  disabled={gameState.gameOver}
                />
              </View>
            ))}
          </View>
        </View>

        {/* 控制按钮 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.buttonText}>重新开始</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 6,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  gameboardContainer: {
    marginTop: 20,
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '600',
    marginVertical: 12,
    backgroundColor: '#EBF3FD',
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  blocksContainer: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  blocksTitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  blocksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  blockWrapper: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    padding: 8,
    backgroundColor: '#F8F9FA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  resetButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});