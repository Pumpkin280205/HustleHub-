const zar = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' });
export const formatCurrency = (amount) => zar.format(amount);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatMonth = (year, month) =>
  new Date(year, month - 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
