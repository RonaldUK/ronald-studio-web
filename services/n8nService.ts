// services/n8nService.ts

// Esta es la URL de PRODUCCIÓN de tu n8n
const N8N_WEBHOOK_URL = 'https://ambitious-jacamar.pikapod.net/webhook/3e9f0456-198f-4ec7-9c7a-85822f93acf8';

export const sendMessageToN8N = async (text: string): Promise<string> => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Así es como n8n recibirá el texto
      body: JSON.stringify({
        message: {
          text: text
        }
      })
    });

    if (!response.ok) {
      throw new Error('Error al conectar con el servidor de IA');
    }

    const data = await response.json();
    
    // Asumiendo que n8n devuelve el mensaje en un campo llamado "output" o "text"
    // Esto lo ajustaremos dependiendo de cómo configures el nodo final en n8n
    return data.output || data.text || data.message || "Mensaje recibido por n8n (Falta configurar respuesta)";

  } catch (error) {
    console.error("Error conectando con n8n:", error);
    return "Lo siento, mis sistemas están en mantenimiento en este momento.";
  }
};