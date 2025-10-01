import { createSignal, createEffect, Show, For } from "https://esm.sh/solid-js@1.9.9?dev"
import { AutocompleteSearch } from "./AutocompleteSearch.tsx"
import { computeJson } from "../jsx.tsx"

export function SearchWebsites() {
    const [ getQuery, setQuery ] = createSignal("")
    const [ getResults, setResults ] = createSignal<string[]>([])
    
    // Fetch and filter website names as user types
    let timeout: number | undefined
    const debounceRate = 200
    createEffect(() => {
        const query = getQuery().trim().toLowerCase()
        if (timeout) clearTimeout(timeout)
        if (!query) {
            setResults([])
            return
        }
        timeout = setTimeout(async () => {
            const res = await fetch("/searchWebsites")
            if (res.ok) {
                const sites: string[] = await res.json()
                const filtered = sites.filter((site) => site.toLowerCase().includes(query))
                setResults(filtered)
            } else {
                console.error("Error fetching website names", res)
            }
        }, debounceRate)
    })

    return (
        <div
            name="SearchWebsites"
            style={{
                display: "flex",
                "flex-direction": "column",
                "align-items": "center",
                "justify-content": "center",
                margin: "2rem auto",
                width: "100%",
                "max-width": "400px",
                position: "relative",
            }}
        >
            <AutocompleteSearch 
                suggestions={getResults}
                value={()=>getQuery}
                onSubmit={(item) => {
                    setQuery(item)
                    console.log("Selected website:", item)
                }}
                placeholder="Type a website..."
                onInput={(e) => {
                    setQuery(e.currentTarget.value)
                }}
                />
        </div>
    )
}
