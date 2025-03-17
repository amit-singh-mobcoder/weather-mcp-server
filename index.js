import express from 'express'
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { getWeatherByCity } from './weather.js';
import { z } from "zod";
import { configDotenv } from 'dotenv';
configDotenv();

const app = express();
const PORT = 8080;

// Create an MCP server
const server = new McpServer({
    name: "Weather Fetcher",
    version: "1.0.0"
});

// Add an addition tool
server.tool("getWeatherBycityName",
    { city: z.string() },
    async ({ city }) => {
        const data = await getWeatherByCity(city);
        if (!data) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to retrieve weather data",
                    },
                ],
            };
        }
        return { content: [{ type: "text", text: data }] };
    }
);

let transport = null;

app.get("/sse", (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    server.connect(transport);
});

app.post("/messages", (req, res) => {
    if (transport) {
        transport.handlePostMessage(req, res);
    }
});

app.listen(() => {
    console.log("Server is listening on port: ", PORT);
})