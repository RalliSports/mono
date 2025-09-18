'use client'

import { datadogRum } from '@datadog/browser-rum'

// Add this to any component for testing
export default function TestPage() {
  const triggerError = () => {
    throw new Error('Test frontend error - this should appear in Datadog')
  }

  const triggerAsyncError = () => {
    Promise.reject(new Error('Test async error - unhandled promise rejection'))
  }

  const triggerCustomError = () => {
    datadogRum.addError(new Error('Custom error added manually'), {
      errorType: 'manual_test',
      userId: 'test-user-123',
    })
  }

  return (
    <div>
      <h1>Datadog Error Testing</h1>
      <button onClick={triggerError} className="bg-white text-black p-2 rounded-md">
        Trigger Sync Error
      </button>
      <button onClick={triggerAsyncError} className="bg-white text-black p-2 rounded-md">
        Trigger Async Error
      </button>
      <button onClick={triggerCustomError} className="bg-white text-black p-2 rounded-md">
        Trigger Custom Error
      </button>
    </div>
  )
}
