export const metadata = {
  title: 'SocialForno — Post e immagini per ristoranti',
  description: 'Crea post e immagini per il tuo ristorante in pochi minuti.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F5F0E8', color: '#1A1A1A' }}>
        {children}
      </body>
    </html>
  );
}
