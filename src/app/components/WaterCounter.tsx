import { Plus, Minus, Droplet } from 'lucide-react';

interface WaterCounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function WaterCounter({ count, onIncrement, onDecrement }: WaterCounterProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplet className="w-5 h-5 text-[#87ceeb]" fill="#87ceeb" />
          <h3 className="text-[#5a5a7a]">Water Intake</h3>
        </div>
        <p className="text-xs text-[#b5b5c9]">Stay hydrated throughout the day</p>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onDecrement}
          disabled={count === 0}
          className="w-12 h-12 rounded-full bg-[#ffe4e4] hover:bg-[#ffd4d4] active:scale-95 transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5 text-[#ff9999]" strokeWidth={2.5} />
        </button>

        <div className="text-center min-w-24">
          <div className="text-4xl text-[#5a5a7a] mb-1">{count}</div>
          <div className="text-xs text-[#b5b5c9]">glasses</div>
        </div>

        <button
          onClick={onIncrement}
          className="w-12 h-12 rounded-full bg-[#d4f4ff] hover:bg-[#c4e9ff] active:scale-95 transition-all flex items-center justify-center"
        >
          <Plus className="w-5 h-5 text-[#6bb6d6]" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex gap-1 justify-center mt-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-lg transition-all ${
              i < count
                ? 'bg-[#b4e4ff]'
                : 'bg-[#f0f0f5]'
            }`}
          >
            <Droplet
              className={`w-full h-full p-1.5 transition-all ${
                i < count
                  ? 'text-[#6bb6d6]'
                  : 'text-[#d0d0db]'
              }`}
              fill={i < count ? '#87ceeb' : 'none'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
