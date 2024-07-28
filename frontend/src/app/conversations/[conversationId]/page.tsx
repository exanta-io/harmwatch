'use state';
import React from 'react';
import ChatComponent from '@/components/ChatComponent';
import PdfViewer from '@/components/PdfViewer';

interface Props {
  params: {
    conversationId: string;
  };
}

const ConversationPage = async ({ params: { conversationId } }: Props) => {
  return (
    <div className="flex w-full max-h-screen overflow-hidden">
      <div className="bg-base-300 p-4 overflow-auto flex-[5]">
        <ChatComponent chatID={conversationId} />
      </div>
      <div className="flex-[2.5] mb-2 bg-base-300 border-l-2 border-l-neutral overflow-auto">
        <PdfViewer />
      </div>
    </div>
  );
};

export default ConversationPage;
