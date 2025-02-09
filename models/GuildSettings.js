const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    partnerChannelId: { type: String, required: false },
    partnerMessage: { type: String, required: false }, // Partner mesajı saklanıyor
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);
