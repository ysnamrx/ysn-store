"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, Bell, ChartNoAxesCombined, Check, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, ClipboardList, ExternalLink, Eye, Filter, Home, ImagePlus,
  Menu, MoreHorizontal, Package, Plus, Search, Settings, ShoppingBag, ShoppingCart,
  Sparkles, Store, Tag, Truck, Users, X,
} from "lucide-react";

type Product = { name: string; category: string; price: number; stock: number; status: "Actif" | "Brouillon"; color: string; icon: string };

const initialProducts: Product[] = [
  { name: "Sac en cuir artisanal", category: "Accessoires", price: 8500, stock: 12, status: "Actif", color: "sand", icon: "👜" },
  { name: "Coffret soin visage", category: "Beauté", price: 6200, stock: 8, status: "Actif", color: "rose", icon: "🧴" },
  { name: "Sneakers Urban One", category: "Mode", price: 11900, stock: 0, status: "Brouillon", color: "blue", icon: "👟" },
  { name: "Bougie Oud & Ambre", category: "Maison", price: 3200, stock: 24, status: "Actif", color: "olive", icon: "🕯️" },
];

const navGroups = [
  { title: "BOUTIQUE", items: [{ label: "Accueil", icon: Home }, { label: "Commandes", icon: ClipboardList, count: "4" }, { label: "Produits", icon: Package }, { label: "Clients", icon: Users }] },
  { title: "VENTE", items: [{ label: "Canaux de vente", icon: ShoppingBag }, { label: "Livraison", icon: Truck }] },
  { title: "ANALYSE", items: [{ label: "Statistiques", icon: ChartNoAxesCombined }] },
];

const formatPrice = (value: number) => new Intl.NumberFormat("fr-DZ").format(value) + " DA";

