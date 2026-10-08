/**
 * PIZZA CINE - Helper Oficial de Pagamentos PIX & Atendimento WhatsApp
 * Chave Oficial Homologada: 11973479473 (Telefone)
 * Formato exibido ao cliente: +55 11 97347-9473
 */

export const OFFICIAL_PIX_CONFIG = {
  rawKey: '11973479473',
  formattedKey: '+55 11 97347-9473',
  keyType: 'Telefone',
  recipientName: 'PIZZA CINE ENTRETENIMENTO',
  recipientCity: 'SAO PAULO',
  whatsappRaw: '5511973479473',
  whatsappFormatted: '+55 11 97347-9473',
  
  // Mensagens automáticas oficiais solicitadas
  defaultContactMessage: 'Olá! Vim pelo Pizza Cine e quero conhecer os planos de streaming.',
  defaultAnnualPlanMessage: 'Olá! Vim pelo Pizza Cine e quero assinar o plano anual. Gostaria de receber as opções de pagamento e parcelamento.',
  defaultProofMessage: 'Olá! Acabei de realizar o pagamento do plano anual no Pizza Cine. Estou enviando meu comprovante para ativação.'
};

/**
 * Retorna URL universal do WhatsApp para falar diretamente com a equipe do Pizza Cine
 */
export function getWhatsAppContactUrl(customMessage?: string): string {
  const msg = customMessage || OFFICIAL_PIX_CONFIG.defaultContactMessage;
  return `https://wa.me/${OFFICIAL_PIX_CONFIG.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}

/**
 * Retorna URL universal do WhatsApp para negociar / tirar dúvidas de parcelamento
 */
export function getWhatsAppNegotiateUrl(customMessage?: string): string {
  const msg = customMessage || OFFICIAL_PIX_CONFIG.defaultAnnualPlanMessage;
  return `https://wa.me/${OFFICIAL_PIX_CONFIG.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}

/**
 * Retorna URL universal do WhatsApp para envio do comprovante Pix
 */
export function getWhatsAppProofUrl(customMessage?: string): string {
  const msg = customMessage || OFFICIAL_PIX_CONFIG.defaultProofMessage;
  return `https://wa.me/${OFFICIAL_PIX_CONFIG.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}

/**
 * Calcula CRC16 CCITT (0xFFFF) para geração de padrão EMVCo do Pix Copia e Cola
 */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatEmvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Gera string no padrão EMVCo Pix (Copia e Cola oficial) com a chave telefone 11973479473
 */
export function generatePixCopiaECola(amount: number, transactionId: string = 'PIZZACINE'): string {
  const cleanPhone = `+55${OFFICIAL_PIX_CONFIG.rawKey}`; // +5511973479473 segundo especificação do Banco Central
  const cleanTxId = (transactionId.replace(/[^A-Za-z0-9]/g, '') || 'PIZZACINE').slice(0, 25);
  const formattedAmount = amount > 0 ? amount.toFixed(2) : '239.90';

  // 00: Payload Format Indicator
  let payload = formatEmvField('00', '01');
  // 01: Point of Initiation (12 = dinâmico, 11 = estático)
  payload += formatEmvField('01', '12');

  // 26: Merchant Account Information (Pix)
  const gui = formatEmvField('00', 'br.gov.bcb.pix');
  const key = formatEmvField('01', cleanPhone);
  payload += formatEmvField('26', `${gui}${key}`);

  // 52: Merchant Category Code
  payload += formatEmvField('52', '0000');
  // 53: Transaction Currency (986 = BRL)
  payload += formatEmvField('53', '986');
  // 54: Transaction Amount
  payload += formatEmvField('54', formattedAmount);
  // 58: Country Code
  payload += formatEmvField('58', 'BR');
  // 59: Merchant Name
  payload += formatEmvField('59', OFFICIAL_PIX_CONFIG.recipientName.slice(0, 25));
  // 60: Merchant City
  payload += formatEmvField('60', OFFICIAL_PIX_CONFIG.recipientCity.slice(0, 15));

  // 62: Additional Data Field Template (TxID)
  const txField = formatEmvField('05', cleanTxId);
  payload += formatEmvField('62', txField);

  // 63: CRC16
  const payloadToCrc = `${payload}6304`;
  const checksum = crc16(payloadToCrc);

  return `${payloadToCrc}${checksum}`;
}
