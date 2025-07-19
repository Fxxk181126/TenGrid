import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { BlockShape } from '../types/BlockTypes';

interface DraggableBlockProps {
  block: BlockShape;
  cellSize: number;
  onDragEnd?: (x: number, y: number, block: BlockShape) => void;
  disabled?: boolean;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  cellSize,
  onDragEnd,
  disabled = false,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.1);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      
      if (onDragEnd) {
        runOnJS(onDragEnd)(event.absoluteX, event.absoluteY, block);
      }
      
      // 重置位置
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const renderBlock = () => {
    return (
      <View style={styles.blockContainer}>
        {block.pattern.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize * 0.8,
                    height: cellSize * 0.8,
                    backgroundColor: cell === 1 ? block.color : 'transparent',
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (disabled) {
    return (
      <View style={[styles.container, { opacity: 0.3 }]}>
        {renderBlock()}
      </View>
    );
  }

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {renderBlock()}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  blockContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderRadius: 2,
    margin: 1,
  },
});