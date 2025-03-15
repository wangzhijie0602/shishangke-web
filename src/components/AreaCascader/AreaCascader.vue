<template>
  <a-cascader
    v-if="type !== 'province'"
    v-model:value="selectedValue"
    :options="options"
    :field-names="{ label: 'name', value: 'name', children: 'children' }"
    expand-trigger="hover"
    :placeholder="placeholder"
    @change="handleChange"
    style="width: 100%"
  />
  <a-select
    v-else
    v-model:value="selectedProvince"
    :placeholder="placeholder"
    @change="handleProvinceChange"
    style="width: 100%"
  >
    <a-select-option v-for="item in options" :key="item.code" :value="item.name">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

export interface AreaItemType {
  code: string
  name: string
  children?: AreaItemType[]
}

type CascaderType = 'province' | 'city' | 'area' | 'street'

interface Props {
  type?: CascaderType
  value?: string[] | string
  placeholder?: string
  onChange?: (values?: string[], options?: AreaItemType[]) => void
}

interface SelectOption {
  key: string
  value: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'street',
  value: () => [],
  placeholder: '请选择省市区街道',
  onChange: () => {},
})

const options = ref<AreaItemType[]>([])
const selectedValue = ref<string[]>([])
const selectedProvince = ref<string>('')
const selectedOptions = ref<AreaItemType[]>([])

// 监听外部传入的value变化
watch(
  () => props.value,
  (newVal) => {
    if (props.type === 'province') {
      selectedProvince.value = newVal as string
    } else {
      selectedValue.value = (newVal as string[])?.some((v) => v) ? (newVal as string[]) : ['']
    }
  },
  { immediate: true, deep: true },
)

// 加载地址数据
const loadAddressData = async () => {
  try {
    let data: { default: AreaItemType[] }
    // 根据类型加载不同的数据
    if (props.type === 'street') {
      // 省市区街道数据
      const streetData = await import('@/assets/json/areas-streets.json')
      data = { default: streetData.default as unknown as AreaItemType[] }
    } else {
      // 省市区数据
      data = await import('@/assets/json/areas.json')
    }

    // 根据类型处理数据
    switch (props.type) {
      case 'province': {
        // 只需要省级数据，移除子节点
        options.value = JSON.parse(JSON.stringify(data.default)).map((item: AreaItemType) => {
          const newItem = { ...item }
          delete newItem.children
          return newItem
        })
        break
      }
      case 'city': {
        // 省市数据，移除区级子节点
        options.value = JSON.parse(JSON.stringify(data.default)).map((item: AreaItemType) => {
          const newItem = { ...item }
          if (newItem.children) {
            newItem.children = newItem.children.map((city: AreaItemType) => {
              const newCity = { ...city }
              delete newCity.children
              return newCity
            })
          }
          return newItem
        })
        break
      }
      case 'area': {
        // 省市区数据，移除街道级子节点
        options.value = JSON.parse(JSON.stringify(data.default)).map((item: AreaItemType) => {
          const newItem = { ...item }
          if (newItem.children) {
            newItem.children = newItem.children.map((city: AreaItemType) => {
              const newCity = { ...city }
              if (newCity.children) {
                newCity.children = newCity.children.map((area: AreaItemType) => {
                  const newArea = { ...area }
                  delete newArea.children
                  return newArea
                })
              }
              return newCity
            })
          }
          return newItem
        })
        break
      }
      case 'street': {
        // 完整数据（包含街道）
        options.value = data.default
        break
      }
      default: {
        // 默认使用完整数据
        options.value = data.default
      }
    }
  } catch (error) {
    console.error('加载地址数据失败:', error)
  }
}

// 处理级联选择器变化
const handleChange = (values: string[], opts: AreaItemType[]) => {
  selectedValue.value = values
  selectedOptions.value = opts
  props.onChange(values, opts)
}

// 处理省份选择器变化
const handleProvinceChange = (value: string, option: SelectOption) => {
  selectedProvince.value = value
  const selectedOpt = { code: option.key, name: value }
  props.onChange([value], [selectedOpt])
}

onMounted(() => {
  loadAddressData()
})
</script>
