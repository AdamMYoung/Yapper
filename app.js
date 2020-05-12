const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = 'yap';

const connections = {};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`Capturing ${client.guilds.size} clips`);
});

client.on('guildCreate', (guild) => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Capturing ${client.guilds.size} clips`);
});

client.on('guildDelete', (guild) => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Capturing ${client.guilds.size} clips`);
});

client.on('message', async (msg) => {
    const { content, member } = msg;
    if (msg.author.bot) return;

    if (content.indexOf(prefix) !== 0) return;

    const args = content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command == 'start') {
        if (member.voice.channel) {
            const channel = member.voice.channel;
            const connection = await channel.join();

            connections[channel.id] = connection;
        } else {
            msg.reply('Your need to join a voice channel first!');
        }
    }

    if (command == 'stop') {
        if (member.voice.channel) {
            const channel = member.voice.channel;
            if (connections[channel.id]) {
                connections[channel.id].disconnect();
            } else {
                msg.reply("I'm not currently in your channel!");
            }
        }
    }

    if (command.indexOf('clip') !== 0) {
    }
});

client.login('');
