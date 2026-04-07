import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'MEDICOPLACE — Votre Plateforme de Santé',
  description: 'Consultations médicales, pharmacie en ligne, téléconsultation et bien plus. MEDICOPLACE, la plateforme de santé de confiance.',
  robots: {
    index: true,
    follow: true,
    noarchive: true,
  },
  other: {
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-16 lg:pt-20">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
