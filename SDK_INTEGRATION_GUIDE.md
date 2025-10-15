# SDK集成指南

本文档说明如何将property-valuation应用更新为使用Universal FHEVM SDK。

## 已完成的工作

### 1. SDK构建配置 ✅

SDK已成功构建，包含以下输出：

```
packages/fhevm-sdk/dist/
├── index.js / index.mjs         # 主入口点
├── react/index.js / index.mjs   # React hooks
├── vue/index.js / index.mjs     # Vue composables
├── node/index.js / index.mjs    # Node.js support
└── *.d.ts / *.d.mts             # TypeScript类型定义
```

构建命令：
```bash
cd packages/fhevm-sdk
npm run build
```

### 2. 测试套件创建 ✅

创建了完整的测试套件，包括：

**测试文件：**
- `tests/validation.test.ts` - 输入验证测试
- `tests/network.test.ts` - 网络配置测试
- `tests/errors.test.ts` - 错误类测试

**测试配置：**
- `vitest.config.ts` - Vitest配置文件

**运行测试：**
```bash
cd packages/fhevm-sdk
npm test              # 运行测试
npm run test:coverage # 生成覆盖率报告
```

**测试覆盖范围：**
- ✅ 输入验证（bool, uint8-256, address, bytes）
- ✅ 地址和handle验证
- ✅ BigInt转换
- ✅ 网络配置获取和验证
- ✅ 所有错误类的实例化和继承

### 3. property-valuation SDK集成 ✅

**已添加SDK依赖：**

在 `examples/property-valuation/package.json` 中添加了：
```json
"dependencies": {
  "fhevm-sdk": "file:../../packages/fhevm-sdk",
  ...
}
```

**安装依赖：**
```bash
cd examples/property-valuation
npm install
```

## 使用SDK的方式

### 方式1：使用React Hooks（推荐）

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'

// 在App根组件包装Provider
function App() {
  return (
    <FhevmProvider network="sepolia">
      <PropertyValuationApp />
    </FhevmProvider>
  )
}

// 在组件中使用hooks
function RegisterPropertyForm() {
  const { instance, ready } = useFhevm()
  const { encrypt, encrypting } = useEncrypt()

  const handleSubmit = async (data) => {
    // 加密房产数据
    const encryptedArea = await encrypt(data.area, 'uint32')
    const encryptedValue = await encrypt(data.value, 'uint64')

    // 提交到合约...
  }
}
```

### 方式2：使用核心函数（更灵活）

```typescript
import { createFhevmInstance, encryptValue } from 'fhevm-sdk'

// 创建实例
const instance = await createFhevmInstance({
  network: 'sepolia'
})

// 加密数据
const encrypted = await encryptValue(instance, 1000, 'uint32')
```

## 迁移步骤

### 第一步：安装依赖

```bash
cd examples/property-valuation
npm install
```

### 第二步：更新App.tsx

添加FhevmProvider：

```typescript
import { FhevmProvider } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <PropertyValuationApp />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </FhevmProvider>
  )
}
```

### 第三步：更新组件使用SDK

在 `RegisterPropertyForm.tsx` 中：

```typescript
import { useEncrypt } from 'fhevm-sdk'

export function RegisterPropertyForm() {
  const { encrypt, encrypting, error } = useEncrypt()

  const handleRegister = async (formData) => {
    try {
      // 使用SDK加密数据
      const encryptedArea = await encrypt(formData.area, 'uint32')
      const encryptedBedrooms = await encrypt(formData.bedrooms, 'uint8')
      const encryptedBathrooms = await encrypt(formData.bathrooms, 'uint8')

      // 提交到合约
      await contract.registerProperty(
        formData.address,
        encryptedArea.data,
        encryptedBedrooms.data,
        encryptedBathrooms.data
      )
    } catch (err) {
      console.error('Encryption failed:', err)
    }
  }
}
```

在 `SubmitValuationForm.tsx` 中：

```typescript
import { useEncrypt } from 'fhevm-sdk'

export function SubmitValuationForm({ propertyId }) {
  const { encrypt } = useEncrypt()

  const handleSubmitValuation = async (amount) => {
    // 加密估值
    const encryptedAmount = await encrypt(amount, 'uint64')

    // 提交到合约
    await contract.submitValuation(
      propertyId,
      encryptedAmount.data
    )
  }
}
```

## 优势

使用SDK后的优势：

### 1. 代码更简洁
**之前：**
```typescript
// 需要手动管理fhevmjs实例
import { createInstance } from 'fhevmjs'

const instance = await createInstance({...})
const publicKey = instance.getPublicKey()
const encrypted = instance.encrypt_uint32(value)
```

**现在：**
```typescript
// 自动管理，只需使用hook
const { encrypt } = useEncrypt()
const encrypted = await encrypt(value, 'uint32')
```

### 2. 类型安全
SDK提供完整的TypeScript类型定义，编译时就能发现错误。

### 3. 自动错误处理
```typescript
const { encrypt, error } = useEncrypt()

if (error) {
  // SDK自动捕获并提供错误信息
  console.error('Encryption error:', error)
}
```

### 4. 状态管理
```typescript
const { encrypting } = useEncrypt()

// 可以直接用于UI状态
{encrypting && <Spinner />}
```

### 5. 框架无关
核心功能可以在React、Vue、Node.js等任何环境使用。

## 测试

运行property-valuation的测试以确保SDK集成正确：

```bash
cd examples/property-valuation
npm test              # 运行前端测试
npm run test:hardhat  # 运行合约测试
```

## 下一步

1. **完成迁移**: 将所有使用fhevmjs的地方替换为SDK
2. **测试**: 确保所有功能正常工作
3. **优化**: 利用SDK的高级功能优化代码
4. **文档**: 更新README说明SDK使用

## 支持

如有问题，请参考：
- SDK文档：`packages/fhevm-sdk/README.md`
- 示例代码：`examples/react-demo/` 和 `examples/nextjs-demo/`
- 测试用例：`packages/fhevm-sdk/tests/`

## 总结

✅ SDK构建完成
✅ 测试套件创建完成
✅ property-valuation已添加SDK依赖
✅ 提供了完整的迁移指南
✅ 代码更简洁、类型更安全、开发更高效
