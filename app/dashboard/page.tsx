"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  ArrowDown, ArrowRight, Bell, ChartNoAxesCombined, Check, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, ClipboardList, ExternalLink, Eye, Filter, Home, ImagePlus,
  Menu, MoreHorizontal, Package, Plus, Search, Settings, ShoppingBag, ShoppingCart,
  Sparkles, Store, Tag, Truck, Users, X,
} from "lucide-react";

type Product = { id?: string; name: string; category: string; price: number; stock: number; status: "Actif" | "Brouillon"; color: string; icon: string };
type Store = { id: string; name: string; slug: string; is_published: boolean };
type ProductRow = { id: string; name: string; category: string; price_dzd: number; stock: number; status: string };

const navGroups = [
  { title: "BOUTIQUE", items: [{ label: "Accueil", icon: Home }, { label: "Commandes", icon: ClipboardList, count: "0" }, { label: "Produits", icon: Package }, { label: "Clients", icon: Users }] },
  { title: "VENTE", items: [{ label: "Canaux de vente", icon: ShoppingBag }, { label: "Livraison", icon: Truck }] },
  { title: "ANALYSE", items: [{ label: "Statistiques", icon: ChartNoAxesCombined }] },
];

const formatPrice = (value: number) => new Intl.NumberFormat("fr-DZ").format(value) + " DA";

