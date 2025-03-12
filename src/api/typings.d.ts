declare namespace API {
  type banParams = {
    id: string
  }

  type delete1Params = {
    id: string
  }

  type delete2Params = {
    id: string
  }

  type deleteUsingGETParams = {
    id: string
  }

  type getMenuByMerchantParams = {
    merchantId: string
    pageNum?: number
    pageSize?: number
  }

  type getMenuListParams = {
    pageNum?: number
    pageSize?: number
  }

  type getMenuParams = {
    id: string
  }

  type getMerchantListParams = {
    pageNum?: number
    pageSize?: number
  }

  type getMerchantParams = {
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

  type MenuCreateRequest = {
    merchantId: string
    name: string
    description?: string
    price: number
    category?: string
    imageUrl?: string
    status?: string
    sortOrder?: number
  }

  type MenuQueryRequest = {
    merchantId?: string
    name?: string
    category?: string
    status?: string
    minPrice?: number
    maxPrice?: number
  }

  type MenuUpdateRequest = {
    menuId: string
    merchantId?: string
    name?: string
    description?: string
    price?: number
    category?: string
    imageUrl?: string
    status?: string
    sortOrder?: number
  }

  type MenuVO = {
    menuId?: string
    merchantId?: string
    name?: string
    description?: string
    price?: number
    category?: string
    imageUrl?: string
    status?: string
    sortOrder?: number
    createdAt?: string
    updatedAt?: string
  }

  type MerchantCreateRequest = {
    name?: string
    phone?: string
  }

  type MerchantQueryRequest = {
    name?: string
    phone?: string
    status?: string
  }

  type MerchantUpdateRequest = {
    id?: string
    name?: string
    phone?: string
    province?: string
    city?: string
    district?: string
    street?: string
    addressDetail?: string
    description?: string
  }

  type MerchantVO = {
    id?: string
    userId?: string
    name?: string
    logo?: string
    phone?: string
    province?: string
    city?: string
    district?: string
    street?: string
    addressDetail?: string
    openTime?: string
    closeTime?: string
    description?: string
    minPrice?: number
    status?: string
    createTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type PageMenuVO = {
    records?: MenuVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageMenuVO
    searchCount?: PageMenuVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageMerchantVO = {
    records?: MerchantVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageMerchantVO
    searchCount?: PageMerchantVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
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

  type ResultInteger = {
    code?: number
    msg?: string
    data?: number
  }

  type ResultLong = {
    code?: number
    msg?: string
    data?: number
  }

  type ResultMenuVO = {
    code?: number
    msg?: string
    data?: MenuVO
  }

  type ResultMerchantVO = {
    code?: number
    msg?: string
    data?: MerchantVO
  }

  type ResultPageMenuVO = {
    code?: number
    msg?: string
    data?: PageMenuVO
  }

  type ResultPageMerchantVO = {
    code?: number
    msg?: string
    data?: PageMerchantVO
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

  type UserChangePassword = {
    oldPassword: string
    newPassword: string
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
