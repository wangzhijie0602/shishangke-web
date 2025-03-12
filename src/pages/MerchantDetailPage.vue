<template>
  <div class="merchant-detail-container">
    <a-card title="店铺详情" :bordered="false" class="detail-card">
      <a-form :model="form" @submit="handleSubmit" :rules="rules" layout="vertical">
        <a-divider orientation="left">基础信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="店铺ID" name="id">
              <a-input v-model:value="form.id" disabled />
            </a-form-item>
            <a-form-item label="店铺名称" name="name" required>
              <a-input v-model:value="form.name" placeholder="请输入店铺名称" />
            </a-form-item>
            <a-form-item label="联系电话" name="phone">
              <a-input v-model:value="form.phone" placeholder="请输入联系电话" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="店铺Logo" name="logo" class="logo-upload-container">
              <div class="logo-preview" v-if="form.logo">
                <img :src="form.logo" alt="店铺Logo" />
                <div class="logo-actions">
                  <a-button type="primary" size="small" @click="handleViewLogo">
                    <template #icon><EyeOutlined /></template>
                    预览
                  </a-button>
                  <a-button danger size="small" @click="handleRemoveLogo">
                    <template #icon><DeleteOutlined /></template>
                    删除
                  </a-button>
                </div>
              </div>
              <a-upload
                v-else
                name="logo"
                list-type="picture-card"
                class="logo-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                @change="handleLogoChange"
              >
                <div v-if="uploading">
                  <a-spin />
                </div>
                <div v-else class="upload-placeholder">
                  <PlusOutlined />
                  <div class="ant-upload-text">上传Logo</div>
                </div>
              </a-upload>
              <div class="upload-hint">建议尺寸: 200px x 200px, 支持jpg、png格式</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">地址信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="所在地区" name="region" required>
              <a-spin :spinning="regionLoading" tip="加载地区数据中...">
                <a-cascader
                  v-model:value="selectedRegion"
                  :options="regionOptions"
                  :load-data="loadRegionData"
                  placeholder="请选择省/市/区"
                  @change="handleRegionChange"
                  style="width: 100%"
                  :fieldNames="{ label: 'label', value: 'value', children: 'children' }"
                  expandTrigger="hover"
                  changeOnSelect
                >
                  <template #suffixIcon><EnvironmentOutlined /></template>
                  <template #notFoundContent>
                    <div class="empty-content">
                      <p>暂无数据</p>
                    </div>
                  </template>
                </a-cascader>
              </a-spin>
              <div class="address-preview" v-if="form.province || form.city || form.district">
                当前选择: {{ form.province }} {{ form.city }} {{ form.district }}
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="详细地址" name="addressDetail">
              <a-textarea
                v-model:value="form.addressDetail"
                :rows="2"
                placeholder="请输入详细地址，如街道名称、门牌号等"
                show-count
                :maxlength="100"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">营业信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="营业开始时间" name="openTime">
              <a-time-picker
                v-model:value="form.openTime"
                format="HH:mm"
                placeholder="请选择营业开始时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="营业结束时间" name="closeTime">
              <a-time-picker
                v-model:value="form.closeTime"
                format="HH:mm"
                placeholder="请选择营业结束时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider orientation="left">其他信息</a-divider>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item label="店铺描述" name="description">
              <a-textarea
                v-model:value="form.description"
                :rows="4"
                placeholder="请输入店铺详细描述"
                show-count
                :maxlength="500"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="最低起送价" name="minPrice">
              <a-input-number
                v-model:value="form.minPrice"
                :min="0"
                placeholder="请输入最低起送价"
                style="width: 100%"
                addon-after="元"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="店铺状态" name="status">
              <a-select v-model:value="form.status" placeholder="请选择状态">
                <a-select-option value="ENABLED">正常营业</a-select-option>
                <a-select-option value="DISABLED">暂停营业</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider />
        <div class="form-actions">
          <a-button type="primary" html-type="submit" size="large">
            <template #icon><SaveOutlined /></template>
            保存修改
          </a-button>
          <a-button size="large" @click="handleCancel" style="margin-left: 16px">
            <template #icon><RollbackOutlined /></template>
            返回
          </a-button>
        </div>
      </a-form>
    </a-card>

    <!-- Logo预览弹窗 -->
    <a-modal v-model:visible="previewVisible" title="Logo预览" footer="{null}" centered>
      <img alt="Logo预览" style="width: 100%" :src="form.logo" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { getMerchant, update } from '@/api/merchantController'
