const { Client, GatewayIntentBits, EmbedBuilder, Partials, PermissionsBitFieldconst } = require('discord.js');
const os = require('os');

const logChannels = new Map();
const voiceConnections = {};


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

client.once('ready', () => {
    console.log(`✅ ${client.user.tag}`);
});

// Help

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('-help')) {
        const embed = new EmbedBuilder()
            .setColor(0x1F8B4C)
            .setTitle(`Ayuda`)
            .setDescription(`COMANDOS`)
            .addFields(
                { name: '-help', value: `Menú`, inline: true },
                { name: '-vc', value: `user vc`, inline: true },
            )
            .setFooter({ text: 'Creado por zSpunky_rip' })
            .setImage('https://cdn.discordapp.com/attachments/1290083534651916400/1314418055782203392/lv_0_20241205232526.gif?ex=6753b2b5&is=67526135&hm=32b17df82b1222ee31ec9294f4328471150df95db10b4258f9c96779c4c4025d&')
            .setTimestamp();
        message.channel.send({ embeds: [embed] });
    }
});

// Tracker main

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('-vc')) {
        const user = message.mentions.users.first() || message.author;
        const guildId = message.guild.id;
        if (!voiceConnections[guildId] || !voiceConnections[guildId][user.id]) {
            return message.reply(`${user.tag} no está conectado a un canal de voz.`);
        }
        const connection = voiceConnections[guildId][user.id];
        const duration = Date.now() - connection.joinTime;
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        const streamInfo = connection.isStreaming
            ? `Sí (${Math.floor((Date.now() - connection.streamStart) / 1000)}s)`
            : 'No';
        const embed = new EmbedBuilder()
            .setColor(0x1F8B4C)
            .setTitle(`VC TRACKER`)
            .setDescription(`${user.tag} está en el canal **${connection.channel}**`)
            .addFields(
                { name: 'Tiempo en el VC', value: `${hours}h ${minutes}m ${seconds}s`, inline: false },
                { name: '¿Silenciado?', value: connection.muted ? 'Sí' : 'No', inline: true },
                { name: '¿Ensordecido?', value: connection.deafened ? 'Sí' : 'No', inline: true },
                { name: '¿Está transmitiendo?', value: streamInfo, inline: true },
            )
            .setFooter({ text: 'Creado por zSpunky_rip' })
            .setTimestamp();
        message.channel.send({ embeds: [embed] });
    }
});


client.login('Pone tu BOT TOKEN');
