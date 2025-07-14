import React from 'react'
import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
      <nav className="bg-white dark:bg-primary-900 border-b border-primary-200 dark:border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-primary-900 dark:text-primary-100">
                Prompt Manager
              </h1>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}