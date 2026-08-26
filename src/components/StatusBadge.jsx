import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    successful: { bg: '#DCFCE7', text: '#166534', label: 'Successful' },
    success: { bg: '#DCFCE7', text: '#166534', label: 'Successful' },
    processing: { bg: '#FEF3C7', text: '#92400E', label: 'Processing' },
    pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
    failed: { bg: '#FEE2E2', text: '#991B1B', label: 'Failed' },
  };
  const s = styles[status] || styles.pending;
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-2xl" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}
