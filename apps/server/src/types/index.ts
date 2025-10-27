export * from './dto-types.auto';
export * from './service-types.auto';
// Games Service Types

// src/types/stream-chat.d.ts
import 'stream-chat';

declare module 'stream-chat' {
  interface CustomChannelData {
    name?: string;
    image?: string;
    description?: string;
    // Ralli-specific properties
    lobby_id?: string;
    game_mode?: string;
    max_players?: number;
    game_status?: 'waiting' | 'in_progress' | 'finished';
    lobby_host?: string;
  }
}