import {
  SaveOutlined,
  RollbackOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

const form = ref<API.MerchantVO>({})
const uploading = ref(false)
const previewVisible = ref(false)
const selectedRegion = ref<string[]>([])
const regionLoading = ref(false)

// 地址相关数据
interface RegionOption {
  value: string
  label: string
  isLeaf: boolean
  loading?: boolean
  children?: RegionOption[]
}

// 省级数据
const regionOptions = ref<RegionOption[]>([])

// 省市区数据缓存
const regionCache = reactive<{
  provinces: RegionOption[]
  cities: Record<string, RegionOption[]>
  districts: Record<string, Record<string, RegionOption[]>>
}>({
  provinces: [],
  cities: {},
  districts: {},
})

// 初始化省级数据
const initProvinceData = async () => {
  regionLoading.value = true
  try {
    // 这里可以替换为实际的API调用
    // 模拟从API获取省份数据
    const provinces = [
      { code: '11', name: '北京市' },
      { code: '12', name: '天津市' },
      { code: '13', name: '河北省' },
      { code: '14', name: '山西省' },
      { code: '15', name: '内蒙古自治区' },
      { code: '21', name: '辽宁省' },
      { code: '22', name: '吉林省' },
      { code: '23', name: '黑龙江省' },
      { code: '31', name: '上海市' },
      { code: '32', name: '江苏省' },
      { code: '33', name: '浙江省' },
      { code: '34', name: '安徽省' },
      { code: '35', name: '福建省' },
      { code: '36', name: '江西省' },
      { code: '37', name: '山东省' },
      { code: '41', name: '河南省' },
      { code: '42', name: '湖北省' },
      { code: '43', name: '湖南省' },
      { code: '44', name: '广东省' },
      { code: '45', name: '广西壮族自治区' },
      { code: '46', name: '海南省' },
      { code: '50', name: '重庆市' },
      { code: '51', name: '四川省' },
      { code: '52', name: '贵州省' },
      { code: '53', name: '云南省' },
      { code: '54', name: '西藏自治区' },
      { code: '61', name: '陕西省' },
      { code: '62', name: '甘肃省' },
      { code: '63', name: '青海省' },
      { code: '64', name: '宁夏回族自治区' },
      { code: '65', name: '新疆维吾尔自治区' },
      { code: '71', name: '台湾省' },
      { code: '81', name: '香港特别行政区' },
      { code: '82', name: '澳门特别行政区' },
    ]

    // 转换为Cascader需要的格式
    regionCache.provinces = provinces.map((province) => ({
      value: province.code,
      label: province.name,
      isLeaf: false,
    }))

    regionOptions.value = regionCache.provinces
  } catch (error) {
    console.error('获取省份数据失败:', error)
    message.error('获取地区数据失败')
  } finally {
    regionLoading.value = false
  }
}

// 模拟城市数据获取
const getCityData = async (provinceCode: string): Promise<RegionOption[]> => {
  // 如果缓存中已有该省的城市数据，直接返回
  if (regionCache.cities[provinceCode]) {
    return regionCache.cities[provinceCode]
  }

  // 模拟API调用获取城市数据
  // 这里只是示例数据，实际项目中应该从后端API获取
  const cityDataMap: Record<string, { code: string; name: string }[]> = {
    '11': [{ code: '1101', name: '北京市' }],
    '12': [{ code: '1201', name: '天津市' }],
    '44': [
      { code: '4401', name: '广州市' },
      { code: '4403', name: '深圳市' },
      { code: '4406', name: '佛山市' },
      { code: '4413', name: '惠州市' },
      { code: '4419', name: '东莞市' },
      { code: '4420', name: '中山市' },
    ],
    '31': [{ code: '3101', name: '上海市' }],
    '51': [
      { code: '5101', name: '成都市' },
      { code: '5107', name: '绵阳市' },
      { code: '5115', name: '宜宾市' },
    ],
    // 其他省份的城市数据...
  }

  // 获取当前省份的城市数据，如果没有则返回空数组
  const cities = cityDataMap[provinceCode] || []

  // 转换为Cascader需要的格式
  const cityOptions = cities.map((city) => ({
    value: city.code,
    label: city.name,
    isLeaf: false,
  }))

  // 缓存城市数据
  regionCache.cities[provinceCode] = cityOptions

  return cityOptions
}

// 模拟区县数据获取
const getDistrictData = async (provinceCode: string, cityCode: string): Promise<RegionOption[]> => {
  // 如果缓存中已有该市的区县数据，直接返回
  if (regionCache.districts[provinceCode]?.[cityCode]) {
    return regionCache.districts[provinceCode][cityCode]
  }

  // 模拟API调用获取区县数据
  // 这里只是示例数据，实际项目中应该从后端API获取
  const districtDataMap: Record<string, Record<string, { code: string; name: string }[]>> = {
    '44': {
      '4401': [
        { code: '440103', name: '荔湾区' },
        { code: '440104', name: '越秀区' },
        { code: '440105', name: '海珠区' },
        { code: '440106', name: '天河区' },
        { code: '440111', name: '白云区' },
        { code: '440112', name: '黄埔区' },
      ],
      '4403': [
        { code: '440303', name: '罗湖区' },
        { code: '440304', name: '福田区' },
        { code: '440305', name: '南山区' },
        { code: '440306', name: '宝安区' },
        { code: '440307', name: '龙岗区' },
        { code: '440308', name: '盐田区' },
      ],
    },
    '11': {
      '1101': [
        { code: '110101', name: '东城区' },
        { code: '110102', name: '西城区' },
        { code: '110105', name: '朝阳区' },
        { code: '110106', name: '丰台区' },
        { code: '110107', name: '石景山区' },
        { code: '110108', name: '海淀区' },
      ],
    },
    // 其他城市的区县数据...
  }

  // 获取当前城市的区县数据，如果没有则返回空数组
  const districts = districtDataMap[provinceCode]?.[cityCode] || []

  // 转换为Cascader需要的格式
  const districtOptions = districts.map((district) => ({
    value: district.code,
    label: district.name,
    isLeaf: true,
  }))

  // 确保省份的districts对象已初始化
  if (!regionCache.districts[provinceCode]) {
    regionCache.districts[provinceCode] = {}
  }

  // 缓存区县数据
  regionCache.districts[provinceCode][cityCode] = districtOptions

  return districtOptions
}

// 动态加载地区数据
const loadRegionData = async (selectedOptions: RegionOption[]) => {
  const targetOption = selectedOptions[selectedOptions.length - 1]
  targetOption.loading = true

  try {
    if (selectedOptions.length === 1) {
      // 加载城市数据
      const provinceCode = targetOption.value
      const cities = await getCityData(provinceCode)
      targetOption.children = cities
    } else if (selectedOptions.length === 2) {
      // 加载区县数据
      const provinceCode = selectedOptions[0].value
      const cityCode = targetOption.value
      const districts = await getDistrictData(provinceCode, cityCode)
      targetOption.children = districts
    }
  } catch (error) {
    console.error('加载地区数据失败:', error)
    message.error('加载地区数据失败')
  } finally {
    targetOption.loading = false
  }
}

// 处理地区选择变化
const handleRegionChange = (value: string[]) => {
  if (value.length > 0) {
    // 查找省份名称
    const province = regionOptions.value.find((item) => item.value === value[0])
    form.value.province = province?.label || ''

    if (value.length > 1) {
      // 查找城市名称
      const cities = regionCache.cities[value[0]] || []
      const city = cities.find((item) => item.value === value[1])
      form.value.city = city?.label || ''

      if (value.length > 2) {
        // 查找区县名称
        const districts = regionCache.districts[value[0]]?.[value[1]] || []
        const district = districts.find((item) => item.value === value[2])
        form.value.district = district?.label || ''
      } else {
        form.value.district = ''
      }
    } else {
      form.value.city = ''
      form.value.district = ''
    }
  }
}

// 根据名称查找对应的编码
const findRegionCode = (
  provinceName: string,
  cityName?: string,
  districtName?: string,
): string[] => {
  const result: string[] = []

  // 查找省份编码
  const province = regionCache.provinces.find((item) => item.label === provinceName)
  if (!province) return result

  result.push(province.value)
  if (!cityName) return result

  // 确保已加载该省的城市数据
  if (!regionCache.cities[province.value]) return result

  // 查找城市编码
  const city = regionCache.cities[province.value].find((item) => item.label === cityName)
  if (!city) return result

  result.push(city.value)
  if (!districtName) return result

  // 确保已加载该市的区县数据
  if (!regionCache.districts[province.value]?.[city.value]) return result

  // 查找区县编码
  const district = regionCache.districts[province.value][city.value].find(
    (item) => item.label === districtName,
  )
  if (district) {
    result.push(district.value)
  }

  return result
}

const rules = {
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  region: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
  addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
}

onMounted(async () => {
  // 初始化省份数据
  await initProvinceData()

  const merchantId = route.params.id as string
  try {
    const res = await getMerchant({ id: merchantId })
    if (res.data.code === 1) {
      const merchantData = res.data.data || {}
      form.value = {
        ...merchantData,
        openTime: merchantData?.openTime,
        closeTime: merchantData?.closeTime,
      }

      // 初始化地区选择器的值
      if (form.value.province) {
        // 预加载省市区数据，以便能够正确回显
        const provinceObj = regionOptions.value.find((item) => item.label === form.value.province)
        if (provinceObj) {
          // 加载该省的城市数据
          await getCityData(provinceObj.value)

          if (form.value.city && regionCache.cities[provinceObj.value]) {
            const cityObj = regionCache.cities[provinceObj.value].find(
              (item) => item.label === form.value.city,
            )
            if (cityObj && form.value.district) {
              // 加载该市的区县数据
              await getDistrictData(provinceObj.value, cityObj.value)
            }
          }

          // 设置选中的地区编码
          selectedRegion.value = findRegionCode(
            form.value.province,
            form.value.city,
            form.value.district,
          )
        }
      }
    } else {
      message.error('获取店铺信息失败')
    }
  } catch (error) {
    console.error('获取店铺详情失败:', error)
    message.error('网络异常，请重试')
  }
})

const handleSubmit = async () => {
  // 验证地区是否已选择
  if (!form.value.province) {
    message.error('请选择所在地区')
    return
  }

  try {
    const res = await update(form.value)
    if (res.data.code === 1) {
      message.success('店铺信息更新成功')
      router.back()
    } else {
      message.error(res.data.msg || '更新失败')
    }
  } catch (error) {
    console.error('更新店铺信息失败:', error)
    message.error('网络异常，请重试')
  }
}

const handleCancel = () => {
  router.back()
}

// Logo上传相关方法
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传JPG/PNG格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!')
  }
  return isJpgOrPng && isLt2M
}

