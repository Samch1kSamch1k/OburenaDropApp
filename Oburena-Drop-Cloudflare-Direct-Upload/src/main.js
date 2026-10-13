import { caseCatalog, categoryNames, chooseDrop, filters, rollWear } from './data.js';

const root = document.querySelector('#app');
const STORE_KEY = 'oburena-drop-demo-v1';
const STARTER_BALANCE = 1.00;
const TEST_COIN_GRANT = 5000.00;
const money = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    return {
      balance: Number.isFinite(Number(saved?.balance)) ? Math.max(0, Number(saved.balance)) : STARTER_BALANCE,
      inventory: Array.isArray(saved?.inventory) ? saved.inventory.slice(0, 150) : [],
      history: Array.isArray(saved?.history) ? saved.history.slice(0, 40) : []
    };
  } catch {
    return { balance: STARTER_BALANCE, inventory: [], history: [] };
  }
}

let state = readState();
let activeView = 'cases';
let activeFilter = 'all';
let activeSort = 'featured';
let searchTerm = '';
let selectedCaseId = null;
let revealInProgress = false;
let revealedItem = null;
let rollingDrop = null;
let walletOpen = false;
let notice = '';
let noticeTimer;

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* local-only demo continues in memory */ }
}
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function coin(value, size = '') {
  return `<span class="money ${size}"><svg class="coin-symbol" viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12"/><path d="M5.5 14c2.2-3 5.1-4.5 8.5-4.5s6.3 1.5 8.5 4.5c-2.2 3-5.1 4.5-8.5 4.5S7.7 17 5.5 14Z"/><circle class="coin-pupil" cx="14" cy="14" r="2.5"/><path class="coin-glint" d="M3 14h3m16 0h3"/></svg><span>${money.format(value)}</span><small>OC</small></span>`;
}
function icon(type) {
  const drawings = {
    weapon: '<path d="M3 9h14l3 2h5v3h-7l-2-1H8l-2 4H3l2-5-2-3Zm4-3h12v2H7z"/><path d="M11 14h3v6h-3z"/>',
    knife: '<path d="M3 19 19 5l3 1-8 8-2 4-3-1-4 4z"/><path d="m8 17 3 3"/>',
    gloves: '<path d="m7 21-2-8 2-2 2 2V5a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-6a2 2 0 0 1 4 0v8l2-2 2 2-3 7a4 4 0 0 1-4 2H7Z"/>',
    sticker: '<path d="M6 3h13l4 4v12l-4 4H6l-4-4V7z"/><path d="M8 11h10M8 15h7"/>',
    graffiti: '<path d="M7 3h10l2 3-2 3H7L5 6z"/><path d="M9 9v11a3 3 0 0 0 6 0V9m-5 4h4m-8 8 1-3m12 3 1-3"/>',
    souvenir: '<path d="M5 4h14l3 3v13l-3 3H5l-3-3V7z"/><path d="M8 9h8v8H8zM10 6v3m4-3v3m-4 8v3m4-3v3"/>',
    agent: '<circle cx="14" cy="8" r="4"/><path d="M5 23a9 9 0 0 1 18 0M10 16l4 3 4-3"/>',
    charm: '<path d="M10 3v5l-3 3v6l7 7 7-7v-6l-3-3V3"/><circle cx="14" cy="14" r="2"/>',
    case: '<path d="M3 8h22v14H3zM9 8V5h10v3M3 12h22m-14 0v3h6v-3"/>'
  };
  return `<svg class="item-icon" viewBox="0 0 28 28" aria-hidden="true">${drawings[type] || drawings.case}</svg>`;
}
function rarityKey(rarity) { return String(rarity || 'Mil-Spec').toLowerCase().replace(/[^a-z]+/g, '-'); }
function rarityColor(rarity) {
  return ({ 'mil-spec': 'blue', restricted: 'purple', classified: 'pink', covert: 'red', extraordinary: 'gold' })[rarityKey(rarity)] || 'blue';
}
function wearInfo(entry) {
  if (!entry?.condition || !Number.isFinite(Number(entry.float))) return '<span class="no-wear">COLLECTIBLE В· NO WEAR FLOAT</span>';
  const key = String(entry.condition).toLowerCase().replace(/[^a-z]+/g, '-');
  return `<span class="wear-badge wear-${esc(key)}">${esc(entry.condition)}</span><span class="float-value">FLOAT ${Number(entry.float).toFixed(4)}</span>`;
}
function categoryLabel(id) { return categoryNames[id] || 'Case'; }
function announce(text) {
  notice = text;
  clearTimeout(noticeTimer);
  render();
  noticeTimer = setTimeout(() => { notice = ''; render(); }, 2800);
}
function currentCase() { return caseCatalog.find((item) => item.id === selectedCaseId) || null; }
function visibleCases() {
  let list = caseCatalog.filter((item) => activeFilter === 'all' || item.category === activeFilter);
  const query = searchTerm.trim().toLowerCase();
  if (query) list = list.filter((item) => `${item.name} ${item.tag} ${categoryLabel(item.category)}`.toLowerCase().includes(query));
  if (activeSort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  else if (activeSort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  else if (activeSort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
function caseCard(item) {
  const canOpen = state.balance >= item.price;
  return `<article class="case-card accent-${esc(item.accent)}">
    <button class="case-art-button" data-action="inspect" data-id="${esc(item.id)}" aria-label="Inspect ${esc(item.name)} case">
      <img class="case-art" src="${esc(item.image)}" alt="AI cover art for ${esc(item.name)} case" loading="lazy" />
      <span class="case-index">${String(item.index).padStart(2, '0')} <i></i> 27</span>
      <span class="case-art-veil"></span>
      <span class="case-art-open">INSPECT CASE <b>в†—</b></span>
    </button>
    <div class="case-card-body">
      <div class="case-meta"><span class="case-category">${esc(categoryLabel(item.category))}</span><span class="rarity-line" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>
      <h3>${esc(item.name)}</h3>
      <div class="case-bottom"><span class="case-price">${coin(item.price)}</span><button class="card-open ${canOpen ? '' : 'is-short'}" data-action="inspect" data-id="${esc(item.id)}" aria-label="Open ${esc(item.name)} details">${canOpen ? 'OPEN' : 'VIEW'} <span>в†—</span></button></div>
    </div>
  </article>`;
}
function itemArtwork(entry = {}) {
  const title = esc(entry.name || 'Weapon skin');
  const color = ({ blue: '#68c6ed', purple: '#bb84f3', pink: '#ef81c4', red: '#fb554c', gold: '#f4c76a' })[rarityColor(entry.rarity)] || '#68c6ed';
  if (!['weapon', 'knife'].includes(entry.type || 'weapon')) return icon(entry.type || 'weapon');
  if (entry.type === 'knife') return `<svg class="weapon-art knife-art" viewBox="0 0 240 100" role="img" aria-label="${title}"><path d="M22 69 177 22l34 8-100 41-47 12z" fill="${color}" stroke="#f7e9d5" stroke-width="2"/><path d="m57 70 26 20-22 6-21-17z" fill="#6c332d" stroke="${color}" stroke-width="2"/><path d="m70 71 17 13m-5-20 17 13" stroke="#dca99a" stroke-width="3"/></svg>`;
  return `<svg class="weapon-art" viewBox="0 0 240 100" role="img" aria-label="${title}"><defs><linearGradient id="skin-${color.slice(1)}" x2="0" y2="1"><stop stop-color="#f3d8bc"/><stop offset=".4" stop-color="${color}"/><stop offset="1" stop-color="#49353b"/></linearGradient></defs><path d="M20 47h26l10-11h83l12 8h48l12 8h15v13h-31l-12-5h-46l-8 10H92l-4-10H57l-8 10H37l4-16H20z" fill="url(#skin-${color.slice(1)})" stroke="#eadbd1" stroke-width="2" stroke-linejoin="round"/><path d="M83 40h35l7 12H78z" fill="#22232a" stroke="${color}" stroke-width="2"/><path d="M18 45h28m129 4h44m-114 4 8 11m37-23 4-10h17v11" fill="none" stroke="#f7dfca" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="46" r="3" fill="#fff"/><path d="m57 40 14-12h25v12" fill="none" stroke="#bd927c" stroke-width="3"/></svg>`;
}
function inventoryCard(entry) {
  const itemType = entry.type || 'weapon';
  const caseItem = caseCatalog.find((item) => item.id === entry.caseId);
  const image = caseItem?.image || '';
  const value = Math.max(0.05, Number(entry.sellValue) || 0.05);
  return `<article class="inventory-card rarity-edge-${rarityColor(entry.rarity)}"><div class="inventory-card-art" style="--item-art:url('${esc(image)}')"><div class="inventory-icon">${itemArtwork(entry)}</div><span class="item-class">${esc(itemType)}</span></div><div class="inventory-copy"><span class="rarity-label text-${rarityColor(entry.rarity)}">${esc(entry.rarity || 'Mil-Spec')}</span><h3>${esc(entry.name || 'Unknown item')}</h3><p>From ${esc(entry.caseName || 'Oburena case')}</p><div class="wear-data">${wearInfo(entry)}</div><button class="sell-item" data-action="sell-item" data-id="${esc(entry.id)}">SELL В· ${money.format(value)} OC</button></div></article>`;
}
function sidebar() {
  return `<aside class="sidebar">
    <div class="side-label">THE DROP ZONE</div>
    <nav class="side-nav" aria-label="Main navigation">
      <button class="side-link ${activeView === 'cases' ? 'active' : ''}" data-action="view" data-view="cases"><span class="nav-glyph glyph-cases">в–§</span><span>Case shop</span><span class="side-count">27</span></button>
      <button class="side-link ${activeView === 'inventory' ? 'active' : ''}" data-action="view" data-view="inventory"><span class="nav-glyph glyph-inventory">в—€</span><span>My inventory</span><span class="side-count">${state.inventory.length}</span></button>
      <button class="side-link ${activeView === 'history' ? 'active' : ''}" data-action="view" data-view="history"><span class="nav-glyph glyph-history">в†»</span><span>Drop history</span></button>
    </nav>
    <div class="sidebar-divider"></div>
    <div class="side-label">QUICK FILTER</div>
    <nav class="side-nav side-filters" aria-label="Case categories">${filters.map((filter) => `<button class="side-filter ${activeFilter === filter.id ? 'selected' : ''}" data-action="filter" data-filter="${filter.id}"><span class="filter-dot dot-${filter.id}"></span>${filter.label}<span class="filter-number">${filter.id === 'all' ? caseCatalog.length : caseCatalog.filter((item) => item.category === filter.id).length}</span></button>`).join('')}</nav>
    <div class="side-promo"><div class="promo-eyes">в—‰ <span>в—‰</span></div><strong>OBURENA IS<br/>WATCHING.</strong><p>27 cases. One good decision.</p><button data-action="view" data-view="cases">PICK YOUR CASE <span>в†—</span></button></div>
    <div class="sidebar-foot"><span class="status-live"></span> DROP ENGINE <b>ONLINE</b></div>
  </aside>`;
}
function header() {
  return `<header class="topbar">
    <button class="brand" data-action="view" data-view="cases" aria-label="Oburena Drop home"><img src="/brand/oburena-mark.svg" alt=""/><span class="brand-wordmark">OBURENA <b>DROP</b><small>THE ARMORY IS WATCHING</small></span></button>
    <div class="top-center"><span class="top-live"><i></i> LIVE DROP</span><span class="top-divider"></span><span class="top-promo">CS2-INSPIRED <b>В·</b> FAN-MADE</span></div>
    <div class="top-actions"><button class="top-inventory" data-action="view" data-view="inventory"><span class="inventory-glyph">в—€</span><span>INVENTORY</span><b>${state.inventory.length}</b></button><div class="wallet-wrap"><button class="wallet" data-action="wallet" aria-expanded="${walletOpen}"><span class="wallet-copy"><small>OBURENACOIN BALANCE</small><strong>${coin(state.balance)}</strong></span><span class="wallet-mark">${coinMark()}</span></button>${walletOpen ? walletPopover() : ''}</div></div>
  </header>`;
}
function coinMark() {
  return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17"/><path d="M7 20c3.4-4.8 7.8-7.2 13-7.2s9.6 2.4 13 7.2c-3.4 4.8-7.8 7.2-13 7.2S10.4 24.8 7 20Z"/><circle cx="20" cy="20" r="3.8"/><path d="M3 20h5m24 0h5"/></svg>';
}
function walletPopover() {
  return `<div class="wallet-popover"><div class="wallet-pop-title">TEST WALLET <span>LOCAL ONLY</span></div><p>These demo coins have no cash value. Add test funds to try the vault cases.</p><button data-action="top-up">${coinMark()} ADD +5,000 DEMO COINS</button><button class="wallet-reset" data-action="reset-wallet">RESET TO STARTER 1.00</button></div>`;
}
function hero() {
  return `<section class="hero">
    <div class="hero-copy"><div class="eyebrow"><i></i> SEASON 01 <span>///</span> EYES ON THE PRIZE</div><h1>THE ARMORY<br/><em>IS WATCHING.</em></h1><p>Twenty-seven cases. One starter coin. <b>Don't blink.</b></p><div class="hero-actions"><button class="button-primary" data-action="browse">BROWSE THE CASES <span>в†</span></button><div class="hero-stat"><strong>27</strong><small>UNIQUE<br/>CASES</small></div></div></div>
    <div class="hero-image"><img src="/brand/oburena-reference.jpg" alt="The Oburena red-eye portrait that inspired the app theme"/><div class="hero-image-wash"></div><div class="hero-scanline"></div><div class="hero-image-label"><span class="hero-eye">в—‰</span><span>SUBJECT 001<br/><b>OBURENA</b></span><span class="hero-rec">в—Џ REC</span></div><div class="hero-red-stamp">DO NOT<br/><b>BLINK</b></div></div>
    <div class="hero-stamp"><span>OD</span><b>VOL.<br/>01</b></div>
  </section>`;
}
function stats() {
  return `<section class="stats-row" aria-label="Your drop stats"><div class="stat-card"><span class="stat-icon stat-cases">в–§</span><div><small>AVAILABLE CASES</small><strong>27 <span>IN ROTATION</span></strong></div></div><div class="stat-card"><span class="stat-icon stat-inventory">в—€</span><div><small>YOUR INVENTORY</small><strong>${state.inventory.length} <span>ITEM${state.inventory.length === 1 ? '' : 'S'}</span></strong></div></div><div class="stat-card"><span class="stat-icon stat-drops">вњі</span><div><small>LAST DROP</small><strong>${state.history[0] ? esc(state.history[0].name) : 'вЂ”'} <span>${state.history[0] ? esc(state.history[0].rarity).toUpperCase() : 'GO ON. OPEN ONE.'}</span></strong></div></div><div class="stat-live"><span><i></i> SYSTEM LIVE</span><small>OBURENA DROP ENGINE <b>v01.27</b></small></div></section>`;
}
function filterBar() {
  const count = visibleCases().length;
  return `<section class="catalog-toolbar" id="catalog">
    <div class="catalog-heading"><div class="eyebrow"><i></i> PICK YOUR POISON</div><h2>CASE <em>SELECTOR</em></h2><p>Find a case. Pay in demo coin. See what stares back.</p></div>
    <div class="catalog-controls"><div class="filter-tabs" role="tablist" aria-label="Filter cases">${filters.map((filter) => `<button class="filter-tab ${activeFilter === filter.id ? 'active' : ''}" role="tab" aria-selected="${activeFilter === filter.id}" data-action="filter" data-filter="${filter.id}">${filter.label}<span>${filter.id === 'all' ? caseCatalog.length : caseCatalog.filter((item) => item.category === filter.id).length}</span></button>`).join('')}</div><div class="catalog-tools"><label class="search-box"><span>вЊ•</span><input type="search" placeholder="Search cases..." value="${esc(searchTerm)}" aria-label="Search cases"/><kbd>вЊ K</kbd></label><label class="sort-box"><span>SORT</span><select aria-label="Sort cases" data-sort><option value="featured" ${activeSort === 'featured' ? 'selected' : ''}>Featured</option><option value="low" ${activeSort === 'low' ? 'selected' : ''}>Price: low to high</option><option value="high" ${activeSort === 'high' ? 'selected' : ''}>Price: high to low</option><option value="az" ${activeSort === 'az' ? 'selected' : ''}>A to Z</option></select><b>вЊ„</b></label></div></div>
    <div class="grid-count"><span><b>${count}</b> CASES FOUND</span><span><i></i> PRICES IN OBURENACOIN</span></div>
  </section>`;
}
function caseGrid() {
  const shown = visibleCases();
  if (!shown.length) return `<div class="empty-state"><div class="empty-eyes">в—‰</div><h3>NO CASES IN SIGHT</h3><p>Try a different category or search.</p><button data-action="clear-filters">CLEAR FILTERS</button></div>`;
  return `<div class="case-grid">${shown.map(caseCard).join('')}</div>`;
}
function casesView() {
  return `<main class="page-content">${hero()}${stats()}${filterBar()}${caseGrid()}<div class="collection-footer"><span><i></i> ALL 27 CASES LOADED</span><span>EVERY COIN IS VIRTUAL <b>В·</b> EVERY DROP IS A DEMO</span></div><footer class="legal-foot">OBURENA DROP IS A FAN-MADE CONCEPT AND IS NOT AFFILIATED WITH VALVE OR COUNTER-STRIKE. NO REAL-MONEY DEPOSITS OR CASH-OUTS. OD-01 <span>в†—</span></footer></main>`;
}
function inventoryView() {
  const body = state.inventory.length
    ? `<div class="inventory-grid">${[...state.inventory].reverse().map(inventoryCard).join('')}</div>`
    : `<div class="empty-state inventory-empty"><div class="empty-eyes">в—€</div><h3>YOUR INVENTORY IS QUIET</h3><p>Open a case and let something find you.</p><button data-action="view" data-view="cases">BACK TO CASE SHOP</button></div>`;
  const totalValue = state.inventory.reduce((sum, entry) => sum + Math.max(0.05, Number(entry.sellValue) || 0.05), 0);
  return `<main class="page-content subpage"><div class="subpage-title"><div class="eyebrow"><i></i> PERSONAL ARMORY</div><h1>MY <em>INVENTORY</em></h1><p>Every item you have pulled from the dark.</p><div class="subpage-count"><strong>${state.inventory.length}</strong> ITEMS COLLECTED</div>${state.inventory.length ? `<button class="sell-all" data-action="sell-all">SELL ALL В· ${money.format(totalValue)} OC</button>` : ''}</div>${body}<footer class="legal-foot">DEMO COLLECTION STORED ON THIS DEVICE ONLY <span>в†—</span></footer></main>`;
}
function historyView() {
  const rows = state.history.map((entry, index) => `<article class="history-row"><div class="history-index">${String(state.history.length - index).padStart(2, '0')}</div><div class="history-icon rarity-edge-${rarityColor(entry.rarity)}">${icon(entry.type || 'weapon')}</div><div class="history-name"><small>${esc(entry.caseName || 'CASE DROP')} ${entry.condition ? `В· ${esc(entry.condition)} В· ${Number(entry.float).toFixed(4)}` : ''}</small><strong>${esc(entry.name)}</strong></div><span class="rarity-label text-${rarityColor(entry.rarity)}">${esc(entry.rarity)}</span><time>${esc(entry.time || '')}</time></article>`).join('');
  return `<main class="page-content subpage"><div class="subpage-title"><div class="eyebrow"><i></i> EVERY REVEAL</div><h1>DROP <em>HISTORY</em></h1><p>Recent pulls, newest first. No take-backs.</p></div>${state.history.length ? `<div class="history-list">${rows}</div>` : `<div class="empty-state"><div class="empty-eyes">в†»</div><h3>NO DROPS. YET.</h3><p>Your first case opening will show up here.</p><button data-action="view" data-view="cases">FIND A CASE</button></div>`}<footer class="legal-foot">YOUR HISTORY IS SAVED LOCALLY IN THIS BROWSER <span>в†—</span></footer></main>`;
}
function caseModal(item) {
  if (!item) return '';
  const canOpen = state.balance + 0.000001 >= item.price;
  let resultBlock;
  if (revealInProgress) {
    resultBlock = `<div class="reveal-box is-opening"><div class="reel-flare"></div><div class="weapon-reel" aria-label="Rolling through possible drops"><div class="weapon-reel-track">${Array.from({ length: 18 }, (_, i) => { const drop = i === 17 ? rollingDrop : item.drops[i % item.drops.length]; return `<div class="reel-item rarity-edge-${rarityColor(drop.rarity)}">${itemArtwork(drop)}<small>${esc(drop.name)}</small></div>`; }).join('')}</div><span class="reel-pointer"></span></div><p>ROLLING THROUGH THE ARMORY<span class="loading-dots">...</span></p></div>`;
  } else if (revealedItem) {
    resultBlock = `<div class="reveal-box is-revealed"><div class="reveal-kicker"><i></i> YOU PULLED</div><div class="revealed-item rarity-edge-${rarityColor(revealedItem.rarity)}"><div class="revealed-art">${itemArtwork(revealedItem)}<span class="drop-spark">вњі</span></div><div class="revealed-copy"><span class="rarity-label text-${rarityColor(revealedItem.rarity)}">${esc(revealedItem.rarity)} В· ${revealedItem.chance}% DROP CHANCE</span><h3>${esc(revealedItem.name)}</h3><p>${esc(categoryLabel(item.category))} drop from <b>${esc(item.name)}</b></p><div class="wear-data">${wearInfo(revealedItem)}</div></div></div><button class="button-primary modal-primary" data-action="open-again" data-id="${esc(item.id)}">OPEN THIS CASE AGAIN <span>в†—</span></button><button class="modal-secondary" data-action="view-inventory">VIEW MY INVENTORY в†’</button></div>`;
  } else {
    resultBlock = `<div class="modal-pool"><div class="pool-heading"><span>CASE DROP TABLE</span><span>${item.drops.length} POSSIBLE SKINS / ITEMS</span></div>${item.drops.map((drop) => `<div class="pool-item"><span class="pool-icon type-${esc(drop.type)}">${icon(drop.type)}</span><span class="pool-name">${esc(drop.name)}<small>${esc(drop.type.toUpperCase())}</small></span><span class="pool-rarity text-${rarityColor(drop.rarity)}">${esc(drop.rarity)}<small>${drop.chance}%</small></span></div>`).join('')}</div><div class="modal-actions"><div class="modal-cost"><small>OPENING COST</small>${coin(item.price)}</div><button class="button-primary modal-primary" data-action="open-case" data-id="${esc(item.id)}" ${canOpen ? '' : 'disabled'}>${canOpen ? 'OPEN CASE' : 'NOT ENOUGH OC'} <span>${canOpen ? 'в†—' : '!'}</span></button></div><p class="modal-note">SKINS MAY ROLL IN 5 WEAR CONDITIONS В· LOCAL DEMO ONLY</p>${!canOpen ? `<div class="wallet-needed"><span>NEED DEMO COINS FOR THIS VAULT.</span><button data-action="top-up">ADD +5,000 FREE TEST OC</button></div>` : ''}`;
  }
  return `<div class="modal-backdrop" data-action="backdrop"><section class="case-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" data-action="close-modal" aria-label="Close">Г—</button><div class="modal-visual accent-${esc(item.accent)}"><img src="${esc(item.image)}" alt="AI cover art for ${esc(item.name)} case"/><span class="modal-visual-tag"><i></i> ${esc(item.tag)}</span><span class="modal-serial">OD / ${String(item.index).padStart(2, '0')}</span></div><div class="modal-content"><div class="eyebrow"><i></i> ${esc(categoryLabel(item.category))} CASE <span>///</span> ${String(item.index).padStart(2, '0')} OF 27</div><h2 id="modal-title">${esc(item.name)}</h2><p class="modal-description">${item.drops.length} unique drops, each skin with a possible wear roll. A very watchful case.</p>${resultBlock}</div></section></div>`;
}
function render() {
  const view = activeView === 'inventory' ? inventoryView() : activeView === 'history' ? historyView() : casesView();
  root.innerHTML = `${header()}<div class="app-shell">${sidebar()}${view}</div>${selectedCaseId ? caseModal(currentCase()) : ''}${notice ? `<div class="toast" role="status"><span>в—‰</span> ${esc(notice)}</div>` : ''}`;
}
function selectFilter(filter) {
  if (['all', 'budget', 'weapon', 'misc'].includes(filter)) activeFilter = filter;
  activeView = 'cases';
  render();
}
function resetModal() { selectedCaseId = null; revealInProgress = false; revealedItem = null; }
function reveal(item) {
  if (!item || revealInProgress) return;
  if (state.balance + 0.000001 < item.price) {
    walletOpen = true;
    render();
    announce('Not enough demo coin. Add free test funds to try this case.');
    return;
  }
  state.balance = Math.round((state.balance - item.price) * 100) / 100;
  rollingDrop = chooseDrop(item);
  saveState();
  revealInProgress = true;
  revealedItem = null;
  render();
  window.setTimeout(() => {
    const drop = rollingDrop || chooseDrop(item);
    const wear = rollWear(drop.type);
    const date = new Date();
    const entry = {
      id: `${date.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      caseId: item.id,
      caseName: item.name,
      name: drop.name,
      type: drop.type,
      rarity: drop.rarity,
      chance: drop.chance,
      condition: wear?.condition,
      float: wear?.float,
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    entry.sellValue = Math.max(0.05, Number((item.price * ({ 'Mil-Spec': 0.22, Restricted: 0.55, Classified: 1.25, Covert: 3.5, Extraordinary: 8 }[drop.rarity] || 0.22)).toFixed(2)));
    state.inventory.push(entry);
    state.history = [entry, ...state.history].slice(0, 40);
    saveState();
    revealInProgress = false;
    revealedItem = entry;
    rollingDrop = null;
    render();
  }, 2100);
}
root.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'backdrop' && event.target !== target) return;
  if (action === 'view' || action === 'view-inventory') {
    activeView = action === 'view-inventory' ? 'inventory' : target.dataset.view;
    resetModal(); walletOpen = false; render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (action === 'filter') selectFilter(target.dataset.filter);
  else if (action === 'browse') { activeView = 'cases'; render(); document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  else if (action === 'inspect') { selectedCaseId = target.dataset.id; revealInProgress = false; revealedItem = null; walletOpen = false; render(); }
  else if (action === 'close-modal' || action === 'backdrop') { resetModal(); render(); }
  else if (action === 'open-case' || action === 'open-again') reveal(caseCatalog.find((item) => item.id === target.dataset.id));
  else if (action === 'sell-item') {
    const index = state.inventory.findIndex((entry) => entry.id === target.dataset.id);
    if (index >= 0) {
      const [entry] = state.inventory.splice(index, 1);
      const value = Math.max(0.05, Number(entry.sellValue) || 0.05);
      state.balance = Math.round((state.balance + value) * 100) / 100;
      saveState(); render(); announce(`Sold ${entry.name} for ${money.format(value)} demo OC.`);
    }
  } else if (action === 'sell-all') {
    const total = state.inventory.reduce((sum, entry) => sum + Math.max(0.05, Number(entry.sellValue) || 0.05), 0);
    state.inventory = [];
    state.balance = Math.round((state.balance + total) * 100) / 100;
    saveState(); render(); announce(`Sold all items for ${money.format(total)} demo OC.`);
  } else if (action === 'wallet') { walletOpen = !walletOpen; render(); }
  else if (action === 'top-up') {
    state.balance = Math.round((state.balance + TEST_COIN_GRANT) * 100) / 100;
    saveState(); walletOpen = false; render(); announce('+5,000 demo coins added. No real money involved.');
  } else if (action === 'reset-wallet') {
    state.balance = STARTER_BALANCE; saveState(); walletOpen = false; render(); announce('Demo wallet reset to the 1.00 starter balance.');
  } else if (action === 'clear-filters') { searchTerm = ''; activeFilter = 'all'; activeSort = 'featured'; render(); }
});
root.addEventListener('change', (event) => {
  if (event.target.matches('[data-sort]')) { activeSort = event.target.value; render(); }
});
root.addEventListener('input', (event) => {
  if (!event.target.matches('.search-box input')) return;
  const input = event.target;
  const position = input.selectionStart ?? input.value.length;
  searchTerm = input.value;
  render();
  const replacement = root.querySelector('.search-box input');
  replacement?.focus();
  replacement?.setSelectionRange(position, position);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && selectedCaseId) { resetModal(); render(); }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('.search-box input')?.focus(); }
});
render();

