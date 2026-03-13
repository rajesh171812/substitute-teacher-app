'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import {
  UserCircle, CalendarOff, CalendarCheck, Clock, XCircle,
  TrendingUp, TrendingDown, LayoutDashboard, CalendarDays,
  School, DollarSign, Plus, CheckCircle2, X,
  MapPin, Sun, ArrowLeft, Calendar, BookOpen, ChevronUp,
  Ban, Unlock, CheckCircle, ChevronRight,
  Search, Pencil, Trash2, Building2, GraduationCap,
  Wallet, Download, Share2, ChevronDown, FileText,
  Banknote, Timer
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────────────── */
const SF  = `-apple-system,"SF Pro Display","SF Pro Text","Helvetica Neue",Arial,sans-serif`;
const SFR = `-apple-system,"SF Pro Rounded","SF Pro Text","Helvetica Neue",Arial,sans-serif`;
// iOS 18 design tokens
const T = {
  bg:         "#F2F2F7",   // systemGroupedBackground
  card:       "#FFFFFF",
  cardAlt:    "#F2F2F7",
  sep:        "rgba(60,60,67,0.12)",
  fill4:      "rgba(120,120,128,0.12)",   // quaternarySystemFill
  fill3:      "rgba(120,120,128,0.18)",
  fill2:      "rgba(120,120,128,0.24)",
  label:      "#1C1C1E",
  label2:     "#3C3C43",
  label3:     "#8E8E93",
  label4:     "#AEAEB2",
  blue:       "#007AFF",
  green:      "#34C759",
  red:        "#FF3B30",
  orange:     "#FF9500",
  indigo:     "#5856D6",
  teal:       "#30B0C7",
  blueAlpha:  "rgba(0,122,255,0.12)",
  greenAlpha: "rgba(52,199,89,0.12)",
  redAlpha:   "rgba(255,59,48,0.12)",
  r4:   "12px",
  r8:   "16px",
  r12:  "20px",
  r16:  "26px",
  r18:  "30px",  // sheets, cards
  sh:   "0 2px 12px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04)",
  shMd: "0 4px 24px rgba(0,0,0,0.09),0 1px 4px rgba(0,0,0,0.05)",
  shLg: "0 8px 40px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.06)",
};
const TODAY_SIM = { year:2026, month:2, day:10 };

const DISTRICTS = {
  "Cabarrus County":{ rate:119, color:"#3B6FE0", bg:"#EEF3FF", initials:"CC" },
  "CMS":            { rate:129, color:"#7C3AED", bg:"#F3EEFF", initials:"CM" },
  "Rowan County":   { rate:110, color:"#636366", bg:"#F2F2F7", initials:"RC" },
  "Union County":   { rate:115, color:"#D4722A", bg:"#FFF4EC", initials:"UC" },
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

const DASH_DATA = {
  "2026-3":{blocked:12,unblocked:8,paid:5,unpaid:2,earned:595,change:0},
  "2026-4":{blocked:14,unblocked:6,paid:0,unpaid:0,earned:0,  change:0},
  "2026-5":{blocked:8, unblocked:10,paid:0,unpaid:0,earned:0, change:0},
  "2026-6":{blocked:7, unblocked:11,paid:0,unpaid:0,earned:0, change:0},
};

const ASSIGNMENTS = [
  {id:1,initials:"CC",school:"Lincoln Elementary",district:"Cabarrus County",date:"Mar 6", type:"Full Day"},
  {id:2,initials:"CM",school:"North High School",  district:"CMS",            date:"Mar 10",type:"Full Day"},
  {id:3,initials:"RC",school:"Westview Middle",    district:"Rowan County",   date:"Mar 6", type:"Full Day"},
  {id:4,initials:"UC",school:"Maple Elementary",   district:"Union County",   date:"Mar 7", type:"Full Day"},
];

/* ─── Helpers ────────────────────────────────────────────────────── */
const simToday    = () => new Date(TODAY_SIM.year, TODAY_SIM.month, TODAY_SIM.day);
const isSimToday  = (y,m,d) => y===TODAY_SIM.year && m===TODAY_SIM.month && d===TODAY_SIM.day;
const isSimPast   = (y,m,d) => new Date(y,m,d) < simToday();
const isSimFuture = (y,m,d) => new Date(y,m,d) > simToday();

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
function getSchool(district, idx) { return SCHOOLS[district]?.[idx??0]??"Unknown School"; }
function getAmount(district, type) {
  const rate=DISTRICTS[district]?.rate??110;
  return `+$${(type==="Half Day"?rate/2:rate).toFixed(0)}`;
}
function formatDate(year, month, day) {
  return new Date(year,month,day).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}
function formatDateLong(year, month, day) {
  return new Date(year,month,day).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
}

function buildDashMonths() {
  return Array.from({length:4},(_,i)=>{
    let m=TODAY_SIM.month+i, y=TODAY_SIM.year;
    if(m>11){m-=12;y+=1;}
    return {year:y,month:m,label:MONTH_NAMES[m],key:`${y}-${m+1}`};
  });
}
const DASH_MONTHS = buildDashMonths();

/* ─── Hooks ──────────────────────────────────────────────────────── */
function useCountUp(target, ms=650) {
  const [val,setVal]=useState(target);
  const fromRef=useRef(target),rafRef=useRef(null);
  useEffect(()=>{
    const from=fromRef.current,diff=target-from;
    if(!diff)return;
    cancelAnimationFrame(rafRef.current);
    const t0=performance.now();
    const tick=(now)=>{
      const p=Math.min((now-t0)/ms,1),e=p<0.5?2*p*p:-1+(4-2*p)*p;
      setVal(Math.round(from+diff*e));
      if(p<1)rafRef.current=requestAnimationFrame(tick); else fromRef.current=target;
    };
    rafRef.current=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(rafRef.current);
  },[target]);
  return val;
}
function usePress() {
  const [pressed,setPressed]=useState(false);
  return {pressed,bind:{
    onMouseDown:()=>setPressed(true),onMouseUp:()=>setPressed(false),
    onMouseLeave:()=>setPressed(false),onTouchStart:()=>setPressed(true),
    onTouchEnd:()=>setPressed(false),onTouchCancel:()=>setPressed(false),
  }};
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
function StatCard({Icon,iconBg,iconColor,label,value,compact}) {
  const {pressed,bind}=usePress();const num=useCountUp(value);
  return (
    <div {...bind} style={{
      flex:1,minWidth:0,
      background:T.card,
      borderRadius:T.r12,
      padding:compact?"14px 12px 16px":"18px 16px 20px",
      display:"flex",flexDirection:"column",gap:compact?10:12,
      boxShadow:T.sh,
      cursor:"pointer",
      transform:pressed?"scale(0.95)":"scale(1)",
      transition:"transform 0.16s cubic-bezier(.34,1.56,.64,1)",
      WebkitTapHighlightColor:"transparent",userSelect:"none"}}>
      <div style={{
        width:compact?36:42,height:compact?36:42,
        borderRadius:compact?10:12,
        background:iconBg,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon size={compact?18:21} color={iconColor} strokeWidth={1.8}/>
      </div>
      <div>
        <div style={{fontSize:compact?11:12.5,color:T.label3,fontWeight:500,
          letterSpacing:"0.1px",marginBottom:compact?3:4,textTransform:"uppercase",
          letterSpacing:"0.3px"}}>{label}</div>
        <div style={{fontSize:compact?28:34,fontWeight:700,color:T.label,
          letterSpacing:"-1px",lineHeight:1,fontFamily:SFR}}>{num}</div>
      </div>
    </div>
  );
}

function EarningsCard({earned,change}) {
  const num=useCountUp(earned);const pos=change>=0;const TIcon=pos?TrendingUp:TrendingDown;
  return (
    <div style={{
      background:"linear-gradient(145deg,#007AFF 0%,#5856D6 100%)",
      borderRadius:T.r12,padding:"24px 22px 22px",textAlign:"center",
      boxShadow:"0 8px 32px rgba(0,122,255,0.28),0 2px 8px rgba(0,0,0,0.08)"}}>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:600,
        letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:8}}>Total Amount Earned</p>
      <p style={{fontSize:48,fontWeight:800,color:"#fff",
        letterSpacing:"-2.5px",lineHeight:1,marginBottom:12,
        fontVariantNumeric:"tabular-nums",fontFamily:SFR}}>${num.toLocaleString()}.00</p>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,
        color:pos?"rgba(255,255,255,0.9)":"rgba(255,100,80,0.9)",
        fontWeight:600,fontSize:14,
        background:"rgba(255,255,255,0.15)",
        padding:"5px 14px",borderRadius:20,backdropFilter:"blur(8px)"}}>
        <TIcon size={14} strokeWidth={2.5}/>{Math.abs(change)}% from last month
      </span>
    </div>
  );
}

