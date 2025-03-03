import React from "react";
import { Layout } from "./components/Layout";
import { Tetris } from "./components/Tetris";
import { GameProvider } from "./contexts/GameContext/Provider";
import { ErrorBoundary } from "./errors/ErrorBoundary";

function App() {
  return (
    <React.StrictMode>
      <GameProvider>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Layout>
            <Tetris />
          </Layout>
        </ErrorBoundary>
      </GameProvider>
    </React.StrictMode>
  );
}

export default App;
