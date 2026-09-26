const zar = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' });
export const formatCurrency = (amount) => zar.format(amount);
