'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConversations } from '@/hooks/useConversations';
import { ConversationList } from '@/components/inbox/ConversationList';
import { ChatView } from '@/components/inbox/ChatView';
import { LeadSidebar } from '@/components/inbox/LeadSidebar';
import { useMessages } from '@/hooks/useMessages';

function InboxSkeleton() {
  return (
    <div className="flex h-full">
      <div className="w-full md:w-[350px] md:shrink-0 flex flex-col border-r border-border">
        <div className="h-14 border-b border-border bg-background px-4 flex items-center gap-2">
          <div className="h-4 w-24 rounded-lg bg-surface-2 animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border animate-pulse">
            <div className="h-10 w-10 rounded-full bg-surface-2 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-2/3 rounded-lg bg-surface-2" />
              <div className="h-3 w-5/6 rounded-lg bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<InboxSkeleton />}>
      <InboxContent />
    </Suspense>
  );
}

function InboxContent() {
  const searchParams = useSearchParams();
  const initialConversation = searchParams.get('conversation');

  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(initialConversation);
  const [showSidebar, setShowSidebar] = useState(false);

  const { conversations, loading } = useConversations(filter === 'all' ? undefined : filter);
  const { conversation } = useMessages(selectedId);

  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setShowSidebar(false);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <div className="flex h-full">
      {/* Left Panel — Conversation List */}
      <div className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-[350px] md:shrink-0`}>
        <ConversationList
          conversations={conversations.map((c) => ({
            id: c.id,
            phone_number: c.phone_number,
            contact_name: c.contact_name,
            status: c.status,
            last_message_at: c.last_message_at,
            last_message: c.last_message,
            unread_count: c.unread_count,
          }))}
          selectedId={selectedId}
          onSelect={handleSelect}
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {/* Right Panel — Chat View */}
      <div className={`${selectedId ? 'flex' : 'hidden md:flex'} flex-1 min-w-0`}>
        <ChatView
          conversationId={selectedId}
          onToggleSidebar={() => setShowSidebar((s) => !s)}
          onBack={handleBack}
        />
      </div>

      {/* Optional Right Sidebar — Lead Info */}
      {showSidebar && conversation?.lead && (
        <LeadSidebar
          lead={conversation.lead}
          onClose={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
