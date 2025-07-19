import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameCell } from './GameCell';

interface GameBoardProps {
  board: string[][];
  onCellPress?: (row: number, col: number) => void;
}

const { width } = Dimensions.get('window');
const BOARD_SIZE = 10;
const CELL_SIZE = (width - 40) / BOARD_SIZE; // 减去边距

export const GameBoard: React.FC<GameBoardProps> = ({ board, onCellPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              row={rowIndex}
              col={colIndex}
              size={CELL_SIZE}
              onPress={onCellPress}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  board: {
    width: BOARD_SIZE * CELL_SIZE,
    height: BOARD_SIZE * CELL_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 3,
    borderColor: '#BDC3C7',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
});