export default function HomePage() {
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeNav, setActiveNav] = useState("Accueil");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("register") === "1") setAuthMode("signup");
    const client = supabase;
    if (!client) {
      setAuthReady(true);
      return;
    }
    let mounted = true;
    const syncSession = async (session: Session | null) => {
      if (!mounted) return;
      const user = session?.user ?? null;
      setCurrentUser(user ? { id: user.id, email: user.email } : null);
      if (!user) {
        setStore(null);
        setProducts([]);
        setAuthReady(true);
        return;
      }
      const { data: ownedStore, error } = await client
        .from("stores")
        .select("id,name,slug,is_published")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (!mounted) return;
      if (error) setAuthMessage("Impossible de charger votre boutique. Réessayez.");
      setStore(ownedStore as Store | null);
      if (ownedStore) {
        const { data: rows } = await client
          .from("products")
          .select("id,name,category,price_dzd,stock,status")
          .eq("store_id", ownedStore.id)
          .order("created_at", { ascending: false });
        if (!mounted) return;
        setProducts(((rows ?? []) as ProductRow[]).map((row, index) => ({
          id: row.id,
          name: row.name,
          category: row.category || "Sans catégorie",
          price: Number(row.price_dzd),
          stock: row.stock,
          status: row.status === "active" ? "Actif" : "Brouillon",
          color: ["sand", "rose", "blue", "olive"][index % 4],
          icon: "📦",
        })));
      } else {
        setProducts([]);
      }
      setAuthReady(true);
    };
    client.auth.getSession().then(({ data }) => syncSession(data.session));
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      void syncSession(session);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setAuthMessage("La connexion Supabase n’est pas configurée.");
      return;
    }
    setBusy(true);
    setAuthMessage("");
    const result = authMode === "signup"
      ? await supabase.auth.signUp({ email: authForm.email, password: authForm.password })
      : await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password });
    setBusy(false);
    if (result.error) {
      setAuthMessage(result.error.message);
    } else if (authMode === "signup" && !result.data.session) {
      setAuthMessage("Compte créé. Vérifiez votre e-mail pour confirmer votre inscription.");
    }
  }

  async function createStore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !currentUser || !storeName.trim() || !storeSlug.trim()) return;
    setBusy(true);
    setAuthMessage("");
    const { data, error } = await supabase.from("stores")
      .insert({ owner_id: currentUser.id, name: storeName.trim(), slug: storeSlug.trim().toLowerCase() })
      .select("id,name,slug,is_published")
      .single();
    setBusy(false);
    if (error) {
      setAuthMessage(error.code === "23505" ? "Ce lien de boutique est déjà utilisé. Choisissez-en un autre." : "Création impossible. Vérifiez le nom et le lien de votre boutique.");
      return;
    }
    setStore(data as Store);
    setProducts([]);
  }

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.price || !supabase || !store) return;
    setBusy(true);
    const { data, error } = await supabase.from("products").insert({
      store_id: store.id,
      name: form.name.trim(),
      category: "Nouveau",
      price_dzd: Number(form.price),
      stock: Number(form.stock || 0),
      status: "active",
    }).select("id,name,category,price_dzd,stock,status").single();
    setBusy(false);
    if (error || !data) {
      notify("Le produit n’a pas pu être enregistré.");
      return;
    }
    const row = data as ProductRow;
    setProducts((current) => [{ id: row.id, name: row.name, category: row.category || "Nouveau", price: Number(row.price_dzd), stock: row.stock, status: "Actif", color: "blue", icon: "✨" }, ...current]);
    setForm({ name: "", price: "", stock: "" });
    setModalOpen(false);
    notify("Produit enregistré dans votre boutique");
  }

  if (!authReady) return <main className="gate-page"><div className="gate-card"><div className="brand-mark"><Store size={19} /></div><p>Chargement de votre espace…</p></div></main>;

  if (!currentUser) return (
    <main className="gate-page">
      <section className="gate-card">
        <div className="gate-brand"><div className="brand-mark"><Store size={19} /></div><span className="brand-name">ysn<span>store</span></span></div>
        <div className="gate-eyebrow">VOTRE BOUTIQUE EN LIGNE</div>
        <h1>{authMode === "signin" ? "Content de vous revoir" : "Créez votre espace vendeur"}</h1>
        <p className="gate-intro">Gérez vos produits et développez votre boutique avec YSN Store.</p>
        <form className="gate-form" onSubmit={handleAuth}>
          <label>Adresse e-mail<input type="email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="vous@exemple.com" /></label>
          <label>Mot de passe<input type="password" required minLength={8} value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="8 caractères minimum" /></label>
          {authMessage && <div className="gate-message">{authMessage}</div>}
          <button className="primary-button gate-submit" disabled={busy}>{busy ? "Veuillez patienter…" : authMode === "signin" ? "Se connecter" : "Créer mon compte"} <ArrowRight size={16} /></button>
        </form>
        <div className="gate-switch">{authMode === "signin" ? "Vous n’avez pas encore de compte ?" : "Vous avez déjà un compte ?"} <button onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setAuthMessage(""); }}>{authMode === "signin" ? "Créer un compte" : "Se connecter"}</button></div>
        <small className="gate-note">En continuant, vous acceptez les conditions d’utilisation de YSN Store.</small>
      </section>
    </main>
  );

  if (!store) return (
    <main className="gate-page">
      <section className="gate-card">
        <div className="gate-brand"><div className="brand-mark"><Store size={19} /></div><span className="brand-name">ysn<span>store</span></span></div>
        <div className="gate-eyebrow">ÉTAPE 1 SUR 1</div>
        <h1>Créez votre boutique</h1>
        <p className="gate-intro">Choisissez son nom et son lien. Vous pourrez les modifier plus tard.</p>
        <form className="gate-form" onSubmit={createStore}>
          <label>Nom de la boutique<input required minLength={2} maxLength={80} value={storeName} onChange={(e) => { setStoreName(e.target.value); setStoreSlug(e.target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} placeholder="Ex. Atelier Naya" /></label>
          <label>Adresse de la boutique<div className="slug-field"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={storeSlug} onChange={(e) => setStoreSlug(e.target.value.toLowerCase())} placeholder="atelier-naya" /><span>.ysn-store.vercel.app</span></div></label>
          {authMessage && <div className="gate-message">{authMessage}</div>}
          <button className="primary-button gate-submit" disabled={busy}>{busy ? "Création…" : "Créer ma boutique"} <ArrowRight size={16} /></button>
        </form>
      </section>
    </main>
  );

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Store size={19} strokeWidth={2.5} /></div>
          <span className="brand-name">ysn<span>store</span></span>
          <button className="icon-button sidebar-close" aria-label="Fermer le menu" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>
        <button className="store-switcher" onClick={() => notify(store.is_published ? "Votre boutique est publiée" : "Votre boutique est en préparation")}>
          <span className="store-avatar">{store.name.slice(0, 2).toUpperCase()}</span><span className="store-switch-copy"><strong>{store.name}</strong><small>{store.slug}.ysn-store.vercel.app</small></span><ChevronDown size={16} />
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
          <div className="profile-row"><div className="profile-avatar">{(currentUser.email ?? "YS").slice(0, 2).toUpperCase()}</div><div className="profile-copy"><strong>{currentUser.email ?? "Vendeur"}</strong><small>Propriétaire</small></div><button className="logout-button" onClick={() => supabase?.auth.signOut()}>Déconnexion</button></div>
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
            <article className="metric-card"><div className="metric-top"><span>Ventes totales</span><span className="metric-icon mint"><ShoppingCart size={17} /></span></div><strong className="metric-value">0 <small>DA</small></strong><div className="metric-foot"><span>Aucune vente enregistrée</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Commandes</span><span className="metric-icon lavender"><ClipboardList size={17} /></span></div><strong className="metric-value">0</strong><div className="metric-foot"><span>Aucune commande enregistrée</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Visites de la boutique</span><span className="metric-icon peach"><Eye size={17} /></span></div><strong className="metric-value">0</strong><div className="metric-foot"><span>Le suivi arrive bientôt</span></div></article>
            <article className="metric-card"><div className="metric-top"><span>Panier moyen</span><span className="metric-icon sky"><Tag size={17} /></span></div><strong className="metric-value">0 <small>DA</small></strong><div className="metric-foot"><span>Calculé après vos ventes</span></div></article>
          </section>

          <div className="dashboard-columns">
            <section className="surface-card orders-card">
              <div className="card-heading"><div><h2>Commandes récentes</h2><p>Suivez les dernières commandes de vos clients.</p></div><button className="text-button" onClick={() => setActiveNav("Commandes")}>Toutes les commandes <ArrowRight size={15} /></button></div>
              <div className="table-scroll"><table><thead><tr><th>COMMANDE</th><th>CLIENT</th><th>DATE</th><th>STATUT</th><th>TOTAL</th><th /></tr></thead><tbody><tr><td colSpan={6} className="orders-empty">Vos commandes apparaîtront ici dès votre première vente.</td></tr></tbody></table></div>
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