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

export const THEMES = [
  { id: 'themis', name: 'Themis' },
  { id: 'parchment', name: 'Parchment' },
  { id: 'marble', name: 'Marble' },
  { id: 'laurel', name: 'Laurel' },
  { id: 'bronze', name: 'Bronze' },
  { id: 'tokyo-night', name: 'Tokyo Night' },
  { id: 'gruvbox', name: 'Gruvbox' },
  { id: 'nord', name: 'Nord' },
  { id: 'latte', name: 'Catppuccin Latte' },
] as const;

export const BUY_URL = 'https://builtbybit.com/';
export const GITHUB_URL = 'https://github.com/plisquante/ThemisCode';
export const DISCORD_URL = 'https://discord.gg/';
