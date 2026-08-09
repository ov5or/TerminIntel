import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const FetchDest = req.headers["sec-fetch-dest"] || "";
    const FetchMode = req.headers["sec-fetch-mode"] || "";
    const FetchSite = req.headers["sec-fetch-site"] || "";

    const IsBrowserNavigation =
        FetchDest === "document" ||
        FetchMode === "navigate";

    if (IsBrowserNavigation) {
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
        const FilePath = path.join(process.cwd(), "script.lua");
        const LuaScript = fs.readFileSync(FilePath, "utf8");

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");

        return res.status(200).send(LuaScript);
    } catch (Error) {
        console.error(Error);
        return res.status(500).send("Error loading script");
    }
}
