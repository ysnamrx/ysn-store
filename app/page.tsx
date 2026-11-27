import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Check, ChevronRight, CirclePlay, Instagram,
  MessageCircle, Package, ShoppingBag, Sparkles, Store, Truck, Zap,
} from "lucide-react";

const benefits = [
  { icon: Store, title: "Votre vitrine, à vous", text: "Un lien clair et professionnel à partager partout où vos clients vous découvrent." },
  { icon: Package, title: "Vos produits, bien présentés", text: "Photos, prix et disponibilité réunis dans un catalogue simple à mettre à jour." },
  { icon: ShoppingBag, title: "Vos ventes, mieux organisées", text: "Retrouvez votre activité au même endroit et gardez le fil de votre boutique." },
];

export default function HomePage() {
  return (
    <main className="landing" id="top">
      <header className="landing-header">
        <Link className="landing-brand" href="/" aria-label="YSN Store accueil"><span className="landing-brand-mark"><Store size={19} strokeWidth={2.4} /></span><span>ysn<span>store</span></span></Link>
        <nav className="landing-nav" aria-label="Navigation"><a href="#solution">La solution</a><a href="#comment">Comment ça marche</a><a href="#philosophie">Notre idée</a></nav>
        <div className="landing-header-actions"><Link className="landing-login" href="/dashboard">Se connecter</Link><Link className="landing-header-cta" href="/dashboard?register=1">Créer ma boutique <ArrowUpRight size={15} /></Link></div>
        <details className="landing-mobile-nav"><summary aria-label="Ouvrir le menu"><span></span><span></span></summary><div className="mobile-menu-panel"><a href="#solution">La solution</a><a href="#comment">Comment ça marche</a><a href="#philosophie">Notre idée</a><Link href="/dashboard">Se connecter</Link><Link className="mobile-menu-cta" href="/dashboard?register=1">Créer ma boutique <ArrowRight size={15} /></Link></div></details>
      </header>

      <section className="landing-hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="kicker-spark"><Sparkles size={13} /></span> FAIT POUR LES VENDEURS D’ICI</div>
            <h1>Vos ventes commencent sur les réseaux.<br /><span>Votre boutique aussi.</span></h1>
            <p className="hero-description">Créez une boutique en ligne simple, présentez vos produits et partagez un seul lien sur Instagram, Facebook ou WhatsApp.</p>
            <div className="hero-buttons"><Link className="hero-primary" href="/dashboard?register=1">Créer ma boutique <ArrowRight size={17} /></Link><a className="hero-secondary" href="#comment"><span className="play-circle"><CirclePlay size={18} /></span> Découvrir le fonctionnement</a></div>
            <div className="hero-proof"><div className="proof-avatars"><span>Y</span><span>N</span><span>A</span></div><p><strong>Simple dès le premier jour.</strong><br />Pensé pour vendre depuis son téléphone.</p></div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-one"></div><div className="visual-orbit orbit-two"></div>
            <div className="floating-note note-social"><span className="social-icon instagram"><Instagram size={16} /></span><span><strong>Partagez partout</strong><small>Un lien pour vos réseaux</small></span><ArrowUpRight size={15} /></div>
            <div className="store-window">
              <div className="window-top"><span className="window-dots"><i></i><i></i><i></i></span><div className="window-address"><span className="secure-dot"></span> ysn-store.app / nour</div><span className="window-menu">•••</span></div>
              <div className="shop-preview">
                <div className="preview-topline"><span>ATELIER NOUR</span><span>MENU&nbsp; ☰</span></div>
                <div className="preview-cover"><div className="cover-stamp">COLLECTION<br /><strong>ÉTÉ 26</strong></div><div className="cover-art"><span className="sun-disc"></span><span className="cover-leaf leaf-a"></span><span className="cover-leaf leaf-b"></span><span className="cover-vase"></span></div><div className="cover-caption"><span>LE BEAU<br />AU QUOTIDIEN</span><ArrowUpRight size={15} /></div></div>
                <div className="preview-products-head"><div><small>LA SÉLECTION</small><strong>Nos favoris</strong></div><span>Tout voir <ChevronRight size={13} /></span></div>
                <div className="preview-product-grid"><div className="preview-product"><div className="preview-product-art art-bag"><span>✦</span><i>◒</i></div><strong>Sac Lilia</strong><small>4 500 DA</small></div><div className="preview-product"><div className="preview-product-art art-ceramic"><span>◡</span><i>✳</i></div><strong>Vase Sable</strong><small>3 200 DA</small></div></div>
                <div className="preview-order"><span className="order-tick"><Check size={13} /></span><span><strong>Tout est prêt à partager</strong><small>Votre boutique, sur mobile</small></span><span className="order-share"><ArrowUpRight size={15} /></span></div>
              </div>
            </div>
            <div className="floating-note note-whatsapp"><span className="social-icon whatsapp"><MessageCircle size={16} /></span><span><strong>À votre image</strong><small>Votre nom, vos produits</small></span></div>
            <div className="hero-visual-caption"><span></span> UNE BOUTIQUE QUI VOUS RESSEMBLE</div>
          </div>
        </div>
        <div className="hero-bottom-line"><span>UNE PLATEFORME FAITE POUR VOTRE FAÇON DE VENDRE</span><ArrowRight size={14} /><span>DU LIEN SOCIAL À LA BOUTIQUE</span></div>
      </section>

      <section className="audience-strip" id="philosophie"><div className="audience-label">VOUS VENDEZ DÉJÀ SUR</div><div className="social-word"><Instagram size={18} /> Instagram</div><div className="social-word"><MessageCircle size={18} /> WhatsApp</div><div className="social-word"><span className="facebook-mark">f</span> Facebook</div><p>YSN Store vous aide à passer à l’étape suivante.</p></section>

      <section className="landing-section solution-section" id="solution">
        <div className="section-heading"><div className="section-overline"><span></span> LA SOLUTION YSN STORE</div><h2>Tout commence par un lien.<br /><em>Le vôtre.</em></h2><p>Pas besoin de refaire votre façon de vendre. Donnez-lui simplement un espace à elle.</p></div>
        <div className="benefit-grid">{benefits.map(({ icon: Icon, title, text }, index) => <article className="benefit-card" key={title}><div className={"benefit-icon benefit-icon-" + (index + 1)}><Icon size={19} /></div><div className="benefit-number">0{index + 1}</div><h3>{title}</h3><p>{text}</p><a href="#comment" aria-label={"En savoir plus : " + title}><ArrowUpRight size={16} /></a></article>)}</div>
      </section>

      <section className="philosophy-band">
        <div className="philosophy-decoration"><span>YSN</span><i></i></div>
        <div className="philosophy-content"><div className="section-overline light-overline"><span></span> NOTRE PHILOSOPHIE</div><h2>Le commerce en ligne<br />doit rester <em>à votre portée.</em></h2><p>On croit aux idées qui démarrent dans une conversation, à la première commande reçue sur WhatsApp, aux vendeurs qui font tout depuis leur téléphone. YSN Store est là pour leur donner les bons outils, sans compliquer le quotidien.</p><Link href="/dashboard?register=1" className="philosophy-link">C’est parti <ArrowRight size={16} /></Link></div>
        <div className="philosophy-side"><div className="side-quote-mark">“</div><p>Commencez simplement.<br /><strong>Grandissez à votre rythme.</strong></p><div className="side-quote-line"></div><small>YSN STORE · ALGÉRIE</small></div>
      </section>

      <section className="landing-section steps-section" id="comment"><div className="steps-heading"><div><div className="section-overline"><span></span> EN TROIS ÉTAPES</div><h2>De votre idée<br />à votre <em>boutique.</em></h2></div><p>Commencez avec l’essentiel. Ajoutez le reste au fil de vos besoins.</p></div>
        <div className="steps-grid"><article className="step-card"><div className="step-top"><span>01</span><div className="step-icon"><Store size={20} /></div></div><h3>Créez votre espace</h3><p>Choisissez le nom de votre boutique et préparez votre vitrine en quelques minutes.</p><div className="step-line"></div></article><article className="step-card"><div className="step-top"><span>02</span><div className="step-icon"><Package size={20} /></div></div><h3>Présentez vos produits</h3><p>Ajoutez vos articles, leurs photos, leurs prix et les détails que vos clients veulent voir.</p><div className="step-line"></div></article><article className="step-card"><div className="step-top"><span>03</span><div className="step-icon"><Zap size={20} /></div></div><h3>Partagez votre lien</h3><p>Ajoutez votre boutique à votre bio et envoyez-la directement à vos clients.</p><div className="step-line"></div></article></div>
      </section>

      <section className="local-note"><div className="local-icon"><Truck size={21} /></div><div><strong>Conçue pour votre réalité.</strong><p>Une expérience simple, mobile et pensée pour les vendeurs algériens.</p></div><div className="local-badge">DZ <span>✳</span></div></section>

      <section className="final-cta"><div className="cta-pattern"><i></i><i></i><i></i><i></i><i></i></div><div className="section-overline light-overline"><span></span> VOTRE PROCHAINE ÉTAPE</div><h2>Votre boutique peut<br />commencer <em>aujourd’hui.</em></h2><p>Faites le premier pas. On s’occupe de rendre la suite plus simple.</p><Link className="final-cta-button" href="/dashboard?register=1">Créer ma boutique <ArrowRight size={17} /></Link><div className="cta-foot"><Check size={14} /> Création simple <span></span> Accès depuis votre téléphone <span></span> Pensé pour l’Algérie</div></section>

      <footer className="landing-footer"><div className="footer-top"><Link className="landing-brand footer-brand" href="/"><span className="landing-brand-mark"><Store size={18} /></span><span>ysn<span>store</span></span></Link><p>Votre boutique en ligne.<br />À votre façon.</p><div className="footer-links"><a href="#solution">La solution</a><a href="#comment">Comment ça marche</a><Link href="/dashboard">Espace vendeur</Link></div><Link className="footer-backtop" href="#top">Retour en haut <ArrowUpRight size={15} /></Link></div><div className="footer-bottom"><span>© 2026 YSN Store</span><span>Fait pour les vendeurs d’ici <span className="footer-heart">♥</span></span><span>Algérie</span></div></footer>
    </main>
  );
}