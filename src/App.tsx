import { HelloWorld } from "./components/HelloWorld.tsx"
import { createSignal } from "https://esm.sh/solid-js@1.9.9?dev"

export default function App() {
    const [count, setCount] = createSignal(0)

    const increment = () => {
        console.log(`incrementing`)
        return setCount(count() + 1)
    }
    const decrement = () => setCount(count() - 1)
    const reset = () => setCount(0)
    
    return (
        <div style={{ textAlign: "center", "margin-top": "2rem" }}>
            <h1>Solid.js Counter</h1>
            <h2>Count: {count}</h2>
            <button onClick={decrement}>-</button>
            <button onClick={reset} style={{ margin: "0 1rem" }}>
                Reset
            </button>
            <button onClick={increment}>+</button>
        </div>
    )
}