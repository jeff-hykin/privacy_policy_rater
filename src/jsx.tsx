import h from "https://esm.sh/solid-js@1.9.9/h?dev"
import { createSignal, createEffect } from "https://esm.sh/solid-js@1.9.9?dev"

// for JSX
globalThis.React = {
    createElement: h,
}

export const makeComputed = (fn: () => any, { initialValue }: { initialValue: any } = { initialValue: undefined }) => {
    const [ getValue, setValue ] = createSignal(initialValue)
    createEffect(() => {
        setValue(fn())
    })
    return getValue
}

export const computeJson = (fn)=>{
    let value = fn()
    const [ getValue, setValue ] = createSignal(value)
    createEffect(() => {
        const newValue = fn()
        if (value != newValue && JSON.stringify(value) !== JSON.stringify(newValue)) {
            setValue(newValue)
            value = newValue
        }
    })
    return getValue
}