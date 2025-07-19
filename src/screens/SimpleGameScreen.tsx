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
import { SimpleBlock } from '../components/SimpleBlock';
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

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 10;

export const SimpleGameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    score: 0,
    bestScore: 0,
    currentBlocks: getRandomBlocks(3),
    gameOver: false,
  });
  
  const [selectedBlock, setSelectedBlock] = useState<BlockShape | null>(null);
  const [previewBoard, setPreviewBoard] = useState<number[][]>(initializeBoard());

  // 处理方块选择
  const handleBlockSelect = useCallback((block: BlockShape) => {
    if (gameState.gameOver) return;
    setSelectedBlock(block);
  }, [gameState.gameOver]);

  // 处理游戏板点击
  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (!selectedBlock || gameState.gameOver) return;

      // 检查是否可以放置方块
      if (canPlaceBlock(gameState.board, selectedBlock, row, col)) {
        // 放置方块
        let newBoard = placeBlock(gameState.board, selectedBlock, row, col);
        
        // 清除完整的行和列
        const { newBoard: clearedBoard, clearedLines } = clearCompleteLines(newBoard);
        
        // 计算分数
        const blockSize = getBlockSize(selectedBlock);
        const earnedScore = calculateScore(clearedLines, blockSize);
        
        // 移除已使用的方块
        const newBlocks = gameState.currentBlocks.filter(b => b.id !== selectedBlock.id);
        
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
        setSelectedBlock(null);
        setPreviewBoard(initializeBoard());
        
        // 显示分数提示
        if (earnedScore > 0) {
          Alert.alert('得分', `+${earnedScore} 分!`, [{ text: '继续' }]);
        }
      } else {
        Alert.alert('无法放置', '该位置无法放置选中的方块', [{ text: '确定' }]);
      }
    },
    [selectedBlock, gameState]
  );

  // 更新预览
  useEffect(() => {
    if (selectedBlock) {
      // 这里可以添加预览逻辑，暂时简化
      setPreviewBoard(gameState.board);
    } else {
      setPreviewBoard(gameState.board);
    }
  }, [selectedBlock, gameState.board]);

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      score: 0,
      bestScore: Math.max(gameState.score, gameState.bestScore),
      currentBlocks: getRandomBlocks(3),
      gameOver: false,
    });
    setSelectedBlock(null);
    setPreviewBoard(initializeBoard());
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
      <GameBoard board={previewBoard} onCellPress={handleCellPress} />

      {/* 选中方块提示 */}
      {selectedBlock && (
        <Text style={styles.selectedBlockText}>
          已选中方块，点击游戏板放置
        </Text>
      )}

      {/* 当前方块 */}
      <View style={styles.blocksContainer}>
        <Text style={styles.blocksTitle}>选择要放置的方块</Text>
        <View style={styles.blocksRow}>
          {gameState.currentBlocks.map((block, index) => (
            <View
              key={`${block.id}-${index}`}
              style={[
                styles.blockWrapper,
                selectedBlock?.id === block.id && styles.selectedBlockWrapper,
              ]}
            >
              <SimpleBlock
                block={block}
                cellSize={CELL_SIZE}
                onPress={handleBlockSelect}
                disabled={gameState.gameOver}
              />
            </View>
          ))}
        </View>
      </View>

      {/* 控制按钮 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setSelectedBlock(null)}
          disabled={!selectedBlock}
        >
          <Text style={styles.buttonText}>取消选择</Text>
        </TouchableOpacity>
        
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
  selectedBlockText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '600',
    marginVertical: 12,
    backgroundColor: '#FFF5F5',
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
    borderWidth: 3,
    borderColor: 'transparent',
    padding: 8,
    backgroundColor: '#F8F9FA',
  },
  selectedBlockWrapper: {
    borderColor: '#E74C3C',
    backgroundColor: '#FFF5F5',
    elevation: 2,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  cancelButton: {
    backgroundColor: '#95A5A6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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