import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { TradingProvider } from '@/context/TradingContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AppRoutes from '@/routes/AppRoutes';

const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

const App = () => (
  <BrowserRouter basename={basename}>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <TradingProvider>
            <AppRoutes />
          </TradingProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
