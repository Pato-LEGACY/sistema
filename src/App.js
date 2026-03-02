import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingBag, Package, LogOut, Plus, AlertCircle, 
  DollarSign, Clock, TrendingUp, Users, Home, Search, 
  Trash2, CheckCircle, X, ChevronRight, Filter, 
  ArrowUpRight, Printer, QrCode, UserPlus, Save, Camera, Tag, ImageIcon, Lock, ShieldCheck, ChevronDown, Barcode, FileText, PlusCircle, Upload, FileCode, Edit3, History, Calendar, Calculator, Eye, Truck
} from 'lucide-react';

const COLORS = {
  black: '#0A0A0A',
  gold: '#D4AF37',
  goldDark: '#B8860B',
  white: '#FFFFFF',
  grayBg: '#F3F4F6',
  grayBorder: '#E5E7EB',
  textMain: '#1F2937',
  textMuted: '#6B7280',
  success: '#10B981',
  danger: '#EF4444'
};

const ADMIN_CREDENTIALS = { user: 'admin', pass: '1972' };

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Oxford Imperial Leather', skuBase: 'OX-2024', size: '42', sku: 'OX-2024-42', price1: 120.00, price2: 110.00, cost: 50.00, stock: 10, category: 'Formal', image: null, tax: '15' },
];

