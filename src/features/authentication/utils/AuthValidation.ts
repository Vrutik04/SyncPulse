//  EMAIL VALIDATION
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

//  PASSWORD VALIDATION
export const validatePassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

//  CONFIRM PASSWORD
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

//  ERROR MESSAGES
export const getEmailError = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  if (!validateEmail(email)) return "Enter a valid email";
  return null;
};

export const getPasswordError = (password: string): string | null => {
  if (!password.trim()) return "Password is required";
  if (password.length < 6) return "Minimum 6 characters required";
  return null;
};

export const getConfirmPasswordError = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword.trim()) return "Confirm password is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};