const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');

const getResults = async (id) => {
	const response = await axios.get(`https://fantasy.premierleague.com/api/leagues-classic/${id}/standings/`);
	const results = response.data;
	return results;
};

function ordinal_suffix_of(i) {
	const j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + 'st';
	}
	if (j == 2 && k != 12) {
		return i + 'nd';
	}
	if (j == 3 && k != 13) {
		return i + 'rd';
	}
	return i + 'th';
}

function rankChange(newRank, oldRank) {
	if (newRank > oldRank) {
		return '\u2B06';
	}
	if (newRank == oldRank) {
		return '\u2015';
	}
	if (newRank < oldRank) {
		return '\u2B07';
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('results')
		.setDescription('Get the current league table')
		.addStringOption(option => option.setName('league').setDescription('The registered league you want to check the table for.')),
	async execute(interaction) {
		await interaction.deferReply();
		const league = interaction.options.getString('league');
		const leagueId = global.leaguesData[league];

		try {
			const res = await getResults(leagueId);
			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle(`Current Standings For ${res.league.name}`)
				.setDescription(`Last Updated: ${new Date(res.last_updated_data).toLocaleString({ hour12: true })}`)
				.setURL(`https://fantasy.premierleague.com/leagues/${res.league.id}/standings/c`)
				.setTimestamp(Date.now());

			res.standings.results.forEach(position => {
				embed.addFields({ name: 'Position', value: ordinal_suffix_of(JSON.stringify(position.rank)), inline: true },
					{ name: 'Change', value: rankChange(position.rank, position.last_rank), inline: true },
					{ name: '\u200B', value: '\u200B', inline: true },
					{ name: 'Name', value: position.player_name, inline: true },
					{ name: 'GW Points', value: JSON.stringify(position.event_total), inline: true },
					{ name: 'Overall Points', value: JSON.stringify(position.event_total), inline: true },
					{ name: '\u200B', value: '\u200B' });
			});
			await interaction.editReply({
				embeds: [embed],
			});
		} catch (error) {
			console.error(error);
			await interaction.editReply('Something went wrong. Have you registered the league with /register ?');
		}
	},
};