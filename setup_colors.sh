#!/bin/bash
# Find and replace tailwind colors with CSS variables from the style guide

# Backgrounds
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-blue-600/bg-[var(--tj-primary-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-blue-700/bg-[var(--tj-primary-hover)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-blue-50/bg-[var(--tj-primary-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-blue-100/bg-[var(--tj-primary-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-indigo-600/bg-[var(--tj-primary-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-indigo-700/bg-[var(--tj-primary-hover)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-indigo-50/bg-[var(--tj-primary-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-indigo-100/bg-[var(--tj-primary-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-green-600/bg-[var(--tj-success-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-green-50/bg-[var(--tj-success-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-green-100/bg-[var(--tj-success-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-red-600/bg-[var(--tj-error-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-red-50/bg-[var(--tj-error-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-red-100/bg-[var(--tj-error-light)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-gray-50/bg-[var(--tj-bg-alt)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-gray-100/bg-[var(--tj-bg-alt)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/bg-white/bg-[var(--tj-bg-card)]/g' {} +

# Text
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-blue-600/text-[var(--tj-primary-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-blue-800/text-[var(--tj-primary-hover)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-blue-900/text-[var(--tj-primary-hover)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-indigo-600/text-[var(--tj-primary-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-indigo-800/text-[var(--tj-primary-hover)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-indigo-900/text-[var(--tj-primary-hover)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-green-600/text-[var(--tj-success-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-red-500/text-[var(--tj-error-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-red-600/text-[var(--tj-error-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-gray-900/text-[var(--tj-text-main)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-gray-800/text-[var(--tj-text-main)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-gray-700/text-[var(--tj-text-main)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-gray-600/text-[var(--tj-text-muted)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-gray-500/text-[var(--tj-text-muted)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/text-gray-400/text-[var(--tj-text-muted)]/g' {} +

# Borders
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/border-blue-200/border-[var(--tj-primary-border)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/border-blue-300/border-[var(--tj-primary-border)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/border-indigo-100/border-[var(--tj-primary-border)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/border-indigo-200/border-[var(--tj-primary-border)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/border-gray-100/border-[var(--tj-border-main)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/border-gray-200/border-[var(--tj-border-main)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/border-gray-300/border-[var(--tj-border-main)]/g' {} +

# Rings
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/ring-blue-500/ring-[var(--tj-primary-color)]/g' {} +
find components App.tsx -type f -name "*.tsx" -exec sed -i 's/ring-indigo-500/ring-[var(--tj-primary-color)]/g' {} +

