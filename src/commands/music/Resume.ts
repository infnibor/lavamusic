import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class Resume extends Command {
  constructor(client: Lavamusic) {
    super(client, {
      name: "resume",
      description: {
        content: "cmd.resume.description",
        examples: ["resume"],
        usage: "resume",
      },
      category: "music",
      aliases: ["r"],
      cooldown: 3,
      args: false,
      vote: false,
      player: {
        voice: true,
        dj: false,
        active: true,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: [
          "SendMessages",
          "ReadMessageHistory",
          "ViewChannel",
          "EmbedLinks",
        ],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }

  public async run(client: Lavamusic, ctx: Context): Promise<any> {
    const player = client.manager.getPlayer(ctx.guild!.id);
    const embed = this.client.embed();
    if (!player)
      return await ctx.sendMessage(
        ctx.locale("event.message.no_music_playing"),
      );
    if (!player.paused) {
      return await ctx.sendMessage({
        embeds: [
          embed
            .setColor(this.client.color.red)
            .setDescription(ctx.locale("cmd.resume.errors.not_paused")),
        ],
      });
    }

    player.resume();
    return await ctx.sendMessage({
      embeds: [
        embed
          .setColor(this.client.color.main)
          .setDescription(ctx.locale("cmd.resume.messages.resumed")),
      ],
    });
  }
}

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/YQsGbTwPBx
 */
