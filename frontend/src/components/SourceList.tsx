'use clinet';
import React, { useState } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

type SourcesListProps = {
  sources: string[];
};

const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  const [showSources, setShowSources] = useState(true);
  return (
    <div className="mt-4 bg-gray-700 p-2 opacity-90 rounded-lg">
      <div className="flex justify-between">
        <h4 className="text-lg font-bold ml-3 my-2">References:</h4>
        <button
          className="btn btn-ghost btn-circle btn-sm flex justify-center items-center mt-1 mr-2"
          onClick={() => setShowSources(!showSources)}
        >
          {showSources ? (
            <CaretUp
              weight="bold"
              className="text-base-100 text-neutral-content h-5 w-5"
            />
          ) : (
            <CaretDown
              weight="bold"
              className="text-base-100  text-neutral-content h-5 w-5"
            />
          )}
        </button>
      </div>
      {showSources && (
        <ul className="list-disc list-inside h-[15rem] overflow-y-auto scroll-hidden flex flex-col items-center">
          {sources.map((source, index) => (
            <div key={index} className="text-sm flex items-start gap-1">
              <span className="badge text-xs flex items-center px-2">
                {index + 1}
              </span>
              <span className="ml-2">{source}</span>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SourcesList;
