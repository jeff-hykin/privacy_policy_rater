import { createSignal, createEffect, Show, For } from "https://esm.sh/solid-js@1.9.9?dev"
import { AutocompleteSearch } from "./AutocompleteSearch.tsx"

const items = ["Apple", "Banana", "Orange", "Grape", "Pineapple", "Mango", "Strawberry", "Blueberry", "Watermelon"]

export function SearchWebsites() {
    const [query, setQuery] = createSignal("")
    const [results, setResults] = createSignal<string[]>([])
    const [showSuggestions, setShowSuggestions] = createSignal(false)
    let timeout: number | undefined
    

    // Fetch and filter website names as user types
    createEffect(() => {
        const q = query().trim().toLowerCase()
        if (timeout) clearTimeout(timeout)
        if (!q) {
            setResults([])
            setShowSuggestions(false)
            return
        }
        timeout = setTimeout(async () => {
            const res = await fetch("/searchWebsites")
            if (res.ok) {
                const sites: string[] = await res.json()
                const filtered = sites.filter((site) => site.toLowerCase().includes(q))
                console.debug(`sites is:`, sites)
                setResults(filtered)
                setShowSuggestions(filtered.length > 0)
            }
        }, 200)
    })

    // Handle suggestion click
    function handleSuggestionClick(site: string) {
        setQuery(site)
        setShowSuggestions(false)
    }

    // Hide suggestions when input loses focus (with slight delay for click)
    function handleBlur() {
        setTimeout(() => setShowSuggestions(false), 100)
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "2rem auto",
                width: "100%",
                maxWidth: "400px",
                position: "relative",
            }}
        >
            <AutocompleteSearch 
                items={results}
                placeholder="Type a website..."
                onInput={(e) => {
                    setQuery(e.currentTarget.value)
                    setShowSuggestions(true)
                }}
                />
        </div>
    )
}
