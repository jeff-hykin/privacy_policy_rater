import { createSignal, createEffect, createMemo, Show, For } from "https://esm.sh/solid-js@1.9.9?dev"

export interface AutocompleteSearchProps {
    items: string[]
    placeholder?: string
    onInput?: (e: InputEvent & { currentTarget: HTMLInputElement; target: Element }) => void
    onFocus?: () => void
    onKeyDown?: (e: KeyboardEvent) => void
    onSubmit?: (item: string) => void
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
        setSelectedIndex(-1)
        props.onSubmit?.(item)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        const suggestions = filteredItems()
        let index = selectedIndex()
        console.debug(`e is:`,e)
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                if (!showSuggestions()) setShowSuggestions(true)
                if (suggestions.length > 0) {
                    setSelectedIndex(index < suggestions.length - 1 ? index + 1 : 0)
                }
                break
            case "ArrowUp":
                e.preventDefault()
                if (!showSuggestions()) setShowSuggestions(true)
                if (suggestions.length > 0) {
                    setSelectedIndex(index > 0 ? index - 1 : suggestions.length - 1)
                }
                break
            case "Enter":
                if (showSuggestions() && index >= 0 && suggestions[index]) {
                    handleSelect(suggestions[index])
                    e.preventDefault()
                } else if (query().trim() !== "") {
                    props.onSubmit?.(query())
                }
                break
            case "Escape":
                setShowSuggestions(false)
                break
        }
    }

    // Reset selectedIndex when filteredItems changes
    createEffect(() => {
        setSelectedIndex(-1)
    }, [filteredItems])

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
                onFocus={(e) => {
                    setShowSuggestions(true)
                    props.onFocus?.(e)
                }}
                onKeyDown={(e) => {
                    handleKeyDown(e)
                    props.onKeyDown?.(e)
                }}
                style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    "border-radius": "4px",
                }}
                autocomplete="off"
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
                        {(item, i) =>(
                            <li
                                onClick={() => handleSelect(item)}
                                style={createMemo(() => {
                                    const selected = selectedIndex() === i()
                                    return {
                                        padding: "8px",
                                        cursor: "pointer",
                                        "background-color": selected ? "#1976d2" : "#fff",
                                        color: selected ? "#fff" : "#222",
                                        "font-weight": selected ? "bold" : "normal",
                                        "transition": "background 0.15s, color 0.15s",
                                    }
                                })}
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