function AssignmentRow({item}) {
  const {pressed,bind}=usePress();
  const dist=DISTRICTS[item.district]??{color:T.label3,bg:T.fill4};
  return (
    <div {...bind} style={{
      background:pressed?T.fill4:T.card,
      borderRadius:T.r8,
      padding:"13px 14px 13px 14px",
      display:"flex",alignItems:"center",gap:12,
      boxShadow:T.sh,
      cursor:"pointer",
      transform:pressed?"scale(0.972)":"scale(1)",
      transition:"transform 0.14s cubic-bezier(.34,1.56,.64,1),background 0.1s",
      WebkitTapHighlightColor:"transparent",userSelect:"none"}}>
      <div style={{width:46,height:46,borderRadius:14,background:dist.bg,color:dist.color,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontWeight:700,fontSize:11,flexShrink:0,
        border:`1px solid ${dist.color}22`}}>{item.initials}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:15.5,color:T.label,letterSpacing:"-0.3px",
          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.school}</div>
        <div style={{fontSize:12,color:dist.color,marginTop:2,fontWeight:500,
          display:"flex",alignItems:"center",gap:3}}>
          <MapPin size={10} strokeWidth={2} color={dist.color}/>{item.district} · ${DISTRICTS[item.district]?.rate??110}/day
        </div>
        <div style={{fontSize:12.5,color:T.label3,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
          <CalendarDays size={11} strokeWidth={1.8} color={T.label4}/>{item.date} · {item.type}
        </div>
      </div>
      <div style={{fontWeight:700,fontSize:15,color:T.green,flexShrink:0}}>{getAmount(item.district,item.type)}</div>
    </div>
  );
}

/* ─── School Picker ─────────────────────────────────────────────── */
function SchoolPicker({day, year, month, onSelect}) {
  const [selDistrict,  setSelDistrict]  = useState(null);
  const [selSchoolIdx, setSelSchoolIdx] = useState(null);
  const [selShift,     setSelShift]     = useState("Full Day Shift");
  const SHIFTS = ["Full Day Shift","Half Day Shift"];
  const districtList = Object.keys(DISTRICTS);
  const schoolList   = selDistrict ? SCHOOLS[selDistrict] : [];
  const canConfirm   = selDistrict && selSchoolIdx !== null;

  return (
    <div>
      {/* Date banner */}
      <div style={{margin:"0 16px 14px",background:"#EEF3FF",borderRadius:14,
        padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:10,background:"#007AFF",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Calendar size={18} color="#fff" strokeWidth={2}/>
        </div>
        <div>
          <p style={{fontSize:11,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
            textTransform:"uppercase",marginBottom:1}}>Assigning for</p>
          <p style={{fontSize:16,fontWeight:700,color:"#1C1C1E",letterSpacing:"-0.3px"}}>
            {formatDateLong(year, month, day)}
          </p>
        </div>
      </div>

      {/* Section label */}
      <p style={{fontSize:12,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
        textTransform:"uppercase",padding:"0 16px",marginBottom:10}}>Select District</p>

      {/* District pills */}
      <div style={{display:"flex",gap:8,padding:"0 16px",overflowX:"auto",marginBottom:14,
        scrollbarWidth:"none"}}>
        {districtList.map(d=>{
          const dist=DISTRICTS[d]; const on=selDistrict===d;
          return (
            <button key={d} onClick={()=>{setSelDistrict(d);setSelSchoolIdx(null);}} style={{
              flexShrink:0,padding:"8px 16px",borderRadius:20,border:"none",fontFamily:SF,
              background:on?dist.color:"#fff",color:on?"#fff":dist.color,
              fontWeight:on?700:500,fontSize:13,cursor:"pointer",
              boxShadow:on?`0 2px 10px ${dist.color}44`:"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.07)",
              transition:"all 0.18s cubic-bezier(.4,0,.2,1)",
              WebkitTapHighlightColor:"transparent"}}>{dist.initials} — {d}</button>
          );
        })}
      </div>

      {/* School list */}
      {selDistrict && <>
        <p style={{fontSize:12,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
          textTransform:"uppercase",padding:"0 16px",marginBottom:10}}>Select School</p>
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {schoolList.map((s,i)=>{
            const dist=DISTRICTS[selDistrict]; const on=selSchoolIdx===i;
            return (
              <button key={i} onClick={()=>setSelSchoolIdx(i)} style={{
                display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                borderRadius:14,border:on?`1.5px solid ${dist.color}`:"1.5px solid transparent",
                background:on?dist.bg:"#fff",cursor:"pointer",fontFamily:SF,textAlign:"left",
                boxShadow:on?`0 2px 10px ${dist.color}22`:"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.06)",
                transition:"all 0.16s cubic-bezier(.4,0,.2,1)",
                WebkitTapHighlightColor:"transparent"}}>
                <div style={{width:38,height:38,borderRadius:10,
                  background:on?dist.color:dist.bg,transition:"background 0.16s",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <School size={17} color={on?"#fff":dist.color} strokeWidth={1.8}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:600,fontSize:14.5,letterSpacing:"-0.2px",
                    color:on?dist.color:"#1C1C1E",
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s}</p>
                  <p style={{fontSize:12,color:"#8E8E93",marginTop:1}}>{dist.initials} · ${dist.rate}/day</p>
                </div>
                {on && <CheckCircle size={18} color={dist.color} strokeWidth={2.2}/>}
              </button>
            );
          })}
        </div>
      </>}

      {/* Shift toggle */}
      {selDistrict && selSchoolIdx!==null && (
        <div style={{padding:"0 16px",marginBottom:14}}>
          <p style={{fontSize:12,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
            textTransform:"uppercase",marginBottom:10}}>Shift Type</p>
          <div style={{display:"flex",gap:8}}>
            {SHIFTS.map(sh=>{
              const on=selShift===sh;
              return (
                <button key={sh} onClick={()=>setSelShift(sh)} style={{
                  flex:1,padding:"11px",borderRadius:12,border:"none",fontFamily:SF,
                  background:on?"#007AFF":"#fff",color:on?"#fff":"#3C3C43",
                  fontWeight:on?600:400,fontSize:14,cursor:"pointer",
                  boxShadow:on?"0 2px 10px rgba(0,122,255,0.32)":"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.06)",
                  transition:"all 0.16s cubic-bezier(.4,0,.2,1)",
                  WebkitTapHighlightColor:"transparent"}}>{sh}</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm */}
      {canConfirm && (
        <div style={{padding:"0 16px",marginBottom:4}}>
          <button onClick={()=>onSelect({district:selDistrict,schoolIdx:selSchoolIdx,shift:selShift})}
            style={{width:"100%",height:52,background:"#007AFF",border:"none",borderRadius:14,
              color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",fontFamily:SF,
              boxShadow:"0 3px 14px rgba(0,122,255,0.38)",letterSpacing:"-0.2px",
              WebkitTapHighlightColor:"transparent"}}>
            Confirm Assignment
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Action Drawer ──────────────────────────────────────────────── */
// isPastCard is passed in so the drawer knows which state to render
function ActionDrawer({entry, year, month, isPastCard, isTodayCard, onClose, onUpdateStatus, onUpdateEntry, onUnblock}) {
  const [visible,          setVisible]          = useState(false);
  const [showSchoolPicker, setShowSchoolPicker] = useState(false);

  const isUnblocked = entry?.status === "unblocked";
  const isPaid      = entry?.status === "paid";
  const isUnpaid    = entry?.status === "unpaid";
  const isBlocked   = entry?.status === "blocked";
  const isFutureCard = !isPastCard && !isTodayCard;

  const dist   = entry?.district ? DISTRICTS[entry.district]                      : null;
  const school = entry?.district ? getSchool(entry.district, entry.schoolIdx)     : null;

  useEffect(()=>{ const t=setTimeout(()=>setVisible(true),20); return()=>clearTimeout(t); },[]);

  const handleClose       = ()=>{ setVisible(false); setTimeout(onClose,340); };
  const handlePayStatus   = (s)=>{ onUpdateStatus(s); handleClose(); };
  const handleUnblockClick= ()=>{ onUnblock(); handleClose(); };
  const handleSchoolSelect= (sel)=>{
    onUpdateEntry({district:sel.district, schoolIdx:sel.schoolIdx, shift:sel.shift, status:"unpaid"});
    handleClose();
  };

  if (!entry) return null;

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,
      background:visible?"rgba(0,0,0,0.5)":"rgba(0,0,0,0)",
      backdropFilter:visible?"blur(20px) saturate(180%)":"blur(0px)",
      WebkitBackdropFilter:visible?"blur(20px) saturate(180%)":"blur(0px)",
      transition:"background 0.34s ease,backdrop-filter 0.34s ease",
      display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:SF}}
      onClick={handleClose}>

      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:430,background:T.bg,
        borderRadius:"32px 32px 0 0",
        paddingBottom:"env(safe-area-inset-bottom,34px)",
        transform:visible?"translateY(0)":"translateY(100%)",
        transition:"transform 0.4s cubic-bezier(0.32,0.72,0,1)",
        boxShadow:"0 -2px 60px rgba(0,0,0,0.22)",
        maxHeight:"92dvh",overflowY:"auto",
      }}>

        {/* Drag handle */}
        <div style={{display:"flex",justifyContent:"center",paddingTop:14,paddingBottom:8}}>
          <div style={{width:36,height:5,borderRadius:3,background:T.fill3}}/>
        </div>

        {/* Date + Dismiss */}
        <div style={{padding:"2px 20px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{fontSize:15,fontWeight:700,color:T.label,letterSpacing:"-0.3px"}}>
            {formatDateLong(year,month,entry.day)}
          </p>
          <button onClick={handleClose} style={{border:"none",
            background:T.fill4,
            color:T.blue,
            fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:SF,
            WebkitTapHighlightColor:"transparent",
            padding:"6px 14px",borderRadius:20}}>
            Done
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════
            STATE 1 — UNBLOCKED (open day, no school yet)
            → Show school picker directly
        ══════════════════════════════════════════════════════════════ */}
        {isUnblocked && (
          <SchoolPicker day={entry.day} year={year} month={month} onSelect={handleSchoolSelect}/>
        )}

        {/* ════════════════════════════════════════════════════════════
            STATE 2 — PAST DATE (paid or unpaid)
            → Entry card (greyed) + Mark Paid / Mark Unpaid buttons
        ══════════════════════════════════════════════════════════════ */}
        {!isUnblocked && isPastCard && (
          <>
            {/* Greyed entry card — no Edit button */}
            <div style={{margin:"0 16px 14px",background:"#fff",borderRadius:16,padding:"14px 16px",
              display:"flex",alignItems:"center",gap:12,opacity:0.72,
              boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 8px rgba(0,0,0,0.06)",
              border:"1.5px solid #F2F2F7"}}>
              <div style={{width:46,height:46,borderRadius:13,background:"#F2F2F7",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:700,fontSize:11,flexShrink:0,color:"#AEAEB2"}}>{dist?.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:700,fontSize:15.5,color:"#AEAEB2",letterSpacing:"-0.3px",
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                  textDecoration:"line-through",textDecorationColor:"#C7C7CC"}}>{school}</p>
                <p style={{fontSize:12,color:"#C7C7CC",marginTop:2,fontWeight:500,
                  display:"flex",alignItems:"center",gap:3}}>
                  <MapPin size={10} strokeWidth={2} color="#C7C7CC"/>{entry.district} · ${dist?.rate}/day
                </p>
                <p style={{fontSize:12,color:"#AEAEB2",marginTop:1}}>{entry.shift}</p>
              </div>
              {/* Read-only status pill */}
              <div style={{padding:"5px 12px",borderRadius:20,
                background:isPaid?"#EEF3FF":"#FFF0F0",flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:700,color:isPaid?"#007AFF":"#FF3B30",letterSpacing:"0.3px"}}>
                  {isPaid?"PAID":"NOT PAID"}
                </span>
              </div>
            </div>

            {/* Mark Paid / Unpaid */}
            <div style={{margin:"0 16px 8px",display:"flex",gap:10}}>
              <PayBtn active={isPaid}   label="Mark Paid"   activeColor="#34C759" activeBg="#EDFAF3"
                inactiveBg="#fff" Icon={CheckCircle} onClick={()=>handlePayStatus("paid")}/>
              <PayBtn active={isUnpaid} label="Mark Unpaid" activeColor="#FF3B30" activeBg="#FFF0F0"
                inactiveBg="#fff" Icon={XCircle}     onClick={()=>handlePayStatus("unpaid")}/>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════
            STATE 3a — TODAY assigned (paid/unpaid)
            → Entry card with Edit + school picker + Unblock
        ══════════════════════════════════════════════════════════════ */}
        {!isUnblocked && isTodayCard && !isBlocked && (
          <>
            <div style={{margin:"0 16px 14px",background:"#fff",borderRadius:16,padding:"14px 16px",
              display:"flex",alignItems:"center",gap:12,
              boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 8px rgba(0,0,0,0.06)"}}>
              <div style={{width:46,height:46,borderRadius:13,background:dist?.bg,color:dist?.color,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:700,fontSize:11,flexShrink:0}}>{dist?.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:700,fontSize:15.5,color:"#1C1C1E",letterSpacing:"-0.3px",
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{school}</p>
                <p style={{fontSize:12,color:dist?.color,marginTop:2,fontWeight:500,
                  display:"flex",alignItems:"center",gap:3}}>
                  <MapPin size={10} strokeWidth={2} color={dist?.color}/>{entry.district} · ${dist?.rate}/day
                </p>
                <p style={{fontSize:12,color:"#8E8E93",marginTop:1}}>{entry.shift}</p>
              </div>
              <button onClick={()=>setShowSchoolPicker(p=>!p)} style={{
                padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:SF,
                background:showSchoolPicker?"#007AFF":"#F2F2F7",flexShrink:0,
                transition:"background 0.18s",WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:12,fontWeight:600,letterSpacing:"0.2px",
                  color:showSchoolPicker?"#fff":"#3C3C43"}}>Edit</span>
              </button>
            </div>
            {showSchoolPicker && (
              <SchoolPicker day={entry.day} year={year} month={month} onSelect={handleSchoolSelect}/>
            )}
            {!showSchoolPicker && (
              <div style={{margin:"0 16px 8px"}}>
                <ActionRow
                  icon={<Unlock size={22} color="#34C759" strokeWidth={1.8}/>}
                  iconBg="#EDFAF3"
                  label="Unblock"
                  sublabel="Clear assignment and return to available"
                  onClick={handleUnblockClick}
                />
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════════════════
            STATE 3b — FUTURE assigned (paid/unpaid)
            → Entry card with Edit + school picker + Unblock (same as today)
        ══════════════════════════════════════════════════════════════ */}
        {!isUnblocked && isFutureCard && !isBlocked && (
          <>
            <div style={{margin:"0 16px 14px",background:"#fff",borderRadius:16,padding:"14px 16px",
              display:"flex",alignItems:"center",gap:12,
              boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 8px rgba(0,0,0,0.06)"}}>
              <div style={{width:46,height:46,borderRadius:13,background:dist?.bg,color:dist?.color,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:700,fontSize:11,flexShrink:0}}>{dist?.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:700,fontSize:15.5,color:"#1C1C1E",letterSpacing:"-0.3px",
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{school}</p>
                <p style={{fontSize:12,color:dist?.color,marginTop:2,fontWeight:500,
                  display:"flex",alignItems:"center",gap:3}}>
                  <MapPin size={10} strokeWidth={2} color={dist?.color}/>{entry.district} · ${dist?.rate}/day
                </p>
                <p style={{fontSize:12,color:"#8E8E93",marginTop:1}}>{entry.shift}</p>
              </div>
              <button onClick={()=>setShowSchoolPicker(p=>!p)} style={{
                padding:"5px 14px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:SF,
                background:showSchoolPicker?"#007AFF":"#F2F2F7",flexShrink:0,
                transition:"background 0.18s",WebkitTapHighlightColor:"transparent"}}>
                <span style={{fontSize:12,fontWeight:600,letterSpacing:"0.2px",
                  color:showSchoolPicker?"#fff":"#3C3C43"}}>Edit</span>
              </button>
            </div>
            {showSchoolPicker && (
              <SchoolPicker day={entry.day} year={year} month={month} onSelect={handleSchoolSelect}/>
            )}
            {!showSchoolPicker && (
              <div style={{margin:"0 16px 8px"}}>
                <ActionRow
                  icon={<Unlock size={22} color="#34C759" strokeWidth={1.8}/>}
                  iconBg="#EDFAF3"
                  label="Unblock"
                  sublabel="Clear assignment and return to available"
                  onClick={handleUnblockClick}
                />
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════════════════
            Blocked entry (today or future) — Unblock only
        ══════════════════════════════════════════════════════════════ */}
        {!isUnblocked && !isPastCard && isBlocked && (
          <>
            <div style={{margin:"0 16px 14px",background:"#fff",borderRadius:16,padding:"14px 16px",
              display:"flex",alignItems:"center",gap:12,
              boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 8px rgba(0,0,0,0.06)"}}>
              <div style={{width:46,height:46,borderRadius:13,background:dist?.bg??'#F2F2F7',color:dist?.color??"#AEAEB2",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:700,fontSize:11,flexShrink:0}}>
                {dist?.initials ?? <Ban size={20} color="#C7C7CC" strokeWidth={1.8}/>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:700,fontSize:15.5,color:"#1C1C1E",letterSpacing:"-0.3px",
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{school ?? "Day Blocked"}</p>
                <p style={{fontSize:12,color:dist?.color??"#C7C7CC",marginTop:2,fontWeight:500,
                  display:"flex",alignItems:"center",gap:3}}>
                  {dist && <MapPin size={10} strokeWidth={2} color={dist.color}/>}
                  {entry.district ? `${entry.district} · $${dist?.rate}/day` : entry.shift}
                </p>
              </div>
            </div>
            <div style={{margin:"0 16px 8px"}}>
              <ActionRow
                icon={<Unlock size={22} color="#34C759" strokeWidth={1.8}/>}
                iconBg="#EDFAF3"
                label="Unblock"
                sublabel="Clear this day and return to available"
                onClick={handleUnblockClick}
              />
            </div>
          </>
        )}

        {/* Cancel */}
        <div style={{margin:"10px 16px 0"}}>
          <button onClick={handleClose} style={{width:"100%",height:56,
            background:T.fill4,border:"none",
            borderRadius:T.r8,color:T.label,fontWeight:600,fontSize:17,cursor:"pointer",fontFamily:SF,
            WebkitTapHighlightColor:"transparent"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ActionRow({icon,iconBg,label,sublabel,labelColor,onClick}) {
  const {pressed,bind}=usePress();
  return (
    <div {...bind} onClick={onClick} style={{
      background:pressed?T.fill4:T.card,
      borderRadius:T.r8,
      padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",
      boxShadow:T.sh,
      transform:pressed?"scale(0.972)":"scale(1)",
      transition:"transform 0.14s cubic-bezier(.34,1.56,.64,1)",
      WebkitTapHighlightColor:"transparent",userSelect:"none"}}>
      <div style={{width:46,height:46,borderRadius:14,background:iconBg,
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{icon}</div>
      <div style={{flex:1}}>
        <p style={{fontWeight:600,fontSize:16,color:labelColor??T.label,letterSpacing:"-0.3px"}}>{label}</p>
        {sublabel&&<p style={{fontSize:13,color:T.label3,marginTop:2}}>{sublabel}</p>}
      </div>
      <ChevronRight size={16} color={T.label4} strokeWidth={2}/>
    </div>
  );
}

function PayBtn({active,label,activeColor,activeBg,inactiveBg,Icon,onClick}) {
  const {pressed,bind}=usePress();
  const iconColor=active?activeColor:T.label3;
  return (
    <button {...bind} onClick={onClick} style={{
      flex:1,height:94,borderRadius:T.r8,
      border:active?`1.5px solid ${activeColor}30`:"1.5px solid transparent",
      background:active?activeBg:T.fill4,cursor:"pointer",fontFamily:SF,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,
      boxShadow:active?`0 4px 16px ${activeColor}28`:"none",
      transform:pressed?"scale(0.93)":"scale(1)",
      transition:"transform 0.14s cubic-bezier(.34,1.56,.64,1),box-shadow 0.15s",
      WebkitTapHighlightColor:"transparent"}}>
      <Icon size={28} color={iconColor} strokeWidth={active?2:1.6}/>
      <span style={{fontSize:13.5,fontWeight:700,color:active?activeColor:T.label2}}>{label}</span>
    </button>
  );
}

function AnimatedCard({children,show}) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(show){const t=setTimeout(()=>setVisible(true),30);return()=>clearTimeout(t);}
    else setVisible(false);
  },[show]);
  return (
    <div style={{overflow:"hidden",
      maxHeight:visible?"200px":"0px",opacity:visible?1:0,
      transform:visible?"translateY(0)":"translateY(-12px)",
      transition:"max-height 0.38s cubic-bezier(0.4,0,0.2,1),opacity 0.32s ease,transform 0.32s cubic-bezier(0.4,0,0.2,1)",
      marginBottom:visible?"10px":"0px"}}>
      {children}
    </div>
  );
}

/* ─── Daily Detail Card ──────────────────────────────────────────── */
function DailyDetailCard({entry,year,month,isSelected,isToday,isPast,innerRef,onTap,onUnblockTap}) {
  const {pressed,bind}=usePress();
  const isPaid      = entry.status==="paid";
  const isUnpaid    = entry.status==="unpaid";
  const isBlocked   = entry.status==="blocked";
  const isUnblocked = entry.status==="unblocked";
  const isFuture    = !isPast && !isToday;

  const dist   = entry.district ? DISTRICTS[entry.district] : null;
  const school = entry.district ? getSchool(entry.district, entry.schoolIdx) : null;

  // ── Styling by state ───────────────────────────────────────────────
  // Past: grey/muted. Today: blue accent. Future: white + grey border, full colour.
  const cardBg     = isPast&&!isToday ? T.card
                   : isToday          ? "#F0F7FF"
                   : isSelected       ? "#F5F9FF"
                   : isUnblocked      ? "#F0FDF6"
                   : T.card;

  const cardBorder = isPast&&!isToday ? `1px solid ${T.sep}`
                   : isToday          ? `1.5px solid ${T.blue}`
                   : isSelected       ? "1.5px solid #BDD7FF"
                   : isUnblocked      ? "1.5px dashed #86EFAC"
                   : `1px solid ${T.sep}`;

  const cardShadow = isToday   ? "0 4px 18px rgba(0,122,255,0.16)"
                   : isPast&&!isToday ? "none"
                   : T.sh;

  // Left bar
  const barColor = isPast&&!isToday ? "#E5E5EA"
                 : isPaid            ? "#007AFF"
                 : isUnpaid          ? "#FF3B30"
                 : isBlocked&&!isFuture ? "#C7C7CC"
                 : isUnblocked       ? "#B0E8CF"
                 : dist?.color ?? "#34C759";  // future assigned or future blocked → district colour

  // District initials chip
  const chipBg    = isPast&&!isToday ? "#F2F2F7" : (dist?.bg ?? "#F2F2F7");
  const chipColor = isPast&&!isToday ? "#AEAEB2" : (dist?.color ?? "#8E8E93");

  // Text colours
  const schoolColor  = isPast&&!isToday ? "#AEAEB2" : "#1C1C1E";
  const distColor    = isPast&&!isToday ? "#C7C7CC"  : (dist?.color ?? "#8E8E93");
  const dateColor    = isToday ? "#007AFF" : isPast&&!isToday ? "#AEAEB2" : "#8E8E93";

  // Past-only badge
  const showBadge = isPast && !isToday && (isPaid || isUnpaid);
  const badgeBg   = isPaid ? "#EEF3FF" : "#FFF0F0";
  const badgeClr  = isPaid ? "#007AFF" : "#FF3B30";
  const badgeLbl  = isPaid ? "PAID" : "NOT PAID";

  return (
    <div ref={innerRef} {...bind}
      onClick={()=>onTap&&onTap(entry)}
      style={{
        background:cardBg, borderRadius:T.r8, border:cardBorder, overflow:"hidden",
        boxShadow:cardShadow,
        transform:pressed?"scale(0.972)":"scale(1)",
        transition:"transform 0.14s cubic-bezier(.34,1.56,.64,1)",
        cursor:"pointer", display:"flex", flexDirection:"column",
        WebkitTapHighlightColor:"transparent", userSelect:"none",
        opacity:isPast&&!isToday ? 0.68 : 1,
      }}>

      {/* ── Main content row ── */}
      <div style={{display:"flex"}}>
        <div style={{width:4,background:barColor,flexShrink:0,borderRadius:"0 0 0 0"}}/>
        <div style={{flex:1,padding:"13px 14px"}}>

          {/* Date row + badge */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <p style={{fontSize:12.5,color:dateColor,
              fontWeight:isToday?600:400,
              textDecoration:isPast&&!isToday?"line-through":"none",
              textDecorationColor:"#C7C7CC"}}>
              {isToday?"Today · ":""}{formatDate(year,month,entry.day)}
            </p>
            {showBadge && (
              <div style={{padding:"3px 10px",borderRadius:20,background:badgeBg}}>
                <span style={{fontSize:11.5,fontWeight:700,color:badgeClr,letterSpacing:"0.4px"}}>{badgeLbl}</span>
              </div>
            )}
          </div>

          {/* School row */}
          {isUnblocked ? (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#F0FDF6",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <CalendarCheck size={20} color="#34C759" strokeWidth={1.7}/>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:15,fontWeight:600,color:"#3C3C43",letterSpacing:"-0.2px",marginBottom:2}}>Available — No school assigned</p>
                <p style={{fontSize:12,color:"#8E8E93"}}>Tap to assign a school for this day</p>
              </div>
            </div>
          ) : isBlocked && !isFuture ? (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#F2F2F7",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ban size={18} color="#C7C7CC" strokeWidth={1.8}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:15,fontWeight:600,color:"#AEAEB2",letterSpacing:"-0.2px",marginBottom:2}}>Day Blocked</p>
                <p style={{fontSize:12,color:"#C7C7CC"}}>{entry.district} · {entry.shift}</p>
              </div>
            </div>
          ) : (
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:12,background:chipBg,
                color:chipColor,display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:700,fontSize:11,flexShrink:0}}>{dist?.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:15.5,fontWeight:700,color:schoolColor,letterSpacing:"-0.3px",marginBottom:2,
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                  textDecoration:isPast&&!isToday?"line-through":"none",textDecorationColor:"#C7C7CC"}}>
                  {school}
                </p>
                <p style={{fontSize:12,color:distColor,fontWeight:500,
                  display:"flex",alignItems:"center",gap:3,marginBottom:1}}>
                  <MapPin size={10} strokeWidth={2} color={distColor}/>
                  {entry.district} · ${dist?.rate}/day
                </p>
                <p style={{fontSize:12,color:"#AEAEB2",display:"flex",alignItems:"center",gap:3}}>
                  <BookOpen size={10} strokeWidth={1.8} color="#D1D1D6"/>{entry.shift}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Inline Unblock strip — only on TODAY blocked cards ── */}
      {isBlocked && isToday && <>
        <div style={{height:"0.5px",background:"#F2F2F7",margin:"0 14px"}}/>
        <button onClick={e=>{e.stopPropagation();onUnblockTap&&onUnblockTap(entry);}}
          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            padding:"11px 16px",background:"transparent",border:"none",
            cursor:"pointer",fontFamily:SF,width:"100%",
            WebkitTapHighlightColor:"transparent"}}>
          <Unlock size={15} color="#34C759" strokeWidth={2.2}/>
          <span style={{fontSize:14,fontWeight:600,color:"#34C759",letterSpacing:"-0.1px"}}>Unblock & Assign School</span>
        </button>
      </>}
    </div>
  );
}

/* ─── Outlook Calendar ───────────────────────────────────────────── */
function OutlookCalendar({year,month,dayMap,selDay,onDayTap,onMonthChange}) {
  const [expanded,setExpanded]=useState(false);
  const defaultRow=(year===TODAY_SIM.year&&month===TODAY_SIM.month)
    ?getWeekRow(TODAY_SIM.year,TODAY_SIM.month,TODAY_SIM.day):0;
  const [visRow,setVisRow]=useState(defaultRow);

  // Sync week strip when selDay changes from outside (list scroll)
  useEffect(()=>{
    if(!expanded && selDay){
      setVisRow(getWeekRow(year,month,selDay));
    }
  },[selDay,month,year,expanded]);

  const dragRef=useRef(null),dragStartY=useRef(0),dragStartExp=useRef(false);
  const isDragging=useRef(false);
  const [dragDeltaH,setDragDeltaH]=useState(0);
  const [isAnimating,setIsAnimating]=useState(false);
  const swipeStartX=useRef(0),swipeStartYsw=useRef(0);

  const firstDow=new Date(year,month,1).getDay();
  const daysInMo=new Date(year,month+1,0).getDate();
  const totalRows=Math.ceil((firstDow+daysInMo)/7);
  const allCells=Array.from({length:firstDow+daysInMo},(_,i)=>i<firstDow?null:i-firstDow+1);

  const ROW_H=52,LEGEND_H=44;
  const collapsedH=ROW_H,expandedH=totalRows*ROW_H+LEGEND_H;
  const baseH=expanded?expandedH:collapsedH;
  const clampedH=Math.max(collapsedH,Math.min(expandedH,baseH+dragDeltaH));
  const displayH=isDragging.current?clampedH:(expanded?expandedH:collapsedH);

  const onPD=(e)=>{dragStartY.current=e.clientY;dragStartExp.current=expanded;isDragging.current=false;setDragDeltaH(0);dragRef.current=true;e.currentTarget.setPointerCapture(e.pointerId);};
  const onPM=(e)=>{if(!dragRef.current)return;const dy=e.clientY-dragStartY.current;if(Math.abs(dy)>4)isDragging.current=true;if(isDragging.current)setDragDeltaH(dy);};
  const onPU=()=>{
    if(!dragRef.current)return;dragRef.current=false;
    if(!isDragging.current){setDragDeltaH(0);return;}
    const thr=(expandedH-collapsedH)*0.3;
    if(!dragStartExp.current&&dragDeltaH>thr)setExpanded(true);
    else if(dragStartExp.current&&dragDeltaH<-thr)setExpanded(false);
    setIsAnimating(true);setDragDeltaH(0);
    setTimeout(()=>setIsAnimating(false),400);
    isDragging.current=false;
  };

  const onWSS=(e)=>{swipeStartX.current=e.touches?.[0]?.clientX??e.clientX;swipeStartYsw.current=e.touches?.[0]?.clientY??e.clientY;};
  const onWSE=(e)=>{
    if(expanded)return;
    const ex=e.changedTouches?.[0]?.clientX??e.clientX;
    const ey=e.changedTouches?.[0]?.clientY??e.clientY;
    const dx=ex-swipeStartX.current,dy=Math.abs(ey-swipeStartYsw.current);
    if(Math.abs(dx)<40||dy>30)return;
    if(dx<0){if(visRow<totalRows-1)setVisRow(r=>r+1);else{onMonthChange(1);setVisRow(0);}}
    else{if(visRow>0)setVisRow(r=>r-1);else onMonthChange(-1);}
  };

  const handleDayTap=(d)=>{
    if(isDragging.current)return;
    if(expanded){setExpanded(false);setVisRow(getWeekRow(year,month,d));setIsAnimating(true);setTimeout(()=>setIsAnimating(false),400);}
    onDayTap(d);
  };

  const renderRow=(rowIdx)=>{
    const cells=allCells.slice(rowIdx*7,(rowIdx+1)*7);
    return (
      <div key={rowIdx} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",height:ROW_H}}>
        {cells.map((d,ci)=>{
          const entry=d?dayMap[d]:null;
          const tod=d?isSimToday(year,month,d):false;
          const past=d?isSimPast(year,month,d):false;
          const sel=d===selDay&&!tod; // today circle takes precedence
          const dow=d?new Date(year,month,d).getDay():-1;
          const isWknd=dow===0||dow===6;
          const isPaid   =entry?.status==="paid";
          const isUnpaid =entry?.status==="unpaid";
          const isBlocked=entry?.status==="blocked";
          const isUnblockedEntry=entry?.status==="unblocked";
          let dotColor=null;
          if(isPaid)dotColor="#007AFF";
          else if(isUnpaid)dotColor="#FF3B30";
          else if(isBlocked)dotColor="#34C759";
          else if(isUnblockedEntry)dotColor="#B0E8CF";
          // Number color
          let numColor="#1C1C1E";
          if(tod)numColor="#fff";
          else if(sel)numColor="#007AFF";
          else if(past)numColor="#C7C7CC";
          else if(isWknd)numColor="#FF3B30";
          else if(isPaid)numColor="#007AFF";
          else if(isUnpaid||isBlocked)numColor="#FF3B30";
          else if(isUnblockedEntry)numColor="#34C759";
          // Circle bg
          let circleBg="transparent";
          if(tod)circleBg="#007AFF";          // today = solid blue
          else if(sel)circleBg="#D6EAFF";    // selected = light blue
          return (
            <div key={ci} onClick={()=>d&&handleDayTap(d)} style={{
              display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:3,cursor:d?"pointer":"default",
              WebkitTapHighlightColor:"transparent"}}>
              {d&&<>
                <div style={{width:36,height:36,borderRadius:"50%",background:circleBg,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  border:sel&&!tod?"1.5px solid #BDD7FF":"none",
                  transition:"background 0.18s cubic-bezier(.4,0,.2,1)",
                  boxShadow:tod?"0 2px 8px rgba(0,122,255,0.4)":sel?"0 1px 6px rgba(0,122,255,0.15)":"none"}}>
                  <span style={{fontSize:15,fontWeight:tod||sel?700:400,color:numColor,
                    textDecoration:past&&!tod?"line-through":"none",
                    textDecorationColor:"#BDBDBD"}}>{d}</span>
                </div>
                <div style={{width:5,height:5,borderRadius:"50%",
                  background:dotColor??"transparent",opacity:dotColor?1:0}}/>
              </>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{background:T.card,borderRadius:T.r12,overflow:"hidden",
      boxShadow:T.sh}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px 6px"}}>
        <button onClick={()=>onMonthChange(-1)} style={{width:32,height:32,borderRadius:"50%",border:"none",
          background:T.fill4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          WebkitTapHighlightColor:"transparent"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.label2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{fontSize:16,fontWeight:700,color:T.label,letterSpacing:"-0.4px"}}>{MONTH_NAMES[month]} {year}</span>
        <button onClick={()=>onMonthChange(1)} style={{width:32,height:32,borderRadius:"50%",border:"none",
          background:T.fill4,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          WebkitTapHighlightColor:"transparent"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.label2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"0 10px 2px"}}>
        {["S","M","T","W","T","F","S"].map((d,i)=>(
          <div key={i} style={{textAlign:"center",fontSize:12,fontWeight:600,
            color:i===0||i===6?T.red:T.label3,paddingBottom:2}}>{d}</div>
        ))}
      </div>
      <div
        style={{height:displayH,overflow:"hidden",padding:"0 8px",
          transition:!isDragging.current&&isAnimating?"height 0.4s cubic-bezier(0.4,0,0.2,1)":"none",
          cursor:expanded?"ns-resize":"grab",touchAction:"none"}}
        onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerCancel={onPU}
        onTouchStart={onWSS} onTouchEnd={onWSE}
        onMouseDown={onWSS} onMouseUp={onWSE}>
        {expanded?Array.from({length:totalRows},(_,r)=>renderRow(r)):renderRow(visRow)}
        <div style={{height:LEGEND_H,borderTop:`0.5px solid ${T.sep}`,
          display:"flex",alignItems:"center",justifyContent:"center",gap:20,
          opacity:expanded?1:0,transition:"opacity 0.2s",pointerEvents:"none"}}>
          {[{color:T.blue,label:"Paid"},{color:T.red,label:"Unpaid"},{color:T.green,label:"Blocked"}].map(({color,label})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:color}}/>
              <span style={{fontSize:11.5,color:T.label2,fontWeight:500}}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",padding:"6px 0 10px",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}
        onClick={()=>{setExpanded(e=>!e);setIsAnimating(true);setTimeout(()=>setIsAnimating(false),400);}}>
        <div style={{width:32,height:4,borderRadius:2,background:T.fill3}}/>
      </div>
    </div>
  );
}

/* ─── Schedule Overview ──────────────────────────────────────────── */
function ScheduleOverview({onBack, scheduleData, setScheduleData}) {
  const [calYear,  setCalYear]  = useState(TODAY_SIM.year);
  const [calMonth, setCalMonth] = useState(TODAY_SIM.month);
  const [filter,   setFilter]   = useState("All Activity");
  const [selDay,   setSelDay]   = useState(TODAY_SIM.day);
  const [pastWeeksShown, setPastWeeksShown] = useState(0);
  const [newlyRevealedDays, setNewlyRevealedDays] = useState(new Set());
  const [drawerEntry, setDrawerEntry] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const scrollRef        = useRef(null);
  const todayRef         = useRef(null);
  const dayRefs          = useRef({});
  const prevScrollTop    = useRef(0);
  const isScrollingToRef = useRef(false);

  const key     = `${calYear}-${calMonth+1}`;
  const rawData = scheduleData[key] || [];
  const dayMap  = {};
  rawData.forEach(e=>{dayMap[e.day]=e;});

  const isCurrentMonth = calYear===TODAY_SIM.year && calMonth===TODAY_SIM.month;
  const todayEntry  = isCurrentMonth ? rawData.find(e=>e.day===TODAY_SIM.day) : null;
  const futureItems = rawData.filter(e=>isSimFuture(calYear,calMonth,e.day));
  const allPastItems = rawData.filter(e=>isSimPast(calYear,calMonth,e.day)).sort((a,b)=>b.day-a.day);

  const applyFilter=(items)=>{
    if(filter==="All Activity")return items;
    if(filter==="Blocked: CMS")return items.filter(e=>e.district==="CMS");
    if(filter==="Blocked: Cabarrus County")return items.filter(e=>e.district==="Cabarrus County");
    return items;
  };

  const pastItemsToShow=allPastItems.slice(0,Math.max(0,pastWeeksShown*7));
  const filteredToday  =todayEntry?applyFilter([todayEntry]):[];
  const filteredFuture =applyFilter(futureItems);
  const filteredPast   =applyFilter(pastItemsToShow);
  const hasMorePast    =allPastItems.length>pastWeeksShown*7;

  const showTodayCard=filter==="All Activity"
    ?filteredToday.length>0
    :filter.startsWith("Blocked")&&todayEntry?.status==="blocked"&&applyFilter([todayEntry]).length>0;

  // Sync scroll → calendar highlight
  const updateSelFromScroll=useCallback(()=>{
    if(isScrollingToRef.current)return;
    const el=scrollRef.current;if(!el)return;
    const st=el.scrollTop;
    let bestDay=null,bestDist=Infinity;
    Object.entries(dayRefs.current).forEach(([day,ref])=>{
      if(!ref)return;
      const top=ref.offsetTop-el.offsetTop;
      const dist=Math.abs(top-st-10);
      if(dist<bestDist){bestDist=dist;bestDay=parseInt(day);}
    });
    if(bestDay&&bestDay!==selDay)setSelDay(bestDay);
  },[selDay]);

  const handleScroll=useCallback(()=>{
    const el=scrollRef.current;if(!el)return;
    const st=el.scrollTop;
    if(st<10&&prevScrollTop.current>st&&hasMorePast){
      const prevCount=pastItemsToShow.length;
      setPastWeeksShown(w=>w+1);
      const nextSlice=allPastItems.slice(prevCount,prevCount+7);
      setNewlyRevealedDays(new Set(nextSlice.map(e=>e.day)));
      setTimeout(()=>{if(scrollRef.current)scrollRef.current.scrollTop=180;},20);
    }
    prevScrollTop.current=st;
    updateSelFromScroll();
  },[hasMorePast,pastItemsToShow.length,allPastItems,updateSelFromScroll]);

  useEffect(()=>{
    const el=scrollRef.current;if(!el)return;
    el.addEventListener("scroll",handleScroll,{passive:true});
    return()=>el.removeEventListener("scroll",handleScroll);
  },[handleScroll]);

  useEffect(()=>{
    setTimeout(()=>{if(todayRef.current)todayRef.current.scrollIntoView({behavior:"smooth",block:"start"});},250);
  },[]);

  useEffect(()=>{setPastWeeksShown(0);setNewlyRevealedDays(new Set());},[calYear,calMonth,filter]);

  const handleMonthChange=(dir)=>{
    setCalMonth(m=>{const nm=m+dir;if(nm<0){setCalYear(y=>y-1);return 11;}if(nm>11){setCalYear(y=>y+1);return 0;}return nm;});
    setSelDay(null);
  };

  // Calendar tap → scroll list
  const handleDayTap=(d)=>{
    setSelDay(d);
    setTimeout(()=>{
      const el=dayRefs.current[d];
      if(el){
        isScrollingToRef.current=true;
        el.scrollIntoView({behavior:"smooth",block:"nearest"});
        setTimeout(()=>{isScrollingToRef.current=false;},700);
      }
    },80);
  };

  // Card tap → open drawer
  const handleCardTap=(entry)=>{ setDrawerEntry(entry); };

  // Unblock button on blocked card → immediately set to unblocked and open drawer in assign mode
  const handleUnblockTap=(entry)=>{
    setScheduleData(prev=>{
      const list=(prev[key]||[]).map(e=>
        e.day===entry.day ? {...e,status:"unblocked",district:null,schoolIdx:null} : e
      );
      return {...prev,[key]:list};
    });
    setDrawerEntry({...entry,status:"unblocked",district:null,schoolIdx:null});
  };

  // Drawer actions
  const handleUpdateStatus=(newStatus)=>{
    if(!drawerEntry)return;
    const k=key;
    setScheduleData(prev=>{
      const list=(prev[k]||[]).map(e=>
        e.day===drawerEntry.day ? {...e,status:newStatus} : e
      );
      return {...prev,[k]:list};
    });
  };
  const handleUpdateEntry=(fields)=>{
    if(!drawerEntry)return;
    setScheduleData(prev=>{
      const list=(prev[key]||[]).map(e=>
        e.day===drawerEntry.day ? {...e,...fields} : e
      );
      return {...prev,[key]:list};
    });
  };
  const handleUnblock=()=>{
    if(!drawerEntry)return;
    // Clear district/school, set status to unblocked — keeps the date in the list
    setScheduleData(prev=>{
      const list=(prev[key]||[]).map(e=>
        e.day===drawerEntry.day
          ? {...e, status:"unblocked", district:null, schoolIdx:null}
          : e
      );
      return {...prev,[key]:list};
    });
  };

  const handleAssignConfirm=(entries)=>{
    setScheduleData(prev=>{
      const next={...prev};
      entries.forEach(({year,month,day,district,schoolIdx,shift,status})=>{
        const k=`${year}-${month+1}`;
        const existing=(next[k]||[]).filter(e=>e.day!==day);
        next[k]=[...existing,{day,district,schoolIdx,shift,status}].sort((a,b)=>a.day-b.day);
      });
      return next;
    });
  };

  const FILTERS=["All Activity","Blocked: CMS","Blocked: Cabarrus County"];

  // Get live entry for drawer (in case status changed)
  const liveDrawerEntry = drawerEntry
    ? (scheduleData[key]||[]).find(e=>e.day===drawerEntry.day) ?? drawerEntry
    : null;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {/* Nav */}
      <div style={{padding:"10px 16px 12px",display:"flex",alignItems:"center",
        justifyContent:"space-between",background:T.bg,
        borderBottom:`0.5px solid ${T.sep}`,flexShrink:0,zIndex:20}}>
        <div style={{width:36}}/>
        <span style={{fontSize:17,fontWeight:700,color:T.label,letterSpacing:"-0.4px"}}>Schedule Overview</span>
        <button style={{width:36,height:36,borderRadius:"50%",border:"none",
          background:`linear-gradient(135deg,${T.blue},#5856D6)`,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 4px 16px rgba(0,122,255,0.36)`,
          WebkitTapHighlightColor:"transparent"}}>
          <UserCircle size={20} color="#fff" strokeWidth={1.8}/>
        </button>
      </div>

      {/* Sticky cal + filters */}
      <div style={{flexShrink:0,background:T.bg,zIndex:10}}>
        <div style={{margin:"12px 16px 0"}}>
          <OutlookCalendar
            year={calYear} month={calMonth} dayMap={dayMap}
            selDay={selDay} onDayTap={handleDayTap} onMonthChange={handleMonthChange}/>
        </div>
        <div style={{padding:"10px 16px 8px",display:"flex",gap:8,overflowX:"auto"}}>
          {FILTERS.map(f=>{
            const on=filter===f;
            return (
              <button key={f} onClick={()=>setFilter(f)} style={{
                flexShrink:0,padding:"8px 16px",borderRadius:24,border:"none",
                background:on?T.blue:T.card,color:on?"#fff":T.label2,
                fontWeight:on?600:500,fontSize:13.5,cursor:"pointer",
                boxShadow:on?`0 4px 14px ${T.blue}44`:T.sh,
                transition:"all 0.2s cubic-bezier(.4,0,.2,1)",
                WebkitTapHighlightColor:"transparent",fontFamily:SF}}>{f}</button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>
        {hasMorePast&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"10px 0 4px",gap:5}}>
            <ChevronUp size={13} color="#C7C7CC" strokeWidth={2}/>
            <span style={{fontSize:12,color:"#C7C7CC"}}>Scroll up for earlier days</span>
          </div>
        )}

        {filteredPast.length>0&&(
          <div style={{padding:"0 16px",display:"flex",flexDirection:"column"}}>
            {filteredPast.map(entry=>(
              <AnimatedCard key={entry.day} show={true}>
                <DailyDetailCard entry={entry} year={calYear} month={calMonth}
                  isSelected={entry.day===selDay} isToday={false} isPast={true}
                  animateIn={newlyRevealedDays.has(entry.day)}
                  innerRef={el=>{dayRefs.current[entry.day]=el;}}
                  onTap={handleCardTap}
                  onUnblockTap={handleUnblockTap}/>
              </AnimatedCard>
            ))}
          </div>
        )}

        {showTodayCard&&filteredToday.map(entry=>(
          <div key={entry.day} ref={todayRef} style={{padding:"8px 16px 0"}}>
            <DailyDetailCard entry={entry} year={calYear} month={calMonth}
              isSelected={entry.day===selDay} isToday={true} isPast={false}
              innerRef={el=>{dayRefs.current[entry.day]=el;}}
              onTap={handleCardTap}
                  onUnblockTap={handleUnblockTap}/>
          </div>
        ))}

        {filter==="All Activity"&&!todayEntry&&isCurrentMonth&&(
          <div ref={todayRef} style={{margin:"8px 16px 0",background:"#fff",borderRadius:16,
            border:"1.5px solid #007AFF",padding:"16px",textAlign:"center",
            boxShadow:"0 2px 14px rgba(0,122,255,0.10)"}}>
            <p style={{fontSize:14,color:"#007AFF",fontWeight:500}}>
              {new Date(calYear,calMonth,TODAY_SIM.day).toLocaleDateString("en-US",{month:"long",day:"numeric"})} — No assignments today
            </p>
          </div>
        )}

        {filteredFuture.length>0&&(
          <div style={{padding:"8px 16px 0",display:"flex",flexDirection:"column",gap:10}}>
            {filteredFuture.map(entry=>(
              <DailyDetailCard key={entry.day} entry={entry} year={calYear} month={calMonth}
                isSelected={entry.day===selDay} isToday={false} isPast={false}
                innerRef={el=>{dayRefs.current[entry.day]=el;}}
                onTap={handleCardTap}
                  onUnblockTap={handleUnblockTap}/>
            ))}
          </div>
        )}

        {rawData.length===0&&(
          <div style={{padding:"40px 24px",textAlign:"center"}}>
            <p style={{fontSize:14,color:"#8E8E93"}}>No schedule data for this month</p>
          </div>
        )}
        <div style={{height:120}}/>
      </div>

      {/* Action Drawer */}
      {liveDrawerEntry&&(
        <ActionDrawer
          entry={liveDrawerEntry}
          year={calYear} month={calMonth}
          isPastCard={isSimPast(calYear,calMonth,liveDrawerEntry.day)}
          isTodayCard={isSimToday(calYear,calMonth,liveDrawerEntry.day)}
          onClose={()=>setDrawerEntry(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateEntry={handleUpdateEntry}
          onUnblock={handleUnblock}
        />
      )}

      {/* + Block FAB */}
      <SchedulerFAB onPress={()=>setShowAssignModal(true)}/>

      {/* Assign Modal */}
      {showAssignModal&&(
        <AssignModal
          onClose={()=>setShowAssignModal(false)}
          initialYear={calYear}
          initialMonth={calMonth}
          onConfirm={handleAssignConfirm}
          scheduleData={scheduleData}
        />
      )}
    </div>
  );
}

/* ─── Scheduler FAB ──────────────────────────────────────────────── */
function SchedulerFAB({onPress}) {
  const {pressed,bind}=usePress();
  return (
    <button {...bind} onClick={onPress} style={{
      position:"fixed",
      bottom:"calc(env(safe-area-inset-bottom,12px) + 76px)",
      right:"max(16px,calc(50vw - 199px))",
      background:`linear-gradient(135deg,${T.blue},#5856D6)`,
      color:"#fff",border:"none",
      borderRadius:30,height:54,padding:"0 24px",
      fontWeight:700,fontSize:16,cursor:"pointer",letterSpacing:"-0.3px",
      boxShadow:pressed?"0 4px 16px rgba(0,122,255,0.3)":"0 6px 28px rgba(0,122,255,0.5)",
      display:"flex",alignItems:"center",gap:8,zIndex:50,
      transform:pressed?"scale(0.91)":"scale(1)",
      transition:"transform 0.15s cubic-bezier(.34,1.56,.64,1),box-shadow 0.15s",
      WebkitTapHighlightColor:"transparent",fontFamily:SF}}>
      <Plus size={20} strokeWidth={2.5}/>Block
    </button>
  );
}

/* ─── Tab Bar ────────────────────────────────────────────────────── */
const TABS=[
  {id:"dashboard",label:"Dashboard",Icon:LayoutDashboard},
  {id:"scheduler",label:"Scheduler", Icon:CalendarDays},
  {id:"schools",  label:"Schools",   Icon:School},
  {id:"earnings", label:"Earnings",  Icon:DollarSign},
];
function TabBar({active,onChange}) {
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:430,
      background:"rgba(249,249,249,0.88)",
      backdropFilter:"saturate(200%) blur(28px)",WebkitBackdropFilter:"saturate(200%) blur(28px)",
      borderTop:`0.5px solid ${T.sep}`,display:"flex",
      paddingBottom:"env(safe-area-inset-bottom,10px)",zIndex:100,fontFamily:SF}}>
      {TABS.map(({id,label,Icon})=>{
        const on=active===id;
        return (
          <button key={id} onClick={()=>onChange(id)} style={{flex:1,border:"none",
            background:"transparent",padding:"8px 0 4px",
            display:"flex",flexDirection:"column",alignItems:"center",gap:3,
            color:on?T.blue:T.label3,cursor:"pointer",fontFamily:SF,
            transition:"color 0.15s",WebkitTapHighlightColor:"transparent"}}>
            <div style={{
              transform:on?"scale(1.08)":"scale(1)",
              transition:"transform 0.2s cubic-bezier(.34,1.56,.64,1)",
              padding:"4px 8px",borderRadius:10,
              background:on?T.blueAlpha:"transparent"}}>
              <Icon size={22} strokeWidth={on?2.2:1.7}/>
            </div>
            <span style={{fontSize:10,fontWeight:on?700:400,letterSpacing:"0.1px"}}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Block Modal ────────────────────────────────────────────────── */
/* ─── Assign Modal (Date picker → School picker → Confirm) ──────── */
// Step 1: date picker grid
// Step 2: school picker (reuses SchoolPicker but with multi-date banner)

function AssignModal({onClose, onConfirm, initialYear, initialMonth, scheduleData}) {
  const [step,       setStep]    = useState("dates");
  const [selDates,   setSelDates]= useState(new Set());   // Set of "Y-M-D" keys
  const [viewYear,   setViewYear]= useState(initialYear  ?? TODAY_SIM.year);
  const [viewMonth,  setViewMonth]=useState(initialMonth ?? TODAY_SIM.month);
  const [visible,    setVisible]  = useState(false);

  // School picker state — single selection for ALL dates
  const [selDistrict,  setSelDistrict]  = useState(null);
  const [selSchoolIdx, setSelSchoolIdx] = useState(null);
  const [selShift,     setSelShift]     = useState("Full Day Shift");
  const SHIFTS = ["Full Day Shift","Half Day Shift"];

  useEffect(()=>{ const t=setTimeout(()=>setVisible(true),20); return()=>clearTimeout(t); },[]);

  const handleClose = ()=>{ setVisible(false); setTimeout(onClose,340); };

  // Build a lookup of existing entries for the current view month
  const getMonthMap = (y,m) => {
    const k = `${y}-${m+1}`;
    const list = (scheduleData||{})[k] || [];
    const map = {};
    list.forEach(e=>{ map[e.day] = e; });
    return map;
  };

  const monthMap = getMonthMap(viewYear, viewMonth);

  const toggleDate = (d)=>{
    const dow = new Date(viewYear,viewMonth,d).getDay();
    if(dow===0||dow===6) return;
    setSelDates(prev=>{
      const n=new Set(prev);
      const k=`${viewYear}-${viewMonth}-${d}`;
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });
  };

  const handleConfirmDates = ()=>{ if(selDates.size>0) setStep("school"); };

  // Single confirm — same school for all selected dates
  const handleConfirmAssign = ()=>{
    if(!selDistrict || selSchoolIdx===null) return;
    const entries = Array.from(selDates).map(k=>{
      const [y,m,d] = k.split("-").map(Number);
      return { year:y, month:m, day:d, district:selDistrict, schoolIdx:selSchoolIdx, shift:selShift, status:"blocked" };
    });
    onConfirm(entries);
    handleClose();
  };

  const changeMonth = (dir)=>{
    let nm = viewMonth+dir, ny = viewYear;
    if(nm<0){ny--;nm=11;} if(nm>11){ny++;nm=0;}
    setViewYear(ny); setViewMonth(nm);
  };

  const firstDow  = new Date(viewYear,viewMonth,1).getDay();
  const daysInMo  = new Date(viewYear,viewMonth+1,0).getDate();
  const distList  = Object.keys(DISTRICTS);
  const schoolList= selDistrict ? SCHOOLS[selDistrict] : [];
  const canConfirm = selDistrict && selSchoolIdx !== null;

  // Summary of selected dates for the school step banner
  const selDatesSummary = Array.from(selDates)
    .map(k=>{ const [y,m,d]=k.split("-").map(Number); return {y,m,d}; })
    .sort((a,b)=>a.y!==b.y?a.y-b.y:a.m!==b.m?a.m-b.m:a.d-b.d);

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,
      background:visible?"rgba(0,0,0,0.45)":"rgba(0,0,0,0)",
      backdropFilter:visible?"blur(8px)":"blur(0px)",
      WebkitBackdropFilter:visible?"blur(8px)":"blur(0px)",
      transition:"background 0.32s ease,backdrop-filter 0.32s ease",
      display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:SF}}
      onClick={handleClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:430,background:"#F2F2F7",
        borderRadius:"32px 32px 0 0",
        paddingBottom:"env(safe-area-inset-bottom,28px)",
        transform:visible?"translateY(0)":"translateY(100%)",
        transition:"transform 0.36s cubic-bezier(0.32,0.72,0,1)",
        boxShadow:"0 -4px 40px rgba(0,0,0,0.18)",
        maxHeight:"92dvh",overflowY:"auto",
      }}>

        {/* Handle */}
        <div style={{display:"flex",justifyContent:"center",paddingTop:12,paddingBottom:6}}>
          <div style={{width:36,height:5,borderRadius:3,background:T.fill3}}/>
        </div>

        {/* Header */}
        <div style={{padding:"4px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {step==="school" && (
              <button onClick={()=>setStep("dates")} style={{border:"none",background:"none",
                color:"#007AFF",fontSize:15,cursor:"pointer",fontFamily:SF,padding:0,
                WebkitTapHighlightColor:"transparent"}}>← Back</button>
            )}
            <p style={{fontSize:17,fontWeight:700,color:"#1C1C1E",letterSpacing:"-0.3px"}}>
              {step==="dates" ? "Select Dates" : "Assign School"}
            </p>
          </div>
          <button onClick={handleClose} style={{border:"none",background:"none",color:"#007AFF",
            fontSize:17,fontWeight:400,cursor:"pointer",fontFamily:SF,WebkitTapHighlightColor:"transparent"}}>
            Dismiss
          </button>
        </div>

        {/* ── STEP 1: Date picker ── */}
        {step==="dates" && (<>

          {/* Month nav */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",marginBottom:12}}>
            <button onClick={()=>changeMonth(-1)} style={{width:34,height:34,borderRadius:"50%",border:"none",
              background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.07)",WebkitTapHighlightColor:"transparent"}}>
              <ChevronUp size={15} color="#1C1C1E" strokeWidth={2.2} style={{transform:"rotate(-90deg)"}}/>
            </button>
            <p style={{fontSize:16,fontWeight:700,color:"#1C1C1E",letterSpacing:"-0.3px"}}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </p>
            <button onClick={()=>changeMonth(1)} style={{width:34,height:34,borderRadius:"50%",border:"none",
              background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.07)",WebkitTapHighlightColor:"transparent"}}>
              <ChevronUp size={15} color="#1C1C1E" strokeWidth={2.2} style={{transform:"rotate(90deg)"}}/>
            </button>
          </div>

          {/* Day labels */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"0 16px 6px"}}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
              <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:"#8E8E93",paddingBottom:4}}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,padding:"0 16px"}}>
            {Array.from({length:firstDow}).map((_,i)=><div key={"sp"+i}/>)}
            {Array.from({length:daysInMo},(_,i)=>i+1).map(d=>{
              const k=`${viewYear}-${viewMonth}-${d}`;
              const sel=selDates.has(k);
              const dow=new Date(viewYear,viewMonth,d).getDay();
              const wknd=dow===0||dow===6;
              const entry=monthMap[d];
              const isBlocked=entry&&entry.status==="blocked";
              const isUnblocked=entry&&entry.status==="unblocked";
              const disabled=wknd;
              return (
                <button key={d} onClick={()=>toggleDate(d)} style={{
                  height:42,borderRadius:10,position:"relative",
                  background: wknd?"rgba(60,60,67,0.06)" : "#fff",
                  border: sel?"2px solid #007AFF":"2px solid transparent",
                  color: wknd?"#C7C7CC" : "#1C1C1E",
                  fontWeight:sel?700:400,fontSize:15,
                  cursor:disabled?"default":"pointer",fontFamily:SF,
                  boxShadow:sel?"0 0 0 0 transparent":"0 1px 3px rgba(0,0,0,0.05)",
                  transition:"all 0.13s cubic-bezier(.4,0,.2,1)",
                  display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:1,
                  WebkitTapHighlightColor:"transparent"}}>
                  {d}
                  {/* Red dot for blocked dates */}
                  {isBlocked && (
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#FF3B30",
                      position:"absolute",bottom:5,left:"50%",transform:"translateX(-50%)"}}/>
                  )}
                  {/* Green dot for available (unblocked) */}
                  {isUnblocked && !sel && (
                    <div style={{width:5,height:5,borderRadius:"50%",background:"#34C759",
                      position:"absolute",bottom:5,left:"50%",transform:"translateX(-50%)"}}/>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{display:"flex",gap:16,padding:"10px 16px 2px",justifyContent:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:2,border:"2px solid #007AFF",background:"transparent"}}/>
              <span style={{fontSize:11,color:"#8E8E93"}}>Selected</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#FF3B30"}}/>
              <span style={{fontSize:11,color:"#8E8E93"}}>Blocked</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#34C759"}}/>
              <span style={{fontSize:11,color:"#8E8E93"}}>Available</span>
            </div>
          </div>

          {/* Count + Next */}
          <div style={{padding:"12px 16px 0"}}>
            {selDates.size>0 && (
              <p style={{textAlign:"center",marginBottom:12,fontSize:13,color:"#8E8E93"}}>
                <span style={{color:"#007AFF",fontWeight:600}}>{selDates.size}</span> day{selDates.size!==1?"s":""} selected
              </p>
            )}
            <button onClick={handleConfirmDates} style={{
              width:"100%",height:56,background:selDates.size>0?`linear-gradient(135deg,${T.blue},#5856D6)`:"rgba(120,120,128,0.18)",border:"none",
              borderRadius:16,color:"#fff",fontWeight:600,fontSize:17,
              cursor:selDates.size>0?"pointer":"default",fontFamily:SF,
              boxShadow:selDates.size>0?"0 4px 18px rgba(0,122,255,0.38)":"none",
              WebkitTapHighlightColor:"transparent"}}>
              {selDates.size>0 ? `Next — Assign School` : "Select dates to continue"}
            </button>
          </div>
        </>)}

        {/* ── STEP 2: Single school picker for ALL selected dates ── */}
        {step==="school" && (<>

          {/* Dates summary banner */}
          <div style={{margin:"0 16px 16px",background:"#EEF3FF",borderRadius:14,
            padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:11,background:"#007AFF",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Calendar size={18} color="#fff" strokeWidth={2}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:11,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
                textTransform:"uppercase",marginBottom:2}}>Assigning for</p>
              <p style={{fontSize:15,fontWeight:700,color:"#1C1C1E",letterSpacing:"-0.2px"}}>
                {selDatesSummary.length} day{selDatesSummary.length!==1?"s":""} selected
              </p>
              <p style={{fontSize:12,color:"#8E8E93",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {selDatesSummary.slice(0,4).map(({m,d})=>`${MONTH_NAMES[m].slice(0,3)} ${d}`).join(" · ")}{selDatesSummary.length>4?` +${selDatesSummary.length-4} more`:""}
              </p>
            </div>
          </div>

          {/* District pills */}
          <p style={{fontSize:12,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
            textTransform:"uppercase",padding:"0 16px",marginBottom:10}}>Select District</p>
          <div style={{display:"flex",gap:8,padding:"0 16px",overflowX:"auto",marginBottom:14,scrollbarWidth:"none"}}>
            {distList.map(dn=>{
              const dist=DISTRICTS[dn]; const on=selDistrict===dn;
              return (
                <button key={dn} onClick={()=>{setSelDistrict(dn);setSelSchoolIdx(null);}} style={{
                  flexShrink:0,padding:"8px 16px",borderRadius:20,border:"none",fontFamily:SF,
                  background:on?dist.color:"#fff",color:on?"#fff":dist.color,
                  fontWeight:on?700:500,fontSize:13,cursor:"pointer",
                  boxShadow:on?`0 2px 10px ${dist.color}44`:"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.07)",
                  transition:"all 0.18s cubic-bezier(.4,0,.2,1)",
                  WebkitTapHighlightColor:"transparent"}}>{dist.initials} — {dn}</button>
              );
            })}
          </div>

          {/* School list */}
          {selDistrict && <>
            <p style={{fontSize:12,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
              textTransform:"uppercase",padding:"0 16px",marginBottom:10}}>Select School</p>
            <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {schoolList.map((s,i)=>{
                const dist=DISTRICTS[selDistrict]; const on=selSchoolIdx===i;
                return (
                  <button key={i} onClick={()=>setSelSchoolIdx(i)} style={{
                    display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                    borderRadius:14,border:on?`1.5px solid ${dist.color}`:"1.5px solid transparent",
                    background:on?dist.bg:"#fff",cursor:"pointer",fontFamily:SF,textAlign:"left",
                    boxShadow:on?`0 2px 10px ${dist.color}22`:"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.06)",
                    transition:"all 0.16s cubic-bezier(.4,0,.2,1)",
                    WebkitTapHighlightColor:"transparent"}}>
                    <div style={{width:38,height:38,borderRadius:10,
                      background:on?dist.color:dist.bg,transition:"background 0.16s",
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <School size={17} color={on?"#fff":dist.color} strokeWidth={1.8}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontWeight:600,fontSize:14.5,letterSpacing:"-0.2px",
                        color:on?dist.color:"#1C1C1E",
                        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s}</p>
                      <p style={{fontSize:12,color:"#8E8E93",marginTop:1}}>{dist.initials} · ${dist.rate}/day</p>
                    </div>
                    {on && <CheckCircle size={18} color={dist.color} strokeWidth={2.2}/>}
                  </button>
                );
              })}
            </div>
          </>}

          {/* Shift toggle */}
          {selDistrict && selSchoolIdx!==null && (
            <div style={{padding:"0 16px",marginBottom:14}}>
              <p style={{fontSize:12,fontWeight:600,color:"#8E8E93",letterSpacing:"0.4px",
                textTransform:"uppercase",marginBottom:10}}>Shift Type</p>
              <div style={{display:"flex",gap:8}}>
                {SHIFTS.map(sh=>{
                  const on=selShift===sh;
                  return (
                    <button key={sh} onClick={()=>setSelShift(sh)} style={{
                      flex:1,padding:"11px",borderRadius:12,border:"none",fontFamily:SF,
                      background:on?"#007AFF":"#fff",color:on?"#fff":"#3C3C43",
                      fontWeight:on?600:400,fontSize:14,cursor:"pointer",
                      boxShadow:on?"0 2px 10px rgba(0,122,255,0.32)":"0 1px 0 rgba(0,0,0,0.04),0 1px 6px rgba(0,0,0,0.06)",
                      transition:"all 0.16s cubic-bezier(.4,0,.2,1)",
                      WebkitTapHighlightColor:"transparent"}}>{sh}</button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirm all */}
          <div style={{padding:"0 16px"}}>
            <button onClick={handleConfirmAssign} style={{
              width:"100%",height:56,background:canConfirm?`linear-gradient(135deg,${T.blue},#5856D6)`:"rgba(120,120,128,0.18)",border:"none",
              borderRadius:T.r8,color:"#fff",fontWeight:700,fontSize:17,
              cursor:canConfirm?"pointer":"default",fontFamily:SF,letterSpacing:"-0.2px",
              boxShadow:canConfirm?"0 4px 18px rgba(0,122,255,0.38)":"none",
              WebkitTapHighlightColor:"transparent"}}>
              {canConfirm
                ? `Confirm ${selDatesSummary.length} Assignment${selDatesSummary.length!==1?"s":""}`
                : "Select a school to continue"}
            </button>
          </div>
        </>)}

        {/* Cancel */}
        <div style={{margin:"12px 16px 0"}}>
          <button onClick={handleClose} style={{width:"100%",height:56,background:T.fill4,border:"none",
            borderRadius:T.r8,color:T.label,fontWeight:600,fontSize:17,cursor:"pointer",fontFamily:SF,
            boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 8px rgba(0,0,0,0.06)",
            WebkitTapHighlightColor:"transparent"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Schools Module ─────────────────────────────────────────────── */

// Build initial school list from SCHOOLS + DISTRICTS constants
const INIT_SCHOOLS_LIST = Object.entries(SCHOOLS).flatMap(([district, schools]) =>
  schools.map((name, idx) => ({
    id: `${district}-${idx}`,
    name,
    district,
    rate: DISTRICTS[district].rate,
  }))
);

function SchoolDrawer({mode, school, onClose, onSave}) {
  const [visible,      setVisible]    = useState(false);
  const [name,         setName]       = useState(school?.name     ?? "");
  const [district,     setDistrict]   = useState(school?.district ?? "");
  const [distInput,    setDistInput]  = useState(school?.district ?? "");
  const [rate,         setRate]       = useState(school?.rate     ?? "");
  const [showSugg,     setShowSugg]   = useState(false);

  useEffect(()=>{ const t=setTimeout(()=>setVisible(true),20); return()=>clearTimeout(t); },[]);

  const handleClose = ()=>{ setVisible(false); setTimeout(onClose,340); };
  const handleSave  = ()=>{
    const finalDistrict = distInput.trim() || district;
    if(!name.trim()||!finalDistrict) return;
    onSave({ id: school?.id ?? `custom-${Date.now()}`, name:name.trim(), district:finalDistrict, rate:parseFloat(rate)||DISTRICTS[finalDistrict]?.rate||0 });
    handleClose();
  };

  const distList    = Object.keys(DISTRICTS);
  const suggestions = distList.filter(d=>d.toLowerCase().includes(distInput.toLowerCase()) && distInput.length>0);
  const finalDistrict = distInput.trim();
  const canSave     = name.trim() && finalDistrict;

  const pickDistrict = (dn)=>{
    setDistrict(dn); setDistInput(dn);
    setRate(DISTRICTS[dn]?.rate ?? rate);
    setShowSugg(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,
      background:visible?"rgba(0,0,0,0.45)":"rgba(0,0,0,0)",
      backdropFilter:visible?"blur(8px)":"blur(0px)",
      WebkitBackdropFilter:visible?"blur(8px)":"blur(0px)",
      transition:"background 0.32s ease,backdrop-filter 0.32s ease",
      display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:SF}}
      onClick={handleClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:430,background:"#F2F2F7",
        borderRadius:"32px 32px 0 0",
        paddingBottom:"env(safe-area-inset-bottom,28px)",
        transform:visible?"translateY(0)":"translateY(100%)",
        transition:"transform 0.36s cubic-bezier(0.32,0.72,0,1)",
        boxShadow:"0 -4px 40px rgba(0,0,0,0.18)",
        maxHeight:"92dvh",overflowY:"auto",
      }}>
        {/* Handle */}
        <div style={{display:"flex",justifyContent:"center",paddingTop:12,paddingBottom:6}}>
          <div style={{width:36,height:5,borderRadius:3,background:T.fill3}}/>
        </div>

        {/* Header */}
        <div style={{padding:"4px 20px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{fontSize:17,fontWeight:700,color:"#1C1C1E",letterSpacing:"-0.3px"}}>
            {mode==="add" ? "Add New School" : "Edit School"}
          </p>
          <button onClick={handleClose} style={{border:"none",background:"none",color:"#007AFF",
            fontSize:17,cursor:"pointer",fontFamily:SF,WebkitTapHighlightColor:"transparent"}}>Dismiss</button>
        </div>

        {/* Icon hero */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:24,gap:8}}>
          <div style={{width:72,height:72,borderRadius:20,background:"#EEF3FF",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <GraduationCap size={34} color="#3B6FE0" strokeWidth={1.6}/>
          </div>
          <p style={{fontSize:13,color:"#8E8E93",textAlign:"center",maxWidth:240,lineHeight:1.4}}>
            {mode==="add" ? "Add a new location to your substitute teaching tracking list." : "Update school details below."}
          </p>
        </div>

        {/* Form */}
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:16}}>

          {/* School Name */}
          <div>
            <p style={{fontSize:13,fontWeight:600,color:"#1C1C1E",marginBottom:8,letterSpacing:"-0.1px"}}>School Name</p>
            <input value={name} onChange={e=>setName(e.target.value)}
              placeholder="e.g. West Boulevard Elementary"
              style={{width:"100%",height:50,borderRadius:14,border:`1px solid ${T.sep}`,
                background:"#fff",padding:"0 14px",fontSize:15,color:"#1C1C1E",
                outline:"none",boxSizing:"border-box",fontFamily:SF,transition:"border-color 0.15s"}}
              onFocus={e=>e.target.style.borderColor=T.blue}
              onBlur={e=>e.target.style.borderColor=T.sep}/>
          </div>

          {/* County / District — combo: type or pick */}
          <div>
            <p style={{fontSize:13,fontWeight:600,color:"#1C1C1E",marginBottom:8,letterSpacing:"-0.1px"}}>County / District</p>
            <div style={{position:"relative"}}>
              <input value={distInput}
                onChange={e=>{ setDistInput(e.target.value); setDistrict(""); setShowSugg(true); }}
                placeholder="Type or select county..."
                style={{width:"100%",height:50,borderRadius:14,border:`1px solid ${T.sep}`,
                  background:"#fff",padding:"0 14px",fontSize:15,color:"#1C1C1E",
                  outline:"none",boxSizing:"border-box",fontFamily:SF,transition:"border-color 0.15s"}}
                onFocus={e=>{ e.target.style.borderColor=T.blue; setShowSugg(true); }}
                onBlur={e=>{ e.target.style.borderColor=T.sep; setTimeout(()=>setShowSugg(false),150); }}/>

              {/* Known district suggestion chips — always shown when focused */}
              {showSugg && (
                <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,
                  background:"#fff",borderRadius:13,zIndex:20,
                  boxShadow:"0 4px 24px rgba(0,0,0,0.12)",overflow:"hidden"}}>
                  {/* Show filtered or all districts */}
                  {(distInput.length>0 ? suggestions : distList).map(dn=>{
                    const d=DISTRICTS[dn]; const on=distInput===dn;
                    return (
                      <button key={dn} onMouseDown={()=>pickDistrict(dn)} style={{
                        width:"100%",padding:"12px 14px",border:"none",
                        background:on?d.bg:"#fff",
                        display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontFamily:SF,
                        borderBottom:"0.5px solid rgba(60,60,67,0.08)",
                        WebkitTapHighlightColor:"transparent"}}>
                        <div style={{width:30,height:30,borderRadius:8,background:on?d.color:d.bg,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:10,fontWeight:700,color:on?"#fff":d.color,flexShrink:0}}>{d.initials}</div>
                        <span style={{fontSize:15,color:on?d.color:"#1C1C1E",fontWeight:on?600:400}}>{dn}</span>
                        {on && <CheckCircle size={16} color={d.color} strokeWidth={2.2} style={{marginLeft:"auto"}}/>}
                      </button>
                    );
                  })}
                  {/* Custom entry hint — if typed value doesn't match any known district */}
                  {distInput.length>0 && !distList.includes(distInput) && (
                    <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:30,height:30,borderRadius:8,background:"#F2F2F7",
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Building2 size={14} color="#8E8E93" strokeWidth={2}/>
                      </div>
                      <span style={{fontSize:13,color:"#8E8E93"}}>Using "<strong style={{color:"#1C1C1E"}}>{distInput}</strong>" as custom district</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Daily Pay Rate */}
          <div>
            <p style={{fontSize:13,fontWeight:600,color:"#1C1C1E",marginBottom:8,letterSpacing:"-0.1px"}}>Default Pay Rate (Daily)</p>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",
                fontSize:15,color:"#8E8E93",pointerEvents:"none"}}>$</span>
              <input type="number" value={rate} onChange={e=>setRate(e.target.value)}
                placeholder="0.00"
                style={{width:"100%",height:50,borderRadius:14,border:`1px solid ${T.sep}`,
                  background:"#fff",padding:"0 14px 0 28px",fontSize:15,color:"#1C1C1E",
                  outline:"none",boxSizing:"border-box",fontFamily:SF,transition:"border-color 0.15s"}}
                onFocus={e=>e.target.style.borderColor=T.blue}
                onBlur={e=>e.target.style.borderColor=T.sep}/>
            </div>
            <p style={{fontSize:12,color:"#8E8E93",marginTop:6}}>This rate will be used for new jobs assigned to this school.</p>
          </div>
        </div>

        {/* Save */}
        <div style={{padding:"24px 16px 0",display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={handleSave} style={{
            width:"100%",height:56,
            background:canSave?`linear-gradient(135deg,${T.blue},#5856D6)`:"rgba(120,120,128,0.18)",
            border:"none",
            borderRadius:T.r8,color:"#fff",fontWeight:700,fontSize:17,
            cursor:canSave?"pointer":"default",fontFamily:SF,letterSpacing:"-0.2px",
            boxShadow:canSave?`0 6px 24px ${T.blue}44`:"none",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            WebkitTapHighlightColor:"transparent"}}>
            <School size={18} strokeWidth={2}/>{mode==="add" ? "Save School" : "Update School"}
          </button>
          <button onClick={handleClose} style={{width:"100%",height:56,background:T.fill4,border:"none",
            borderRadius:T.r8,color:T.label,fontWeight:600,fontSize:17,cursor:"pointer",fontFamily:SF,
            WebkitTapHighlightColor:"transparent"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


function SchoolsTab({onSchoolEdit, onSchoolDelete}) {
  const [schools,    setSchools]   = useState(INIT_SCHOOLS_LIST);
  const [query,      setQuery]     = useState("");
  const [drawer,     setDrawer]    = useState(null); // null | {mode:"add"|"edit", school?}
  const [deleteId,   setDeleteId]  = useState(null);
  const [confirmDel, setConfirmDel]= useState(false);

  const filtered = schools.filter(s=>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.district.toLowerCase().includes(query.toLowerCase())
  );

  const handleSave = (saved) => {
    setSchools(prev => {
      const exists = prev.find(s=>s.id===saved.id);
      if(exists && (exists.name!==saved.name || exists.district!==saved.district)) {
        // Sync schedule when name or district changes
        onSchoolEdit?.(exists.name, saved.name, exists.district, saved.district);
      }
      return exists ? prev.map(s=>s.id===saved.id?saved:s) : [...prev, saved];
    });
  };

  const handleDelete = (id) => {
    setSchools(prev=>{
      const target = prev.find(s=>s.id===id);
      if(target) onSchoolDelete?.(target.name, target.district);
      return prev.filter(s=>s.id!==id);
    });
    setConfirmDel(false); setDeleteId(null);
  };

  const distGroups = Object.keys(DISTRICTS).filter(d=>
    filtered.some(s=>s.district===d)
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",background:T.bg}}>
      {/* Nav bar */}
      <div style={{padding:"10px 16px 12px",display:"flex",alignItems:"center",
        justifyContent:"space-between",background:T.bg,
        borderBottom:`0.5px solid ${T.sep}`,flexShrink:0,zIndex:20}}>
        <div style={{width:36}}/>
        <span style={{fontSize:17,fontWeight:700,color:T.label,letterSpacing:"-0.4px"}}>Schools</span>
        <button style={{width:36,height:36,borderRadius:"50%",border:"none",
          background:`linear-gradient(135deg,${T.blue},#5856D6)`,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 4px 16px rgba(0,122,255,0.36)`,
          WebkitTapHighlightColor:"transparent"}}>
          <UserCircle size={20} color="#fff" strokeWidth={1.8}/>
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:100}}>

      {/* Search */}
      <div style={{padding:"12px 16px 4px"}}>
        <div style={{background:T.card,borderRadius:T.r8,padding:"0 14px",height:48,
          display:"flex",alignItems:"center",gap:8,
          boxShadow:T.sh}}>
          <Search size={16} color={T.label3} strokeWidth={2}/>
          <input
            value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Search schools or districts..."
            style={{flex:1,border:"none",outline:"none",fontSize:15,color:T.label,
              background:"transparent",fontFamily:SF}}/>
          {query && (
            <button onClick={()=>setQuery("")} style={{border:"none",background:"none",
              cursor:"pointer",padding:0,display:"flex",WebkitTapHighlightColor:"transparent"}}>
              <X size={14} color={T.label3} strokeWidth={2}/>
            </button>
          )}
        </div>
      </div>

      {/* School list grouped by district */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:10}}>
        {distGroups.length === 0 && (
          <div style={{textAlign:"center",padding:"40px 0",color:T.label3,fontSize:15}}>
            No schools found
          </div>
        )}
        {distGroups.map(dn=>{
          const dist = DISTRICTS[dn] ?? {color:T.label3,bg:T.fill4,initials:"?"};
          const distSchools = filtered.filter(s=>s.district===dn);
          return (
            <div key={dn}>
              {/* District header */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"0 2px"}}>
                <div style={{width:24,height:24,borderRadius:6,background:dist.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,fontWeight:700,color:dist.color}}>{dist.initials}</div>
                <p style={{fontSize:12,fontWeight:700,color:dist.color,letterSpacing:"0.1px"}}>{dn}</p>
                <p style={{fontSize:12,color:T.label4,marginLeft:"auto"}}>{distSchools.length} school{distSchools.length!==1?"s":""}</p>
              </div>
              {/* School cards */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {distSchools.map(s=>(
                  <div key={s.id} style={{background:T.card,borderRadius:T.r8,padding:"13px 14px",
                    display:"flex",alignItems:"center",gap:12,
                    boxShadow:T.sh}}>
                    {/* Icon */}
                    <div style={{width:44,height:44,borderRadius:12,background:dist.bg,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <School size={20} color={dist.color} strokeWidth={1.8}/>
                    </div>
                    {/* Info */}
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontWeight:600,fontSize:15,color:"#1C1C1E",letterSpacing:"-0.2px",
                        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</p>
                      <p style={{fontSize:12,color:"#8E8E93",marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                        <MapPin size={10} color="#8E8E93" strokeWidth={2}/>{s.district} · ${s.rate}/day
                      </p>
                    </div>
                    {/* Actions */}
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <button onClick={()=>setDrawer({mode:"edit",school:s})} style={{
                        width:34,height:34,borderRadius:10,border:"none",
                        background:"#F2F2F7",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        WebkitTapHighlightColor:"transparent"}}>
                        <Pencil size={15} color="#636366" strokeWidth={2}/>
                      </button>
                      <button onClick={()=>{setDeleteId(s.id);setConfirmDel(true);}} style={{
                        width:34,height:34,borderRadius:10,border:"none",
                        background:"#FFF0F0",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        WebkitTapHighlightColor:"transparent"}}>
                        <Trash2 size={15} color="#FF3B30" strokeWidth={2}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Count footer */}
      {filtered.length>0 && (
        <p style={{textAlign:"center",fontSize:13,color:"#8E8E93",marginTop:20}}>
          Showing {filtered.length} registered location{filtered.length!==1?"s":""}
        </p>
      )}

      {/* FAB */}
      <button onClick={()=>setDrawer({mode:"add"})} style={{
        position:"fixed",bottom:"calc(env(safe-area-inset-bottom,12px) + 76px)",
        right:"max(16px,calc(50vw - 199px))",
        width:52,height:52,borderRadius:"50%",border:"none",background:"#007AFF",
        cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 4px 22px rgba(0,122,255,0.46)",zIndex:50,
        WebkitTapHighlightColor:"transparent"}}>
        <Plus size={22} color="#fff" strokeWidth={2.5}/>
      </button>

      {/* Add/Edit Drawer */}
      {drawer && (
        <SchoolDrawer
          mode={drawer.mode}
          school={drawer.school}
          onClose={()=>setDrawer(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirmation sheet */}
      {confirmDel && (
        <div style={{position:"fixed",inset:0,zIndex:300,
          background:"rgba(0,0,0,0.45)",backdropFilter:"blur(8px)",
          WebkitBackdropFilter:"blur(8px)",
          display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:SF}}
          onClick={()=>{setConfirmDel(false);setDeleteId(null);}}>
          <div onClick={e=>e.stopPropagation()} style={{
            width:"100%",maxWidth:430,background:"#F2F2F7",
            borderRadius:"32px 32px 0 0",padding:"20px 16px",
            paddingBottom:"env(safe-area-inset-bottom,28px)",
            boxShadow:"0 -4px 40px rgba(0,0,0,0.18)"}}>
            <div style={{display:"flex",justifyContent:"center",paddingBottom:16}}>
              <div style={{width:36,height:5,borderRadius:3,background:T.fill3}}/>
            </div>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:16,background:"#FFF0F0",
                display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <Trash2 size={24} color="#FF3B30" strokeWidth={1.8}/>
              </div>
              <p style={{fontSize:17,fontWeight:700,color:"#1C1C1E",marginBottom:6}}>Remove School?</p>
              <p style={{fontSize:14,color:"#8E8E93"}}>This school will be removed from your list.</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>handleDelete(deleteId)} style={{
                width:"100%",height:54,background:"#FF3B30",border:"none",
                borderRadius:T.r8,color:"#fff",fontWeight:700,fontSize:17,cursor:"pointer",
                fontFamily:SF,boxShadow:"0 4px 18px rgba(255,59,48,0.32)",
                WebkitTapHighlightColor:"transparent"}}>Remove</button>
              <button onClick={()=>{setConfirmDel(false);setDeleteId(null);}} style={{
                width:"100%",height:56,background:T.fill4,border:"none",
                borderRadius:T.r8,color:T.label,fontWeight:600,fontSize:17,
                cursor:"pointer",fontFamily:SF,
                boxShadow:"0 1px 0 rgba(0,0,0,0.04),0 1px 8px rgba(0,0,0,0.06)",
                WebkitTapHighlightColor:"transparent"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      </div>{/* end scrollable body */}
    </div>
  );
}

/* ─── Earnings Module ────────────────────────────────────────────── */

// Build transaction list from scheduleData
function buildTransactions(scheduleData) {
  const txns = [];
  Object.entries(scheduleData).forEach(([key, entries]) => {
    const [year, monthPlus1] = key.split("-").map(Number);
    const month = monthPlus1 - 1;
    entries.forEach(e => {
      if (e.status === "paid" || e.status === "unpaid") {
        const dist = DISTRICTS[e.district] ?? { rate: 110, color: "#636366", bg: "#F2F2F7", initials: "?" };
        const rate = e.shift === "Half Day Shift" ? Math.round(dist.rate * 0.5) : dist.rate;
        txns.push({
          id: `${key}-${e.day}`,
          district: e.district,
          school: getSchool(e.district, e.schoolIdx),
          date: new Date(year, month, e.day),
          dateStr: new Date(year, month, e.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          shift: e.shift === "Half Day Shift" ? "Half Day" : "Full Day",
          amount: rate,
          status: e.status, // "paid" | "unpaid"
          year, month, day: e.day,
        });
      }
    });
  });
  return txns.sort((a, b) => b.date - a.date);
}

function ExportSheet({ onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t); }, []);
  const handleClose = () => { setVisible(false); setTimeout(onClose, 340); };

  const options = [
    { icon: <FileText size={22} color="#3B6FE0" strokeWidth={1.8}/>, bg: "#EEF3FF", label: "Export as PDF",     sub: "Full earnings summary" },
    { icon: <Download  size={22} color="#30A05E" strokeWidth={1.8}/>, bg: "#EDFAF3", label: "Export as CSV",     sub: "Spreadsheet-ready format" },
    { icon: <Share2    size={22} color={T.blue}  strokeWidth={1.8}/>, bg: T.blueAlpha, label: "Share Summary",  sub: "Send via Messages or Mail" },
  ];

  return (
    <div style={{
      position:"fixed",inset:0,zIndex:300,
      background:visible?"rgba(0,0,0,0.5)":"rgba(0,0,0,0)",
      backdropFilter:visible?"blur(20px) saturate(180%)":"blur(0px)",
      WebkitBackdropFilter:visible?"blur(20px) saturate(180%)":"blur(0px)",
      transition:"background 0.34s ease,backdrop-filter 0.34s ease",
      display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:SF}}
      onClick={handleClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%",maxWidth:430,background:T.bg,
        borderRadius:"32px 32px 0 0",
        paddingBottom:"env(safe-area-inset-bottom,34px)",
        transform:visible?"translateY(0)":"translateY(100%)",
        transition:"transform 0.4s cubic-bezier(0.32,0.72,0,1)",
        boxShadow:"0 -2px 60px rgba(0,0,0,0.22)"}}>
        <div style={{display:"flex",justifyContent:"center",paddingTop:14,paddingBottom:8}}>
          <div style={{width:36,height:5,borderRadius:3,background:T.fill3}}/>
        </div>
        <div style={{padding:"4px 20px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{fontSize:18,fontWeight:700,color:T.label,letterSpacing:"-0.4px"}}>Export Earnings</p>
          <button onClick={handleClose} style={{border:"none",background:T.fill4,color:T.blue,
            fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:SF,
            padding:"6px 14px",borderRadius:20,WebkitTapHighlightColor:"transparent"}}>Done</button>
        </div>
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:10}}>
          {options.map((o,i) => (
            <button key={i} onClick={handleClose} style={{
              display:"flex",alignItems:"center",gap:14,
              padding:"14px 16px",borderRadius:T.r8,background:T.card,
              border:"none",cursor:"pointer",fontFamily:SF,textAlign:"left",
              boxShadow:T.sh,WebkitTapHighlightColor:"transparent",width:"100%"}}>
              <div style={{width:46,height:46,borderRadius:14,background:o.bg,
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{o.icon}</div>
              <div style={{flex:1}}>
                <p style={{fontSize:16,fontWeight:600,color:T.label,letterSpacing:"-0.3px"}}>{o.label}</p>
                <p style={{fontSize:13,color:T.label3,marginTop:2}}>{o.sub}</p>
              </div>
              <ChevronRight size={16} color={T.label4} strokeWidth={2}/>
            </button>
          ))}
        </div>
        <div style={{padding:"16px 16px 0"}}>
          <button onClick={handleClose} style={{width:"100%",height:56,background:T.fill4,border:"none",
            borderRadius:T.r8,color:T.label,fontWeight:600,fontSize:17,cursor:"pointer",fontFamily:SF,
            WebkitTapHighlightColor:"transparent"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EarningsTab({ scheduleData }) {
  const [activeMonth,     setActiveMonth]     = useState(TODAY_SIM.month);
  const [activeYear,      setActiveYear]      = useState(TODAY_SIM.year);
  const [showExport,      setShowExport]      = useState(false);

  const allTxns    = buildTransactions(scheduleData);
  // Month pills — last 4 months from TODAY_SIM
  const monthPills = Array.from({length:4},(_,i)=>{
    let m = TODAY_SIM.month - i;
    let y = TODAY_SIM.year;
    if(m < 0){ m += 12; y--; }
    return { month:m, year:y, label: MONTH_NAMES[m].slice(0,3) + (y!==TODAY_SIM.year?` '${String(y).slice(2)}`:"") };
  });

  // Filter by month only
  const monthTxns = allTxns.filter(t =>
    t.month === activeMonth && t.year === activeYear
  );

  const earned  = monthTxns.filter(t=>t.status==="paid").reduce((s,t)=>s+t.amount, 0);
  const pending = monthTxns.filter(t=>t.status==="unpaid").reduce((s,t)=>s+t.amount, 0);

  // Yearly total (current year, all districts)
  const yearlyTotal = allTxns
    .filter(t => t.year === activeYear && t.status === "paid")
    .reduce((s,t) => s+t.amount, 0);

  // Year-over-year comparison (simple: compare to same months last year — use 12.5% hardcoded if no data)
  const lastYearTotal = allTxns.filter(t=>t.year===activeYear-1&&t.status==="paid").reduce((s,t)=>s+t.amount,0);
  const yoyChange = lastYearTotal > 0 ? Math.round(((yearlyTotal-lastYearTotal)/lastYearTotal)*100) : 12.5;

  const monthName = MONTH_NAMES[activeMonth].toUpperCase();

  return (
    <div style={{flex:1,overflowY:"auto",background:T.bg,paddingBottom:100}}>

      {/* ── Yearly Hero ── */}
      <div style={{padding:"20px 20px 0",textAlign:"center"}}>
        <p style={{fontSize:11,fontWeight:700,color:T.label3,letterSpacing:"1px",
          textTransform:"uppercase",marginBottom:8}}>Yearly Total {activeYear}</p>
        <p style={{fontSize:48,fontWeight:800,color:T.label,letterSpacing:"-2.5px",
          lineHeight:1,fontFamily:SFR,fontVariantNumeric:"tabular-nums"}}>
          ${yearlyTotal.toLocaleString()}.00
        </p>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:12,
          background:yoyChange>=0?T.greenAlpha:T.redAlpha,
          padding:"7px 16px",borderRadius:24}}>
          <TrendingUp size={14} color={yoyChange>=0?T.green:T.red} strokeWidth={2.5}/>
          <span style={{fontSize:14,fontWeight:600,
            color:yoyChange>=0?T.green:T.red}}>
            {yoyChange>=0?"+":""}{yoyChange}% from last year
          </span>
        </div>
      </div>

      {/* ── Month Pills ── */}
      <div style={{padding:"12px 16px 0",display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none"}}>
        {monthPills.map(p => {
          const on = p.month===activeMonth && p.year===activeYear;
          return (
            <button key={`${p.year}-${p.month}`}
              onClick={()=>{setActiveMonth(p.month);setActiveYear(p.year);}}
              style={{
                flexShrink:0,padding:"9px 22px",borderRadius:24,border:"none",
                background:on?T.blue:T.card,color:on?"#fff":T.label2,
                fontWeight:on?700:500,fontSize:15,cursor:"pointer",letterSpacing:"-0.2px",
                boxShadow:on?`0 4px 16px ${T.blue}44`:T.sh,
                transition:"all 0.24s cubic-bezier(.34,1.56,.64,1)",
                transform:on?"scale(1.04)":"scale(1)",
                WebkitTapHighlightColor:"transparent",fontFamily:SF}}>{p.label}</button>
          );
        })}
      </div>

      {/* ── Earned / Pending Cards ── */}
      <div style={{padding:"16px 16px 0",display:"flex",gap:12}}>
        {/* Earned */}
        <div style={{flex:1,background:"#F0FDF6",borderRadius:T.r12,padding:"16px 18px 18px",
          border:`1px solid ${T.green}22`,boxShadow:`0 4px 20px ${T.green}18`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
            <div style={{width:28,height:28,borderRadius:8,background:T.green,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <CheckCircle size={15} color="#fff" strokeWidth={2.2}/>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:T.green,letterSpacing:"0.8px",
              textTransform:"uppercase"}}>Earned</span>
          </div>
          <p style={{fontSize:28,fontWeight:800,color:T.green,letterSpacing:"-1px",
            fontFamily:SFR,fontVariantNumeric:"tabular-nums",lineHeight:1}}>
            ${earned.toLocaleString()}.00
          </p>
        </div>
        {/* Pending */}
        <div style={{flex:1,background:"#FFF7ED",borderRadius:T.r12,padding:"16px 18px 18px",
          border:`1px solid ${T.orange}22`,boxShadow:`0 4px 20px ${T.orange}18`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
            <div style={{width:28,height:28,borderRadius:8,background:T.orange,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Timer size={15} color="#fff" strokeWidth={2.2}/>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:T.orange,letterSpacing:"0.8px",
              textTransform:"uppercase"}}>Pending</span>
          </div>
          <p style={{fontSize:28,fontWeight:800,color:T.orange,letterSpacing:"-1px",
            fontFamily:SFR,fontVariantNumeric:"tabular-nums",lineHeight:1}}>
            ${pending.toLocaleString()}.00
          </p>
        </div>
      </div>

      {/* ── Transaction List ── */}
      <div style={{padding:"20px 16px 0"}}>
        <p style={{fontSize:12,fontWeight:700,color:T.label3,letterSpacing:"0.8px",
          textTransform:"uppercase",marginBottom:14}}>{monthName} Transactions</p>

        {monthTxns.length === 0 ? (
          <div style={{textAlign:"center",padding:"40px 0",display:"flex",flexDirection:"column",
            alignItems:"center",gap:10}}>
            <div style={{width:56,height:56,borderRadius:18,background:T.fill4,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Banknote size={26} color={T.label4} strokeWidth={1.6}/>
            </div>
            <p style={{fontSize:16,fontWeight:600,color:T.label2}}>No transactions</p>
            <p style={{fontSize:14,color:T.label3}}>No paid or pending entries for this period</p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column"}}>
            {monthTxns.map((txn, i) => {
              const dist  = DISTRICTS[txn.district] ?? {color:T.label3,bg:T.fill4,initials:"?"};
              const isPaid = txn.status === "paid";
              const isLast = i === monthTxns.length - 1;
              return (
                <div key={txn.id} style={{
                  display:"flex",alignItems:"center",
                  padding:"14px 0",
                  borderBottom: isLast ? "none" : `0.5px solid ${T.sep}`}}>
                  {/* Left: district icon */}
                  <div style={{width:46,height:46,borderRadius:14,background:dist.bg,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    flexShrink:0,marginRight:12,
                    border:`1px solid ${dist.color}18`}}>
                    <span style={{fontSize:11,fontWeight:700,color:dist.color}}>{dist.initials}</span>
                  </div>
                  {/* Center */}
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:15.5,fontWeight:700,color:T.label,
                      letterSpacing:"-0.3px",lineHeight:1.2,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {txn.district ?? txn.school ?? "Unknown"}
                    </p>
                    <p style={{fontSize:13,color:T.label3,marginTop:3}}>
                      {txn.dateStr} · {txn.shift}
                    </p>
                  </div>
                  {/* Right: amount + status */}
                  <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                    <p style={{fontSize:16,fontWeight:700,
                      color:isPaid?T.green:T.orange,
                      letterSpacing:"-0.3px",fontVariantNumeric:"tabular-nums"}}>
                      +${txn.amount}.00
                    </p>
                    <p style={{fontSize:11,fontWeight:700,
                      color:isPaid?T.green:T.orange,
                      letterSpacing:"0.4px",marginTop:3,textTransform:"uppercase"}}>
                      {isPaid?"Deposited":"Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showExport && <ExportSheet onClose={()=>setShowExport(false)}/>}
    </div>
  );
}

// EarningsTab wrapper that includes the nav bar (same pattern as ScheduleOverview)
function EarningsScreen({ scheduleData }) {
  const [showExport, setShowExport] = useState(false);
  const {pressed:fabP, bind:fabBind} = usePress();
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {/* Nav */}
      <div style={{padding:"10px 16px 12px",display:"flex",alignItems:"center",
        justifyContent:"space-between",background:T.bg,
        borderBottom:`0.5px solid ${T.sep}`,flexShrink:0,zIndex:20}}>
        <div style={{width:36}}/>
        <span style={{fontSize:17,fontWeight:700,color:T.label,letterSpacing:"-0.4px"}}>Earnings</span>
        <button style={{width:36,height:36,borderRadius:"50%",border:"none",
          background:`linear-gradient(135deg,${T.blue},#5856D6)`,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 4px 16px rgba(0,122,255,0.36)`,
          WebkitTapHighlightColor:"transparent"}}>
          <UserCircle size={20} color="#fff" strokeWidth={1.8}/>
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <EarningsTab scheduleData={scheduleData}/>
      </div>

      {/* Download FAB */}
      <button {...fabBind} onClick={()=>setShowExport(true)} style={{
        position:"fixed",
        bottom:"calc(env(safe-area-inset-bottom,12px) + 76px)",
        right:"max(16px,calc(50vw - 199px))",
        width:52,height:52,borderRadius:"50%",border:"none",
        background:`linear-gradient(135deg,${T.blue},#5856D6)`,
        cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:fabP?"0 4px 16px rgba(0,122,255,0.3)":"0 4px 22px rgba(0,122,255,0.46)",
        transform:fabP?"scale(0.91)":"scale(1)",
        transition:"transform 0.15s cubic-bezier(.34,1.56,.64,1),box-shadow 0.15s",
        zIndex:50,WebkitTapHighlightColor:"transparent"}}>
        <Download size={20} color="#fff" strokeWidth={2}/>
      </button>

      {showExport && <ExportSheet onClose={()=>setShowExport(false)}/>}
    </div>
  );
}

function PlaceholderTab({label,Icon}) {
  return (
    <div style={{padding:"40px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:12,paddingBottom:120}}>
      <div style={{width:64,height:64,borderRadius:20,background:"#F2F2F7",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon size={28} color="#8E8E93" strokeWidth={1.6}/>
      </div>
      <p style={{fontSize:17,fontWeight:600,color:"#1C1C1E"}}>{label}</p>
      <p style={{fontSize:14,color:"#8E8E93",textAlign:"center"}}>This section is coming soon.</p>
    </div>
  );
}

/* ─── Root App ───────────────────────────────────────────────────── */
export default function App() {
  const [activePillKey,setActivePillKey]=useState(DASH_MONTHS[0].key);
  const [activeTab,    setActiveTab]    =useState("dashboard");
  const [showModal,    setShowModal]    =useState(false);
  const [showAll,      setShowAll]      =useState(false);
  const [scheduleData, setScheduleData] =useState(INIT_SCHEDULE);
  const {pressed:fabP,bind:fabBind}=usePress();
  const activePill=DASH_MONTHS.find(p=>p.key===activePillKey)??DASH_MONTHS[0];
  const data=DASH_DATA[activePillKey]??{blocked:0,unblocked:0,paid:0,unpaid:0,earned:0,change:0};

  // When a school name is edited — update any matching assignments in schedule
  const handleSchoolEdit=(oldName, newName, oldDistrict, newDistrict)=>{
    setScheduleData(prev=>{
      const next={...prev};
      Object.keys(next).forEach(key=>{
        next[key]=next[key].map(e=>{
          if(e.district===oldDistrict){
            const schoolIdx=e.schoolIdx;
            const school=SCHOOLS[oldDistrict]?.[schoolIdx];
            if(school===oldName){
              return {...e, district:newDistrict};
            }
          }
          return e;
        });
      });
      return next;
    });
  };

  // When a school is deleted — remove matching assignments
  const handleSchoolDelete=(schoolName, district)=>{
    setScheduleData(prev=>{
      const next={...prev};
      Object.keys(next).forEach(key=>{
        next[key]=next[key].filter(e=>{
          if(e.district!==district) return true;
          return SCHOOLS[district]?.[e.schoolIdx]!==schoolName;
        });
      });
      return next;
    });
  };
  const visible=showAll?ASSIGNMENTS:ASSIGNMENTS.slice(0,2);

  const globalStyles=`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{-webkit-text-size-adjust:100%}
    body{background:#E5E5EA;font-family:${SF};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
    button{font-family:${SF}}
    input{font-family:${SF}}
    @keyframes slideUp{from{transform:translateY(110%)}to{transform:translateY(0)}}
    ::-webkit-scrollbar{display:none}
    *{scrollbar-width:none}
    input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
  `;

  if(activeTab==="scheduler") {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={{display:"flex",justifyContent:"center",minHeight:"100dvh",background:"#E5E5EA"}}>
          <div style={{width:"100%",maxWidth:430,background:T.bg,height:"100dvh",display:"flex",flexDirection:"column",fontFamily:SF}}>
            <div style={{height:"env(safe-area-inset-top,44px)",flexShrink:0}}/>
            <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              <ScheduleOverview onBack={()=>setActiveTab("dashboard")} scheduleData={scheduleData} setScheduleData={setScheduleData}/>
            </div>
            <TabBar active={activeTab} onChange={setActiveTab}/>
          </div>
        </div>
      </>
    );
  }

  if(activeTab==="earnings") {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={{display:"flex",justifyContent:"center",minHeight:"100dvh",background:"#E5E5EA"}}>
          <div style={{width:"100%",maxWidth:430,background:T.bg,height:"100dvh",display:"flex",flexDirection:"column",fontFamily:SF}}>
            <div style={{height:"env(safe-area-inset-top,44px)",flexShrink:0}}/>
            <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              <EarningsScreen scheduleData={scheduleData}/>
            </div>
            <TabBar active={activeTab} onChange={setActiveTab}/>
          </div>
        </div>
      </>
    );
  }

  if(activeTab==="schools") {
    return (
      <>
        <style>{globalStyles}</style>
        <div style={{display:"flex",justifyContent:"center",minHeight:"100dvh",background:"#E5E5EA"}}>
          <div style={{width:"100%",maxWidth:430,background:T.bg,height:"100dvh",display:"flex",flexDirection:"column",fontFamily:SF}}>
            <div style={{height:"env(safe-area-inset-top,44px)",flexShrink:0}}/>
            <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              <SchoolsTab onSchoolEdit={handleSchoolEdit} onSchoolDelete={handleSchoolDelete}/>
            </div>
            <TabBar active={activeTab} onChange={setActiveTab}/>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{display:"flex",justifyContent:"center",minHeight:"100dvh",background:"#E5E5EA"}}>
        <div style={{width:"100%",maxWidth:430,background:"#F2F2F7",minHeight:"100dvh",overflowX:"hidden",position:"relative",fontFamily:SF}}>
          <div style={{height:"env(safe-area-inset-top,44px)"}}/>
          <div style={{padding:"10px 20px 8px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:13,color:T.label3,fontWeight:500,marginBottom:2,letterSpacing:"-0.1px"}}>
                {new Date(TODAY_SIM.year,TODAY_SIM.month,TODAY_SIM.day).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
              </div>
              <span style={{fontSize:36,fontWeight:800,color:T.label,letterSpacing:"-1.2px",lineHeight:1.05,fontFamily:SFR}}>Hi Santa 👋</span>
            </div>
            <button style={{width:40,height:40,borderRadius:"50%",
              background:"linear-gradient(135deg,#007AFF,#5856D6)",border:"none",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 16px rgba(0,122,255,0.36)",marginTop:4,
              WebkitTapHighlightColor:"transparent"}}>
              <UserCircle size={22} color="#fff" strokeWidth={1.8}/>
            </button>
          </div>

          {activeTab==="dashboard"&&(
            <>
              <div style={{padding:"10px 20px 18px",display:"flex",gap:8,overflowX:"auto"}}>
                {DASH_MONTHS.map(p=>{
                  const on=activePillKey===p.key;
                  return (
                    <button key={p.key} onClick={()=>setActivePillKey(p.key)} style={{
                      flexShrink:0,padding:"9px 22px",borderRadius:24,border:"none",
                      background:on?T.blue:T.card,color:on?"#fff":T.label2,
                      fontWeight:on?700:500,fontSize:15,cursor:"pointer",letterSpacing:"-0.2px",
                      boxShadow:on?`0 4px 16px ${T.blue}44`:T.sh,
                      transition:"all 0.24s cubic-bezier(.34,1.56,.64,1)",
                      transform:on?"scale(1.04)":"scale(1)",
                      WebkitTapHighlightColor:"transparent",fontFamily:SF}}>{p.label}</button>
                  );
                })}
              </div>
              <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
                <div style={{display:"flex",gap:10}}>
                  <StatCard Icon={CalendarOff}   iconBg="#EEF3FF" iconColor="#3B6FE0" label="Blocked"   value={data.blocked}   compact/>
                  <StatCard Icon={CalendarCheck} iconBg="#EDFAF3" iconColor="#30A05E" label="Unblocked" value={data.unblocked} compact/>
                  <StatCard Icon={Sun}           iconBg="#FFF9EC" iconColor="#F59E0B" label="Weekends"  value={countWeekends(activePill.year,activePill.month)} compact/>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <StatCard Icon={Clock}   iconBg="#FFF4EC" iconColor="#D4722A" label="Paid Days"   value={data.paid}/>
                  <StatCard Icon={XCircle} iconBg="#FFF0F0" iconColor="#FF3B30" label="Unpaid Days" value={data.unpaid}/>
                </div>
                <EarningsCard earned={data.earned} change={data.change}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                  <span style={{fontSize:20,fontWeight:700,color:T.label,letterSpacing:"-0.6px"}}>Recent Assignments</span>
                  <button onClick={()=>setShowAll(s=>!s)} style={{border:"none",background:"none",
                    color:T.blue,fontWeight:600,fontSize:15,cursor:"pointer",fontFamily:SF,
                    WebkitTapHighlightColor:"transparent"}}>
                    {showAll?"Show Less":"View All"}
                  </button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,paddingBottom:140}}>
                  {visible.map(item=><AssignmentRow key={item.id} item={item}/>)}
                </div>
              </div>
              <button {...fabBind} onClick={()=>setShowModal(true)} style={{
                position:"fixed",bottom:"calc(env(safe-area-inset-bottom,12px) + 76px)",right:"max(16px,calc(50vw - 199px))",
                background:`linear-gradient(135deg,${T.blue},#5856D6)`,color:"#fff",border:"none",
                borderRadius:30,height:54,padding:"0 24px",
                fontWeight:700,fontSize:16,cursor:"pointer",letterSpacing:"-0.3px",
                boxShadow:fabP?"0 4px 16px rgba(0,122,255,0.3)":"0 6px 28px rgba(0,122,255,0.5)",
                display:"flex",alignItems:"center",gap:8,zIndex:50,
                transform:fabP?"scale(0.91)":"scale(1)",
                transition:"transform 0.15s cubic-bezier(.34,1.56,.64,1),box-shadow 0.15s",
                WebkitTapHighlightColor:"transparent",fontFamily:SF}}>
                <Plus size={20} strokeWidth={2.5}/>Block
              </button>
            </>
          )}

          <TabBar active={activeTab} onChange={setActiveTab}/>
        </div>
      </div>
      {showModal&&<AssignModal
        onClose={()=>setShowModal(false)}
        initialYear={TODAY_SIM.year}
        initialMonth={TODAY_SIM.month}
        onConfirm={()=>{}}
        scheduleData={scheduleData}
      />}
    </>
  );
}
