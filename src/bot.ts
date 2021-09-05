import { REST } from "@discordjs/rest";
import {
	RESTGetAPIApplicationCommandsResult,
	Routes
} from "discord-api-types/v9";
import { Client, ClientOptions, Interaction, Message } from "discord.js";
import { readdirSync } from "fs";
import { evaluate } from "mathjs";
import { join } from "path";
import { Command } from "./commands/command";
import { Util } from "./lib/util";

export class Bot extends Client {
	private _token: string;
	private calcChannel: string;
	private commands: Command[] = [];
	private _rest = new REST({ version: "9" });
	public util = new Util();

	public constructor(
		options: ClientOptions,
		{ token, calcChannel }: { token: string; calcChannel: string }
	) {
		super(options);

		this._token = token;
		this.calcChannel = calcChannel;

		this._rest.setToken(token);
		this.listen();
	}

	private listen() {
		this.on("messageCreate", this.calculator);
		this.on("interactionCreate", this.interactionHandler);
		this.on("ready", () => console.log(`${this.user?.tag} is online!`));

		this.user?.setActivity({ name: "Math" });
	}

	public async loadCommands(commandsDir: string) {
		for (const dir of readdirSync(join(__dirname, commandsDir))) {
			if (dir.endsWith(".js")) continue;

			for (const file of readdirSync(join(__dirname, commandsDir, dir))) {
				const command = (await import(`./${commandsDir}/${dir}/${file}`))
					.default;

				if (command instanceof Command) this.commands.push(command);
			}
		}
	}

	public async registerCommands(clientId: string, guildId: string) {
		await this._rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: this.commands.map((command) => command.options)
		});

		console.log(`Successfully registered ${this.commands.length} commands!`);
	}

	public async unregisterCommands(clientId: string, guildId: string) {
		const commands = (await this._rest.get(
			Routes.applicationGuildCommands(clientId, guildId)
		)) as RESTGetAPIApplicationCommandsResult;

		for (const command of commands)
			this._rest.delete(
				Routes.applicationGuildCommand(clientId, guildId, command.id)
			);

		console.log("Successfully unregistered all commands");
	}

	private calculator(message: Message) {
		if (message.channelId !== this.calcChannel || message.author.bot) return;

		try {
			message.reply({
				embeds: [
					this.util.formatResult(
						this.util.getFooter(message),
						message.content,
						evaluate(message.content)
					)
				],
				allowedMentions: { repliedUser: false }
			});
		} catch (err) {
			message.reply({
				content: this.util.formatResultError((err as Error).message),
				allowedMentions: { repliedUser: false }
			});
		}
	}

	private interactionHandler(interaction: Interaction) {
		if (!interaction.isCommand() || !interaction.guild || interaction.user.bot)
			return;

		const command = this.commands.find(
			(command) => command.options.name === interaction.commandName
		);
		if (!command) return;

		command.exec(this, interaction);
	}

	public start() {
		this.login(this._token);
	}
}
