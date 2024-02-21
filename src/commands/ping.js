const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with the bot's ping!"),
	async execute(interaction) {

		const sent = await interaction.reply({ 
			content: "Pinging...",
			fetchReply: true, 
			ephemeral: true 
		});

		await interaction.editReply({
			content: `🏓\nRoundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms\nWebsocket heartbeat: ${interaction.client.ws.ping}ms`,
			ephemeral: true
		});
	},
};