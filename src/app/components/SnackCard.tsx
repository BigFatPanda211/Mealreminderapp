import { useState } from "react";
import { Check, Plus } from "lucide-react";

interface SnackCardProps {
  index: number;
  isCompleted: boolean;
  snackDetail: string;
  onSnacked: (description: string) => void;
  onEdit: (description: string) => void;
  theme: any;
}

export function SnackCard({
  index,
  isCompleted,
  snackDetail,
  onSnacked,
  onEdit,
  theme,
}: SnackCardProps) {
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSnacked(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div
      className={`w-full ${theme.card} backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm border border-white/60 flex items-center gap-3`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${isCompleted ? `${theme.completedBg} text-white` : `bg-white border-2 border-[#ebebf5] ${theme.subtext}`}`}
      >
        {isCompleted ? <Check className="w-4 h-4" /> : `S${index}`}
      </div>

      <div className="flex-1">
        {isCompleted ? (
          editing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-[#f8f8fb] text-[#5a5a7a] text-sm outline-none border border-[#ebebf5]"
                autoFocus
              />
              <button
                onClick={() => {
                  onEdit(editValue);
                  setEditing(false);
                }}
                className={`px-3 py-1.5 rounded-xl ${theme.completedBg} text-white text-xs`}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 rounded-xl bg-[#f0f0f8] text-[#9a9ab5] text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p
              onClick={() => {
                setEditValue(snackDetail);
                setEditing(true);
              }}
              className={`text-sm ${theme.text} cursor-pointer`}
            >
              {snackDetail} ✏️
            </p>
          )
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={`Snack ${index}...`}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#f8f8fb] text-[#5a5a7a] placeholder:text-[#b5b5c9] text-sm outline-none border border-[#ebebf5]"
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={`shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ffb347] to-[#c084fc] text-white text-xs font-medium disabled:opacity-40`}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
