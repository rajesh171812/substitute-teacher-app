"use client";

import { useState, useEffect, useRef, useMemo, useId, useSyncExternalStore } from "react";
import {
  CalendarDays, CalendarCheck, CalendarOff, CalendarPlus, LayoutDashboard, School, DollarSign,
  Plus, Check, CircleX, Clock, Ban, LockOpen, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Search, X, Pencil, Trash2, Building2, GraduationCap, Download, Share2, FileText, LogOut, Mail, Shield,
  User, Sun, TrendingUp, TrendingDown, Banknote, Pause, Play,
} from "lucide-react";

/* Welcome screen background. Put a photo or a short looping video of teachers using the app here (use media you have
   permission to use; landscape, at least 1920px wide; video: muted mp4/webm under 5MB). Leave both empty for the
   gradient placeholder. A standalone page can also set window.SUBTRACK_WELCOME_MEDIA before the app script loads. */
const WELCOME_MEDIA = (typeof window !== "undefined" && window.SUBTRACK_WELCOME_MEDIA) || { image:"", video:"", poster:"" };

/* SubTrack (mobile pass). Uses the Baseline design system (tokens.css + bundle.css) plus the
   project theme (subtrack-theme.css) and app layout classes (subtrack-app.css).
   No raw colors, px values or inline styles in this file: everything comes from tokens. */

/* ─── Data (unchanged from the original app) ─────────────────────── */
const TODAY_SIM = { year:2026, month:2, day:10 };

/* District chip color = Baseline categorical token (color-dataviz-N). Initials always accompany the color. */
const DISTRICTS = {
  "Cabarrus County":{ rate:119, initials:"CC", tone:1 },
  "CMS":            { rate:129, initials:"CM", tone:3 },
  "Rowan County":   { rate:110, initials:"RC", tone:5 },
  "Union County":   { rate:115, initials:"UC", tone:6 },
};
const SCHOOLS = {
  "CMS":            ["North High School","West Mecklenburg HS","Myers Park HS","South Mecklenburg HS"],
  "Cabarrus County":["Lincoln Elementary","Harrisburg Elementary","Cox Mill HS","Jay M Robinson HS"],
  "Rowan County":   ["Westview Middle","Salisbury HS","Carson HS","Southeast Middle"],
  "Union County":   ["Maple Elementary","Porter Ridge HS","Sun Valley HS","Piedmont HS"],
};
const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

