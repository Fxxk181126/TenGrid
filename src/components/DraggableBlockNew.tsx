import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { BlockShape } from '../types/BlockTypes';

interface DraggableBlockNewProps {
  block: BlockShape;
  cellSize: number;
  onDrop?: (block: BlockShape, x: number, y: number) => void;
  disabled?: boolean;
  initialX?: number;
  initialY?: number;
}

export const DraggableBlockNew: React.FC<DraggableBlockNewProps> = ({
  block,
  cellSize,
  onDrop,
  disabled = false,
  initialX = 0,
  initialY = 0,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        setIsDragging(true);
        // 开始拖拽时放大
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        // 更新位置
        pan.setValue({
          x: initialX + gestureState.dx,
          y: initialY + gestureState.dy,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        // 恢复大小
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();

        // 获取触摸点的屏幕绝对坐标
        const absoluteX = evt.nativeEvent.pageX;
        const absoluteY = evt.nativeEvent.pageY;

        // 调用放置回调，传递屏幕绝对坐标
        if (onDrop) {
          onDrop(block, absoluteX, absoluteY);
        }

        // 回到原位置
        Animated.spring(pan, {
          toValue: { x: initialX, y: initialY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
          zIndex: isDragging ? 9999 : 1,
          elevation: isDragging ? 50 : 1,
        },
        disabled && styles.disabled,
      ]}
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
    </Animated.View>
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