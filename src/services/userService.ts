import { mockUsers } from 'src/mocks/mockUsers'

export const getUsers = async () => {
  return mockUsers
}

export const getUserById = async (userId: string) => {
  return mockUsers.find((user) => user.id === userId) ?? null
}

export const userExists = async (userId: string) => {
  return mockUsers.some((user) => user.id === userId)
}
