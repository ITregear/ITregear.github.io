import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import posthog from 'posthog-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function trackExternalLinkClick(href: string, context?: Record<string, any>) {
  posthog.capture('external_link_click', { href, ...context });
}
