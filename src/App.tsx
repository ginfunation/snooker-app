import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
import React, { useState } from 'react';
import { Trophy, PlusCircle, RotateCcw, DollarSign, Target, Zap, Newspaper, Scale, Calculator as CalcIcon, History as HistoryIcon, BookOpen, Menu } from 'lucide-react';

// --- 类型定义 ---
export type Player = 'A' | 'B';
export type RaceType = 3 | 5 | 7;
export type ViewName = 'calculator' | 'rules' | 'history';

export interface GameRecord {
  id: string;
  index: number;
  winner: Player;
  rawScoreA: number;
  rawScoreB: number;
  finalScoreA: number;
  finalScoreB: number;
  handicapValue: number;
  handicapRecipient: Player | null;
  isGoldenGame: boolean;
  advantage: number;
  note?: string; 
}

export interface MatchState {
  playerAName: string;
  playerBName: string;
  totalCost: number;
  winsA: number;
  winsB: number;
  raceType: RaceType;
  games: GameRecord[];
  isFinished: boolean;
  matchWinner: Player | null;
}

// --- 组件: Sidebar ---
const Sidebar = ({ currentView, onChangeView }: { currentView: ViewName; onChangeView: (v: ViewName) => void }) => {
  const menuItems = [
    { id: 'calculator', label: '比赛计分', icon: <CalcIcon size={20} /> },
    { id: 'history', label: '对局明细', icon: <HistoryIcon size={20} /> },
    { id: 'rules', label: '赛制规则', icon: <BookOpen size={20} /> },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white shadow-2xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-green-600 p-2 rounded-lg"><Trophy size={24} className="text-white"/></div>
        <div><h2 className="text-xl font-bold italic">台球争霸</h2><span className="text-xs text-slate-400">Snooker Plus</span></div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${currentView === item.id ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
        <p className="flex items-center gap-1 text-yellow-500 font-bold mb-2"><Zap size={12}/> 黄金局提醒</p >
        <p>抢5: 第1,3,5局</p ><p>抢7: 第1,4,7局</p >
      </div>
    </div>
  );
};

// --- 组件: RuleBook ---
const RuleBook = () => (
  <div className="space-y-6 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-slate-900">规则说明</h2>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-lg mb-2 text-green-700">黄金局机制</h3>
      <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
        <li>抢5局：第 1, 3, 5 局为黄金局</li>
        <li>抢7局：第 1, 4, 7 局为黄金局</li>
        <li>黄金局优势分权重翻倍。</li>
      </ul>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-lg mb-2 text-blue-700">让分规则</h3>
      <p className="text-sm text-slate-600">被让分方在计算胜负时加上让分值。若加上后分数更高，则判定为该局获胜。</p >
    </div>
  </div>
);

// --- 组件: MatchHistory ---
const MatchHistory = ({ data }: { data: MatchState }) => (
  <div className="space-y-4 max-w-4xl mx-auto">
    <h2 className="text-xl font-bold px-2">对局记录</h2>
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="bg-slate-50 text-slate-500 font-bold border-b">
          <tr>
            <th className="p-3 text-center">局</th>
            <th className="p-3 text-center">类型</th>
            <th className="p-3 text-center">比分 (含让分)</th>
            <th className="p-3 text-center">胜者</th>
            <th className="p-3">战报</th>
            <th className="p-3 text-right">优势</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.games.map(g => (
            <tr key={g.id} className={g.isGoldenGame ? 'bg-yellow-50' : ''}>
              <td className="p-3 text-center text-slate-400">#{g.index}</td>
              <td className="p-3 text-center">{g.isGoldenGame ? <span className="text-yellow-600 font-bold flex justify-center items-center gap-1"><Zap size={12}/>黄金</span> : '常规'}</td>
              <td className="p-3 text-center font-bold">
                {g.rawScoreA}{g.handicapRecipient==='A' && <span className="text-blue-500 text-xs">+{g.handicapValue}</span>} : {g.rawScoreB}{g.handicapRecipient==='B' && <span className="text-blue-500 text-xs">+{g.handicapValue}</span>}
              </td>
              <td className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs ${g.winner==='A'?'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'}`}>{g.winner==='A'?data.playerAName:data.playerBName}</span></td>
              <td className="p-3 text-slate-500 text-xs truncate max-w-[150px]">{g.note}</td>
              <td className="p-3 text-right text-slate-600">+{g.advantage}</td>
            </tr>
          ))}
          {data.games.length===0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400">暂无记录</td></tr>}
        </tbody>
      </table>
    </div>
  </div>
);

// --- 组件: Calculator (Dashboard) ---
const Dashboard = ({ matchState, onAddGame, onUpdateCost, onUpdateName, onUpdateRace, onReset }: any) => {
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [handicap, setHandicap] = useState(0);
  const [recipient, setRecipient] = useState<Player>('B');

  const calculateCost = () => {
    if (matchState.games.length === 0) return { costA: 0, costB: 0 };
    const gamesLostA = matchState.games.filter((g: GameRecord) => g.winner === 'B').length;
    const gamesLostB = matchState.games.filter((g: GameRecord) => g.winner === 'A').length;
    const creditA = matchState.games.filter((g: GameRecord) => g.winner === 'A').reduce((acc: number, g: GameRecord) => acc + (g.advantage * (g.isGoldenGame ? 2 : 1)), 0);
    const creditB = matchState.games.filter((g: GameRecord) => g.winner === 'B').reduce((acc: number, g: GameRecord) => acc + (g.advantage * (g.isGoldenGame ? 2 : 1)), 0);
    
    const weightA = Math.max(0, (gamesLostA * 100) - (creditA * 0.5));
    const weightB = Math.max(0, (gamesLostB * 100) - (creditB * 0.5));
    const totalW = weightA + weightB;

    if (totalW === 0) return { costA: matchState.totalCost / 2, costB: matchState.totalCost / 2 };
    return { costA: (matchState.totalCost * weightA) / totalW, costB: (matchState.totalCost * weightB) / totalW };
  };

  const costs = calculateCost();
  const nextGameIdx = matchState.games.length + 1;
  const isNextGolden = (matchState.raceType === 5 && [1,3,5].includes(nextGameIdx)) || (matchState.raceType === 7 && [1,4,7].includes(nextGameIdx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!scoreA || !scoreB) return;
    onAddGame(parseFloat(scoreA), parseFloat(scoreB), handicap, recipient);
    setScoreA(''); setScoreB(''); setHandicap(0);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* 记分牌 */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative">
        <div className="absolute top-4 right-4 bg-slate-800 rounded px-2 py-1 text-xs font-bold text-slate-400">抢{matchState.raceType}</div>
        <div className="flex justify-center mb-4 bg-slate-800 rounded-lg p-1 w-fit mx-auto">
            {[3,5,7].map(r => (
                <button key={r} onClick={()=>onUpdateRace(r)} disabled={matchState.games.length>0} className={`px-4 py-1 text-sm rounded ${matchState.raceType===r?'bg-green-600':'text-slate-400'}`}>抢{r}</button>
            ))}
        </div>
        <div className="flex justify-between items-center text-center">
            <div className="flex-1"><input className="bg-transparent text-center text-slate-400 font-bold w-full" value={matchState.playerAName} onChange={e=>onUpdateName('A',e.target.value)} /><div className={`text-6xl font-black ${matchState.winsA > matchState.winsB ? 'text-green-400':'text-white'}`}>{matchState.winsA}</div></div>
            <div className="text-xl text-slate-600 font-black">:</div>
            <div className="flex-1"><input className="bg-transparent text-center text-slate-400 font-bold w-full" value={matchState.playerBName} onChange={e=>onUpdateName('B',e.target.value)} /><div className={`text-6xl font-black ${matchState.winsB > matchState.winsA ? 'text-green-400':'text-white'}`}>{matchState.winsB}</div></div>
        </div>
      </div>

      {isNextGolden && !matchState.isFinished && <div className="bg-yellow-500 text-white p-3 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse"><Zap size={20}/> 第 {nextGameIdx} 局为黄金局，权重翻倍！</div>}

      {!matchState.isFinished ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex gap-2"><PlusCircle/> 录入数据</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Scale size={12}/>让分</span>
                    <button type="button" onClick={()=>setRecipient(recipient==='A'?'B':'A')} className="px-2 py-1 bg-white border rounded text-xs font-bold text-blue-600">{recipient==='A'?matchState.playerAName:matchState.playerBName} 受让</button>
                    {[0,10,20,30,40,50].map(v => <button key={v} type="button" onClick={()=>setHandicap(v)} className={`px-2 py-1 rounded text-xs font-bold ${handicap===v?'bg-blue-600 text-white':'bg-white border text-slate-500'}`}>{v===0?'-':`+${v}`}</button>)}
                </div>
                <div className="flex gap-4">
                    <input type="number" placeholder="A得分" value={scoreA} onChange={e=>setScoreA(e.target.value)} className="flex-1 p-4 bg-slate-100 rounded-xl text-center text-2xl font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 ring-green-500" />
                    <input type="number" placeholder="B得分" value={scoreB} onChange={e=>setScoreB(e.target.value)} className="flex-1 p-4 bg-slate-100 rounded-xl text-center text-2xl font-bold text-slate-900 outline-none focus:bg-white focus:ring-2 ring-green-500" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform">确认录入</button>
            </form>
        </div>
      ) : (
        <div className="bg-green-100 p-6 rounded-2xl text-center text-green-800 font-bold text-xl">🏆 比赛结束！<button onClick={onReset} className="block mx-auto mt-4 px-4 py-2 bg-white rounded-full text-sm border shadow-sm">再来一局</button></div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1"><DollarSign size={12}/> 总费用 (CNY)</label>
            <input type="number" value={matchState.totalCost||''} onChange={e=>onUpdateCost(parseFloat(e.target.value))} className="w-full text-2xl font-bold text-slate-800 outline-none mt-1" placeholder="0" />
        </div>
        <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-end">
             <div><div className="text-[10px] text-slate-400 mb-1">{matchState.playerAName} 支付</div><div className="text-2xl font-mono font-bold text-green-400">¥{costs.costA.toFixed(0)}</div></div>
             <div className="text-right"><div><div className="text-[10px] text-slate-400 mb-1">{matchState.playerBName} 支付</div><div className="text-2xl font-mono font-bold text-green-400">¥{costs.costB.toFixed(0)}</div></div></div>
        </div>
      </div>
      <button onClick={onReset} className="w-full text-slate-400 text-sm font-bold py-4 hover:text-red-500 flex items-center justify-center gap-2"><RotateCcw size={16}/> 重置</button>
    </div>
  );
};

// --- 主程序逻辑 ---

const INITIAL_STATE: MatchState = {
  playerAName: '屎提勋', playerBName: '火箭明', totalCost: 0, winsA: 0, winsB: 0, raceType: 7, games: [], isFinished: false, matchWinner: null,
};

export default function App() {
  const [view, setView] = useState<ViewName>('calculator');
  const [state, setState] = useState<MatchState>(INITIAL_STATE);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleUpdateName = (p: Player, name: string) => setState(prev => ({ ...prev, [p === 'A' ? 'playerAName' : 'playerBName']: name }));
  
  const handleUpdateRace = (type: RaceType) => {
    if (state.games.length > 0) { if (!confirm("修改赛制将重置当前比赛，确定吗？")) return; setState({ ...INITIAL_STATE, raceType: type }); } 
    else { setState(prev => ({ ...prev, raceType: type })); }
  };

  const handleAddGame = (rA: number, rB: number, hVal: number, hRec: Player) => {
    let fA = rA + (hRec === 'A' ? hVal : 0);
    let fB = rB + (hRec === 'B' ? hVal : 0);
    if (fA === fB) { alert("平局无法录入"); return; }
    const winner = fA > fB ? 'A' : 'B';
    const idx = state.games.length + 1;
    const isGold = (state.raceType === 5 && [1,3,5].includes(idx)) || (state.raceType === 7 && [1,4,7].includes(idx));
    const adv = Math.abs(fA - fB);
    
    // 生成简易战报
    const wName = winner==='A'?state.playerAName:state.playerBName;
    let note = `${wName} 获胜。`;
    if(adv > 40) note += " 单杆高分！";
    if(isGold) note += " 拿下黄金局！";

    const newGame: GameRecord = { 
        id: Date.now().toString(), index: idx, winner, rawScoreA: rA, rawScoreB: rB, finalScoreA: fA, finalScoreB: fB,
        handicapValue: hVal, handicapRecipient: hVal > 0 ? hRec : null, isGoldenGame: isGold, advantage: adv, note
    };

    const nWA = winner === 'A' ? state.winsA + 1 : state.winsA;
    const nWB = winner === 'B' ? state.winsB + 1 : state.winsB;
    let fin = false, mW = null;
    if (nWA >= state.raceType) { fin = true; mW = 'A'; }
    else if (nWB >= state.raceType) { fin = true; mW = 'B'; }

    setState(prev => ({ ...prev, games: [...prev.games, newGame], winsA: nWA, winsB: nWB, isFinished: fin, matchWinner: mW }));
  };

  const handleReset = () => { if (confirm("确定重置？")) setState({ ...INITIAL_STATE, raceType: state.raceType }); };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="md:hidden fixed top-0 w-full h-16 bg-slate-900 text-white z-20 flex items-center justify-between px-4">
        <span className="font-bold">台球争霸</span><button onClick={()=>setMenuOpen(!menuOpen)}><Menu/></button>
      </div>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300`}>
        <Sidebar currentView={view} onChangeView={(v) => { setView(v); setMenuOpen(false); }} />
      </div>
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 pb-20">
        {view === 'calculator' && <Dashboard matchState={state} onAddGame={handleAddGame} onUpdateCost={(c:number)=>setState(p=>({...p, totalCost:c}))} onUpdateName={handleUpdateName} onUpdateRace={handleUpdateRace} onReset={handleReset} />}
        {view === 'history' && <MatchHistory data={state} />}
        {view === 'rules' && <RuleBook />}
      </main>
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={()=>setMenuOpen(false)} />}
    </div>
  );
}
