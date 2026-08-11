import { Product, MilitaryProfile, Order, Activity, ServiceOrder, StoreConfig, UserPermission, StockMovement } from '../types';

export const PRODUCT_CATEGORIES = [
  'Fardamento & Gandolas',
  'Vestuário & Camisas',
  'Calças & Bermudas',
  'Calçados & Coturnos',
  'Coletes & Porta-Placas',
  'Cintos & Cinturões',
  'Mochilas & Bolsas',
  'Bordados & Tarjetas',
  'Insígnias & Divisas',
  'Acessórios & Lanternas',
  'Coldres & Equipamentos',
  'Outros / Personalizado'
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', sku: 'TAC-001', code: '1001', name: 'Coturno Tático Airstep Ripstop 42', category: 'Calçados & Coturnos', size: '42', costPrice: 220.00, salePrice: 389.90, stock: 12, minStock: 4, supplier: 'Airstep', location: 'Prateleira A1' },
  { id: '2', sku: 'TAC-002', code: '1002', name: 'Cinto Tático Operacional Níquel 40mm', category: 'Cintos & Cinturões', size: 'Único', costPrice: 35.00, salePrice: 89.90, stock: 25, minStock: 5, supplier: 'Bélica', location: 'Arara B2' },
  { id: '3', sku: 'TAC-003', code: '1003', name: 'Calça Tática Ripstop Camuflada EB Tam 44', category: 'Calças & Bermudas', size: '44', costPrice: 95.00, salePrice: 189.00, stock: 3, minStock: 5, supplier: 'Invictus', location: 'Gaveta V1' },
  { id: '4', sku: 'TAC-004', code: '1004', name: 'Mochila Tática Modular 45L Pretas', category: 'Mochilas & Bolsas', size: '45L', costPrice: 140.00, salePrice: 279.90, stock: 8, minStock: 3, supplier: 'Invictus', location: 'Prateleira M3' },
  { id: '5', sku: 'TAC-005', code: '1005', name: 'Farda Operacional PM Completa Tam G', category: 'Fardamento & Gandolas', size: 'G', costPrice: 180.00, salePrice: 320.00, stock: 2, minStock: 4, supplier: 'Confecção Militar', location: 'Gaveta V2' },
  { id: '6', sku: 'TAC-006', code: '1006', name: 'Coldre de Perna Velado Neoprene G2c', category: 'Coldres & Equipamentos', size: 'Padrão', costPrice: 28.00, salePrice: 65.00, stock: 18, minStock: 6, supplier: 'Bélica', location: 'Painel C1' }
];

export const BLOOD_TYPES = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
];

export const INITIAL_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'OS-000001',
    number: 'OS-000001',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    deliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    soldado: 'João Silva',
    re: '142.508-3',
    cpf: '123.456.789-00',
    bloodType: 'O+',
    force: 'Polícia Militar',
    rank: '3º Sgt',
    warName: 'SILVA',
    militaryId: '142.508-3',
    phone: '(11) 98888-1234',
    battalion: '12º BPM / 2ª Cia',
    serviceType: 'Bordado de Tarjeta & Velcros',
    itemDescription: '2x Gandolas PMESP Ripstop + 1x Japona',
    specifications: 'Bordar Tarjetas para o Soldado Silva + Aplicação de Velcro Fêmea nas mangas.',
    items: [
      { productId: '3', sku: 'TAC-003', name: 'Calça Tática Ripstop Camuflada EB Tam 44', qty: 1, unitPrice: 189.00 }
    ],
    value: 120.00,
    deposit: 50.00,
    paymentMethod: 'Pix Tático',
    priority: 'ALTA',
    status: 'EM_SEPARACAO',
    notes: 'Prioridade para entrega antes do serviço de escala.',
    createdBy: 'Atendimento',
    historyLogs: [
      { id: 'log-1', date: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'Atendimento', action: 'OS Criada', statusTo: 'NOVO' },
      { id: 'log-2', date: new Date(Date.now() - 86400000).toISOString(), user: 'Atendimento', action: 'Iniciou separação', statusFrom: 'NOVO', statusTo: 'EM_SEPARACAO' }
    ]
  },
  {
    id: 'OS-000002',
    number: 'OS-000002',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    deliveryDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    soldado: 'Carlos Oliveira',
    re: '021.984-1',
    cpf: '987.654.321-11',
    bloodType: 'A+',
    force: 'Exército Brasileiro',
    rank: 'Capitão',
    warName: 'OLIVEIRA',
    militaryId: '021.984-1',
    phone: '(11) 97777-4321',
    battalion: '28º Batalhão de Infantaria',
    serviceType: 'Ajuste de Farda & Aplicação de Brevê',
    itemDescription: '1x Gandola EB Camuflada Tam G',
    specifications: 'Ajustar barra da bainha e aplicar Brevê Tático de Paraquedista.',
    items: [],
    value: 85.00,
    deposit: 85.00,
    paymentMethod: 'Cartão de Crédito',
    priority: 'NORMAL',
    status: 'SEPARADO',
    notes: 'Pronto na arara de retiradas.',
    createdBy: 'Atendimento',
    historyLogs: [
      { id: 'log-3', date: new Date(Date.now() - 86400000 * 5).toISOString(), user: 'Atendimento', action: 'OS Criada', statusTo: 'NOVO' },
      { id: 'log-4', date: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'Atendimento', action: 'Material Separado', statusFrom: 'EM_SEPARACAO', statusTo: 'SEPARADO' }
    ]
  }
];