const INITIAL_CATEGORIES = ['Formal', 'Casual', 'Deportivo', 'Dama'];

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${COLORS.grayBorder}`, outline: 'none', background: COLORS.white, fontSize: '14px', boxSizing: 'border-box'
};

// --- COMPONENTES AUXILIARES ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '900px', maxHeight: '95vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '20px 25px', borderBottom: `1px solid ${COLORS.grayBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.textMuted }}><X size={24} /></button>
        </div>
        <div style={{ padding: '25px' }}>{children}</div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [systemUsers, setSystemUsers] = useState([{ username: 'admin' }]);
  const [history, setHistory] = useState([]); 
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      setIsHistoryModalOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleLogin = (u, p) => {
    if (u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass) {
      setUser({ name: 'Administrador', role: 'admin' });
    } else {
      const found = systemUsers.find(su => su.username === u && su.password === p);
      if (found) setUser({ name: u, role: 'user' });
      else alert("Credenciales incorrectas");
    }
  };

  const addProductBulk = (baseData, minSize, maxSize) => {
    const newItems = [];
    const min = parseInt(minSize);
    const max = parseInt(maxSize);
    if (isNaN(min) || isNaN(max) || min > max) {
      newItems.push({ ...baseData, id: Date.now(), stock: 0, sku: baseData.skuBase });
    } else {
      for (let s = min; s <= max; s++) {
        newItems.push({ ...baseData, id: Date.now() + Math.random(), size: s.toString(), sku: `${baseData.skuBase}-${s}`, stock: 0 });
      }
    }
    setProducts([...products, ...newItems]);
    setIsProductModalOpen(false);
  };

  const saveTransaction = (transactionData) => {
    const subtotal = transactionData.items.reduce((sum, item) => sum + (item.qty * item.cost), 0);
    const tax = transactionData.items.reduce((sum, item) => sum + (item.qty * item.cost * (parseFloat(item.tax) / 100)), 0);
    
    const newEntry = {
      id: Date.now(),
      ...transactionData,
      subtotal: subtotal,
      taxTotal: tax,
      total: subtotal + tax
    };
    setHistory([newEntry, ...history]);

    setProducts(prev => prev.map(p => {
      const update = transactionData.items.find(u => u.sku === p.sku);
      return update ? { ...p, stock: p.stock + parseFloat(update.qty) } : p;
    }));
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: COLORS.grayBg, fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: COLORS.white, borderRight: `1px solid ${COLORS.grayBorder}`, padding: '30px 15px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '50px', paddingLeft: '15px' }}>
          <h2 style={{ color: COLORS.gold, fontWeight: '900', margin: 0, fontSize: '24px' }}>LEGACY<span style={{color: COLORS.black}}>SHOE</span></h2>
          <span style={{ fontSize: '9px', letterSpacing: '3px', color: COLORS.textMuted, fontWeight: 'bold' }}>SISTEMA DE GESTIÓN</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Home size={18}/> },
            { id: 'inventory', label: 'Inventario', icon: <Package size={18}/> },
            { id: 'invoices', label: 'Módulo de Ingresos', icon: <FileText size={18}/> },
            { id: 'users', label: 'Usuarios', icon: <ShieldCheck size={18}/> },
          ].map(item => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer', transition: '0.2s',
                backgroundColor: activeTab === item.id ? COLORS.black : 'transparent',
                color: activeTab === item.id ? COLORS.gold : COLORS.textMuted,
              }}
            >
              <span style={{ marginRight: '12px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: activeTab === item.id ? 'bold' : 'normal' }}>{item.label}</span>
            </div>
          ))}
          <div 
            onClick={() => setIsHistoryModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '12px', marginTop: '20px', cursor: 'pointer', color: COLORS.textMuted }}
          >
            <span style={{ marginRight: '12px' }}><History size={18}/></span>
            <span style={{ fontSize: '14px' }}>Historial (Ctrl+B)</span>
          </div>
        </nav>
        <button onClick={() => setUser(null)} style={{ border: 'none', background: 'none', color: COLORS.danger, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '15px' }}>
          <LogOut size={16}/> Cerrar Sesión
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: '20px 40px', backgroundColor: COLORS.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.grayBorder}` }}>
          <div style={{ fontWeight: '900', fontSize: '12px', color: COLORS.textMuted }}>{activeTab.toUpperCase()}</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Bienvenido, {user.name}</div>
        </header>

        <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && <Dashboard products={products} history={history}/>}
          {activeTab === 'inventory' && (
            <InventorySection products={products} onNew={() => setIsProductModalOpen(true)} />
          )}
          {activeTab === 'invoices' && <MultiIngresoModule products={products} onSaveTransaction={saveTransaction} />}
          {activeTab === 'users' && <UsersSection users={systemUsers} onNew={() => {}} />}
        </main>
      </div>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Nuevo Modelo">
        <ProductForm onSubmit={addProductBulk} categories={INITIAL_CATEGORIES} />
      </Modal>

      {/* MODAL DE HISTORIAL PRINCIPAL */}
      <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title="Historial de Transacciones">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '15px', top: '12px', color: COLORS.textMuted }} size={18} />
            <input 
              placeholder="Buscar por fecha, SKU, proveedor o descripción..." 
              value={searchHistoryQuery} 
              onChange={e => setSearchHistoryQuery(e.target.value)} 
              style={{...inputStyle, paddingLeft: '45px'}} 
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {history
            .filter(h => 
              h.date.includes(searchHistoryQuery) || 
              h.provider?.name?.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
              h.items.some(i => i.sku.includes(searchHistoryQuery) || i.name.toLowerCase().includes(searchHistoryQuery.toLowerCase()))
            )
            .map(h => (
              <div 
                key={h.id} 
                onClick={() => setSelectedTransaction(h)}
                style={{ 
                  border: `1px solid ${COLORS.grayBorder}`, 
                  borderRadius: '16px', 
                  padding: '16px', 
                  backgroundColor: 'white', 
                  cursor: 'pointer',
                  transition: '0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = COLORS.gold}
                onMouseOut={e => e.currentTarget.style.borderColor = COLORS.grayBorder}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ background: h.type === 'ingresos' ? '#E0F2FE' : '#FEF3C7', color: h.type === 'ingresos' ? '#0369A1' : '#92400E', padding: '8px', borderRadius: '10px' }}>
                    {h.type === 'ingresos' ? <PlusCircle size={20}/> : <FileCode size={20}/>}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px' }}>{h.provider?.name || 'Ingreso Sin Proveedor'}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted }}>{h.date} • {h.items.length} productos</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '900', color: COLORS.black }}>${h.total.toFixed(2)}</div>
                  <div style={{ fontSize: '11px', color: COLORS.goldDark, fontWeight: 'bold' }}>VER DETALLES <ChevronRight size={10} style={{verticalAlign: 'middle'}}/></div>
                </div>
              </div>
          ))}
          {history.length === 0 && <p style={{textAlign: 'center', color: COLORS.textMuted, padding: '40px'}}>No hay transacciones registradas.</p>}
        </div>
      </Modal>

      {/* MODAL DE DETALLE DE TRANSACCIÓN */}
      <Modal 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        title={`Detalle de Transacción - ${selectedTransaction?.date}`}
      >
        {selectedTransaction && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div style={{ background: COLORS.grayBg, padding: '20px', borderRadius: '18px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Truck size={12}/> Datos del Proveedor
                </div>
                <div style={{ fontWeight: '900', fontSize: '15px' }}>{selectedTransaction.provider?.name || 'N/A'}</div>
                <div style={{ fontSize: '13px', marginTop: '5px' }}><strong>RUC:</strong> {selectedTransaction.provider?.ruc || 'N/A'}</div>
                <div style={{ fontSize: '13px' }}><strong>Telf:</strong> {selectedTransaction.provider?.phone || 'N/A'}</div>
                <div style={{ fontSize: '13px' }}><strong>Dir:</strong> {selectedTransaction.provider?.address || 'N/A'}</div>
              </div>
              
              <div style={{ background: COLORS.black, padding: '20px', borderRadius: '18px', color: 'white' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: COLORS.gold, textTransform: 'uppercase', marginBottom: '10px' }}>Resumen de Pago</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span>Subtotal:</span> <span>${selectedTransaction.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                  <span>IVA:</span> <span>${selectedTransaction.taxTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '18px', fontWeight: '900', color: COLORS.gold }}>
                  <span>TOTAL:</span> <span>${selectedTransaction.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: `2px solid ${COLORS.grayBorder}` }}>
                  <th style={{ padding: '12px', fontSize: '12px', color: COLORS.textMuted }}>PRODUCTO</th>
                  <th style={{ padding: '12px', fontSize: '12px', color: COLORS.textMuted }}>CANT.</th>
                  <th style={{ padding: '12px', fontSize: '12px', color: COLORS.textMuted }}>COSTO U.</th>
                  <th style={{ padding: '12px', fontSize: '12px', color: COLORS.textMuted }}>IVA</th>
                  <th style={{ padding: '12px', fontSize: '12px', color: COLORS.textMuted, textAlign: 'right' }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {selectedTransaction.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.grayBg}` }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: COLORS.textMuted }}>{item.sku}</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{item.qty}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>${parseFloat(item.cost).toFixed(2)}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>{item.tax}%</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right', fontWeight: 'bold' }}>
                      ${(item.qty * item.cost * (1 + parseFloat(item.tax)/100)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              onClick={() => setSelectedTransaction(null)} 
              style={{ width: '100%', marginTop: '30px', padding: '15px', borderRadius: '15px', border: 'none', background: COLORS.black, color: COLORS.gold, fontWeight: 'bold', cursor: 'pointer' }}
            >
              Cerrar Detalle de Transacción
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

// --- MÓDULO DE INGRESO ---

function MultiIngresoModule({ products, onSaveTransaction }) {
  const [activeSubTab, setActiveSubTab] = useState('ingresos');
  const [rows, setRows] = useState([]); 
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Datos del Proveedor
  const [provider, setProvider] = useState({ name: '', ruc: '', phone: '', address: '' });

  const addRow = (product) => {
    if (rows.find(r => r.sku === product.sku)) return;
    setRows([...rows, { 
      sku: product.sku, 
      name: product.name, 
      qty: 1, 
      labelQty: 1, 
      labelType: 'barcode', 
      cost: product.cost || 0, 
      tax: product.tax || '0' 
    }]);
    setSearch('');
    setShowSearch(false);
  };

  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleXmlUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(event.target.result, "text/xml");
      try {
        // Extraer Info Proveedor del XML (Estructura típica factura electrónica Ecuador)
        const razSoc = xmlDoc.getElementsByTagName('razonSocial')[0]?.textContent || '';
        const rucProv = xmlDoc.getElementsByTagName('ruc')[0]?.textContent || '';
        const dirProv = xmlDoc.getElementsByTagName('dirMatriz')[0]?.textContent || '';
        
        setProvider({
          name: razSoc,
          ruc: rucProv,
          address: dirProv,
          phone: ''
        });

        const detalles = Array.from(xmlDoc.getElementsByTagName('detalle'));
        const newRowsFromXml = detalles.map(d => {
          const desc = d.getElementsByTagName('descripcion')[0]?.textContent || '';
          const cant = parseFloat(d.getElementsByTagName('cantidad')[0]?.textContent || '0');
          const cod = d.getElementsByTagName('codigoPrincipal')[0]?.textContent || '';
          const precioUnitario = parseFloat(d.getElementsByTagName('precioUnitario')[0]?.textContent || '0');
          
          let taxVal = '15'; 
          const impuesto = d.getElementsByTagName('codigoPorcentaje')[0]?.textContent;
          if (impuesto === '0') taxVal = '0';

          const match = products.find(p => p.sku === cod || desc.toLowerCase().includes(p.name.toLowerCase()));
          
          return {
            sku: match ? match.sku : cod,
            name: match ? match.name : desc,
            qty: cant,
            labelQty: cant,
            labelType: 'barcode',
            cost: precioUnitario,
            tax: taxVal
          };
        });
        setRows([...rows, ...newRowsFromXml]);
      } catch (err) {
        alert("Error al procesar el XML");
      }
    };
    reader.readAsText(file);
  };

  const processFinal = () => {
    if (rows.length === 0) return;
    if (!provider.name) {
      if(!confirm("¿Deseas guardar sin datos de proveedor?")) return;
    }
    
    const transaction = {
      type: activeSubTab,
      date: new Date().toISOString().split('T')[0],
      provider: provider,
      items: rows.map(r => ({
        sku: r.sku,
        name: r.name,
        qty: parseFloat(r.qty),
        cost: parseFloat(r.cost),
        tax: r.tax
      }))
    };
    onSaveTransaction(transaction);
    alert("Ingreso procesado con éxito.");
    setRows([]);
    setProvider({ name: '', ruc: '', phone: '', address: '' });
  };

  const calculateSubtotal = () => rows.reduce((acc, r) => acc + (parseFloat(r.qty) * parseFloat(r.cost)), 0);
  const calculateTaxTotal = () => rows.reduce((acc, r) => acc + (parseFloat(r.qty) * parseFloat(r.cost) * (parseFloat(r.tax)/100)), 0);

  const printLabels = () => {
    const printWindow = window.open('', '_blank');
    let content = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; display: flex; flex-wrap: wrap; gap: 10px; padding: 20px; } 
            .label-box { width: 180px; border: 1px solid #ccc; padding: 10px; text-align: center; border-radius: 5px; page-break-inside: avoid; } 
            .sku-text { font-weight: bold; font-size: 14px; margin-bottom: 5px; } 
            .name-text { font-size: 10px; margin-bottom: 5px; color: #666; } 
            svg, .qr-container { width: 100% !important; height: auto; margin-top: 5px; display: flex; justify-content: center; }
          </style>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        </head>
        <body>
    `;

    rows.forEach((row, rowIndex) => {
      for (let i = 0; i < row.labelQty; i++) {
        const id = `label-${rowIndex}-${i}`;
        content += `
          <div class="label-box">
            <div class="sku-text">${row.sku}</div>
            <div class="name-text">${row.name}</div>
            ${row.labelType === 'barcode' ? '<svg id="' + id + '"></svg>' : '<div id="' + id + '" class="qr-container"></div>'}
          </div>
        `;
      }
    });

    content += `
        <script>
          window.onload = function() {
            ${rows.map((row, rowIndex) => {
              let scripts = "";
              for(let i=0; i < row.labelQty; i++){
                const id = "label-" + rowIndex + "-" + i;
                if(row.labelType === 'barcode') {
                  scripts += "JsBarcode('#" + id + "', '" + row.sku + "', { width: 1.5, height: 40, fontSize: 10, displayValue: false });\\n";
                } else {
                  scripts += "new QRCode(document.getElementById('" + id + "'), { text: '" + row.sku + "', width: 60, height: 60 });\\n";
                }
              }
              return scripts;
            }).join('')}
            setTimeout(() => { window.print(); window.close(); }, 800);
          }
        </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const filteredSearch = products.filter(p => p.sku.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button onClick={() => setActiveSubTab('ingresos')} style={{ flex: 1, padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: activeSubTab === 'ingresos' ? COLORS.black : COLORS.white, color: activeSubTab === 'ingresos' ? COLORS.gold : COLORS.textMuted }}>
          <PlusCircle size={18} style={{verticalAlign: 'middle', marginRight: '8px'}}/> INGRESOS DIRECTOS
        </button>
        <button onClick={() => setActiveSubTab('facturas')} style={{ flex: 1, padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: activeSubTab === 'facturas' ? COLORS.black : COLORS.white, color: activeSubTab === 'facturas' ? COLORS.gold : COLORS.textMuted }}>
          <FileCode size={18} style={{verticalAlign: 'middle', marginRight: '8px'}}/> FACTURAS XML (SRI)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px', alignItems: 'start' }}>
        
        {/* PANEL DE PROVEEDOR */}
        <div style={{ background: COLORS.white, padding: '25px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck size={20} color={COLORS.gold}/> Datos Proveedor
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, marginLeft: '5px' }}>RAZÓN SOCIAL / NOMBRE</label>
              <input value={provider.name} onChange={e => setProvider({...provider, name: e.target.value})} placeholder="Ej: Importadora Calzado S.A." style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, marginLeft: '5px' }}>RUC / CÉDULA</label>
              <input value={provider.ruc} onChange={e => setProvider({...provider, ruc: e.target.value})} placeholder="1700000000001" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, marginLeft: '5px' }}>TELÉFONO</label>
              <input value={provider.phone} onChange={e => setProvider({...provider, phone: e.target.value})} placeholder="099-000-0000" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted, marginLeft: '5px' }}>DIRECCIÓN</label>
              <textarea value={provider.address} onChange={e => setProvider({...provider, address: e.target.value})} placeholder="Av. Principal N-12" style={{...inputStyle, height: '80px', resize: 'none'}} />
            </div>
          </div>
        </div>

        {/* PANEL DE PRODUCTOS */}
        <div style={{ background: COLORS.white, padding: '25px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{activeSubTab === 'ingresos' ? 'Listado de Productos' : 'Cargar Factura XML'}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <label style={{ background: COLORS.grayBg, padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                <Upload size={16}/> Cargar XML
                <input type="file" hidden accept=".xml" onChange={handleXmlUpload} />
              </label>
              <button onClick={() => setShowSearch(true)} style={{ background: COLORS.gold, border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>+ Añadir</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto', minHeight: '300px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead style={{ background: COLORS.grayBg }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Producto</th>
                  <th style={{ padding: '12px', width: '70px' }}>Cant.</th>
                  <th style={{ padding: '12px', width: '90px' }}>Costo U.</th>
                  <th style={{ padding: '12px', width: '80px' }}>IVA</th>
                  <th style={{ padding: '12px', width: '60px' }}>Etiq.</th>
                  <th style={{ padding: '12px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} style={{ borderTop: `1px solid ${COLORS.grayBorder}` }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 'bold' }}>{row.sku}</div>
                      <div style={{ fontSize: '10px', color: COLORS.textMuted }}>{row.name}</div>
                    </td>
                    <td style={{ padding: '10px' }}><input type="number" value={row.qty} onChange={e => updateRow(idx, 'qty', e.target.value)} style={{...inputStyle, padding: '5px'}} /></td>
                    <td style={{ padding: '10px' }}><input type="number" value={row.cost} onChange={e => updateRow(idx, 'cost', e.target.value)} style={{...inputStyle, padding: '5px'}} /></td>
                    <td style={{ padding: '10px' }}>
                      <select value={row.tax} onChange={e => updateRow(idx, 'tax', e.target.value)} style={{...inputStyle, padding: '5px'}}>
                        <option value="0">0%</option>
                        <option value="15">15%</option>
                      </select>
                    </td>
                    <td style={{ padding: '10px' }}><input type="number" value={row.labelQty} onChange={e => updateRow(idx, 'labelQty', e.target.value)} style={{...inputStyle, padding: '5px'}} /></td>
                    <td style={{ padding: '10px' }}><button onClick={() => removeRow(idx)} style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer' }}><Trash2 size={16}/></button></td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan="6" style={{padding: '50px', textAlign: 'center', color: COLORS.textMuted}}>Busca productos o carga un XML para empezar.</td></tr>}
              </tbody>
            </table>
          </div>

          {rows.length > 0 && (
            <div style={{ marginTop: '20px', borderTop: `2px solid ${COLORS.grayBg}`, paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
               <div style={{ background: COLORS.grayBg, padding: '15px', borderRadius: '15px', fontSize: '14px' }}>
                  <div>Subtotal: <strong>${calculateSubtotal().toFixed(2)}</strong></div>
                  <div>IVA: <strong>${calculateTaxTotal().toFixed(2)}</strong></div>
                  <div style={{ fontSize: '18px', marginTop: '5px', color: COLORS.success }}>Total: <strong>${(calculateSubtotal() + calculateTaxTotal()).toFixed(2)}</strong></div>
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={printLabels} style={{ padding: '12px 20px', borderRadius: '12px', border: `1px solid ${COLORS.black}`, background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Imprimir Etiquetas</button>
                  <button onClick={processFinal} style={{ padding: '12px 25px', borderRadius: '12px', border: 'none', background: COLORS.black, color: COLORS.gold, fontWeight: 'bold', cursor: 'pointer' }}>Finalizar Ingreso</button>
               </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showSearch} onClose={() => setShowSearch(false)} title="Agregar Producto">
        <input placeholder="Buscar SKU o Nombre..." value={search} onChange={e => setSearch(e.target.value)} style={{...inputStyle, marginBottom: '15px'}} autoFocus />
        {filteredSearch.map(p => (
          <div key={p.id} onClick={() => addRow(p)} style={{ padding: '10px', background: COLORS.grayBg, marginBottom: '5px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>{p.sku} - {p.name} (Talla {p.size})</span>
            <Plus size={16}/>
          </div>
        ))}
      </Modal>
    </div>
  );
}

// --- OTROS COMPONENTES ---

function LoginScreen({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  return (
    <div style={{ height: '100vh', background: COLORS.black, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '30px', width: '320px', textAlign: 'center' }}>
        <h2 style={{ color: COLORS.gold, fontWeight: '900' }}>LEGACY SHOES</h2>
        <input placeholder="Usuario" style={{...inputStyle, marginBottom: '15px'}} onChange={e => setU(e.target.value)}/>
        <input type="password" placeholder="Contraseña" style={{...inputStyle, marginBottom: '25px'}} onChange={e => setP(e.target.value)}/>
        <button onClick={() => onLogin(u, p)} style={{ width: '100%', padding: '15px', background: COLORS.black, color: COLORS.gold, border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>ACCEDER AL SISTEMA</button>
      </div>
    </div>
  );
}

function ProductForm({ onSubmit, categories }) {
  const [data, setData] = useState({ name: '', skuBase: '', price1: '', price2: '', cost: 0, category: 'Casual', image: null, tax: '0' });
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setData({ ...data, image: reader.result });
      reader.readAsDataURL(file);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ width: '80px', height: '80px', background: COLORS.grayBg, borderRadius: '12px', border: `2px dashed ${COLORS.grayBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }} onClick={() => document.getElementById('p-img').click()}>
          {data.image ? <img src={data.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={20}/>}
          <input id="p-img" type="file" hidden onChange={handleImage} />
        </div>
        <div style={{ flex: 1 }}>
          <input placeholder="Nombre Modelo" style={{...inputStyle, marginBottom: '8px'}} onChange={e => setData({...data, name: e.target.value})}/>
          <input placeholder="SKU Base" style={inputStyle} onChange={e => setData({...data, skuBase: e.target.value})}/>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input placeholder="Talla Min" type="number" style={{...inputStyle, flex: 1}} onChange={e => setMinSize(e.target.value)}/>
        <input placeholder="Talla Max" type="number" style={{...inputStyle, flex: 1}} onChange={e => setMaxSize(e.target.value)}/>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input placeholder="Costo Compra" type="number" style={{...inputStyle, flex: 1}} onChange={e => setData({...data, cost: parseFloat(e.target.value)})}/>
        <select style={{...inputStyle, flex: 1}} onChange={e => setData({...data, tax: e.target.value})}>
          <option value="0">IVA 0%</option>
          <option value="15">IVA 15%</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input placeholder="Precio Venta 1" type="number" style={{...inputStyle, flex: 1}} onChange={e => setData({...data, price1: parseFloat(e.target.value)})}/>
        <input placeholder="Precio Venta 2" type="number" style={{...inputStyle, flex: 1}} onChange={e => setData({...data, price2: parseFloat(e.target.value)})}/>
      </div>
      <button onClick={() => onSubmit(data, minSize, maxSize)} style={{ background: COLORS.black, color: COLORS.gold, padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>CREAR MODELO</button>
    </div>
  );
}

function InventorySection({ products, onNew }) {
  const [expandedSku, setExpandedSku] = useState(null);
  const grouped = products.reduce((acc, p) => {
    if (!acc[p.skuBase]) acc[p.skuBase] = { ...p, items: [] };
    acc[p.skuBase].items.push(p);
    return acc;
  }, {});
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontWeight: '900', margin: 0 }}>Inventario</h1>
        <button onClick={onNew} style={{ background: COLORS.black, color: COLORS.gold, padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>+ Nuevo Modelo</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.values(grouped).map(group => (
          <div key={group.skuBase} style={{ background: 'white', borderRadius: '20px', border: `1px solid ${COLORS.grayBorder}`, overflow: 'hidden' }}>
            <div onClick={() => setExpandedSku(expandedSku === group.skuBase ? null : group.skuBase)} style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
               <div style={{ width: '40px', height: '40px', background: COLORS.grayBg, borderRadius: '8px', overflow: 'hidden' }}>{group.image && <img src={group.image} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>}</div>
               <div style={{ flex: 1 }}><div style={{ fontWeight: 'bold' }}>{group.name}</div><div style={{ fontSize: '11px', color: COLORS.textMuted }}>{group.skuBase}</div></div>
               <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '11px', color: COLORS.textMuted }}>Stock</div>
                 <div style={{ fontWeight: 'bold' }}>{group.items.reduce((s, i) => s + i.stock, 0)}</div>
               </div>
               <ChevronDown style={{ transform: expandedSku === group.skuBase ? 'rotate(180deg)' : 'none' }} />
            </div>
            {expandedSku === group.skuBase && (
              <div style={{ padding: '15px', background: '#fafafa', borderTop: `1px solid ${COLORS.grayBorder}` }}>
                {group.items.map(it => (
                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '13px' }}>
                    <span>Talla {it.size} ({it.sku})</span>
                    <span style={{ fontWeight: 'bold' }}>{it.stock} u.</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersSection({ users, onNew }) {
  return (
    <div>
      <h1 style={{ fontWeight: '900', marginBottom: '30px' }}>Usuarios</h1>
      <div style={{ background: 'white', borderRadius: '20px', border: `1px solid ${COLORS.grayBorder}` }}>
        {users.map((u, i) => (
          <div key={i} style={{ padding: '15px 25px', borderBottom: `1px solid ${COLORS.grayBorder}`, display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: COLORS.gold, padding: '8px', borderRadius: '10px' }}><Users size={18} color="white"/></div>
            <div><div style={{ fontWeight: 'bold' }}>{u.username}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ products, history }) {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalInvestment = history.reduce((acc, h) => acc + h.total, 0);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      <div style={{ background: 'white', padding: '25px', borderRadius: '24px' }}>
        <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: 'bold' }}>TOTAL STOCK</div>
        <div style={{ fontSize: '32px', fontWeight: '900' }}>{totalStock}</div>
      </div>
      <div style={{ background: 'white', padding: '25px', borderRadius: '24px' }}>
        <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: 'bold' }}>INVERSIÓN TOTAL</div>
        <div style={{ fontSize: '32px', fontWeight: '900', color: COLORS.success }}>${totalInvestment.toFixed(2)}</div>
      </div>
      <div style={{ background: COLORS.black, padding: '25px', borderRadius: '24px', color: COLORS.gold }}>
        <div style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>TRANSACCIONES</div>
        <div style={{ fontSize: '32px', fontWeight: '900' }}>{history.length}</div>
      </div>
    </div>
  );
}
