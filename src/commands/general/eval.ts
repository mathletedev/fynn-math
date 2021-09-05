import { evaluate } from "mathjs";
import { Command } from "../command";

export default new Command({
	options: {
		name: "eval",
		description: "Evaluate an expression",
		options: [
			{
				name: "expression",
				description: "Expression to evaluate",
				type: 3,
				required: true
			}
		]
	},
	exec: async ({ interaction }) => {
		const expression = interaction.options.getString("expression", true);

		return {
			expr: expression,
			res: evaluate(expression)
		};
	}
});
