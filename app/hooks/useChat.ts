import { create } from 'zustand';
import { IChat, IMessage } from '../types';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import pusher from '../../lib/pusher';

interface ChatStore {
  chats: IChat[];
  activeChat: IChat | null;
  messages: IMessage[];
  isLoading: boolean;
  error: string | null;
  setActiveChat: (chat: IChat) => void;
  fetchChats: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  subscribeToChat: (chatId: string) => void;
  unsubscribeFromChat: (chatId: string) => void;
}

const useChat = create<ChatStore>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: [],
  isLoading: false,
  error: null,

  setActiveChat: (chat) => {
    set({ activeChat: chat });
    if (chat) {
      get().subscribeToChat(chat.id);
    }
  },

  fetchChats: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get('/api/chat');
      set({ chats: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch chats', isLoading: false });
      toast.error('Could not load chats');
    }
  },

  sendMessage: async (content: string) => {
    const { activeChat } = get();
    if (!activeChat) return;

    try {
      const response = await axios.post(`/api/chat/${activeChat.id}/messages`, {
        content
      });
      
      set((state) => ({
        messages: [...state.messages, response.data]
      }));
    } catch (error) {
      toast.error('Failed to send message');
    }
  },

  subscribeToChat: (chatId: string) => {
    const channel = pusher.subscribe(`chat-${chatId}`);
    
    channel.bind('new-message', (message: IMessage) => {
      set((state) => ({
        messages: [...state.messages, message]
      }));
    });
  },

  unsubscribeFromChat: (chatId: string) => {
    pusher.unsubscribe(`chat-${chatId}`);
  }
}));

export default useChat; 