const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('partner')
        .setDescription('Partnerlik başvurusu yap!'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('partnerApplication')
            .setTitle('📢 Partnerlik Başvurusu');

        const partnerTextInput = new TextInputBuilder()
            .setCustomId('partnerText')
            .setLabel('Partnerlik metninizi girin')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Buraya sunucunuzun partnerlik metnini yazın...')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(partnerTextInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
};
