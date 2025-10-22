export interface User {
  id: number
  email: string
  name?: string
}

export interface Post {
  id: number
  title: string
  content?: string
  published: boolean
  authorId: number
  author?: User
}
