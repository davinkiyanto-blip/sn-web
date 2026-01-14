'use client'

import { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle size={64} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-400 mb-6">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh
              halaman atau coba lagi nanti.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-colors text-white font-semibold"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