export default function HomePage() {
  const [products, setProducts] = useState(initialProducts);
  const [activeNav, setActiveNav] = useState("Accueil");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.price) return;
    setProducts((current) => [{ name: form.name.trim(), category: "Nouveau", price: Number(form.price), stock: Number(form.stock || 0), status: "Actif", color: "blue", icon: "✨" }, ...current]);
    setForm({ name: "", price: "", stock: "" });
    setModalOpen(false);
    notify("Produit ajouté à votre boutique");
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Store size={19} strokeWidth={2.5} /></div>
          <span className="brand-name">ysn<span>store</span></span>
          <button className="icon-button sidebar-close" aria-label="Fermer le menu" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>
        <button className="store-switcher" onClick={() => notify("Vous gérez la boutique Atelier Naya")}>
          <span className="store-avatar">AN</span><span className="store-switch-copy"><strong>Atelier Naya</strong><small>atelier-naya.ysn-store.com</small></span><ChevronDown size={16} />
        </button>
        <nav className="side-nav" aria-label="Navigation principale">
          {navGroups.map((group) => <div className="nav-group" key={group.title}>
            <p className="nav-caption">{group.title}</p>
            {group.items.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); setMobileNav(false); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}
            </button>)}
          </div>)}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => notify("Centre d’aide bientôt disponible")}><CircleHelp size={18} /><span>Aide</span></button>
          <button className="nav-item" onClick={() => notify("Paramètres bientôt disponibles")}><Settings size={18} /><span>Paramètres</span></button>
          <div className="profile-row"><div className="profile-avatar">YA</div><div className="profile-copy"><strong>Yacine A.</strong><small>Propriétaire</small></div><MoreHorizontal size={19} /></div>
        </div>
      </aside>

      {mobileNav && <button className="backdrop" aria-label="Fermer le menu" onClick={() => setMobileNav(false)} />}
      <section className="main-panel">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Ouvrir le menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Atelier Naya</span><ChevronRight size={15} /><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <button className="help-link" onClick={() => notify("Centre d’aide bientôt disponible")}><CircleHelp size={17} /><span>Besoin d’aide ?</span></button>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify("Vous êtes à jour")}><Bell size={18} /><i /></button>
            <button className="store-preview" onClick={() => notify("Aperçu de la boutique bientôt disponible")}><Eye size={16} /><span>Voir ma boutique</span><ExternalLink size={14} /></button>
          </div>
        </header>

        <div className="content-wrap">
          <div className="welcome-row">
            <div><div className="eyebrow"><span className="live-dot" /> VOTRE ESPACE BOUTIQUE</div><h1>Bonjour Yacine <span>✦</span></h1><p>Voici ce qui se passe dans votre boutique aujourd’hui.</p></div>
            <button className="primary-button" onClick={() => setModalOpen(true)}><Plus size={17} /> Ajouter un produit</button>
          </div>

          <div className="announcement"><div className="announce-icon"><Sparkles size={17} /></div><div><strong>Votre boutique prend forme</strong><p>Ajoutez vos premiers produits et partagez votre lien avec vos clients.</p></div><button onClick={() => setActiveNav("Produits")}>Découvrir <ArrowRight size={15} /></button><button className="announce-close" aria-label="Fermer" onClick={(e) => e.currentTarget.parentElement?.remove()}><X size={16} /></button></div>

          <section className="metrics-grid" aria-label="Résumé de la boutique">
            <article className="metric-card"><div className="metric-top"><span>Ventes totales</span><span className="metric-icon mint"><ShoppingCart size={17} /></span></div><strong className="metric-value">48 500 <small>DA</small></strong><div className="metric-foot"><span className="trend-up"><ArrowDown size={13} /> 12,8 %</span><span>par rapport au mois dernier</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Commandes</span><span className="metric-icon lavender"><ClipboardList size={17} /></span></div><strong className="metric-value">12</strong><div className="metric-foot"><span className="trend-up"><ArrowDown size={13} /> 8,2 %</span><span>par rapport au mois dernier</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Visites de la boutique</span><span className="metric-icon peach"><Eye size={17} /></span></div><strong className="metric-value">1 284</strong><div className="metric-foot"><span className="trend-up"><ArrowDown size={13} /> 16,4 %</span><span>par rapport au mois dernier</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Panier moyen</span><span className="metric-icon sky"><Tag size={17} /></span></div><strong className="metric-value">4 042 <small>DA</small></strong><div className="metric-foot"><span className="neutral-trend">Stable</span><span>sur les 30 derniers jours</span></div></article>
          </section>

          <div className="dashboard-columns">
            <section className="surface-card orders-card">
              <div className="card-heading"><div><h2>Commandes récentes</h2><p>Suivez les dernières commandes de vos clients.</p></div><button className="text-button" onClick={() => setActiveNav("Commandes")}>Toutes les commandes <ArrowRight size={15} /></button></div>
              <div className="table-scroll"><table><thead><tr><th>COMMANDE</th><th>CLIENT</th><th>DATE</th><th>STATUT</th><th>TOTAL</th><th /></tr></thead><tbody>
                <tr><td><strong>#YSN-1048</strong></td><td><div className="customer-cell"><span className="customer-avatar coral">SK</span>Sarah K.</div></td><td>Aujourd’hui, 10:42</td><td><span className="status-pill paid"><i /> Payée</span></td><td className="amount-cell">8 500 DA</td><td><ChevronRight size={16} /></td></tr>
                <tr><td><strong>#YSN-1047</strong></td><td><div className="customer-cell"><span className="customer-avatar blue-bg">MB</span>Mehdi B.</div></td><td>Aujourd’hui, 09:18</td><td><span className="status-pill pending"><i /> À confirmer</span></td><td className="amount-cell">6 200 DA</td><td><ChevronRight size={16} /></td></tr>
                <tr><td><strong>#YSN-1046</strong></td><td><div className="customer-cell"><span className="customer-avatar yellow-bg">LN</span>Lina N.</div></td><td>Hier, 17:06</td><td><span className="status-pill paid"><i /> Payée</span></td><td className="amount-cell">11 900 DA</td><td><ChevronRight size={16} /></td></tr>
                <tr><td><strong>#YSN-1045</strong></td><td><div className="customer-cell"><span className="customer-avatar green-bg">YA</span>Yasmine A.</div></td><td>Hier, 14:32</td><td><span className="status-pill shipped"><i /> Expédiée</span></td><td className="amount-cell">3 200 DA</td><td><ChevronRight size={16} /></td></tr>
              </tbody></table></div>
              <button className="mobile-all-orders" onClick={() => setActiveNav("Commandes")}>Voir toutes les commandes <ArrowRight size={15} /></button>
            </section>

            <section className="surface-card checklist-card">
              <div className="card-heading"><div><h2>Bien démarrer</h2><p>Les étapes pour lancer votre boutique.</p></div><span className="progress-count">2/4</span></div>
              <div className="progress-track"><span /></div>
              <div className="checklist">
                <div className="check-row complete"><span className="check-circle"><Check size={13} /></span><div><strong>Créer votre boutique</strong><small>Votre espace est prêt.</small></div></div>
                <button className="check-row" onClick={() => setModalOpen(true)}><span className="check-circle" /><div><strong>Ajouter votre premier produit</strong><small>Présentez ce que vous vendez.</small></div><ChevronRight size={16} /></button>
                <button className="check-row" onClick={() => notify("Personnalisation bientôt disponible")}><span className="check-circle" /><div><strong>Personnaliser votre boutique</strong><small>Ajoutez votre logo et vos couleurs.</small></div><ChevronRight size={16} /></button>
                <button className="check-row" onClick={() => notify("Lien copié : atelier-naya.ysn-store.com")}><span className="check-circle" /><div><strong>Partager votre boutique</strong><small>Invitez vos clients à la découvrir.</small></div><ChevronRight size={16} /></button>
              </div>
              <div className="checklist-foot"><span>Un coup de main ?</span><button onClick={() => notify("Notre équipe vous répond bientôt")}>Parler à notre équipe <ArrowRight size={14} /></button></div>
            </section>
          </div>

          <section className="surface-card products-card">
            <div className="card-heading products-heading"><div><h2>Vos produits</h2><p>Gérez votre catalogue en un seul endroit.</p></div><div className="product-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un produit" /></label><button className="filter-button" onClick={() => notify("Filtres bientôt disponibles")}><Filter size={16} /><span>Filtrer</span><ChevronDown size={14} /></button><button className="small-add" onClick={() => setModalOpen(true)}><Plus size={16} /><span>Ajouter</span></button></div></div>
            <div className="product-list">{filteredProducts.map((product, index) => <div className="product-row" key={product.name}><div className={`product-thumb ${product.color}`}>{product.icon}</div><div className="product-name"><strong>{product.name}</strong><small>{product.category}</small></div><div className="product-price">{formatPrice(product.price)}</div><div className={`stock-label ${product.stock === 0 ? "out-stock" : ""}`}>{product.stock === 0 ? "Épuisé" : `${product.stock} en stock`}</div><span className={`product-status ${product.status === "Actif" ? "status-active" : "status-draft"}`}><i />{product.status}</span><button className="icon-button row-more" aria-label={`Options pour ${product.name}`} onClick={() => notify(`Options : ${product.name}`)}><MoreHorizontal size={18} /></button></div>)}</div>
            {filteredProducts.length === 0 && <div className="empty-search">Aucun produit ne correspond à « {query} ».</div>}
            <div className="products-footer"><span>Affichage de <strong>{filteredProducts.length}</strong> produits sur <strong>{products.length}</strong></span><button onClick={() => setActiveNav("Produits")}>Gérer les produits <ArrowRight size={15} /></button></div>
          </section>
          <footer className="page-footer"><span>© 2026 YSN Store</span><span>Fait pour les vendeurs d’ici <span className="footer-heart">♥</span></span><button onClick={() => notify("Conditions bientôt disponibles")}>Conditions d’utilisation</button></footer>
        </div>
      </section>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}><section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="modal-icon"><ImagePlus size={19} /></span><div><h2 id="modal-title">Ajouter un produit</h2><p>Ajoutez un article à votre catalogue.</p></div></div><button className="icon-button" aria-label="Fermer" onClick={() => setModalOpen(false)}><X size={19} /></button></div><form onSubmit={addProduct}><label>Nom du produit<input autoFocus required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex. Sac en cuir artisanal" /></label><div className="form-two"><label>Prix (DA)<input required min="0" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="8500" /></label><label>Stock disponible<input min="0" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="10" /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Annuler</button><button type="submit" className="primary-button"><Plus size={16} /> Enregistrer le produit</button></div></form></section></div>}
      {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
    </main>
  );
}