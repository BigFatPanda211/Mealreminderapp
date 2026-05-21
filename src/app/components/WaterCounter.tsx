import { Plus, Minus, Droplet } from "lucide-react";

interface WaterCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onSetCount: (count: number) => void;
}

export function WaterCounter({
  count,
  onIncrement,
  onDecrement,
  onSetCount,
}: WaterCounterProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-white/60">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplet className="w-5 h-5 text-[#87ceeb]" fill="#87ceeb" />
          <h3 className="text-[#5a5a7a] font-medium">Water Intake</h3>
        </div>
        <p className="text-xs text-[#b5b5c9]">
          Stay hydrated throughout the day
        </p>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onDecrement}
          disabled={count === 0}
          className="w-12 h-12 rounded-full bg-[#ffe4e4] hover:bg-[#ffd4d4] active:scale-95 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <Minus className="w-5 h-5 text-[#ff9999]" strokeWidth={2.5} />
        </button>

        <div className="text-center min-w-24">
          <div className="text-5xl font-light text-[#5a5a7a] mb-1">{count}</div>
          <div className="text-xs text-[#b5b5c9]">of 12 glasses</div>
        </div>

        <button
          onClick={onIncrement}
          disabled={count === 12}
          className="w-12 h-12 rounded-full bg-[#d4f4ff] hover:bg-[#c4e9ff] active:scale-95 transition-all flex items-center justify-center shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 text-[#6bb6d6]" strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-6 gap-1.5 mt-6">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            onClick={() => onSetCount(i + 1)}
            className={`w-8 h-8 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer hover:scale-125 active:scale-95 ${
              i < count
                ? "bg-gradient-to-b from-[#87ceeb] to-[#5ba8d4] shadow-sm scale-110"
                : "bg-[#f0f0f5] hover:bg-[#e0f4ff]"
            }`}
          >
            <Droplet
              className={`w-5 h-5 transition-all ${
                i < count ? "text-white" : "text-[#d0d0db]"
              }`}
              fill={i < count ? "white" : "none"}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs text-[#b5b5c9]">
          {count === 0 && "Let's start hydrating! 💧"}
          {count > 0 && count < 6 && "Keep going! 💪"}
          {count >= 6 && count < 12 && "Halfway there! 🌊"}
          {count === 12 && "Fully hydrated! 🎉"}
        </p>
      </div>
    </div>
  );
}
