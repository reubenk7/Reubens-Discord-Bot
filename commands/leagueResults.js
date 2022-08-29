const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}

	return JSON.parse(fullBody);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lt')
		.setDescription('Get the current league table')
		.addStringOption(option => option.setName('league').setDescription('The registered league you want to check the table for.')),
	async execute(interaction) {
		await interaction.deferReply();
		// const league = interaction.options.getString('league');
		// const id = global.leaguesData[league];
		const leagueId = '355362';

		const query = new URLSearchParams({ leagueId });
		const dircRes = await request(`https://fantasy.premierleague.com/api/leagues-classic/${query}/standings/`);
		console.log(dircRes);
		const { res } = await getJSONResponse(dircRes.body);
		await interaction.editReply(res);
		//
	},
};