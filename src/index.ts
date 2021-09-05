import { Intents } from "discord.js";
import "dotenv-safe/config";
import { Bot } from "./bot";

(async () => {
	const fynn = new Bot(
		{ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] },
		{ token: process.env.BOT_TOKEN!, calcChannel: process.env.CALC_CHANNEL! }
	);

	// await fynn.unregisterCommands(process.env.BOT_ID!, process.env.CALC_GUILD!);
	await fynn.loadCommands("commands");
	await fynn.registerCommands(process.env.BOT_ID!, process.env.CALC_GUILD!);

	fynn.start();
})();
