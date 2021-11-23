const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Player } = require('discord-player');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { clientId, token } = require('./src/config/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const player = new Player(client);

const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const commands = []
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	console.log(`Loaded ${command.data.name}!`);
	client.commands.set(command.data.name, command);

	commands.push(command.data.toJSON());
}

const musicCommand = [
	'play',
	'queue',
	'remove',
	'resume',
	'shuffle',
	'skip',
	'move',
	'nowplaying',
	'pause',
	'playtop',
	'swap',
	'stop'
];

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    
	try {
    	if (interaction.commandName === !musicCommand) {
    		command.execute(interaction);
    	} else {
    		command.execute(interaction, player);
    	}
    } catch (error) {
    	console.error(error);
    	const errEmbed = new MessageEmbed()
    		.setTitle(":octagonal_sign: Error!")
    		.setDescription(`There was an error while executing this command!`)
    		.setFooter(interaction.user.tag, interaction.user.avatarURL())
    		.setColor("#FF0000");
    	await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
})

player.on('error', (queue, error) => {
	console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
	console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
	queue.metadata.send(`▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
	console.log(`[${queue.guild.name}] Start playing: ${track.title} in ${queue.guild.name}`);
});

player.on('trackAdd', (queue, track) => {
	queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
	console.log(`[${queue.guild.name}] Queued music: ${track.title} in ${queue.guild.name}`);
});

player.on('botDisconnect', queue => {
	queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
	console.log(`[${queue.guild.name}] Disconnected!`);
});

player.on('channelEmpty', queue => {
	queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', queue => {
	queue.metadata.send('✅ | Queue finished!');
	console.log(`[${queue.guild.name}] Queue ended!`);
}); 

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
  
client.once('disconnect', () => {
	console.log('Disconnect!');
});

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.login(token);