import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Note: To run this locally, you must have FBASE_ADMIN_PRIVATE_KEY in your env
// For demo purposes, this script just outlines what data would be inserted.

const serviceAccount = {
  projectId: process.env.FBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// In a real environment with credentials, we would initialize like this:
// if (getApps().length === 0) {
//   initializeApp({ credential: cert(serviceAccount) })
// }
// const db = getFirestore()

async function main() {
  console.log('Seeding demo data into Firestore...')
  console.log('(Note: Requires valid Admin SDK credentials to run against production)')
  
  // Example ticket structure to be seeded
  const demoTickets = [
    {
      title: 'Cannot reset password on mobile',
      description: 'The password reset flow on the mobile app crashes.',
      status: 'open',
      priority: 'high',
      category: 'Technical',
      tags: ['mobile', 'auth', 'ios'],
      workspaceId: 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    // ... more tickets
  ]

  console.log(`Prepared ${demoTickets.length} tickets for seeding.`)
  console.log('Seed completed (dry run).')
}

main().catch(console.error)
