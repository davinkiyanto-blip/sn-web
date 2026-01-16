'use client'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always use dark mode - no theme switching
  return (
    <div className="bg-black text-white">
      {children}
    </div>
  )
}
