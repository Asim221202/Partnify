const { Events, EmbedBuilder } = require('discord.js');
const Partner = require('../models/Partner');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'partnerApplication') {
                const partnerText = interaction.fields.getTextInputValue('partnerText');

                // Partnerlik başvurusunu kaydet
                const newApplication = new Partner({
                    userId: interaction.user.id,
                    serverId: interaction.guild.id,
                    partnerText,
                    partnerStatus: 'pending',
                });

                await newApplication.save();

                // Yetkililere bildirim gönder
                const partnerLogChannel = interaction.guild.channels.cache.find(ch => ch.name === 'partner-log'); // Partner yetkilileri için bir kanal adı

                if (partnerLogChannel) {
                    const embed = new EmbedBuilder()
                        .setColor("#FFA500")
                        .setTitle("📢 Yeni Partnerlik Başvurusu")
                        .setDescription(`**Kullanıcı:** ${interaction.user.tag}\n\n**Metin:**\n\`\`\`${partnerText}\`\`\``)
                        .setFooter({ text: "Onaylamak için /approvepartner kullanın" });

                    await partnerLogChannel.send({ embeds: [embed] });
                }

                await interaction.reply({
                    content: '✅ Partnerlik başvurun alındı! Yetkililer onayladığında bilgilendirileceksin.',
                    ephemeral: true,
                });
            }
        }
    }
};
