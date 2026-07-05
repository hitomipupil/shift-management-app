import { mockUsers } from 'src/mocks/mockUsers'
import type { User } from 'src/types/user'

export const getUsers = async (): Promise<User[]> => {
  return mockUsers
}

export const getUserById = async (userId: string): Promise<User | null> => {
  return mockUsers.find((user) => user.id === userId) ?? null
}

export const userExists = async (userId: string): Promise<boolean> => {
  return mockUsers.some((user) => user.id === userId)
}
