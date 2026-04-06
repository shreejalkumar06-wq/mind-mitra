import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'MindMitra — Your Safe Space to Heal, Grow, and Thrive',
  description: 'A safe, confidential, and healing digital space for mental health support. Track your mood, meditate, journal, connect with others anonymously, and find your path to wellness.',
  keywords: 'mental health, wellness, mood tracking, meditation, therapy, anonymous chat, journaling, healing, MindMitra',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SmoothScroll>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
