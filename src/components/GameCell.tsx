import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface GameCellProps {
  value: string; // 空字符串表示空，颜色字符串表示已填充
  row: number;
  col: number;
  size: number;
  onPress?: (row: number, col: number) => void;
}

export const GameCell: React.FC<GameCellProps> = ({ 
  value, 
  row, 
  col, 
  size, 
  onPress 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(row, col);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: value === '' ? '#F8F9FA' : value, // 空白为浅灰，填充为方块颜色
        },
        value !== '' && styles.filledCell,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCell: {
    elevation: 1,
    shadowColor: '#3498DB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});