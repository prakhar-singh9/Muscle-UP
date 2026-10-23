import React from 'react';

interface UpiQrCodeProps {
  amount: number;
  vpa?: string;
  merchantName?: string;
  size?: number;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  amount,
  vpa = 'muscleup.fitness@icici',
  size = 190
}) => {
  // Generate a clean stylized QR code representation using SVG matrix
  // A realistic 25x25 matrix pattern with corner position locators
  const seed = (Math.round(amount) * 7 + vpa.length * 13) % 1000;
  
  // Create deterministic grid based on amount & VPA
  const gridSize = 25;
  const isDark = (r: number, c: number): boolean => {
    // 3 Position Detection Patterns (Top-Left, Top-Right, Bottom-Left)
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    if (r < 7 && c >= gridSize - 7) {
      const oc = c - (gridSize - 7);
      if (r === 0 || r === 6 || oc === 0 || oc === 6) return true;
      if (r >= 2 && r <= 4 && oc >= 2 && oc <= 4) return true;
      return false;
    }
    if (r >= gridSize - 7 && c < 7) {
      const or = r - (gridSize - 7);
      if (or === 0 || or === 6 || c === 0 || c === 6) return true;
      if (or >= 2 && or <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Timing patterns
    if (r === 6 && c % 2 === 0) return true;
    if (c === 6 && r % 2 === 0) return true;

    // Center logo cutout
    if (r >= 10 && r <= 14 && c >= 10 && c <= 14) return false;

    // Pseudo-random data modules
    const val = (r * 31 + c * 17 + seed * 3) % 100;
    return val > 44;
  };

  return (
    <div className="relative inline-flex items-center justify-center p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        className="shape-rendering-crispEdges"
      >
        <rect width={gridSize} height={gridSize} fill="#ffffff" />
        {Array.from({ length: gridSize }).map((_, r) =>
          Array.from({ length: gridSize }).map((_, c) => {
            if (isDark(r, c)) {
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c}
                  y={r}
                  width={1}
                  height={1}
                  fill="#0b1c30"
                />
              );
            }
            return null;
          })
        )}
      </svg>
      {/* Center UPI Logo badge */}
      <div className="absolute w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center pointer-events-none">
        <div className="w-7 h-7 rounded-full bg-[#65a30d] flex items-center justify-center text-white font-black text-xs">
          ₹
        </div>
      </div>
    </div>
  );
};
