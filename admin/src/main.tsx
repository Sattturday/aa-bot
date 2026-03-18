import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Telegram WebView may not trigger CSS :focus — handle via JS
document.addEventListener('focusin', (e) => {
  const el = e.target as HTMLElement;
  if (el.classList.contains('input')) {
    el.classList.add('input-focused');
  }
});
document.addEventListener('focusout', (e) => {
  const el = e.target as HTMLElement;
  el.classList.remove('input-focused');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
