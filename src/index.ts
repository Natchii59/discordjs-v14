import { config } from 'dotenv';
config();

import {
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  InteractionType,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  REST,
  Routes,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const pingCommand = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ping Pong');

const registerCommand = new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register User');

client.once('ready', () => {
  console.log(client.user.tag);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    switch (interaction.commandName) {
      case 'ping':
        await interaction.reply({
          content: 'Pong',
        });
        break;

      case 'register':
        const modal = new ModalBuilder()
          .setCustomId('modal_register')
          .setTitle('Register User')
          .setComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('register_username')
                .setLabel('Username')
                .setStyle(TextInputStyle.Short)
            ),
            new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('register_email')
                .setLabel('Email')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
            ),
            new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('register_age')
                .setLabel('Age')
                .setStyle(TextInputStyle.Short)
            )
          );

        await interaction.showModal(modal);
        break;

      default:
        await interaction.reply({
          content: 'Commande inconnue',
        });
        break;
    }
  } else if (interaction.type === InteractionType.ModalSubmit) {
    switch (interaction.customId) {
      case 'modal_register':
        await interaction.reply({
          content: 'Your submission was received successfully!',
        });
        break;
    }
  }
});

(async () => {
  try {
    rest
      .put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        {
          body: [pingCommand.toJSON(), registerCommand.toJSON()],
        }
      )
      .then(() => console.log('Commands reloaded'))
      .catch(console.error);

    await client.login(process.env.TOKEN);
  } catch (err) {
    console.error(err);
  }
})();
