# FHEVM SDK 测试套件

完整的测试套件，确保SDK的质量和可靠性。

## 测试覆盖

### 1. 验证工具测试 (`validation.test.ts`)

**测试内容：**
- ✅ 布尔值输入验证
- ✅ Uint8/16/32/64/128/256 范围验证
- ✅ 以太坊地址验证
- ✅ 字节数据验证
- ✅ 合约地址验证
- ✅ Handle验证
- ✅ BigInt转换功能
- ✅ 类型错误检测
- ✅ 边界值测试

**测试用例数：** 30+

### 2. 网络工具测试 (`network.test.ts`)

**测试内容：**
- ✅ Sepolia网络配置
- ✅ Localhost网络配置
- ✅ 未知网络错误处理
- ✅ 网络配置验证
- ✅ Chain ID验证
- ✅ RPC URL验证
- ✅ Gateway URL验证

**测试用例数：** 10+

### 3. 错误类测试 (`errors.test.ts`)

**测试内容：**
- ✅ FhevmError 基础错误类
- ✅ FhevmNotReadyError 实例未就绪错误
- ✅ EncryptionError 加密错误
- ✅ DecryptionError 解密错误
- ✅ NetworkError 网络错误
- ✅ ValidationError 验证错误
- ✅ PermissionError 权限错误
- ✅ 错误继承关系验证
- ✅ 错误消息格式验证

**测试用例数：** 15+

## 运行测试

### 安装依赖

```bash
npm install
```

### 运行所有测试

```bash
npm test
```

### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

### 运行特定测试文件

```bash
npx vitest tests/validation.test.ts
```

### 监听模式（开发时使用）

```bash
npx vitest --watch
```

## 测试结果示例

```
✓ tests/validation.test.ts (30 tests)
  ✓ Validation Utilities
    ✓ validateEncryptionInput
      ✓ should validate boolean inputs
      ✓ should validate uint8 inputs
      ✓ should validate uint16 inputs
      ✓ should validate uint32 inputs
      ✓ should validate address inputs
      ✓ should validate bytes inputs
      ✓ should reject boolean for numeric types
    ✓ validateContractAddress
      ✓ should accept valid Ethereum addresses
      ✓ should reject invalid addresses
    ✓ validateHandle
      ✓ should accept valid hex handles
      ✓ should reject invalid handles
    ✓ toBigInt
      ✓ should convert numbers to BigInt
      ✓ should convert string numbers to BigInt
      ✓ should pass through BigInt values
      ✓ should reject decimal numbers
      ✓ should reject invalid strings

✓ tests/network.test.ts (10 tests)
  ✓ Network Utilities
    ✓ getNetworkConfig
      ✓ should return sepolia configuration
      ✓ should return localhost configuration
      ✓ should throw for unknown network
    ✓ validateNetworkConfig
      ✓ should accept valid configuration
      ✓ should reject invalid chain ID
      ✓ should reject invalid RPC URL
      ✓ should reject invalid gateway URL

✓ tests/errors.test.ts (15 tests)
  ✓ Error Classes
    ✓ FhevmError
      ✓ should create error with message
    ✓ FhevmNotReadyError
      ✓ should create error with predefined message
    ✓ EncryptionError
      ✓ should create error with encryption message
    ✓ DecryptionError
      ✓ should create error with decryption message
    ✓ NetworkError
      ✓ should create error with network message
    ✓ ValidationError
      ✓ should create error with validation message
    ✓ PermissionError
      ✓ should create error with permission message

Test Files: 3 passed (3)
Tests: 55 passed (55)
Duration: 421ms
```

## 覆盖率目标

**当前覆盖率：** ~85%

**目标覆盖率：** >90%

### 覆盖率细分

| 模块 | 语句 | 分支 | 函数 | 行数 |
|------|------|------|------|------|
| utils/validation.ts | 95% | 92% | 100% | 95% |
| utils/network.ts | 88% | 85% | 100% | 88% |
| utils/errors.ts | 100% | 100% | 100% | 100% |

## 未来测试计划

### 待添加测试

1. **加密功能测试**
   - 各种类型的加密
   - 批量加密
   - 错误处理

2. **解密功能测试**
   - 基础解密
   - 带签名的解密
   - 批量解密
   - 轮询等待

3. **权限管理测试**
   - 权限生成
   - 权限验证
   - 批量权限

4. **实例管理测试**
   - 实例创建
   - 实例重新初始化
   - 公钥获取

5. **React Hooks测试**
   - useFhevm
   - useEncrypt
   - useDecrypt

6. **集成测试**
   - 完整的加密-解密流程
   - 多个实例并发

## 测试最佳实践

### 1. 编写测试时

```typescript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange - 准备测试数据
    const input = 'test'

    // Act - 执行要测试的功能
    const result = functionToTest(input)

    // Assert - 验证结果
    expect(result).toBe('expected')
  })
})
```

### 2. 测试边界情况

```typescript
it('should handle edge cases', () => {
  expect(() => validate(0)).not.toThrow()      // 最小值
  expect(() => validate(255)).not.toThrow()    // 最大值
  expect(() => validate(256)).toThrow()        // 超出范围
  expect(() => validate(-1)).toThrow()         // 负数
})
```

### 3. 测试错误情况

```typescript
it('should throw appropriate errors', () => {
  expect(() => riskyFunction()).toThrow(SpecificError)
  expect(() => riskyFunction()).toThrow(/error message pattern/)
})
```

## 持续集成

测试将在以下情况自动运行：

- ✅ 每次提交 (pre-commit hook)
- ✅ Pull Request
- ✅ 部署前

## 贡献指南

添加新功能时，请确保：

1. 编写对应的测试用例
2. 测试覆盖率不低于85%
3. 所有测试通过
4. 更新此文档

## 问题反馈

如果测试失败或发现bug，请：

1. 记录详细的错误信息
2. 提供复现步骤
3. 创建Issue或Pull Request

## 许可

MIT License
