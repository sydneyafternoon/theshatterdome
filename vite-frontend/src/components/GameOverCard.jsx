import React from "react";

function GameOverCard({ winner }) {
  return (
    <div className="w-full max-w-xl mx-auto mb-4">
      <div className="relative p-8 border-2 border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Decorative border */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 opacity-20"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Trophy/Crown icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl font-bold">👑</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-wide">
            GAME OVER
          </h2>

          <div className="mb-6">
            <div className="text-lg text-gray-600 mb-2">Victory goes to:</div>
            <div className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-yellow-100 to-yellow-200 px-6 py-3 rounded-lg border border-yellow-300">
              {winner}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center space-x-2 text-yellow-500 text-xl">
            <span>⭐</span>
            <span>🎉</span>
            <span>⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameOverCard;
