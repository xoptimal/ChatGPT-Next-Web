// hooks/useChatManager.ts
import { useEffect, Dispatch, SetStateAction } from 'react';
import ChatManager from '@/app/services/ChatManager';

export const useChatManager = (
  setChatMessages: (messages: any[]) => void,
  setStatusMessage: Dispatch<SetStateAction<string>>, 
  setChatManager: Dispatch<SetStateAction<ChatManager | null>>, 
  setIsMessageLoading: Dispatch<SetStateAction<boolean>>,
  setProgress: Dispatch<SetStateAction<number>>,
  setIsLoadingFirstMessage: Dispatch<SetStateAction<boolean>> 
) => {
  useEffect(() => {
    const chatManager = ChatManager.getInstance(setChatMessages, setStatusMessage, setProgress, setIsLoadingFirstMessage); 
    setChatManager(chatManager);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChatMessages, setStatusMessage, setProgress, setIsLoadingFirstMessage]);
};