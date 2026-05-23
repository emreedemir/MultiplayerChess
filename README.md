# React Native Chess: Multiplayer & AI ♟️

A production-ready, feature-rich Chess application built with React Native and Expo. It features a robust architecture utilizing the **Strategy Pattern** to seamlessly switch between playing against an AI or a real player via **Firebase Realtime Database**.

## ✨ Features
* **Play vs AI**: Offline gameplay against a built-in AI engine.
* **Online Multiplayer**: Host or join real-time public rooms using Firebase.
* **Anonymous Auto-Authentication**: Frictionless entry for users without sign-up forms.
* **Pawn Promotion**: Interactive modal to choose Queen, Rook, Bishop, or Knight.
* **Real-time Clocks**: Independent timers for White and Black pieces.
* **Visual Highlights**: Board flipping for Black players, check warnings (red), and last-move highlights (yellow).
* **Haptic Feedback**: Tactile responses on moves and captures using `expo-haptics`.
* **Material Advantage**: Real-time captured pieces and score calculation.

---

## 🏗️ Architecture & State Management

This project strictly follows solid software engineering principles to ensure high performance and scalability:

* **Strategy Pattern**: The `GenericGameScreen` has no idea whether the user is playing against an AI or a real human. It simply consumes an `IGameStrategy` (either `AiStrategy` or `MultiplayerStrategy`). This makes adding new modes (e.g., Bluetooth Local Play) effortless.
* **Backend Abstraction**: The multiplayer logic depends on `IMultiplayerBackend`. Currently, it uses `FirebaseBackend`, but it can be easily swapped for a custom Node.js/Socket.io backend without changing the game logic.
* **Zustand State Management**: Game states (board matrix, timers, captured pieces) are managed globally via Zustand. This eliminates prop-drilling and prevents unnecessary re-renders in the React component tree.
* **TanStack Query (React Query)**: Used in the lobby screen to efficiently fetch, cache, and refetch available multiplayer rooms.

---

## 📂 Project Structure

The entry point of the application is `App.tsx` located at the root. All other modular code is organized cleanly inside the `src/` directory.

```text
/
├── App.tsx                # Entry point and Navigation config
├── .env                   # Environment variables (Ignored in Git)
├── app.json               # Expo config
└── src/
    ├── components/        # Dumb/Presentational components (ChessBoard, ChessSquare)
    ├── hooks/             # Core game logic (useChessCore)
    ├── modals/            # UI Modals (Promotion, GameOver, Host, Join)
    ├── screens/           # MainScreen, GenericGameScreen
    ├── services/          # Backend implementations (FirebaseBackend)
    ├── store/             # Zustand stores (useAuthStore, useGameStore)
    ├── strategies/        # Game modes (AiStrategy, MultiplayerStrategy)
    ├── types/             # TypeScript definitions (Navigation)
    └── utils/             # Helper functions (aiBrain)
📦 Tech Stack & Dependencies
The following NPM packages drive the application:
react-native / expo: Core mobile framework.
@react-navigation/native-stack: Screen navigation.
chess.js: Core chess move generation, validation, and check/mate detection.
zustand: Lightweight, fast global state management.
firebase: Authentication (Anonymous) and Realtime Database for multiplayer sync.
@tanstack/react-query: Data fetching and caching for the multiplayer lobby.
expo-haptics: Native vibration/tactile feedback.
🚀 Installation & Setup
1. Clone the repository
Bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
2. Install dependencies
Bash
npm install
3. Setup Environment Variables (.env)
This project uses a .env file to securely store Firebase configuration keys. Create a file named .env at the root of the project (same level as App.tsx) and add your Firebase credentials with the EXPO_PUBLIC_ prefix:
Kod snippet'i
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
⚠️ Note: Make sure .env is added to your .gitignore file to prevent leaking your Firebase keys to the public repository.
4. Start the Application
Bash
npx expo start --clear
(The --clear flag ensures the Metro bundler reads the newly created .env file).
📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
