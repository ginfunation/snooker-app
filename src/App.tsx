import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Calculator } from './components/Dashboard'; 
import { RuleBook } from './components/ProductManagement'; 
import { MatchHistory } from './components/PnLAnalysis'; 
import { ViewName, MatchState, Player, GameRecord, RaceType } from './types';
import { Menu } from 'lucide-react';

const INITIAL_STATE: MatchState = {
  playerAName: '屎提勋',
  playerBName: '火箭明',
  totalCost: 0,
  winsA: 0,
  winsB: 0,
  raceType: 7, // 默认抢7
  games: [],
  isFinished: false,
  matchWinner: null,
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewName>('calculator');
  const [matchState, setMatchState] = useState<MatchState>(INITIAL_STATE);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleUpdateName = (player: Player, name: string) => {
    setMatchState(prev => ({
      ...prev,
      [player === 'A' ? 'playerAName' : 'playerBName']: name
    }));
  };

  const handleUpdateRace = (type: RaceType) => {
    if (matchState.games.length > 0) {
        if (!confirm("修改赛制将重置当前比赛，确定吗？")) return;
        setMatchState({
            ...INITIAL_STATE,
            playerAName: matchState.playerAName,
            playerBName: matchState.playerBName,
            totalCost: matchState.totalCost,
            raceType: type
        });
    } else {
        setMatchState(prev => ({ ...prev, raceType: type }));
    }
  };

  const handleAddGame = (rawScoreA: number, rawScoreB: number, handicapValue: number, handicapRecipient: Player) => {
    if (matchState.isFinished) return;
    let finalScoreA = rawScoreA;
    let finalScoreB = rawScoreB;
    if (handicapValue > 0) {
        if (handicapRecipient === 'A') finalScoreA += handicapValue;
        else finalScoreB += handicapValue;
    }
    if (finalScoreA === finalScoreB) {
        alert("算上让分后平局，请输入分出胜负的比分");
        return;
    }
    const winner: Player = finalScoreA > finalScoreB ? 'A' : 'B';
    const gameIndex = matchState.games.length + 1;
    
    // 黄金局判断
    let isGoldenGame = false;
    const rt = matchState.raceType;
    if (rt === 5 && [1, 3, 5].includes(gameIndex)) isGoldenGame = true;
    if (rt === 7 && [1, 4, 7].includes(gameIndex)) isGoldenGame = true;
    
    const advantage = Math.abs(finalScoreA - finalScoreB);
    const newWinsA = winner === 'A' ? matchState.winsA + 1 : matchState.winsA;
    const newWinsB = winner === 'B' ? matchState.winsB + 1 : matchState.winsB;

    // 生成战报
    const winnerName = winner === 'A' ? matchState.playerAName : matchState.playerBName;
    const analysisParts: string[] = [];
    if (handicapValue > 0) {
        const recipientName = handicapRecipient === 'A' ? matchState.playerAName : matchState.playerBName;
        analysisParts.push(`[让分] ${recipientName} +${handicapValue}。`);
    }
    if (isGoldenGame) analysisParts.push(`🌟 拿下黄金局！`);
    if (advantage > 40) analysisParts.push(`${winnerName} 单杆高分血洗！`);
    else if (advantage < 10) analysisParts.push(`防守局，${winnerName} 险胜。`);
    else analysisParts.push(`${winnerName} 稳健拿下。`);
    
    if ((newWinsA === rt - 1 || newWinsB === rt - 1) && !matchState.isFinished) {
         const leader = newWinsA === rt - 1 ? matchState.playerAName : matchState.playerBName;
         analysisParts.push(`⚠️ ${leader} 手握赛点！`);
    }

    const newGame: GameRecord = {
        id: Date.now().toString(), index: gameIndex, winner, rawScoreA, rawScoreB, finalScoreA, finalScoreB,
        handicapValue, handicapRecipient: handicapValue > 0 ? handicapRecipient : null,
        isGoldenGame, advantage, note: analysisParts.join(" ")
    };
    
    let isFinished = false;
    let matchWinner: Player | null = null;
    if (newWinsA >= rt) { isFinished = true; matchWinner = 'A'; } 
    else if (newWinsB >= rt) { isFinished = true; matchWinner = 'B'; }

    setMatchState(prev => ({
        ...prev, games: [...prev.games, newGame], winsA: newWinsA, winsB: newWinsB, isFinished, matchWinner
    }));
  };

  const handleReset = () => {
    if (confirm("确定要重置所有比赛数据吗？")) {
        setMatchState(prev => ({ ...INITIAL_STATE, playerAName: prev.playerAName, playerBName: prev.playerBName, totalCost: prev.totalCost, raceType: prev.raceType }));
    }
  };

  const renderContent = () => {
    const commonProps = { matchState, onUpdateCost: (c: number) => setMatchState(prev => ({...prev, totalCost: c})), onReset: handleReset };
    switch (currentView) {
      case 'calculator': return <Calculator {...commonProps} onAddGame={handleAddGame} onUpdateName={handleUpdateName} onUpdateRace={handleUpdateRace} />;
      case 'history': return <MatchHistory data={matchState} />;
      case 'rules': return <RuleBook />;
      default: return <Calculator {...commonProps} onAddGame={handleAddGame} onUpdateName={handleUpdateName} onUpdateRace={handleUpdateRace} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-slate-900 text-white shadow-sm p-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-2"><span className="text-green-500 font-black text-xl">SNOOKER</span><h1 className="font-bold text-lg">台球争霸</h1></div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md hover:bg-slate-800"><Menu size={24} /></button>
      </div>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentView={currentView} onChangeView={(view) => { setCurrentView(view); setIsMobileMenuOpen(false); }} />
      </div>
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 scroll-smooth pb-24 md:pb-8">{renderContent()}</main>
      </div>
    </div>
  );
}
