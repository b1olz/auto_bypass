const { Client, GatewayIntentBits, EmbedBuilder, REST, Routes } = require('discord.js');
const { token } = require('./config.json'); // Import the token from config.json

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const commands = [
    {
        name: 'setupautodelete',
        description: 'Setup auto delete messages in a channel.',
        options: [
            {
                name: 'channel',
                type: 7, // Channel type
                description: 'The channel to monitor for messages.',
                required: true,
            },
            {
                name: 'time',
                type: 4, // Integer type
                description: 'Time in seconds to delete messages.',
                required: true,
            },
            {
                name: 'logchannel',
                type: 7, // Channel type
                description: 'The channel to log deleted messages.',
                required: true,
            },
            {
                name: 'deletebotmessages',
                type: 5, // Boolean type
                description: 'Delete bot messages?',
                required: false,
            },
        ],
    },
];

// Register commands with Discord API
const rest = new REST({ version: '9' }).setToken(token);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const autoDeleteSettings = new Map(); // Store settings for each channel

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'setupautodelete') {
        const targetChannel = interaction.options.getChannel('channel');
        const timeInSeconds = interaction.options.getInteger('time');
        const logChannel = interaction.options.getChannel('logchannel');
        const deleteBotMessages = interaction.options.getBoolean('deletebotmessages') || false;

        // Check if the target channel is already set up for auto-deletion
        if (autoDeleteSettings.has(targetChannel.id)) {
            return await interaction.reply({ content: 'Autodelete is already setup!', ephemeral: true });
        }

        // Store settings
        autoDeleteSettings.set(targetChannel.id, {
            time: timeInSeconds * 1000, // Convert to milliseconds
            logChannelId: logChannel.id,
            deleteBotMessages,
        });

        await interaction.reply({ content: `Auto delete setup complete! Messages in ${targetChannel} will be deleted after ${timeInSeconds} seconds. Logs will be sent to ${logChannel}.`, ephemeral: true });
        
        // Set up the message listener for the target channel
        client.on('messageCreate', async (message) => {
            if (message.channel.id === targetChannel.id) {
                // Check if the message is a bot message and if bot message deletion is enabled
                if (message.author.bot && deleteBotMessages) {
                    await logDeletedMessage(message);
                    return message.delete().catch(console.error);
                }

                // Wait for the specified time before deleting user messages
                setTimeout(async () => {
                    if (message.deletable) {
                        await logDeletedMessage(message);
                        message.delete().catch(console.error);
                    }
                }, timeInSeconds * 1000); // Time in milliseconds
            }
        });
    }
});

// Function to log deleted messages
async function logDeletedMessage(message) {
    const settings = autoDeleteSettings.get(message.channel.id);
    if (settings) {
        const logChannel = client.channels.cache.get(settings.logChannelId);
        if (logChannel) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Message Deleted')
                .addFields(
                    { name: 'Author', value: message.author.username, inline: true },
                    { name: 'Content', value: message.content || 'No content', inline: true },
                    { name: 'Deleted At', value: new Date().toLocaleString(), inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    }
}

// Log in to the bot
client.login(token);
