import { getUserRoyaltyReport } from "../services/data";
import { FaIcons } from "../utils/icons";

function RoyaltiesDashboard() {
  const report = getUserRoyaltyReport();
  
  // Calculate percentages for the chart
  const total = report.breakdown.reduce((acc, [_, amount]) => acc + amount, 0);
  const percentages = report.breakdown.map(([artist, amount]) => ({
    artist,
    amount,
    percentage: (amount / total) * 100
  }));
  
  // Sort by amount in descending order (highest earning first)
  percentages.sort((a, b) => b.amount - a.amount);

  return (
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-accent mb-6">Your Royalty Breakdown</h1>
      
      <div className="bg-dark-lighter rounded-spotify overflow-hidden p-4 sm:p-6">
        <div className="mb-6">
          <p className="text-accent mb-1">Total spent this month</p>
          <p className="text-4xl font-bold text-primary">${report.totalAmount.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <p className="text-accent mb-4">Your money goes to:</p>
          
          {/* Visualization of artist breakdown */}
          <div className="h-8 bg-dark-light rounded-full overflow-hidden mb-4 flex">
            {percentages.map((item, index) => (
              <div 
                key={index}
                className={`h-full ${getColorClass(index)}`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.artist}: $${item.amount.toFixed(2)} (${item.percentage.toFixed(1)}%)`}
              />
            ))}
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {percentages.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-4 h-4 rounded-sm ${getColorClass(index)} mr-2`} />
                <div>
                  <p className="text-accent">{item.artist}</p>
                  <p className="text-sm text-gray-300">${item.amount.toFixed(2)} ({item.percentage.toFixed(1)}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-accent mb-4">Listening time</p>
          <div className="flex items-center text-gray-300">
            <FaIcons.FaHeadphones className="mr-2" />
            <p>{report.totalMinutes} minutes this month</p>
          </div>
        </div>
      </div>
      
      <div className="bg-dark-lighter rounded-spotify p-4 sm:p-6">
        <h2 className="text-xl font-bold text-accent mb-4">About Royalties at Campfire</h2>
        <p className="text-gray-300 mb-4">
          At Campfire, we believe in fair compensation for artists. When you subscribe, your monthly fee is distributed directly to the artists you listen to, based on your listening time.
        </p>
        <p className="text-gray-300">
          We take a small platform fee (10%) to keep our servers running, but the rest goes directly to the creators. This means the more you listen to an artist, the more they earn from your subscription.
        </p>
      </div>
    </div>
  );
}

// Helper function to get a color class based on index
function getColorClass(index: number): string {
  // Using custom tailwind classes for the specific colors requested
  const colors = [
    'bg-primary',
    'bg-[#af3f16]', // Dark orange/rust
    'bg-[#ed7d24]', // Bright orange
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500'
  ];
  return colors[index % colors.length];
}

export default RoyaltiesDashboard; 