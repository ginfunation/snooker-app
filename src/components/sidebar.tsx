import React from 'react';
import { Calculator, BookOpen, Trophy, History, Zap } from 'lucide-react';
import { ViewName } from '../types';

interface SidebarProps {
  currentView: ViewName;
  onChangeView: (view: ViewName) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'calculator', label: '比赛计分 & 结算', icon: <Calculator size={20} /> },
    { id: 'history', label: '对局明细表', icon: <History size={20} /> },
    { id: 'rules', label: '赛制规则', icon: <BookOpen size={20} /> },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white shadow-2xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg shadow-lg shadow-green-500/20">
          <Trophy size={24} className="text-slate-900" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight italic">台球争霸 <span className="text-green-500">PLUS</span></h2>
          <span className="text-xs text-slate-400">Designed by GINFUNATION</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 font-medium ${
              currentView === item.id
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-yellow-500 mb-2">
            <Zap size={12} /> 黄金局机制
        </div>
        <div className="text-xs text-slate-500 space-y-1">
            <p>抢5: 第1,3,5局</p >
            <p>抢7: 第1,4,7局</p >
            <p>黄金局优势分双倍权重</p >
        </div>
      </div>
    </div>
  );
};
