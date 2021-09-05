import { stripIndents } from "common-tags";
import { Message } from "discord.js";

export class Util {
	public replyResult(message: Message, expr: string, res: string) {
		message.reply({
			embeds: [
				{
					description: stripIndents`
				**Expression:**
				\`\`\`${expr}\`\`\`
				**Result:**
				\`\`\`${res}\`\`\`
			`,
					color: "BLURPLE",
					footer: {
						iconURL: message.author.displayAvatarURL(),
						text: message.member?.nickname ?? message.author.username
					},
					timestamp: Date.now()
				}
			],
			allowedMentions: { repliedUser: false }
		});
	}

	public replyResultError(message: Message, error: string) {
		message.reply({
			content: `❌ Error: \`${error}\``,
			allowedMentions: { repliedUser: false }
		});
	}
}
