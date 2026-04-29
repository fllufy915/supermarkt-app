// Smart Shopping App - JavaScript
// ================================

// Demo-Daten: Eigenmarken-Angebote
const demoStores = [
    { id: 'lidl', name: 'Lidl', color: '#0050AA', brands: ['Milbona', 'W5', 'Cien'] },
    { id: 'aldi', name: 'Aldi', color: '#002C6A', brands: ['Milsani', 'Wiesental'] },
    { id: 'rewe', name: 'Rewe', color: '#CC071E', brands: ['ja!', 'Top Budget'] },
    { id: 'kaufland', name: 'Kaufland', color: '#E3000F', brands: ['K-Classic'] },
    { id: 'rossmann', name: 'Rossmann', color: '#C3002D', brands: ['enerbio', 'ISANA'] }
];

const demoProducts = [
    { id: 1, generic: 'Vollmilch 3,5%', unit: '1L', brand: 'Milbona', store: 'lidl', price: 0.99, originalPrice: 1.29, category: 'Milchprodukte' },
    { id: 2, generic: 'Vollmilch 3,5%', unit: '1L', brand: 'ja!', store: 'rewe', price: 1.09, originalPrice: 1.39, category: 'Milchprodukte' },
    { id: 3, generic: 'Nudeln Spaghetti', unit: '500g', brand: 'Milbona', store: 'lidl', price: 0.59, originalPrice: 0.89, category: 'Nudeln & Reis' },
    { id: 4, generic: 'Nudeln Spaghetti', unit: '500g', brand: 'K-Classic', store: 'kaufland', price: 0.55, originalPrice: 0.79, category: 'Nudeln & Reis' },
    { id: 5, generic: 'Duschgel', unit: '300ml', brand: 'Cien', store: 'lidl', price: 0.79, originalPrice: 1.19, category: 'Pflege' },
    { id: 6, generic: 'Duschgel', unit: '300ml', brand: 'ISANA', store: 'rossmann', price: 0.89, originalPrice: 1.29, category: 'Pflege' },
    { id: 7, generic: 'Joghurt Natur', unit: '500g', brand: 'Milbona', store: 'lidl', price: 0.49, originalPrice: 0.79, category: 'Milchprodukte' },
    { id: 8, generic: 'Joghurt Natur', unit: '500g', brand: 'Milsani', store: 'aldi', price: 0.55, originalPrice: 0.85, category: 'Milchprodukte' },
    { id: 9, generic: 'Toilettenpapier', unit: '10 Rollen', brand: 'W5', store: 'lidl', price: 2.99, originalPrice: 4.49, category: 'Haushalt' },
    { id: 10, generic: 'Toilettenpapier', unit: '10 Rollen', brand: 'Top Budget', store: 'rewe', price: 3.29, originalPrice: 4.99, category: 'Haushalt' },
    { id: 11, generic: 'Reis Basmati', unit: '1kg', brand: 'K-Classic', store: 'kaufland', price: 1.99, originalPrice: 2.99, category: 'Nudeln & Reis' },
    { id: 12, generic: 'Shampoo', unit: '300ml', brand: 'enerbio', store: 'rossmann', price: 1.99, originalPrice: 2.99, category: 'Pflege' }
];

// State
let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
let activeStoreFilter = null;
let currentDeals = [];

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    renderStoreFilters();
    renderShoppingList();
    renderDeals();
    updateStats();
});

// Store Filter rendern
function renderStoreFilters() {
    const container = document.getElementById('store-filters');
    if (!container) return;
    
    container.innerHTML = demoStores.map(store => `
        <button onclick="filterByStore('${store.id}')" 
            class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeStoreFilter === store.id 
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' 
                : 'bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:bg-slate-700/80'}"
            id="store-btn-${store.id}">
            ${store.name}
        </button>
    `).join('');
}

// Nach Store filtern
function filterByStore(storeId) {
    activeStoreFilter = activeStoreFilter === storeId ? null : storeId;
    renderStoreFilters();
    renderDeals();
}

// Filter zurücksetzen
function clearFilters() {
    activeStoreFilter = null;
    document.getElementById('search-input').value = '';
    renderStoreFilters();
    renderDeals();
}

