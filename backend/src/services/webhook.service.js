import axios from 'axios';

export const sendWebhook = async (evento, datos) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('N8N_WEBHOOK_URL no configurada. Webhook no enviado.');
      return;
    }

    const payload = {
      evento,
      datos,
      timestamp: new Date().toISOString()
    };

    await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    console.log(`✓ Webhook enviado: ${evento}`);
  } catch (error) {
    console.error(`Error enviando webhook ${evento}:`, error.message);
    // No lanzar error para no interrumpir el flujo principal
  }
};
