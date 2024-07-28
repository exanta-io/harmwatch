'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchSideBarConversations } from '@/lib/api';
import { Navbar, Sidebar } from '@/components';

interface ConversationsLayoutProps {
  children: React.ReactNode;
}

const ConversationsLayout: React.FC<ConversationsLayoutProps> = ({
  children,
}) => {
  const { data: sideBarEntries } = useQuery({
    queryKey: ['side-bar-entries'],
    queryFn: fetchSideBarConversations,
    refetchInterval: 4000,
  });


  if (typeof window !== 'undefined') {
    const currentUserHash = document.cookie
      .split('; ')
      .find((row) => row.startsWith('currentUserHash='))
      ?.split('=')[1];

    if (currentUserHash !== process.env.NEXT_PUBLIC_HASH) {
      window.location.href = '/login';
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex max-h-full h-[93vh] bg-base-300 overflow-hidden">
        <div className="flex w-full">
          <div className="flex-[1] max-w-xs max-w-[225px] overflow-hidden">
            <Sidebar chats={sideBarEntries ?? []} />
          </div>
          <div className="flex flex-[4] overflow-hidden">{children}</div>
        </div>
      </div>
    </>
  );
};

export default ConversationsLayout;
