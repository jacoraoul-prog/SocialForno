export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>
          Social<span style={{ color: '#FF6B35' }}>Forno</span>
        </h1>
        <a href="#inizia" style={{ background: '#FF6B35', color: 'white', padding: '12px 24px', borderRadius: 24, textDecoration: 'none', fontWeight: 600 }}>
          Inizia
        </a>
      </header>

      <section style={{ textAlign: 'center', marginBottom: 60 }}>
        <h2 style={{ fontSize: 40, lineHeight: 1.2 }}>Crea post e immagini per il tuo ristorante in pochi minuti</h2>
        <p style={{ fontSize: 18, opacity: 0.8 }}>Genera didascalie e foto professionali per Instagram, Facebook e Google con l’intelligenza artificiale.</p>
      </section>

      <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <img src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80" alt="Pizza" style={{ width: '100%', height: 400, objectFit: 'cover' }} />
        <div style={{ padding: 24 }}>
          <span style={{ background: '#FF6B35', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 14 }}>Demo</span>
          <h3 style={{ fontSize: 28, margin: '12px 0 8px' }}>Margherita del forno</h3>
          <p>Oggi dal forno esce la Margherita. Impasto a lunga lievitazione, pomodoro San Marzano, fior di latte e basilico.</p>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 60, opacity: 0.6 }}>SocialForno – Demo</p>
    </main>
  );
}
