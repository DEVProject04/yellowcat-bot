const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { color } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('You can ping pong with my bot!'),
	execute(interaction) {
        const pingEmbed = new MessageEmbed()
            .setTitle(":ping_pong: Pong!")
            .setDescription(`${interaction.client.ws.ping}ms`)
            .setColor(color)
            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL());
		interaction.reply({ embeds: [pingEmbed] });
	},
};