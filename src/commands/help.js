const fs = require('fs');
const config = require("../config/config.json");
const { MessageEmbed, GuildMember } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List all available commands.'),
    execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle(':information_source: Help!')
            .setDescription('This is command list')
            .setColor(config.color)
            .setFooter(interaction.user.tag, interaction.user.avatarURL());

        const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            embed.addField(`**${command.data.name}**`, ` ${command.data.description}`, true);
        }

        return void interaction.reply({ embeds : [embed] });
    },
};