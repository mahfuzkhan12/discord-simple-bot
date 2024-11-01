const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const images = [
    "https://img.stablecog.com/insecure/2560w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vMTIwZWE5ZjctYWNmMS00NTUwLTliNjQtZWFiNjk0OWQ5MDVhLmpwZWc.webp",
    'https://img.freepik.com/premium-photo/close-up-bearded-man-with-hat-beard-generative-ai_1028860-68622.jpg?w=1480',
    'https://img.freepik.com/premium-photo/batman-neon-colors-standing-front-city-generative-ai_1034474-25600.jpg',
    'https://img.freepik.com/premium-vector/batman-dark-vector-illustration_969863-67173.jpg',
    'https://i.pinimg.com/736x/5c/2d/4a/5c2d4a824d07eabd17ec1ad147ca12ef.jpg',
    'https://m.media-amazon.com/images/S/pv-target-images/3de84cca07fc963b66a01a5465c2638066119711e89c707ce952555783dd4b4f.jpg',
    'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2014/12/10/1418217425767/The-Eye-of-Sauron-008.jpg',
    'https://cdna.artstation.com/p/assets/images/images/060/710/008/large/seba-endless-sauron.jpg',
    'https://img.freepik.com/free-photo/fantasy-landscape-floating-islands-illustration_23-2151844169.jpg',
    'https://img.freepik.com/free-photo/beautiful-mountains-landscape_23-2151151037.jpg',
    'https://png.pngtree.com/thumb_back/fh260/background/20240913/pngtree-beautiful-nature-scenery-wallpaper-view-image_16172461.jpg'
]

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

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

        // const embed = new EmbedBuilder()
        //     // .setColor('#0099ff')
        //     // .setTitle(`Image!`)
        //     // .setThumbnail(avatarUrl)
        //     .setTimestamp();

        const imageUrl = images[getRandomInt(0, images?.length - 1)]
        message.reply({ files: [imageUrl] });
        // message.reply({ embeds: [embed], files: [avatarUrl, imageUrl] });
        // message.reply({ embeds: [embed] });
        // message.reply(`Hi ${userName}!`);
    }
}
const commands = {
    "!hi": responses["!hi"],
    "!hello": responses["!hi"],
    "!image": responses["!image"],
    "!img": responses["!img"],
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
