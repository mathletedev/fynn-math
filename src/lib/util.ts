import { stripIndents } from "common-tags";
import { Message, MessageEmbedFooter, MessageEmbedOptions } from "discord.js";

export class Util {
	public formatResult(
		footer: MessageEmbedFooter,
		expr: string,
		res: string
	): MessageEmbedOptions {
		return {
			description: stripIndents`
				**Expression:**
				\`\`\`${expr}\`\`\`
				**Result:**
				\`\`\`${res}\`\`\`
			`,
			color: "BLURPLE",
			footer,
			timestamp: Date.now()
		};
	}

	public formatResultError(error: string) {
		return `❌ Error:\`${error}\``;
	}

	public getFooter(message: Message): MessageEmbedFooter {
		return {
			iconURL: message.author.displayAvatarURL(),
			text: message.member?.nickname ?? message.author.username
		};
	}
}
