import React from 'react';
import { MatchState } from '../types';
import { Zap } from 'lucide-react';

interface MatchHistoryProps {
  data: MatchState;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            对局明细
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">抢{data.raceType}局</span>
        </h1>
        <p className="text-slate-500 mt-1 text-sm">显示含让分的最终比分</p >
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center w-16">局序</th>
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">类型</th>
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">比分 (含让分)</th>
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center">胜者</th>
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider">战报分析</th>
                <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-right">优势分</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.games.map((game) => (
                <tr key={game.id} className={`hover:bg-slate-50 transition-colors ${game.isGoldenGame ? 'bg-yellow-50/50' : ''}`}>
                  <td className="px-4 py-4 text-center font-mono text-slate-400">#{game.index}</td>
                  <td className="px-4 py-4 text-center">
                    {game.isGoldenGame ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                            <Zap size={12} fill="currentColor"/> 黄金局
                        </span>
                    ) : (
                        <span className="text-xs text-slate-400">常规</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-slate-800 text-lg whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                        <span>{game.rawScoreA}</span>
                        {game.handicapValue > 0 && game.handicapRecipient === 'A' && <span className="text-[10px] text-blue-500 font-normal">(+{game.handicapValue})</span>}
                        <span className="text-slate-300 mx-1">:</span>
                        {game.handicapValue > 0 && game.handicapRecipient === 'B' && <span className="text-[10px] text-blue-500 font-normal">(+{game.handicapValue})</span>}
                        <span>{game.rawScoreB}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        game.winner === 'A' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {game.winner === 'A' ? data.playerAName : data.playerBName}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500 italic max-w-xs truncate" title={game.note}>
                    {game.note || '-'}
                  </td>
                  <td className="px-4 py-4 text-right font-mono text-slate-600">
                    +{game.advantage} {game.isGoldenGame && <span className="text-yellow-600 font-bold">x2</span>}
                  </td>
                </tr>
              ))}
              {data.games.length === 0 && (
                <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">暂无对局记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
