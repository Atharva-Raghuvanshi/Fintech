import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export let isPrivacyMode = false;

export const togglePrivacyMode = () => {
  isPrivacyMode = !isPrivacyMode;
  window.dispatchEvent(new Event('privacy-toggle'));
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  if (isPrivacyMode) return '₹••••••';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
