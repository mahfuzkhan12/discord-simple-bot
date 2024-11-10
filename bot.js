const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require("discord.js");
require("dotenv").config();

const token = process.env.DISCORD_TOKEN

// const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

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
    //   console.log('Started refreshing application (/) commands globally.');
      await rest.put(Routes.applicationCommands("1299432912235659376"), { body: prompts });
    //   console.log('Successfully reloaded application (/) commands globally.');
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
    // "!hi": responses["!hi"],
    // "!hello": responses["!hi"],
    // "!image": responses["!image"],
    // "!img": responses["!image"],
};

// Listen for the 'ready' event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
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

    const command = commands[message.content];
    if (command) {
        command(message);
    }
});


client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === "solved") {
        if (interaction.channel.isThread()) {
            try {
                await interaction.deferReply();

                let name = interaction.channel.name;
                name = name.replace("[Testing] - ", "").replace("[Ready to be live] - ", '').replace("[Solved] - ", '')
        
                const newTitle = `[Solved] - ${name}`;
                // console.log(newTitle, "name");
                await interaction.channel.setName(newTitle);
        
                await interaction.channel.setArchived(true);
        
                await interaction.followUp("Thread closed as resolved.");
            } catch (error) {
                // console.log("Error archiving thread:", error);
                await interaction.followUp("There was an error closing the thread.");
            }
        } else {
            await interaction.reply("This command can only be used within a thread.");
        }
    }else if (interaction.commandName === "tolive") {
        if (interaction.channel.isThread()) {
            let name = interaction.channel.name
            name = name?.replace("[Testing] - ", "").replace("[Ready to be live] - ", '').replace("[Solved] - ", '')
            const newTitle = `[Ready to be live] - ${name}`;
            await interaction.channel.setName(newTitle);

            await interaction.reply("Ready to be live");
        } else {
            await interaction.reply("This command can only be used within a thread.");
        }
    }else if (interaction.commandName === "testing") {
        if (interaction.channel.isThread()) {
            let name = interaction.channel.name
            name = name?.replace("[Testing] - ", "").replace("[Ready to be live] - ", '').replace("[Solved] - ", '')
            const newTitle = `[Testing] - ${name}`;
            await interaction.channel.setName(newTitle);

            await interaction.reply("Testing is in progress");
        } else {
            await interaction.reply("This command can only be used within a thread.");
        }
    }
});

async function fetchGuildMembers(guild, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await guild.members.fetch();
        } catch (error) {
            if (error.code === 'GuildMembersTimeout' && attempt < retries) {
                // console.log(`Retrying fetch attempt ${attempt}...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            } else {
                throw error;
            }
        }
    }
}


client.on("threadCreate", async (thread) => {
    try {
        const members = await fetchGuildMembers(thread.guild);

        for (const [memberId, member] of members) {
            if (!member.user.bot && thread.guild.members.me.permissionsIn(thread.parent).has("VIEW_CHANNEL")) {
                await thread.members.add(memberId);
            }
        }

        // console.log("All available members have been added to the thread.");
    } catch (error) {
        console.error("Error adding members to the thread:", error);
    }
});


// Log in to Discord
client.login(token);
