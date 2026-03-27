import React from 'react';

interface TagProps {
  status: string;
}

export const StatusTag: React.FC<TagProps> = ({ status }) => {
  const map: Record<string, string> = {
    'Active': 'bg-green-bg text-green-custom',
    'Inactive': 'bg-gray-100 text-gray-500',
    'Critical': 'bg-red-bg text-red-custom',
    'Upcoming': 'bg-primary-bg text-primary',
    'Completed': 'bg-green-bg text-green-custom',
    'Pending': 'bg-amber-bg text-amber-custom',
    'Paid': 'bg-green-bg text-green-custom',
    'Insurance': 'bg-purple-bg text-purple-custom',
    'New': 'bg-teal-bg text-teal-custom',
    'Cancelled': 'bg-red-bg text-red-custom'
  };

  return (
    <span className={`tag inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
};
