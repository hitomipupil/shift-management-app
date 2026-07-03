type UserRole = 'manager' | 'employee'

export type User = {
  id: string
  name: string
  role: UserRole
}
