import { demoStrings, type DemoStrings } from '../i18n/demo';

type Type = 'ban' | 'mute' | 'warn' | 'kick' | 'note';
type Status = 'active' | 'revoked' | 'expired';
interface Punishment {
  id: number; code: string; type: Type; target: string; ip: string; ipBased: boolean; reason: string;
  issuer: string; created: number; expires: number | null; silent: boolean; status: Status;
  template?: string; step?: number; revokedBy?: string;
}
interface Player { name: string; uuid: string; ip: string; online: boolean }
type Part = [cls: string, text: string, title?: string];

const LADDERS: Record<string, [Type, string | null][]> = {
  spam: [['warn', '7d'], ['mute', '30m'], ['mute', '2h'], ['mute', '1d'], ['ban', '3d']],
  toxicity: [['warn', '14d'], ['mute', '1h'], ['mute', '1d'], ['ban', '7d'], ['ban', '30d']],
  advertising: [['mute', '1d'], ['ban', '7d'], ['ban', null]],
  cheating: [['ban', '30d'], ['ban', null]],
};
const LADDER_REASON: Record<string, Record<'tr' | 'en', string>> = {
  spam: { tr: 'Spam', en: 'Spamming' },
  toxicity: { tr: 'Toksik davranış', en: 'Toxic behaviour' },
  advertising: { tr: 'Reklam', en: 'Advertising' },
  cheating: { tr: 'Hileli istemci', en: 'Modified client' },
};
const COMMANDS = ['/ban', '/tempban', '/ipban', '/mute', '/tempmute', '/ipmute', '/warn', '/kick', '/note', '/unban', '/unmute',
  '/unwarn', '/punish', '/history', '/check', '/alts', '/case', '/themis', '/help'];
const UNITS: Record<string, number> = { y: 31536000, mo: 2592000, w: 604800, d: 86400, h: 3600, m: 60, s: 1 };
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

const parseDuration = (s: string): number | null => {
  const t = s.toLowerCase();
  if (!/^(\d+(mo|y|w|d|h|m|s))+$/.test(t)) return null;
  let total = 0;
  for (const m of t.matchAll(/(\d+)(mo|y|w|d|h|m|s)/g)) total += Number(m[1]) * UNITS[m[2]];
  return total > 0 ? total : null;
};
const isPerm = (s: string) => ['perm', 'permanent', 'forever', 'kalici', 'kalıcı'].includes(s.toLowerCase());
const fmt = (sec: number, max = 3) => {
  const out: string[] = [];
  for (const [u, v] of Object.entries(UNITS)) {
    if (out.length >= max) break;
    const n = Math.floor(sec / v);
    if (n > 0) { out.push(n + u); sec -= n * v; }
  }
  return out.join(' ') || '0s';
};
const code = () => Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

