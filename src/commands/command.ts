import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import {
	CommandInteraction,
	GuildMember,
	InteractionReplyOptions,
	MessagePayload
} from "discord.js";
import { Bot } from "../bot";

interface Result {
	expr: string;
	res: string;
}

type CommandExecute = (args: {
	bot: Bot;
	interaction: CommandInteraction;
}) => Promise<
	void | string | InteractionReplyOptions | MessagePayload | Result
>;

export class Command {
	public options: RESTPostAPIApplicationCommandsJSONBody;
	private _exec: CommandExecute;

	public constructor({
		options,
		exec
	}: {
		options: RESTPostAPIApplicationCommandsJSONBody;
		exec: CommandExecute;
	}) {
		this.options = options;
		this._exec = exec;
	}

	public async exec(bot: Bot, interaction: CommandInteraction) {
		await interaction.deferReply();

		try {
			let res = await this._exec({ bot, interaction });
			if (!res) return;

			if ((res as Result).expr) {
				res = res as Result;

				return interaction.editReply({
					embeds: [
						bot.util.formatResult(
							{
								iconURL: interaction.user.avatarURL() as string | undefined,
								text:
									(interaction.member as GuildMember).nickname ??
									interaction.user.username
							},
							res.expr,
							res.res
						)
					]
				});
			}

			interaction.editReply(
				res as string | InteractionReplyOptions | MessagePayload
			);
		} catch (err) {
			interaction.editReply(bot.util.formatResultError((err as Error).message));
		}
	}
}
