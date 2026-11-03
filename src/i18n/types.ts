export type Lang = 'tr' | 'en';

export interface Feature { icon: string; title: string; body: string }
export interface Row { label: string; themis: string; typical: string }
export interface Faq { q: string; a: string }
export interface DocSection { id: string; title: string; html: string }

export interface Dict {
  meta: { title: string; description: string };
  nav: { features: string; demo: string; developers: string; pricing: string; docs: string; buy: string; language: string; menu: string };
  lang: { label: string; translated: string; original: string };
  ticker: string[];
  hero: { pill: string; pillHref: string; title: string; lead: string; cta: string; demo: string; stats: { value: string; label: string }[] };
  demo: {
    title: string; lead: string; placeholder: string; run: string; reset: string; chips: string[];
    tabs: { screen: string; stream: string; discord: string };
    screenIdle: string; streamIdle: string; discordIdle: string; hint: string;
  };
  features: { title: string; lead: string; items: Feature[] };
  ladder: { title: string; lead: string; offence: string; reset: string; template: string; steps: { label: string; detail: string }[]; current: string };
  dev: { title: string; lead: string; docs: string; copy: string; copied: string; points: { title: string; body: string }[] };
  compare: { title: string; lead: string; themis: string; typical: string; rows: Row[] };
  install: { title: string; lead: string; steps: { title: string; body: string }[] };
  pricing: { title: string; lead: string; price: string; per: string; buy: string; note: string; includes: string[]; faqTitle: string; faq: Faq[] };
  footer: { tagline: string; product: string; resources: string; legal: string; license: string; changelog: string; support: string; rights: string };
  docs: { title: string; lead: string; toc: string; back: string; sections: DocSection[] };
}
