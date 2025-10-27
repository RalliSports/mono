import { StreamChat } from 'stream-chat';
export const chatClient = StreamChat.getInstance(
  process.env.STREAM_CHAT_API_KEY!,
  process.env.STREAM_CHAT_SECRET_KEY,
);

// export const connectToChat = async (userId: string) => {
//   const chatToken = await chatClient.createToken(userId);
//   await chatClient.connectUser({ id: userId }, chatToken);
// };