export function mountDemo(root: HTMLElement) {
  const lang = (root.dataset.lang === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const S: DemoStrings = demoStrings[lang] as DemoStrings;
  const log = root.querySelector<HTMLOListElement>('.log')!;
  const input = root.querySelector<HTMLInputElement>('.prompt input')!;
  const form = root.querySelector<HTMLFormElement>('.prompt')!;
  const screen = root.querySelector<HTMLElement>('[data-pane="screen"]')!;
  const stream = root.querySelector<HTMLElement>('[data-pane="stream"]')!;
  const discord = root.querySelector<HTMLElement>('[data-pane="discord"]')!;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const idle = { screen: screen.innerHTML, stream: stream.innerHTML, discord: discord.innerHTML };

  let players: Record<string, Player>;
  let list: Punishment[];
  let nextId: number;
  let history: string[] = [];
  let hIndex = -1;
  const clock = () => Date.now();

  const reset = () => {
    players = {
      steve: { name: 'Steve', uuid: '5627dd98-e6be-3c21-b8a8-e92344183641', ip: '84.12.33.7', online: true },
      alex: { name: 'Alex', uuid: '6ab43178-89fd-4905-97f6-0f67d9d76fd9', ip: '84.12.33.7', online: true },
      notch: { name: 'Notch', uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5', ip: '91.4.2.18', online: true },
      jeb_: { name: 'jeb_', uuid: '853c80ef-3c37-49fd-aa49-938b674adae6', ip: '77.1.9.3', online: true },
    };
    list = [];
    nextId = 4180;
    log.textContent = '';
    screen.innerHTML = idle.screen;
    stream.innerHTML = idle.stream;
    discord.innerHTML = idle.discord;
    line([['muted', S.welcome]]);
  };

  // ---------------------------------------------------------------- output
  const el = (tag: string, cls?: string, text?: string) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  function line(parts: Part[], prefix = true, kind = '') {
    const li = el('li', kind);
    if (prefix) { li.append(el('span', 'accent', '⚖'), el('span', 'muted', ' » ')); }
    for (const [cls, text, title] of parts) {
      const s = el('span', cls, text);
      if (title) { s.title = title; s.classList.add('has-tip'); }
      li.append(s);
    }
    log.append(li);
    while (log.children.length > 120) log.firstElementChild?.remove();
    log.scrollTop = log.scrollHeight;
  }
  const echo = (cmd: string) => line([['cmd', '> ' + cmd]], false, 'echo');
  const err = (text: string) => line([['bad', text]]);

  const typeName = (t: Type) => S.types[t];
  const durationText = (p: Punishment) => p.type === 'ban' || p.type === 'mute' || p.type === 'warn'
    ? (p.expires === null ? S.permanent : fmt((p.expires - p.created) / 1000)) : '—';
  const remaining = (p: Punishment) => p.expires === null ? S.permanent : fmt(Math.max(0, (p.expires - clock()) / 1000), 2);
  const statusOf = (p: Punishment): Status => p.status === 'active' && p.expires !== null && p.expires <= clock() ? 'expired' : p.status;
  const timed = (t: Type) => t === 'ban' || t === 'mute' || t === 'warn';
  const active = (name: string, type: Type) => list.find((p) => p.type === type && statusOf(p) === 'active'
    && (p.target === name || (p.ipBased && p.ip === players[name.toLowerCase()]?.ip)));
  const tip = (p: Punishment) => `${typeName(p.type)} · ${S[statusOf(p)]}\n${S.reason}: ${p.reason}\n${S.by}: ${p.issuer}\n${S.length}: ${durationText(p)}`;

  // ---------------------------------------------------------------- side panes
  function json(p: Punishment) {
    return {
      id: p.id, code: p.code, type: p.type, status: statusOf(p), target: { name: p.target, ip: p.ip.replace(/\.\d+\.\d+$/, '.x.x'), ip_based: p.ipBased },
      issuer: { name: p.issuer, type: 'player' }, reason: p.reason, created_at: new Date(p.created).toISOString(),
      expires_at: p.expires ? new Date(p.expires).toISOString() : null, permanent: timed(p.type) && p.expires === null,
      silent: p.silent, server_origin: 'survival', template: p.template ? { key: p.template, step: p.step } : null,
    };
  }
  function emit(event: string, p: Punishment) {
    if (stream.querySelector('.idle')) stream.textContent = '';
    const frame = el('div', 'frame');
    frame.append(el('div', 'ev', `event: ${event}`), el('pre', 'data', 'data: ' + JSON.stringify({ type: event, punishment: json(p) }, null, 2)));
    stream.prepend(frame);
    while (stream.children.length > 6) stream.lastElementChild?.remove();
    flash('stream');
    if (!p.silent || event !== 'punishment.issued') embed(event, p);
  }
  function embed(event: string, p: Punishment) {
    if (discord.querySelector('.idle')) discord.textContent = '';
    const card = el('article', `embed t-${event === 'punishment.revoked' ? 'revoked' : p.type}`);
    const verb = event === 'punishment.revoked' ? S.revoked : typeName(p.type);
    const head = el('div', 'e-head');
    head.append(el('span', 'e-bot', 'Themis'), el('span', 'e-tag', 'BOT'));
    card.append(head, el('h4', 'e-title', `${p.target} · ${verb}`));
    const fields = el('dl', 'e-fields');
    const add = (k: string, v: string) => { const d = el('div'); d.append(el('dt', '', k), el('dd', '', v)); fields.append(d); };
    add(S.reason, p.reason);
    add(S.by, event === 'punishment.revoked' ? (p.revokedBy ?? '') : p.issuer);
    if (timed(p.type)) add(S.length, durationText(p));
    add(S.case, '#' + p.code);
    card.append(fields, el('p', 'e-foot', `Themis · survival · ${new Date().toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`));
    discord.prepend(card);
    while (discord.children.length > 4) discord.lastElementChild?.remove();
    flash('discord');
  }
  function show(kind: 'ban' | 'kick' | 'chat', p: Punishment | null, lines: [string, string][] = []) {
    screen.textContent = '';
    if (kind === 'chat') {
      const box = el('div', 'mc-chat');
      box.append(el('p', 'mc-label', S.chatOf(p?.target ?? '')));
      for (const [cls, text] of lines) box.append(el('p', cls, text));
      screen.append(box);
    } else if (p) {
      const box = el('div', 'mc-screen');
      box.append(el('p', 'mc-dis', S.disconnected), el('p', 'mc-title', '⚖  THEMIS'));
      if (kind === 'ban') {
        box.append(el('p', 'mc-lead', S.screenBan[0]));
        const dl = el('dl');
        const add = (k: string, v: string, cls = '') => { const d = el('div'); d.append(el('dt', '', k), el('dd', cls, v)); dl.append(d); };
        add(S.screenBan[1], p.reason);
        add(S.screenBan[2], p.expires === null ? S.permanent : new Date(p.expires).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }));
        add(S.screenBan[3], '#' + p.code, 'gold');
        box.append(dl, el('p', 'mc-appeal', S.screenBan[4]));
      } else {
        box.append(el('p', 'mc-lead', S.screenKick[0]));
        const dl = el('dl');
        const d = el('div'); d.append(el('dt', '', S.screenKick[1]), el('dd', '', p.reason)); dl.append(d);
        box.append(dl);
      }
      screen.append(box);
    }
    flash('screen');
  }
  function flash(pane: string) {
    const tab = tabs.find((x) => x.dataset.tab === pane);
    if (tab && tab.getAttribute('aria-selected') !== 'true') tab.classList.add('ping');
  }

  // ---------------------------------------------------------------- actions
  function issue(type: Type, name: string, seconds: number | null, reason: string, opts: { silent: boolean; ip: boolean; replace: boolean; template?: string; step?: number }) {
    const pl = players[name.toLowerCase()];
    if (!pl) return err(S.neverJoined(name));
    const r = reason || S.defaultReasons[type];
    if (type === 'ban' || type === 'mute') {
      const existing = active(pl.name, type);
      if (existing) {
        if (!opts.replace) return line([['text', S.already(pl.name, typeName(type), existing.code)]]);
        existing.status = 'revoked'; existing.revokedBy = 'Themis';
      }
    }
    const p: Punishment = {
      id: nextId++, code: code(), type, target: pl.name, ip: pl.ip, ipBased: opts.ip, reason: r, issuer: S.you,
      created: clock(), expires: timed(type) && seconds !== null ? clock() + seconds * 1000 : null, silent: opts.silent,
      status: 'active', template: opts.template, step: opts.step,
    };
    list.push(p);
    const msg = S.issued[type](pl.name, S.you, durationText(p), r);
    line([...(opts.silent || type === 'note' ? [['muted', S.silent] as Part] : []), ['text', msg]]);
    line([['good', S.done + ' '], ['muted', S.case + ' '], ['gold link', '#' + p.code, tip(p)]]);
    emit('punishment.issued', p);
    if (type === 'ban' || type === 'kick') {
      const victims = Object.values(players).filter((x) => x.name === pl.name || (opts.ip && x.ip === pl.ip));
      victims.forEach((v) => (v.online = false));
      show(type, p);
      if (type === 'ban') {
        const alt = Object.values(players).find((x) => x.online && x.ip === pl.ip && x.name !== pl.name);
        if (alt) line([['gold', S.altAlert(alt.name, pl.name)]]);
      }
    } else if (type === 'mute') {
      show('chat', p, [['mc-msg', `<${pl.name}> ...`], ['mc-bad', p.expires === null ? S.selfMutedPerm(r, p.code) : S.selfMuted(r, remaining(p), p.code)]]);
    } else if (type === 'warn') {
      show('chat', p, [['mc-gold', S.warnedYou(S.you, r)]]);
    }
  }

  function revoke(type: Type, ref: string, reason: string) {
    let p: Punishment | undefined;
    if (ref.startsWith('#')) {
      p = list.find((x) => x.code === ref.slice(1).toUpperCase() && (x.type === type || (type === 'warn' && x.type === 'note')));
      if (!p) return err(S.caseNotFound(ref));
    } else {
      const pl = players[ref.toLowerCase()];
      if (!pl) return err(S.neverJoined(ref));
      p = type === 'warn' ? [...list].reverse().find((x) => x.type === 'warn' && x.target === pl.name && statusOf(x) === 'active') : active(pl.name, type);
    }
    if (!p || statusOf(p) !== 'active') return line([['text', S.noActive(p?.target ?? ref, typeName(type))]]);
    p.status = 'revoked';
    p.revokedBy = S.you;
    const fn = S.revoked[type as 'ban' | 'mute' | 'warn'];
    line([['text', fn(p.target)]]);
    emit('punishment.revoked', p);
    if (type === 'ban') Object.values(players).forEach((x) => { if (x.name === p!.target || (p!.ipBased && x.ip === p!.ip)) x.online = true; });
    if (type === 'mute') show('chat', p, [['mc-good', S.canChat]]);
  }

  function historyOf(name: string) {
    const pl = players[name.toLowerCase()];
    if (!pl) return err(S.neverJoined(name));
    const items = list.filter((p) => p.target === pl.name).reverse();
    if (!items.length) return line([['muted', S.clean(pl.name)]]);
    line([['text', S.historyHead(pl.name, items.length)]]);
    for (const p of items) {
      const st = statusOf(p);
      const icon = st === 'active' ? ['good', '●'] : st === 'expired' ? ['muted', '○'] : ['bad', '✕'];
      line([[icon[0], ' ' + icon[1] + ' '], ['gold link', '#' + p.code, tip(p)], ['text', ' ' + typeName(p.type)], ['muted', ' ' + durationText(p) + ' '], ['text', p.reason]], false);
    }
  }

  function check(name: string) {
    const pl = players[name.toLowerCase()];
    if (!pl) return err(S.neverJoined(name));
    const ban = active(pl.name, 'ban');
    const mute = active(pl.name, 'mute');
    const count = (t: Type) => list.filter((p) => p.target === pl.name && p.type === t).length;
    const alts = Object.values(players).filter((x) => x.ip === pl.ip && x.name !== pl.name);
    line([['text', S.checkHead(pl.name)]]);
    line([['muted', `  ${S.status.padEnd(9)} `], ban ? ['bad', `${S.statusBanned} (#${ban.code}, ${remaining(ban)})`]
      : mute ? ['gold', `${S.statusMuted} (#${mute.code}, ${remaining(mute)})`] : ['good', S.statusClean]], false);
    line([['muted', `  ${S.record.padEnd(9)} `], ['text', `${count('ban')} ${S.types.ban} · ${count('mute')} ${S.types.mute} · ${count('warn')} ${S.types.warn} · ${count('kick')} ${S.types.kick}`]], false);
    line([['muted', `  ${S.ip.padEnd(9)} `], ['text', pl.ip.replace(/\.\d+\.\d+$/, '.x.x')]], false);
    line([['muted', `  ${S.alts.padEnd(9)} `], ['text', alts.length ? alts.map((a) => a.name).join(', ') : '0']], false);
  }

  function alts(name: string) {
    const pl = players[name.toLowerCase()];
    if (!pl) return err(S.neverJoined(name));
    const others = Object.values(players).filter((x) => x.ip === pl.ip && x.name !== pl.name);
    if (!others.length) return line([['muted', S.noAlts(pl.name)]]);
    line([['text', S.altsHead(pl.name)]]);
    for (const a of others) {
      const cls = active(a.name, 'ban') ? 'bad' : active(a.name, 'mute') ? 'gold' : 'text';
      line([['muted', '  • '], [cls, a.name]], false);
    }
  }

  function caseOf(ref?: string) {
    const p = ref ? list.find((x) => x.code === ref.replace('#', '').toUpperCase()) : list[list.length - 1];
    if (!p) return line([['muted', ref ? S.caseNotFound(ref) : S.noCase]]);
    line([['text', `${S.case} `], ['gold', '#' + p.code], ['muted', ` · ${typeName(p.type)} · ${S[statusOf(p)]}`]]);
    line([['muted', `  ${S.reason.padEnd(8)} `], ['text', p.reason]], false);
    line([['muted', `  ${S.by.padEnd(8)} `], ['text', p.issuer]], false);
    line([['muted', `  ${S.length.padEnd(8)} `], ['text', durationText(p)]], false);
  }

  function punish(name: string, key: string) {
    const pl = players[name.toLowerCase()];
    if (!pl) return err(S.neverJoined(name));
    const ladder = LADDERS[key?.toLowerCase()];
    if (!ladder) return err(S.unknownTemplate(key ?? ''));
    const offences = list.filter((p) => p.target === pl.name && p.template === key.toLowerCase() && !(p.status === 'revoked' && p.revokedBy !== 'Themis')).length;
    const step = Math.min(offences, ladder.length - 1);
    const [type, dur] = ladder[step];
    issue(type, pl.name, dur ? parseDuration(dur) : null, LADDER_REASON[key.toLowerCase()][lang], { silent: false, ip: false, replace: true, template: key.toLowerCase(), step });
  }

  // ---------------------------------------------------------------- dispatcher
  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    echo(cmd);
    history.unshift(cmd);
    history = history.slice(0, 50);
    hIndex = -1;
    const parts = cmd.replace(/^\//, '').split(/\s+/);
    const name = parts[0].toLowerCase();
    const flags = new Set(parts.filter((p) => /^-(s|p|ip|r)$/i.test(p)).map((p) => p.toLowerCase()));
    const args = parts.slice(1).filter((p) => !/^-(s|p|ip|r)$/i.test(p));
    const opts = { silent: flags.has('-s'), ip: flags.has('-ip'), replace: flags.has('-r') };

    const punishCmd = (type: Type, needDur: boolean, forceIp = false) => {
      if (!args[0]) return err(S.usage(`/${name} <player> ${needDur ? '<duration>' : '[duration]'} [reason] [-s] [-ip] [-r]`));
      let seconds: number | null = null;
      let from = 1;
      if (timed(type) && args[1]) {
        if (isPerm(args[1])) from = 2;
        else {
          const d = parseDuration(args[1]);
          if (d) { seconds = d; from = 2; } else if (needDur) return err(S.invalidDuration(args[1]));
        }
      }
      if (needDur && seconds === null && from === 1) return err(S.usage(`/${name} <player> <duration> [reason]`));
      issue(type, args[0], seconds, args.slice(from).join(' '), { ...opts, ip: opts.ip || forceIp });
    };

    switch (name) {
      case 'ban': return punishCmd('ban', false);
      case 'tempban': return punishCmd('ban', true);
      case 'ipban': case 'banip': return punishCmd('ban', false, true);
      case 'mute': return punishCmd('mute', false);
      case 'tempmute': return punishCmd('mute', true);
      case 'ipmute': return punishCmd('mute', false, true);
      case 'warn': return punishCmd('warn', false);
      case 'kick': return punishCmd('kick', false);
      case 'note': return punishCmd('note', false);
      case 'unban': case 'pardon': return args[0] ? revoke('ban', args[0], args.slice(1).join(' ')) : err(S.usage('/unban <player|#code> [reason]'));
      case 'unmute': return args[0] ? revoke('mute', args[0], args.slice(1).join(' ')) : err(S.usage('/unmute <player|#code> [reason]'));
      case 'unwarn': return args[0] ? revoke('warn', args[0], args.slice(1).join(' ')) : err(S.usage('/unwarn <player|#code> [reason]'));
      case 'punish': case 'p': return args[1] ? punish(args[0], args[1]) : err(S.usage('/punish <player> <template>') + ' · ' + S.templates);
      case 'history': case 'hist': return args[0] ? historyOf(args[0]) : err(S.usage('/history <player>'));
      case 'check': return args[0] ? check(args[0]) : err(S.usage('/check <player>'));
      case 'alts': return args[0] ? alts(args[0]) : err(S.usage('/alts <player>'));
      case 'case': return caseOf(args[0]);
      case 'themis': return line([['text', args[0] === 'templates' ? S.templates : S.about]]);
      case 'help': return line([['muted', S.help]]);
      default: return err(S.unknown);
    }
  }

  // ---------------------------------------------------------------- input
  form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault(); hIndex = Math.min(hIndex + 1, history.length - 1); input.value = history[hIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); hIndex = Math.max(hIndex - 1, -1); input.value = hIndex < 0 ? '' : history[hIndex];
    } else if (e.key === 'Tab') {
      const parts = input.value.split(' ');
      const last = parts[parts.length - 1].toLowerCase();
      let options: string[] = [];
      if (parts.length === 1) options = COMMANDS;
      else if (parts.length === 2) options = Object.values(players).map((p) => p.name);
      else if (parts.length === 3 && /^\/?p(unish)?$/i.test(parts[0])) options = Object.keys(LADDERS);
      const match = options.find((o) => o.toLowerCase().startsWith(last) && o.toLowerCase() !== last);
      if (match) { e.preventDefault(); parts[parts.length - 1] = match; input.value = parts.join(' ') + ' '; }
    }
  });
  root.querySelectorAll<HTMLButtonElement>('[data-chip]').forEach((b) => b.addEventListener('click', () => {
    let c = b.dataset.chip!;
    if (c === '/case' && list.length) c = '/case #' + list[list.length - 1].code;
    run(c);
    input.focus({ preventScroll: true });
  }));
  root.querySelector('[data-reset]')?.addEventListener('click', () => { reset(); line([['muted', S.reset]]); });

  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));
  tabs.forEach((tab, i) => tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    select(next); next.focus();
  }));
  function select(tab: HTMLButtonElement) {
    tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on) t.classList.remove('ping'); });
    root.querySelectorAll<HTMLElement>('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== tab.dataset.tab; });
  }

  reset();
}
