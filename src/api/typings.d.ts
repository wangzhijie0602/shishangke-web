declare namespace API {
  type banParams = {
    id: string
  }

  type cancelOrderParams = {
    id: number
    reason?: string
  }

  type CustomerCreateRequest = {
    username: string
    password: string
    realName?: string
    gender?: string
    birthDate?: string
    defaultAddress?: string
    preferences?: string
  }

  type CustomerUpdateRequest = {
    username: string
    password?: string
    realName?: string
    gender?: string
    birthDate?: string
    defaultAddress?: string
    preferences?: string
  }

  type CustomerVO = {
    id?: number
    username?: string
    realName?: string
    gender?: string
    birthDate?: string
    defaultAddress?: string
    preferences?: string
    vipLevel?: number
    points?: number
    createdAt?: string
    updatedAt?: string
  }

  type delete1Params = {
    id: string
  }

  type delete2Params = {
    id: string
  }

  type deleteMerchantParams = {
    id: number
  }

  type deleteOrderParams = {
    id: number
  }

  type deleteReview1Params = {
    id: number
  }

  type deleteReviewParams = {
    id: number
  }

  type deleteUsingGETParams = {
    id: string
  }

  type getCustomerInfoParams = {
    username: string
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

  type getMenuReviewsParams = {
    menuId: number
    pageNum?: number
    pageSize?: number
  }

  type getMerchant1Params = {
    id: number
  }

  type getMerchantList1Params = {
    pageNum?: number
    pageSize?: number
  }

  type getMerchantListParams = {
    pageNum?: number
    pageSize?: number
  }

  type getMerchantParams = {
    id: string
  }

  type getMerchantReviewsParams = {
    merchantId: number
    pageNum?: number
    pageSize?: number
  }

  type getOrderDetailParams = {
    id: number
  }

  type getOrderListParams = {
    pageNum?: number
    pageSize?: number
  }

  type getParams = {
    id: string
  }

  type getReview1Params = {
    id: number
  }

  type getReviewList1Params = {
    pageNum?: number
    pageSize?: number
  }

  type getReviewListParams = {
    pageNum?: number
    pageSize?: number
  }

  type getReviewParams = {
    id: number
  }

  type getRoleParams = {
    id: string
  }

  type getUserListParams = {
    pageNum?: number
    pageSize?: number
  }

  type getUserReviews1Params = {
    pageNum?: number
    pageSize?: number
  }

  type getUserReviewsParams = {
    pageNum?: number
    pageSize?: number
  }

  type likeReviewParams = {
    id: number
  }

  type login1Params = {
    username: string
    password: string
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

  type MenuReviewCreateRequest = {
    menuId: number
    orderId: number
    content?: string
    rating: number
    images?: string[]
    tasteRating?: number
    appearanceRating?: number
    isAnonymous?: number
  }

  type MenuReviewQueryRequest = {
    menuId?: number
    userId?: number
    minRating?: number
    maxRating?: number
    isAnonymous?: number
    startTime?: string
    endTime?: string
  }

  type MenuReviewUpdateRequest = {
    reviewId: number
    content?: string
    rating?: number
    images?: string[]
    tasteRating?: number
    appearanceRating?: number
    isAnonymous?: number
  }

  type MenuReviewVO = {
    reviewId?: number
    userId?: number
    username?: string
    nickname?: string
    avatar?: string
    menuId?: number
    menuName?: string
    menuImageUrl?: string
    orderId?: number
    content?: string
    rating?: number
    images?: string[]
    tasteRating?: number
    appearanceRating?: number
    isAnonymous?: number
    likesCount?: number
    createdAt?: string
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
    userId?: number
    name?: string
    phone?: string
    status?: string
  }

  type MerchantReviewCreateRequest = {
    merchantId: number
    content?: string
    rating: number
    images?: string[]
    isAnonymous?: number
  }

  type MerchantReviewQueryRequest = {
    merchantId?: number
    userId?: number
    minRating?: number
    maxRating?: number
    isAnonymous?: number
    startTime?: string
    endTime?: string
  }

  type MerchantReviewUpdateRequest = {
    reviewId: number
    content?: string
    rating?: number
    images?: string[]
    isAnonymous?: number
  }

  type MerchantReviewVO = {
    reviewId?: number
    userId?: number
    username?: string
    nickname?: string
    avatar?: string
    merchantId?: number
    merchantName?: string
    merchantLogo?: string
    content?: string
    rating?: number
    images?: string[]
    isAnonymous?: number
    createdAt?: string
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
    openTime?: string
    closeTime?: string
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

  type OrderCreateRequest = {
    merchantId: number
    totalAmount: number
    address: string
    phone: string
    remark?: string
    deliveryFee?: number
    expectedTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type OrderQueryRequest = {
    status?: string
    merchantId?: number
    paymentStatus?: string
    startTime?: string
    endTime?: string
  }

  type OrderVO = {
    orderId?: number
    userId?: number
    merchantId?: number
    merchantName?: string
    orderNumber?: string
    totalAmount?: number
    status?: string
    paymentMethod?: string
    paymentStatus?: string
    address?: string
    phone?: string
    remark?: string
    deliveryFee?: number
    expectedTime?: string
    createdAt?: string
    updatedAt?: string
  }

  type PageMenuReviewVO = {
    records?: MenuReviewVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageMenuReviewVO
    searchCount?: PageMenuReviewVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
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

  type PageMerchantReviewVO = {
    records?: MerchantReviewVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageMerchantReviewVO
    searchCount?: PageMerchantReviewVO
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

  type PageOrderVO = {
    records?: OrderVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageOrderVO
    searchCount?: PageOrderVO
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

  type payOrderParams = {
    id: number
    paymentMethod: string
  }

  type ResultCustomerVO = {
    code?: number
    msg?: string
    data?: CustomerVO
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

  type ResultMenuReviewVO = {
    code?: number
    msg?: string
    data?: MenuReviewVO
  }

  type ResultMenuVO = {
    code?: number
    msg?: string
    data?: MenuVO
  }

  type ResultMerchantReviewVO = {
    code?: number
    msg?: string
    data?: MerchantReviewVO
  }

  type ResultMerchantVO = {
    code?: number
    msg?: string
    data?: MerchantVO
  }

  type ResultOrderVO = {
    code?: number
    msg?: string
    data?: OrderVO
  }

  type ResultPageMenuReviewVO = {
    code?: number
    msg?: string
    data?: PageMenuReviewVO
  }

  type ResultPageMenuVO = {
    code?: number
    msg?: string
    data?: PageMenuVO
  }

  type ResultPageMerchantReviewVO = {
    code?: number
    msg?: string
    data?: PageMerchantReviewVO
  }

  type ResultPageMerchantVO = {
    code?: number
    msg?: string
    data?: PageMerchantVO
  }

  type ResultPageOrderVO = {
    code?: number
    msg?: string
    data?: PageOrderVO
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

  type updateAddressParams = {
    id: number
    province: string
    city: string
    district: string
    street: string
    addressDetail: string
  }

  type updateBirthDateParams = {
    birthDate: string
  }

  type updateBusinessHoursParams = {
    id: number
    openTime: string
    closeTime: string
  }

  type updateDefaultAddressParams = {
    defaultAddress: string
  }

  type updateDescriptionParams = {
    id: number
    description: string
  }

  type updateEmailParams = {
    email: string
  }

  type updateGenderParams = {
    gender: string
  }

  type updateLogoParams = {
    id: number
    logo: string
  }

  type updateMerchantAddressParams = {
    id: number
    province: string
    city: string
    district: string
    street: string
    addressDetail: string
  }

  type updateMerchantBusinessHoursParams = {
    id: number
    openTime: string
    closeTime: string
  }

  type updateMerchantDescriptionParams = {
    id: number
    description: string
  }

  type updateMerchantLogoParams = {
    id: number
    logo: string
  }

  type updateMerchantMinPriceParams = {
    id: number
    minPrice: number
  }

  type updateMerchantNameParams = {
    id: number
    name: string
  }

  type updateMerchantPhoneParams = {
    id: number
    phone: string
  }

  type updateMerchantStatusParams = {
    id: number
    status: string
  }

  type updateMinPriceParams = {
    id: number
    minPrice: number
  }

  type updateNameParams = {
    id: number
    name: string
  }

  type updateNicknameParams = {
    nickname: string
  }

  type updateOrderStatusParams = {
    id: number
    status: string
  }

  type updatePhone1Params = {
    id: number
    phone: string
  }

  type updatePhoneParams = {
    phone: string
  }

  type updatePreferencesParams = {
    preferences: string
  }

  type updateRealNameParams = {
    realName: string
  }

  type updateStatusParams = {
    id: number
    status: string
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

  type UserInfoUpdateRequest = {
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
