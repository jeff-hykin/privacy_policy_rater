import { createSignal, createEffect } from "https://esm.sh/solid-js@1.9.9?dev"

export function SearchWebsites() {
    const [query, setQuery] = createSignal("")
    const [results, setResults] = createSignal<string[]>([])
    let timeout: number | undefined

    createEffect(() => {
        const q = query().trim().toLowerCase()
        if (timeout) {
            clearTimeout(timeout)
        }
        if (!q) {
            setResults([])
            return
        }
        timeout = setTimeout(async () => {
            const res = await fetch("/searchWebsites")
            if (res.ok) {
                const sites: string[] = await res.json()
                setResults(sites.filter((site) => site.toLowerCase().includes(q)))
            }
        }, 200) // debounce
    })

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "2rem auto",
                width: "100%",
                maxWidth: "400px",
            }}
        >
            <input
                type="text"
                placeholder="Search websites..."
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                style={{
                    padding: "0.5rem",
                    width: "100%",
                    fontSize: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    marginBottom: "1rem",
                }}
            />
            <ul style={{ width: "100%", listStyle: "none", padding: 0 }}>
                {results().map((site) => (
                    <li
                        style={{
                            padding: "0.5rem",
                            borderBottom: "1px solid #eee",
                            textAlign: "left",
                        }}
                    >
                        {site}
                    </li>
                ))}
            </ul>
        </div>
    )
}
