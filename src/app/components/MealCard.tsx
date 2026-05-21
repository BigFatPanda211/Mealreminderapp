import { useState } from "react";
import { Check } from "lucide-react";

interface MealCardProps {
  meal: string;
  emoji: string;
  color: string;
  time: string;
  isCompleted: boolean;
  mealDetail: string;
  recommendations: string[];
  onEaten: (description: string) => void;
  onEdit: (description: string) => void;
}

export function MealCard({
  meal,
  emoji,
  color,
  time,
  isCompleted,
  mealDetail,
  recommendations,
  onEaten,
  onEdit,
}: MealCardProps) {
  const [inputValue, setInputValue] = useState("");

  const [editingMeal, setEditingMeal] = useState(false);
  const [editValue, setEditValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onEaten(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-start justify-start border border-white/60">
      <div className="flex items-center gap-4 mb-4 w-full">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all"
          style={{
            backgroundColor: color,
            opacity: isCompleted ? 0.5 : 1,
            transform: isCompleted ? "scale(0.9)" : "scale(1)",
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
        <div className="w-full space-y-2">
          {editingMeal ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full py-3 px-4 rounded-2xl bg-[#f8f8fb] text-[#5a5a7a] placeholder:text-[#b5b5c9] outline-none focus:ring-2 focus:ring-[#d4b3ff]/40 border border-[#ebebf5] focus:border-[#d4b3ff]/50 transition-all shadow-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onEdit(editValue);
                    setEditingMeal(false);
                  }}
                  className="flex-1 py-2 rounded-2xl bg-[#a8d5ba] text-white text-sm transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingMeal(false)}
                  className="flex-1 py-2 rounded-2xl bg-[#f0f0f8] text-[#9a9ab5] text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                setEditValue(mealDetail);
                setEditingMeal(true);
              }}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[#ffd4a3]/10 to-[#d4b3ff]/10 text-[#5a5a7a] text-sm cursor-pointer hover:from-[#ffd4a3]/20 hover:to-[#d4b3ff]/20 transition-all"
            >
              {mealDetail || "Meal logged"} ✏️
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What did you eat?"
            className="w-full py-3 px-4 rounded-2xl bg-[#f8f8fb] text-[#5a5a7a] placeholder:text-[#b5b5c9] outline-none focus:ring-2 focus:ring-[#d4b3ff]/40 border border-[#ebebf5] focus:border-[#d4b3ff]/50 transition-all shadow-sm"
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ffb347] to-[#c084fc] hover:from-[#ffa030] hover:to-[#a855f7] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold shadow-md"
          >
            Eaten
          </button>
        </div>
      )}
    </div>
  );
}
