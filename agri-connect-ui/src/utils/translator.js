import { translateBatch } from '../services/api';

const STORAGE_KEY = 'site_lang';

function collectTranslatables(root = document) {
  return Array.from(root.querySelectorAll('.translatable'));
}

function ensureOriginal(el) {
  if (!el.dataset.originalText) {
    el.dataset.originalText = el.textContent || '';
  }
  return el.dataset.originalText;
}

async function translateElements(elems, target) {
  if (!elems || elems.length === 0) return;
  const texts = elems.map(ensureOriginal);
  const res = await translateBatch(texts, target);
  const translations = Array.isArray(res?.data?.translations) ? res.data.translations : [];
  elems.forEach((el, idx) => {
    const t = translations[idx];
    if (typeof t === 'string' && t.length > 0) {
      el.textContent = t;
    }
  });
}

let currentLang = 'en';
let observer = null;

export function getLanguage() {
  return currentLang;
}

export async function setLanguage(lang) {
  currentLang = lang || 'en';
  localStorage.setItem(STORAGE_KEY, currentLang);
  try {
    await translateElements(collectTranslatables(), currentLang);
  } catch (e) {
    // fail silently in UI
    console.error('translateElements failed', e);
  }
}

export function initTranslator() {
  try {
    currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
  } catch {}

  if (observer) return; // already initialized

  observer = new MutationObserver((mutations) => {
    const added = [];
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const el = node;
          if (el.classList && el.classList.contains('translatable')) {
            added.push(el);
          }
          el.querySelectorAll && added.push(...el.querySelectorAll('.translatable'));
        }
      });
    });
    if (added.length > 0 && currentLang && currentLang !== 'en') {
      translateElements(added, currentLang).catch((e) => console.error('observer translate failed', e));
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial translate if stored lang not English
  if (currentLang && currentLang !== 'en') {
    setTimeout(() => setLanguage(currentLang), 0);
  }
}