const INIT_SCHEDULE = {
  "2026-3":[
    {day:3,  district:"CMS",            status:"paid",    shift:"Full Day Shift", schoolIdx:0},
    {day:4,  district:"Cabarrus County", status:"unpaid",  shift:"Full Day Shift", schoolIdx:1},
    {day:5,  district:"Rowan County",    status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:6,  district:"Rowan County",    status:"paid",    shift:"Full Day Shift", schoolIdx:0},
    {day:7,  district:"Union County",    status:"paid",    shift:"Full Day Shift", schoolIdx:0},
    {day:10, district:"CMS",            status:"paid",    shift:"Full Day Shift", schoolIdx:1},
    {day:11, district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:2},
    {day:12, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:2},
    {day:13, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:2},
    {day:14, district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:3},
    {day:17, district:"Rowan County",    status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:18, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:3},
    {day:19, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:3},
    {day:20, district:"Union County",    status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:21, district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:24, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:25, district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:26, district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:27, district:"Rowan County",    status:"blocked", shift:"Full Day Shift", schoolIdx:2},
    {day:28, district:"Union County",    status:"blocked", shift:"Full Day Shift", schoolIdx:2},
    {day:31, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:1},
  ],
  "2026-4":[
    {day:1,  district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:2,  district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:3,  district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:6,  district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:7,  district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:8,  district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:9,  district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:10, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:13, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:14, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:15, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:16, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:17, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:20, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:21, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:22, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:23, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:24, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:27, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:28, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:29, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
    {day:30, district:null, status:"unblocked", shift:"Full Day Shift", schoolIdx:null},
  ],
  "2026-5":[
    {day:1,  district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:5,  district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:6,  district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:12, district:"Rowan County",    status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:13, district:"Union County",    status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:19, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:2},
    {day:20, district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:27, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:3},
  ],
  "2026-6":[
    {day:2,  district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:2},
    {day:3,  district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:9,  district:"Rowan County",    status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:10, district:"Union County",    status:"blocked", shift:"Full Day Shift", schoolIdx:0},
    {day:16, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:1},
    {day:23, district:"Cabarrus County", status:"blocked", shift:"Full Day Shift", schoolIdx:3},
    {day:24, district:"CMS",            status:"blocked", shift:"Full Day Shift", schoolIdx:2},
  ],
};

/* ─── Helpers ────────────────────────────────────────────────────── */
const cx = (...a) => a.filter(Boolean).join(" ");
const simToday    = () => new Date(TODAY_SIM.year, TODAY_SIM.month, TODAY_SIM.day);
const isSimToday  = (y,m,d) => y===TODAY_SIM.year && m===TODAY_SIM.month && d===TODAY_SIM.day;
const isSimPast   = (y,m,d) => new Date(y,m,d) < simToday();
const isSimFuture = (y,m,d) => new Date(y,m,d) > simToday();
const monthKey    = (y,m) => `${y}-${m+1}`;

function getWeekRow(year, month, day) {
  return Math.floor((new Date(year,month,1).getDay() + day - 1) / 7);
}
function countWeekends(year, month) {
  const days = new Date(year,month+1,0).getDate();
  let sat=0,sun=0;
  for (let d=1;d<=days;d++) {
    const dow=new Date(year,month,d).getDay();
    if(dow===6)sat++; if(dow===0)sun++;
  }
  return Math.min(sat,sun);
}
function getSchool(district, idx) { return SCHOOLS[district]?.[idx??0]??"Unknown school"; }
function entryAmount(e) {
  const rate = DISTRICTS[e.district]?.rate ?? 110;
  return e.shift==="Half Day Shift" ? Math.round(rate/2) : rate;
}
const money = (n) => "$" + n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const shiftLabel = (s) => s==="Half Day Shift" ? "Half day" : "Full day";
const formatDate      = (y,m,d) => new Date(y,m,d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const formatDateLong  = (y,m,d) => new Date(y,m,d).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
const formatDateFull  = (y,m,d) => new Date(y,m,d).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
const formatShort     = (y,m,d) => new Date(y,m,d).toLocaleDateString("en-US",{month:"short",day:"numeric"});

function buildDashMonths() {
  return Array.from({length:4},(_,i)=>{
    let m=TODAY_SIM.month+i, y=TODAY_SIM.year;
    if(m>11){m-=12;y+=1;}
    return {year:y,month:m,label:MONTH_NAMES[m],key:monthKey(y,m)};
  });
}
const DASH_MONTHS = buildDashMonths();

/* Dashboard numbers are derived from the schedule, so they always match the Scheduler and Earnings. */
function monthStats(sd, y, m) {
  const list = sd[monthKey(y,m)] || [];
  const count = (s) => list.filter(e=>e.status===s).length;
  const earned = list.filter(e=>e.status==="paid").reduce((s,e)=>s+entryAmount(e),0);
  return { blocked:count("blocked"), unblocked:count("unblocked"), paid:count("paid"), unpaid:count("unpaid"), earned };
}
function recentAssignments(sd) {
  const rows = [];
  Object.entries(sd).forEach(([key,list])=>{
    const [y,m1] = key.split("-").map(Number);
    list.forEach(e=>{
      if (e.district && ["paid","unpaid","blocked"].includes(e.status) && !isSimFuture(y,m1-1,e.day))
        rows.push({ id:`${key}-${e.day}`, y, m:m1-1, day:e.day, district:e.district, school:getSchool(e.district,e.schoolIdx), shift:e.shift, status:e.status, amount:entryAmount(e) });
    });
  });
  return rows.sort((a,b)=> new Date(b.y,b.m,b.day) - new Date(a.y,a.m,a.day));
}
function buildTransactions(sd) {
  const txns = [];
  Object.entries(sd).forEach(([key, entries]) => {
    const [year, monthPlus1] = key.split("-").map(Number);
    entries.forEach(e => {
      if (e.status === "paid" || e.status === "unpaid") {
        txns.push({ id:`${key}-${e.day}`, district:e.district, school:getSchool(e.district,e.schoolIdx),
          date:new Date(year,monthPlus1-1,e.day), shift:e.shift, amount:entryAmount(e), status:e.status,
          year, month:monthPlus1-1, day:e.day });
      }
    });
  });
  return txns.sort((a, b) => b.date - a.date);
}

/* One status vocabulary for the whole app: color set + icon + word (never color alone). */
const STATUS = {
  paid:      { label:"Paid",      tone:"success", Icon:Check },
  unpaid:    { label:"Unpaid",    tone:"warning", Icon:Clock },
  blocked:   { label:"Blocked",   tone:"",        Icon:Ban },
  unblocked: { label:"Available", tone:"",        Icon:CalendarPlus },
};

/* ─── Primitives (Baseline components as React) ──────────────────── */
function Icon({ as:C, size, className }) {
  return <C className={cx("bl-icon", size && `bl-icon--${size}`, className)} aria-hidden="true" focusable="false" />;
}

function Button({ variant="primary", size, block, icon, iconOnly, loading, className, children, ...rest }) {
  if (iconOnly && !rest["aria-label"]) console.warn("Icon-only Button requires aria-label");
  return (
    <button type="button" aria-busy={loading || undefined}
      className={cx("bl-btn", `bl-btn--${variant}`, size && `bl-btn--${size}`, iconOnly && "bl-btn--icon", block && "bl-btn--block", className)}
      {...rest}>
      {loading ? <span className="bl-spinner bl-spinner--sm" aria-hidden="true" /> : icon}
      {!iconOnly && <span>{children}</span>}
    </button>
  );
}

function Badge({ tone, Icon:I, children, className }) {
  return (
    <span className={cx("bl-badge", tone && `bl-badge--${tone}`, className)}>
      {I && <Icon as={I} />}{children}
    </span>
  );
}
function StatusBadge({ status }) {
  const s = STATUS[status]; if (!s) return null;
  return <Badge tone={s.tone} Icon={s.Icon}>{s.label}</Badge>;
}

function DistrictChip({ district, className }) {
  const d = DISTRICTS[district];
  const initials = d?.initials ?? (district ? district.split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase() : "");
  return <span className={cx("st-chip", className)} data-tone={d?.tone} aria-hidden="true">{initials}</span>;
}

function Avatar({ initials, size }) {
  return <span className={cx("bl-avatar", size && `bl-avatar--${size}`)} aria-hidden="true">{initials}</span>;
}

function TextField({ label, optional, help, error, icon, clearable, onClear, prefix, inputRef, className, ...input }) {
  const id = useId();
  const helpId = help ? `${id}-h` : undefined, errId = error ? `${id}-e` : undefined;
  const control = (
    <input ref={inputRef} id={id} aria-invalid={error ? "true" : undefined}
      aria-describedby={[helpId, errId].filter(Boolean).join(" ") || undefined}
      className={cx("bl-input", prefix && "st-input--prefixed", className)} {...input} />
  );
  return (
    <div className="bl-field">
      <label className="bl-label" htmlFor={id}>{label}{optional && <span className="bl-label__opt"> (optional)</span>}</label>
      {help && <p className="bl-help" id={helpId}>{help}</p>}
      {icon || prefix ? (
        <div className="bl-input-wrap">
          {icon && <Icon as={icon} />}
          {prefix && <span className="st-input-prefix" aria-hidden="true">{prefix}</span>}
          {control}
          {clearable && <Button variant="ghost" size="sm" iconOnly className="bl-input-clear" aria-label="Clear search" onClick={onClear} icon={<Icon as={X} size="sm" />} />}
        </div>
      ) : control}
      {error && <p className="bl-error" id={errId} role="alert"><Icon as={CircleX} size="sm" />{error}</p>}
    </div>
  );
}

/* 2 to 5 options, all visible: radio group in a fieldset (Baseline Radio). `cards` lays each option out as a row. */
function RadioGroup({ legend, name, value, onChange, options, cards }) {
  return (
    <fieldset className="bl-fieldset">
      <legend>{legend}</legend>
      <div className={cards ? "st-radio-list" : "st-radio-row"}>
        {options.map(o => (
          <label key={o.value} className={cx("bl-radio", "st-radio", cards && "st-radio--card")}>
            <input type="radio" name={name} value={o.value} checked={value===o.value} onChange={()=>onChange(o.value)} />
            <span className="bl-radio__box" />
            <span className="st-radio__body">
              {o.chip}
              <span className="st-radio__text">
                <span className="st-radio__label">{o.label}</span>
                {o.sub && <span className="st-radio__sub">{o.sub}</span>}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* Tabs (Baseline): sibling views in one place, arrow-key navigation, horizontal scroll if they do not fit. */
function Tabs({ label, items, value, onChange, idPrefix }) {
  const onKey = (e) => {
    const i = items.findIndex(t=>t.id===value);
    let n = null;
    if (e.key==="ArrowRight") n = (i+1)%items.length;
    else if (e.key==="ArrowLeft") n = (i-1+items.length)%items.length;
    else if (e.key==="Home") n = 0; else if (e.key==="End") n = items.length-1;
    if (n!==null) { e.preventDefault(); onChange(items[n].id); document.getElementById(`${idPrefix}-tab-${items[n].id}`)?.focus(); }
  };
  return (
    <div className="bl-tabs" role="tablist" aria-label={label} onKeyDown={onKey}>
      {items.map(t => (
        <button key={t.id} type="button" role="tab" id={`${idPrefix}-tab-${t.id}`} className="bl-tab"
          aria-selected={value===t.id} aria-controls={`${idPrefix}-panel`} tabIndex={value===t.id ? 0 : -1}
          onClick={()=>onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}
const tabPanelProps = (idPrefix, value) => ({ role:"tabpanel", id:`${idPrefix}-panel`, "aria-labelledby":`${idPrefix}-tab-${value}`, tabIndex:0 });

function EmptyState({ Icon:I, title, text, action }) {
  return (
    <div className="bl-empty">
      <span className="bl-empty__icon"><Icon as={I} size="lg" /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

/* Baseline breakpoints: tablet from 768px, desktop from 1024px. Structure that differs (not just spacing) reads these. */
const BP_TABLET = "(min-width: 48rem)", BP_DESKTOP = "(min-width: 64rem)", BP_XL = "(min-width: 80rem)";
function useMedia(query) {
  // useSyncExternalStore keeps server rendering (no window) and hydration consistent: the server snapshot is always false.
  return useSyncExternalStore(
    (notify) => { const mq = matchMedia(query); mq.addEventListener("change", notify); return () => mq.removeEventListener("change", notify); },
    () => matchMedia(query).matches,
    () => false,
  );
}

/* Header: title left, primary action right on tablet and desktop. The profile button moves to the rail / sidebar there. */
function ScreenHeader({ title, caption, initials, onProfile, action }) {
  return (
    <header className="bl-header st-header">
      <div className="st-header__text">
        {caption && <p className="bl-caption bl-text-secondary st-header__caption">{caption}</p>}
        <h1 className="bl-h3 st-header__title">{title}</h1>
      </div>
      {action && <div className="st-header__action">{action}</div>}
      <button type="button" className="st-avatar-btn" aria-label="Open profile" onClick={onProfile}>
        <Avatar initials={initials} />
      </button>
    </header>
  );
}

const TABS = [
  { id:"dashboard", label:"Dashboard", Icon:LayoutDashboard },
  { id:"scheduler", label:"Schedule",  Icon:CalendarDays },
  { id:"schools",   label:"Schools",   Icon:School },
  { id:"earnings",  label:"Earnings",  Icon:DollarSign },
];
function BottomNav({ active, onChange }) {
  return (
    <nav className="st-bottomnav" aria-label="Main">
      <ul>
        {TABS.map(t => (
          <li key={t.id}>
            <button type="button" className="st-bottomnav__item" aria-current={active===t.id ? "page" : undefined} onClick={()=>onChange(t.id)}>
              <Icon as={t.Icon} size="lg" /><span>{t.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* Tablet: 72px icon rail. Desktop: 264px sidebar (Baseline Sidenav). One component, one DOM: CSS decides how much of each label shows.
   Items are real links (hash targets) because they switch between views; the click handler keeps the page from jumping. */
function SideNav({ active, onChange, name, initials, onProfile }) {
  return (
    <aside className="st-side">
      <div className="st-side__brand">
        <span className="st-logo st-logo--sm" aria-hidden="true"><Icon as={CalendarDays} /></span>
        <span className="st-side__label st-side__wordmark">SubTrack</span>
      </div>
      <nav className="bl-sidenav st-side__nav" aria-label="Main">
        <p className="bl-sidenav__group st-side__group">Workspace</p>
        {TABS.map(t => (
          <a key={t.id} href={`#${t.id}`} data-label={t.label} aria-current={active === t.id ? "page" : undefined}
            onClick={(e) => { e.preventDefault(); onChange(t.id); }}>
            <Icon as={t.Icon} /><span className="st-side__label">{t.label}</span>
          </a>
        ))}
      </nav>
      <button type="button" className="st-side__profile" data-label="Profile" onClick={onProfile}>
        <Avatar initials={initials} />
        <span className="st-side__label st-side__who">
          <span className="st-side__name">{name}</span>
          <span className="st-side__cap">Open profile</span>
        </span>
      </button>
    </aside>
  );
}

/* Native <dialog> + showModal(): focus is trapped, Escape closes, background is inert. */
function useDialog(onClose, focusSelector) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    const opener = document.activeElement;   // return focus here when the dialog closes
    if (!d.open) d.showModal();
    if (focusSelector) d.querySelector(focusSelector)?.focus();
    return () => { if (d.open) d.close(); if (opener?.isConnected) opener.focus?.({ preventScroll:true }); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    ref,
    onCancel: (e) => { e.preventDefault(); onClose(); },
    onClick: (e) => { if (e.target === ref.current) onClose(); },
  };
}

/* Bottom sheet on mobile (approved addition). Same native dialog, so it becomes a centered dialog on wider screens. */
function Sheet({ title, onClose, children }) {
  const id = useId();
  const dlg = useDialog(onClose);
  return (
    <dialog ref={dlg.ref} className="bl-dialog st-sheet" aria-labelledby={id} onCancel={dlg.onCancel} onClick={dlg.onClick}>
      <div className="st-sheet__inner">
        <div className="st-sheet__head">
          <h2 id={id} className="bl-h4 st-sheet__title">{title}</h2>
          <Button variant="ghost" iconOnly aria-label="Close" onClick={onClose} icon={<Icon as={X} />} />
        </div>
        <div className="st-sheet__body">{children}</div>
      </div>
    </dialog>
  );
}

/* Baseline Dialog for confirmations: title = action + object, body = consequence, buttons repeat the verb. */
function ConfirmDialog({ title, body, cancelLabel, confirmLabel, confirmVariant="destructive", onCancel, onConfirm }) {
  const id = useId();
  const dlg = useDialog(onCancel, "[data-autofocus]");
  return (
    <dialog ref={dlg.ref} className="bl-dialog st-sheet st-sheet--confirm" aria-labelledby={`${id}t`} aria-describedby={`${id}b`} onCancel={dlg.onCancel} onClick={dlg.onClick}>
      <div className="st-sheet__inner st-sheet__inner--pad">
        <h2 id={`${id}t`} className="bl-dialog__title">{title}</h2>
        <p id={`${id}b`} className="bl-dialog__body">{body}</p>
        <div className="bl-dialog__actions st-actions">
          <Button variant="secondary" data-autofocus onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </dialog>
  );
}

/* ─── Shared list row: district chip + up to three text lines + optional trailing block ─── */
function ListRow({ district, icon, title, lines = [], end }) {
  return (
    <div className="st-row">
      {icon ? <span className="st-chip st-chip--plain" aria-hidden="true"><Icon as={icon} /></span> : <DistrictChip district={district} />}
      <div className="st-row__text">
        <p className="st-row__title">{title}</p>
        {lines.filter(Boolean).map((l, i) => <p key={i} className="st-row__line">{l}</p>)}
      </div>
      {end && <div className="st-row__end">{end}</div>}
    </div>
  );
}

/* ─── Combobox: type a value or pick from the list (ARIA 1.2 combobox, list popup) ─── */
function Combobox({ label, value, onChange, onPick, options, placeholder, help, error, customNoun = "value" }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);
  const text = value.trim().toLowerCase();
  const filtered = text ? options.filter(o => o.label.toLowerCase().includes(text)) : options;
  const exact = options.some(o => o.label.toLowerCase() === text);
  const showCustom = text.length > 0 && !exact;
  const rows = [...filtered.map(o => ({ kind:"option", o })), ...(showCustom ? [{ kind:"custom" }] : [])];
  const listId = `${id}-list`;

  const pick = (row) => {
    if (row.kind === "option") { onChange(row.o.label); onPick?.(row.o); }
    setOpen(false); setActive(-1);
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive(a => Math.min(rows.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && open && active >= 0) { e.preventDefault(); pick(rows[active]); }
    else if (e.key === "Escape" && open) { e.preventDefault(); e.stopPropagation(); setOpen(false); setActive(-1); }
  };
  const onBlur = (e) => { if (!wrapRef.current?.contains(e.relatedTarget)) { setOpen(false); setActive(-1); } };

  return (
    <div className="bl-field" ref={wrapRef} onBlur={onBlur}>
      <label className="bl-label" htmlFor={id}>{label}</label>
      {help && <p className="bl-help" id={`${id}-h`}>{help}</p>}
      <div className="bl-input-wrap">
        <Icon as={Building2} />
        <input id={id} className="bl-input" role="combobox" aria-autocomplete="list" aria-expanded={open}
          aria-controls={listId} aria-activedescendant={active >= 0 ? `${id}-o${active}` : undefined}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={[help && `${id}-h`, error && `${id}-e`].filter(Boolean).join(" ") || undefined}
          autoComplete="off" placeholder={placeholder} value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)} onKeyDown={onKeyDown} />
      </div>
      {error && <p className="bl-error" id={`${id}-e`} role="alert"><Icon as={CircleX} size="sm" />{error}</p>}
      {open && rows.length > 0 && (
        <ul className="st-listbox" role="listbox" id={listId} aria-label={`${label} suggestions`}>
          {rows.map((r, i) => (
            <li key={r.kind === "custom" ? "custom" : r.o.value} id={`${id}-o${i}`} role="option"
              aria-selected={r.kind === "option" && r.o.label === value}
              className="st-listbox__opt" data-active={active === i || undefined}
              onMouseDown={(e) => e.preventDefault()} onClick={() => pick(r)}>
              {r.kind === "option"
                ? <><DistrictChip district={r.o.label} /><span>{r.o.label}</span>{r.o.label === value && <Icon as={Check} size="sm" className="st-listbox__check" />}</>
                : <><span className="st-chip st-chip--plain" aria-hidden="true"><Icon as={Building2} /></span><span>Use “{value.trim()}” as a new {customNoun}</span></>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── School choice: district, then school, then shift (progressive disclosure) ─── */
const SHIFT_OPTIONS = [{ value:"Full Day Shift", label:"Full day", half:false }, { value:"Half Day Shift", label:"Half day", half:true }];
const emptyChoice = () => ({ district:null, schoolIdx:null, shift:"Full Day Shift" });
const choiceReady = (c) => c.district !== null && c.schoolIdx !== null;

function SchoolChoice({ choice, onChange }) {
  const uid = useId();
  const rate = choice.district ? DISTRICTS[choice.district].rate : 0;
  return (
    <div className="st-stack">
      <RadioGroup legend="District" name={`${uid}d`} cards value={choice.district}
        onChange={(d) => onChange({ ...choice, district:d, schoolIdx:null })}
        options={Object.keys(DISTRICTS).map(d => ({ value:d, label:d, sub:`${money(DISTRICTS[d].rate)} per day`, chip:<DistrictChip district={d} /> }))} />
      {choice.district && (
        <RadioGroup legend="School" name={`${uid}s`} cards value={choice.schoolIdx === null ? null : String(choice.schoolIdx)}
          onChange={(i) => onChange({ ...choice, schoolIdx:Number(i) })}
          options={SCHOOLS[choice.district].map((s, i) => ({ value:String(i), label:s, sub:DISTRICTS[choice.district].initials, chip:<DistrictChip district={choice.district} /> }))} />
      )}
      {choiceReady(choice) && (
        <RadioGroup legend="Shift" name={`${uid}t`} value={choice.shift} onChange={(s) => onChange({ ...choice, shift:s })}
          options={SHIFT_OPTIONS.map(o => ({ value:o.value, label:o.label, sub:money(o.half ? Math.round(rate / 2) : rate) }))} />
      )}
    </div>
  );
}

/* ─── Status marker: shape + color. Paid = filled circle, Unpaid = ring, Blocked = diamond, Available = dashed ring ─── */
function Marker({ status }) {
  return <span className="st-marker" data-status={status} aria-hidden="true" />;
}
function Legend({ items }) {
  return (
    <ul className="st-legend" aria-label="Legend">
      {items.map(i => <li key={i.key}><span className={cx("st-marker", i.className)} data-status={i.status} aria-hidden="true" />{i.label}</li>)}
    </ul>
  );
}
const CAL_LEGEND = [
  { key:"paid", status:"paid", label:"Paid" }, { key:"unpaid", status:"unpaid", label:"Unpaid" },
  { key:"blocked", status:"blocked", label:"Blocked" }, { key:"unblocked", status:"unblocked", label:"Available" },
];
const WEEKDAYS = ["S","M","T","W","T","F","S"];
const WEEKDAYS_LONG = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function MonthHeader({ year, month, onMonthChange, children }) {
  return (
    <div className="st-cal__head">
      <Button variant="ghost" iconOnly aria-label="Previous month" onClick={() => onMonthChange(-1)} icon={<Icon as={ChevronLeft} />} />
      <h2 className="bl-h4 st-cal__title" aria-live="polite">{MONTH_NAMES[month]} {year}</h2>
      <Button variant="ghost" iconOnly aria-label="Next month" onClick={() => onMonthChange(1)} icon={<Icon as={ChevronRight} />} />
      {children}
    </div>
  );
}
function WeekdayRow() {
  return <div className="st-cal__dow" aria-hidden="true">{WEEKDAYS.map((d, i) => <span key={i}>{d}</span>)}</div>;
}

/* ─── Schedule calendar: one-week strip that expands to the full month (`fixed` = always the full month, for the split view) ─── */
function ScheduleCalendar({ year, month, dayMap, selDay, onDayTap, onMonthChange, fixed }) {
  const uid = useId();
  const [open, setExpanded] = useState(false);
  const expanded = fixed || open;
  const isCurrent = year === TODAY_SIM.year && month === TODAY_SIM.month;
  const [visRow, setVisRow] = useState(isCurrent ? getWeekRow(year, month, TODAY_SIM.day) : 0);
  const swipe = useRef({ x:0, y:0 });

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMo = new Date(year, month + 1, 0).getDate();
  const totalRows = Math.ceil((firstDow + daysInMo) / 7);
  const cells = Array.from({ length:totalRows * 7 }, (_, i) => { const d = i - firstDow + 1; return d >= 1 && d <= daysInMo ? d : null; });

  useEffect(() => { if (!expanded && selDay) setVisRow(getWeekRow(year, month, selDay)); }, [selDay, month, year, expanded]);
  useEffect(() => { if (visRow > totalRows - 1) setVisRow(totalRows - 1); }, [totalRows, visRow]);

  const onTouchStart = (e) => { const t = e.touches[0]; swipe.current = { x:t.clientX, y:t.clientY }; };
  const onTouchEnd = (e) => {
    if (expanded) return;
    const t = e.changedTouches[0]; const dx = t.clientX - swipe.current.x, dy = Math.abs(t.clientY - swipe.current.y);
    if (Math.abs(dx) < 40 || dy > 30) return;
    if (dx < 0) { if (visRow < totalRows - 1) setVisRow(r => r + 1); else { onMonthChange(1); setVisRow(0); } }
    else if (visRow > 0) setVisRow(r => r - 1); else onMonthChange(-1);
  };

  const rows = expanded ? Array.from({ length:totalRows }, (_, r) => r) : [visRow];
  return (
    <div className="bl-card st-cal" data-expanded={expanded} data-fixed={fixed || undefined}>
      <MonthHeader year={year} month={month} onMonthChange={onMonthChange} />
      <WeekdayRow />
      <div className="st-cal__grid" id={`${uid}-grid`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {rows.flatMap(r => cells.slice(r * 7, r * 7 + 7).map((d, ci) => {
          if (!d) return <span key={`${r}-${ci}`} className="st-cal__blank" />;
          const entry = dayMap[d];
          const today = isSimToday(year, month, d);
          const dow = new Date(year, month, d).getDay();
          const label = [formatDateFull(year, month, d), today && "today", entry && STATUS[entry.status]?.label].filter(Boolean).join(", ");
          return (
            <button key={`${r}-${ci}`} type="button" className="st-cal__day" aria-label={label}
              aria-current={today ? "date" : undefined} aria-pressed={d === selDay}
              data-today={today || undefined} data-selected={d === selDay || undefined}
              data-past={isSimPast(year, month, d) || undefined} data-weekend={dow === 0 || dow === 6 || undefined}
              onClick={() => { if (open && !fixed) { setExpanded(false); setVisRow(getWeekRow(year, month, d)); } onDayTap(d); }}>
              <span className="st-cal__num">{d}</span>
              {entry ? <Marker status={entry.status} /> : <span className="st-marker st-marker--none" aria-hidden="true" />}
            </button>
          );
        }))}
      </div>
      {expanded && <Legend items={CAL_LEGEND} />}
      {!fixed && (
        <Button variant="ghost" className="st-cal__toggle" aria-expanded={expanded} aria-controls={`${uid}-grid`}
          onClick={() => setExpanded(e => !e)}
          icon={<Icon as={expanded ? ChevronUp : ChevronDown} size="sm" />}>{expanded ? "Show one week" : "Show full month"}</Button>
      )}
    </div>
  );
}

/* ─── Date picker: month grid, multi-select, weekends unavailable ─── */
function DatePicker({ year, month, onMonthChange, monthMap, selected, onToggle }) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMo = new Date(year, month + 1, 0).getDate();
  return (
    <div className="st-datepicker">
      <MonthHeader year={year} month={month} onMonthChange={onMonthChange} />
      <WeekdayRow />
      <div className="st-cal__grid st-cal__grid--pick">
        {Array.from({ length:firstDow }, (_, i) => <span key={`b${i}`} className="st-cal__blank" />)}
        {Array.from({ length:daysInMo }, (_, i) => i + 1).map(d => {
          const dow = new Date(year, month, d).getDay();
          const weekend = dow === 0 || dow === 6;
          const entry = monthMap[d];
          const sel = selected.has(`${year}-${month}-${d}`);
          const label = [formatDateFull(year, month, d), weekend && "weekend, not available", entry && STATUS[entry.status]?.label].filter(Boolean).join(", ");
          return (
            <button key={d} type="button" className="st-cal__day" aria-label={label} aria-pressed={sel} disabled={weekend}
              data-selected={sel || undefined} data-weekend={weekend || undefined} onClick={() => onToggle(d)}>
              <span className="st-cal__num">{d}</span>
              {entry ? <Marker status={entry.status} /> : <span className="st-marker st-marker--none" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <Legend items={[{ key:"sel", status:"selected", label:"Selected" }, ...CAL_LEGEND.filter(l => l.key === "blocked" || l.key === "unblocked")]} />
    </div>
  );
}

/* ─── Day card in the schedule list ─── */
function DayCard({ entry, year, month, selected, today, past, onOpen, onUnblockAssign }) {
  const s = entry.status;
  const dist = entry.district;
  const school = dist ? getSchool(dist, entry.schoolIdx) : null;
  const amount = (s === "paid" || s === "unpaid") ? entryAmount(entry) : null;
  const dateText = `${today ? "Today · " : ""}${formatDate(year, month, entry.day)}`;
  const summary = school ? `${school}, ${dist}` : "No school assigned";
  return (
    <li id={`day-${entry.day}`} className="st-daycard" data-status={s} data-today={today || undefined} data-past={past || undefined} data-selected={selected || undefined}>
      <button type="button" className="st-daycard__btn" aria-haspopup="dialog" aria-label={`${dateText}. ${STATUS[s].label}. ${summary}. Open details`} onClick={() => onOpen(entry)}>
        <span className="st-daycard__top">
          <span className="st-daycard__date">{dateText}</span>
          <StatusBadge status={s} />
        </span>
        {s === "unblocked"
          ? <ListRow icon={CalendarCheck} title="No school assigned" lines={["Tap to assign a school"]} />
          : <ListRow district={dist} title={school}
              lines={[`${dist} · ${money(DISTRICTS[dist]?.rate ?? 0)} per day`, shiftLabel(entry.shift)]}
              end={amount !== null && <span className="st-amount">{money(amount)}</span>} />}
      </button>
      {today && s === "blocked" && (
        <div className="st-daycard__foot">
          <Button variant="secondary" block icon={<Icon as={LockOpen} size="sm" />} onClick={() => onUnblockAssign(entry)}>Unblock and assign school</Button>
        </div>
      )}
    </li>
  );
}

/* ─── Day sheet: one sheet for every day state ─── */
function DaySheet({ entry, year, month, past, today, onClose, onUpdateStatus, onUpdateEntry, onUnblock }) {
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState(entry.status === "unblocked" ? emptyChoice() : { district:entry.district, schoolIdx:entry.schoolIdx, shift:entry.shift });
  const s = entry.status;
  const dist = entry.district;
  const school = dist ? getSchool(dist, entry.schoolIdx) : null;
  const done = (fn) => () => { fn(); onClose(); };
  const assign = () => {
    onUpdateEntry({ district:choice.district, schoolIdx:choice.schoolIdx, shift:choice.shift, status: s === "unblocked" ? "unpaid" : s });
    onClose();
  };
  const summary = s !== "unblocked" && (
    <div className="bl-card bl-card--sunken st-compact">
      <ListRow district={dist} title={school} lines={[`${dist} · ${money(DISTRICTS[dist]?.rate ?? 0)} per day`, shiftLabel(entry.shift)]} end={<StatusBadge status={s} />} />
    </div>
  );
  const picker = (
    <div className="st-stack">
      <SchoolChoice choice={choice} onChange={setChoice} />
      <div className="st-sheet__foot">
        <Button block size="lg" disabled={!choiceReady(choice)} onClick={assign}>{s === "unblocked" ? "Assign school" : "Save changes"}</Button>
      </div>
    </div>
  );

  return (
    <Sheet title={formatDateLong(year, month, entry.day)} onClose={onClose}>
      <div className="st-stack">
        {s === "unblocked" && <p className="bl-body-sm bl-text-secondary">This day is available. Choose the school you will work at.</p>}
        {summary}
        {s === "unblocked" && picker}

        {s !== "unblocked" && past && (
          <fieldset className="bl-fieldset">
            <legend>Payment status</legend>
            <div className="st-radio-row">
              {["paid", "unpaid"].map(p => (
                <Button key={p} variant="secondary" className="st-toggle" aria-pressed={s === p} onClick={done(() => onUpdateStatus(p))}
                  icon={s === p ? <Icon as={Check} size="sm" /> : undefined}>Mark {p}</Button>
              ))}
            </div>
          </fieldset>
        )}

        {s !== "unblocked" && !past && (
          <>
            {s !== "blocked" && (
              <Button variant="secondary" aria-expanded={editing} onClick={() => setEditing(e => !e)}
                icon={<Icon as={Pencil} size="sm" />}>{editing ? "Cancel change" : "Change school or shift"}</Button>
            )}
            {editing ? picker : (
              <div className="st-stack st-stack--tight">
                <Button variant="secondary" icon={<Icon as={LockOpen} size="sm" />} onClick={done(onUnblock)}>Unblock day</Button>
                <p className="bl-caption bl-text-secondary">Clears the assignment and returns this day to available.</p>
              </div>
            )}
          </>
        )}
      </div>
    </Sheet>
  );
}

/* ─── Assign sheet: pick dates, then one school for all of them ─── */
function AssignSheet({ initialYear, initialMonth, scheduleData, onClose, onConfirm }) {
  const [step, setStep] = useState("dates");
  const [selected, setSelected] = useState(() => new Set());
  const [view, setView] = useState({ y:initialYear, m:initialMonth });
  const [choice, setChoice] = useState(emptyChoice());

  const monthMap = useMemo(() => {
    const map = {}; (scheduleData[monthKey(view.y, view.m)] || []).forEach(e => { map[e.day] = e; }); return map;
  }, [scheduleData, view]);
  const toggle = (d) => setSelected(prev => { const n = new Set(prev); const k = `${view.y}-${view.m}-${d}`; n.has(k) ? n.delete(k) : n.add(k); return n; });
  const changeMonth = (dir) => setView(v => { let m = v.m + dir, y = v.y; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } return { y, m }; });

  const dates = [...selected].map(k => { const [y, m, d] = k.split("-").map(Number); return { y, m, d }; })
    .sort((a, b) => new Date(a.y, a.m, a.d) - new Date(b.y, b.m, b.d));
  const n = dates.length;
  const summaryText = dates.slice(0, 5).map(x => formatShort(x.y, x.m, x.d)).join(", ") + (n > 5 ? ` and ${n - 5} more` : "");
  const confirm = () => {
    onConfirm(dates.map(x => ({ year:x.y, month:x.m, day:x.d, district:choice.district, schoolIdx:choice.schoolIdx, shift:choice.shift, status:"blocked" })));
    onClose();
  };

  return (
    <Sheet title={step === "dates" ? "Choose days to block" : "Choose a school"} onClose={onClose}>
      {step === "dates" ? (
        <div className="st-stack">
          <DatePicker year={view.y} month={view.m} onMonthChange={changeMonth} monthMap={monthMap} selected={selected} onToggle={toggle} />
          <p className="bl-body-sm bl-text-secondary st-center" aria-live="polite">{n === 0 ? "Select one or more weekdays." : `${n} ${n === 1 ? "day" : "days"} selected`}</p>
          <div className="st-sheet__foot">
            <Button block size="lg" disabled={n === 0} onClick={() => setStep("school")}>Choose school</Button>
          </div>
        </div>
      ) : (
        <div className="st-stack">
          <div className="bl-card bl-card--sunken st-compact st-summary">
            <Icon as={CalendarDays} />
            <div><p className="bl-label">{n} {n === 1 ? "day" : "days"} to block</p><p className="bl-body-sm bl-text-secondary">{summaryText}</p></div>
          </div>
          <SchoolChoice choice={choice} onChange={setChoice} />
          <div className="st-sheet__foot st-stack st-stack--tight">
            <Button block size="lg" disabled={!choiceReady(choice)} onClick={confirm}>Block {n} {n === 1 ? "day" : "days"}</Button>
            <Button block variant="ghost" onClick={() => setStep("dates")} icon={<Icon as={ChevronLeft} size="sm" />}>Back to dates</Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

const initialsOf = (name) => (name || "").split(/\s+/).filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

/* ─── Login ─── */
function GoogleMark() {
  return (
    <svg className="bl-icon st-google" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path className="st-google__b" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path className="st-google__g" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path className="st-google__y" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path className="st-google__r" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/* ─── Welcome (always dark) ───
   The wrapper carries data-theme="dark", so every Baseline semantic token flips for this subtree only, whatever the device setting. */
function WelcomeShell({ children }) {
  return (
    <main className="st-welcome" id="main" data-theme="dark">
      <WelcomeMedia />
      <div className="st-welcome__inner">
        <div className="st-welcome__brand">
          <span className="st-logo st-logo--sm" aria-hidden="true"><Icon as={CalendarDays} /></span>
          <p className="st-welcome__wordmark">SubTrack</p>
        </div>
        {children}
      </div>
    </main>
  );
}

/* Full-bleed photo or looping video behind the welcome copy. Decorative (aria-hidden), covered by a dark scrim so text keeps
   its contrast on any picture. Video is muted, plays inline, stops for reduced motion, and has a pause button (WCAG 2.2.2). */
function WelcomeMedia() {
  const { image, video, poster } = WELCOME_MEDIA;
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const [loaded, setLoaded] = useState(Boolean(video && poster));
  const [paused, setPaused] = useState(false);
  const vref = useRef(null), iref = useRef(null);
  useEffect(() => { if (iref.current?.complete && iref.current.naturalWidth) setLoaded(true); }, []);
  useEffect(() => {
    const v = vref.current; if (!v) return;
    if (paused || reduce) v.pause(); else v.play?.().catch(() => {});
  }, [paused, reduce]);
  if (!image && !video) return null;
  return (
    <>
      <div className="st-welcome__media" aria-hidden="true" data-loaded={loaded || undefined}>
        {video
          ? <video ref={vref} src={video} poster={poster || image || undefined} muted loop playsInline autoPlay={!reduce} preload="auto" tabIndex={-1}
              onLoadedData={() => setLoaded(true)} />
          : <img ref={iref} src={image} alt="" onLoad={() => setLoaded(true)} />}
      </div>
      {video && !reduce && (
        <Button variant="secondary" iconOnly className="st-welcome__pause" aria-label={paused ? "Play background video" : "Pause background video"}
          onClick={() => setPaused(p => !p)} icon={<Icon as={paused ? Play : Pause} />} />
      )}
    </>
  );
}

function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const signIn = () => {
    setLoading(true);
    // Simulated auth. In production this calls the real sign-in provider.
    timer.current = setTimeout(() => { setLoading(false); onLogin({ isNew:true, email:"teacher@gmail.com" }); }, 1400);
  };
  return (
    <WelcomeShell>
      <div className="st-welcome__grid">
        <div className="st-welcome__copy">
          <Badge Icon={GraduationCap} className="st-welcome__eyebrow">Built for substitute teachers</Badge>
          <h1 className="st-welcome__title">Plan every sub day. <span className="st-welcome__accent">Track every dollar.</span></h1>
          <p className="st-welcome__lead">Block days, assign schools, and see what you have earned, all in one place.</p>
          <ul className="st-auth__features" aria-label="Features">
            <li><Badge Icon={CalendarCheck}>Schedule tracker</Badge></li>
            <li><Badge Icon={DollarSign}>Earnings log</Badge></li>
            <li><Badge Icon={School}>School manager</Badge></li>
          </ul>
          <div className="st-welcome__cta">
            <Button variant="secondary" size="lg" block className="st-google-btn" loading={loading} icon={loading ? undefined : <GoogleMark />} onClick={signIn}>
              {loading ? "Signing in…" : "Continue with Google"}
            </Button>
            <p className="bl-caption st-welcome__fine">By continuing, you agree to our Terms of Service and Privacy Policy. Your data is private and only visible to you.</p>
          </div>
        </div>
      </div>
    </WelcomeShell>
  );
}

/* ─── Onboarding (same dark look as the welcome screen) ─── */
function OnboardingScreen({ email, onComplete }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const submit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) { setError("Enter your full name, at least 2 characters."); ref.current?.focus(); return; }
    onComplete({ name:name.trim(), email });
  };
  return (
    <WelcomeShell>
      <div className="st-welcome__grid st-welcome__grid--setup">
        <div className="st-welcome__copy">
          <Badge Icon={Check} tone="success">Signed in</Badge>
          <h1 className="st-welcome__title st-welcome__title--md">Set up your <span className="st-welcome__accent">profile</span></h1>
          <p className="st-welcome__lead">Tell us your name so the dashboard can greet you.</p>
        </div>
        <form className="bl-card st-welcome__panel" onSubmit={submit} noValidate>
          <div className="st-profile">
            {name.trim() ? <Avatar size="lg" initials={initialsOf(name)} /> : <span className="bl-avatar bl-avatar--lg" aria-hidden="true"><Icon as={User} /></span>}
            <div><p className="bl-label">Signed in as</p><p className="bl-body-sm bl-text-secondary">{email}</p></div>
          </div>
          <TextField label="Your full name" icon={User} inputRef={ref} value={name} error={error} autoComplete="name"
            help="This name appears in your dashboard greeting."
            onChange={(e) => { setName(e.target.value); if (error) setError(""); }} />
          <Button type="submit" size="lg" block>Get started</Button>
        </form>
      </div>
    </WelcomeShell>
  );
}

/* ─── Dashboard ─── */
function Stat({ Icon:I, label, value, tone }) {
  return (
    <div className="bl-card st-stat" data-tone={tone}>
      <span className="st-stat__icon" aria-hidden="true"><Icon as={I} /></span>
      <dt className="st-stat__label">{label}</dt>
      <dd className="st-stat__value">{value}</dd>
    </div>
  );
}

function DashboardScreen({ user, scheduleData, onProfile, onBlock }) {
  const [monthKeyId, setMonthKeyId] = useState(DASH_MONTHS[0].key);
  const [showAll, setShowAll] = useState(false);
  const pill = DASH_MONTHS.find(p => p.key === monthKeyId) ?? DASH_MONTHS[0];
  const stats = monthStats(scheduleData, pill.year, pill.month);
  const prev = pill.month === 0 ? monthStats(scheduleData, pill.year - 1, 11) : monthStats(scheduleData, pill.year, pill.month - 1);
  const change = prev.earned > 0 ? Math.round(((stats.earned - prev.earned) / prev.earned) * 100) : null;
  const recent = useMemo(() => recentAssignments(scheduleData), [scheduleData]);
  const wide = useMedia(BP_TABLET), xl = useMedia(BP_XL);
  const rows = showAll ? recent : recent.slice(0, xl ? 3 : wide ? 4 : 2);
  const first = user?.name?.split(" ")[0] ?? "there";
  const blockBtn = <Button icon={<Icon as={Plus} />} onClick={() => onBlock(TODAY_SIM.year, TODAY_SIM.month)}>Block days</Button>;

  return (
    <>
      <ScreenHeader caption={formatDateFull(TODAY_SIM.year, TODAY_SIM.month, TODAY_SIM.day)} title={`Hi, ${first}`} initials={initialsOf(user?.name)} onProfile={onProfile} action={wide ? blockBtn : undefined} />
      <div className="st-page st-page--fab">
        <Tabs label="Month" idPrefix="dash" items={DASH_MONTHS.map(p => ({ id:p.key, label:p.label }))} value={monthKeyId} onChange={setMonthKeyId} />
        <div className="st-dash" {...tabPanelProps("dash", monthKeyId)}>
          <dl className="st-stats st-stats--dash">
            <Stat Icon={Ban} label="Blocked" value={stats.blocked} tone="primary" />
            <Stat Icon={CalendarPlus} label="Available" value={stats.unblocked} tone="neutral" />
            <Stat Icon={Sun} label="Weekends" value={countWeekends(pill.year, pill.month)} tone="coral" />
            <Stat Icon={Check} label="Paid days" value={stats.paid} tone="success" />
            <Stat Icon={Clock} label="Unpaid days" value={stats.unpaid} tone="warning" />
          </dl>
          <section className="st-hero" aria-label={`Total earned in ${pill.label}`}>
            <p className="st-hero__label">Total earned in {pill.label}</p>
            <p className="st-hero__value">{money(stats.earned)}</p>
            {change !== null && <Badge tone={change >= 0 ? "success" : "error"} Icon={change >= 0 ? TrendingUp : TrendingDown}>{Math.abs(change)}% {change >= 0 ? "more" : "less"} than last month</Badge>}
          </section>
        </div>

        <section className="st-stack" aria-labelledby="recent-h">
          <div className="st-section-head">
            <h2 className="bl-h4" id="recent-h">Recent assignments</h2>
            {recent.length > 2 && <Button variant="ghost" aria-expanded={showAll} onClick={() => setShowAll(s => !s)}>{showAll ? "View less" : "View all"}</Button>}
          </div>
          {recent.length === 0
            ? <EmptyState Icon={CalendarDays} title="No assignments yet" text="Days you have worked will show up here." />
            : <ul className="st-list st-list--grid">{rows.map(r => (
                <li key={r.id} className="bl-card st-compact">
                  <ListRow district={r.district} title={r.school}
                    lines={[r.district, `${formatShort(r.y, r.m, r.day)} · ${shiftLabel(r.shift)}`]}
                    end={<><span className="st-amount">{money(r.amount)}</span><StatusBadge status={r.status} /></>} />
                </li>))}</ul>}
        </section>
      </div>
      {!wide && <div className="st-fab"><Button size="lg" icon={<Icon as={Plus} />} onClick={() => onBlock(TODAY_SIM.year, TODAY_SIM.month)}>Block days</Button></div>}
    </>
  );
}

/* ─── Schedule ─── */
const SCHEDULE_FILTERS = [
  { id:"all", label:"All activity" }, { id:"CMS", label:"CMS" }, { id:"Cabarrus County", label:"Cabarrus County" },
];
const PAST_STEP = 7;

function ScheduleScreen({ user, scheduleData, setScheduleData, onProfile, onBlock }) {
  const [calYear, setCalYear] = useState(TODAY_SIM.year);
  const [calMonth, setCalMonth] = useState(TODAY_SIM.month);
  const [filter, setFilter] = useState("all");
  const [selDay, setSelDay] = useState(TODAY_SIM.day);
  const [earlier, setEarlier] = useState(0);           // number of extra past days revealed
  const [drawerDay, setDrawerDay] = useState(null);
  const wide = useMedia(BP_TABLET);
  const rootRef = useRef(null), stickyRef = useRef(null);
  const programmatic = useRef(false), pendingScroll = useRef(null);

  const key = monthKey(calYear, calMonth);
  const raw = scheduleData[key] || [];
  const dayMap = useMemo(() => { const m = {}; raw.forEach(e => { m[e.day] = e; }); return m; }, [raw]);
  const isCurrentMonth = calYear === TODAY_SIM.year && calMonth === TODAY_SIM.month;
  const pass = (e) => filter === "all" || e.district === filter;
  const todayEntry = isCurrentMonth ? raw.find(e => e.day === TODAY_SIM.day) : null;
  const pastAll = raw.filter(e => isSimPast(calYear, calMonth, e.day) && pass(e)).sort((a, b) => a.day - b.day);
  const pastShown = earlier > 0 ? pastAll.slice(-earlier) : [];
  const future = raw.filter(e => isSimFuture(calYear, calMonth, e.day) && pass(e));
  const showToday = todayEntry && pass(todayEntry);
  const hasMorePast = pastAll.length > pastShown.length;

  // Keep the sticky offset in a CSS variable so cards scroll to just below the calendar.
  useEffect(() => {
    const root = rootRef.current, sticky = stickyRef.current; if (!root || !sticky) return;
    const measure = () => {
      // Phone: the calendar sits above the list, so cards scroll to just below it. Split view: it sits beside the list, so only the header counts.
      const isSticky = getComputedStyle(sticky).position === "sticky" && !wide;
      const header = document.querySelector(".st-header")?.getBoundingClientRect().height ?? 0;
      root.style.setProperty("--st-sticky-h", `${header + (isSticky ? sticky.getBoundingClientRect().height : 0)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(sticky);
    return () => ro.disconnect();
  }, [wide]);

  // List scroll updates which day is highlighted in the calendar.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (programmatic.current || document.querySelector('.st-cal[data-expanded="true"]:not([data-fixed])')) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const limit = parseFloat(rootRef.current?.style.getPropertyValue("--st-sticky-h")) || 0;
        const cards = [...document.querySelectorAll(".st-daycard[id^='day-']")];
        const top = cards.find(c => c.getBoundingClientRect().bottom > limit + 8);
        if (top) setSelDay(Number(top.id.slice(4)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const scrollToDay = (d) => {
    const el = document.getElementById(`day-${d}`); if (!el) return;
    programmatic.current = true;
    el.scrollIntoView({ block:"start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setTimeout(() => { programmatic.current = false; }, 700);
  };
  useEffect(() => { if (pendingScroll.current !== null) { scrollToDay(pendingScroll.current); pendingScroll.current = null; } });
  useEffect(() => { const t = setTimeout(() => { if (showToday) scrollToDay(TODAY_SIM.day); }, 150); return () => clearTimeout(t); }, []); // eslint-disable-line

  useEffect(() => { setEarlier(0); }, [calYear, calMonth, filter]);

  const changeMonth = (dir) => {
    let m = calMonth + dir, y = calYear;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    setCalMonth(m); setCalYear(y); setSelDay(null); window.scrollTo({ top:0 });
  };
  const onDayTap = (d) => {
    setSelDay(d);
    const entry = dayMap[d];
    if (!entry || !pass(entry)) return;
    if (isSimPast(calYear, calMonth, d) && !pastShown.some(e => e.day === d)) setEarlier(pastAll.filter(e => e.day >= d).length);
    pendingScroll.current = d;
  };

  const patch = (day, fields) => setScheduleData(prev => ({ ...prev, [key]: (prev[key] || []).map(e => e.day === day ? { ...e, ...fields } : e) }));
  const unblockAssign = (entry) => { patch(entry.day, { status:"unblocked", district:null, schoolIdx:null }); setDrawerDay(entry.day); };
  const liveEntry = drawerDay !== null ? raw.find(e => e.day === drawerDay) : null;

  const blockBtn = <Button icon={<Icon as={Plus} />} onClick={() => onBlock(calYear, calMonth)}>Block days</Button>;
  const card = (e, today, past) => (
    <DayCard key={e.day} entry={e} year={calYear} month={calMonth} selected={e.day === selDay} today={today} past={past}
      onOpen={(x) => setDrawerDay(x.day)} onUnblockAssign={unblockAssign} />
  );

  return (
    <div ref={rootRef}>
      <ScreenHeader title="Schedule" initials={initialsOf(user?.name)} onProfile={onProfile} action={wide ? blockBtn : undefined} />
      <div className={wide ? "st-split" : undefined}>
      <div className={wide ? "st-split__side" : "st-sticky"} ref={stickyRef}>
        <ScheduleCalendar year={calYear} month={calMonth} dayMap={dayMap} selDay={selDay} onDayTap={onDayTap} onMonthChange={changeMonth} fixed={wide} />
        <Tabs label="Filter schedule" idPrefix="sched" items={SCHEDULE_FILTERS} value={filter} onChange={setFilter} />
      </div>
      <div className="st-page st-page--fab" {...tabPanelProps("sched", filter)}>
        {raw.length === 0
          ? <EmptyState Icon={CalendarOff} title="Nothing scheduled" text="No days are blocked or available in this month yet. Use Block days to add some." />
          : (
            <>
              {hasMorePast && <Button variant="secondary" block icon={<Icon as={ChevronUp} size="sm" />} onClick={() => setEarlier(n => n + PAST_STEP)}>Show earlier days</Button>}
              <ul className="st-daylist">
                {pastShown.map(e => card(e, false, true))}
                {showToday && card(todayEntry, true, false)}
                {filter === "all" && isCurrentMonth && !todayEntry && (
                  <li className="st-note" data-today id="day-today-note">{formatShort(calYear, calMonth, TODAY_SIM.day)}: no assignments today</li>
                )}
                {future.map(e => card(e, false, false))}
              </ul>
              {!hasMorePast && pastAll.length === 0 && future.length === 0 && !showToday && (
                <EmptyState Icon={CalendarOff} title="No matches" text="No days in this month match the selected filter." />
              )}
            </>
          )}
      </div>
      </div>
      {!wide && <div className="st-fab"><Button size="lg" icon={<Icon as={Plus} />} onClick={() => onBlock(calYear, calMonth)}>Block days</Button></div>}

      {liveEntry && (
        <DaySheet key={liveEntry.day} entry={liveEntry} year={calYear} month={calMonth}
          past={isSimPast(calYear, calMonth, liveEntry.day)} today={isSimToday(calYear, calMonth, liveEntry.day)}
          onClose={() => setDrawerDay(null)}
          onUpdateStatus={(s) => patch(liveEntry.day, { status:s })}
          onUpdateEntry={(f) => patch(liveEntry.day, f)}
          onUnblock={() => patch(liveEntry.day, { status:"unblocked", district:null, schoolIdx:null })} />
      )}
    </div>
  );
}

/* ─── Schools ─── */
const INIT_SCHOOLS_LIST = Object.entries(SCHOOLS).flatMap(([district, schools]) =>
  schools.map((name, idx) => ({ id:`${district}-${idx}`, name, district, rate:DISTRICTS[district].rate })));

function SchoolSheet({ mode, school, onClose, onSave }) {
  const [name, setName] = useState(school?.name ?? "");
  const [district, setDistrict] = useState(school?.district ?? "");
  const [rate, setRate] = useState(school?.rate ?? "");
  const [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!name.trim()) err.name = "Enter a school name.";
    if (!district.trim()) err.district = "Choose a district from the list or type a new one.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const d = district.trim();
    onSave({ id:school?.id ?? `custom-${Date.now()}`, name:name.trim(), district:d, rate:parseFloat(rate) || DISTRICTS[d]?.rate || 0 });
    onClose();
  };
  return (
    <Sheet title={mode === "add" ? "Add school" : "Edit school"} onClose={onClose}>
      <form className="st-stack" onSubmit={submit} noValidate>
        <TextField label="School name" icon={GraduationCap} placeholder="West Boulevard Elementary" value={name} error={errors.name}
          onChange={(e) => { setName(e.target.value); setErrors(x => ({ ...x, name:undefined })); }} />
        <Combobox label="County or district" value={district} error={errors.district} customNoun="district"
          placeholder="Type or choose a district"
          options={Object.keys(DISTRICTS).map(d => ({ value:d, label:d }))}
          onChange={(v) => { setDistrict(v); setErrors(x => ({ ...x, district:undefined })); }}
          onPick={(o) => setRate(DISTRICTS[o.label]?.rate ?? rate)} />
        <TextField label="Default daily rate" prefix="$" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={rate}
          help="Used for new assignments at this school." onChange={(e) => setRate(e.target.value)} />
        <div className="st-sheet__foot"><Button type="submit" block size="lg">{mode === "add" ? "Save school" : "Save changes"}</Button></div>
      </form>
    </Sheet>
  );
}

function SchoolsScreen({ user, onProfile, onSchoolEdit, onSchoolDelete }) {
  const wide = useMedia(BP_TABLET);
  const [schools, setSchools] = useState(INIT_SCHOOLS_LIST);
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState(null);       // {mode, school?}
  const [removing, setRemoving] = useState(null); // school
  const q = query.trim().toLowerCase();
  const filtered = schools.filter(s => s.name.toLowerCase().includes(q) || s.district.toLowerCase().includes(q));
  const groups = [...Object.keys(DISTRICTS), ...new Set(schools.map(s => s.district).filter(d => !DISTRICTS[d]))]
    .filter(d => filtered.some(s => s.district === d));

  const save = (saved) => {
    const existing = schools.find(s => s.id === saved.id);
    if (existing && (existing.name !== saved.name || existing.district !== saved.district)) onSchoolEdit?.(existing.name, saved.name, existing.district, saved.district);
    setSchools(prev => existing ? prev.map(s => s.id === saved.id ? saved : s) : [...prev, saved]);
  };
  const remove = () => {
    onSchoolDelete?.(removing.name, removing.district);
    setSchools(prev => prev.filter(s => s.id !== removing.id));
    setRemoving(null);
  };

  return (
    <>
      <ScreenHeader title="Schools" initials={initialsOf(user?.name)} onProfile={onProfile}
        action={wide ? <Button icon={<Icon as={Plus} />} onClick={() => setSheet({ mode:"add" })}>Add school</Button> : undefined} />
      <div className="st-page st-page--fab">
        <div className="st-search">
          <TextField label="Search schools or districts" icon={Search} type="search" value={query} clearable={query.length > 0}
            onClear={() => setQuery("")} onChange={(e) => setQuery(e.target.value)} placeholder="Myers Park, CMS…" />
        </div>
        {groups.length === 0
          ? <EmptyState Icon={School} title="No schools found" text="Try a different search, or add a new school." />
          : groups.map(dn => {
              const list = filtered.filter(s => s.district === dn);
              return (
                <section key={dn} className="st-stack st-stack--tight" aria-labelledby={`grp-${dn.replace(/\s+/g, "-")}`}>
                  <div className="st-section-head">
                    <h2 className="st-group-title" id={`grp-${dn.replace(/\s+/g, "-")}`}><DistrictChip district={dn} className="st-chip--sm" />{dn}</h2>
                    <span className="bl-caption bl-text-secondary">{list.length} {list.length === 1 ? "school" : "schools"}</span>
                  </div>
                  <ul className="st-list st-list--grid">
                    {list.map(s => (
                      <li key={s.id} className="bl-card st-compact">
                        <ListRow district={s.district} title={s.name} lines={[`${money(s.rate)} per day`]}
                          end={<div className="st-actions-inline">
                            <Button variant="ghost" iconOnly aria-label={`Edit ${s.name}`} onClick={() => setSheet({ mode:"edit", school:s })} icon={<Icon as={Pencil} />} />
                            <Button variant="ghost" iconOnly aria-label={`Remove ${s.name}`} onClick={() => setRemoving(s)} icon={<Icon as={Trash2} />} />
                          </div>} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
        {filtered.length > 0 && <p className="bl-body-sm bl-text-secondary st-center">Showing {filtered.length} {filtered.length === 1 ? "school" : "schools"}</p>}
      </div>
      {!wide && <div className="st-fab"><Button size="lg" icon={<Icon as={Plus} />} onClick={() => setSheet({ mode:"add" })}>Add school</Button></div>}
      {sheet && <SchoolSheet mode={sheet.mode} school={sheet.school} onClose={() => setSheet(null)} onSave={save} />}
      {removing && (
        <ConfirmDialog title="Remove school?" body={`${removing.name} will be removed from your list. Any assignments at this school are removed from your schedule too.`}
          cancelLabel="Keep school" confirmLabel="Remove school" onCancel={() => setRemoving(null)} onConfirm={remove} />
      )}
    </>
  );
}

/* ─── Earnings ─── */
const EXPORT_OPTIONS = [
  { Icon:FileText, label:"Export as PDF", sub:"Full earnings summary" },
  { Icon:Download, label:"Export as CSV", sub:"Spreadsheet-ready format" },
  { Icon:Share2,   label:"Share summary", sub:"Send by message or email" },
];
function ExportSheet({ onClose }) {
  return (
    <Sheet title="Export earnings" onClose={onClose}>
      <ul className="st-list">
        {EXPORT_OPTIONS.map(o => (
          <li key={o.label}>
            <button type="button" className="bl-card bl-card--interactive st-option" onClick={onClose}>
              <span className="st-chip st-chip--plain" aria-hidden="true"><Icon as={o.Icon} /></span>
              <span className="st-row__text"><span className="st-row__title">{o.label}</span><span className="st-row__line">{o.sub}</span></span>
              <Icon as={ChevronRight} size="sm" />
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

const formatRowDate = (y, m, d) => new Date(y, m, d).toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });

function EarningsScreen({ user, scheduleData, onProfile }) {
  const wide = useMedia(BP_TABLET), desktop = useMedia(BP_DESKTOP);
  const [active, setActive] = useState(`${TODAY_SIM.year}-${TODAY_SIM.month}`);
  const [showExport, setShowExport] = useState(false);
  const txns = useMemo(() => buildTransactions(scheduleData), [scheduleData]);
  const pills = Array.from({ length:4 }, (_, i) => {
    let m = TODAY_SIM.month - i, y = TODAY_SIM.year; if (m < 0) { m += 12; y--; }
    return { id:`${y}-${m}`, month:m, year:y, label:MONTH_NAMES[m].slice(0, 3) + (y !== TODAY_SIM.year ? ` ’${String(y).slice(2)}` : "") };
  });
  const pill = pills.find(p => p.id === active) ?? pills[0];
  const monthTxns = txns.filter(t => t.month === pill.month && t.year === pill.year);
  const sum = (list, s) => list.filter(t => t.status === s).reduce((a, t) => a + t.amount, 0);
  const yearly = sum(txns.filter(t => t.year === pill.year), "paid");
  const lastYear = sum(txns.filter(t => t.year === pill.year - 1), "paid");
  const yoy = lastYear > 0 ? Math.round(((yearly - lastYear) / lastYear) * 100) : null;

  return (
    <>
      <ScreenHeader title="Earnings" initials={initialsOf(user?.name)} onProfile={onProfile}
        action={wide ? <Button icon={<Icon as={Download} />} onClick={() => setShowExport(true)}>Export</Button> : undefined} />
      <div className="st-page st-page--fab">
        <section className="st-hero st-hero--wide" aria-label={`Yearly total ${pill.year}`}>
          <p className="st-hero__label">Yearly total {pill.year}</p>
          <p className="st-hero__value">{money(yearly)}</p>
          {yoy !== null && <Badge tone={yoy >= 0 ? "success" : "error"} Icon={yoy >= 0 ? TrendingUp : TrendingDown}>{Math.abs(yoy)}% {yoy >= 0 ? "more" : "less"} than last year</Badge>}
        </section>
        <Tabs label="Month" idPrefix="earn" items={pills.map(p => ({ id:p.id, label:p.label }))} value={pill.id} onChange={setActive} />
        <div className="st-stack" {...tabPanelProps("earn", pill.id)}>
          <dl className="st-stats st-stats--earn">
            <Stat Icon={Check} label="Earned" value={money(sum(monthTxns, "paid"))} tone="success" />
            <Stat Icon={Clock} label="Unpaid" value={money(sum(monthTxns, "unpaid"))} tone="warning" />
            {wide && <Stat Icon={CalendarCheck} label="Days worked" value={monthTxns.length} tone="primary" />}
          </dl>
          <section className="st-stack" aria-labelledby="txn-h">
            <h2 className="bl-h4" id="txn-h">{MONTH_NAMES[pill.month]} transactions</h2>
            {monthTxns.length === 0
              ? <EmptyState Icon={Banknote} title="No transactions" text="There are no paid or unpaid days in this month." />
              : desktop
                ? (
                  <div className="bl-table-wrap">
                    <table className="bl-table" aria-labelledby="txn-h">
                      <thead>
                        <tr><th scope="col">Date</th><th scope="col">School</th><th scope="col">District</th><th scope="col">Shift</th><th scope="col">Status</th><th scope="col" className="is-num">Amount</th></tr>
                      </thead>
                      <tbody>
                        {monthTxns.map(t => (
                          <tr key={t.id}>
                            <th scope="row" className="st-nowrap">{formatRowDate(t.year, t.month, t.day)}</th>
                            <td>{t.school}</td>
                            <td><span className="st-cell-district"><DistrictChip district={t.district} className="st-chip--sm" />{t.district}</span></td>
                            <td className="st-nowrap">{shiftLabel(t.shift)}</td>
                            <td className="st-nowrap"><StatusBadge status={t.status} /></td>
                            <td className="is-num">{money(t.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
                : <ul className="st-list st-list--grid">{monthTxns.map(t => (
                  <li key={t.id} className="bl-card st-compact">
                    <ListRow district={t.district} title={t.school}
                      lines={[t.district, `${formatShort(t.year, t.month, t.day)} · ${shiftLabel(t.shift)}`]}
                      end={<><span className="st-amount">{money(t.amount)}</span><StatusBadge status={t.status} /></>} />
                  </li>))}</ul>}
          </section>
        </div>
      </div>
      {!wide && <div className="st-fab"><Button size="lg" icon={<Icon as={Download} />} onClick={() => setShowExport(true)}>Export</Button></div>}
      {showExport && <ExportSheet onClose={() => setShowExport(false)} />}
    </>
  );
}

/* ─── Profile ─── */
function ProfileSheet({ user, onClose, onLogout }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <Sheet title="Profile" onClose={onClose}>
        <div className="st-stack">
          <div className="st-profile">
            <Avatar size="lg" initials={initialsOf(user.name)} />
            <div><p className="bl-h4">{user.name}</p><p className="bl-body-sm bl-text-secondary">{user.email}</p></div>
          </div>
          <div className="bl-card bl-card--sunken st-compact">
            <ListRow icon={User} title={user.name} lines={["Name"]} />
            <hr className="bl-divider" />
            <ListRow icon={Mail} title={user.email} lines={["Email"]} />
          </div>
          <div className="bl-card bl-card--sunken st-compact">
            <ListRow icon={Shield} title="Your data is private" lines={["Only you can see your schedule and earnings."]} />
          </div>
          <Button variant="secondary" block icon={<Icon as={LogOut} size="sm" />} onClick={() => setConfirming(true)}>Sign out</Button>
          <p className="bl-caption bl-text-secondary st-center">SubTrack v1.0 · Made for substitute teachers</p>
        </div>
      </Sheet>
      {confirming && (
        <ConfirmDialog title="Sign out of SubTrack?" body="You will need to sign in again to see your schedule and earnings."
          cancelLabel="Stay signed in" confirmLabel="Sign out" onCancel={() => setConfirming(false)} onConfirm={onLogout} />
      )}
    </>
  );
}

/* ─── App ─── */
export default function App() {
  const [authStep, setAuthStep] = useState("login");   // "login" | "onboard" | "app"
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scheduleData, setScheduleData] = useState(INIT_SCHEDULE);
  const [assign, setAssign] = useState(null);          // {y, m} | null
  const tabMounted = useRef(false);
  const wide = useMedia(BP_TABLET);

  // Inside the app the theme follows the device light/dark setting (Baseline data-theme hook). Sign in and setup are always dark.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { document.documentElement.dataset.theme = (authStep !== "app" || mq.matches) ? "dark" : "light"; };
    apply(); mq.addEventListener("change", apply);
    document.documentElement.lang = "en"; document.title = "SubTrack";
    document.body.classList.add("bl-body");
    return () => mq.removeEventListener("change", apply);
  }, [authStep]);

  // Move focus to the new screen's heading when the tab changes.
  useEffect(() => {
    if (!tabMounted.current) { tabMounted.current = true; return; }
    window.scrollTo({ top:0 });
    const h = document.querySelector("main h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll:true }); }
  }, [activeTab]);

  const handleLogin = (d) => { if (d.isNew) { setUser({ email:d.email }); setAuthStep("onboard"); } else { setUser(d); setAuthStep("app"); } };
  const handleLogout = () => { setUser(null); setAuthStep("login"); setShowProfile(false); setActiveTab("dashboard"); };

  // A school renamed or moved to another district updates matching assignments.
  const handleSchoolEdit = (oldName, newName, oldDistrict, newDistrict) => setScheduleData(prev => {
    const next = {};
    Object.keys(prev).forEach(k => { next[k] = prev[k].map(e => (e.district === oldDistrict && SCHOOLS[oldDistrict]?.[e.schoolIdx] === oldName) ? { ...e, district:newDistrict } : e); });
    return next;
  });
  // A removed school also removes its assignments.
  const handleSchoolDelete = (schoolName, district) => setScheduleData(prev => {
    const next = {};
    Object.keys(prev).forEach(k => { next[k] = prev[k].filter(e => e.district !== district || SCHOOLS[district]?.[e.schoolIdx] !== schoolName); });
    return next;
  });
  // Lifted from the scheduler so Block days works from the Dashboard too.
  const handleAssignConfirm = (entries) => setScheduleData(prev => {
    const next = { ...prev };
    entries.forEach(({ year, month, day, district, schoolIdx, shift, status }) => {
      const k = monthKey(year, month);
      next[k] = [...(next[k] || []).filter(e => e.day !== day), { day, district, schoolIdx, shift, status }].sort((a, b) => a.day - b.day);
    });
    return next;
  });

  if (authStep === "login") return <LoginScreen onLogin={handleLogin} />;
  if (authStep === "onboard") return <OnboardingScreen email={user?.email ?? ""} onComplete={(d) => { setUser(d); setAuthStep("app"); }} />;

  const common = { user, onProfile: () => setShowProfile(true) };
  const openAssign = (y, m) => setAssign({ y, m });
  return (
    <div className="st-shell">
      <a className="st-skip" href="#main">Skip to content</a>
      {wide && <SideNav active={activeTab} onChange={setActiveTab} name={user?.name} initials={initialsOf(user?.name)} onProfile={() => setShowProfile(true)} />}
      <main id="main" className="st-main">
        {activeTab === "dashboard" && <DashboardScreen {...common} scheduleData={scheduleData} onBlock={openAssign} />}
        {activeTab === "scheduler" && <ScheduleScreen {...common} scheduleData={scheduleData} setScheduleData={setScheduleData} onBlock={openAssign} />}
        {activeTab === "schools" && <SchoolsScreen {...common} onSchoolEdit={handleSchoolEdit} onSchoolDelete={handleSchoolDelete} />}
        {activeTab === "earnings" && <EarningsScreen {...common} scheduleData={scheduleData} />}
      </main>
      {!wide && <BottomNav active={activeTab} onChange={setActiveTab} />}
      {assign && <AssignSheet initialYear={assign.y} initialMonth={assign.m} scheduleData={scheduleData} onClose={() => setAssign(null)} onConfirm={handleAssignConfirm} />}
      {showProfile && user && <ProfileSheet user={user} onClose={() => setShowProfile(false)} onLogout={handleLogout} />}
    </div>
  );
}
