let products = [];
let cart = [];
let selectedTalle = null;

// INICIALIZACIÓN DE LOS 25 LUGARES VACÍOS
function init() {
    for(let i = 1; i <= 25; i++) {
        products.push({
            id: i,
            name: `PRODUCTO ${i}`, // Editá este nombre
            price: 0,              // Poné un precio mayor a 0 para mostrarlo (ej: 15000)
            description: "Prenda exclusiva diseñada para resaltar tu estilo. Materiales de alta calidad y calce perfecto.",
            code: `REF-00${i}`,
            sizes: ["S", "M", "L", "XL"],
            images: ["https://i.ibb.co/5XsWWTMn/reina-lara.jpg"], // URL de la imagen
            inStock: false         // Cambiá a true para que se vea en la web
        });
    }
}

// NAVEGACIÓN
function toggleMenu() { document.getElementById('sidebar').classList.toggle('-translate-x-full'); }

function navTo(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${view}`).classList.remove('hidden');
    document.getElementById('sidebar').classList.add('-translate-x-full');
    if(view === 'home') renderShop();
    if(view === 'cart') renderCart();
}

// RENDERIZAR TIENDA
function renderShop() {
    const grid = document.getElementById('productGrid');
    const available = products.filter(p => p.price > 0 && p.inStock);
    
    if(available.length === 0) {
        grid.innerHTML = `<div class="col-span-2 text-center py-20 text-pink-300 font-black uppercase text-[10px] italic">Próximamente lanzamientos...</div>`;
        return;
    }

    grid.innerHTML = available.map(p => `
        <div onclick="openProduct(${p.id})" class="bg-white/60 p-2 rounded-[2rem] border border-pink-50 active:scale-95 transition-all">
            <img src="${p.images[0]}" class="w-full aspect-[3/4] object-cover rounded-[1.5rem] mb-3">
            <h4 class="text-[9px] font-black uppercase text-pink-600 px-2 leading-none">${p.name}</h4>
            <p class="font-black text-sm text-gray-900 px-2 mt-1">$${p.price.toLocaleString()}</p>
        </div>
    `).join('');
}

// ABRIR DETALLE
function openProduct(id) {
    const p = products.find(x => x.id === id);
    selectedTalle = null;
    const detail = document.getElementById('view-product-detail');
    detail.classList.remove('hidden');
    
    detail.innerHTML = `
        <div class="max-w-md mx-auto py-10 px-4">
            <button onclick="this.closest('.view').classList.add('hidden')" class="mb-6 font-black text-pink-300 text-[10px] uppercase">← Volver</button>
            <img src="${p.images[0]}" class="w-full aspect-[3/4] object-cover rounded-[2.5rem] shadow-xl mb-6">
            <h2 class="text-3xl font-black uppercase italic text-pink-600 leading-none">${p.name}</h2>
            <p class="text-pink-400 font-black text-2xl mb-4 italic">$${p.price.toLocaleString()}</p>
            <p class="text-gray-400 text-[11px] mb-8 font-medium">${p.description}</p>
            <div class="grid grid-cols-4 gap-2 mb-10">
                ${p.sizes.map(t => `<button onclick="selectTalle(this, '${t}')" class="talle-btn">${t}</button>`).join('')}
            </div>
            <button onclick="addToCart(${p.id})" class="w-full bg-pink-500 text-white py-6 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em]">Añadir al Pedido</button>
        </div>
    `;
}

function selectTalle(btn, talle) {
    document.querySelectorAll('.talle-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedTalle = talle;
}

// CARRITO
function addToCart(id) {
    if(!selectedTalle) return alert("Elegí un talle");
    const p = products.find(x => x.id === id);
    cart.push({...p, talle: selectedTalle});
    
    const mp = document.getElementById('mp-success');
    const mpCircle = document.getElementById('mp-circle');
    mp.classList.add('mp-active');
    mpCircle.classList.add('mp-circle-pop');
    
    setTimeout(() => {
        mp.classList.remove('mp-active');
        mpCircle.classList.remove('mp-circle-pop');
        document.getElementById('view-product-detail').classList.add('hidden');
        document.getElementById('cart-count').innerText = cart.length;
    }, 1000);
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if(cart.length === 0) {
        container.innerHTML = "<p class='text-center py-10 text-pink-200 font-black uppercase text-[10px]'>Vacío</p>";
        document.getElementById('cart-total').innerText = "$0";
        return;
    }
    container.innerHTML = cart.map((item, index) => `
        <div class="flex items-center gap-4 border-b border-pink-50 pb-4">
            <div class="flex-1">
                <p class="font-black text-[10px] uppercase text-pink-600">${item.name}</p>
                <p class="text-[9px] font-bold text-gray-400 uppercase">Talle: ${item.talle} | $${item.price.toLocaleString()}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="text-red-300 font-bold p-2">✕</button>
        </div>
    `).join('');
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    document.getElementById('cart-total').innerText = `$${total.toLocaleString()}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cart-count').innerText = cart.length;
    renderCart();
}

// ADMIN
function askAdminCode() {
    if(prompt("PIN ADMIN:") === "151225") { navTo('admin'); renderStockAdmin(); }
}

function renderStockAdmin() {
    const container = document.getElementById('tab-stock');
    container.innerHTML = products.map(p => `
        <div class="flex justify-between items-center p-4 bg-pink-50/20 rounded-2xl mb-2">
            <div class="text-[10px] font-black uppercase">
                <p class="text-pink-300">${p.code}</p>
                <p>${p.name}</p>
            </div>
            <button onclick="toggleStock(${p.id})" class="px-4 py-2 rounded-xl text-[9px] font-black uppercase ${p.inStock ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}">
                ${p.inStock ? 'Visible' : 'Oculto'}
            </button>
        </div>
    `).join('');
}

function toggleStock(id) {
    const p = products.find(x => x.id === id);
    p.inStock = !p.inStock;
    renderStockAdmin();
}

// FINALIZAR WHATSAPP (Mensaje corregido)
function checkout() {
    if(cart.length === 0) return;
    const itemsText = cart.map(p => `• *${p.name}*%0A  Talle: ${p.talle}%0A  Precio: $${p.price.toLocaleString()}`).join('%0A%0A');
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const mensaje = `¡Hola Reina Lara! ✨ Mi pedido es:%0A%0A${itemsText}%0A%0A*TOTAL: $${total.toLocaleString()}*`;
    window.open(`https://wa.me/5491169387679?text=${mensaje}`);
}

init();
renderShop();
