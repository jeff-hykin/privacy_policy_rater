import { FileSystem, glob } from "https://deno.land/x/quickr@0.8.4/main/file_system.js"

const args = {
    port: 8000,
}

const allSiteNames = new Set()
Deno.serve(
    {
        port: args.port,
        // hostname: args.address,
        // ...extras,
        onListen: () => {
          console.log(`Running on http://127.0.0.1:${args.port}`)
        },
    },
    async (req) => {
        const reqUrl = new URL(req.url)
        const pathname = reqUrl.pathname
        if (pathname == "/") {
            return new Response(
                new TextEncoder().encode(Deno.readTextFileSync("docs/index.html")),
                { status: 200, headers: { "content-type": "text/html" } }
            )
        } else if (pathname == "/index.js") {
            return new Response(
                new TextEncoder().encode(Deno.readTextFileSync("docs/index.js")),
                { status: 200, headers: { "content-type": "text/javascript" } }
            )
        } else if (pathname.startsWith("/searchWebsites")) {
            console.log(`searching for websites`)
            // Get all folders in ./data (assuming each folder is a website)
            try {
                if (allSiteNames.size == 0 && await FileSystem.exists("./data")) {
                    const entries = await FileSystem.listFolderItemsIn("./data")
                    const sites = entries
                        .filter(e => e.isDirectory)
                        .map(e => e.name)
                    
                    for (let each of sites) {
                        allSiteNames.add(each)
                    }
                }
            } catch (err) {
                return new Response(
                    new TextEncoder().encode("error reading data directory"),
                    { status: 500, headers: { "content-type": "text/plain" } }
                )
            }
            return new Response(
                new TextEncoder().encode(JSON.stringify([...allSiteNames])),
                { status: 200, headers: { "content-type": "application/json" } }
            )
        } else if (pathname.startsWith("/getWebsite")) {
            const siteUrl = reqUrl.searchParams.get("url")
            const site = siteUrl.origin.replace(/(https?:\/\/)?(www\.)?/, "")
            if (await FileSystem.exists(`./data/${site}/info.json`)) {
                let info
                try {
                    info = JSON.parse(await Deno.readTextFile(`./data/${site}/info.json`))
                } catch (error) {
                    return new Response(new TextEncoder().encode(`error reading info.json for ${site}`), { status: 500, headers: { "content-type": "text/plain" } })
                }
                return new Response(new TextEncoder().encode(JSON.stringify(info)), { status: 200, headers: { "content-type": "application/json" } })
                // let data = await Deno.readTextFile(`./data/${site}/${info.latest}/rating.yaml`)
            }
        }
        return new Response(new TextEncoder().encode("404 endpoint not found"), { status: 404, headers: { "content-type": "text/plain" } })
    }
)