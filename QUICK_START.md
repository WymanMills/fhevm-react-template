# 快速开始指南

Universal FHEVM SDK - 让区块链隐私计算变得超级简单！

---

## 🚀 立即开始（仅需8行代码）

```typescript
import { FhevmProvider, useFhevm, useEncrypt } from 'fhevm-sdk'

function App() {
  return <FhevmProvider network="sepolia"><MyApp /></FhevmProvider>
}

function MyApp() {
  const { instance, ready } = useFhevm()
  const { encrypt } = useEncrypt()
  // 就这么简单！
}
```

---

## 📦 安装SDK

### 从本地构建

```bash
# 1. 构建SDK
cd packages/fhevm-sdk
npm install
npm run build

# 2. 在您的项目中使用
cd ../../examples/your-project
npm install fhevm-sdk@file:../../packages/fhevm-sdk
```

### 从npm安装（待发布）

```bash
npm install fhevm-sdk
```

---

## 🧪 运行测试

```bash
# SDK测试
cd packages/fhevm-sdk
npm test              # 运行所有测试
npm run test:coverage # 查看覆盖率

# 应用测试
cd examples/property-valuation
npm test              # 前端测试
npm run test:hardhat  # 合约测试
```

---

## 💡 基本用法

### 1. 设置Provider

```typescript
import { FhevmProvider } from 'fhevm-sdk'

function App() {
  return (
    <FhevmProvider network="sepolia">
      <YourApp />
    </FhevmProvider>
  )
}
```

### 2. 加密数据

```typescript
import { useEncrypt } from 'fhevm-sdk'

function MyComponent() {
  const { encrypt, encrypting, error } = useEncrypt()

  const handleSubmit = async () => {
    // 加密不同类型的数据
    const encryptedBool = await encrypt(true, 'bool')
    const encryptedNumber = await encrypt(42, 'uint32')
    const encryptedBigInt = await encrypt(1000000n, 'uint64')
    const encryptedAddress = await encrypt('0x...', 'address')
  }

  return (
    <button onClick={handleSubmit} disabled={encrypting}>
      {encrypting ? 'Encrypting...' : 'Submit'}
    </button>
  )
}
```

### 3. 解密数据

```typescript
import { useDecrypt } from 'fhevm-sdk'

function ResultsComponent() {
  const { decrypt, requesting } = useDecrypt()

  const handleDecrypt = async () => {
    const value = await decrypt(
      contractAddress,
      handle,
      'uint32' // 可选：指定期望的类型
    )
    console.log('Decrypted value:', value)
  }
}
```

### 4. 获取实例状态

```typescript
import { useFhevm } from 'fhevm-sdk'

function StatusComponent() {
  const { instance, ready, loading, error } = useFhevm()

  if (loading) return <div>Initializing FHEVM...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!ready) return <div>Not ready</div>

  return <div>FHEVM is ready!</div>
}
```

---

## 📚 支持的数据类型

| 类型 | TypeScript | 范围 |
|------|-----------|------|
| `bool` | boolean | true/false |
| `uint8` | number | 0-255 |
| `uint16` | number | 0-65535 |
| `uint32` | number | 0-4294967295 |
| `uint64` | bigint | 0-2^64-1 |
| `uint128` | bigint | 0-2^128-1 |
| `uint256` | bigint | 0-2^256-1 |
| `address` | string | 以太坊地址 |
| `bytes` | string | 十六进制字符串 |

---

## 🌐 支持的网络

```typescript
// 预配置网络
<FhevmProvider network="sepolia" />
<FhevmProvider network="localhost" />

// 自定义网络
<FhevmProvider
  config={{
    network: {
      name: 'custom',
      chainId: 31337,
      rpcUrl: 'http://localhost:8545',
      gatewayUrl: 'http://localhost:3000'
    }
  }}
/>
```

---

## 🎨 示例应用

### 1. Next.js Demo

```bash
cd examples/nextjs-demo
npm install
npm run dev
```

### 2. React Demo

```bash
cd examples/react-demo
npm install
npm run dev
```

### 3. Property Valuation (完整应用)

```bash
cd examples/property-valuation
npm install
npm run dev
```

---

## 🎬 视频演示

### 3分钟快速演示

查看 `VIDEO_SCRIPT_3MIN.md` 了解完整的演示脚本。

**主要内容：**
1. SDK介绍 (30秒)
2. 代码演示 (45秒)
3. 实际应用 (60秒)
4. 多框架支持 (30秒)
5. 总结 (15秒)

**字幕文件：**
- 中文：`SUBTITLES_3MIN.txt`
- 英文：`SUBTITLES_3MIN_EN.txt`

---

## 🔧 开发命令

### SDK开发

```bash
cd packages/fhevm-sdk

npm run build         # 构建
npm run dev          # 开发模式（watch）
npm test             # 运行测试
npm run test:coverage # 测试覆盖率
npm run lint         # 代码检查
npm run type-check   # 类型检查
```

### 应用开发

```bash
cd examples/[app-name]

npm run dev          # 开发服务器
npm run build        # 生产构建
npm run preview      # 预览构建
npm test             # 运行测试
npm run lint         # 代码检查
```

---

## 📖 文档索引

| 文档 | 描述 |
|------|------|
| `README.md` | 主要README，项目概览 |
| `QUICK_START.md` | 本文件，快速开始 |
| `SDK_INTEGRATION_GUIDE.md` | SDK集成详细指南 |
| `COMPLETED_TASKS.md` | 已完成任务总结 |
| `packages/fhevm-sdk/README.md` | SDK完整文档 |
| `packages/fhevm-sdk/tests/README.md` | 测试套件文档 |
| `VIDEO_SCRIPT_3MIN.md` | 视频脚本 |

---

## 🐛 问题排查

### 问题：SDK构建失败

```bash
# 清理并重新构建
cd packages/fhevm-sdk
rm -rf node_modules dist
npm install
npm run build
```

### 问题：测试失败

```bash
# 检查测试输出
npm test -- --reporter=verbose

# 运行单个测试文件
npx vitest tests/validation.test.ts
```

### 问题：类型错误

```bash
# 运行类型检查
npm run type-check

# 重新生成类型
npm run build
```

---

## 💬 获取帮助

1. **查看文档**: 检查相关的README文件
2. **查看示例**: 参考examples目录中的代码
3. **查看测试**: tests目录包含大量使用示例
4. **创建Issue**: 在GitHub上报告问题

---

## ✨ 核心特性

- ✅ **简单**: 8行代码即可上手
- ✅ **类型安全**: 完整的TypeScript支持
- ✅ **框架无关**: React、Next.js、Vue、Node.js
- ✅ **自动化**: 自动处理初始化、错误、状态
- ✅ **可靠**: 85%+测试覆盖率
- ✅ **文档完善**: 详细的文档和示例

---

## 🎯 下一步

1. ✅ 查看示例应用
2. ✅ 阅读完整文档
3. ✅ 运行测试
4. ✅ 开始构建您的应用！

---

**Universal FHEVM SDK** - 让隐私计算变得简单 🚀
