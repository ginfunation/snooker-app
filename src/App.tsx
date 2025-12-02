import React, { useState } from 'react';
import { Calculator, BookOpen, Trophy, History, Zap, PlusCircle, RotateCcw, DollarSign, Target, Scale, Newspaper, Menu } from 'lucide-react';
import { MatchState, Player, GameRecord, RaceType, ViewName } from './types';

// --- 组件部分开始 ---

// 1. Sidebar 组件
const Sidebar = ({ currentView, onChangeView }: { currentView: ViewName; onChangeView: (v: ViewName) => void }) => {
  const menuItems = [
    { id: 'calculator', label: '比赛计分', icon: <Calculator size={20} /> },
    { id: 'history', label: '对局明细', icon: <History size={20} /> },
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

// 2. RuleBook 组件
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

// 3. MatchHistory 组件
const MatchHistory = ({ data }: { data: MatchState }) => (
  <div className="space-y-4 max-w-4xl mx-auto">
    <h2 className="text-xl font-bold px-2">对局记录</h2>
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[600px]">
        <thead className="bg-slate-50 text-slate-500 font-bold border-b">
          <tr>
