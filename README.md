
# Discord Auto-Delete Bot

A Discord bot that automatically deletes messages in a specified channel after a set period. The bot can log deleted messages to a designated log channel and allows for optional deletion of bot messages.

## Features

- Automatically delete user messages after a specified time.
- Option to delete bot messages.
- Log deleted messages to a specified channel.
- Slash command interface for easy setup.

## Installation

1. **Unzip the File:**

   ```bash
   git clone https://github.com/b1olz/auto_delete
   cd auto_delete
   ```
2. **Install dependencies:**

   Ensure you have [Node.js](https://nodejs.org/) installed. Then run:

   ```bash
   npm install
   ```

3. **Setup a `config.json` file:**

   Setup a `config.json` file in the root directory of the project with the following structure:

   ```json
   {
     "token": "YOUR_BOT_TOKEN"
   }
   ```

   Replace `YOUR_BOT_TOKEN` with your actual Discord bot token.

## Usage

1. **Run the bot:**

   Start the bot using Node.js:

   ```bash
   npm start
   ```

2. **Setup Auto-Delete:**

   Use the `/setupautodelete` slash command to configure the auto-delete feature. The command requires the following parameters:
   - **channel**: The channel to monitor for messages.
   - **time**: Time in seconds before messages are deleted.
   - **logchannel**: The channel where deleted messages will be logged.
   - **deletebotmessages**: Optional boolean to specify if bot messages should be deleted.

   Example command:
   ```
   /setupautodelete channel:<channel_id> time:<seconds> logchannel:<log_channel_id> deletebotmessages:<true/false>
   ```

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

## Contributing

If you wish to contribute to this project, please fork the repository and create a pull request.

## Acknowledgments

- [discord.js](https://discord.js.org/) - A powerful library for interacting with the Discord API.

- [Node.js](https://nodejs.org) - A backend javascript Framework.

## Credits - NexzGen Team
- StefanDevz : Head Developer & Owner

- ! CallmezYokoz : Owner (with me)

- Sukoi : Moderator

This `README.md` provides clear instructions for setting up and using your Discord bot, along with legal licensing information.
