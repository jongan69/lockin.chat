import React from 'react';

const BotTradingInfo = ({ pnl, positions, translate }) => {
  if (!pnl || !positions) return null;

  return (
    <div className="bg-slate-700 p-3 rounded-lg mt-2 mb-2">
      <h3 className="text-lg font-bold mb-2">{translate('botTrading')}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-800 p-2 rounded">
          <p className="font-semibold">{translate('botPNL')}</p>
          <p className="text-green-400">${pnl.amount.toFixed(5)} {pnl.currency}</p>
        </div>
        <div className="bg-slate-800 p-2 rounded">
          <p className="font-semibold">{translate('botPositions')}</p>
          <p className="text-blue-400">{positions.length}</p>
        </div>
      </div>
    </div>
  );
};

export default BotTradingInfo; 