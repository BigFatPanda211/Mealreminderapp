import { useState } from 'react';
import { Check } from 'lucide-react';

interface MealCardProps {
  meal: string;
  emoji: string;
  color: string;
  time: string;
  isCompleted: boolean;
  mealDetail: string;
  recommendations: string[];
  onEaten: (description: string) => void;
}

export function MealCard({ meal, emoji, color, time, isCompleted, mealDetail, recommendations, onEaten }: MealCardProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onEaten(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all"
          style={{
            backgroundColor: color,
            opacity: isCompleted ? 0.5 : 1,
            transform: isCompleted ? 'scale(0.9)' : 'scale(1)'
          }}
        >
          {emoji}
        </div>

        <div className="flex-1 text-left">
          <h3 className="capitalize text-[#5a5a7a] mb-1">{meal}</h3>
          <p className="text-sm text-[#b5b5c9]">{time}</p>
        </div>

        {isCompleted && (
          <div className="w-6 h-6 rounded-full bg-[#a8d5ba] flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {recommendations.length > 0 && !isCompleted && (
        <div className="mb-3">
          <p className="text-xs text-[#9a9ab5] mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((rec, index) => (
              <button
                key={index}
                onClick={() => setInputValue(rec)}
                className="text-xs py-1.5 px-3 rounded-full bg-gradient-to-r from-[#ffd4a3]/15 to-[#d4b3ff]/15 hover:from-[#ffd4a3]/25 hover:to-[#d4b3ff]/25 text-[#6a6a8a] transition-all active:scale-95"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      )}

      {isCompleted ? (
        <div className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#ffd4a3]/10 to-[#d4b3ff]/10 text-[#5a5a7a] text-sm">
          {mealDetail || 'Meal logged'}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What did you eat?"
            className="w-full py-2 px-4 rounded-2xl bg-[#f8f8fb] text-[#5a5a7a] placeholder:text-[#b5b5c9] outline-none focus:ring-2 focus:ring-[#d4b3ff]/30 transition-all"
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ffd4a3]/20 to-[#d4b3ff]/20 hover:from-[#ffd4a3]/30 hover:to-[#d4b3ff]/30 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-[#5a5a7a]"
          >
            Eaten
          </button>
        </div>
      )}
    </div>
  );
}
