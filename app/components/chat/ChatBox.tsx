import { useState, useEffect, useRef } from 'react';
import { IMessage} from '@/app/types';
import { SafeUser } from '@/types';
import useChat from '@/hook/useChat';
import Avatar from '@/components/Avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send } from 'lucide-react';

interface ChatBoxProps {
  currentUser: SafeUser;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  currentUser
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    activeChat,
    messages,
    sendMessage,
    isLoading
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage('');
  };

  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg: IMessage) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.userId === currentUser.id ? 'flex-row-reverse' : ''
            }`}
          >
            <Avatar src={msg.user.image} />
            <div
              className={`
                max-w-[70%] rounded-lg p-3
                ${
                  msg.userId === currentUser.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-neutral-100'
                }
              `}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-neutral-500 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="
          border-t
          p-4
          flex
          items-center
          gap-2
        "
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox; 