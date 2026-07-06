import { db } from './firestore'

export const getUserById = async (userId: string) => {
  const userSnapshot = await db.collection('users').doc(userId).get()

  if (!userSnapshot.exists) {
    return null
  }

  return userSnapshot.data()
}
