import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlockShape } from '../types/BlockTypes';

interface SimpleBlockProps {
  block: BlockShape;
  cellSize: number;
  onPress?: (block: BlockShape) => void;
  disabled?: boolean;
}

export const SimpleBlock: React.FC<SimpleBlockProps> = ({
  block,
  cellSize,
  onPress,
  disabled = false,
}) => {
  const handlePress = () => {
    if (onPress && !disabled) {
      onPress(block);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.blockContainer}>
        {block.pattern.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize * 0.6,
                    height: cellSize * 0.6,
                    backgroundColor: cell === 1 ? block.color : 'transparent',
                  },
                  cell === 1 && styles.filledCell,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    padding: 12,
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  blockContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderRadius: 4,
    margin: 1.5,
  },
  filledCell: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});