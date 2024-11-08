const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require("discord.js");
// const { token } = require("./config.json");
require("dotenv").config();

const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const images = [];

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}


const prompts = [
    {
        name: 'solved',
        description: 'Close the current thread as solved.',
    },
    {
        name: 'tolive',
        description: 'Ready to be live',
    },
    {
        name: 'testing',
        description: 'Testing',
    },
];

const rest = new REST({ version: '10' }).setToken(token);


(async () => {
    try {
      console.log('Started refreshing application (/) commands globally.');
  
      // Register the command globally (for all servers)
      await rest.put(Routes.applicationCommands("1299432912235659376"), { body: prompts });
  
      console.log('Successfully reloaded application (/) commands globally.');
    } catch (error) {
      console.error(error);
    }
  })();

// Array of command objects
const responses = {
    "!hi": (message) => {
        const userName = message.author.globalName;
        const avatarUrl = message.author.displayAvatarURL({ dynamic: true });
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Hi ${userName}!`)
            .setDescription(`Welcome to the server!`)
            .setTimestamp();

        message.reply({ embeds: [embed], files: [avatarUrl] });
    },
    "!image": (message) => {
        const imageUrl = images[getRandomInt(0, images.length - 1)];
        message.reply({ files: [imageUrl] });
    }
};

const commands = {
    "!hi": responses["!hi"],
    "!hello": responses["!hi"],
    "!image": responses["!image"],
    "!img": responses["!image"],
};

// Listen for the 'ready' event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for the 'messageCreate' event
client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Respond to mentions
    if (message.mentions.has(client.user)) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Hello!')
            .setDescription(`You mentioned me! Type \`!help\` to see what I can do.`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    // Check if message content matches any command
    const command = commands[message.content];
    if (command) {
        command(message);
    }
    console.log(message.channel.isThread(), "IS THREAD")

    // // Archive thread if "SOLVED" is in the message and it's in a thread
    // if (message.content.toUpperCase().includes("SOLVED") && message.channel.isThread()) {
    //     await message.channel.setArchived(true);
    //     message.channel.send("Thread closed as resolved.");
    // }
});


client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === "solved") {
        if (interaction.channel.isThread()) {
            await interaction.reply("Thread closed as resolved.");
            await interaction.channel.setArchived(true);
        } else {
            await interaction.reply("This command can only be used within a thread.");
        }
    }else if (interaction.commandName === "tolive") {
        if (interaction.channel.isThread()) {
            let name = interaction.channel.name
            name = name?.replace("[Testing] - ", "").replace("[Ready to be live] - ", '')
            const newTitle = `[Ready to be live] - ${name}`;
            await interaction.channel.setName(newTitle);

            // Send the reply before archiving the thread
            await interaction.reply("Ready to be live");
        } else {
            await interaction.reply("This command can only be used within a thread.");
        }
    }else if (interaction.commandName === "testing") {
        if (interaction.channel.isThread()) {
            let name = interaction.channel.name
            name = name?.replace("[Testing]", "").replace("[Ready to be live]", '')
            const newTitle = `[Testing] - ${name}`;
            await interaction.channel.setName(newTitle);

            // Send the reply before archiving the thread
            await interaction.reply("Testing is in progress");
        } else {
            await interaction.reply("This command can only be used within a thread.");
        }
    }
});

// Log in to Discord
client.login(token);
