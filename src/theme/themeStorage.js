// localStorage access for demo convenience only. Every call is client-side and failure-tolerant
// (private windows and blocked storage throw).
const CURRENT_KEY = 'aof.theme.current';
const SAVED_KEY = 'aof.theme.saved';

function read(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const themeStorage = {
  loadCurrent: () => read(CURRENT_KEY),
  saveCurrent: (theme) => write(CURRENT_KEY, theme),
  loadSaved: () => {
    const list = read(SAVED_KEY);
    return Array.isArray(list) ? list : [];
  },
  saveSaved: (list) => write(SAVED_KEY, list),
};
