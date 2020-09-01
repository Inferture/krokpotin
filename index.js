require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

const PREFIX = process.env.PREFIX;

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    console.info(msg.content);

    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

    const args = msg.content.slice(PREFIX.length, msg.content.length).split(/ +/); // we remove the prefix from the string

    const commandName = args.shift().toLowerCase();
    console.info(`Called command: ${commandName}`);

    const regexdice = /(\d+)?d(\d+)([\+\-]\d+)?/g
    if (regexdice.test(commandName.substr(1)) && commandName.substr(1).match(regexdice)[0] === commandName.substr(1)) {
        // if (/\d+[d]\d+/.test(command.substr(1)) || (/\d*[d]\d+/.test(command.substr(1)) && command.substr(1).startsWith("d"))) {
        bot.commands.get("!dice").execute(msg, commandName);
    } else {
        try {
            const command = bot.commands.get(commandName)
            || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


          if (!command) {
            msg.channel.send("Invalid command");
            return;
          }

          command.execute(msg, args);
        } catch (error) {
            console.error(error);
            msg.reply('there was an error trying to execute that command!');
        }
    }
});

