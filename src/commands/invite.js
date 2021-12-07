const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('You can get this bot invite url!'),
	async execute(interaction) {
        const pingEmbed = new MessageEmbed()
            .setTitle(":mailbox_with_mail: Invite Code!")
            .setDescription(`https://projecttl.net/invite/yellowcat`)
            .setColor("BLUE")
            .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL());
		await interaction.reply({ embeds: [pingEmbed] });
	},
};