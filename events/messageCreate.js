const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Botun kendi mesajlarını yok say
        if (message.author.bot) return;

        // Küçük/büyük harf farkını kaldırarak "partner" kelimesini kontrol et
        if (message.content.toLowerCase().includes("partner")) {
            const embed = new EmbedBuilder()
                .setColor("#5865F2") // Discord mavisi
                .setTitle("📢 Partnerlik Başvurusu")
                .setDescription(`**${message.author.username}**, eğer partner başvurusu yapmak istiyorsan **/partner** komutunu kullanabilirsin!`)
                .setFooter({ text: "Partnify Bot", iconURL: message.client.user.displayAvatarURL() });

            message.channel.send({ embeds: [embed] });
        }
    },
};
