import React from 'react';
import { ShieldCheck, Scale, Star } from 'lucide-react';

export const RuleBook: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900">台球争霸让分版 规则书</h1>
        <p className="text-slate-500 mt-2">支持抢3/5/7局 · 智能让分 · 黄金局机制</p >
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-16 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
             <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Star fill="white"/> 赛制与黄金局</h3>
             <ul className="text-green-50 text-sm space-y-2 mt-3">
                <li className="flex justify-between"><span>抢3局:</span> <span className="font-bold">无黄金局</span></li>
                <li className="flex justify-between"><span>抢5局:</span> <span className="font-bold text-yellow-300">第 1, 3, 5 局</span></li>
                <li className="flex justify-between"><span>抢7局:</span> <span className="font-bold text-yellow-300">第 1, 4, 7 局</span></li>
             </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 text-xl mb-3 flex items-center gap-2">
                <Scale className="text-blue-500"/> 让分系统
             </h3>
             <div className="text-sm text-slate-600 space-y-2">
                <p>每局开始前协商让分（10-50分）。</p >
                <p><b>执行逻辑：</b>被让分方初始分直接增加，若加上让分后分数高于对手，则视为获胜并获得1个胜局积分。</p >
             </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-slate-500"/> 费用分摊算法 (New)
        </h2>
        
        <div className="space-y-6">
            <div className="pb-6 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-lg mb-3">6.1 积分 + 优势双权重</h4>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    每位玩家的支付金额不再仅仅看输赢，而是结合了<span className="font-bold text-slate-800">胜局数</span>和<span className="font-bold text-slate-800">单局净胜分（统治力）</span>。
                </p >
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="font-bold text-slate-800 mb-1">权重 1：败局惩罚</div>
                        <div className="text-xs text-slate-500">输掉的局数越多，基础支付权重越高。</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                        <div className="font-bold text-slate-800 mb-1">权重 2：优势抵扣</div>
                        <div className="text-xs text-slate-500">获胜局的分差越大（赢多少分），获得的费用抵扣越多。黄金局分差双倍抵扣。</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
