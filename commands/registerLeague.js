const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register A FPL League for easy access')
		.addStringOption(option => option.setName('id').setDescription('The League ID that you want to register'))
		.addStringOption(option => option.setName('name').setDescription('The Name you want to register the League as')),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const id = interaction.options.getString('id');
		global.leaguesData[name] = id;
		const newData = JSON.stringify(global.leaguesData, null, 2);
		fs.writeFileSync('data.json', newData);
		await interaction.reply(`League name: ${name}\nOf ID: ${id}\n JSON\n ${newData}`);
		//
	},
};