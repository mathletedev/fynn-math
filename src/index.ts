import { stripIndents } from "common-tags";
import { Client, Intents } from "discord.js";
import "dotenv-safe/config";
import { evaluate } from "mathjs";

(async () => {
	const client = new Client({
		intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
	});

	client.on("messageCreate", async (message) => {
		if (message.channelId !== process.env.CALC_CHANNEL || message.author.bot)
			return;

		try {
			await message.reply({
				embeds: [
					{
						description: stripIndents`
						**Input:**
						\`\`\`${message.content}\`\`\`
						**Output:**
						\`\`\`${evaluate(message.content)}\`\`\`
					`,
						color: "BLURPLE",
						footer: {
							iconURL: message.author.displayAvatarURL({ format: "gif" }),
							text: message.member?.nickname ?? message.author.username
						}
					}
				]
			});
		} catch (err) {
			message.reply(`❌ Error: \`${(err as Error).message}\``);
		}
	});

	client.on("ready", () => console.log(`${client.user?.tag} is online!`));

	await client.login(process.env.BOT_TOKEN);
})();
