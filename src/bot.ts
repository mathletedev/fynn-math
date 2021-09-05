import { Client, ClientOptions, Message } from "discord.js";
import { evaluate } from "mathjs";
import { Util } from "./lib/util";

export class Bot extends Client {
	private calcChannel: string;
	public util = new Util();

	public constructor(options: ClientOptions, calcChannel: string) {
		super(options);

		this.calcChannel = calcChannel;

		this.listen();
	}

	private listen() {
		this.on("messageCreate", this.calculator);
		this.on("ready", () => console.log(`${this.user?.tag} is online!`));

		this.user?.setActivity({ name: "Math" });
	}

	private calculator(message: Message) {
		if (message.channelId !== this.calcChannel || message.author.bot) return;

		try {
			this.util.replyResult(
				message,
				message.content,
				evaluate(message.content)
			);
		} catch (err) {
			this.util.replyResultError(message, (err as Error).message);
		}
	}
}
