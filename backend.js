Deno.serve(
    {
        // port: args.port - 0,
        // hostname: args.address,
        // ...extras,
        // onListen: () => {
        //   console.log(`Running on http://127.0.0.1:9093`)
        // },
    },
    (req) => {
        return new Response(new TextEncoder().encode("example response"), { status: 200, headers: { "content-type": "text/plain" } })
    }
)