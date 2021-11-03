const { Client, Intents, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token, color } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('You can ping pong with my bot!'),
    new SlashCommandBuilder().setName('pong').setDescription('You can ping pong with my bot!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);

client.once('ready', () => {
	console.log(`Logined for ${client.user.username}#${client.user.discriminator}`);
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    switch (commandName) {
        case "ping":
            const pingEmbed = new MessageEmbed()
                .setColor(color)
			    .setTitle(':ping_pong: Pong!')
			    .setDescription(`${client.ws.ping}ms`)
                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL());

		    await interaction.reply({ embeds: [pingEmbed] });
            break;

        case "pong":
            const pongEmbed = new MessageEmbed()
                .setColor(color)
			    .setTitle(':ping_pong: Ping!')
			    .setDescription(`${client.ws.ping}ms`)
                .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL());

		    await interaction.reply({ embeds: [pongEmbed] });
            break;
    }
});

client.login(token);