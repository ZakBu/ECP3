// @ts-nocheck — verbatim порт HTML v7 (Babel); типизация не требуется
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react";
import "./widgetLibraryV7.css";

const V7FluidContext = createContext(false);

export function V7FluidProvider({ children }: { children: ReactNode }) {
  return <V7FluidContext.Provider value={true}>{children}</V7FluidContext.Provider>;
}

export function withV7Fluid<P extends object>(C: ComponentType<P>) {
  function Wrapped(props: P) {
    return (
      <V7FluidContext.Provider value={true}>
        <C {...props} />
      </V7FluidContext.Provider>
    );
  }
  Wrapped.displayName = `V7Fluid(${C.displayName ?? C.name ?? "Widget"})`;
  return Wrapped;
}

const C = {
  p:'#1857C0', pC:'#D8E2FF', pCOn:'#001259', pM:'#3B7EE8',
  r:'#BA1A1A', rC:'#FFDAD6', rCOn:'#410002', rM:'#E53935',
  a:'#7D5700', aC:'#FFDEA9', aCOn:'#281800', aM:'#E08C00',
  g:'#1B6E36', gC:'#A2F6B5', gCOn:'#00210D', gM:'#2E9B58',
  tl:'#006874', tlC:'#9EEFFD', tlCOn:'#001F24', tlM:'#0097B2',
  pu:'#6B3FA0', puC:'#EBDDFF', puCOn:'#230060', puM:'#8B5CF6',
  t1:'#191C22', t2:'#43475A', t3:'#73778C', sf:'#FFFFFF', sf2:'#F8F9FE', sf3:'#ECEEF7', ol:'#C3C6D9'
};

const GRID = { unit:272, gap:20, row:272, tall:420, board:560 };
const sizeContract = {
  compact:{ cols:1, rows:1 },
  standard:{ cols:2, rows:1 },
  square:{ cols:2, rows:2, height:GRID.board },
  wide:{ cols:3, rows:1 },
  wideTall:{ cols:3, rows:2, height:GRID.board },
  wide4x2:{ cols:4, rows:2, height:GRID.board },
  xwide:{ cols:4, rows:1 },
  tall:{ cols:1, rows:2, height:GRID.tall },
  xl:{ cols:4, rows:2, height:GRID.board }
};
const widths = Object.fromEntries(Object.entries(sizeContract).map(([key, meta]) => [key, key==='xl' ? '100%' : GRID.unit * meta.cols + GRID.gap * (meta.cols - 1)]));
const fixedH = Object.fromEntries(Object.entries(sizeContract).map(([key, meta]) => [key, meta.height || (GRID.row * meta.rows + GRID.gap * (meta.rows - 1))]));
const getCardStyle = (size='standard') => ({ width: widths[size] || widths.standard, minHeight: fixedH[size] || fixedH.standard, height: fixedH[size] || fixedH.standard });

const sizePretty = {
  compact:'Compact · 1×1',
  tall:'Tall · 1×2',
  standard:'Standard · 2×1',
  square:'Square · 2×2',
  wide:'Wide · 3×1',
  wideTall:'Wide Tall · 3×2',
  wide4x2:'Wide · 4×2',
  xwide:'X-Wide · 4×1',
  xl:'XL · 4×2'
};
const sizeNewLabel = { square:'NEW', wide:'NEW', wideTall:'NEW', wide4x2:'NEW', xwide:'NEW', xl:'NEW' };
const baseSizes = ['compact','tall','standard','square','wide'];

const TLink = ({ children }) => (
  <button style={{background:'none',border:'none',padding:0,fontSize:12,fontWeight:500,color:C.p,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:3,fontFamily:"'Roboto',sans-serif"}}>
    {children}
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.p} strokeWidth="2.5" strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>
  </button>
);
const Chip = ({ c='p', children, sm }) => (
  <span style={{fontSize:sm?10:11,fontWeight:600,padding:sm?'2px 8px':'4px 10px',borderRadius:999,background:C[c+'C']||C.pC,color:C[c+'COn']||C.pCOn,display:'inline-block',lineHeight:1.4,whiteSpace:'nowrap'}}>{children}</span>
);
const Prog = ({ pct, c='p', h=4 }) => (
  <div style={{height:h,background:C[c+'C']||C.pC,borderRadius:999,overflow:'hidden'}}>
    <div style={{height:'100%',width:`${Math.max(0, Math.min(100, pct))}%`,background:C[c+'M']||C.pM,borderRadius:999}} />
  </div>
);
const Av = ({ t, bg=C.pM, s=28 }) => (
  <div style={{width:s,height:s,borderRadius:'50%',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:s<24?8:s<30?10:12,fontWeight:700,color:'#fff',flexShrink:0}}>{t}</div>
);
const SChip = ({ active, children }) => (
  <span style={{fontSize:10,fontWeight:600,padding:'4px 9px',borderRadius:8,background:active?C.pC:C.sf3,color:active?C.pM:C.t2,border:`1px solid ${active?C.p+'44':C.ol+'44'}`,whiteSpace:'nowrap'}}>{children}</span>
);
const MetaRow = ({ scope='Отдел', subject='ОГА', period='7 дней', metric='24 задачи', delta='+8%', compact=false }) => {
  const pos = delta.startsWith('+');
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:compact?0:12,padding:compact?'6px 10px':'7px 10px',background:C.sf2,borderRadius:10,border:`1px solid ${C.ol}33`}}>
      <SChip active>{scope}: {subject}</SChip>
      <SChip>{period}</SChip>
      <span style={{fontSize:compact?10:11,fontWeight:600,color:C.t1}}>{metric}</span>
      <span style={{fontSize:10,fontWeight:700,color:pos?C.gM:C.rM,marginLeft:'auto'}}>{pos ? '↑' : '↓'} {delta.replace(/^[+-]/, '')}</span>
    </div>
  );
};
const Tabs = ({ tabs, active, onChange, sm }) => (
  <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:12}}>
    {tabs.map((t) => (
      <button key={t.key} className="itab" onClick={() => onChange(t.key)} style={{background:active===t.key?C.p:C.sf3,color:active===t.key?'#fff':C.t2,fontSize:sm?10:11}}>
        {t.label}
      </button>
    ))}
  </div>
);
const W = ({ size='standard', title, sub, iconBg, icon, badge, badgeC='p', foot, children, noFoot, acc='p' }) => {
  const fluid = useContext(V7FluidContext);
  const cmp = size === 'compact';
  const cardStyle = fluid ? { width: "100%", height: "100%", minHeight: 0 } : getCardStyle(size);
  return (
    <div className={`wcard ac-${acc}${fluid ? " wcard-fluid" : ""}`} style={cardStyle}>
      <div className={`wh${cmp ? ' sm' : ''}`}>
        <div className="wi" style={{width:cmp?30:36,height:cmp?30:36,borderRadius:cmp?9:12,background:iconBg,flexShrink:0}}>{icon}</div>
        <div className="wts">
          <div className="wt" style={{fontSize:cmp?13:14}}>{title}</div>
          {!cmp && sub ? <div className="ws">{sub}</div> : null}
        </div>
        {!cmp && badge && badgeC==='r' ? <Chip c={badgeC} sm>{badge}</Chip> : null}
      </div>
      <div className={`wb${cmp ? ' sm' : ''}`} style={{flex:1,overflow:'hidden',minHeight:0,minWidth:0}}>{children}</div>
      {!noFoot ? <div className="wf">{foot || <TLink>Подробнее</TLink>}</div> : null}
    </div>
  );
};

function DonutSVG({ segs, sz=72, label, sub }) {
  const r = sz * .37;
  const cx = sz / 2;
  const cy = sz / 2;
  const circ = 2 * Math.PI * r;
  const total = segs.reduce((s,x) => s + x.v, 0) || 1;
  let off = -circ / 4;
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.ol+'40'} strokeWidth={sz*.12} />
      {segs.map((s, i) => {
        const dash = circ * s.v / total;
        const node = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth={sz*.12} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={off} />;
        off -= dash;
        return node;
      })}
      <text x={cx} y={cy+(sub?-4:0)} textAnchor="middle" fontSize={sz*.2} fontWeight="600" fill={C.t1} dominantBaseline="middle">{label}</text>
      {sub ? <text x={cx} y={cy+sz*.13} textAnchor="middle" fontSize={sz*.11} fill={C.t3}>{sub}</text> : null}
    </svg>
  );
}

