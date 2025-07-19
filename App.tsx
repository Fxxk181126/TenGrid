/**
 * TenGrid World - 十方世界俄罗斯方块游戏
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { DragGameScreen } from './src/screens/DragGameScreen';

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <DragGameScreen />
    </>
  );
}

export default App;
