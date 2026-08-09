import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const accept = req.headers["accept"] || "";
    const userAgent = req.headers["user-agent"] || "";

    const IsBrowser =
        accept.includes("text/html") ||
        accept.includes("application/xhtml+xml");

    if (IsBrowser) {
        res.setHeader("Content-Type", "text/html");

        return res.status(404).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>404 - Not Found</title>
                <style>
                    body {
                        font-family: monospace;
                        background: #121212;
                        color: #e0e0e0;
                        text-align: center;
                        padding-top: 20vh;
                    }

                    h1 {
                        font-size: 3rem;
                        color: #ff5555;
                    }

                    p {
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <h1>404</h1>
                <p>The requested file or resource could not be found.</p>
            </body>
            </html>
        `);
    }

    try {
        const filePath = path.join(process.cwd(), "script.lua");
        const luaScript = fs.readFileSync(filePath, "utf8");

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");

        return res.status(200).send(luaScript);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error loading script");
    }
}
