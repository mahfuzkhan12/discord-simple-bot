const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Array of command objects
const responses = {
    "!hi": (message) => {
        const userName = message.author.globalName;
        const avatarUrl = message.author.displayAvatarURL({ dynamic: true });
        const serverName = message.guild.name;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Hi ${userName}!`)
            .setDescription(`Welcome to the server!`)
            // .setThumbnail(avatarUrl)
            .setTimestamp();

        // const imageUrl = 'https://img.freepik.com/premium-photo/close-up-bearded-man-with-hat-beard-generative-ai_1028860-68622.jpg?w=1480'; // Replace with your image URL
        // message.reply({ embeds: [embed], files: [imageUrl] });
        message.reply({ embeds: [embed], files: [avatarUrl] });
        message.reply({ embeds: [embed] });
        // message.reply(`Hi ${userName}!`);
    },
    "!image": (message) => {
        const userName = message.author.globalName;
        const avatarUrl = message.author.displayAvatarURL({ dynamic: true });
        const serverName = message.guild.name;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Image!`)
            // .setThumbnail(avatarUrl)
            .setTimestamp();

        const imageUrl = 'https://img.freepik.com/premium-photo/close-up-bearded-man-with-hat-beard-generative-ai_1028860-68622.jpg?w=1480'; // Replace with your image URL
        message.reply({ embeds: [embed], files: [imageUrl] });
        // message.reply({ embeds: [embed], files: [avatarUrl, imageUrl] });
        // message.reply({ embeds: [embed] });
        // message.reply(`Hi ${userName}!`);
    }
}
const commands = {
    "!hi": responses["!hi"], 
    "!hello": responses["!hi"],
    "!image": responses["!image"],
}

// Listen for the 'ready' event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for the 'messageCreate' event
client.on('messageCreate', message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    if (message.mentions.has(client.user)) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Hello!')
            .setDescription(`You mentioned me! Type \`!help\` to see what I can do.`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    // Check for each command in the commands array
    const command = commands[message.content]
    if (command) {
        command(message);
    }
});

// Log in to Discord
client.login(token);
