const fs = require('fs'); // Dosya sistemini kullanmak için

module.exports = (client) => {
    console.log("Command handler loaded!");

    client.commands = new Map(); // Komutları bir Map içinde tutacağız

    // Komut dosyalarını okuma
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    // Her komut dosyasını yükleme
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`); // Komut dosyasını al
        client.commands.set(command.data.name, command); // Komutu map'e ekle
    }
};
