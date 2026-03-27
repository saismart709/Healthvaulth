export function avatarColors(name: string): string {
  const colors = ['bg-blue-600', 'bg-teal-600', 'bg-amber-600', 'bg-purple-600', 'bg-red-600', 'bg-green-600'];
  const i = (name || '').charCodeAt(0) % colors.length;
  return colors[i];
}

export function formatDate(d: string): string {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatEmailOrPhone(input: string): string {
  const trimmed = (input || '').trim();
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) {
    return trimmed;
  }
  // If it's not an email, assume it's a phone number and format it for Firebase
  // Remove all non-digit characters to get the raw number
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 7) {
    // Use a more standard-looking domain for phone number simulation
    return `${digits}@phone.healthvault.com`;
  }
  return trimmed;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
