const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Komutları Discord'a kaydet
const commandHandler = require('./handlers/commandHandler');

// Slash komutları kaydetme fonksiyonu
async function registerCommands() {
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    try {
        // Belirli bir sunucuya komutları kaydediyoruz
        const guild = client.guilds.cache.get('YOUR_GUILD_ID'); // Burada sunucu ID'nizi girin
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
    console.log('Bot hazır!');
    registerCommands(); // Komutları kaydet
    commandHandler(client); // Komut işleyicisini başlat
});

// Botu giriş yapmak için token ile başlat
client.login('TOKEN');  // Botunuzun token'ını buraya yazın
