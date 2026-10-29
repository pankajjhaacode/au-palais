import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import '../styles/global.css';

// Demo tooling (theme studio) is on in development and in `pnpm build:demo` builds only.
const demo = import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true';
const locale = window.location.pathname.startsWith('/fr') ? 'fr' : 'en';

createRoot(document.getElementById('root')).render(<App locale={locale} demo={demo} />);
