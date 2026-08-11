import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { ProductsTab } from './components/ProductsTab';
import { PosTab } from './components/PosTab';
import { SalesHistoryTab } from './components/SalesHistoryTab';
import { ReportsTab } from './components/ReportsTab';
import { WorkOrdersTab } from './components/WorkOrdersTab';
import { SettingsTab } from './components/SettingsTab';

import { ProductModal } from './components/modals/ProductModal';
import { QuickSellModal } from './components/modals/QuickSellModal';
import { AdjustStockModal } from './components/modals/AdjustStockModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { ServiceOrderModal } from './components/modals/ServiceOrderModal';
import { ServiceOrderReceiptModal } from './components/modals/ServiceOrderReceiptModal';
import { UserModal } from './components/modals/UserModal';
import { checkUserPermission } from './utils/permissions';

import { Product, Order, Activity, CartItem, TabType, ServiceOrder, StoreConfig, UserPermission } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_ACTIVITIES,
  INITIAL_SERVICE_ORDERS,
  INITIAL_STORE_CONFIG,
  INITIAL_USERS,
} from './data/initialData';

export default function App() {
  // Persistence State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bizu_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bizu_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(() => {
    const saved = localStorage.getItem('bizu_service_orders');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_ORDERS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('bizu_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('bizu_store_config');
    return saved ? JSON.parse(saved) : INITIAL_STORE_CONFIG;
  });

  const [users, setUsers] = useState<UserPermission[]>(() => {
    const saved = localStorage.getItem('bizu_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    const saved = localStorage.getItem('bizu_active_user_id');
    return saved || 'user-1';
  });

  const activeUser = users.find((u) => u.id === activeUserId) || users.find((u) => u.role === 'ADMINISTRADOR') || users[0] || {
    id: 'user-1',
    name: 'Capitão Silva',
    email: 'silva.admin@bizutatico.com.br',
    role: 'ADMINISTRADOR',
    active: true,
    canGiveDiscount: true,
    canManageUsers: true,
    canViewReports: true,
  };

  const handleSelectUser = (user: UserPermission) => {
    if (user.role !== 'ADMINISTRADOR') {
      showToast(`⚠️ Alerta: O cargo selecionado (${user.role}) possui permissões limitadas no sistema.`);
    } else {
      showToast(`Operador alterado para ${user.name} (${user.role})`);
    }
    setActiveUserId(user.id);
    localStorage.setItem('bizu_active_user_id', user.id);
  };

  // UI State
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isQuickSellOpen, setIsQuickSellOpen] = useState(false);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentReceiptOrder, setCurrentReceiptOrder] = useState<Order | null>(null);

  // Service Order Modals
  const [isServiceOrderModalOpen, setIsServiceOrderModalOpen] = useState(false);
  const [editingServiceOrder, setEditingServiceOrder] = useState<ServiceOrder | null>(null);

  const [isServiceOrderReceiptModalOpen, setIsServiceOrderReceiptModalOpen] = useState(false);
  const [currentReceiptServiceOrder, setCurrentReceiptServiceOrder] = useState<ServiceOrder | null>(null);

  // User Management Modal
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserPermission | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('bizu_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bizu_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('bizu_service_orders', JSON.stringify(serviceOrders));
  }, [serviceOrders]);

  useEffect(() => {
    localStorage.setItem('bizu_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('bizu_store_config', JSON.stringify(storeConfig));
    const theme = storeConfig.theme || 'tactical-dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem('bizu_users', JSON.stringify(users));
  }, [users]);

  // Settings Actions
  const handleSaveStoreConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    showToast('Configurações salvas!');
  };

  const handleExportFullBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      products,
      sales,
      serviceOrders,
      activities,
      storeConfig,
      users,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `bizu_full_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup completo baixado com sucesso!');
  };

  const handleImportFullBackup = (jsonText: string): boolean => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed.products && Array.isArray(parsed.products)) setProducts(parsed.products);
      if (parsed.sales && Array.isArray(parsed.sales)) setSales(parsed.sales);
      if (parsed.serviceOrders && Array.isArray(parsed.serviceOrders)) setServiceOrders(parsed.serviceOrders);
      if (parsed.activities && Array.isArray(parsed.activities)) setActivities(parsed.activities);
      if (parsed.storeConfig) setStoreConfig(parsed.storeConfig);
      if (parsed.users && Array.isArray(parsed.users)) setUsers(parsed.users);

      showToast('Backup restaurado com sucesso!');
      return true;
    } catch {
      showToast('Erro: Arquivo JSON de backup inválido.');
      return false;
    }
  };

  const handleResetFactoryData = () => {
    if (window.confirm('Tem certeza que deseja restaurar o banco de dados inicial da BIZÚ?')) {
      localStorage.clear();
      setProducts(INITIAL_PRODUCTS);
      setSales(INITIAL_SALES);
      setServiceOrders(INITIAL_SERVICE_ORDERS);
      setActivities(INITIAL_ACTIVITIES);
      setStoreConfig(INITIAL_STORE_CONFIG);
      setUsers(INITIAL_USERS);
      showToast('Dados restaurados para os padrões de fábrica BIZÚ!');
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addActivity = (type: 'SALE' | 'ADD', description: string) => {
    const newAct: Activity = {
      id: 'act-' + Date.now(),
      date: new Date().toISOString(),
      type,
      description,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Service Order Actions
  const handleOpenNewOsModal = () => {
    setEditingServiceOrder(null);
    setIsServiceOrderModalOpen(true);
  };

  const handleOpenEditOsModal = (os: ServiceOrder) => {
    setEditingServiceOrder(os);
    setIsServiceOrderModalOpen(true);
  };

  const handleOpenOsReceipt = (os: ServiceOrder) => {
    setCurrentReceiptServiceOrder(os);
    setIsServiceOrderReceiptModalOpen(true);
  };

  const handleSaveServiceOrder = (data: Omit<ServiceOrder, 'id' | 'date'> & { id?: string }) => {
    if (data.id) {
      setServiceOrders((prev) =>
        prev.map((os) => (os.id === data.id ? ({ ...os, ...data } as ServiceOrder) : os))
      );
      addActivity('ADD', `Ordem de Serviço #${data.id} alterada (${data.soldado || data.warName || 'Soldado'})`);
      showToast(`OS #${data.id} atualizada com sucesso!`);
    } else {
      const osNumber = 'OS-' + Math.floor(1000 + Math.random() * 9000);
      const newOs: ServiceOrder = {
        ...data,
        id: osNumber,
        date: new Date().toISOString(),
      };
      setServiceOrders((prev) => [newOs, ...prev]);
      addActivity('ADD', `Nova Ordem de Serviço #${osNumber} emitida para ${data.soldado || data.warName || 'Soldado'}`);
      showToast(`Ordem de Serviço #${osNumber} emitida!`);
      setCurrentReceiptServiceOrder(newOs);
      setIsServiceOrderReceiptModalOpen(true);
    }
    setIsServiceOrderModalOpen(false);
  };

  const handleUpdateOsStatus = (id: string, status: ServiceOrder['status']) => {
    setServiceOrders((prev) =>
      prev.map((os) => (os.id === id ? { ...os, status } : os))
    );
    showToast(`Status da OS #${id} atualizado!`);
  };

  const handleDeleteServiceOrder = (id: string) => {
    if (window.confirm(`Excluir a Ordem de Serviço #${id}?`)) {
      setServiceOrders((prev) => prev.filter((os) => os.id !== id));
      showToast(`OS #${id} removida.`);
    }
  };

  // Product Actions
  const handleOpenProductModal = (id?: string) => {
    if (id) {
      const p = products.find((prod) => prod.id === id);
      setEditingProduct(p || null);
    } else {
      setEditingProduct(null);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (data: Omit<Product, 'id'> & { id?: string }) => {
    if (data.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === data.id ? ({ ...p, ...data } as Product) : p))
      );
      addActivity('ADD', `Equipamento alterado: ${data.name}`);
      showToast('Equipamento atualizado no arsenal!');
    } else {
      const newProd: Product = {
        ...data,
        id: Date.now().toString(),
      };
      setProducts((prev) => [newProd, ...prev]);
      addActivity('ADD', `Novo equipamento cadastrado: ${data.name} (${data.stock} un)`);
      showToast('Equipamento cadastrado com sucesso!');
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    if (window.confirm(`Excluir equipamento "${p.name}" do arsenal?`)) {
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
      addActivity('ADD', `Equipamento removido: ${p.name}`);
      showToast('Equipamento removido do arsenal.');
    }
  };

  // User Management Actions
  const handleOpenUserModal = (user?: UserPermission) => {
    const check = checkUserPermission(activeUser, 'canManageUsers');
    if (!check.allowed) {
      showToast(check.message || 'Você não possui permissão para gerenciar usuários.');
      return;
    }

    setSelectedUserForEdit(user || null);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (userData: Omit<UserPermission, 'id'> & { id?: string }) => {
    const check = checkUserPermission(activeUser, 'canManageUsers');
    if (!check.allowed) {
      showToast(check.message || 'Você não possui permissão para gerenciar usuários.');
      return;
    }

    if (userData.id) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userData.id ? ({ ...u, ...userData } as UserPermission) : u))
      );
      addActivity('ADD', `${activeUser?.name || 'Administrador'} atualizou o usuário ${userData.name} (${userData.role})`);
      showToast('Usuário atualizado com sucesso!');
    } else {
      const newUser: UserPermission = {
        ...userData,
        id: 'usr-' + Date.now(),
        lastAccess: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      addActivity('ADD', `${activeUser?.name || 'Administrador'} criou o novo usuário ${userData.name} (${userData.role})`);
      showToast('Novo usuário cadastrado com sucesso!');
    }
    setIsUserModalOpen(false);
  };

  const handleToggleUserStatus = (id: string) => {
    const check = checkUserPermission(activeUser, 'canManageUsers');
    if (!check.allowed) {
      showToast(check.message || 'Você não possui permissão para alterar status de usuários.');
      return;
    }

    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    if (targetUser.id === activeUser?.id) {
      showToast('Você não pode inativar seu próprio usuário logado!');
      return;
    }

    const newActiveState = !targetUser.active;
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: newActiveState } : u))
    );

    const statusLabel = newActiveState ? 'ATIVO' : 'INATIVO';
    addActivity('ADD', `${activeUser?.name || 'Administrador'} alterou status do usuário ${targetUser.name} para ${statusLabel}`);
    showToast(`Usuário ${targetUser.name} agora está ${statusLabel}!`);
  };

  // Adjust Stock Actions
  const handleOpenAdjustModal = (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    setAdjustingProduct(p);
    setIsAdjustModalOpen(true);
  };

  const handleConfirmAdjustStock = (
    productId: string,
    type: 'ADD' | 'REMOVE',
    qty: number,
    reason: string
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    if (type === 'REMOVE' && prod.stock < qty) {
      showToast('Quantidade a remover maior que estoque!');
      return;
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = type === 'ADD' ? p.stock + qty : p.stock - qty;
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    if (type === 'ADD') {
      addActivity('ADD', `+${qty} un adicionadas em ${prod.name} (${reason})`);
    } else {
      addActivity('SALE', `-${qty} un removidas de ${prod.name} (${reason})`);
    }

    showToast('Estoque do arsenal atualizado!');
    setIsAdjustModalOpen(false);
  };

  // POS Cart Actions
  const handleAddToCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod || prod.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        if (existing.qty < prod.stock) {
          return prev.map((item) =>
            item.productId === productId ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          showToast(`Limite do estoque atingido (${prod.stock} un)`);
          return prev;
        }
      } else {
        return [
          ...prev,
          {
            productId: prod.id,
            name: prod.name,
            salePrice: Number(prod.salePrice),
            maxStock: Number(prod.stock),
            qty: 1,
          },
        ];
      }
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = item.qty + delta;
            if (nextQty > item.maxStock) {
              showToast(`Limite do estoque atingido (${item.maxStock} un)`);
              return { ...item, qty: item.maxStock };
            }
            return { ...item, qty: nextQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Confirm Order Issue
  const handleConfirmOrder = (
    orderData: Omit<Order, 'id' | 'date' | 'items' | 'total'>
  ) => {
    let grandTotal = 0;
    const orderItems: Order['items'] = [];

    // Verify and deduct stock
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod || prod.stock < item.qty) {
        showToast(`Estoque insuficiente para ${item.name}!`);
        return;
      }
    }

    // Apply stock deduction
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((ci) => ci.productId === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.qty };
        }
        return p;
      })
    );

    cart.forEach((item) => {
      const itemTotal = item.qty * item.salePrice;
      grandTotal += itemTotal;
      orderItems.push({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        unitPrice: item.salePrice,
      });
    });

    const orderId = 'PEDIDO-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      items: orderItems,
      total: grandTotal,
    };

    setSales((prev) => [newOrder, ...prev]);
    addActivity('SALE', `Baixa de Pedido #${orderId} para ${orderData.soldado || 'Soldado'} (${orderData.force || 'Militar'})`);

    setCart([]);
    setCurrentReceiptOrder(newOrder);
    setIsReceiptModalOpen(true);
    showToast(`Pedido #${orderId} processado com sucesso!`);
  };

  // Quick Sell Action
  const handleExecuteQuickSell = (
    productId: string,
    qty: number,
    payment: string,
    reason: string
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod || prod.stock < qty) {
      showToast('Estoque insuficiente!');
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - qty } : p))
    );

    const total = qty * prod.salePrice;
    const orderId = 'PEDIDO-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      force: 'Operacional Tático',
      soldado: reason ? reason.toUpperCase() : 'BAIXA BALCÃO',
      re: 'RE BALCÃO',
      cpf: '-',
      bloodType: '-',
      battalion: 'Baixa Rápida',
      paymentMethod: payment,
      orderType: 'Venda Direta',
      items: [{ productId: prod.id, name: prod.name, qty, unitPrice: prod.salePrice }],
      total,
    };

    setSales((prev) => [newOrder, ...prev]);
    addActivity('SALE', `Baixa Direta #${orderId}: ${qty}x ${prod.name}`);

    setIsQuickSellOpen(false);
    setCurrentReceiptOrder(newOrder);
    setIsReceiptModalOpen(true);
    showToast(`Baixa rápida #${orderId} efetuada!`);
  };

  // CSV Export
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'SKU,Equipamento,Categoria,Preco_Custo,Preco_Venda,Estoque,Estoque_Minimo\n';

    products.forEach((p) => {
      csvContent += `"${p.sku}","${p.name}","${p.category}",${p.costPrice},${p.salePrice},${p.stock},${p.minStock}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `bizu_arsenal_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const lowStockCount = products.filter((p) => Number(p.stock) <= Number(p.minStock)).length;
  const activeOsCount = serviceOrders.filter(
    (os) => os.status === 'NOVO' || os.status === 'EM_SEPARACAO' || os.status === 'SEPARADO'
  ).length;

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden antialiased tactical-crosshair-bg">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        lowStockCount={lowStockCount}
        activeOsCount={activeOsCount}
        activeUser={activeUser}
        onOpenProductModal={() => handleOpenProductModal()}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content View */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 flex flex-col">
        <Header
          currentTab={currentTab}
          users={users}
          activeUser={activeUser}
          onSelectUser={handleSelectUser}
          onOpenQuickSell={() => setIsQuickSellOpen(true)}
          onOpenNewOrder={() => {
            setCurrentTab('pos');
            setCart([]);
            showToast('Novo pedido iniciado!');
          }}
        />

        <div className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {currentTab === 'dashboard' && (
            <DashboardTab
              products={products}
              sales={sales}
              activities={activities}
              onSwitchTab={setCurrentTab}
              onOpenAdjustModal={handleOpenAdjustModal}
            />
          )}

          {currentTab === 'products' && (
            <ProductsTab
              products={products}
              activeUser={activeUser}
              onOpenProductModal={handleOpenProductModal}
              onOpenAdjustModal={handleOpenAdjustModal}
              onDeleteProduct={handleDeleteProduct}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'pos' && (
            <PosTab
              products={products}
              cart={cart}
              activeUser={activeUser}
              onAddToCart={handleAddToCart}
              onUpdateCartQty={handleUpdateCartQty}
              onClearCart={handleClearCart}
              onConfirmOrder={handleConfirmOrder}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'service-orders' && (
            <WorkOrdersTab
              orders={serviceOrders}
              onOpenNewOsModal={handleOpenNewOsModal}
              onOpenEditOsModal={handleOpenEditOsModal}
              onOpenReceiptModal={handleOpenOsReceipt}
              onUpdateOsStatus={handleUpdateOsStatus}
              onDeleteOs={handleDeleteServiceOrder}
            />
          )}

          {currentTab === 'sales' && (
            <SalesHistoryTab
              sales={sales}
              onOpenReceipt={(order) => {
                setCurrentReceiptOrder(order);
                setIsReceiptModalOpen(true);
              }}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsTab
              products={products}
              sales={sales}
              activeUser={activeUser}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsTab
              storeConfig={storeConfig}
              users={users}
              activeUser={activeUser}
              onSelectUser={handleSelectUser}
              onSaveStoreConfig={handleSaveStoreConfig}
              onAddUser={(usr) => handleSaveUser(usr)}
              onToggleUserStatus={handleToggleUserStatus}
              onDeleteUser={(id) => handleToggleUserStatus(id)}
              onExportFullBackup={handleExportFullBackup}
              onImportFullBackup={handleImportFullBackup}
              onResetFactoryData={handleResetFactoryData}
              onShowToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        editingProduct={editingProduct}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
      />

      <QuickSellModal
        isOpen={isQuickSellOpen}
        products={products}
        onClose={() => setIsQuickSellOpen(false)}
        onExecute={handleExecuteQuickSell}
      />

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        product={adjustingProduct}
        onClose={() => setIsAdjustModalOpen(false)}
        onConfirmAdjust={handleConfirmAdjustStock}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        order={currentReceiptOrder}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      <ServiceOrderModal
        isOpen={isServiceOrderModalOpen}
        editingOs={editingServiceOrder}
        products={products || []}
        existingOrders={serviceOrders || []}
        onClose={() => {
          setIsServiceOrderModalOpen(false);
        }}
        onSave={handleSaveServiceOrder}
      />

      <ServiceOrderReceiptModal
        isOpen={isServiceOrderReceiptModalOpen}
        os={currentReceiptServiceOrder}
        onClose={() => setIsServiceOrderReceiptModalOpen(false)}
      />

      <UserModal
        isOpen={isUserModalOpen}
        editingUser={selectedUserForEdit}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-amber-500 text-black text-xs font-bold font-tactical px-4 py-3 rounded-xl shadow-2xl z-50 uppercase tracking-wider border border-amber-300 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
