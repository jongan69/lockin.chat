import React from 'react';

const BotTradingInfo = ({ pnl, positions, translate }) => {
  if (!pnl || !positions) return null;

  // Calculate total positions by combining working orders and open positions
  const totalPositions = (positions.workingOrders?.length || 0) + (positions.openPositions?.length || 0);

  return (
    <div className="bg-slate-700 p-3 rounded-lg mt-2 mb-2">
      <h3 className="text-lg font-bold mb-2">{translate('botTrading')}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-800 p-2 rounded">
          <p className="font-semibold">{translate('botPNL')}</p>
          <p className={pnl.usd.amount >= 0 ? "text-green-400" : "text-red-400"}>
            ${pnl.usd.amount.toFixed(5)} {pnl.usd.currency} ({pnl.ox.amount.toFixed(5)} {pnl.ox.currency})
          </p>
        </div>
        <div className="bg-slate-800 p-2 rounded">
          <p className="font-semibold">{translate('botPositions')}</p>
          <div className="text-blue-400">
            <p>Total: {totalPositions}</p>
            <p className="text-xs">Working: {positions.workingOrders?.length || 0}</p>
            <p className="text-xs">Open: {positions.openPositions?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotTradingInfo; 