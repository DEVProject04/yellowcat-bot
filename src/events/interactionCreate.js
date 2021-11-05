const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'interactionCreate',
    async execute(interaction) {
	    if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			command.execute(interaction);
		} catch (error) {
			console.error(error);
			const errEmbed = new MessageEmbed()
				.setTitle(":octagonal_sign: Error!")
				.setDescription(`There was an error while executing this command!`)
				.setFooter(`${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL())
				.setColor("#FF0000");

			await interaction.reply({ embeds: [errEmbed], ephemeral: true });
		}
    }
}