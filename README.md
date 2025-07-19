# 十方世界 / TenGrid World - 俄罗斯方块1010游戏

这是一款基于经典俄罗斯方块玩法的创新版本，结合1010游戏的拖拽放置机制，支持iOS和Android双平台运行。

## 项目说明

- **项目名称**: 十方世界 / TenGrid World
- **游戏类型**: 俄罗斯方块1010
- **核心玩法**: 在10x10游戏区域放置各种形状的方块，消除完整的行或列获得分数
- **平台支持**: iOS 和 Android
- **开发框架**: React Native + TypeScript

## 游戏特色

### 🎮 核心玩法
- **10x10游戏区域**: 经典的游戏板设计
- **多样方块形状**: 包含单格、直线、L型、T型、方形等15种不同形状
- **点击放置**: 简单直观的操作方式，选择方块后点击游戏板放置
- **智能消除**: 横行或竖列填满时自动消除
- **连击奖励**: 一次放置触发多行/列消除可获得额外分数

### 🏆 计分系统
- **基础分数**: 每放置一个方块获得基础分数（方块大小 × 10分）
- **消除奖励**: 每消除一行/列获得100分
- **连击奖励**: 连续消除获得额外50分奖励
- **最高分记录**: 自动保存并显示历史最高分

### 🎨 界面设计
- **简洁风格**: 清爽的界面设计，符合现代移动应用审美
- **色彩丰富**: 不同方块使用不同颜色，视觉效果丰富
- **响应式布局**: 适配不同屏幕尺寸的设备
- **直观反馈**: 选中状态、分数提示等用户友好的交互反馈

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: 项目结构说明

### 主要文件

- `App.tsx` - 主应用组件，已修改为显示 "Hello World" 文字
- `index.js` - 应用入口文件
- `package.json` - 项目依赖配置

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── GameBoard.tsx   # 游戏板组件
│   ├── GameCell.tsx    # 游戏单元格组件
│   ├── SimpleBlock.tsx # 简化方块组件
│   └── DraggableBlock.tsx # 可拖拽方块组件（高级版本）
├── screens/            # 页面组件
│   ├── SimpleGameScreen.tsx # 简化游戏界面
│   └── GameScreen.tsx  # 完整游戏界面（高级版本）
├── types/              # 类型定义
│   └── BlockTypes.ts   # 方块形状定义
└── utils/              # 工具函数
    └── GameLogic.ts    # 游戏逻辑处理
```

## 核心组件说明

### SimpleGameScreen.tsx - 主游戏界面
- **功能**: 游戏的主要界面，包含游戏板、方块选择、分数显示等
- **交互方式**: 点击选择方块，再点击游戏板放置
- **特点**: 简单易用，适合所有用户

### GameLogic.ts - 游戏逻辑核心
- **方块放置检测**: 检查方块是否可以放置在指定位置
- **消除逻辑**: 检测并清除完整的行和列
- **分数计算**: 根据放置和消除情况计算分数
- **游戏结束判断**: 检测是否还有可放置的方块

### BlockTypes.ts - 方块定义
- **15种方块形状**: 从单格到5格的各种组合
- **颜色配置**: 每种方块都有独特的颜色
- **随机生成**: 提供随机方块生成功能

### 修改应用

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
