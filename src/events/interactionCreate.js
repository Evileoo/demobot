const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		let command;

		if(interaction.isChatInputCommand()){
			command = interaction.client.commands.get(interaction.commandName);
		} else if(interaction.isMessageContextMenuCommand()){
			command = interaction.client.ctxmenu.get(interaction.commandName);
		} else if(interaction.isUserContextMenuCommand()){
			command = interaction.client.ctxmenu.get(interaction.commandName);
		} else if(interaction.isModalSubmit()){
			// Modal response
		} else if(interaction.isButton()){
			// Button response
		} else if(interaction.isStringSelectMenu()){
			// Select menu response
		} else return;

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};