// useChatState.ts
import { useState, useRef } from 'react';
import ChatManager from '@/app/services/ChatManager';


type FileDetail = {
  name: string;
  type: string;
  size: number;
};

export const useChatState = () => {
  
  
  const [assistantName, setAssistantName] = useState('');
  const [assistantModel, setAssistantModel] = useState('gpt-3.5-turbo-1106');
  const [assistantDescription, setAssistantDescription] = useState('');
  const [inputmessage, setInputmessage] = useState('');
  const [submitType, setSubmitType] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: string; content: any; }[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isStartLoading, setStartLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [initialThreadMessage, setInitialThreadMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const counter = useRef(0);
  const formRef = useRef(null);
  const [chatManager, setChatManager] = useState<ChatManager | null>(null);
  const [assistantId, setAssistantId] = useState<string>( '');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoadingFirstMessage, setIsLoadingFirstMessage] = useState(false);
  const [chatUploadedFiles, setChatUploadedFiles] = useState<File[]>([]);
  const [chatFileDetails, setChatFileDetails] = useState<FileDetail[]>([]);


  return {
    assistantName, setAssistantName,
    assistantModel, setAssistantModel,
    assistantDescription, setAssistantDescription,
    inputmessage, setInputmessage,
    chatMessages, setChatMessages,
    chatStarted, setChatStarted,
    isButtonDisabled, setIsButtonDisabled,
    files, setFiles,
    assistantId, setAssistantId,
    threadId, setThreadId,
    isStartLoading, setStartLoading,
    isSending, setIsSending,
    statusMessage, setStatusMessage,
    counter,
    formRef,
    initialThreadMessage, 
    setInitialThreadMessage,
    chatManager, setChatManager,
    isMessageLoading, setIsMessageLoading,
    progress, setProgress,
    isLoadingFirstMessage, setIsLoadingFirstMessage,
    chatUploadedFiles, setChatUploadedFiles,
    chatFileDetails, setChatFileDetails,
    

  };
};