# Contributing to FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK! This document provides guidelines for contributing to the project.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title** - Describe the issue concisely
2. **Description** - Explain what happened vs. what you expected
3. **Steps to reproduce** - Provide clear reproduction steps
4. **Environment** - Include OS, Node.js version, framework version
5. **Code example** - Minimal code that reproduces the issue

**Example**:
```markdown
### Bug: Encryption fails with uint256 type

**Description**: When encrypting values > 2^64 with uint256 type, encryption throws an error.

**Steps to reproduce**:
1. Call `encrypt(BigInt(2**65), 'uint256')`
2. Error thrown: "Value exceeds maximum"

**Environment**:
- OS: macOS 14.0
- Node: 18.19.0
- fhevm-sdk: 1.0.0
- Framework: React 18.2.0

**Code**:
\`\`\`typescript
const encrypted = await encrypt(BigInt(2**65), 'uint256')
// Throws error
\`\`\`
```

### Suggesting Enhancements

For feature requests:

1. **Check existing issues** - Ensure it hasn't been suggested
2. **Describe the use case** - Why is this needed?
3. **Propose a solution** - How would it work?
4. **Consider alternatives** - What other approaches exist?

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Write/update tests** - Ensure coverage remains high
5. **Update documentation** - Keep docs in sync
6. **Commit with clear messages** - Follow commit conventions
7. **Push and create PR**

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm
- Git

### Clone and Install

```bash
# Clone repository
git clone https://github.com/your-username/fhevm-sdk.git
cd fhevm-sdk

# Install dependencies
npm install
```

### Project Structure

```
fhevm-sdk/
├── packages/
│   └── fhevm-sdk/        # Main SDK package
│       ├── src/          # Source code
│       ├── tests/        # Test files
│       └── docs/         # Documentation
└── examples/             # Example applications
    ├── nextjs-demo/
    ├── react-demo/
    └── property-valuation/
```

### Build SDK

```bash
cd packages/fhevm-sdk
npm run build
```

### Run Tests

```bash
cd packages/fhevm-sdk
npm test
```

### Run Examples

```bash
# Next.js demo
cd examples/nextjs-demo
npm install
npm run dev

# React demo
cd examples/react-demo
npm install
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Ensure strict mode is enabled
- Add type definitions for all exports
- Use proper JSDoc comments

**Example**:
```typescript
/**
 * Encrypt a value using FHEVM
 *
 * @param instance - FHEVM instance
 * @param value - Value to encrypt
 * @param type - Type of value
 * @returns Encrypted value
 *
 * @example
 * ```typescript
 * const encrypted = await encryptValue(instance, 42, 'uint32')
 * ```
 */
export async function encryptValue<T extends InputType>(
  instance: FhevmInstance,
  value: number | boolean | bigint | string,
  type: T
): Promise<EncryptedValue<T>> {
  // Implementation
}
```

### Code Style

- Use Prettier for formatting
- Use ESLint for linting
- Follow existing code patterns
- Keep functions small and focused
- Use meaningful variable names

### Testing

- Write tests for all new features
- Maintain >90% code coverage
- Test edge cases and error conditions
- Use descriptive test names

**Example**:
```typescript
describe('encryptValue', () => {
  it('should encrypt uint32 values correctly', async () => {
    const instance = await createFhevmInstance({ network: 'sepolia' })
    const encrypted = await encryptValue(instance, 42, 'uint32')

    expect(encrypted.type).toBe('uint32')
    expect(encrypted.data).toBeInstanceOf(Uint8Array)
    expect(encrypted.data.length).toBeGreaterThan(0)
  })

  it('should throw error for invalid values', async () => {
    const instance = await createFhevmInstance({ network: 'sepolia' })

    await expect(
      encryptValue(instance, -1, 'uint32')
    ).rejects.toThrow('Value must be non-negative')
  })
})
```

### Documentation

- Update README for new features
- Add JSDoc comments to all public APIs
- Update relevant guides
- Include code examples

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body

footer
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

**Examples**:
```
feat(core): add batch encryption support

Implement encryptBatch() function to encrypt multiple values
in a single call, improving performance for bulk operations.

Closes #123
```

```
fix(react): prevent memory leak in useFhevm hook

Add cleanup function to useEffect to properly dispose of
FHEVM instance when component unmounts.

Fixes #456
```

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Implement your changes**
   - Write code
   - Add tests
   - Update docs
3. **Test thoroughly**
   - Run unit tests: `npm test`
   - Run linter: `npm run lint`
   - Test in example apps
4. **Update CHANGELOG.md** (if applicable)
5. **Create PR with description**:
   - What changes were made
   - Why they were made
   - How to test them
   - Related issues
6. **Address review feedback**
7. **Squash commits** before merge (if requested)

### PR Template

```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Lint passes
- [ ] Tests pass
- [ ] Example apps tested

## Related Issues
Closes #123
```

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Build and verify package
6. Create Git tag
7. Publish to npm
8. Create GitHub release

## Questions?

- Open a [Discussion](https://github.com/your-username/fhevm-sdk/discussions)
- Join our community chat (if available)
- Email: [your-email@example.com]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
