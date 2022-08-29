const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leagues')
		.setDescription('Display Leagues Known to the bot'),
	async execute(interaction) {
		const currentLeagues = JSON.stringify(global.leaguesData);
		await interaction.reply(currentLeagues);
		//
	},
};