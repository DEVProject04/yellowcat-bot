const { version } = require("../config/config.json");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
		client.user.setActivity(`${client.user.username} ${version}`, "Game");
	},
};