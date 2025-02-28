import { Layout } from "./components/Layout";
import { Tetris } from "./components/Tetris";
import { GameProvider } from "./contexts/GameContext/Provider";

function App() {
  return (
    <>
      <GameProvider>
        <Layout>
          <Tetris />
        </Layout>
      </GameProvider>
    </>
  );
}

export default App;
