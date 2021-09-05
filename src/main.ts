import { stripIndents } from "common-tags";
import "dotenv-safe/config";
import { Client, TextChannel } from "eris";
import { Base } from "eris-sharder";
import { evaluate } from "mathjs";

export = class Fynn extends Base {
	public constructor(options: { bot: Client; clusterID: number }) {
		super(options);
	}

	public launch() {
		this.bot.on("messageCreate", async (message) => {
			if (message.channel.id !== process.env.CALC_CHANNEL || message.author.bot)
				return;

			const channel = message.channel as TextChannel;

			try {
				await channel.createMessage({
					embed: {
						description: stripIndents`
							**Input:**
							\`\`\`${message.content}\`\`\`
							**Output:**
							\`\`\`${evaluate(message.content)}\`\`\`
						`,
						color: 0x5865f2,
						footer: {
							icon_url: message.author.dynamicAvatarURL("gif"),
							text: message.member?.nick ?? message.author.username
						}
					}
				});
			} catch (err) {
				channel.createMessage(`❌ Error: \`${(err as Error).message}\``);
			}
		});

		this.bot.editStatus("online", {
			name: "Math",
			type: 0
		});

		console.log("Bot is online!");
	}
};
