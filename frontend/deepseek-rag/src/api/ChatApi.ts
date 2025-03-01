export async function fetchChatResponse({ query, selectedDocuments = [], model = 'deepseek-chat' }: {
  query: string;
  selectedDocuments?: string[];
  model?: string;
}): Promise<Response> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      selectedDocuments,
      model,
      num_predict: 2048,
      disable_streaming: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat response');
  }

  return response;
} 