import { type ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { Teach } from './pages/Teach';
import { Summary } from './pages/Summary';
import { Community } from './pages/Community';
import { Messages } from './pages/Messages';
import { Shop } from './pages/Shop';
import { Review } from './pages/Review';
import { Settings } from './pages/Settings';
import { Layout } from './components/Layout';
import { useStore } from './hooks/useStore';

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useStore();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-b-4 border-orange-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            element={(
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            )}
          >
            <Route path="/home" element={<Home />} />
            <Route path="/teach" element={<Teach />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/community" element={<Community />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/reviews" element={<Review />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
