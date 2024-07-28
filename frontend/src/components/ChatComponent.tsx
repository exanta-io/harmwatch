'use client';
import React, { useEffect, useState } from 'react';
import { useStoreDisplaySettings } from '@/store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchChatData, fetchChatQuery } from '@/lib/api';
import { Conversation } from '@/types/conversation';
import MessageList from './MessageList';
import { PaperPlaneRight } from '@phosphor-icons/react';

interface ChatComponentProps {
  chatID: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chatID }) => {
  const [input, setInput] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [clearResponse, setClearResponse] = useState(false);
  const [sources, setSources] = useState<string[]>([]);

  const { setDisplayFile } = useStoreDisplaySettings();
  const queryClient = useQueryClient();

  const { data: chatData, isLoading } = useQuery<Conversation>({
    queryKey: [`/conversations/${chatID}`],
    queryFn: () => fetchChatData(chatID),
    retry: false,
  });

  const fetchAnswer = async (chatID: string, query: string) => {
    setIsWaitingAnswer(true);
    try {
      const data = await fetchChatQuery(chatID, query);
      setAssistantResponse('');
      setSources([]);
      if (data && data.response) {
        streamAssistantResponse(data.response);
        if (data.sources) {
          setSources(data.sources);
        }
      } else {
        setAssistantResponse('Unexpected response format.');
      }
    } catch (error) {
      setAssistantResponse('An error occurred. Please try again.');
    } finally {
      setIsWaitingAnswer(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClearResponse(false);
    setUserQuery(input);
    setAssistantResponse('');
    fetchAnswer(chatID, input);
    setInput('');
  };

  const streamAssistantResponse = (response: string) => {
    if (!response) {
      return;
    }

    setAssistantResponse('');

    let index = 0;
    const interval = setInterval(() => {
      if (index < response.length) {
        setAssistantResponse((prev) => prev + response[index]);
        index++;
      } else {
        clearInterval(interval);
        queryClient.invalidateQueries({
          queryKey: [`/conversations/${chatID}`],
        });
      }
    }, 10);
  };

  useEffect(() => {
    if (chatData) {
      setClearResponse(true);
      setDisplayFile(chatData.filename);
    }
  }, [chatData]);

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 mb-6 inset-x-0 p-2 bg-neutral rounded-lg h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MessageList
          isLoading={isLoading}
          messages={chatData?.messages ?? []}
          isWaitingAnswer={isWaitingAnswer}
          userQuery={userQuery}
          assistantResponse={assistantResponse}
          clearResponse={clearResponse}
          sources={sources}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 p-2 bg-neutral rounded-lg"
      >
        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any question..."
            className="w-full input focus:outline-none"
            disabled={isWaitingAnswer}
          />
          <button
            type="submit"
            className="btn btn-outline btn-primary ml-2"
            disabled={isWaitingAnswer || !input}
          >
            <PaperPlaneRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
