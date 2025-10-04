import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      companyId?: string
      company?: any
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    companyId?: string
    company?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    companyId?: string
    company?: any
  }
}
