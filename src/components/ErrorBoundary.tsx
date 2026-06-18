'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: string }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg text-center card-shadow">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-4 font-mono bg-gray-50 p-3 rounded-lg">{this.state.error}</p>
            <button onClick={() => window.location.reload()} className="gradient-bg text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
