import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout   from './components/layout/AppLayout';
import Dashboard   from './pages/Dashboard';
import Bins        from './pages/Bins';
import Trucks      from './pages/Trucks';
import RoutesPage  from './pages/Routes';
import Analytics   from './pages/Analytics';
import Login       from './pages/Login';
import { useAuthStore } from './store/authStore';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 10_000 } } });

function Guard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Guard><AppLayout /></Guard>}>
            <Route index              element={<Dashboard  />} />
            <Route path="bins"        element={<Bins       />} />
            <Route path="trucks"      element={<Trucks     />} />
            <Route path="routes"      element={<RoutesPage />} />
            <Route path="analytics"   element={<Analytics  />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
