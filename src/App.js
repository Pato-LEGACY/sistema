import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, LogOut, Plus, AlertCircle, 
  DollarSign, Clock, TrendingUp, Users, Home, Search, 
  Trash2, CheckCircle, X, ChevronRight, Filter, 
  ArrowUpRight, Printer, QrCode, UserPlus, Save, Camera, Tag, ImageIcon, Lock
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

const ADMIN_PASSWORD = "1234"; // Contraseña para eliminar productos

// --- DATA INICIAL ---
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Oxford Imperial Leather', sku: 'OX-2024-01', size: '42', price: 120.00, stock: 15, category: 'Formal', image: null },
];

const INITIAL_CUSTOMERS = [
  { id: 'C1', name: 'Juan Pérez', idNumber: '1723456789', email: 'juan@email.com', phone: '0999888777' }
];

const INITIAL_CATEGORIES = ['Formal', 'Casual', 'Deportivo', 'Dama'];

// --- COMPONENTES AUXILIARES ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '95vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div style={{ padding: '25px', borderBottom: `1px solid ${COLORS.grayBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{title}</h2>
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
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletePass, setDeletePass] = useState('');
  const [invoiceToPrint, setInvoiceToPrint] = useState(null);
  
  useEffect(() => {
    setUser({ name: 'Administrador Legacy' });
  }, []);

  const addProduct = (newProd) => {
    setProducts([...products, { ...newProd, id: Date.now() }]);
    setIsProductModalOpen(false);
  };

  const confirmDelete = () => {
    if (deletePass === ADMIN_PASSWORD) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      setDeletePass('');
    } else {
      alert("Contraseña incorrecta. Acceso denegado.");
    }
  };

  const printDocument = (contentId) => {
    const printContent = document.getElementById(contentId);
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>Legacy Shoes - Print</title>');
    win.document.write('<style>body{font-family:sans-serif;padding:20px;display:flex;flex-wrap:wrap;gap:20px;} .label-box{border:2px solid #000; padding:15px; width:220px; text-align:center; border-radius:10px; background:white;} .invoice{max-width:400px; margin:auto; border:1px solid #eee; padding:20px;}</style>');
    win.document.write('</head><body>');
    win.document.write(printContent.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    // Esperar a que las imágenes (QR) carguen antes de imprimir
    setTimeout(() => { win.print(); }, 800);
  };

  if (!user) return <div style={{ background: COLORS.black, height: '100vh' }} />;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: COLORS.grayBg, fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: COLORS.white, borderRight: `1px solid ${COLORS.grayBorder}`, padding: '30px 15px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '50px', paddingLeft: '15px' }}>
          <h2 style={{ color: COLORS.gold, fontWeight: '900', margin: 0, fontSize: '24px' }}>LEGACY<span style={{color: COLORS.black}}>SHOE</span></h2>
          <span style={{ fontSize: '9px', letterSpacing: '3px', color: COLORS.textMuted, fontWeight: 'bold' }}>PREMIUM SYSTEM</span>
        </div>
        <nav style={{ flex: 1 }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Home size={18}/> },
            { id: 'inventory', label: 'Inventario', icon: <Package size={18}/> },
            { id: 'sales', label: 'Punto de Venta', icon: <ShoppingBag size={18}/> },
            { id: 'customers', label: 'Clientes', icon: <Users size={18}/> },
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
        </nav>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: '20px 40px', backgroundColor: COLORS.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.grayBorder}` }}>
          <div style={{ fontWeight: '900', fontSize: '12px', color: COLORS.textMuted }}>SISTEMA DE CONTROL / {activeTab.toUpperCase()}</div>
          <button onClick={() => window.location.reload()} style={{ background: COLORS.grayBg, border: 'none', cursor: 'pointer', color: COLORS.textMuted, padding: '8px', borderRadius: '10px' }}><LogOut size={18}/></button>
        </header>

        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && <Dashboard products={products}/>}
          {activeTab === 'inventory' && (
            <InventorySection 
              products={products} 
              onNew={() => setIsProductModalOpen(true)} 
              onPrintLabel={() => printDocument('labels-container')}
              onDelete={(p) => { setProductToDelete(p); setIsDeleteModalOpen(true); }}
            />
          )}
          {activeTab === 'sales' && (
            <SalesSection 
              products={products} 
              customers={customers} 
              onFinishSale={(data) => {
                setInvoiceToPrint(data);
                setTimeout(() => printDocument('invoice-container'), 500);
              }}
            />
          )}
          {activeTab === 'customers' && (
            <CustomerSection 
              customers={customers} 
              onNew={() => setIsCustomerModalOpen(true)} 
            />
          )}
        </main>
      </div>

      {/* Modales */}
      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Nuevo Producto">
        <ProductForm onSubmit={addProduct} categories={categories} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setDeletePass(''); }} title="Confirmar Eliminación">
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: COLORS.danger, marginBottom: '15px' }}><AlertCircle size={48} style={{ margin: 'auto' }}/></div>
          <p style={{ fontSize: '14px', color: COLORS.textMain, marginBottom: '20px' }}>
            Está a punto de eliminar <b>{productToDelete?.name}</b>. Esta acción es irreversible.
          </p>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: COLORS.textMuted }} />
            <input 
              type="password" 
              placeholder="Contraseña de Admin" 
              value={deletePass}
              onChange={e => setDeletePass(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '45px' }} 
            />
          </div>
          <button 
            onClick={confirmDelete}
            style={{ width: '100%', padding: '15px', background: COLORS.black, color: COLORS.gold, border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            CONFIRMAR Y ELIMINAR
          </button>
        </div>
      </Modal>

      {/* Contenedores ocultos para impresión */}
      <div id="labels-container" style={{ display: 'none' }}>
        {products.map(p => (
          <div key={p.id} className="label-box">
            <div style={{ fontWeight: '900', fontSize: '14px', color: '#B8860B', marginBottom: '5px' }}>LEGACY SHOES</div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '5px' }}>{p.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '5px 0' }}>
              <span>Talla: <b>{p.size}</b></span>
              <span>Cat: <b>{p.category}</b></span>
            </div>
            <div style={{ margin: '10px 0' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${p.sku}`} 
                alt="qr" 
                style={{ width: '100px', height: '100px' }} 
              />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', background: '#f0f0f0', padding: '4px' }}>SKU: {p.sku}</div>
            <div style={{ fontSize: '16px', fontWeight: '900', marginTop: '5px' }}>${p.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div id="invoice-container" style={{ display: 'none' }}>
        {invoiceToPrint && (
          <div className="invoice">
            <h2 style={{ textAlign: 'center', color: COLORS.goldDark }}>LEGACY SHOES</h2>
            <hr/>
            <p><strong>Cliente:</strong> {invoiceToPrint.customer.name}</p>
            <p><strong>ID:</strong> {invoiceToPrint.customer.idNumber}</p>
            <hr/>
            <table style={{ width: '100%', fontSize: '12px' }}>
              <thead><tr><th align="left">Producto</th><th>Cant</th><th align="right">Total</th></tr></thead>
              <tbody>
                {invoiceToPrint.items.map(i => (
                  <tr key={i.id}><td>{i.name}</td><td align="center">{i.qty}</td><td align="right">${(i.qty * i.price).toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
            <hr/>
            <h3 style={{ textAlign: 'right' }}>TOTAL: ${invoiceToPrint.total.toFixed(2)}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SECCIONES ---

function InventorySection({ products, onNew, onPrintLabel, onDelete }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
        <h1 style={{ fontWeight: '900', margin: 0 }}>Inventario de Calzado</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onPrintLabel} style={{ backgroundColor: 'white', border: `1px solid ${COLORS.grayBorder}`, padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Printer size={18}/> Imprimir Etiquetas
          </button>
          <button onClick={onNew} style={{ backgroundColor: COLORS.black, color: COLORS.gold, padding: '12px 25px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Plus size={18}/> Agregar Modelo
          </button>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ backgroundColor: 'white', borderRadius: '20px', border: `1px solid ${COLORS.grayBorder}`, overflow: 'hidden', position: 'relative' }}>
            <button 
              onClick={() => onDelete(p)}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.1)', color: COLORS.danger, border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', zIndex: 10 }}
            >
              <Trash2 size={16}/>
            </button>
            <div style={{ height: '180px', backgroundColor: COLORS.grayBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {p.image ? (
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={40} color="#cbd5e1" />
              )}
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: '900', color: COLORS.goldDark, marginBottom: '5px' }}>{p.category.toUpperCase()}</div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>{p.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: COLORS.textMuted }}>
                <span>Talla: <b>{p.size}</b></span>
                <span>Stock: <b style={{ color: p.stock < 5 ? COLORS.danger : COLORS.success }}>{p.stock}</b></span>
              </div>
              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: '900' }}>${p.price.toFixed(2)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: COLORS.grayBg, padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>
                  <QrCode size={12}/> {p.sku}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ onSubmit, categories }) {
  const [data, setData] = useState({ name: '', sku: '', size: '', price: '', stock: '', category: 'Casual', image: null });
  
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
      <div style={{ height: '120px', background: COLORS.grayBg, borderRadius: '15px', border: `2px dashed ${COLORS.grayBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }} onClick={() => document.getElementById('img-input').click()}>
        {data.image ? <img src={data.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={30} color={COLORS.gold}/>}
        <input id="img-input" type="file" hidden onChange={handleImage} />
      </div>
      <input placeholder="Nombre del Modelo" style={inputStyle} onChange={e => setData({...data, name: e.target.value})}/>
      <input placeholder="SKU / Código Único" style={inputStyle} onChange={e => setData({...data, sku: e.target.value})}/>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input placeholder="Talla" style={{...inputStyle, flex: 1}} onChange={e => setData({...data, size: e.target.value})}/>
        <input placeholder="Stock" type="number" style={{...inputStyle, flex: 1}} onChange={e => setData({...data, stock: e.target.value})}/>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <select style={{...inputStyle, flex: 1}} onChange={e => setData({...data, category: e.target.value})}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Precio" type="number" style={{...inputStyle, flex: 1}} onChange={e => setData({...data, price: parseFloat(e.target.value)})}/>
      </div>
      <button onClick={() => onSubmit(data)} style={{ backgroundColor: COLORS.black, color: COLORS.gold, padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
        REGISTRAR EN SISTEMA
      </button>
    </div>
  );
}

// ... Las demás secciones (SalesSection, CustomerSection, Dashboard) se mantienen igual en lógica visual ...
// (Omitidas en este bloque para brevedad pero funcionales en el sistema)

function SalesSection({ products, customers, onFinishSale }) {
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const addToCart = (p) => {
    const exists = cart.find(i => i.id === p.id);
    if (exists) setCart(cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
    else setCart([...cart, { ...p, qty: 1 }]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', height: '100%' }}>
      <div>
        <input 
          placeholder="Buscar por nombre o SKU..." 
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '15px', borderRadius: '15px', border: `1px solid ${COLORS.grayBorder}`, marginBottom: '20px' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', border: `1px solid ${COLORS.grayBorder}`, cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: COLORS.textMuted }}>SKU: {p.sku}</div>
              <div style={{ marginTop: '10px', fontWeight: '900', color: COLORS.goldDark }}>${p.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '25px', border: `1px solid ${COLORS.grayBorder}`, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', gap: '10px' }}><ShoppingBag/> Carrito de Venta</h3>
        <select 
          value={selectedCustomerId} 
          onChange={e => setSelectedCustomerId(e.target.value)}
          style={{ ...inputStyle, marginBottom: '20px' }}
        >
          <option value="">Seleccionar Cliente...</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {cart.map(i => (
            <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: COLORS.grayBg, borderRadius: '10px', marginBottom: '8px', fontSize: '13px' }}>
              <span>{i.qty}x {i.name}</span>
              <b>${(i.qty * i.price).toFixed(2)}</b>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.grayBorder}`, paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>
            <span>TOTAL</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button 
            disabled={!selectedCustomerId || cart.length === 0}
            onClick={() => { onFinishSale({ items: cart, customer: selectedCustomer, total }); setCart([]); }}
            style={{ width: '100%', padding: '18px', background: COLORS.black, color: COLORS.gold, border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', opacity: (!selectedCustomerId || cart.length === 0) ? 0.5 : 1 }}
          >
            FINALIZAR FACTURA
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ products }) {
  return (
    <div>
      <h1 style={{ fontWeight: '900', fontSize: '30px', marginBottom: '30px' }}>Resumen General</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: `1px solid ${COLORS.grayBorder}` }}>
          <TrendingUp color={COLORS.success}/>
          <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '10px' }}>MODELOS ACTIVOS</div>
          <div style={{ fontSize: '32px', fontWeight: '900' }}>{products.length}</div>
        </div>
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: `1px solid ${COLORS.grayBorder}` }}>
          <QrCode color={COLORS.gold}/>
          <div style={{ fontSize: '12px', color: COLORS.textMuted, marginTop: '10px' }}>QR GENERADOS</div>
          <div style={{ fontSize: '32px', fontWeight: '900' }}>{products.length}</div>
        </div>
        <div style={{ background: COLORS.black, padding: '30px', borderRadius: '24px', color: 'white' }}>
          <Lock color={COLORS.gold}/>
          <div style={{ fontSize: '12px', color: COLORS.gold, marginTop: '10px' }}>SEGURIDAD</div>
          <div style={{ fontSize: '14px', marginTop: '5px' }}>Protección de borrado activa</div>
        </div>
      </div>
    </div>
  );
}

function CustomerSection({ customers, onNew }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ fontWeight: '900', margin: 0 }}>Clientes Legacy</h1>
        <button onClick={onNew} style={{ background: COLORS.black, color: COLORS.gold, padding: '12px 20px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ Cliente</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {customers.map(c => (
          <div key={c.id} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: `1px solid ${COLORS.grayBorder}` }}>
            <div style={{ fontWeight: 'bold' }}>{c.name}</div>
            <div style={{ fontSize: '12px', color: COLORS.textMuted }}>ID: {c.idNumber}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${COLORS.grayBorder}`, outline: 'none', background: COLORS.grayBg, fontSize: '14px'
};