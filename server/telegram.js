const TG_API = 'https://api.telegram.org';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatLead({ name, phone, message }) {
  const lines = [
    '<b>🩺 Новая заявка с сайта</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
  ];
  if (message) {
    lines.push(`<b>Сообщение:</b> ${escapeHtml(message)}`);
  }
  lines.push('');
  lines.push(
    `<i>${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)</i>`
  );
  return lines.join('\n');
}

export async function sendTelegramMessage(lead, { token, chatId }) {
  const res = await fetch(`${TG_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLead(lead),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.description || `Telegram API error (${res.status})`);
  }
  return data.result;
}

const MAX_LEN = { name: 100, phone: 40, message: 2000 };

export function validateLead(body) {
  const name = String(body?.name ?? '').trim().slice(0, MAX_LEN.name);
  const phone = String(body?.phone ?? '').trim().slice(0, MAX_LEN.phone);
  const message = String(body?.message ?? '').trim().slice(0, MAX_LEN.message);

  if (!name || !phone) {
    return { error: 'Укажите имя и телефон', status: 400 };
  }
  return { lead: { name, phone, message } };
}

export async function handleContact(body, env) {
  const { lead, error, status } = validateLead(body);
  if (error) return { status, error };

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('[contact] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы');
    return { status: 500, error: 'Сервис временно недоступен' };
  }

  try {
    await sendTelegramMessage(lead, { token, chatId });
    return { status: 200, ok: true };
  } catch (e) {
    console.error('[contact] Ошибка отправки в Telegram:', e);
    return { status: 502, error: 'Не удалось отправить заявку' };
  }
}
