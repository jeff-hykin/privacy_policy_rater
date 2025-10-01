import { FileSystem, glob } from "https://deno.land/x/quickr@0.8.4/main/file_system.js"

Deno.serve(
    {
        // port: args.port - 0,
        // hostname: args.address,
        // ...extras,
        // onListen: () => {
        //   console.log(`Running on http://127.0.0.1:9093`)
        // },
    },
    async (req) => {
        const reqUrl = new URL(req.url)
        const pathname = reqUrl.pathname
        if (pathname.startsWith("/getWebsite")) {
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