const IconBar = ({ c=C.p }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="13" width="5" height="8" rx="1.5"/><rect x="9.5" y="8" width="5" height="13" rx="1.5"/><rect x="17" y="3" width="5" height="18" rx="1.5"/></svg>;
const IconLine = ({ c=C.p }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><polyline points="3,17 7,12 11,15 16,8 21,10"/></svg>;
const IconWarn = ({ c=C.rM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><polygon points="12,2 22,20 2,20"/><line x1="12" y1="9" x2="12" y2="14"/></svg>;
const IconFilter = ({ c=C.p }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16l-6 8v7l-4-2V12L4 4z"/></svg>;
const IconStar = ({ c=C.gM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l2.9 5.9L22 9.3l-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l7.1-1.4z"/></svg>;
const IconCheck = ({ c=C.gM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/></svg>;
const IconBolt = ({ c=C.aM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>;
const IconHeart = ({ c=C.aM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.6z"/></svg>;
const IconFile = ({ c=C.p }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>;
const IconDesktop = ({ c=C.gM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>;
const IconUsers = ({ c=C.puM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/></svg>;
const IconCal = ({ c=C.p }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2.5"/></svg>;
const IconNews = ({ c=C.aM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="10" y="6" width="8" height="4" rx="1"/><line x1="18" y1="14" x2="10" y2="14"/></svg>;
const IconBook = ({ c=C.p }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const IconPeople = ({ c=C.gM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/></svg>;
const IconBot = ({ c=C.tlM }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="8" width="18" height="13" rx="3"/></svg>;
const IconSend = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>;
const IconSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconPlus = ({ c=C.p, s=16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

function SimpleBars({ vals, labels, height=120, gap=10, barRadius=10, compact=false, labelSize, minBarPx }) {
  const max = Math.max(...vals, 1);
  const fs = labelSize || (compact ? 9 : 11);
  const minH = minBarPx || (compact ? 16 : 12);
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${vals.length},1fr)`,gap,alignItems:'end',height,marginBottom:compact?4:8}}>
        {vals.map((v, i) => (
          <div key={i} title={`${labels[i]}: ${v}`} style={{height:`${Math.max(minH, v/max*100)}%`,background:i===Math.floor(vals.length/2)?C.p:C.pC,borderRadius:barRadius}} />
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${labels.length},1fr)`,gap,fontSize:fs,color:C.t3,fontWeight:600}}>
        {labels.map((l) => <span key={l} style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l}</span>)}
      </div>
    </div>
  );
}

function SimpleLine({ series, labels, height=180, compact=false, svgWidth=560, labelSize, pointRadius, lineStroke }) {
  const all = series.flatMap((s) => s.pts);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const W = svgWidth;
  const H = height;
  const dense = compact || height < 130;
  const left = dense ? 12 : 18;
  const right = dense ? 12 : 18;
  const top = dense ? 10 : 16;
  const bottom = dense ? 16 : 24;
  const innerW = W - left - right;
  const innerH = H - top - bottom;
  const xAt = (i) => labels.length <= 1 ? left + innerW / 2 : left + innerW * i / (labels.length - 1);
  const yAt = (v) => top + (1 - (v-min)/(max-min || 1)) * innerH;
  const pathFor = (pts) => pts.map((v,i) => `${i===0?'M':'L'}${xAt(i)},${yAt(v)}`).join(' ');
  const fs = labelSize || (dense ? 9 : 11);
  const r = pointRadius || (dense ? 3.25 : 4.5);
  const sw = lineStroke || (dense ? 2.4 : 3);
  return (
    <div>
      <svg width="100%" height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {[.25,.5,.75].map((f,i) => {
          const y = top + innerH * (1-f);
          return <line key={i} x1={left} y1={y} x2={W-right} y2={y} stroke={C.ol+'33'} strokeDasharray="4 6" />;
        })}
        {series.map((s) => (
          <g key={s.name}>
            <path d={pathFor(s.pts)} fill="none" stroke={s.c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
            {s.pts.map((v,i) => <circle key={i} cx={xAt(i)} cy={yAt(v)} r={r} fill={s.c}><title>{`${s.name}: ${v}`}</title></circle>)}
          </g>
        ))}
      </svg>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${labels.length},1fr)`,gap:dense?6:10,fontSize:fs,color:C.t3,fontWeight:600}}>
        {labels.map((l) => <span key={l} style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l}</span>)}
      </div>
    </div>
  );
}

function CompactMiniBars({ vals, labels }) {
  return <SimpleBars vals={vals} labels={labels} height={82} gap={6} barRadius={8} compact labelSize={9} minBarPx={14} />;
}

function CompactMiniLine({ series, labels }) {
  return <SimpleLine series={series} labels={labels} height={88} compact svgWidth={240} labelSize={9} />;
}

const kpiData = [
  { l:'Новые', v:4, c:'p', p:20, d:'+2 сегодня' },
  { l:'В работе', v:12, c:'g', p:60, d:'без изм.' },
  { l:'Просрочено', v:3, c:'r', p:15, d:'+1 сегодня' },
  { l:'На согласовании', v:0, c:'a', p:0, d:'—' }
];

function KTile({ it, dense=false }) {
  return (
    <div style={{height:'100%',background:`linear-gradient(140deg,${C[it.c+'C']}88,${C[it.c+'C']}44)`,border:`1px solid ${C[it.c+'C']}bb`,borderRadius:dense?14:16,padding:dense?12:14,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div>
        <div style={{fontSize:dense?8.5:9,fontWeight:700,textTransform:'uppercase',color:C[it.c+'COn'],marginBottom:dense?4:5,opacity:.75}}>{it.l}</div>
        <div style={{fontSize:dense?30:34,fontWeight:300,color:C[it.c+'M'],lineHeight:1,marginBottom:dense?8:10}}>{it.v}</div>
      </div>
      <div>
        <Prog pct={it.p} c={it.c} h={3} />
        <div style={{fontSize:dense?8.5:9,color:C[it.c+'COn'],fontWeight:600,marginTop:dense?4:5,opacity:.8,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.d}</div>
      </div>
    </div>
  );
}

function KMiniTile({ it }) {
  return (
    <div style={{height:'100%',background:`linear-gradient(140deg,${C[it.c+'C']}88,${C[it.c+'C']}44)`,border:`1px solid ${C[it.c+'C']}bb`,borderRadius:12,padding:'8px 10px',minWidth:0,minHeight:0,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div style={{fontSize:8,fontWeight:700,textTransform:'uppercase',color:C[it.c+'COn'],marginBottom:4,opacity:.75,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.l}</div>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:6,marginBottom:5}}>
        <span style={{fontSize:22,fontWeight:300,color:C[it.c+'M'],lineHeight:1}}>{it.v}</span>
        <span style={{fontSize:8,color:C[it.c+'COn'],fontWeight:700,opacity:.8,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.d}</span>
      </div>
      <Prog pct={it.p} c={it.c} h={3} />
    </div>
  );
}

function W01({ size='standard' }) {
  const [scope, setScope] = useState('mine');
  const scopeTabs = [{ key:'mine', label:'Мои задачи' }, { key:'dept', label:'Отдел' }, { key:'unit', label:'Управление' }];
  const scopeMeta = {
    mine:{ scope:'Мои задачи', subject:'Смирнов А.В.', period:'Сегодня', metric:'19 задач', delta:'+2%' },
    dept:{ scope:'Отдел', subject:'ОГА', period:'Сегодня', metric:'19 задач', delta:'+2%' },
    unit:{ scope:'Управление', subject:'Градостроительное', period:'Сегодня', metric:'74 задачи', delta:'+5%' }
  };
  const cmp = size === 'compact';
  const tall = size === 'tall';
  const square = size === 'square';

  if (cmp) {
    return (
      <W size={size} title="KPI" iconBg={C.pC} icon={<IconBar />} noFoot acc="p">
        <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',minHeight:0}}>
          <div style={{marginBottom:6,flexShrink:0}}><Tabs tabs={scopeTabs} active={scope} onChange={setScope} sm /></div>
          <div style={{fontSize:'clamp(7px, 2.2cqw, 9px)',fontWeight:600,textTransform:'uppercase',color:C.t3,marginBottom:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',flexShrink:0}}>{scopeMeta[scope].scope} · Сегодня</div>
          <div style={{textAlign:'center',padding:'0 0 4px',flex:'1 1 auto',minHeight:0,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{fontSize:'clamp(20px, 11cqw, 46px)',fontWeight:300,color:C.pM,lineHeight:1}}>{kpiData[0].v}</div>
            <div style={{fontSize:'clamp(8px, 2.6cqw, 10px)',color:C.t2,marginTop:2}}>Новые задачи</div>
            <div style={{fontSize:'clamp(7px, 2.2cqw, 9px)',color:C.gM,fontWeight:600,marginTop:1}}>↑ +2 сегодня</div>
          </div>
          <div style={{marginTop:'auto',flexShrink:0,minHeight:0}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4,marginBottom:6}}>
              {kpiData.slice(1).map((k, i) => (
                <div key={i} style={{textAlign:'center',padding:'4px 2px',borderRadius:10,background:`${C[k.c+'C']}66`,border:`1px solid ${C[k.c+'C']}99`,minWidth:0}}>
                  <div style={{fontSize:'clamp(12px, 5cqw, 18px)',fontWeight:300,color:C[k.c+'M'],lineHeight:1}}>{k.v}</div>
                  <div style={{fontSize:'clamp(6px, 1.8cqw, 7px)',color:C[k.c+'COn'],fontWeight:700,marginTop:2,textTransform:'uppercase',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{k.l.split(' ')[0]}</div>
                </div>
              ))}
            </div>
            <Prog pct={20} c="p" h={3} />
          </div>
        </div>
      </W>
    );
  }

  if (tall) {
    return (
      <W size={size} title="KPI-счётчики" sub="Обновлено 5 мин. назад" iconBg={C.pC} icon={<IconBar />} badge="Live" badgeC="g" acc="p">
        <div style={{display:'flex',flexDirection:'column',height:'100%',gap:8,minHeight:0}}>
          <Tabs tabs={scopeTabs} active={scope} onChange={setScope} />
          <MetaRow {...scopeMeta[scope]} compact />
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gridTemplateRows:'repeat(2,1fr)',gap:8,flex:1,minHeight:0}}>
            {kpiData.map((it, i) => <KMiniTile key={i} it={it} />)}
          </div>
        </div>
      </W>
    );
  }

  if (square) {
    return (
      <W size={size} title="KPI-счётчики" sub="Обновлено 5 мин. назад" iconBg={C.pC} icon={<IconBar />} badge="Live" badgeC="g" acc="p">
        <Tabs tabs={scopeTabs} active={scope} onChange={setScope} />
        <MetaRow {...scopeMeta[scope]} />
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gridTemplateRows:'repeat(2,1fr)',gap:10,flex:1,minHeight:0}}>
          {kpiData.map((it, i) => <KTile key={i} it={it} dense />)}
        </div>
      </W>
    );
  }

  return (
    <W size={size} title="KPI-счётчики" sub="Обновлено 5 мин. назад" iconBg={C.pC} icon={<IconBar />} badge="Live" badgeC="g" acc="p">
      <Tabs tabs={scopeTabs} active={scope} onChange={setScope} />
      <MetaRow {...scopeMeta[scope]} />
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
        {kpiData.map((it, i) => <KTile key={i} it={it} />)}
      </div>
    </W>
  );
}

function W02({ size='standard', state='bar' }) {
  const cmp = size === 'compact';
  const tall = size === 'tall';
  const square = size === 'square';
  const wideTall = size === 'wideTall';
  const scopeTabs = [{ key:'mine', label:'Мои задачи' }, { key:'dept', label:'Отдел' }, { key:'unit', label:'Управление' }];
  const [scope, setScope] = useState('dept');
  const scopedData = {
    mine:{ meta:{scope:'Мои задачи',subject:'Смирнов А.В.',period:'7 дней',metric:'27 задач',delta:'+6%'}, bar:{value:'27',label:'задачи за период',delta:'+6%',deltaColor:C.gM,title:'Нагрузка',vals:[3,5,2,6,4,3,4]}, line:{value:'81%',label:'среднее выполнение SLA',delta:'+3%',deltaColor:C.gM,title:'Динамика',series:[{name:'Открыто',pts:[42,51,48,44],c:C.p},{name:'Закрыто',pts:[55,60,64,58],c:C.gM}]}, donut:{value:'74%',label:'выполнено в срок',delta:'+5%',deltaColor:C.gM,title:'Статусы',data:[{label:'Выполнено',value:74,color:C.gM,sub:'20 задач'},{label:'Просрочено',value:11,color:C.rM,sub:'3 задачи'},{label:'В работе',value:15,color:C.aM,sub:'4 задачи'}]}},
    dept:{ meta:{scope:'Отдел',subject:'ОГА',period:'7 дней',metric:'43 задачи',delta:'+12%'}, bar:{value:'43',label:'задачи за период',delta:'+12%',deltaColor:C.gM,title:'Нагрузка',vals:[14,22,18,30,25,20,27]}, line:{value:'76%',label:'среднее выполнение SLA',delta:'+4%',deltaColor:C.gM,title:'Динамика',series:[{name:'Открыто',pts:[58,72,84,76],c:C.p},{name:'Закрыто',pts:[52,66,54,88],c:C.gM}]}, donut:{value:'62%',label:'выполнено в срок',delta:'-3%',deltaColor:C.aM,title:'Статусы',data:[{label:'Выполнено',value:62,color:C.gM,sub:'31 задача'},{label:'Просрочено',value:18,color:C.rM,sub:'9 задач'},{label:'В работе',value:20,color:C.aM,sub:'10 задач'}]}},
    unit:{ meta:{scope:'Управление',subject:'Градостроительное',period:'30 дней',metric:'184 задачи',delta:'+9%'}, bar:{value:'184',label:'задачи за период',delta:'+9%',deltaColor:C.gM,title:'Нагрузка',vals:[88,104,96,132,125,118,140]}, line:{value:'69%',label:'среднее выполнение SLA',delta:'-2%',deltaColor:C.aM,title:'Динамика',series:[{name:'Открыто',pts:[74,92,106,118],c:C.p},{name:'Закрыто',pts:[68,79,73,101],c:C.gM}]}, donut:{value:'55%',label:'выполнено в срок',delta:'-6%',deltaColor:C.rM,title:'Статусы',data:[{label:'Выполнено',value:55,color:C.gM,sub:'101 задача'},{label:'Просрочено',value:21,color:C.rM,sub:'39 задач'},{label:'В работе',value:24,color:C.aM,sub:'44 задачи'}]}}
  };
  const current = scopedData[scope];
  const active = current[state] || current.bar;
  const barLabels = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const lineLabels = ['1 нед','2 нед','3 нед','4 нед'];
  const chartMetrics = wideTall
    ? { barHeight:232, lineHeight:228, donutSize:144, donutCols:'220px 1fr', donutMin:208 }
    : square
    ? { barHeight:172, lineHeight:168, donutSize:112, donutCols:'170px 1fr', donutMin:0 }
    : { barHeight:220, lineHeight:240, donutSize:132, donutCols:'1fr', donutMin:180 };

  if (cmp) {
    return (
      <W size={size} title="Аналитика" iconBg={C.pC} icon={<IconLine />} noFoot acc="p">
        <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'10px',height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:8}}>
            <div style={{minWidth:0}}>
              <div style={{fontSize:9,fontWeight:700,textTransform:'uppercase',color:C.t3,marginBottom:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{current.meta.scope} · 7 дней</div>
              <div style={{display:'flex',alignItems:'baseline',gap:6,flexWrap:'wrap'}}>
                <span style={{fontSize:34,fontWeight:300,color:C.pM,lineHeight:1}}>{active.value}</span>
                <span style={{fontSize:10,color:C.t3}}>{state==='bar'?'задачи':state==='line'?'SLA':'в срок'}</span>
              </div>
            </div>
            <span style={{fontSize:9,fontWeight:700,color:active.deltaColor,background:active.deltaColor===C.gM?C.gC:active.deltaColor===C.aM?C.aC:C.rC,padding:'4px 7px',borderRadius:999,whiteSpace:'nowrap',flexShrink:0}}>{active.delta.startsWith('-')?'↓':'↑'} {active.delta.replace(/^[+-]/,'')}</span>
          </div>
          <div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
            {state==='bar' ? <CompactMiniBars vals={current.bar.vals} labels={barLabels} /> : null}
            {state==='line' ? <CompactMiniLine series={current.line.series} labels={lineLabels} /> : null}
            {state==='donut' ? (
          <div style={{display:'grid',gridTemplateColumns:chartMetrics.donutCols,gap:14,alignItems:'stretch',flex:1,minHeight:0,overflow:'hidden'}}>
            <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:wideTall?208:160,overflow:'hidden'}}>
              <DonutSVG segs={current.donut.data.map((x) => ({ v:x.value, c:x.color }))} sz={chartMetrics.donutSize} label={current.donut.value} sub="в срок" />
            </div>
            <div style={{display:'grid',gap:8,alignContent:'start',minHeight:0,overflow:'hidden'}}>
              {current.donut.data.map((item) => (
                <div key={item.label} style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'12px 14px',display:'flex',alignItems:'center',gap:12,minHeight:wideTall?64:undefined}}>
                  <div style={{width:12,height:12,borderRadius:4,background:item.color,flexShrink:0}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.t1}}>{item.label}</div>
                    <div style={{fontSize:10,color:C.t3,marginTop:2}}>{item.sub}</div>
                  </div>
                  <div style={{fontSize:18,fontWeight:600,color:C.t1}}>{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
          </div>
        </div>
      </W>
    );
  }

  if (tall) {
    return (
      <W size={size} title="Аналитический график" sub={state==='bar'?'Загрузка по дням':state==='line'?'Открыто / закрыто':'Распределение статусов'} iconBg={C.pC} icon={<IconLine />} acc="p">
        <div style={{display:'flex',flexDirection:'column',height:'100%',minHeight:0}}>
          <Tabs tabs={scopeTabs} active={scope} onChange={setScope} />
          <MetaRow {...current.meta} compact />
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,margin:'8px 0 12px'}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',color:C.t3,marginBottom:4}}>{active.title}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap'}}>
                <span style={{fontSize:34,fontWeight:300,color:C.pM,lineHeight:1}}>{active.value}</span>
                <span style={{fontSize:11,color:C.t3}}>{active.label}</span>
              </div>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:active.deltaColor,background:active.deltaColor===C.gM?C.gC:active.deltaColor===C.aM?C.aC:C.rC,padding:'6px 10px',borderRadius:999,whiteSpace:'nowrap'}}>{active.delta.startsWith('-')?'↓':'↑'} {active.delta.replace(/^[+-]/,'')}</span>
          </div>
          {state==='bar' ? <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px 14px 12px',flex:1}}><SimpleBars vals={current.bar.vals} labels={barLabels} height={220} /></div> : null}
          {state==='line' ? <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px 14px 12px',flex:1}}><div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}><Chip c="p" sm>Открыто</Chip><Chip c="g" sm>Закрыто</Chip></div><SimpleLine series={current.line.series} labels={lineLabels} height={240} /></div> : null}
          {state==='donut' ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12,flex:1}}>
              <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:180}}>
                <DonutSVG segs={current.donut.data.map((x) => ({ v:x.value, c:x.color }))} sz={132} label={current.donut.value} sub="в срок" />
              </div>
              <div style={{display:'grid',gap:8}}>
                {current.donut.data.map((item) => (
                  <div key={item.label} style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:12,height:12,borderRadius:4,background:item.color,flexShrink:0}} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.t1}}>{item.label}</div>
                      <div style={{fontSize:10,color:C.t3,marginTop:2}}>{item.sub}</div>
                    </div>
                    <div style={{fontSize:18,fontWeight:600,color:C.t1}}>{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </W>
    );
  }

  if (square || wideTall) {
    return (
      <W size={size} title="Аналитический график" sub={state==='bar'?'Загрузка по дням':state==='line'?'Открыто / закрыто':'Распределение статусов'} iconBg={C.pC} icon={<IconLine />} acc="p">
        <Tabs tabs={scopeTabs} active={scope} onChange={setScope} />
        <MetaRow {...current.meta} />
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',color:C.t3,marginBottom:4}}>{active.title}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap'}}>
              <span style={{fontSize:wideTall?42:36,fontWeight:300,color:C.pM,lineHeight:1}}>{active.value}</span>
              <span style={{fontSize:11,color:C.t3}}>{active.label}</span>
            </div>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:active.deltaColor,background:active.deltaColor===C.gM?C.gC:active.deltaColor===C.aM?C.aC:C.rC,padding:'6px 10px',borderRadius:999,whiteSpace:'nowrap'}}>{active.delta.startsWith('-')?'↓':'↑'} {active.delta.replace(/^[+-]/,'')}</span>
        </div>

        {state==='bar' ? <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px 14px 12px',flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}><SimpleBars vals={current.bar.vals} labels={barLabels} height={chartMetrics.barHeight} gap={wideTall?12:10} labelSize={wideTall?11:10} minBarPx={14} /></div> : null}
        {state==='line' ? <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px 14px 12px',flex:1,minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column'}}><div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10,flexShrink:0}}><Chip c="p" sm>Открыто</Chip><Chip c="g" sm>Закрыто</Chip></div><div style={{flex:1,minHeight:0,overflow:'hidden'}}><SimpleLine series={current.line.series} labels={lineLabels} height={chartMetrics.lineHeight} svgWidth={wideTall?760:560} labelSize={wideTall?11:10} pointRadius={wideTall?4.75:4} lineStroke={wideTall?3.2:2.8} /></div></div> : null}
        {state==='donut' ? (
          <div style={{display:'grid',gridTemplateColumns:chartMetrics.donutCols,gap:14,alignItems:'stretch',flex:1,minHeight:chartMetrics.donutMin || 0}}>
            <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:chartMetrics.donutMin}}>
              <DonutSVG segs={current.donut.data.map((x) => ({ v:x.value, c:x.color }))} sz={chartMetrics.donutSize} label={current.donut.value} sub="в срок" />
            </div>
            <div style={{display:'grid',gap:8,alignContent:'center'}}>
              {current.donut.data.map((item) => (
                <div key={item.label} style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'12px 14px',display:'flex',alignItems:'center',gap:12,minHeight:wideTall?72:undefined}}>
                  <div style={{width:12,height:12,borderRadius:4,background:item.color,flexShrink:0}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,color:C.t1}}>{item.label}</div>
                    <div style={{fontSize:10,color:C.t3,marginTop:2}}>{item.sub}</div>
                  </div>
                  <div style={{fontSize:18,fontWeight:600,color:C.t1}}>{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </W>
    );
  }

  return (
    <W size={size} title="Аналитический график" sub={state==='bar'?'Загрузка по дням':state==='line'?'Открыто / закрыто':'Распределение статусов'} iconBg={C.pC} icon={<IconLine />} acc="p">
      <Tabs tabs={scopeTabs} active={scope} onChange={setScope} />
      <MetaRow {...current.meta} />
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:12}}>
        <div>
          <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',color:C.t3,marginBottom:4}}>{active.title}</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8}}>
            <span style={{fontSize:36,fontWeight:300,color:C.pM,lineHeight:1}}>{active.value}</span>
            <span style={{fontSize:11,color:C.t3}}>{active.label}</span>
          </div>
        </div>
        <span style={{fontSize:11,fontWeight:700,color:active.deltaColor,background:active.deltaColor===C.gM?C.gC:active.deltaColor===C.aM?C.aC:C.rC,padding:'6px 10px',borderRadius:999,whiteSpace:'nowrap'}}>{active.delta.startsWith('-')?'↓':'↑'} {active.delta.replace(/^[+-]/,'')}</span>
      </div>

      {state==='bar' ? <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px 14px 12px'}}><SimpleBars vals={current.bar.vals} labels={barLabels} /></div> : null}
      {state==='line' ? <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px 14px 12px'}}><div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}><Chip c="p" sm>Открыто</Chip><Chip c="g" sm>Закрыто</Chip></div><SimpleLine series={current.line.series} labels={lineLabels} /></div> : null}
      {state==='donut' ? (
        <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:14,alignItems:'stretch'}}>
          <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'14px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:176}}>
            <DonutSVG segs={current.donut.data.map((x) => ({ v:x.value, c:x.color }))} sz={108} label={current.donut.value} sub="в срок" />
          </div>
          <div style={{display:'grid',gap:8,alignContent:'center'}}>
            {current.donut.data.map((item) => (
              <div key={item.label} style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'12px 14px',display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:12,height:12,borderRadius:4,background:item.color,flexShrink:0}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:C.t1}}>{item.label}</div>
                  <div style={{fontSize:10,color:C.t3,marginTop:2}}>{item.sub}</div>
                </div>
                <div style={{fontSize:18,fontWeight:600,color:C.t1}}>{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </W>
  );
}

function W03({ size='standard' }) {
  const rows = size==='compact'
    ? [{l:'Просрочено > 7 дней',v:3,c:'r',p:60,tag:'Критично'},{l:'SLA под угрозой',v:5,c:'a',p:100,tag:'Важно'}]
    : [{l:'Просрочено > 7 дней',v:3,c:'r',p:60,tag:'Критично'},{l:'SLA под угрозой',v:5,c:'a',p:100,tag:'Важно'},{l:'Ожидают согласования',v:8,c:'p',p:80,tag:'Информация'},{l:'Возвращено на доработку',v:2,c:'g',p:40,tag:'Норма'}];
  const cmp = size === 'compact';
  return <W size={size} title={cmp?'Нарушения':'Нарушения и просрочки'} sub="По активным задачам" iconBg={C.rC} icon={<IconWarn />} badge="8 критич." badgeC="r" acc="r" noFoot={cmp}><div style={{display:'flex',flexDirection:'column',gap:8}}>{rows.map((r,i) => <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:cmp?'8px 10px':'10px 12px',borderRadius:12,background:C.sf2,border:`1px solid ${C[r.c+'C']}99`}}><div style={{flex:1}}><div style={{fontSize:cmp?11:12,fontWeight:500,color:C.t1,marginBottom:cmp?0:5}}>{r.l}</div>{!cmp ? <Prog pct={r.p} c={r.c} h={3} /> : null}</div><div style={{textAlign:'right'}}><div style={{fontSize:cmp?22:26,fontWeight:300,color:C[r.c+'M'],lineHeight:1}}>{r.v}</div>{!cmp ? <div style={{fontSize:9,color:C[r.c+'COn'],fontWeight:700,marginTop:2}}>{r.tag}</div> : null}</div></div>)}</div></W>;
}

function W04({ size='standard' }) {
  const stages = size==='compact'
    ? [{l:'Инициация',v:120,c:C.pM},{l:'Согласование',v:87,c:C.pM},{l:'Экспертиза',v:54,c:C.gM}]
    : [{l:'Инициация',v:120,c:C.pM},{l:'Согласование',v:87,c:C.pM},{l:'Экспертиза',v:54,c:C.gM},{l:'Утверждение',v:32,c:C.gM},{l:'Выдача',v:18,c:C.aM}];
  const max = stages[0].v || 1;
  return <W size={size} title={size==='compact'?'Воронка':'Воронка процесса'} sub="Согласование ГПЗУ" iconBg={C.pC} icon={<IconFilter />} acc="p" noFoot={size==='compact'}><div style={{display:'flex',flexDirection:'column',gap:8}}>{stages.map((s,i) => { const share = Math.round(s.v / max * 100); const conv = i>0 ? Math.round(s.v / stages[i-1].v * 100) : 100; return <div key={i}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:size==='compact'?10:11,color:C.t2,marginBottom:4}}><span style={{fontWeight:i===0?600:500}}>{s.l}</span><div style={{display:'flex',alignItems:'center',gap:8}}>{size!=='compact' && i>0 ? <span style={{fontSize:9,color:C.t3,background:C.sf3,padding:'2px 6px',borderRadius:6}}>{conv}%</span> : null}<span style={{fontWeight:700,color:C.t1,minWidth:24,textAlign:'right'}}>{s.v}</span></div></div><div style={{background:C.sf3,borderRadius:8,height:size==='compact'?16:20,position:'relative',overflow:'hidden'}}><div style={{position:'absolute',left:0,top:0,bottom:0,width:`${share}%`,background:`linear-gradient(90deg,${s.c}dd,${s.c}99)`,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>{size!=='compact' ? <span style={{fontSize:9,fontWeight:700,color:'#fff'}}>{share}%</span> : null}</div></div></div>; })}</div></W>;
}

const top5Tabs = [{key:'performers',label:'По закрытым'},{key:'depts',label:'По отделам'},{key:'tasktype',label:'По типам'}];
const top5Data = {
  performers:[['Смирнов А.В.','ОГА',42,C.p],['Козлова Н.С.','ОТП',38,C.gM],['Попов Д.Р.','ОКС',35,C.aM],['Лебедев М.О.','ОГА',31,C.puM],['Новикова Е.В.','ОТП',28,C.rM]],
  depts:[['ОГА','Отдел гл. архитектора',128,C.p],['ОТП','Отдел тех. политики',114,C.gM],['ОКС','Отдел кап. строит.',97,C.aM],['ОПЗ','Отдел план. зонир.',83,C.tlM],['ОГД','Отдел градостроит.',76,C.puM]],
  tasktype:[['Согласование ГПЗУ','По регламенту',54,C.p],['Разрешение на строит.','По заявкам',43,C.rM],['Экспертиза ПД','Эксп. отдел',38,C.gM],['Ввод в эксплуатацию','По заявкам',31,C.aM],['Мониторинг ОКС','Контрольный',22,C.tlM]]
};
const medals = ['#E8A000','#8E9297','#AD6B3D',C.t3,C.t3];
function W05({ size='standard' }) {
  const [tab, setTab] = useState('performers');
  const rows = top5Data[tab] || top5Data.performers;
  const mx = rows[0] ? rows[0][2] : 1;
  const cmp = size === 'compact';
  const tall = size === 'tall';
  const square = size === 'square';
  const showRows = cmp ? rows.slice(0,4) : tall ? rows.slice(0,5) : rows;

  return <W size={size} title="Топ-5 показателей" sub={(top5Tabs.find((t) => t.key===tab) || {}).label} iconBg={C.gC} icon={<IconStar />} acc="g" noFoot={cmp}>
    <Tabs tabs={top5Tabs} active={tab} onChange={setTab} sm={cmp} />
    <div style={{display:'flex',flexDirection:'column',gap:cmp?4:0,flex:1,minHeight:0}}>
      {showRows.map((it, i) => <div key={i} className="lrow" style={{display:'flex',alignItems:'center',gap:8,padding:cmp?'8px 2px':'8px 4px'}}><div style={{fontSize:13,fontWeight:700,color:medals[i],width:22,textAlign:'center'}}>{i+1}</div><Av t={it[0].split(' ').map((x) => x[0]).join('').slice(0,2)} bg={it[3]} s={cmp?24:28} /><div style={{flex:1,minWidth:0}}><div style={{fontSize:cmp?11:12,fontWeight:500,color:C.t1,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{it[0]}</div><div style={{fontSize:10,color:C.t3,marginTop:1}}>{it[1]}</div></div>{!cmp ? <div style={{flex:'0 0 72px'}}><Prog pct={Math.round((it[2] || 0) / mx * 100)} c="p" h={3} /></div> : null}<div style={{fontSize:cmp?13:14,fontWeight:600,color:C.p,width:32,textAlign:'right'}}>{it[2]}</div></div>)}
      {square ? <div style={{marginTop:'auto',paddingTop:10}}><Prog pct={86} c="g" h={4} /></div> : null}
    </div>
  </W>;
}

const taskData = [
  {id:'ЗД-1024',t:'Согласование ГПЗУ ул. Ленина 45',sl:'Просрочено',sc:'r',d:'28.03',dep:'ОГА'},
  {id:'ЗД-1031',t:'Проверка документов ПМТ Садовая',sl:'В работе',sc:'g',d:'02.04',dep:'ОТП'},
  {id:'ЗД-1035',t:'Заключение по объекту №338',sl:'Новая',sc:'p',d:'05.04',dep:'ОКС'},
  {id:'ЗД-1038',t:'Ответ на запрос Мосгорпроекта',sl:'На проверке',sc:'a',d:'03.04',dep:'ОГА'},
  {id:'ЗД-1041',t:'Реестр объектов ИЖС',sl:'Новая',sc:'p',d:'07.04',dep:'ОТП'},
  {id:'ЗД-1043',t:'Обновление охранных зон',sl:'Готово',sc:'g',d:'31.03',dep:'ОКС'}
];
function ListView({ n=4 }) {
  return <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}><thead><tr>{['','ID','Задача','Статус','Срок','Отдел'].map((h,i) => <th key={i} style={{textAlign:'left',padding:'2px 6px 8px',borderBottom:`1.5px solid ${C.ol}55`,fontSize:9.5,fontWeight:700,textTransform:'uppercase',color:C.t3}}>{h}</th>)}</tr></thead><tbody>{taskData.slice(0, n).map((r, i) => <tr key={i} className="lrow"><td style={{padding:'5px 4px 5px 0'}}><div style={{width:3,height:22,borderRadius:3,background:C[r.sc+'M'] || C.p}} /></td><td style={{padding:'5px 6px',color:C.p,fontWeight:600,fontSize:10,whiteSpace:'nowrap'}}>{r.id}</td><td style={{padding:'5px 6px',maxWidth:180}}><div style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',fontSize:11,color:C.t1}}>{r.t}</div></td><td style={{padding:'5px 6px'}}><Chip c={r.sc} sm>{r.sl}</Chip></td><td style={{padding:'5px 6px',fontSize:10,color:r.sc==='r'?C.rM:C.t3,fontWeight:r.sc==='r'?600:400}}>{r.d}</td><td style={{padding:'5px 6px',fontSize:10,color:C.t3}}>{r.dep}</td></tr>)}</tbody></table>;
}
function KanbanView({ cols4=false }) {
  const cols = cols4
    ? [{t:'Новые',c:C.p,cnt:3,cards:[{t:'Заключение по объекту №338',d:'05.04',sc:'p'},{t:'Реестр объектов ИЖС',d:'07.04',sc:'p'}]},{t:'В работе',c:C.gM,cnt:4,cards:[{t:'Проверка ПМТ Садовая',d:'02.04',sc:'g'},{t:'Схема планировки кв.5',d:'04.04',sc:'g'}]},{t:'На проверке',c:C.aM,cnt:2,cards:[{t:'Ответ Мосгорпроекту',d:'03.04',sc:'a'}]},{t:'Просрочено',c:C.rM,cnt:3,cards:[{t:'ГПЗУ ул. Ленина 45',d:'28.03',sc:'r'},{t:'ПМТ ул. Кирова',d:'30.03',sc:'r'}]}]
    : [{t:'Новые',c:C.p,cnt:3,cards:[{t:'Заключение по объекту №338',d:'05.04',sc:'p'}]},{t:'В работе',c:C.gM,cnt:4,cards:[{t:'Проверка ПМТ Садовая',d:'02.04',sc:'g'}]},{t:'Просрочено',c:C.rM,cnt:3,cards:[{t:'ГПЗУ ул. Ленина 45',d:'28.03',sc:'r'}]}];
  return <div style={{display:'grid',gridTemplateColumns:`repeat(${cols.length},1fr)`,gap:8}}>{cols.map((col, i) => <div key={i} className="kcol"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><span style={{fontSize:9,fontWeight:700,textTransform:'uppercase',color:col.c}}>{col.t}</span><span style={{background:C.sf,borderRadius:999,padding:'1px 7px',fontSize:9,fontWeight:600,color:C.t3,border:`1px solid ${C.ol}44`}}>{col.cnt}</span></div>{col.cards.map((k, ki) => <div key={ki} className="kcard"><div style={{width:'100%',height:2,borderRadius:2,background:C[k.sc+'M'] || C.p,marginBottom:7}} /><div style={{fontSize:10,fontWeight:500,color:C.t1,lineHeight:1.4,marginBottom:4}}>{k.t}</div><div style={{fontSize:9,color:C.t3}}>{k.d}</div></div>)}</div>)}</div>;
}
function GanttView({ n=5 }) {
  const bars = [{id:'CDP-128',start:0,len:2,c:C.rM},{id:'CDP-127',start:0,len:3,c:C.aM},{id:'CDP-126',start:1,len:5,c:C.aM},{id:'CDP-124',start:3,len:8,c:C.p},{id:'CDP-125',start:3,len:2,c:C.gM}];
  const cols = 12;
  const days = ['28','29','30','1','2','3','4','5','6','7','8','9'];
  return <table style={{width:'100%',borderCollapse:'collapse',fontSize:9,minWidth:320}}><thead><tr><th style={{width:80,textAlign:'left',padding:'2px 8px 6px 0',borderBottom:`1.5px solid ${C.ol}50`,fontSize:9.5,fontWeight:700,color:C.t3}}>ЗАДАЧА</th>{days.slice(0, cols).map((d, i) => <th key={i} style={{textAlign:'center',padding:'2px 0 6px',borderBottom:`1.5px solid ${C.ol}50`,fontSize:9,fontWeight:600,color:C.t3,minWidth:32}}>{d}</th>)}</tr></thead><tbody>{bars.slice(0, n).map((b, bi) => <tr key={bi} className="lrow"><td style={{padding:'4px 8px 4px 0'}}><div style={{fontSize:9,fontWeight:600,color:C.p,background:C.pC,padding:'2px 6px',borderRadius:5,display:'inline-block'}}>{b.id}</div></td>{Array.from({ length: cols }, (_, di) => { if (di === b.start) { return <td key={di} colSpan={Math.min(b.len, cols-di)} style={{padding:'3px 2px'}}><div style={{height:20,borderRadius:7,background:`linear-gradient(90deg,${b.c},${b.c}bb)`,display:'flex',alignItems:'center',paddingLeft:7,fontSize:8,fontWeight:700,color:'#fff'}}>{b.id}</div></td>; } if (di > b.start && di < b.start + b.len) { return null; } return <td key={di} />; })}</tr>)}</tbody></table>;
}
const taskViewTabs = [
  { key: "list", label: "Список" },
  { key: "kanban", label: "Канбан" },
  { key: "gantt", label: "Гантт" },
];
function W06({ size = "standard", state = "list", onStateChange }) {
  const wide = size === "wide";
  const wide4x2 = size === "wide4x2";
  const xl = size === "xl";
  const cmp = size === "compact";
  const subs = { list: "Список задач", kanban: "Доска канбан", gantt: "Диаграмма Гантт" };
  const resolvedState = taskViewTabs.some((t) => t.key === state) ? state : "list";
  return (
    <W
      size={size}
      title="Мои задачи"
      sub={subs[resolvedState]}
      iconBg={C.gC}
      icon={<IconCheck />}
      badge="3 срочных"
      badgeC="r"
      acc="g"
    >
      {typeof onStateChange === "function" ? (
        <Tabs tabs={taskViewTabs} active={resolvedState} onChange={onStateChange} sm={cmp} />
      ) : null}
      {resolvedState === "list" ? <ListView n={xl || wide4x2 ? 6 : wide ? 5 : 4} /> : null}
      {resolvedState === "kanban" ? <KanbanView cols4={wide || wide4x2 || xl} /> : null}
      {resolvedState === "gantt" ? <GanttView n={xl || wide4x2 ? 5 : wide ? 4 : 3} /> : null}
    </W>
  );
}

const servicePresetA = [['СБИС',C.p,'С'],['Портал мэра','#E85B73','П'],['СПС УП',C.gM,'С'],['Вики',C.puM,'В'],['ИАС УГД','#5E8BC8','И'],['МосЭДО',C.aM,'М'],['Задачник',C.g,'З'],['ИАС ОГД','#1a3c7a','И'],['ИАИС РиН','#3C8C78','Р'],['АИС ЭП','#7A5B44','Э']];
const servicePresetB = [['СБИС',C.p,'С'],['СПС УП',C.gM,'С'],['Вики',C.puM,'В'],['ИАС УГД','#5E8BC8','И'],['МосЭДО',C.aM,'М'],['Задачник',C.g,'З'],['ИАС ОГД','#1a3c7a','И'],['ИАИС РиН','#3C8C78','Р'],['АИС ЭП','#7A5B44','Э']];
const servicePresetC = [['СБИС',C.p,'С'],['СПС УП',C.gM,'С'],['Вики',C.puM,'В'],['ИАС УГД','#5E8BC8','И'],['МосЭДО',C.aM,'М'],['Задачник',C.g,'З'],['ИАС ОГД','#1a3c7a','И'],['ИАИС РиН','#3C8C78','Р'],['АИС ЭП','#7A5B44','Э']];
const actions = [['Новая задача',C.gM,'✚'],['Создать документ',C.p,'📄'],['Подать заявление',C.aM,'📋'],['Поиск сотрудника',C.tlM,'🔍'],['Запрос справки',C.puM,'📊'],['Согласовать',C.gM,'✓']];
function W07({ size='standard', state='services' }) {
  const cmp = size==='compact';
  const tall = size==='tall';
  const square = size==='square';
  const wide = size==='wide';
  const xwide = size==='xwide' || size==='xl';
  const servicePreset =
    state === "services-a"
      ? { items: servicePresetA, showAdd: false }
      : state === "services-c"
        ? { items: servicePresetC, showAdd: true }
        : { items: servicePresetB, showAdd: true };
  const isActionMode = state === "actions";
  const items = isActionMode ? actions : servicePreset.items;
  const showAdd = isActionMode ? true : servicePreset.showAdd;

  if (tall) {
    const show = items.slice(0,5);
    return <W size={size} title={isActionMode?'Действия':'Быстрый доступ'} sub={isActionMode?'Быстрые действия':'Сервисы и системы'} iconBg={C.aC} icon={<IconBolt />} acc="a" noFoot>
      <div style={{display:'flex',flexDirection:'column',gap:8,height:'100%'}}>
        {show.map((s, i) => <div key={i} style={{borderRadius:14,padding:'10px 12px',display:'flex',alignItems:'center',gap:10,border:`1px solid ${C.ol}44`,background:`linear-gradient(135deg,${s[1]}16,${s[1]}0a)`}}><div style={{width:36,height:36,borderRadius:10,background:s[1],display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:isActionMode?16:14,flexShrink:0}}>{s[2]}</div><div style={{fontSize:11,fontWeight:500,color:C.t1,lineHeight:1.3,minWidth:0,flex:1}}>{s[0]}</div></div>)}
        {showAdd ? <div className="addbtn" style={{minHeight:52,marginTop:'auto'}}><div style={{width:30,height:30,borderRadius:'50%',background:C.pC,display:'flex',alignItems:'center',justifyContent:'center'}}><IconPlus c={C.p} s={14} /></div><span style={{fontSize:11,fontWeight:500,color:C.p}}>Добавить</span></div> : null}
      </div>
    </W>;
  }

  const cols = cmp ? 2 : square ? 2 : xwide ? 5 : wide ? 4 : 3;
  const show = cmp ? items.slice(0,4) : items;
  return <W size={size} title={isActionMode?'Действия':'Быстрый доступ'} sub={isActionMode?'Быстрые действия':'Сервисы и системы'} iconBg={C.aC} icon={<IconBolt />} acc="a" noFoot={cmp}><div style={{display:'grid',gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gap:8}}>{show.map((s, i) => <div key={i} style={{borderRadius:14,padding:'10px 12px',display:'flex',alignItems:'center',gap:10,border:`1px solid ${C.ol}44`,background:`linear-gradient(135deg,${s[1]}16,${s[1]}0a)`}}><div style={{width:36,height:36,borderRadius:10,background:s[1],display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:isActionMode?16:14,flexShrink:0}}>{s[2]}</div><div style={{fontSize:11,fontWeight:500,color:C.t1,lineHeight:1.25,minWidth:0,wordBreak:'break-word'}}>{s[0]}</div></div>)}{!cmp && showAdd ? <div className="addbtn" style={{minHeight:56}}><div style={{width:30,height:30,borderRadius:'50%',background:C.pC,display:'flex',alignItems:'center',justifyContent:'center'}}><IconPlus c={C.p} s={14} /></div><span style={{fontSize:11,fontWeight:500,color:C.p}}>Добавить</span></div> : null}</div></W>;
}

const favTasks = [['Предоставление информации из сводного плана подземных коммуникаций','Надежда Турилова','Активная','p'],['Согласование охранных зон объектов культурного наследия','Алексей Смирнов','На проверке','a'],['Предоставление информации из сводного плана коммуникаций','Надежда Турилова','Новая','tl'],['Предоставление сводного плана подземных инженерных сетей','Надежда Турилова','Активная','p']];
const favOpps = [['Расширение квартала Р-5 по программе КРТ в Западном округе','Иван Петров','Высокий','g'],['Реновация промзоны Бирюлёво с переводом в жилую функцию','Мария Соколова','Средний','a'],['Строительство МФЦ «Новая Москва» в ТиНАО','Дмитрий Козлов','Новый','tl']];
function FCard({ it }) {
  return <div className="fcard"><div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:8}}><div style={{width:4,alignSelf:'stretch',borderRadius:4,background:C[it[3]+'M'] || C.p,flexShrink:0,minHeight:36}} /><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,color:C.t1,lineHeight:1.45,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{it[0]}</div><div style={{fontSize:10,color:C.t3,marginTop:4}}>{it[1]}</div></div></div><div style={{display:'flex',alignItems:'center',gap:6,paddingTop:8,borderTop:`1px solid ${C.ol}44`}}><Chip c={it[3]} sm>{it[2]}</Chip><span style={{marginLeft:'auto',fontSize:10,color:C.t3}}>2 ч назад</span></div></div>;
}
function W08({ size='standard', state='tasks' }) {
  const data = state==='tasks' ? favTasks : favOpps;
  const cmp = size==='compact';
  const tall = size==='tall';
  const square = size==='square';
  const wide = size==='wide';
  const items = cmp ? data.slice(0,1) : tall ? data.slice(0,3) : data;

  if (tall) {
    return <W size={size} title={state==='tasks'?'Избранное':'Возможности'} sub={state==='tasks'?`${data.length} задачи`:`${data.length} возможности`} iconBg={C.aC} icon={<IconHeart />} acc="a" noFoot>
      <div style={{display:'flex',flexDirection:'column',gap:10,height:'100%'}}>
        {items.map((it, i) => <FCard key={i} it={it} />)}
        <div className="addbtn" style={{minHeight:72,marginTop:'auto'}}><div style={{width:34,height:34,borderRadius:'50%',background:C.pC,display:'flex',alignItems:'center',justifyContent:'center'}}><IconPlus c={C.p} /></div><span style={{fontSize:12,fontWeight:500,color:C.p}}>Добавить</span></div>
      </div>
    </W>;
  }

  const cols = cmp ? 1 : square ? 2 : wide ? 3 : 2;
  return <W size={size} title="Избранное" sub={state==='tasks'?`${data.length} задачи`:`${data.length} возможности`} iconBg={C.aC} icon={<IconHeart />} acc="a"><div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:10}}>{items.map((it, i) => <FCard key={i} it={it} />)}{!cmp ? <div className="addbtn" style={{minHeight:88}}><div style={{width:34,height:34,borderRadius:'50%',background:C.pC,display:'flex',alignItems:'center',justifyContent:'center'}}><IconPlus c={C.p} /></div><span style={{fontSize:12,fontWeight:500,color:C.p}}>Добавить</span></div> : null}</div></W>;
}

const docsData = {
  recent:[['ДОК-3412','ГПЗУ ул. Тверская 18','pdf','На подписи','a','28.03'],['ДОК-3418','ТУ подключения объекта А','docx','Согласование','p','01.04'],['ДОК-3425','Акт проверки №214','pdf','Подписан','g','25.03'],['ДОК-3429','Схема планировки кв.5','xlsx','Новый','p','31.03']],
  pending:[['ДОК-3412','ГПЗУ ул. Тверская 18','pdf','На подписи','a','28.03'],['ДОК-3433','Заключение экспертизы №77','pdf','Просрочено','r','27.03'],['ДОК-3441','Договор аренды №55','docx','На подписи','a','01.04']],
  approval:[['ДОК-3418','ТУ подключения объекта А','docx','Согласование','p','01.04'],['ДОК-3451','Регламент работы ОГА','docx','Согласование','p','03.04']]
};
const typeC = { pdf:C.rM, docx:C.p, xlsx:C.gM, pptx:C.aM };
function W09({ size='standard', state='recent' }) {
  const rows = docsData[state] || docsData.recent;
  const cmp = size==='compact';
  const show = cmp ? rows.slice(0,3) : rows;
  const subs = { recent:'Последние документы', pending:`На подписи (${docsData.pending.length})`, approval:`На согласовании (${docsData.approval.length})` };
  if (cmp) {
    return <W size={size} title="Мои документы" sub={subs[state]} iconBg={C.pC} icon={<IconFile />} badge={state==='pending'?'2 срочно':''} badgeC="r" acc="p" noFoot><div style={{display:'grid',gap:8}}>{show.map((r, i) => <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 12px',borderRadius:14,background:C.sf2,border:`1px solid ${C.ol}33`,minWidth:0}}><div style={{width:28,height:32,borderRadius:8,background:typeC[r[2]] || C.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'#fff',flexShrink:0}}>{r[2].toUpperCase()}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:11,fontWeight:600,color:C.t1,lineHeight:1.35,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{r[1]}</div><div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginTop:6}}><Chip c={r[4]} sm>{r[3]}</Chip><span style={{fontSize:10,color:C.p,fontWeight:600}}>{r[0]}</span><span style={{fontSize:10,color:C.t3}}>{r[5]}</span></div></div></div>)}</div></W>;
  }
  return <W size={size} title="Мои документы" sub={subs[state]} iconBg={C.pC} icon={<IconFile />} badge={state==='pending'?'2 срочно':''} badgeC="r" acc="p"><table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}><thead><tr>{['Тип','№','Документ','Статус','Дата'].map((h, i) => <th key={i} style={{textAlign:'left',padding:'2px 6px 8px',borderBottom:`1.5px solid ${C.ol}50`,fontSize:9.5,fontWeight:700,textTransform:'uppercase',color:C.t3}}>{h}</th>)}</tr></thead><tbody>{show.map((r, i) => <tr key={i} className="lrow"><td style={{padding:'6px 6px'}}><div style={{width:28,height:32,borderRadius:6,background:typeC[r[2]] || C.p,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'#fff'}}>{r[2].toUpperCase()}</div></td><td style={{padding:'6px',color:C.p,fontWeight:500,fontSize:10,whiteSpace:'nowrap'}}>{r[0]}</td><td style={{padding:'6px',maxWidth:160}}><div style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',fontSize:11,color:C.t1}}>{r[1]}</div></td><td style={{padding:'6px'}}><Chip c={r[4]} sm>{r[3]}</Chip></td><td style={{padding:'6px',fontSize:10,color:C.t3,whiteSpace:'nowrap'}}>{r[5]}</td></tr>)}</tbody></table></W>;
}

const appData = {
  active:[['ЗЯВ-891','Предварит. согласование ГПЗУ',3,5,60,'Экспертиза','p','14.03.2026'],['ЗЯВ-903','Разрешение на строительство',1,4,25,'Регистрация','tl','29.03.2026'],['ЗЯВ-915','Ввод объекта в эксплуатацию',4,4,90,'Финальная пров.','g','20.03.2026'],['ЗЯВ-923','Изм. разрешённого использования',2,5,40,'Согласование','a','05.04.2026']],
  archive:[['ЗЯВ-845','Выдача ГПЗУ ул. Садовая 12',5,5,100,'Выдано','g','10.02.2026'],['ЗЯВ-862','Разрешение на строит. ул. Ленина',4,4,100,'Выдано','g','01.03.2026'],['ЗЯВ-877','Технические условия подключения',3,4,75,'Отказано','r','15.03.2026']]
};
function W10({ size='standard', state='active' }) {
  const rows = appData[state] || appData.active;
  const cmp = size==='compact';
  const tall = size==='tall';
  const square = size==='square';
  const wide = size==='wide';
  const show = tall ? rows.slice(0,4) : wide ? rows : rows.slice(0,3);

  if (tall) {
    return <W size={size} title={state==='active'?'Мои заявления':'Архив'} sub={state==='active'?`${rows.length} активных`:'Архив заявлений'} iconBg={C.gC} icon={<IconDesktop />} badge={state==='active'?'3 активных':''} badgeC="g" acc="g" noFoot>
      <div style={{display:'flex',flexDirection:'column',gap:8,height:'100%',overflow:'hidden'}}>
        {show.map((r, i) => <div key={i} style={{padding:'10px 12px',borderRadius:14,background:C.sf2,border:`1px solid ${C.ol}33`,minWidth:0}}><div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}><div style={{fontSize:10,color:C.p,fontWeight:700,whiteSpace:'nowrap'}}>{r[0]}</div><div style={{marginLeft:'auto'}}><Chip c={r[6]} sm>{r[5]}</Chip></div></div><div style={{fontSize:11,fontWeight:600,color:C.t1,lineHeight:1.4,marginBottom:8,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{r[1]}</div><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{flex:1,minWidth:0}}><Prog pct={r[4]} c={r[6]} h={4} /></div><span style={{fontSize:10,color:C.t3,fontWeight:600,whiteSpace:'nowrap'}}>{r[2]}/{r[3]}</span></div><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8,fontSize:10,color:C.t3}}><span>{state==='active'?'Прогресс':'Статус завершения'}</span><span>{r[7]}</span></div></div>)}
      </div>
    </W>;
  }

  return <W size={size} title="Мои заявления" sub={state==='active'?`${rows.length} активных`:'Архив заявлений'} iconBg={C.gC} icon={<IconDesktop />} badge={state==='active'?'3 активных':''} badgeC="g" acc="g"><table style={{width:'100%',borderCollapse:'collapse',fontSize:11,tableLayout:'fixed'}}><colgroup><col style={{width:'19%'}}/><col style={{width:'38%'}}/><col style={{width:'24%'}}/><col style={{width:'12%'}}/><col style={{width:'7%'}}/></colgroup><thead><tr>{['№','Наименование','Стадия','Прогресс','Дата'].map((h, i) => <th key={i} style={{textAlign:'left',padding:'2px 6px 8px',borderBottom:`1.5px solid ${C.ol}50`,fontSize:9.5,fontWeight:700,textTransform:'uppercase',color:C.t3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{h}</th>)}</tr></thead><tbody>{show.map((r, i) => <tr key={i} className="lrow"><td style={{padding:'6px',color:C.p,fontWeight:600,fontSize:10,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r[0]}</td><td style={{padding:'6px'}}><div style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',fontSize:11,color:C.t1}}>{r[1]}</div></td><td style={{padding:'6px',overflow:'hidden'}}><div style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}><Chip c={r[6]} sm>{r[5]}</Chip></div></td><td style={{padding:'6px',overflow:'hidden'}}><div style={{display:'flex',alignItems:'center',gap:6,minWidth:0}}><div style={{flex:1,minWidth:0}}><Prog pct={r[4]} c={r[6]} h={4} /></div><span style={{fontSize:9,color:C.t3,whiteSpace:'nowrap',fontWeight:600,flexShrink:0}}>{r[2]}/{r[3]}</span></div></td><td style={{padding:'6px',fontSize:10,color:C.t3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r[7]}</td></tr>)}</tbody></table></W>;
}

const actData = [{av:'КН',action:'закрыла задачу',ref:'ЗД-1038',t:'9:41',c:C.gM,tag:'g'},{av:'СА',action:'создал документ',ref:'ДОК-3451',t:'9:22',c:C.p,tag:'p'},{av:'ПД',action:'добавил комментарий',ref:'ЗД-1031',t:'8:55',c:C.aM,tag:'a'},{av:'ЛМ',action:'просрочил задачу',ref:'ЗД-1024',t:'вчера',c:C.rM,tag:'r'},{av:'НЕ',action:'создал заявление',ref:'ЗЯВ-923',t:'вчера',c:C.tlM,tag:'tl'}];
function W11({ size='standard' }) {
  const rows = size==='compact' ? actData.slice(0,3) : actData;
  return <W size={size} title={size==='compact'?'Команда':'Активность команды'} sub="Последние действия" iconBg={C.puC} icon={<IconUsers />} acc="pu" noFoot={size==='compact'}>{rows.map((it, i) => <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<rows.length-1?`1px solid ${C.ol}30`:'none'}}><div style={{position:'relative',flexShrink:0}}><Av t={it.av} bg={it.c} s={32} /><div style={{position:'absolute',bottom:-1,right:-1,width:10,height:10,borderRadius:'50%',background:it.c,border:'2px solid #fff'}} /></div><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,color:C.t2,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}><span style={{fontWeight:600,color:C.t1}}>{it.av} </span>{it.action}</div><div style={{fontSize:11,color:C.p,fontWeight:500,marginTop:2}}>{it.ref}</div></div><div style={{fontSize:10,color:C.t3,flexShrink:0,textAlign:'right'}}><div>{it.t}</div><div style={{marginTop:3}}><Chip c={it.tag} sm>{it.c===C.gM?'закрыто':it.c===C.rM?'просроч':it.c===C.p?'создано':'коммент'}</Chip></div></div></div>)}</W>;
}

const calEvts = [{time:'10:00',title:'Совещание по ГП',place:'Зал 3',c:C.p},{time:'12:30',title:'Согласование ГПЗУ №214',place:'Онлайн',c:C.gM},{time:'15:00',title:'Приёмная комиссия',place:'Каб. 211',c:C.aM}];
const calMini = [{dow:'ПН',day:'30',dot:true,active:false},{dow:'ВТ',day:'31',dot:true,active:true},{dow:'СР',day:'1',dot:true,active:false},{dow:'ЧТ',day:'2',dot:true,active:false},{dow:'ПТ',day:'3',dot:false,active:false}];
function W12({ size='standard' }) {
  const cmp = size==='compact';
  const week = calMini;
  const evts = cmp ? calEvts.slice(0,2) : calEvts;
  return <W size={size} title="Мой календарь" sub="Сегодня, 31 марта 2026" iconBg={C.pC} icon={<IconCal />} acc="p" foot={<TLink>Полный календарь</TLink>} noFoot={cmp}><div style={{display:'grid',gridTemplateColumns:`repeat(${week.length},minmax(0,1fr))`,gap:cmp?4:8,marginBottom:14}}>{week.map((d, i) => <div key={i} style={{textAlign:'center'}}><div style={{fontSize:9,fontWeight:600,color:C.t3,marginBottom:4}}>{d.dow}</div><div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:32,height:30,padding:'0 8px',borderRadius:10,fontSize:14,fontWeight:600,lineHeight:1,background:d.active?C.p:'transparent',color:d.active?'#fff':C.t2}}>{d.day}</div><div style={{height:8,display:'flex',alignItems:'center',justifyContent:'center',marginTop:2}}>{d.dot ? <div style={{width:4,height:4,borderRadius:'50%',background:d.active?C.pC:C.p,opacity:d.active ? .7 : 1}} /> : null}</div></div>)}</div><div style={{fontSize:11,fontWeight:600,color:C.t2,marginBottom:8}}>Сегодня — 31 марта</div>{evts.map((ev, i) => <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:cmp?'7px 0':'9px 0',borderBottom:i<evts.length-1?`1px solid ${C.ol}44`:'none'}}><div style={{fontSize:11,fontWeight:500,color:C.t3,width:38,flexShrink:0}}>{ev.time}</div><div style={{width:3,height:cmp?24:30,borderRadius:3,background:ev.c,flexShrink:0}} /><div style={{flex:1,minWidth:0}}><div style={{fontSize:cmp?11:12,fontWeight:600,color:C.t1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ev.title}</div><div style={{fontSize:10,color:C.t3,marginTop:1}}>{ev.place}</div></div><div style={{width:8,height:8,borderRadius:'50%',background:ev.c,flexShrink:0}} /></div>)}</W>;
}

const newsData = [{tag:'Регламент',text:'Обновлён регламент согласования ГПЗУ — сокращены сроки до 15 дней',date:'09.04',c:'p'},{tag:'Система',text:'Новая версия ИАС ОГД доступна для тестирования',date:'08.04',c:'tl'},{tag:'Событие',text:'Итоги совещания ДГА от 07.04.2026',date:'07.04',c:'g'},{tag:'Нормы',text:'Изменения в нормах строительства 2026',date:'05.04',c:'a'}];
function W13({ size='standard' }) {
  const cmp = size==='compact';
  const rows = cmp ? newsData.slice(0,2) : newsData;
  return <W size={size} title="Новости" sub="Официальные новости ДГА" iconBg={C.aC} icon={<IconNews />} acc="a">{rows.map((n, i) => <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:cmp?'8px 0':'10px 0',borderBottom:i<rows.length-1?`1px solid ${C.ol}30`:'none'}}><div style={{width:3,alignSelf:'stretch',borderRadius:3,background:C[n.c+'M'] || C.aM,flexShrink:0,minHeight:32}} /><div style={{flex:1,minWidth:0}}><div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}><Chip c={n.c} sm>{n.tag}</Chip><span style={{fontSize:10,color:C.t3,marginLeft:'auto'}}>{n.date}</span></div><div style={{fontSize:cmp?11:12,fontWeight:500,color:C.t1,lineHeight:1.45}}>{n.text}</div></div></div>)}</W>;
}

const regData = [{l:'Градостроительный кодекс РФ',n:12,c:'p'},{l:'Постановления Правительства Москвы',n:28,c:'g'},{l:'Приказы ДГА',n:7,c:'a'},{l:'Технические регламенты',n:15,c:'tl'}];
function W15({ size='standard' }) {
  const cmp = size==='compact';
  const rows = cmp ? regData.slice(0,3) : regData;
  return <W size={size} title={cmp?'Норматив. база':'Нормативная база'} sub="62 документа" iconBg={C.pC} icon={<IconBook />} acc="p">{!cmp ? <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,background:C.sf2,border:`1px solid ${C.ol}44`,borderRadius:10,padding:'8px 12px'}}><IconSearch /><span style={{fontSize:12,color:C.t3}}>Поиск нормативного документа...</span></div> : null}{rows.map((r, i) => <div key={i} className="lrow" style={{display:'flex',alignItems:'center',gap:10,padding:'9px 4px'}}><div style={{width:34,height:34,borderRadius:10,background:C[r.c+'C'],display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IconBook c={C[r.c+'M']} /></div><div style={{flex:1,fontSize:12,fontWeight:500,color:C.t1,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{r.l}</div><Chip c={r.c} sm>{r.n} doc</Chip></div>)}</W>;
}

const staffData = [['Алексеев С.П.','Начальник ОГА','ОГА',C.p],['Смирнова Е.В.','Гл. специалист','ОТП',C.gM],['Попов Д.Р.','Специалист','ОКС',C.aM],['Козлова Н.О.','Вед. специалист','ОГА',C.puM],['Лебедев М.О.','Нач. отдела','ОТП',C.rM],['Новикова М.С.','Аналитик','ОКС',C.tlM]];
function W16({ size='standard' }) {
  const cmp = size==='compact';
  const rows = cmp ? staffData.slice(0,3) : staffData;
  return <W size={size} title={cmp?'Сотрудники':'Справочник сотрудников'} sub="128 сотрудников" iconBg={C.gC} icon={<IconPeople />} acc="g">{!cmp ? <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,background:C.sf2,border:`1px solid ${C.ol}44`,borderRadius:10,padding:'8px 12px'}}><IconSearch /><span style={{fontSize:12,color:C.t3}}>Найти сотрудника...</span></div> : null}{rows.map((p, i) => <div key={i} className="lrow" style={{display:'flex',alignItems:'center',gap:10,padding:'7px 4px'}}><Av t={p[0].split(' ').map((x) => x[0]).join('').slice(0,2)} bg={p[3]} s={32} /><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:C.t1,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{p[0]}</div><div style={{fontSize:10,color:C.t3,marginTop:1,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{p[1]}</div></div><Chip c="p" sm>{p[2]}</Chip></div>)}</W>;
}

const quickQ = ['Как согласовать ГПЗУ?','Статус моих задач','Новые регламенты','Найти сотрудника'];
const botResponses = {
  гпзу:'Для согласования ГПЗУ подайте заявление через ИАС ОГД. Срок рассмотрения — 20 рабочих дней согласно регламенту ДГА.',
  задач:'У вас сейчас: 4 новые, 12 в работе, 3 просроченные. Хотите открыть полный список?',
  регламент:'Обновлён регламент согласования ГПЗУ — сроки сокращены до 15 дней. Документ доступен в нормативной базе.',
  сотрудник:'Введите имя или отдел в справочнике сотрудников — там 128 специалистов по 5 отделам.'
};
const getBotReply = (q) => {
  const ql = String(q || '').toLowerCase();
  for (const k in botResponses) {
    if (Object.prototype.hasOwnProperty.call(botResponses, k) && ql.includes(k)) {
      return botResponses[k];
    }
  }
  return 'Обрабатываю запрос... Рекомендую обратиться к разделу «Нормативная база» или найти нужный отдел в справочнике.';
};
function W17({ size='standard', state='idle' }) {
  const [msgs, setMsgs] = useState([{ role:'bot', text:'Привет! Я ИИ-ассистент ЕЦП ГД. Задайте вопрос о задачах, документах или регламентах.' }]);
  const [inp, setInp] = useState('');
  const [typing, setTyping] = useState(false);
  const msgsRef = useRef(null);
  const cmp = size==='compact';
  const tall = size==='tall';
  const square = size==='square';
  const wide = size==='wide';
  const send = useCallback((text) => {
    if (!String(text || '').trim()) return;
    setMsgs((prev) => prev.concat([{ role:'user', text }]));
    setInp('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((prev) => prev.concat([{ role:'bot', text:getBotReply(text) }]));
      setTyping(false);
    }, 400);
  }, []);
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, typing]);

  const InputRow = (compactMode, pinnedBottom=false) => <div style={{display:'flex',gap:8,alignItems:'center',paddingTop:compactMode?8:10,borderTop:`1px solid ${C.ol}30`,marginTop:pinnedBottom?'auto':(compactMode?8:10),background:pinnedBottom?C.sf:'transparent'}}><input className="cinput" value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => { if (e.key==='Enter') send(inp); }} placeholder="Задать вопрос..." style={compactMode?{fontSize:11,padding:'7px 12px'}:undefined} /><button className="csend" onClick={() => send(inp)} style={compactMode?{width:32,height:32,borderRadius:16}:undefined}><IconSend /></button></div>;

  if (cmp || tall) {
    return <W size={tall ? 'tall' : size} title="AI-ассистент" sub={tall ? 'Задайте вопрос ИИ' : undefined} iconBg={C.tlC} icon={<IconBot />} noFoot acc="tl"><div style={{display:'flex',flexDirection:'column',height:'100%'}}><div style={{textAlign:'center',padding:tall?'8px 0 10px':'4px 0 8px'}}><div style={{width:tall?56:48,height:tall?56:48,borderRadius:'50%',background:`linear-gradient(135deg,${C.tlM},${C.p})`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}><IconBot c="#fff" /></div><div style={{fontSize:12,fontWeight:500,color:C.t1,marginBottom:4}}>ИИ-ассистент</div><div style={{fontSize:10,color:C.t3,lineHeight:1.4}}>Задайте вопрос о процессах ЕЦП ГД</div></div><div style={{display:'flex',flexDirection:'column',gap:6}}>{quickQ.slice(0, tall?3:2).map((q, i) => <button key={i} onClick={() => send(q)} style={{background:C.sf3,border:`1px solid ${C.ol}44`,borderRadius:999,padding:'7px 12px',fontSize:10,color:C.t2,fontWeight:500,cursor:'pointer',textAlign:'left',fontFamily:"'Roboto',sans-serif"}}>{q}</button>)}</div>{tall ? <div ref={msgsRef} style={{flex:1,display:'flex',flexDirection:'column',gap:8,overflowY:'auto',paddingTop:10}}>{msgs.slice(-2).map((m, i) => <div key={i} className={m.role==='bot' ? 'cbubble cbot' : 'cbubble cuser'} style={{maxWidth:'100%'}}>{m.text}</div>)}{typing ? <div className="cbubble cbot">Печатаю…</div> : null}</div> : null}<div style={{marginTop:'auto'}}>{InputRow(true)}</div></div></W>;
  }

  if (square && state === 'idle') {
    return <W size={size} title="AI-ассистент" sub="ИИ ЕЦП ГД" iconBg={C.tlC} icon={<IconBot />} acc="tl" noFoot>
      <div style={{display:'flex',flexDirection:'column',height:'100%',minHeight:0}}>
        <div ref={msgsRef} style={{flex:1,minHeight:0,overflowY:'auto',paddingRight:2,display:'flex',flexDirection:'column',gap:8}}>
          {msgs.map((m, i) => <div key={i} className={m.role==='bot' ? 'cbubble cbot' : 'cbubble cuser'} style={{maxWidth:'92%'}}>{m.text}</div>)}
          {typing ? <div className="cbubble cbot" style={{maxWidth:'92%'}}>Печатаю…</div> : null}
        </div>
        {InputRow(false, true)}
      </div>
    </W>;
  }

  if (state === 'idle') {
    return <W size={size} title="AI-ассистент" sub="Задайте вопрос ИИ" iconBg={C.tlC} icon={<IconBot />} acc="tl" noFoot><div style={{display:'flex',flexDirection:'column',height:'100%'}}><div style={{display:'flex',gap:16,alignItems:'flex-start'}}><div style={{width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${C.tlM},${C.p})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IconBot c="#fff" /></div><div style={{flex:1}}><div style={{fontSize:12,color:C.t2,lineHeight:1.5,marginBottom:12}}>Привет! Я помогу найти информацию о процессах, задачах и регламентах ЕЦП ГД.</div><div style={{display:'grid',gridTemplateColumns:wide?'repeat(2,1fr)':'1fr',gap:6}}>{quickQ.map((q, i) => <button key={i} onClick={() => send(q)} style={{background:C.sf3,border:`1px solid ${C.ol}44`,borderRadius:10,padding:'9px 12px',fontSize:11,color:C.t2,fontWeight:500,cursor:'pointer',textAlign:'left',fontFamily:"'Roboto',sans-serif"}}>{q}</button>)}</div></div></div><div style={{marginTop:'auto'}}>{InputRow(false)}</div></div></W>;
  }
  return <W size={size} title="AI-ассистент" sub="ИИ ЕЦП ГД" iconBg={C.tlC} icon={<IconBot />} acc="tl" noFoot><div style={{display:'flex',flexDirection:'column',height:'100%'}}><div ref={msgsRef} style={{flex:1,display:'flex',flexDirection:'column',gap:8,maxHeight:size==='standard'?160:180,overflowY:'auto',paddingBottom:4,paddingRight:2}}>{msgs.map((m, i) => <div key={i} className={m.role==='bot' ? 'cbubble cbot' : 'cbubble cuser'}>{m.text}</div>)}{typing ? <div className="cbubble cbot">Печатаю…</div> : null}</div>{InputRow(false)}</div></W>;
}

const oivData = [
  {authority:'Правительство Москвы',head:'Собянин Сергей Семенович',headRole:'Мэр Москвы',group:'Руководство'},
  {authority:'Аппарат Мэра и Правительства Москвы',head:'Сергунина Наталья Алексеевна',headRole:'Заместитель Мэра Москвы в Правительстве Москвы — руководитель Аппарата Мэра и Правительства Москвы',group:'Руководство'},
  {authority:'Комплекс городского хозяйства Москвы',head:'Бирюков Петр Павлович',headRole:'Заместитель Мэра Москвы в Правительстве Москвы по вопросам жилищно-коммунального хозяйства и благоустройства',group:'Заместители Мэра'},
  {authority:'Комплекс региональной безопасности и информационной политики Москвы',head:'Горбенко Александр Николаевич',headRole:'Заместитель Мэра Москвы в Правительстве Москвы по вопросам региональной безопасности и информационной политики',group:'Заместители Мэра'},
  {authority:'Комплекс экономической политики города Москвы',head:'Багреева Мария Андреевна',headRole:'Заместитель Мэра Москвы в Правительстве Москвы',group:'Заместители Мэра'},
  {authority:'Социальный комплекс Москвы',head:'Ракова Анастасия Владимировна',headRole:'Заместитель Мэра Москвы в Правительстве Москвы по вопросам социального развития',group:'Заместители Мэра'},
  {authority:'Комплекс градостроительной политики и строительства Москвы',head:'Ефимов Владимир Владимирович',headRole:'Заместитель Мэра Москвы в Правительстве Москвы по вопросам градостроительной политики и строительства',group:'Заместители Мэра'},
  {authority:'Департамент информационных технологий города Москвы',head:'Лысенко Эдуард Анатольевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент финансов города Москвы',head:'Зяббарова Елена Юрьевна',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент культуры города Москвы',head:'Фурсин Алексей Анатольевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент образования и науки города Москвы',head:'Каклюгина Ирина Александровна',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент здравоохранения города Москвы',head:'Хрипун Алексей Иванович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент труда и социальной защиты населения города Москвы',head:'Стружак Евгений Петрович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент градостроительной политики города Москвы',head:'Овчинский Владислав Анатольевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент гражданского строительства города Москвы',head:'Александров Алексей Алексеевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент городского имущества города Москвы',head:'Соловьева Екатерина Александровна',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент строительства транспортной и инженерной инфраструктуры города Москвы',head:'Десятков Василий Николаевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент торговли и услуг города Москвы',head:'Немерюк Алексей Алексеевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент города Москвы по конкурентной политике',head:'Пуртов Кирилл Сергеевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент природопользования и охраны окружающей среды города Москвы',head:'Урожаева Юлия Валерьевна',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент территориальных органов исполнительной власти города Москвы',head:'Преснов Дмитрий Николаевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент предпринимательства и инновационного развития города Москвы',head:'Кострома Кристина Геннадьевна',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент культурного наследия города Москвы',head:'Емельянов Алексей Александрович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент по делам гражданской обороны, чрезвычайным ситуациям и пожарной безопасности города Москвы',head:'Акимов Юрий Николаевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент капитального ремонта города Москвы',head:'Беляев Алексей Александрович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент жилищно-коммунального хозяйства города Москвы',head:'Чигликов Раис Ринатович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент региональной безопасности и противодействия коррупции города Москвы',head:'Регнацкий Владимир Владимирович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент внешнеэкономических и международных связей города Москвы',head:'Черёмин Сергей Евгеньевич',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент спорта города Москвы',head:'Кондаранцев Алексей Александрович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент национальной политики и межрегиональных связей города Москвы',head:'Сучков Виталий Иванович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Департамент средств массовой информации и рекламы города Москвы',head:'Шубин Иван Владимирович',headRole:'Руководитель',group:'Департаменты'},
  {authority:'Пресс-служба Мэра и Правительства Москвы',head:'Пенькова Гульнара Валерьевна',headRole:'Руководитель',group:'Службы и управления'},
  {authority:'Главное контрольное управление города Москвы',head:'Данчиков Евгений Александрович',headRole:'Начальник',group:'Службы и управления'},
  {authority:'Объединение административно-технических инспекций города Москвы',head:'Ларин Александр Сергеевич',headRole:'Начальник',group:'Службы и управления'},
  {authority:'Комитет государственного строительного надзора города Москвы',head:'Слободчиков Антон Олегович',headRole:'Председатель',group:'Комитеты и инспекции'},
  {authority:'Государственная инспекция по контролю за использованием объектов недвижимости города Москвы',head:'Бобров Иван Владимирович',headRole:'Начальник',group:'Комитеты и инспекции'},
  {authority:'Комитет государственных услуг города Москвы',head:'Шинкарук Елена Вячеславовна',headRole:'Председатель',group:'Комитеты и инспекции'},
  {authority:'Комитет по туризму города Москвы',head:'Козлов Евгений Александрович',headRole:'Председатель',group:'Комитеты и инспекции'},
  {authority:'Комитет общественных связей и молодежной политики города Москвы',head:'Драгунова Екатерина Вячеславовна',headRole:'Председатель',group:'Комитеты и инспекции'},
  {authority:'Комитет города Москвы по ценовой политике в строительстве и государственной экспертизе проектов',head:'Щербаков Иван Александрович',headRole:'Председатель',group:'Комитеты и инспекции'},
  {authority:'Государственная жилищная инспекция города Москвы',head:'Кичиков Олег Владимирович',headRole:'Начальник',group:'Комитеты и инспекции'}
];
function W18({ size='wide' }) {
  const tall = size==='tall';
  const wide = size==='wide';
  const square = size==='square';
  const xwide = size==='xwide';
  const xl = size==='xl';
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const tabs = [{key:'all',label:'Все'},{key:'lead',label:'Руководство'},{key:'dept',label:'Департаменты'},{key:'ctrl',label:'Комитеты и инспекции'}];
  const groupMap = {
    all:() => true,
    lead:(x) => x.group==='Руководство' || x.group==='Заместители Мэра',
    dept:(x) => x.group==='Департаменты',
    ctrl:(x) => x.group==='Комитеты и инспекции' || x.group==='Службы и управления'
  };
  const norm = (s) => String(s || '').toLowerCase();
  const filtered = oivData
    .filter((x) => groupMap[group](x))
    .filter((x) => !String(q || '').trim() || norm(`${x.authority} ${x.head} ${x.headRole} ${x.group}`).includes(norm(q)));

  const shown = tall ? filtered.slice(0,4) : square ? filtered.slice(0,5) : wide ? filtered.slice(0,6) : xwide ? filtered.slice(0,8) : filtered.slice(0,12);
  const gridCols = tall ? '1fr' : square ? '1fr' : wide ? 'repeat(2,minmax(0,1fr))' : xwide ? 'repeat(2,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))';
  const tagColor = (item) => item.group==='Руководство' || item.group==='Заместители Мэра' ? 'p' : item.group==='Департаменты' ? 'g' : 'a';
  const cardPad = tall || wide || square ? '12px 14px' : '8px 10px';
  const iconSize = tall || wide || square ? 40 : 32;
  const iconRadius = tall || wide || square ? 12 : 10;
  const titleSize = tall || wide || square ? 12 : 11;
  const metaSize = tall || wide || square ? 10 : 9;
  const chipMargin = tall || wide || square ? 8 : 6;

  return <W size={size} title="Структура Правительства Москвы" sub={tall?'Поиск по органам власти':'Навигация и поиск по органам власти'} iconBg={C.pC} icon={<IconPeople c={C.p} />} badge={String(filtered.length)} badgeC="p" acc="p" foot={<TLink>Открыть полный справочник</TLink>}>
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,background:C.sf2,border:`1px solid ${C.ol}44`,borderRadius:12,padding:tall||wide?'7px 10px':'6px 9px'}}>
        <IconSearch />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tall?'Найти орган власти':'Введите орган власти, главу или тип органа'} style={{border:'none',outline:'none',background:'transparent',fontSize:tall||wide?11:10,color:C.t1,width:'100%',fontFamily:"'Roboto',sans-serif"}} />
      </div>
      <Tabs tabs={tabs} active={group} onChange={setGroup} sm={!(tall||wide)} />
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap'}}>
        <Chip c="p" sm>{filtered.length} органов</Chip>
        <span style={{fontSize:tall||wide?10:9,color:C.t3}}>{tall?'Сначала орган власти, затем руководитель':'Карточки ориентированы на орган власти, а не на человека'}</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:gridCols,gap:8,overflowY:'auto',paddingRight:2}}>
        {shown.map((item, i) => (
          <div key={i} className="fcard" style={{padding:cardPad}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{width:iconSize,height:iconSize,borderRadius:iconRadius,background:C[tagColor(item)+'C'],display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <IconPeople c={C[tagColor(item)+'M']} />
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:titleSize,fontWeight:700,color:C.t1,lineHeight:1.3,marginBottom:3}}>{item.authority}</div>
                <div style={{fontSize:metaSize,color:C.t3,lineHeight:1.3}}>Руководитель: {item.head}</div>
                <div style={{fontSize:metaSize,color:C.t3,lineHeight:1.3,marginTop:2}}>{item.headRole}</div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:chipMargin,flexWrap:'wrap'}}>
                  <Chip c={tagColor(item)} sm>{item.group}</Chip>
                </div>
              </div>
            </div>
          </div>
        ))}
        {shown.length===0 ? <div style={{padding:'18px 12px',borderRadius:14,background:C.sf2,border:`1px dashed ${C.ol}`,fontSize:12,color:C.t3}}>Ничего не найдено. Попробуйте название органа власти, департамента, комитета или инспекции.</div> : null}
      </div>
    </div>
  </W>;
}

const monthNamesRu = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const weekDaysRuShort = ['П','В','С','Ч','П','С','В'];
const heatmapLevels = ['#ECEEF7', '#DCEEE1', '#B9DFC3', '#79BF97', '#2E9B58'];
const monthlyActivityData = {
  '2026-02': { total:'4 128', longest:'6д', current:'2д', top:'Февраль 2026', active:'18 фев 2026', values:[
    [null,null,null,2,0,0,0],
    [1,2,0,3,0,0,0],
    [0,1,2,4,1,0,0],
    [0,0,1,3,0,0,0],
    [0,0,0,2,null,null,null]
  ]},
  '2026-03': { total:'4 912', longest:'9д', current:'2д', top:'Март 2026', active:'29 мар 2026', values:[
    [null,null,null,null,null,null,0],
    [1,2,1,3,0,0,0],
    [1,2,2,4,1,0,0],
    [0,1,1,3,0,0,0],
    [0,0,0,2,0,0,null]
  ]},
  '2026-04': { total:'5 304', longest:'11д', current:'4д', top:'Апрель 2026', active:'2 апр 2026', values:[
    [null,null,1,4,1,0,0],
    [1,2,1,3,1,0,0],
    [0,1,2,4,2,0,0],
    [0,1,1,3,1,0,0],
    [0,0,1,2,null,null,null]
  ]}
};
const activityYearStats = { total:'7 181', activePeriod:'Март', activeDay:'29 мар 2026', longest:'12д', current:'3д' };
const yearHeatmapData = [
  [null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,0,3,4],
  [null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
  [null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null]
];
const heatmapYearMonthLabels = ['Я','Ф','М','А','М','И','И','А','С','О','Н','Д'];
const heatmapYearDayLabels = ['П','В','С','Ч','П'];

function MonthActivityCard({ monthKey, onPrev, onNext, compact = false }) {
  const data = monthlyActivityData[monthKey] || monthlyActivityData['2026-04'];
  const [year, month] = monthKey.split('-').map(Number);
  const title = monthNamesRu[month - 1].toUpperCase();
  const dayCellSize = compact ? 32 : 40;
  const dayGap = compact ? 8 : 10;
  return (
    <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:22,padding: compact ? '14px 14px 12px' : '18px 18px 16px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom: compact ? 8 : 12}}>
        <button onClick={onPrev} style={{width:30,height:30,borderRadius:15,border:`1px solid ${C.ol}55`,background:C.sf,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.t2}} aria-label="Предыдущий месяц">‹</button>
        <div style={{fontSize:15,fontWeight:700,color:C.p,letterSpacing:'.6px'}}>{title}</div>
        <button onClick={onNext} style={{width:30,height:30,borderRadius:15,border:`1px solid ${C.ol}55`,background:C.sf,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.t2}} aria-label="Следующий месяц">›</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:dayGap,marginBottom: compact ? 8 : 12}}>
        {weekDaysRuShort.map((d, i) => <div key={d + i} style={{textAlign:'center',fontSize:11,fontWeight:700,color:C.t2}}>{d}</div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gridTemplateRows:`repeat(5,${dayCellSize}px)`,gap:dayGap}}>
        {data.values.flatMap((row, r) => row.map((v, c) => {
          const isEmpty = v === null;
          const bg = isEmpty ? '#FFFFFF' : heatmapLevels[v];
          const border = isEmpty ? `1px solid ${C.ol}44` : v===0 ? `1px solid ${C.ol}44` : '1px solid transparent';
          const shadow = isEmpty ? 'none' : v>0 ? 'inset 0 1px 0 rgba(255,255,255,.26)' : 'none';
          const titleText = isEmpty ? `${monthNamesRu[month-1]} · ${weekDaysRuShort[c]} · дня нет в текущем месяце` : `${monthNamesRu[month-1]} · ${weekDaysRuShort[c]} · активность ${v}`;
          return <div key={`${r}-${c}`} title={titleText} style={{height:dayCellSize,borderRadius: compact ? 12 : 14,background:bg,border,boxShadow:shadow}} />;
        }))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop: compact ? 10 : 16}}>
        <div style={{paddingTop:10,borderTop:`1px solid ${C.ol}33`}}><div style={{fontSize:10,color:C.t3,marginBottom:4}}>Событий</div><div style={{fontSize:14,fontWeight:700,color:C.t1}}>{data.total}</div></div>
        <div style={{paddingTop:10,borderTop:`1px solid ${C.ol}33`}}><div style={{fontSize:10,color:C.t3,marginBottom:4}}>Активный месяц</div><div style={{fontSize:14,fontWeight:700,color:C.t1}}>{data.top}</div></div>
        <div style={{paddingTop:10,borderTop:`1px solid ${C.ol}33`}}><div style={{fontSize:10,color:C.t3,marginBottom:4}}>Макс. стрик</div><div style={{fontSize:14,fontWeight:700,color:C.t1}}>{data.longest}</div></div>
        <div style={{paddingTop:10,borderTop:`1px solid ${C.ol}33`}}><div style={{fontSize:10,color:C.t3,marginBottom:4}}>Текущий стрик</div><div style={{fontSize:14,fontWeight:700,color:C.t1}}>{data.current}</div></div>
      </div>
    </div>
  );
}

function YearActivityHeatmap({ data }) {
  const cols = data[0].length;
  const monthStarts = [0,4,8,13,17,21,26,30,35,39,43,48];
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'28px 1fr',columnGap:12,alignItems:'start'}}>
        <div />
        <div style={{display:'grid',gridTemplateColumns:`repeat(${cols}, minmax(10px, 1fr))`,columnGap:4,marginBottom:10}}>
          {Array.from({length: cols}, (_, i) => (
            <div key={i} style={{fontSize:10,fontWeight:500,color:C.t3,textAlign:'center',lineHeight:1}}>{monthStarts.includes(i)?heatmapYearMonthLabels[monthStarts.indexOf(i)]||'':''}</div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateRows:'repeat(5, 18px)',rowGap:8,paddingTop:1}}>
          {heatmapYearDayLabels.map((d, i) => <div key={d + i} style={{fontSize:10,fontWeight:500,color:C.t3,lineHeight:'18px'}}>{d}</div>)}
        </div>
        <div style={{display:'grid',gridTemplateColumns:`repeat(${cols}, minmax(10px, 1fr))`,gridTemplateRows:'repeat(5, 18px)',columnGap:4,rowGap:8}}>
          {data.flatMap((row, r) => row.map((v, c) => {
            const isOutOfYear = v === null;
            const bg = isOutOfYear ? '#FFFFFF' : v===0 ? C.sf3 : heatmapLevels[v];
            const border = isOutOfYear ? `1px solid ${C.ol}28` : v===0 ? `1px solid ${C.ol}33` : '1px solid transparent';
            const title = isOutOfYear ? `${heatmapYearDayLabels[r]} · неделя ${c+1} · вне текущего года` : `${heatmapYearDayLabels[r]} · неделя ${c+1} · активность ${v}`;
            return <div key={`${r}-${c}`} title={title} style={{height:18,borderRadius:4,background:bg,border}} />;
          }))}
        </div>
      </div>
    </div>
  );
}

function W19({ size='wide' }) {
  const square = size==='square';
  const xl = size==='xl';
  const monthKeys = Object.keys(monthlyActivityData);
  const [monthIndex, setMonthIndex] = useState(monthKeys.indexOf('2026-04'));
  const currentMonthKey = monthKeys[Math.max(0, Math.min(monthKeys.length - 1, monthIndex))];
  const legend = (
    <div style={{display:'flex',gap:6,alignItems:'center',fontSize:10,color:C.t3,whiteSpace:'nowrap'}}>
      <span>Меньше</span>
      {[0,1,2,3,4].map((v) => (
        <span key={v} style={{width:12,height:12,borderRadius:4,background:heatmapLevels[v],border:`1px solid ${v===0?C.ol+'55':'transparent'}`,display:'inline-block'}} />
      ))}
      <span>Больше</span>
    </div>
  );

  if (square) {
    return <W size={size} title="Тепловая карта" sub="Активность по месяцу" iconBg={C.gC} icon={<IconBar c={C.gM} />} badge="Новая" badgeC="g" acc="g">
      <div style={{display:'flex',flexDirection:'column',height:'100%',minHeight:0}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:10}}>{legend}</div>
        <MonthActivityCard monthKey={currentMonthKey} compact onPrev={() => setMonthIndex((v) => Math.max(0, v - 1))} onNext={() => setMonthIndex((v) => Math.min(monthKeys.length - 1, v + 1))} />
      </div>
    </W>;
  }

  return <W size={size} title="Тепловая карта" sub="Годовая активность" iconBg={C.gC} icon={<IconBar c={C.gM} />} badge="Новая" badgeC="g" acc="g">
    <div style={{display:'flex',flexDirection:'column',minHeight:336}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:14}}>
        <div>
          <div style={{fontSize:32,fontWeight:300,color:C.t1,lineHeight:1}}>{activityYearStats.total}</div>
          <div style={{fontSize:11,color:C.t3,marginTop:4}}>событий за год</div>
        </div>
        {legend}
      </div>
      <div style={{background:`linear-gradient(180deg, ${C.sf2} 0%, #FFFFFF 100%)`,border:`1px solid ${C.ol}33`,borderRadius:16,padding:'18px 18px 16px',marginBottom:14}}>
        <div style={{fontSize:12,color:C.t2,marginBottom:10}}>Активность по году</div>
        <YearActivityHeatmap data={yearHeatmapData} />
        <div style={{height:1,background:C.ol+'33',margin:'18px 0 14px'}} />
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:6}}>Самый активный месяц</div><div style={{fontSize:14,fontWeight:600,color:C.t1}}>{activityYearStats.activePeriod}</div></div>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:6}}>Самый активный день</div><div style={{fontSize:14,fontWeight:600,color:C.t1}}>{activityYearStats.activeDay}</div></div>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:6}}>Максимальный стрик</div><div style={{fontSize:14,fontWeight:600,color:C.t1}}>{activityYearStats.longest}</div></div>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:6}}>Текущий стрик</div><div style={{fontSize:14,fontWeight:600,color:C.t1}}>{activityYearStats.current}</div></div>
        </div>
      </div>
    </div>
  </W>;
}

export {
  W01,
  W02,
  W03,
  W04,
  W05,
  W06,
  W07,
  W08,
  W09,
  W10,
  W11,
  W12,
  W13,
  W15,
  W16,
  W17,
  W18,
  W19,
};
