import { HelloWorld } from "./components/HelloWorld.tsx"
import { createSignal } from "https://esm.sh/solid-js@1.9.9?dev"
import { SearchWebsites } from "./components/SearchWebsites.tsx"

export default function App() {
    return (
        <div style={{ textAlign: "center", "margin-top": "2rem" }}>
            <SearchWebsites />
        </div>
    )
}