export const SERVICE_TYPES = [
  'Bordado de Tarjeta / Soldado',
  'Ajuste de Farda / Bainha de Calça',
  'Aplicação de Velcros & Brevês Táticos',
  'Confecção de Insígnias e Brasões',
  'Customização de Colete Modular / Pouches',
  'Adaptação de Coldre / Neoprene Velado',
  'Troca de Zíper / Botões Militares',
  'Serviço de Gravação a Laser / Placas'
];

export const INITIAL_SALES: Order[] = [
  {
    id: 'PEDIDO-9001',
    date: new Date(Date.now() - 86400000).toISOString(),
    soldado: 'Marcos Souza',
    re: '154.320-9',
    cpf: '456.789.123-55',
    bloodType: 'O+',
    force: 'Polícia Militar',
    battalion: '12º BPM / 2ª Cia',
    paymentMethod: 'Pix Tático',
    orderType: 'Venda Direta',
    items: [{ productId: '1', name: 'Coturno Tático Airstep Ripstop 42', qty: 1, unitPrice: 389.90 }],
    total: 389.90,
    createdBy: 'Balcão'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 'act-1', date: new Date().toISOString(), type: 'SALE', description: 'Baixa de Pedido #PEDIDO-9001 para 3º Sgt SILVA (PM)', user: 'Capitão Silva' },
  { id: 'act-2', date: new Date(Date.now() - 3600000 * 2).toISOString(), type: 'ADD', description: 'Reposição de estoque: +10 Coturnos Airstep', user: 'Capitão Silva' }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    productId: '1',
    productName: 'Coturno Tático Airstep Ripstop 42',
    sku: 'TAC-001',
    type: 'ENTRADA',
    qty: 10,
    user: 'Capitão Silva',
    reason: 'Reposição de Fornecedor',
    supplier: 'Airstep',
    invoice: 'NF-88421'
  },
  {
    id: 'mov-2',
    date: new Date(Date.now() - 86400000).toISOString(),
    productId: '1',
    productName: 'Coturno Tático Airstep Ripstop 42',
    sku: 'TAC-001',
    type: 'VENDA',
    qty: 1,
    osId: 'PEDIDO-9001',
    user: 'Capitão Silva',
    reason: 'Venda Direta Balcão'
  }
];

export const INITIAL_STORE_CONFIG: StoreConfig = {
  name: 'BIZÚ',
  slogan: 'Artigos Militares & Táticos',
  cnpj: '42.189.902/0001-88',
  phone: '(11) 98888-1234',
  address: 'Av. das Forças Armadas, 190 - Centro Militar',
  pixKey: '42189902000188',
  receiptNote: 'Obrigado por confiar na BIZÚ Artigos Militares! Servir e Proteger.',
  orderPrefix: 'PEDIDO-',
  maxDiscountPercent: 20,
  autoPrintReceipt: true,
  theme: 'tactical-dark',
};

export const INITIAL_USERS: UserPermission[] = [
  {
    id: 'user-1',
    name: 'Capitão Silva',
    email: 'silva.admin@bizutatico.com.br',
    password: 'admin',
    role: 'ADMINISTRADOR',
    active: true,
    canGiveDiscount: true,
    canManageUsers: true,
    canViewReports: true,
  },
  {
    id: 'user-2',
    name: 'Cabo Lima',
    email: 'lima.atendimento@bizutatico.com.br',
    password: 'operador',
    role: 'OPERADOR',
    active: true,
    canGiveDiscount: false,
    canManageUsers: false,
    canViewReports: false,
  },
  {
    id: 'user-3',
    name: 'Sargento Santos',
    email: 'santos.consulta@bizutatico.com.br',
    password: 'consulta',
    role: 'CONSULTA',
    active: true,
    canGiveDiscount: false,
    canManageUsers: false,
    canViewReports: true,
  },
];

export const MILITARY_FORCES = [
  'Exército Brasileiro',
  'Polícia Militar',
  'Polícia Civil',
  'Força Aérea',
  'Marinha do Brasil',
  'Corpo de Bombeiros',
  'Guarda Municipal',
  'Polícia Penal',
  'Polícia Federal',
  'CAC / Atirador',
  'Segurança Privada',
  'Civil / Tático'
];

export const MILITARY_RANKS = [
  'Soldado (Sd)',
  'Cabo (Cb)',
  '3º Sgt',
  '2º Sgt',
  '1º Sgt',
  'Subtenente / Suboficial',
  'Aspirante / Cadete',
  '2º Tenente',
  '1º Tenente',
  'Capitão',
  'Major',
  'Tenente-Coronel',
  'Coronel',
  'Agente / Inspetor',
  'Atirador / Civil'
];

