import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from 'src/firebase'
import type { User } from 'src/types/user'

export const getUsers = async (): Promise<User[]> => {
  const usersSnapshot = await getDocs(collection(db, 'users'))

  return usersSnapshot.docs.map((userDocument) => {
    const data = userDocument.data()

    return {
      id: userDocument.id,
      name: data.name,
      role: data.role,
    } as User
  })
}

export const getUserById = async (userId: string): Promise<User | null> => {
  const userSnapshot = await getDoc(doc(db, 'users', userId))
  if (!userSnapshot.exists()) {
    return null
  }
  const data = userSnapshot.data()
  return {
    id: userSnapshot.id,
    name: data.name,
    role: data.role,
  }
}

export const userExists = async (userId: string): Promise<boolean> => {
  const user = await getUserById(userId)
  return user !== null
}
