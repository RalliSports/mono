export interface StreamWebhookUser {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  banned: boolean;
  online: boolean;
  channel_unread_count?: number;
  channel_last_read_at?: string;
  total_unread_count?: number;
  unread_channels?: number;
  unread_count?: number;
}

export interface StreamWebhookMessage {
  id: string;
  text: string;
  html: string;
  type: string;
  user: StreamWebhookUser;
  attachments: any[];
  latest_reactions: any[];
  own_reactions: any[];
  reaction_counts: any;
  reaction_scores: Record<string, any>;
  reply_count: number;
  created_at: string;
  updated_at: string;
  mentioned_users: string[];
}

export interface StreamWebhookMember {
  user_id: string;
  user: StreamWebhookUser;
  created_at: string;
  updated_at: string;
  notifications_muted?: boolean;
}

export interface StreamWebhookPayload {
  type: 'message.new' | 'message.updated' | 'message.deleted';
  cid: string;
  message: StreamWebhookMessage;
  user: StreamWebhookUser;
  created_at: string;
  members: StreamWebhookMember[];
  channel_type: string;
  channel_id: string;
}
