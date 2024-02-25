const { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const connect = require("../database/db.connection");
const consts = require("../constants");

module.exports = {
	data: new ContextMenuCommandBuilder()
	.setName('report')
	.setType(ApplicationCommandType.Message)
    ,
	async execute(interaction) {

        // Vérification de l'existence du channel de stockage des reports
        const sql = `SELECT CHANNEL_ID FROM ALLOWED WHERE SERVER_ID = ? AND FUNCTIONNALITY = 'reports'`;

        const result = await connect.db.getrow(sql, [interaction.guild.id]).catch(err => {throw err});

        if(result === undefined){
            return interaction.reply({
                content: `This functionnality hasn't been activated.\nAsk an administrator to type \`/allow Reports\` to activate it`,
                ephemeral: true
            });
        }

        // Récupération des informations à transmettre
        const target = (await interaction.channel.messages.fetch(interaction.targetId)).author.id;
        const targetMessage = {
            content : (await interaction.channel.messages.fetch(interaction.targetId)).content,
            id : interaction.targetId
        };
        const executor = interaction.user.id;

        // Envoi du message dans le channel des reports
        const embed = new EmbedBuilder()
        .setTitle("New report")
        .setDescription(`<@${target}> has been reported by <@${executor}>`)
        .setColor(consts.embedColor1)
        .addFields(
            {name: `reported message`, value: `${targetMessage.content}`},
            {name: `link`, value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${targetMessage.id}`}
        )
        .setTimestamp()
        .setFooter({text: `${consts.embedFooter}`});

        const channel = await interaction.guild.channels.fetch(result.CHANNEL_ID);
        channel.send({
            embeds: [embed]
        });

        // Envoi d'un message à l'utilisateur confirmant son report
        return interaction.reply({
            content: "The report has been sent to the moderation team",
            ephemeral: true
        });
	},
};