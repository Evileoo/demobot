const { SlashCommandBuilder,  PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } = require("discord.js");
const connect = require("../database/db.connection");
// const constants = require("../constants");

module.exports = {
    data: new SlashCommandBuilder()
	.setName("allow")
	.setDescription("Activates bot's funcitonnalities")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addStringOption( (option) =>
        option
        .setName("name")
        .setDescription("Name of functionnality")
        .setRequired(true)
        .addChoices(
            { name: "Reports", value: "reports" },
        )
    ),
    async execute(interaction) {
        //Get the command content
        const functionnality = interaction.options.getString("name");

        const channelId = await alreadyAllowed(functionnality);

        if(channelId != ""){

            // Confirmation buttons
            const removeFunctionnality = new ButtonBuilder()
            .setCustomId("removefunctionnality")
            .setLabel("Remove")
            .setStyle(ButtonStyle.Danger);

            const cancelRemove = new ButtonBuilder()
            .setCustomId("cancelremove")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(removeFunctionnality, cancelRemove);

            const response = await interaction.reply({
                content: `This functionnality has already been activated\nDo you want to remove it ?`,
                components: [row],
                ephemeral: true
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 10_000 }); // No command matching undefined was found.

                if (confirmation.customId === 'removefunctionnality') {
                    const fetchChannel = interaction.guild.channels.cache.get(channelId);
                    fetchChannel.delete();
                    await deleteFunctionnality(functionnality);
                    return await confirmation.update({
                        content: `Functionnality removed`,
                        components: []
                    });
                } else if (confirmation.customId === 'cancelremove') {
                    return await confirmation.update({ content: 'Cancelled...\nYou can close this interaction 😉', components: [] });
                }
            } catch (e) {
                return await interaction.editReply({ content: 'Interaction cancelled', components: [] });
            }

            return interaction.editReply({
                content : "Functionnality already activated",
                ephemeral: true
            });
        }

        let channel, message;

        switch(functionnality){
            case "reports":
                channel = await interaction.guild.channels.create({
                    name: "reports",
                    type: ChannelType.GuildText,
                    parent: interaction.channel.parent.id
                });
                message = `<#${channel.id}> created.\n`;
            break;
            default: return interaction.reply({content : "Choice not recognized. Please execute the command again", ephemeral: true});
        }

        insertFunctionnality(channel.id, functionnality);

        return interaction.reply({
            content : `${message}`,
            ephemeral: true
        });

        async function alreadyAllowed(f){
            const sql = `SELECT CHANNEL_ID FROM ALLOWED WHERE SERVER_ID = ? AND FUNCTIONNALITY = ?`;

            const result = await connect.db.getrow(sql, [interaction.guild.id, f]).catch(err => {throw err});

            if(result === undefined) return "";
            else return result.CHANNEL_ID;
        }

        async function deleteFunctionnality(f){
            const sql= `DELETE FROM ALLOWED WHERE SERVER_ID = ? AND FUNCTIONNALITY = ?`;

            await connect.db.execute(sql, [interaction.guild.id, f]).catch(err => {throw err});
        }

        async function insertFunctionnality(c, f){
            const  sql= `INSERT INTO ALLOWED(SERVER_ID, CHANNEL_ID, FUNCTIONNALITY, EXECUTOR) VALUES (?, ?, ?, ?)`;

            await connect.db.execute(sql, [interaction.guild.id, c, f, interaction.user.id]).catch(err => {throw err});
        }
    },
};