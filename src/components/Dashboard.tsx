import React, { useState } from 'react';
import { MatchState, Player, RaceType } from '../types';
import { Trophy, PlusCircle, RotateCcw, DollarSign, Target, Zap, Newspaper, Scale } from 'lucide-react';

interface CalculatorProps {
  matchState: MatchState;
  onAddGame: (scoreA: number, scoreB: number, handicapVal: number, handicapTo: Player) => void;
  onUpdateCost: (cost: number) => void;
  onUpdateName: (player: Player, name: string) => void;
  onUpdateRace: (type: RaceType) => void;
  onReset: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ matchState, onAddGame, onUpdateCost, onUpdateName, onUpdateRace, onReset }) => {
  const [scoreA, setScoreA] = useState<string>('');
  const [scoreB, setScoreB] = useState<string>('');
  const [handicapValue, setHandicapValue] = useState<number>(0);
  const [handicapRecipient, setHandicapRecipient] = useState<Player>('B');

  const calculateFinalSplit = () => {
    const gamesLostA = matchState.games.filter(g => g.winner === 'B').length;
    const gamesLostB = matchState.games.filter(g => g.winner === 'A').length;
    
    const creditA = matchState.games
        .filter(g => g.winner === 'A')
        .reduce((sum, g) => sum + (g.advantage * (g.isGoldenGame ? 2 : 1)), 0);

    const creditB = matchState.games
        .filter(g => g.winner === 'B')
        .reduce((sum, g) => sum + (g.advantage * (g.isGoldenGame ? 2 : 1)), 0);

    const weightA = Math.max(0, (gamesLostA * 100) - (creditA * 0.5));
    const weightB = Math.max(0, (gamesLostB * 100) - (creditB * 0.5));
    const totalWeight = weightA + weightB;
    
    let costA = 0;
    let costB = 0;

    if (totalWeight > 0) {
        costA = (matchState.totalCost * weightA) / totalWeight;
        costB = (matchState.totalCost * weightB) / totalWeight;
    } else {
        costA = matchState.totalCost / 2;
        costB = matchState.totalCost / 2;
    }
    return { costA, costB, creditA, creditB };
  };

  const results = calculateFinalSplit();
  const lastGame = matchState.games[matchState.games.length - 1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreA || !scoreB) return;
    onAddGame(parseFloat(scoreA), parseFloat(scoreB), handicapValue, handicapRecipient);
    setScoreA('');
    setScoreB('');
    setHandicapValue(0);
  };

  const nextGameIndex = matchState.games.length + 1;
  let isNextGolden = false;
  if (matchState.raceType === 5 && [1, 3, 5].includes(nextGameIndex)) isNextGolden = true;
  if (matchState.raceType === 7 && [1, 4, 7].includes(nextGameIndex)) isNextGolden = true;

  return (
    <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 text-white rounded-2xl p-4 md:p-6 shadow-xl">
          <div className="flex justify-center mb-6">
             <div className="bg-slate-800 p-1 rounded-lg flex gap-1">
                {[3, 5, 7].map(r => (
                    <button 
                        key={r}
                        onClick={() => onUpdateRace(r as RaceType)}
                        disabled={matchState.games.length > 0} 
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                            matchState.raceType === r 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white'
                        } ${matchState.games.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        抢{r}
                    </button>
                ))}
             </div>
          </div>

          <div className="flex justify-between items-center px-2 md:px-12">
            <div className={`text-center flex-1 transition-all ${matchState.matchWinner === 'A' ? 'scale-110' : ''}`}>
                <input 
                    type="text" 
                    className="w-full bg-transparent text-center text-slate-400 font-bold text-sm md:text-base mb-2 focus:text-white outline-none border-b border-transparent focus:border-green-500 transition-all"
                    value={matchState.playerAName}
                    onChange={(e) => onUpdateName('A', e.target.value)}
                />
                <div className={`text-6xl md:text-8xl font-black font-mono tracking-tighter ${matchState.matchWinner === 'A' ? 'text-green-400' : 'text-white'}`}>
                    {matchState.winsA}
                </div>
            </div>

            <div className="flex flex-col items-center px-4">
                <div className="text-sm font-mono text-slate-500 mb-2">VS</div>
                {matchState.isFinished ? (
                    <Trophy className="text-yellow-500 animate-bounce" size={40} />
                ) : (
                    <div className="text-xs text-slate-500 font-bold border border-slate-700 px-3 py-1 rounded-full">
                        Next: 第{nextGameIndex}局
                    </div>
                )}
            </div>

            <div className={`text-center flex-1 transition-all ${matchState.matchWinner === 'B' ? 'scale-110' : ''}`}>
                <input 
                    type="text" 
                    className="w-full bg-transparent text-center text-slate-400 font-bold text-sm md:text-base mb-2 focus:text-white outline-none border-b border-transparent focus:border-green-500 transition-all"
                    value={matchState.playerBName}
                    onChange={(e) => onUpdateName('B', e.target.value)}
                />
                <div className={`text-6xl md:text-8xl font-black font-mono tracking-tighter ${matchState.matchWinner === 'B' ? 'text-green-400' : 'text-white'}`}>
                    {matchState.winsB}
                </div>
            </div>
          </div>
      </div>

      {isNextGolden && !matchState.isFinished && (
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm md:text-base font-bold animate-pulse">
            <Zap className="fill-white text-white" size={18} />
            <span>第 {nextGameIndex} 局为黄金局：费用权重翻倍！</span>
        </div>
      )}

      {lastGame && !matchState.isFinished && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="bg-indigo-100 p-2 rounded-full">
                <Newspaper className="text-indigo-600" size={20} />
            </div>
            <div>
                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">战报 (第{lastGame.index}局)</h4>
                <p className="text-indigo-900 font-medium text-sm md:text-base leading-relaxed">
                    {lastGame.note || "暂无分析"}
                </p>
            </div>
        </div>
      )}

      {!matchState.isFinished ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PlusCircle className="text-slate-400" size={20} /> 录入本局数据
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                        <Scale size={14} /> 让分设置 (协商)
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-1">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shrink-0">
                            <button type="button" onClick={() => setHandicapRecipient('A')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${handicapRecipient === 'A' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>
                                {matchState.playerAName} 受让
                            </button>
                            <button type="button" onClick={() => setHandicapRecipient('B')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${handicapRecipient === 'B' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>
                                {matchState.playerBName} 受让
                            </button>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            {[0, 10, 20, 30, 40, 50].map(val => (
                                <button 
                                    key={val}
                                    type="button"
                                    onClick={() => setHandicapValue(val)}
                                    className={`w-10 h-8 rounded-lg text-xs font-bold border transition-colors ${
                                        handicapValue === val 
                                        ? 'bg-blue-100 border-blue-300 text-blue-700' 
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {val === 0 ? '-' : `+${val}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <div className="flex justify-center items-center gap-1 mb-1">
                            <label className="text-xs font-bold text-slate-400 px-2">{matchState.playerAName}</label>
                            {handicapValue > 0 && handicapRecipient === 'A' && (
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 rounded-full">+{handicapValue}</span>
                            )}
                        </div>
                        <input 
                            type="number" 
                            inputMode="decimal" 
                            required 
                            value={scoreA} 
                            onChange={e => setScoreA(e.target.value)} 
                            className="w-full text-center font-mono text-slate-900 font-bold text-3xl py-4 rounded-xl bg-slate-100 border-2 border-transparent focus:bg-white focus:border-green-500 outline-none transition-all placeholder:text-slate-300" 
                            placeholder="0" 
                        />
                    </div>
                    <div className="text-slate-300 font-black text-xl pt-5">:</div>
                    <div className="flex-1">
                        <div className="flex justify-center items-center gap-1 mb-1">
                            <label className="text-xs font-bold text-slate-400 px-2">{matchState.playerBName}</label>
                            {handicapValue > 0 && handicapRecipient === 'B' && (
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1.5 rounded-full">+{handicapValue}</span>
                            )}
                        </div>
                        <input 
                            type="number" 
                            inputMode="decimal" 
                            required 
                            value={scoreB} 
                            onChange={e => setScoreB(e.target.value)} 
                            className="w-full text-center font-mono text-slate-900 font-bold text-3xl py-4 rounded-xl bg-slate-100 border-2 border-transparent focus:bg-white focus:border-green-500 outline-none transition-all placeholder:text-slate-300" 
                            placeholder="0" 
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20">
                    确认录入 {handicapValue > 0 && <span className="text-sm opacity-80 font-normal ml-1">(含让分)</span>}
                </button>
            </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-2 animate-in fade-in zoom-in duration-500">
            <Trophy size={48} className="text-green-600 mb-2" />
            <h3 className="text-xl font-black text-green-900">恭喜 {matchState.matchWinner === 'A' ? matchState.playerAName : matchState.playerBName} 获胜！</h3>
            <p className="text-green-700">比赛结束，请查看下方费用结算</p>
            <button onClick={onReset} className="mt-4 px-6 py-2 bg-white border border-green-300 text-green-700 rounded-full font-bold shadow-sm hover:bg-green-100">
                开启下一场
            </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-2">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2"><DollarSign size={18}/> 总费用</h3>
             </div>
             <div className="relative">
                 <input 
                    type="number" 
                    inputMode="decimal"
                    value={matchState.totalCost || ''} 
                    onChange={(e) => onUpdateCost(parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-2xl font-bold text-slate-800 outline-none border-2 border-transparent focus:border-green-500 transition-all placeholder:text-slate-300"
                    placeholder="请输入金额..."
                 />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">CNY</span>
             </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-green-500 rounded-full blur-3xl opacity-10 -mr-16 -mt-16 pointer-events-none"></div>
            
            <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2">
                <Target size={18} /> 应付金额 (含优势折扣)
            </h3>
            
            <div className="flex items-end justify-between relative z-10">
                <div className="flex-1 mr-4">
                    <div className="text-xs text-slate-400 uppercase font-bold mb-1 truncate">{matchState.playerAName} 支付</div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-green-400">¥{results.costA.toFixed(0)}<span className="text-lg text-green-400/50">.{results.costA.toFixed(2).split('.')[1]}</span></div>
                </div>
                <div className="text-right flex-1 ml-4">
                    <div className="text-xs text-slate-400 uppercase font-bold mb-1 truncate">{matchState.playerBName} 支付</div>
                    <div className="text-3xl md:text-4xl font-mono font-bold text-green-400">¥{results.costB.toFixed(0)}<span className="text-lg text-green-400/50">.{results.costB.toFixed(2).split('.')[1]}</span></div>
                </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>胜局优势分: {results.creditA.toFixed(0)}</span>
                <span>胜局优势分: {results.creditB.toFixed(0)}</span>
            </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 pb-8">
        <button 
            onClick={onReset}
            className="group flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
        >
            <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" /> 
            重置比赛 / 新开局
        </button>
      </div>
    </div>
  );
};
