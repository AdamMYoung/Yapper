const Discord = require('discord.js');
const ytdl = require('ytdl-core');

var { validateClip, validateKeywords } = require('./clips/validator');
const { getClips, addEntry } = require('./clips/clipManager');

const client = new Discord.Client();
const commandPrefix = '-memer';

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

    //Check for commands.
    if (content.indexOf(commandPrefix) != -1) {
        const args = content.split(' ');
        const command = args[1];
        const keywords = [];
        const clip = content.substring(content.lastIndexOf('"') + 1).trimLeft();

        content
            .substring(content.indexOf('"') + 1, content.lastIndexOf('"'))
            .split(',')
            .forEach((keyword) => {
                keywords.push(keyword.trimLeft());
            });

        if (command == 'add') {
            const keywordValidation = validateKeywords(keywords);
            if (keywordValidation != null) {
                msg.reply(keywordValidation);
                return;
            }

            validateClip(clip, (isValid) => {
                if (!isValid) {
                    msg.reply(
                        "This clip isn't valid or may already exist. Please ensure it's a valid YouTube link, and is under 15 seconds."
                    );
                    return;
                } else {
                    addEntry(keywords, clip);
                    msg.reply(`Added! Keywords: "${keywords}" will play the clip: ${clip}`);
                }
            });
        }
    } else {
        //Check keywords for clip
        let keywordMatched = false;

        getClips().forEach((command) => {
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
    }
});

client.login('NzA5ODc1MjIwOTkwOTE4Njc3.Xr2UKQ.thKzwEdf-9z7pkphE82tW_n0RI4');
