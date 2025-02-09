const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

// Ortam değişkenlerini yükle
dotenv.config();

// MongoDB bağlantısını kur
mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB bağlantısı başarılı!');
}).catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
});

// Discord.js bot istemcisini başlat
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers, // Üye olaylarını dinlemek için ekledik
    ],
});

client.commands = new Collection();

// Slash komutlarını kaydetme fonksiyonu
async function registerCommands() {
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    try {
        // Belirli bir sunucuya komutları kaydediyoruz
        const guild = client.guilds.cache.get(process.env.GUILD_ID); // Sunucu ID'sini environment dosyasından alıyoruz
        if (guild) {
            await guild.commands.set(commands); // Sunucuda komutları kaydet
            console.log('Slash komutları başarıyla sunucuya kaydedildi.');
        } else {
            console.log('Sunucu bulunamadı.');
        }
    } catch (error) {
        console.error('Slash komutları kaydedilirken bir hata oluştu:', error);
    }
}

// Bot hazır olduğunda çalışacak kod
client.once('ready', () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
    console.log('Bot hazır!');
    registerCommands(); // Komutları kaydet
    commandHandler(client); // Komut işleyicisini başlat
    eventHandler(client); // Olay işleyicisini başlat
});

// Botu giriş yapmak için token ile başlat
client.login(process.env.TOKEN);  // Botunuzun token'ını environment dosyasından alıyoruz
