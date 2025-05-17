import EndScreen from "./components/EndScreen"
import Game from "./components/Game"
import StartScreen from "./components/StartScreen"
import { useGameStore } from "./hooks/useGameStore"

function App() {
	const screen = useGameStore((s) => s.screen)

	return (
		<>
		  {screen === 'menu' && <StartScreen />}
			{screen === 'game' && <Game />}
			{screen === 'result' && <EndScreen />}
		</>
	)
}

export default App
