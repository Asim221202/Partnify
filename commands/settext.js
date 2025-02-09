const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settext')
        .setDescription('Partner onaylandığında kullanıcıya gönderilecek mesajı belirler.')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Kullanıcılara gönderilecek partnerlik mesajını girin.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const text = interaction.options.getString('text');
        const guildId = interaction.guild.id;

        await GuildSettings.findOneAndUpdate(
            { guildId },
            { partnerMessage: text },
            { upsert: true, new: true }
        );

        await interaction.reply({
            content: `✅ **Partner mesajı başarıyla ayarlandı:**\n\`\`\`${text}\`\`\``,
            ephemeral: true
        });
    }
};
