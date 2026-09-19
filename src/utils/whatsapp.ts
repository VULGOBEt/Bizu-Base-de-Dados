import { Order, ServiceOrder } from '../types';
import { formatBRL, formatDate } from './formatters';

export function sanitizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return '';
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = '55' + cleaned;
  }
  return cleaned;
}

export function generateOrderWhatsAppText(order: Order): string {
  const itemsList = order.items
    .map((item) => `• *${item.qty}x* ${item.name} (${formatBRL(item.qty * item.unitPrice)})`)
    .join('\n');

  let discountText = '';
  if (order.discount && order.discount > 0) {
    discountText = `\n💰 *Subtotal:* ${formatBRL(order.subtotal || order.total + order.discount)}\n🏷️ *Desconto:* -${formatBRL(order.discount)}`;
  }

  return `*BIZÚ ARTIGOS MILITARES* 🪖
*Comprovante do Pedido #${order.id}*

*Soldado:* ${order.soldado || 'N/I'}
*Tipo Sanguíneo:* ${order.bloodType || 'N/I'}
*Força:* ${order.force || 'Polícia Militar'} ${order.battalion ? `• ${order.battalion}` : ''}
*Data/Hora:* ${formatDate(order.date)}
*Pagamento:* ${order.paymentMethod}

📦 *Equipamentos do Pedido:*
${itemsList}
${discountText}
💵 *Valor Total:* *${formatBRL(order.total)}*

Agradecemos a preferência e o compromisso! Equipamento conferido e aprovado. 🛡️`;
}

export function generateOsWhatsAppText(os: ServiceOrder): string {
  const pendingValue = os.value - (os.deposit || 0);
  const isReady = os.status === 'ENTREGUE' || os.status === 'CONCLUIDO';

  return `*BIZÚ TÁTICO - OFICINA & CUSTOMIZAÇÃO* 🛠️
*Ordem de Serviço ${os.id}*

*Soldado:* ${os.soldado || os.warName || 'N/I'}
*Tipo Sanguíneo:* ${os.bloodType || 'N/I'}
*Força/Unidade:* ${os.force || 'Polícia Militar'}
*Serviço:* ${os.serviceType}
*Item/Equipamento:* ${os.itemDescription || '-'}
*Status:* ${os.status === 'CONCLUIDO' ? '✅ Concluído' : os.status === 'ENTREGUE' ? '📦 Entregue' : os.status === 'EM_SEPARACAO' ? '⚙️ Em Separação' : '❌ Cancelado'}

💵 *Valor Total:* ${formatBRL(os.value)}
💳 *Sinal Pago:* ${formatBRL(os.deposit || 0)}
⚠️ *Saldo Restante:* *${formatBRL(pendingValue)}*

${isReady ? 'Seu equipamento já foi entregue ou concluído no nosso arsenal! 🪖' : 'Seu equipamento está em processo de separação na oficina.'}`;
}

export function openWhatsApp(phone: string, text?: string) {
  const cleanNum = sanitizePhone(phone);
  // Abre a conversa direta com o cliente sem nenhum texto previsto
  const url = cleanNum ? `https://wa.me/${cleanNum}` : `https://wa.me/`;
  window.open(url, '_blank');
}

/**
 * Retorna o link direto do WhatsApp do cliente:
 * Apenas abre a conversa direta sem nenhum texto previsto
 */
export function buildOsWhatsAppUrl(os: ServiceOrder): string {
  let cleanPhone = (os.phone || '').replace(/\D/g, '');
  if (cleanPhone.length > 0) {
    if (cleanPhone.startsWith('55') && cleanPhone.length > 11) {
      // Já possui o DDI 55
    } else {
      cleanPhone = '55' + cleanPhone;
    }
  }

  // Abre diretamente a conversa com o número do cliente, sem texto pré-definido
  return cleanPhone ? `https://wa.me/${cleanPhone}` : `https://wa.me/`;
}
