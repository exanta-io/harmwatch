import request from './request';
import { Conversation, ConversationCreate, ConversationUpdate, SidebarEntry, Document } from '../types/conversation';

export const fetchSideBarConversations = async (): Promise<SidebarEntry[]> => {
    const { data } = await request.get('/conversations');
    return data.conversations;
  };

  export const fetchChatData = async (
    chatId: string,
  ): Promise<Conversation> => {
    const { data } = await request.get(
      `/conversations/${chatId}/`,
    );
   return data;
  };

  export const fetchChatQuery = async (chatID: string, query: string) => {
    const response = await request.get(`/conversations/${chatID}/chat?query_request=${query}`);

    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  };

  export const deleteConversation = async (chatID: string) => {
    const response = await request.delete(`/conversations/${chatID}/`);
    return response;
  };


export const fetchDocumentList= async (): Promise<Document[]> => {
  const response = await request.get('/documents');
  return response.data.documents;
}


export const createConversation = async (data: ConversationCreate) => {
  const { data: responseData } = await request.post(`/conversations/`, data);
  return responseData;
};

export const uploadDocument = async (formData: FormData) => {
  const response = await request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateConversation = async (chatID: string, data: ConversationUpdate) => {
  const response = await request.put(`/conversations/${chatID}/`, data);
  return response;
}


export const fetchPdfDocument = async (fileIdentifier: string): Promise<string> => {
  const response = await request.get(`/doc/${fileIdentifier}`, { responseType: 'blob' });
  if (response.status === 200) {
    const url = URL.createObjectURL(response.data);
    return url;
  }
  throw new Error('Failed to fetch PDF');
};
