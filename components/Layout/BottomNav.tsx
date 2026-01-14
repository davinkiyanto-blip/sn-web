'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Music, Plus, Settings, FlaskConical } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/create', icon: Plus, label: 'Create' },
  { href: '/library', icon: Music, label: 'Library' },
  { href: '/tools', icon: FlaskConical, label: 'Tools' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/20 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                size={24}
                className={`relative z-10 ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs relative z-10 ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
