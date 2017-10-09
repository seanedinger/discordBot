// calling dependencies / making requirements
const config = require('./config.json'); // config file
const Discord = require('discord.js');
const client = new Discord.Client();
const p = `${config.prefix}`;
//Crash haltings
process.on('uncaughtException', err => {
    return console.log(`Application Error: \n${err}`);
});
client.on('warn', info => {
    return console.log(`D.js Warning: \n${info}`);
});
process.on('unhandledRejection', reason => {
    return console.log(`Unhandled Rejection: \n${reason}`);
});
console.log('Connecting...');
client.on('ready', () => {
    console.log('PartyBot Connected Successfully');
});
client.on('message', message => {
    if (message.author.bot) return;
    const C = message.channel;
    const M = message.content;
    if (M.toLowerCase().startsWith(`${p}party`)) {
        if (!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
            return C.send(":warning: ERROR: You dont have permission to do this");
        }
        let memRole = message.guild.roles.find("name", `@everyone`);
        const VC = message.guild.members.get(message.author.id).voiceChannel;
        let args = message.content.split(" ").slice(1).join(" ");
        if (args.toLowerCase().startsWith('open')) {
            if (!VC) return C.send('You\'re not in any voice channel!');
            VC.overwritePermissions(memRole, {
                CONNECT: true
            });
            const opened = new Discord.RichEmbed()
                .setColor(`#2ecc40`)
                .setAuthor(`${message.author.username}`, `${message.author.avatarURL}`)
                .setTimestamp()
                .setDescription(`Opened **${VC.name}** to the public`);
            C.send({
                embed: opened
            });
        }
        if (args.toLowerCase().startsWith('invite')) {
            let cName = args.split(" ").slice(2).join(" ");
            if (!VC) return C.send('You\'re not in any voice channel!');
            if (message.mentions.users.size === 0) {
                return C.send(":warning: ERROR: Gotta mention somebody first.."); // didn't mention a user
            }
            message.guild.member(message.mentions.users.map(u => {
                VC.overwritePermissions(u, {
                    CONNECT: true
                });
                setTimeout(() => {
                    VC.overwritePermissions(u, {
                        CONNECT: null
                    });
                }, 180000); //expires invite after 3 minutes (180000ms)
            }));
            const invited = new Discord.RichEmbed()
                .setColor(`#2ecc40`)
                .setAuthor(`${message.author.username}`, `${message.author.avatarURL}`)
                .setTimestamp()
                .setDescription(`Invited people to **${VC.name}**`);
            C.send({
                embed: invited
            });
        }
        if (args.toLowerCase().startsWith('close')) {
            if (!VC) return C.send('You\'re not in any voice channel!');
            VC.overwritePermissions(memRole, {
                CONNECT: false
            });
            const closed = new Discord.RichEmbed()
                .setColor(`#ff4136`)
                .setAuthor(`${message.author.username}`, `${message.author.avatarURL}`)
                .setTimestamp()
                .setDescription(`Closed **${VC.name}** to the public`);
            C.send({
                embed: closed
            });
        }
        if (args.toLowerCase().startsWith('name')) {
            if (!VC) return C.send('You\'re not in any voice channel!');
            let cName = args.split(" ").slice(1).join(" ");
            VC.edit({
                    name: `${cName}`
                })
                .catch(e => {
                    C.send('An error happened while changing the name');
                    console.log(e);
                });
            const rename = new Discord.RichEmbed()
                .setColor(`#0074d9`)
                .setAuthor(`${message.author.username}`, `${message.author.avatarURL}`)
                .setTimestamp()
                .setDescription(`Named **${VC.name}**`);
            C.send({
                embed: rename
            });
        }
    }
});
client.login(`${config.token}`) //You can get this at https://discordapp.com/developers/applications/me