// api.ts

export const listAssistants = async (limit: number, before?: string, after?: string) => {
    console.log('Listing assistants...');

    const response = await fetch(`/api/listAssistants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({limit, before, after})
    });
    // ... existing error handling and response parsing
    return response.json();
};

// Uploads a base64 encoded image and gets a description
export const uploadImageAndGetDescription = async (base64Image: unknown) => {
    console.log('Uploading image...');
    const response = await fetch('/api/upload_gpt4v', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: base64Image }),
    });
    if (!response.ok) {
      console.error('Error processing image');
      throw new Error('Error processing image');
    }
    console.log('Image uploaded successfully');
    return await response.json();
  };
  
  // Uploads a file
  export const uploadFile = async (file: File) => {
    console.log('Uploading file...');
    const fileData = new FormData();
    fileData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: fileData,
    });
    if (!response.ok) {
      console.error('File upload failed');
      throw new Error('File upload failed');
    }
    console.log('File uploaded successfully');
    const jsonResponse = await response.json();
    console.log('Server response:', jsonResponse); // Add this line
    return { fileId: jsonResponse.fileId }; // return only the fileId
  };
  
  // Creates an assistant
  export const createAssistant = async (assistantName: string, assistantModel: string, assistantDescription: string, fileIds: string[]) => {
    console.log('Creating assistant...');
    
    // Log the assistant details and file IDs
    console.log('(create)-> Assistant Name:', assistantName);
    console.log('(create)-> Assistant Model:', assistantModel);
    console.log('(create)-> Assistant Description:', assistantDescription);
    console.log('(create)-> File IDs:', fileIds);

    const response = await fetch('/api/createAssistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistantName, assistantModel, assistantDescription, fileIds: fileIds }),
    });
    if (!response.ok) {
      console.error('Failed to create assistant');
      throw new Error('Failed to create assistant');
    }
    console.log('Assistant created successfully');
    return await response.json();
  };
  
  // Creates a thread
  export const createThread = async (inputmessage?: string) => {
    console.log('Creating thread...');
    const response = await fetch('/api/createThread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ inputmessage }),
    });
    if (!response.ok) {
      console.error('Failed to create thread');
      throw new Error('Failed to create thread');
    }
    console.log('Thread created successfully');
    return await response.json();
  };
  
  // Runs an assistant
  export const runAssistant = async (assistantId: string, threadId: string) => {
    console.log('Running assistant...');
    console.log(assistantId)
    console.log(threadId)
    const response = await fetch('/api/runAssistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistantId, threadId }),
    });
    if (!response.ok) {
      console.error('Failed to run assistant');
      throw new Error('Failed to run assistant');
    }
    const data = await response.json();
    console.log('Assistant run successfully. Run ID:', data.runId);
    return data;
  };


  // Cancels run
    export const cancelOngoingRun = async (threadId: string | null, runId: string) => {
    console.log('Running assistant...');
    console.log(threadId)
    
    const response = await fetch('/api/cancelRun', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, runId }),
    });
    if (!response.ok) {
      console.error('Failed to cancel run');
      throw new Error('Failed to cancel run');
    }
  
    console.log("run canceled successfully")
  };
  
  // Checks the status of a run
  export const checkRunStatus = async (threadId: string, runId: string) => {
    console.log('Checking run status...');
    const response = await fetch('/api/checkRunStatus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, runId }),
    });
    if (!response.ok) {
      console.error('Failed to check run status');
      throw new Error('Failed to check run status');
    }
    console.log('Run status checked successfully');
    return await response.json();
  };


  // Lists messages
  export const listMessages = async (threadId: string | null, runId: string) => {
    console.log('Listing messages...');
    const response = await fetch('/api/listMessages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, runId }),
    });
    if (!response.ok) {
      console.error(`Error fetching messages: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to list messages: ${response.status} ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    console.log('Messages listed successfully');
    return jsonResponse;
  };

  // Lists runs in a thread
  export const listRuns = async (threadId: string | null) => {
    console.log('Listing runs...');
    const response = await fetch('/api/listRuns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId }),
    });
    if (!response.ok) {
      console.error(`Error fetching runs: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to list runs: ${response.status} ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    console.log('Runs listed successfully');
    return jsonResponse;
  };

  // Fetches assistant response message 
    export const getAssistantResponse = async (threadId: string, runId: string) => {
    console.log('Listing messages...');
    const response = await fetch('/api/getAssistantResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, runId }),
    });
    if (!response.ok) {
      console.error(`Error fetching assistant response: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch assistant response: ${response.status} ${response.statusText}`);
    }
    const jsonResponse = await response.json();
    console.log('Response fetched successfully');
    return jsonResponse;
  };
  
  // Adds a message
  export const addMessage = async (data: { threadId: string; input: string; fileIds: string[] }) => {
    console.log('File IDs in addMessage:', data.fileIds);
    console.log('Adding message...');
    const response = await fetch('/api/addMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      console.error('Failed to add message');
      throw new Error('Failed to add message');
    }
    console.log('Message added successfully');
    return await response.json();
  };