import React from 'react';

const Card = ({ children, className = '', title }) => {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-50 shadow-sm ${className}`}>
      {title && (
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
        </div>
      )}
      <div className="p-6 pt-2">
        {children}
      </div>
    </div>
  );
};

export default Card;
