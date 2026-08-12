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
*RE/Matrícula:* ${order.re || 'N/I'} | *CPF:* ${order.cpf || 'N/I'}
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
  const isReady = os.status === 'SEPARADO' || os.status === 'ENTREGUE' || os.status === 'CONCLUIDO';

  return `*BIZÚ TÁTICO - OFICINA & CUSTOMIZAÇÃO* 🛠️
*Ordem de Serviço #${os.id}*

*Soldado:* ${os.soldado || os.warName || 'N/I'}
*RE/Matrícula:* ${os.re || os.militaryId || 'N/I'} | *CPF:* ${os.cpf || 'N/I'}
*Tipo Sanguíneo:* ${os.bloodType || 'N/I'}
*Força/Unidade:* ${os.force || 'Polícia Militar'}
*Serviço:* ${os.serviceType}
*Item/Equipamento:* ${os.itemDescription || '-'}
*Status:* ${isReady ? '✅ PRONTO PARA RETIRADA / CONCLUÍDO!' : os.status === 'EM_SEPARACAO' ? '⚙️ Em Separação' : '⏳ Registrado'}

💵 *Valor Total:* ${formatBRL(os.value)}
💳 *Sinal Pago:* ${formatBRL(os.deposit || 0)}
⚠️ *Saldo Restante:* *${formatBRL(pendingValue)}*

${isReady ? 'Seu equipamento já está pronto para retirada no nosso arsenal! 🪖' : 'Acompanhe seu pedido pelo nosso atendimento.'}`;
}

export function openWhatsApp(phone: string, text?: string) {
  const cleanNum = sanitizePhone(phone);
  const url = cleanNum ? `https://wa.me/${cleanNum}` : `https://wa.me/`;
  window.open(url, '_blank');
}
