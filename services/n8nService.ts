
import { N8N_WEBHOOK_URL } from '../constants';

export async function sendMessageToN8N(message: string): Promise<string> {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        timestamp: new Date().toISOString(),
        source: 'portfolio-web'
      }),
    });

    if (!response.ok) {
      throw new Error('Error en la comunicación con n8n');
    }

    const data = await response.json();
    
    // Asumimos que n8n devuelve un objeto con un campo 'output' o 'response'
    // Personaliza esto según la estructura que definas en tu flujo de n8n
    return data.output || data.response || "He recibido tu mensaje, gracias.";
  } catch (error) {
    console.error('N8N Service Error:', error);
    return "Lo siento, hubo un problema al conectar con mi cerebro artificial. Inténtalo de nuevo más tarde.";
  }
}
