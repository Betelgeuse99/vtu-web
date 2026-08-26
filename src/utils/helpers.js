export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return '₦0';
  return num % 1 === 0 ? `₦${num.toLocaleString()}` : `₦${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const truncate = (str, len = 40) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
};

export const sanitizeEmail = (email) => (email || '').trim().toLowerCase();

export const sanitizeOtp = (otp) => (otp || '').replace(/\D/g, '').slice(0, 6);
