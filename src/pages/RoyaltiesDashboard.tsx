import { getUserRoyaltyReport } from "../services/data";

function RoyaltiesDashboard() {
  const report = getUserRoyaltyReport();
  const total = report.totalAmount;  // total amount in dollars

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Royalties Dashboard</h2>
      <p><strong>Total Listening Time:</strong> {report.totalMinutes} minutes</p>
      <p><strong>Total Contributed:</strong> ${report.totalAmount.toFixed(2)}</p>
      
      <div className="mt-6 space-y-4">
        {report.breakdown.map(([artistName, amount]) => {
          const percent = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={artistName}>
              <div className="flex justify-between text-sm mb-1">
                <span>{artistName}</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="bg-gray-300 h-4 w-full">
                <div 
                  className="bg-primary h-4" 
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-600 mt-4">
        * This is simulated data for demonstration purposes.
      </p>
    </div>
  );
}

export default RoyaltiesDashboard; 