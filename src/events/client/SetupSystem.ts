import { type Message, TextChannel } from "discord.js";
import { T } from "../../structures/I18n";
import { Event, type Lavamusic } from "../../structures/index";
import { oops, setupStart } from "../../utils/SetupSystem";

export default class SetupSystem extends Event {
  constructor(client: Lavamusic, file: string) {
    super(client, file, {
      name: "setupSystem",
    });
  }

  public async run(message: Message): Promise<any> {
    const locale = await this.client.db.getLanguage(message.guildId!);
    const channel = message.channel as TextChannel;
    if (!(channel instanceof TextChannel)) return;
    if (!message.member?.voice.channel) {
      await oops(channel, T(locale, "event.message.no_voice_channel_queue"));
      await message.delete().catch(() => {
        null;
      });
      return;
    }

    const voiceChannel = message.member.voice.channel;
    const clientUser = this.client.user;
    const clientMember = message.guild?.members.cache.get(clientUser!.id);

    /*  if (voiceChannel && clientUser && !voiceChannel?.permissionsFor(clientUser!).has(PermissionsBitField.Flags.Connect | PermissionsBitField.Flags.Speak)) {
            await oops(
                channel,
                T(locale, "event.message.no_permission_connect_speak", {
                    channel: voiceChannel.id,
                }),
            );
            await message.delete().catch(() => {});
            return;
        } */

    if (
      clientMember?.voice.channel &&
      clientMember.voice.channelId !== voiceChannel.id
    ) {
      await oops(
        channel,
        T(locale, "event.message.different_voice_channel_queue", {
          channel: clientMember.voice.channelId,
        }),
      );
      await message.delete().catch(() => {
        null;
      });
      return;
    }

    let player = this.client.manager.getPlayer(message.guildId!);
    if (!player) {
      player = this.client.manager.createPlayer({
        guildId: message.guildId!,
        voiceChannelId: voiceChannel.id,
        textChannelId: message.channelId,
        selfMute: false,
        selfDeaf: true,
        vcRegion: voiceChannel.rtcRegion!,
      });
      if (!player.connected) await player.connect();
    }

    await setupStart(this.client, message.content, player, message);
    await message.delete().catch(() => {
      null;
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
