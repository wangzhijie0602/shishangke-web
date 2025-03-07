declare namespace API {
  type banParams = {
    id: string
  }

  type deleteUsingGETParams = {
    id: string
  }

  type getParams = {
    id: string
  }

  type getRoleParams = {
    id: string
  }

  type getUserListParams = {
    pageNum?: number
    pageSize?: number
  }

  type loginParams = {
    remember?: boolean
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserVO
    searchCount?: PageUserVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type ResultLong = {
    code?: number
    msg?: string
    data?: number
  }

  type ResultPageUserVO = {
    code?: number
    msg?: string
    data?: PageUserVO
  }

  type ResultSaTokenInfo = {
    code?: number
    msg?: string
    data?: SaTokenInfo
  }

  type ResultString = {
    code?: number
    msg?: string
    data?: string
  }

  type ResultUserVO = {
    code?: number
    msg?: string
    data?: UserVO
  }

  type ResultVoid = {
    code?: number
    msg?: string
    data?: Record<string, any>
  }

  type SaTokenInfo = {
    tokenName?: string
    tokenValue?: string
    isLogin?: boolean
    loginId?: Record<string, any>
    loginType?: string
    tokenTimeout?: number
    sessionTimeout?: number
    tokenSessionTimeout?: number
    tokenActiveTimeout?: number
    loginDevice?: string
    tag?: string
  }

  type unbanParams = {
    id: string
  }

  type UserCreateRequest = {
    username: string
    password: string
    nickname?: string
    email?: string
    phone?: string
  }

  type UserLoginRequest = {
    username: string
    password: string
  }

  type UserQueryRequest = {
    username?: string
    phone?: string
    nickname?: string
    status?: string
  }

  type UserRegisterRequest = {
    username: string
    password: string
  }

  type UserUpdateRequest = {
    id: string
    username?: string
    password?: string
    nickname?: string
    avatar?: string
    email?: string
    phone?: string
  }

  type UserVO = {
    id?: string
    username?: string
    nickname?: string
    avatar?: string
    email?: string
    phone?: string
    status?: string
    role?: string
    lastLoginTime?: string
    createdAt?: string
  }
}
