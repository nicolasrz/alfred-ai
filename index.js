import dotenv from "dotenv";
import {Client, GatewayIntentBits} from "discord.js";
import {Configuration, OpenAIApi} from "openai";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const openai = new OpenAIApi(new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    })
);

client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    if (message.content.startsWith('!ai')) {
        const prompt = message.content.slice(4);
        try {
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "system", content: "You are a helpful assistant who responds succinctly"},
                    {role: "user", content: prompt}
                ],
            });

            const content = response.data.choices[0].message;
            return message.reply(content);

        } catch (err) {
            return message.reply(
                "As an AI robot, I errored out."
            );
        }
    }
});