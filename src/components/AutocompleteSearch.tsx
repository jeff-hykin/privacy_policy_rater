import { createSignal, createEffect, createMemo, Show, For } from "https://esm.sh/solid-js@1.9.9?dev"

interface AutocompleteSearchProps {
    items: string[]
    placeholder?: string
}

export const AutocompleteSearch = (props: AutocompleteSearchProps) => {
    const [query, setQuery] = createSignal("")
    const [selectedIndex, setSelectedIndex] = createSignal(-1)
    const [showSuggestions, setShowSuggestions] = createSignal(false)

    const filteredItems = createMemo(() => {
        const q = query().toLowerCase()
        let result = q ? props.items.filter((item) => item.toLowerCase().includes(q)) : []
        console.debug(`result is:`, result)
        return result
    })
    
    const renderList = createMemo(() => {
        const filteredItems_ = filteredItems()
        const showSuggestions_ = showSuggestions()
        return showSuggestions_ && filteredItems_.length > 0
    })

    const handleSelect = (item: string) => {
        setQuery(item)
        setShowSuggestions(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        const suggestions = filteredItems()
        const index = selectedIndex()

        switch (e.key) {
            case "ArrowDown":
                setSelectedIndex((index + 1) % suggestions.length)
                break
            case "ArrowUp":
                setSelectedIndex((index - 1 + suggestions.length) % suggestions.length)
                break
            case "Enter":
                if (index >= 0 && suggestions[index]) {
                    handleSelect(suggestions[index])
                    e.preventDefault()
                }
                break
            case "Escape":
                setShowSuggestions(false)
                break
        }
    }

    return (
        <div style={{ position: "relative", width: "300px" }}>
            <input
                {...props}
                type="text"
                value={query}
                placeholder={props.placeholder ?? "Search..."}
                onInput={(e) => {
                    setQuery(e.currentTarget.value)
                    setShowSuggestions(true)
                    setSelectedIndex(-1)
                    props.onInput?.(e)
                }}
                onFocus={() => {
                    setShowSuggestions(true)
                    props.onFocus?.()
                }}
                onKeyDown={(...args) => {
                    handleKeyDown(...args)
                    props.onKeyDown?.(...args)
                }}
                style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    "border-radius": "4px",
                }}
            />

            <Show when={renderList}>
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        right: "0",
                        "background-color": "#fff",
                        border: "1px solid #ccc",
                        "border-top": "none",
                        "max-height": "200px",
                        overflow: "auto",
                        margin: 0,
                        padding: 0,
                        "list-style": "none",
                        "z-index": 10,
                    }}
                >
                    <For each={filteredItems}>
                        {(item, i) => (
                            <li
                                onClick={() => handleSelect(item)}
                                style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    "background-color": selectedIndex() === i() ? "#eee" : "#fff",
                                }}
                                onMouseEnter={() => setSelectedIndex(i())}
                            >
                                {item}
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </div>
    )
}
