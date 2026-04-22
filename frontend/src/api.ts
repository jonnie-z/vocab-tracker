import type { NewVocabInput, VocabItem } from './types';

async function checkResponse(response: Response) {
  if (!response.ok) {
    let message = 'Request failed';

    try {
      message = await response.text();
    } catch {
      // ignore body parse failure and keep fallback message
    }

    throw new Error(message || 'Request failed');
  }

  return response;
}

export async function fetchVocab(): Promise<VocabItem[]> {
  const response = await fetch('/api/vocab');
  await checkResponse(response);
  return response.json();
}

export async function createVocab(input: NewVocabInput): Promise<VocabItem> {
  const response = await fetch('/api/vocab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  await checkResponse(response);
  return response.json();
}

export async function updateVocab(item: VocabItem): Promise<VocabItem> {
  const response = await fetch(`/api/vocab/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  await checkResponse(response);
  return response.json();
}

export async function deleteVocab(id: number): Promise<void> {
  const response = await fetch(`/api/vocab/${id}`, {
    method: 'DELETE',
  });

  await checkResponse(response);
}