const { PermissionsBitField } = require("discord.js");
const consts = require("../constants");

const perms = [
    PermissionsBitField.All,
    PermissionsBitField.Flags.MuteMembers,
    PermissionsBitField.Flags.ManageGuild,
    PermissionsBitField.Flags.KickMembers,
    PermissionsBitField.Flags.BanMembers,
    PermissionsBitField.Flags.Administrator
];

// Checks if the executor and bot have permission to execute a command on a guild member
function hasPerms(target, action, interaction){

    //setup default user perms
    let userPerms = [0, 0];

    //searching highest perms level
    for(let i = 1; i < perms.length; i++){
        if(interaction.member.permissions.has(perms[i])){
            userPerms[0] = i;
        }
        if(target.permissions.has(perms[i])){
            userPerms[1] = i;
        }
    }

    //message if executor doesn't have perms
    if(userPerms[0] <= userPerms[1]){
        return interaction.reply({
            embeds: [{
                title: `Commande refusée : Permissions insuffisantes`,
                description: `Tu ne peux pas ${action} un membre ayant un rôle égal ou supérieur au tien`,
                color: consts.embedColor2
            }],
            ephemeral: true
        });
    }
}

// Checks if the bot has perms
function botPerms(interaction, action, permsission){
    if(!interaction.guild.members.me.permissions.has(permsission)){
        return interaction.reply({
            embeds: [{
                title: `Erreur !`,
                description: `Je ne possède pas les droits pour ${action}`,
                color: consts.embedColor2
            }],
            ephemeral: true
        });
    }
}

module.exports = {
    hasPerms,
    botPerms
};