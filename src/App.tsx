import EndScreen from "./EndScreen"
import Game from "./Game"
import { useGameStore } from "./hooks/useGameStore"
import StartScreen from "./StartScreen"

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
