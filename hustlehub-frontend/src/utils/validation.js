export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RULE.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateRegister({ email, password, confirmPassword, role }) {
  const errors = validateLogin({ email, password });
  if (password && password.length < 8) errors.password = 'Password must be at least 8 characters';
  else if (password && password.length > 72) errors.password = 'Password must be 72 characters or fewer';
  else if (password && !PASSWORD_RULE.test(password)) {
    errors.password = 'Password must include uppercase, lowercase, a number and a special character';
  }
  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
  if (!['client', 'freelancer'].includes(role)) errors.role = 'Choose an account type';
  return errors;
}

// Keep in sync with GIG_CATEGORIES in the backend validation middleware
export const GIG_CATEGORIES = ['Design', 'Writing', 'Development', 'Marketing', 'Video & Animation', 'Music & Audio', 'Business', 'Other'];

export function validateGig({ title, description, category, price }) {
  const errors = {};

  const t = title.trim();
  if (t.length < 3) errors.title = 'Title must be at least 3 characters';
  else if (t.length > 100) errors.title = 'Title must be 100 characters or fewer';

  const d = description.trim();
  if (d.length < 10) errors.description = 'Description must be at least 10 characters';
  else if (d.length > 2000) errors.description = 'Description must be 2000 characters or fewer';

  if (!GIG_CATEGORIES.includes(category)) errors.category = 'Choose a category';

  const amount = Number(price);
  if (price === '' || Number.isNaN(amount)) errors.price = 'Enter a price';
  else if (amount < 1) errors.price = 'Price must be at least R1';
  else if (amount > 1000000) errors.price = 'Price must be R1,000,000 or less';
  else if (!/^\d+(\.\d{1,2})?$/.test(String(price))) errors.price = 'Use at most 2 decimal places';

  return errors;
}

