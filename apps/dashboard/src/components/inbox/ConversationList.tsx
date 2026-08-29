'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { cn, formatRelativeTime, getInitials, truncate } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/lib/api';

interface Conversation {
  id: string;
  phone_number: string;
  contact_name: string | null;
  status: 'active' | 'handoff' | 'resolved' | 'archived';
  last_message_at: string;
  last_message?: {
    content: string;
    role: string;
  };
  unread_count?: number;
}

interface SearchResult {
  id: string;
  contact_name: string | null;
  phone_number: string;
  status: string;
  last_message_at: string;
  matching_message: {
    content: string;
    created_at: string;
  };
}

const filters = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Activas' },
  { key: 'handoff', label: 'Handoff' },
  { key: 'resolved', label: 'Resueltas' },
] as const;

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return truncate(text, 55);
  const start = Math.max(0, idx - 20);
  const snippet = text.slice(start, start + 75);
  const snipIdx = snippet.toLowerCase().indexOf(query.toLowerCase());
  if (snipIdx === -1) return truncate(text, 55);
  return (
    <>
      {start > 0 && '...'}
      {snippet.slice(0, snipIdx)}
      <strong className="text-foreground font-semibold">{snippet.slice(snipIdx, snipIdx + query.length)}</strong>
      {snippet.slice(snipIdx + query.length)}
      {start + 75 < text.length && '...'}
    </>
  );
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
}: ConversationListProps) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    const t = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get<{ data: SearchResult[] }>(
          `/api/conversations/search?q=${encodeURIComponent(search.trim())}`
        );
        setSearchResults(res.data);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = useMemo(() => {
    if (!search || searchResults !== null) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        (c.contact_name ?? '').toLowerCase().includes(q) ||
        c.phone_number.includes(q)
    );
  }, [conversations, search, searchResults]);

  const isSearchMode = search.trim().length > 0;
  const displayList = isSearchMode ? null : filtered;

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex h-14 items-center justify-between bg-surface-2 px-4">
        <h2 className="text-lg font-semibold text-foreground">Chats</h2>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2 border border-border">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conversaciones..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Filters */}
      {!isSearchMode && (
        <div className="flex gap-1.5 px-3 pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.key
                  ? 'bg-surface-2 text-foreground border border-border'
                  : 'text-muted hover:text-foreground hover:bg-surface'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {isSearchMode ? (
          isSearching ? (
            <div className="flex flex-col gap-1 px-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-3 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-surface-2 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/3 rounded-lg bg-surface-2" />
                    <div className="h-3 w-5/6 rounded-lg bg-surface-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults && searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border border-border mb-4">
                <Search className="h-8 w-8 text-muted" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Sin resultados</p>
              <p className="text-sm text-muted">No se encontraron mensajes</p>
            </div>
          ) : (searchResults || []).map((result) => (
            <button
              key={result.id}
              onClick={() => onSelect(result.id)}
              className={cn(
                'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-surface rounded-xl mx-1',
                selectedId === result.id && 'bg-surface-2'
              )}
            >
              <Avatar size="lg">
                {getInitials(result.contact_name)}
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-foreground">
                    {result.contact_name || result.phone_number}
                  </span>
                  <span className="text-xs text-muted font-mono">
                    {formatRelativeTime(result.matching_message.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted line-clamp-2">
                  {highlightMatch(result.matching_message.content, search.trim())}
                </p>
              </div>
            </button>
          ))
        ) : (displayList ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border border-border mb-4">
              <MessageSquare className="h-8 w-8 text-muted" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Sin conversaciones</p>
            <p className="text-sm text-muted">Conecta tu WhatsApp para empezar</p>
          </div>
        ) : (
          (displayList ?? []).map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-surface',
                selectedId === conversation.id && 'bg-surface-2'
              )}
            >
              <Avatar size="lg">
                {getInitials(conversation.contact_name)}
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-foreground">
                    {conversation.contact_name || conversation.phone_number}
                  </span>
                  <span className={cn(
                    'text-xs font-mono',
                    (conversation.unread_count ?? 0) > 0 ? 'text-accent-green font-medium' : 'text-muted'
                  )}>
                    {formatRelativeTime(conversation.last_message_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm text-muted">
                    {conversation.last_message
                      ? truncate(conversation.last_message.content, 55)
                      : 'Sin mensajes'}
                  </p>
                  {(conversation.unread_count ?? 0) > 0 && (
                    <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-green px-1 text-[11px] font-bold text-background">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
