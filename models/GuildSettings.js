const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    partnerChannelId: { type: String, default: null },
    partnerLogChannelId: { type: String, default: null }
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);
