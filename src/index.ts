import { Intents } from "discord.js";
import "dotenv-safe/config";
import { Bot } from "./bot";

const fynn = new Bot(
	{ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] },
	process.env.CALC_CHANNEL!
);

fynn.login(process.env.BOT_TOKEN);
