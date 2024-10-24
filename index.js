const { Client, GatewayIntentBits } = require('discord.js');

// Create a new Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Ensure this is added
    ]
});

// Sample race texts
const raceTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Hello world, welcome to the typing race!",
    "Speed typing is fun and challenging.",
    "This is a simple typing race game on Discord."
];

let raceText = "";
let players = {}; // Store player progress
let isActiveRace = false;
let raceInterval;

// Function to start the race
function startRace(channel) {
    raceText = raceTexts[Math.floor(Math.random() * raceTexts.length)];
    players = {};
    isActiveRace = true;

    // Notify users and display the race text
    channel.send(`**🏁 Typing Race Started!**\nType the following text as fast as you can:\n\n\`${raceText}\``);
    
    // Start the race interval to update the progress every second
    raceInterval = setInterval(() => updateRace(channel), 1000);
}

// Function to update the race
function updateRace(channel) {
    let raceDisplay = "**Current Race Progress:**\n\n";

    // Generate the display for each player
    Object.keys(players).forEach(playerId => {
        const { name, progress } = players[playerId];
        const percentage = (progress / raceText.length) * 100;

        // Create a visual "car" representing the player's progress (using emojis)
        const carPosition = Math.floor((progress / raceText.length) * 20);
        const car = '🚗'.padStart(carPosition + 1, '-');

        raceDisplay += `${name}: ${car} (${percentage.toFixed(1)}%)\n`;
    });

    // Send or update the race status message
    channel.send(raceDisplay);
}

// Function to check and update the player's progress
function checkProgress(message) {
    const playerId = message.author.id;
    const playerName = message.author.username;

    // If it's the player's first message, register them in the race
    if (!players[playerId]) {
        players[playerId] = { name: playerName, progress: 0 };
    }

    // Update progress only for the correct typed portion
    const typed = message.content;
    let correctProgress = 0;

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === raceText[i]) {
            correctProgress++;
        } else {
            break;
        }
    }

    players[playerId].progress = correctProgress;

    // Check if the player has finished the race
    if (correctProgress === raceText.length) {
        finishRace(message);
    }
}

// Function to finish the race
function finishRace(message) {
    const finishTime = (Date.now() - players[message.author.id].startTime) / 1000;
    message.channel.send(`🎉 **${message.author.username}** finished the race in **${finishTime.toFixed(2)} seconds!**`);
    
    // End the race
    isActiveRace = false;
    clearInterval(raceInterval); // Stop updating progress
}

// Bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Listen for messages
client.on('messageCreate', message => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Start a race when the command is issued
    if (message.content === '!race') {
        if (!isActiveRace) {
            startRace(message.channel);
        } else {
            message.channel.send("A race is already active! Wait until it's finished.");
        }
    }

    // Track typing progress for the active race
    if (isActiveRace && message.content.length <= raceText.length) {
        checkProgress(message);
    }
});

// Login the bot using your token
client.login('MTI5ODk0MTk0ODk0NTUwMjIwOA.G7iO82.FO587fl7m91M8E0btaVjFH0cihyiJM8wPcBVm4');
