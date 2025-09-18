// Necessary if using App Router to ensure this file runs on the client
'use client'

import { datadogRum } from '@datadog/browser-rum'

datadogRum.init({
  applicationId: 'a2656e83-8aa2-40db-86e2-d2c69ddda570',
  clientToken: 'pub5c1bf8fc9a50701d8c1bfa92dfea7658',
  site: 'us5.datadoghq.com',
  service: 'ralli-frontend',
  env: 'prod',
  // Specify a version number to identify the deployed version of your application in Datadog
  // version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
  // Specify URLs to propagate trace headers for connection between RUM and backend trace
  allowedTracingUrls: [{ match: 'https://example.com/api/', propagatorTypes: ['tracecontext'] }],
})

export default function DatadogInit() {
  // Render nothing - this component is only included so that the init code
  // above will run client-side
  return null
}
