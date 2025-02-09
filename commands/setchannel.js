const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Partner sisteminin kanallarını ayarla.')
        .addChannelOption(option => 
            option.setName('partner')
                .setDescription('Partner mesajlarının paylaşılacağı kanal')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('log')
                .setDescription('Partner başvurularının bildirileceği log kanalı')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const partnerChannel = interaction.options.getChannel('partner');
        const logChannel = interaction.options.getChannel('log');

        await GuildSettings.findOneAndUpdate(
            { guildId },
            { partnerChannelId: partnerChannel.id, partnerLogChannelId: logChannel.id },
            { upsert: true, new: true }
        );

        await interaction.reply({
            content: `✅ Partner kanalı **<#${partnerChannel.id}>**, log kanalı **<#${logChannel.id}>** olarak ayarlandı.`,
            ephemeral: true
        });
    }
};