interface UploadChangeInfo {
  file: {
    status: string
    originFileObj: File
  }
}

const handleLogoChange = (info: UploadChangeInfo) => {
  if (info.file.status === 'uploading') {
    uploading.value = true
    return
  }

  if (info.file.status === 'done') {
    // 这里模拟上传成功后获取到的URL
    // 实际项目中应该从上传接口的响应中获取URL
    getBase64(info.file.originFileObj, (url: string) => {
      uploading.value = false
      form.value.logo = url
    })
  } else if (info.file.status === 'error') {
    uploading.value = false
    message.error('上传失败')
  }
}

const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const handleViewLogo = () => {
  previewVisible.value = true
}

const handleRemoveLogo = () => {
  form.value.logo = ''
}
</script>

<style scoped>
.merchant-detail-container {
  padding: 0 16px;
}

.detail-card {
  margin-bottom: 24px;
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.logo-upload-container {
  display: flex;
  flex-direction: column;
}

.logo-uploader {
  width: 200px;
  height: 200px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo-preview {
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  padding: 8px;
  gap: 8px;
}

.upload-hint {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

:deep(.ant-divider-inner-text) {
  font-weight: bold;
  color: #1890ff;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-cascader-menu) {
  height: 300px;
}

.address-preview {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}

.empty-content {
  text-align: center;
  padding: 20px 0;
  color: rgba(0, 0, 0, 0.45);
}
</style>
