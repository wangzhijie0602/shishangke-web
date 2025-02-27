declare namespace API {
  type loginParams = {
    remember?: boolean
  }

  type Result = {
    code?: number
    msg?: string
    data?: Record<string, any>
  }

  type UserLoginRequest = {
    username: string
    password: string
  }

  type UserRegisterRequest = {
    username: string
    password: string
    nickname: string
    email?: string
    phone?: string
  }
}
