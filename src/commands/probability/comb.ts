import { combinations } from "mathjs";
import { Command } from "../command";

export default new Command({
	options: {
		name: "comb",
		description:
			"Combinations | Number of ways to select k objects out of n total",
		options: [
			{
				name: "n",
				description: "Total number of objects",
				type: 4,
				required: true
			},
			{
				name: "k",
				description: "Number of objects to select",
				type: 4,
				required: true
			}
		]
	},
	exec: async ({ interaction }) => {
		const n = interaction.options.getInteger("n", true);
		const k = interaction.options.getInteger("k", true);

		return {
			expr: `comb(${n}, ${k})`,
			res: combinations(n, k).toString()
		};
	}
});
