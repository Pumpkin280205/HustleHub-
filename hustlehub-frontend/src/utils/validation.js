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
