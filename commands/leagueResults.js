const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lt')
		.setDescription('Get the current league table')
		.addStringOption(option => option.setName('league').setDescription('The registered league you want to check the table for.')),
	async execute(interaction) {
		await interaction.deferReply();
		const league = interaction.options.getString('league');
		const leagueId = global.leaguesData[league];
		console.log(league);
		console.log(leagueId);

		const getResults = async (id) => {
			const response = await axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${id}/standings/`);
			const results = response.data;
			return results;
		};

		try {
			const res = await getResults(leagueId);
			console.log(res.standings.results[1]);
			const standings = JSON.stringify(res.standings.results);

			// gets first place
			console.log(standings[0]);
			await interaction.editReply(standings);
		} catch (error) {
			console.error(error);
			await interaction.editReply('Something went wrong. Have you registered the league with /register ?');
		}
	},
};