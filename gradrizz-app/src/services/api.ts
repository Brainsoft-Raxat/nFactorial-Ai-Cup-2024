const API_BASE_URL = import.meta.env.VITE_BASE_API_URL; 

export const createChatTitle = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create_chat_title`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.title;
  } catch (error) {
    console.error('Error creating chat title:', error);
    throw error;
  }
};

export const sendMessage = async (message: string): Promise<ReadableStream<Uint8Array>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.body) {
      throw new Error('ReadableStream not yet supported in this browser.');
    }

    return response.body;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
