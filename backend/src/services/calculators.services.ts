export const calculatePositionSize = ({
  capital,
  riskPercent,
  entryPrice,
  stopLoss
}: {
  capital: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
}) => {
  const riskAmount = (capital * riskPercent) / 100;
  const riskPerShare = Math.abs(entryPrice - stopLoss);

  if (riskPerShare === 0) {
    throw new Error("Entry price and stop loss cannot be same");
  }

  const quantity = Math.floor(riskAmount / riskPerShare);
  const positionValue = quantity * entryPrice;

  return {
    riskAmount,
    riskPerShare,
    quantity,
    positionValue
  };
};