// Deals rendern
function renderDeals() {
    const container = document.getElementById('deals-list');
    if (!container) return;
    
    let deals = [...demoProducts];
    
    // Store Filter
    if (activeStoreFilter) {
        deals = deals.filter(d => d.store === activeStoreFilter);
    }
    
    // Search Filter
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    if (searchTerm) {
        deals = deals.filter(d => 
            d.generic.toLowerCase().includes(searchTerm) ||
            d.brand.toLowerCase().includes(searchTerm)
        );
    }
    
    currentDeals = deals;
    
    if (deals.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-search text-2xl text-slate-600"></i>
                </div>
                <p class="text-slate-500 text-sm">Keine Angebote gefunden</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = deals.map(deal => {
        const store = demoStores.find(s => s.id === deal.store);
        const discount = Math.round((1 - deal.price / deal.originalPrice) * 100);
        const isInList = shoppingList.some(item => item.productId === deal.id);
        
        return `
            <div class="deal-card bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 hover:border-primary-500/30">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-semibold text-white">${deal.generic}</h3>
                        <p class="text-xs text-slate-400">${deal.brand} • ${deal.unit}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-xl font-bold text-primary-400">${deal.price.toFixed(2)}€</div>
                        <div class="text-xs text-slate-500 line-through">${deal.originalPrice.toFixed(2)}€</div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-1 rounded-lg text-xs font-medium" style="background: ${store.color}20; color: ${store.color}">
                            ${store.name}
                        </span>
                        <span class="text-xs text-green-400 font-medium">-${discount}%</span>
                    </div>
                    <button onclick="toggleListItem(${deal.id})" 
                        class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isInList 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'}"
                        id="list-btn-${deal.id}">
                        <i class="fas ${isInList ? 'fa-check' : 'fa-plus'} text-xs"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Shopping List rendern
function renderShoppingList() {
    const container = document.getElementById('shopping-list');
    if (!container) return;
    
    if (shoppingList.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700/50">
                <i class="fas fa-shopping-basket text-2xl text-slate-600 mb-2"></i>
                <p class="text-slate-500 text-sm">Liste ist leer</p>
                <p class="text-slate-600 text-xs mt-1">Tippe + um Produkte hinzuzufügen</p>
            </div>
        `;
        updateListBadge(0);
        return;
    }
    
    container.innerHTML = shoppingList.map(item => {
        const product = demoProducts.find(p => p.id === item.productId);
        const deal = product ? `${product.price.toFixed(2)}€ bei ${demoStores.find(s => s.id === product.store)?.name || ''}` : '';
        
        return `
            <div class="flex items-center gap-3 bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 ${item.checked ? 'opacity-50' : ''}">
                <button onclick="toggleChecked(${item.id})" class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${item.checked 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-slate-600 hover:border-primary-500'}"
                >
                    ${item.checked ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
                </button>
                <div class="flex-1">
                    <p class="text-sm font-medium ${item.checked ? 'line-through text-slate-500' : 'text-white'}">${item.name}</p>
                    ${product ? `<p class="text-xs text-primary-400">${deal}</p>` : ''}
                </div>
                <button onclick="removeItem(${item.id})" class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </div>
        `;
    }).join('');
    
    updateListBadge(shoppingList.filter(i => !i.checked).length);
}

// Liste hinzufügen
function toggleListItem(productId) {
    const existing = shoppingList.find(item => item.productId === productId);
    
    if (existing) {
        shoppingList = shoppingList.filter(item => item.productId !== productId);
    } else {
        const product = demoProducts.find(p => p.id === productId);
        if (product) {
            shoppingList.push({
                id: Date.now(),
                productId: productId,
                name: product.generic,
                checked: false
            });
        }
    }
    
    saveList();
    renderShoppingList();
    renderDeals(); // Update buttons
}

// Manuelles Hinzufügen
function showAddItem() {
    document.getElementById('add-modal').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('add-modal-content').classList.remove('translate-y-full');
    }, 10);
    document.getElementById('new-item-name').focus();
}

function closeAddModal() {
    document.getElementById('add-modal-content').classList.add('translate-y-full');
    setTimeout(() => {
        document.getElementById('add-modal').classList.add('hidden');
    }, 300);
}

function addItem(priority) {
    const name = document.getElementById('new-item-name').value.trim();
    if (!name) return;
    
    shoppingList.push({
        id: Date.now(),
        productId: null,
        name: name,
        checked: false,
        priority: priority
    });
    
    saveList();
    renderShoppingList();
    closeAddModal();
    document.getElementById('new-item-name').value = '';
}

function toggleChecked(itemId) {
    const item = shoppingList.find(i => i.id === itemId);
    if (item) {
        item.checked = !item.checked;
        saveList();
        renderShoppingList();
    }
}

function removeItem(itemId) {
    shoppingList = shoppingList.filter(i => i.id !== itemId);
    saveList();
    renderShoppingList();
    renderDeals();
}

function saveList() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

function updateListBadge(count) {
    const badge = document.getElementById('list-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// Search toggle
function toggleSearch() {
    const bar = document.getElementById('search-bar');
    if (bar.classList.contains('-translate-y-full')) {
        bar.classList.remove('-translate-y-full');
        document.getElementById('search-input').focus();
    } else {
        bar.classList.add('-translate-y-full');
        document.getElementById('search-input').value = '';
        renderDeals();
    }
}

function filterProducts(term) {
    renderDeals();
}

// Stats
function updateStats() {
    document.getElementById('stat-deals').textContent = demoProducts.length;
    document.getElementById('stat-stores').textContent = demoStores.length;
    
    const maxDiscount = Math.max(...demoProducts.map(p => 
        Math.round((1 - p.price / p.originalPrice) * 100)
    ));
    document.getElementById('stat-savings').textContent = maxDiscount + '%';
    
    document.getElementById('header-status').textContent = 
        `${demoProducts.length} Eigenmarken-Angebote`;
}

// Sort
function sortDeals(sortType) {
    // Sort logic would go here
    renderDeals();
}

// Tab Navigation
function showTab(tab) {
    // Reset all nav buttons
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('text-primary-400');
        btn.classList.add('text-slate-500');
    });
    
    // Highlight active
    document.getElementById(`nav-${tab}`).classList.remove('text-slate-500');
    document.getElementById(`nav-${tab}`).classList.add('text-primary-400');
}

// Close modal on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAddModal();
        document.getElementById('search-bar').classList.add('-translate-y-full');
    }
});
