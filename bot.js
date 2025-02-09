const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

// MongoDB'ye bağlanma
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB bağlantısı başarılı!');
}).catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers, // Üye olaylarını dinlemek için ekledik
    ],
});

client.commands = new Collection();

// Komutları yükle
commandHandler(client);

// Olayları yükle
eventHandler(client);

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
});

client.login(process.env.TOKEN);
