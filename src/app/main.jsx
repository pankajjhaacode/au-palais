import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { parsePath } from './routes.js';
import '../styles/global.css';

const { locale } = parsePath(window.location.pathname);

createRoot(document.getElementById('root')).render(<App locale={locale} />);
