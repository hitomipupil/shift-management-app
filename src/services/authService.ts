import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from 'src/firebase'

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export const logout = async (): Promise<void> => {
  await signOut(auth)
}

export const subscribeToAuthUser = (
  onChange: (authUser: FirebaseUser | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, onChange)
}
