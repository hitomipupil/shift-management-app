import { initializeApp } from 'firebase-admin/app'
import { setGlobalOptions } from 'firebase-functions'

setGlobalOptions({ maxInstances: 10, region: 'asia-northeast1' })

initializeApp()

export { approveCoverageRequest } from './api/coverageRequests'
