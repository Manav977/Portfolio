import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import Footer from './components/Footer/Footer';
import PageTransition from './components/PageTransition/PageTransition';
import { useTheme } from './hooks/useTheme';
import styles from './App.module.css';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Resume = lazy(() => import('./pages/Resume'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminPage = lazy(() => import('./admin/AdminPage'));

const pageTitles = {
  '/': 'Home',
  '/about': 'About',
  '/projects': 'Projects',
  '/resume': 'Resume',
  '/contact': 'Contact',
  '/admin': 'Admin'
};

function App() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const pageName = pageTitles[location.pathname] ?? 'Portfolio';
    document.title = `${pageName} | Manav Portfolio Studio`;
  }, [location.pathname]);

  return (
    <div className={styles.appShell} data-theme={theme}>
      <ScrollProgress />
      {!isAdminRoute ? <Navbar theme={theme} toggleTheme={toggleTheme} /> : null}
      <main className={isAdminRoute ? styles.adminMain : styles.main}>
        <PageTransition pathname={location.pathname}>
          <Suspense fallback={<div className={styles.loadingState}>Loading page...</div>}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/admin"
                element={<AdminPage theme={theme} toggleTheme={toggleTheme} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      {!isAdminRoute ? <Footer /> : null}
    </div>
  );
}

export default App;
