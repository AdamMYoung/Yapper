const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const commands = require('./commands.json');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`Memeing epicly!`);
});

client.on('guildCreate', (guild) => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on('guildDelete', (guild) => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('message', async (msg) => {
    const { content, member } = msg;
    if (msg.author.bot) return;

    let keywordMatched = false;

    commands.forEach((command) => {
        command.keywords.forEach(async (keyword) => {
            if (!keywordMatched && content.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
                if (member.voice.channel) {
                    const connection = await member.voice.channel.join();

                    try {
                        const dispatcher = connection.play(ytdl(command.clip, { filter: 'audioonly' }));

                        dispatcher.on('finish', () => {
                            connection.disconnect();
                        });
                    } catch {
                        connection.disconnect();
                    }

                    keywordMatched = true;
                }
            }
        });
    });
});

client.login('NzA5ODc1MjIwOTkwOTE4Njc3.Xr2Piw.6OQDoGbqgLnxdkLeKkqNkCC6upU');
