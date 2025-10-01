import { createSignal, createEffect, createMemo, Show, For, splitProps } from "https://esm.sh/solid-js@1.9.9?dev"
import { computeJson } from "../jsx.tsx"

export const AutocompleteSearch = (props) => {
    // const [, props] = splitProps(props, [ 'options', 'updateOptions', 'onInput', 'onFocus', 'onKeyDown',])
    const getFilteredSuggestions = computeJson( () => props.suggestions.filter(item => item.toLowerCase().includes(props.value().toLowerCase())) )
    const [getSelectedIndex, setSelectedIndex] = createSignal(-1)
    
    const handleSubmit = (item: string) => {
        setSelectedIndex(-1)
        props.onSubmit?.(item)
    }
    
    // Reset getSelectedIndex when filteredItems changes
    createEffect(() => {
        setSelectedIndex(-1)
    }, [getFilteredSuggestions])
    
    const handleKeyDown = (e: KeyboardEvent) => {
        let index = getSelectedIndex()
        const maxIndex = getFilteredSuggestions().length - 1
        let newIndex
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                newIndex = index+1
                if (newIndex > maxIndex) {
                    newIndex = maxIndex
                }
                setSelectedIndex(newIndex)
                break
            case "ArrowUp":
                e.preventDefault()
                newIndex = index-1
                if (newIndex > maxIndex) {
                    newIndex = maxIndex
                }
                if (newIndex <= -1) {
                    newIndex = -1
                }
                setSelectedIndex(newIndex)
                break
            case "Enter":
                if (index > -1 && index <= maxIndex) {
                    handleSubmit(getFilteredSuggestions()[index])
                }
                break
            case "Escape":
                // setShowSuggestions(false)
                setSelectedIndex(-1)
                break
        }
    }
    
    return (
        <div style={{ position: "relative", width: "300px" }}>
            <input
                {...props}
                value={props.value}
                type="text"
                onInput={(e) => {
                    const query = e.currentTarget.value
                    props.onInput?.(e)
                }}
                onFocus={(e) => {
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
            <div>
                <For each={getFilteredSuggestions}>
                    {(item, getIndex) => (
                        <div
                            style={computeJson(()=>({
                                padding: "8px",
                                cursor: "pointer",
                                "background-color": getSelectedIndex() === getIndex() ? "#1976d2" : "#fff",
                                color:              getSelectedIndex() === getIndex() ? "#fff" : "#222",
                                "font-weight":      getSelectedIndex() === getIndex() ? "bold" : "normal",
                                "transition": "background 0.15s, color 0.15s",
                            }))}
                        >
                            {item}
                        </div>
                    )}
                </For>
            </div>
        </div>
    )
}