import "./jsx.tsx"
import { SearchWebsites } from "./components/SearchWebsites.tsx"
import { render } from "https://esm.sh/solid-js@1.9.9/web?dev"


render(() => <body style="height: 100vh; overflow: auto; font: 14px/1.4 sans-serif;">
    <SearchWebsites />
</body>, document.body)