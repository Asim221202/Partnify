const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Partner = require('../models/Partner');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('approvepartner')
        .setDescription('Bir partnerlik başvurusunu onayla.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Onaylanacak kullanıcıyı seç')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        // Partner başvurusunu bul
        const application = await Partner.findOne({ userId: user.id, serverId: guildId });

        if (!application || application.partnerStatus !== 'pending') {
            return interaction.reply({
                content: '⚠️ Bu kullanıcı için onay bekleyen bir başvuru bulunamadı!',
                ephemeral: true
            });
        }

        // Partner kanalını MongoDB'den al
        const settings = await GuildSettings.findOne({ guildId });

        if (!settings || !settings.partnerChannelId) {
            return interaction.reply({
                content: '⚠️ Partner kanalı ayarlanmadı! Lütfen `/setchannel` ile ayarlayın.',
                ephemeral: true
            });
        }

        application.partnerStatus = 'approved';
        await application.save();

        try {
            await user.send(`✅ Partnerlik başvurun onaylandı! İşte sunucunun partnerlik metni:\n\`\`\`${application.partnerText}\`\`\``);
        } catch (error) {
            console.error(`Kullanıcıya DM atılamadı: ${error}`);
        }

        // Partner mesajını belirtilen kanala gönder
        const partnerChannel = interaction.guild.channels.cache.get(settings.partnerChannelId);
        if (partnerChannel) {
            partnerChannel.send(`📢 **Yeni Partner!**
