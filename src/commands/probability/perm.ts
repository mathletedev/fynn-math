import { permutations } from "mathjs";
import { Command } from "../command";

export default new Command({
	options: {
		name: "perm",
		description:
			"Permutations | Number of ways to arrange k objects out of n total",
		options: [
			{
				name: "n",
				description: "Total number of objects",
				type: 4,
				required: true
			},
			{
				name: "k",
				description: "Number of objects to arrange",
				type: 4,
				required: true
			}
		]
	},
	exec: async ({ interaction }) => {
		const n = interaction.options.getInteger("n", true);
		const k = interaction.options.getInteger("k", true);

		return {
			expr: `perm(${n}, ${k})`,
			res: permutations(n, k).toString()
		};
	}
});
