const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    serverId: { type: String, required: true },
    partnerText: { type: String, required: true },
    partnerStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

module.exports = mongoose.model('Partner', PartnerSchema);
