import { Message } from '@/types/conversation';
import LoadingSpinner from './LoadingSpinner';
import LoadingResponse from './LoadingResponse';
import React from 'react';
import SourcesList from './SourceList';

type Props = {
  isLoading: boolean;
  messages: Message[];
  isWaitingAnswer: boolean;
  userQuery: string;
  assistantResponse: string;
  clearResponse: boolean;
  sources: string[];
  showSources?: boolean;
};

const MessageList = ({
  messages,
  isLoading,
  isWaitingAnswer,
  userQuery,
  assistantResponse,
  clearResponse,
  sources,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 px-4 pb-4 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
          <p className="ml-2 text-sm">Fetching chat data...</p>
        </div>
      ) : messages.length === 0 && !userQuery ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-lg font-bold">No chat history found</p>
          <p className="text-sm">
            Start a conversation by typing your message below.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end pl-10' : 'pr-10'}`}
          >
            <div
              className={`rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10
                ${message.role === 'user' ? 'bg-primary text-info-content' : 'bg-neutral'}`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))
      )}

      {!clearResponse && (
        <>
          {userQuery && (
            <div className="flex justify-end pl-10 animate-ease-in">
              <div className="rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10 bg-primary text-info-content">
                <p>{userQuery}</p>
              </div>
            </div>
          )}
          {isWaitingAnswer ? (
            <div className="flex pr-10 animate-ease-in">
              <div className="rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10 bg-neutral flex items-center">
                <LoadingResponse />
              </div>
            </div>
          ) : (
            assistantResponse && (
              <>
                <div className="flex pr-10 animate-ease-in">
                  <div className="rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10 bg-neutral">
                    <p>{assistantResponse}</p>
                  </div>
                </div>
              </>
            )
          )}
        </>
      )}
      {sources.length > 0 && clearResponse && <SourcesList sources={sources} />}
    </div>
  );
};

export default MessageList;
