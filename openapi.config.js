import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/requests'",
  schemaPath: 'http://localhost:8081/v3/api-docs',
  serversPath: './src',
})
