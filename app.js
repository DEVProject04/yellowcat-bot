require("dotenv").config();

const token = process.env.BOT_TOKEN
const discord = require("discord.js");
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILD_MEMBERS] });

client.on("ready", () => {
    client.user.setActivity(process.env.ACTIVITY);

    console.log(`Logined for ${client.user.username}#${client.user.discriminator}`);
});

client.login(token);