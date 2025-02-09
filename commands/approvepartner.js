const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Partner = require('../models/Partner');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('approvepartner')
        .setDescription('Bir partnerlik başvurusunu onayla.')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Onaylanacak kullanıcıyı seç')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const serverId = interaction.guild.id;

        const application = await Partner.findOne({ userId: user.id, serverId });

        if (!application || application.partnerStatus !== 'pending') {
            return interaction.reply({
                content: '⚠️ Bu kullanıcı için onay bekleyen bir başvuru bulunamadı!',
                ephemeral: true,
            });
        }

        application.partnerStatus = 'approved';
        await application.save();

        try {
            await user.send(`✅ Partnerlik başvurun onaylandı! İşte sunucunun partnerlik metni:\n\`\`\`${application.partnerText}\`\`\``);
        } catch (error) {
            console.error(`Kullanıcıya DM atılamadı: ${error}`);
        }

        const partnerChannel = interaction.guild.channels.cache.find(ch => ch.name === 'partners');
        if (partnerChannel) {
            partnerChannel.send(`📢 **Yeni Partner!**\n\`\`\`${application.partnerText}\`\`\``);
        }

        await interaction.reply({ content: `✅ ${user.tag} adlı kullanıcının partnerliği onaylandı!`, ephemeral: true });
    }
};
