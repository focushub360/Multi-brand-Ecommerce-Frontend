/**
 * Formats a numeric price into Indian Rupee currency format (e.g. ₹3,50,000)
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatPrice(amount) {
  if (typeof amount === 'number') {
    return '₹' + amount.toLocaleString('en-IN');
  }
  if (typeof amount === 'string') {
    if (amount.startsWith('₹')) return amount;
    const num = Number(amount.replace(/[^0-9.-]+/g, ''));
    if (!isNaN(num)) return '₹' + num.toLocaleString('en-IN');
  }
  return String(amount || '');
}

