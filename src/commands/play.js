const { GuildMember } = require('discord.js');
const { QueryType } = require('discord-player');
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in your channel!')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song you want to play')
                .setRequired(true) 
        ),
    async execute(interaction, player) {
        try {
            if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
                const errEmbed = new MessageEmbed()
                    .setTitle(":warning: Error!")
                    .setDescription('You are not in a voice channel!')
                    .setColor('#FF0000')
                    .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL());
                return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }
            await interaction.deferReply();
  
            const query = interaction.options.get('query').value;
            const searchResult = await player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO,
                })
                .catch(() => {});
            if (!searchResult || !searchResult.tracks.length) {
                const resultNotFoundEmbed = new MessageEmbed()
                    .setTitle(':warning: Error!')
                    .setDescription(`${query} is not found!`)
                    .setColor('#FF0000')
                    .setFooter(`${interaction.user.username}#${interaction.user.discriminator}`, interaction.user.avatarURL());
                return void interaction.followUp({content: resultNotFoundEmbed});
            }
  
            const queue = await player.createQueue(interaction.guild, {
                ytdlOptions: {
                    quality: "highest",
                    filter: "audioonly",
                    highWaterMark: 1 << 25,
                    dlChunkSize: 0,
                },
                metadata: interaction.channel,
            });
  
            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                void player.deleteQueue(interaction.guildId);
                return void interaction.followUp({
                    content: 'Could not join your voice channel!',
                });
            }
  
            await interaction.followUp({
                content: `⏱  | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`
            });
            searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
            if (!queue.playing) await queue.play();
        } catch (error) {
            console.log(error);
            interaction.followUp({
                content: 'There was an error trying to execute that command: ' + error.message,
            });
        }
    },
};