import { ThemeProvider } from 'next-themes';
import Dashboard from './pages/Dashboard';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Dashboard />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
