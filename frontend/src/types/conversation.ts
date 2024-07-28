export interface Message {
    id: string;
    conversation_id: string;
    content: string;
    role: 'user' | 'assistant';
  }
  
export interface Conversation {
    id: string;
    filename: string;
    title: string;
    messages: Message[];
  }

export interface ConversationCreate {
    title: string;
    filename: string;
  }

  export interface ConversationUpdate {
    title: string;
  }
    
export interface SidebarEntry {
    id: string;
    title: string;

  }
  
export interface Document {
    filename: string;
  }