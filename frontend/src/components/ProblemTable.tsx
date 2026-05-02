import React from 'react';
import { Link } from 'react-router-dom';
import type { Problem } from '../types/problems';

type Difficulty = 'Easy' | 'Medium' | 'Hard';


type ProblemTableProps = {
  problems: Problem[];
};

const difficultyStyles: Record<string, string> = {
  easy: 'text-emerald-500',
  medium: 'text-yellow-500',
  hard: 'text-red-500',
};

const ProblemTable: React.FC<ProblemTableProps> = ({ problems }) => {
  if (!problems.length) {
    return (
      <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
        No problems found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {problems.map((p, i) => (
        <Link
          to={`/problems/${p.slug}`}
          key={p._id}
          className={`flex items-center px-5 py-3.5 gap-4 hover:bg-orange-50/50 transition-colors ${
            i !== problems.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          {/* Index */}
          <span className="text-gray-400 text-sm w-8 flex-shrink-0">
            {i + 1}.
          </span>

          {/* Title */}
          <span className="flex-1 text-sm text-gray-800 font-medium hover:text-orange-500 transition-colors">
            {p.title}
          </span>

          {/* Tags */}
          <div className="hidden md:flex gap-1 flex-wrap max-w-[200px]">
            {p.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Difficulty */}
          <span className={`text-xs font-semibold w-14 text-right ${difficultyStyles[p.difficulty]}`}>
  {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
</span>
        </Link>
      ))}
    </div>
  );
};

export default ProblemTable;