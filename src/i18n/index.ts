import { tr } from './tr';
import { en } from './en';
import type { Dict, Lang } from './types';

export const dicts: Record<Lang, Dict> = { tr, en };
export const t = (lang: Lang): Dict => dicts[lang];

/** Prefixes a site path with the configured base and language. */
export function url(path: string, lang: Lang = 'tr'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${lang === 'en' ? 'en/' : ''}${clean}`;
}

export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** Languages offered in the picker. tr/en are native pages; the rest use Google Translate from English. */
export const LANGUAGES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'az', name: 'Azərbaycanca' },
  { code: 'ar', name: 'العربية' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'vi', name: 'Tiếng Việt' },
] as const;

export const BUY_URL = 'https://builtbybit.com/';
export const GITHUB_URL = 'https://github.com/plisquante/ThemisCode';
export const DISCORD_URL = 'https://discord.gg/';
