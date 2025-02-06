declare module '#auth-utils' {
  interface User {
    role: 'admin'

    // id: number
    // login: string
    // name: string
    // avatarUrl: string
    // htmlUrl: string
    // publicRepos: number
  }

  interface UserSession {
    lastAttemptAt?: number
  }
}

export {}
