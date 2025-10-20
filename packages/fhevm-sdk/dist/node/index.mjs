import { createInstance } from 'fhevmjs';
import { BrowserProvider, JsonRpcProvider } from 'ethers';

// src/utils/errors.ts
var FhevmError = class _FhevmError extends Error {
  constructor(message) {
    super(message);
    this.name = "FhevmError";
    Object.setPrototypeOf(this, _FhevmError.prototype);
  }
};
var FhevmNotReadyError = class _FhevmNotReadyError extends FhevmError {
  constructor() {
    super("FHEVM instance is not ready. Wait for initialization to complete.");
    this.name = "FhevmNotReadyError";
    Object.setPrototypeOf(this, _FhevmNotReadyError.prototype);
  }
};
var EncryptionError = class _EncryptionError extends FhevmError {
  constructor(message) {
    super(`Encryption failed: ${message}`);
    this.name = "EncryptionError";
    Object.setPrototypeOf(this, _EncryptionError.prototype);
  }
};
var DecryptionError = class _DecryptionError extends FhevmError {
  constructor(message) {
    super(`Decryption failed: ${message}`);
    this.name = "DecryptionError";
    Object.setPrototypeOf(this, _DecryptionError.prototype);
  }
};
var NetworkError = class _NetworkError extends FhevmError {
  constructor(message) {
    super(`Network error: ${message}`);
    this.name = "NetworkError";
    Object.setPrototypeOf(this, _NetworkError.prototype);
  }
};
var ValidationError = class _ValidationError extends FhevmError {
  constructor(message) {
    super(`Validation error: ${message}`);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, _ValidationError.prototype);
  }
};
var PermissionError = class _PermissionError extends FhevmError {
  constructor(message) {
    super(`Permission error: ${message}`);
    this.name = "PermissionError";
    Object.setPrototypeOf(this, _PermissionError.prototype);
  }
};

// src/utils/network.ts
var NETWORK_CONFIGS = {
  sepolia: {
    name: "sepolia",
    chainId: 11155111,
    rpcUrl: "https://sepolia.infura.io/v3/",
    gatewayUrl: "https://gateway.sepolia.zama.ai",
    aclAddress: "0x9d6f6d3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D"
  },
  mainnet: {
    name: "mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/",
    gatewayUrl: "https://gateway.zama.ai",
    aclAddress: "0x0000000000000000000000000000000000000000"
  },
  localhost: {
    name: "localhost",
    chainId: 31337,
    rpcUrl: "http://localhost:8545",
    gatewayUrl: "http://localhost:3000"
  },
  custom: {
    name: "custom",
    chainId: 0,
    rpcUrl: "",
    gatewayUrl: ""
  }
};
function getNetworkConfig(network) {
  const config = NETWORK_CONFIGS[network];
  if (!config) {
    throw new NetworkError(`Unknown network: ${network}`);
  }
  return { ...config };
}
function validateNetworkConfig(config) {
  if (!config.chainId || config.chainId <= 0) {
    throw new NetworkError("Invalid chainId");
  }
  if (!config.rpcUrl || !isValidUrl(config.rpcUrl)) {
    throw new NetworkError("Invalid RPC URL");
  }
  if (!config.gatewayUrl || !isValidUrl(config.gatewayUrl)) {
    throw new NetworkError("Invalid gateway URL");
  }
}
function mergeNetworkConfig(network, customConfig) {
  const baseConfig = getNetworkConfig(network);
  const merged = { ...baseConfig, ...customConfig };
  validateNetworkConfig(merged);
  return merged;
}
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
function getChainId(network) {
  return getNetworkConfig(network).chainId;
}
function getGatewayUrl(network) {
  return getNetworkConfig(network).gatewayUrl;
}
function isSupportedNetwork(network) {
  return network in NETWORK_CONFIGS;
}

// src/core/instance.ts
async function createFhevmInstance(config) {
  try {
    const networkConfig = parseNetworkConfig(config);
    const fhevmjsInstance = await createInstance({
      networkUrl: networkConfig.rpcUrl,
      gatewayUrl: networkConfig.gatewayUrl,
      aclAddress: networkConfig.aclAddress,
      chainId: networkConfig.chainId
    });
    const publicKey = fhevmjsInstance.getPublicKey();
    return {
      instance: fhevmjsInstance,
      config: networkConfig,
      ready: true,
      publicKey: publicKey || void 0
    };
  } catch (error) {
    throw new FhevmError(`Failed to create FHEVM instance: ${error}`);
  }
}
function parseNetworkConfig(config) {
  if (typeof config.network === "string") {
    const baseConfig = getNetworkConfig(config.network);
    const merged = {
      ...baseConfig,
      ...config.gatewayUrl && { gatewayUrl: config.gatewayUrl },
      ...config.chainId && { chainId: config.chainId }
    };
    validateNetworkConfig(merged);
    return merged;
  }
  const networkConfig = config.network;
  validateNetworkConfig(networkConfig);
  return networkConfig;
}
async function getDefaultProvider(config) {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const network = await browserProvider.getNetwork();
      if (Number(network.chainId) !== config.chainId) {
        throw new NetworkError(
          `Connected wallet is on chain ${network.chainId}, expected ${config.chainId}`
        );
      }
      return browserProvider;
    } catch (error) {
      console.warn("Browser provider not available or wrong network:", error);
    }
  }
  return new JsonRpcProvider(config.rpcUrl, config.chainId);
}
async function getSigner(instance, provider) {
  const targetProvider = provider || await getDefaultProvider(instance.config);
  if ("getSigner" in targetProvider && typeof targetProvider.getSigner === "function") {
    return await targetProvider.getSigner();
  }
  throw new FhevmError("Provider does not support getting signer");
}
function isInstanceReady(instance) {
  return instance !== null && instance.ready;
}
function getPublicKey(instance) {
  if (!instance.publicKey) {
    const key = instance.instance.getPublicKey();
    instance.publicKey = key || void 0;
  }
  if (!instance.publicKey) {
    throw new FhevmError("Public key not available");
  }
  return instance.publicKey;
}
async function reinitializeInstance(currentInstance, newConfig) {
  const mergedConfig = {
    network: currentInstance.config,
    ...newConfig
  };
  return await createFhevmInstance(mergedConfig);
}

// src/utils/validation.ts
var INPUT_TO_ENCRYPTED_TYPE = {
  bool: "ebool",
  uint8: "euint8",
  uint16: "euint16",
  uint32: "euint32",
  uint64: "euint64",
  uint128: "euint128",
  uint256: "euint256",
  address: "eaddress",
  bytes: "ebytes256"
};
var MAX_VALUES = {
  uint8: BigInt(2 ** 8 - 1),
  uint16: BigInt(2 ** 16 - 1),
  uint32: BigInt(2 ** 32 - 1),
  uint64: BigInt(2 ** 64 - 1),
  uint128: BigInt(2 ** 128 - 1),
  uint256: BigInt(2) ** BigInt(256) - BigInt(1)
};
function validateEncryptionInput(value, type) {
  if (type === "bool") {
    if (typeof value !== "boolean") {
      throw new ValidationError(`Expected boolean for type 'bool', got ${typeof value}`);
    }
    return;
  }
  if (type === "address") {
    if (typeof value !== "string") {
      throw new ValidationError(`Expected string for type 'address', got ${typeof value}`);
    }
    if (!isValidAddress(value)) {
      throw new ValidationError(`Invalid Ethereum address: ${value}`);
    }
    return;
  }
  if (type === "bytes") {
    if (typeof value !== "string") {
      throw new ValidationError(`Expected string for type 'bytes', got ${typeof value}`);
    }
    if (!isValidHex(value)) {
      throw new ValidationError(`Invalid hex string for bytes: ${value}`);
    }
    return;
  }
  if (typeof value === "boolean") {
    throw new ValidationError(`Expected numeric value for type '${type}', got boolean`);
  }
  const numericValue = toBigInt(value);
  const maxValue = MAX_VALUES[type];
  if (!maxValue) {
    throw new ValidationError(`Unknown numeric type: ${type}`);
  }
  if (numericValue < BigInt(0)) {
    throw new ValidationError(`Value must be non-negative for type '${type}'`);
  }
  if (numericValue > maxValue) {
    throw new ValidationError(
      `Value ${numericValue} exceeds maximum for type '${type}' (max: ${maxValue})`
    );
  }
}
function toBigInt(value) {
  try {
    if (typeof value === "bigint") {
      return value;
    }
    if (typeof value === "number") {
      if (!Number.isInteger(value)) {
        throw new ValidationError("Decimal numbers not supported");
      }
      return BigInt(value);
    }
    if (typeof value === "string") {
      return BigInt(value);
    }
    throw new ValidationError(`Cannot convert ${typeof value} to BigInt`);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(`Failed to convert value to BigInt: ${error}`);
  }
}
function isValidAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}
function isValidHex(hex) {
  return /^0x[0-9a-fA-F]*$/.test(hex);
}
function getEncryptedType(inputType) {
  const encryptedType = INPUT_TO_ENCRYPTED_TYPE[inputType];
  if (!encryptedType) {
    throw new ValidationError(`Unknown input type: ${inputType}`);
  }
  return encryptedType;
}
function validateContractAddress(address) {
  if (!isValidAddress(address)) {
    throw new ValidationError(`Invalid contract address: ${address}`);
  }
}
function validateHandle(handle) {
  if (!handle || typeof handle !== "string") {
    throw new ValidationError("Handle must be a non-empty string");
  }
  if (!isValidHex(handle) && !/^[0-9a-fA-F]+$/.test(handle)) {
    throw new ValidationError(`Invalid handle format: ${handle}`);
  }
}
function normalizeValue(value, type) {
  if (type === "bool") {
    return Boolean(value);
  }
  if (type === "address") {
    const addr = String(value).toLowerCase();
    if (!addr.startsWith("0x")) {
      return "0x" + addr;
    }
    return addr;
  }
  if (type === "bytes") {
    const hex = String(value).toLowerCase();
    if (!hex.startsWith("0x")) {
      return "0x" + hex;
    }
    return hex;
  }
  return value;
}

// src/core/encryption.ts
async function encryptValue(instance, value, type) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateEncryptionInput(value, type);
  const normalized = normalizeValue(value, type);
  try {
    const encrypted = await encryptWithFhevmjs(instance, normalized, type);
    return {
      data: encrypted,
      type,
      encryptedType: getEncryptedType(type)
    };
  } catch (error) {
    throw new EncryptionError(`Failed to encrypt ${type}: ${error}`);
  }
}
async function encryptWithFhevmjs(instance, value, type) {
  const fhevmInstance = instance.instance;
  switch (type) {
    case "bool":
      return fhevmInstance.encrypt_bool(value);
    case "uint8":
      return fhevmInstance.encrypt_uint8(Number(value));
    case "uint16":
      return fhevmInstance.encrypt_uint16(Number(value));
    case "uint32":
      return fhevmInstance.encrypt_uint32(Number(value));
    case "uint64":
      return fhevmInstance.encrypt_uint64(BigInt(value));
    case "uint128":
      return fhevmInstance.encrypt_uint128(BigInt(value));
    case "uint256":
      return fhevmInstance.encrypt_uint256(BigInt(value));
    case "address":
      return fhevmInstance.encrypt_address(value);
    case "bytes":
      return fhevmInstance.encrypt_bytes256(value);
    default:
      throw new EncryptionError(`Unsupported encryption type: ${type}`);
  }
}
async function encryptBatch(instance, values) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  try {
    const encrypted = await Promise.all(
      values.map(({ value, type }) => encryptValue(instance, value, type))
    );
    return encrypted;
  } catch (error) {
    throw new EncryptionError(`Batch encryption failed: ${error}`);
  }
}
function toContractInput(encrypted) {
  return encrypted.data;
}
function toHex(encrypted) {
  return "0x" + Array.from(encrypted.data).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function getEncryptedSize(encrypted) {
  return encrypted.data.length;
}
function areEncryptedValuesEqual(a, b) {
  if (a.data.length !== b.data.length) {
    return false;
  }
  for (let i = 0; i < a.data.length; i++) {
    if (a.data[i] !== b.data[i]) {
      return false;
    }
  }
  return true;
}

// src/core/decryption.ts
async function requestDecryption(instance, contractAddress, handle, type) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  validateHandle(handle);
  try {
    if (!instance.instance.decrypt) {
      throw new DecryptionError("Decryption not supported by this instance");
    }
    const result = await instance.instance.decrypt(contractAddress, handle);
    return parseDecryptionResult(result, type);
  } catch (error) {
    throw new DecryptionError(`Failed to decrypt value: ${error}`);
  }
}
async function requestDecryptionWithSignature(instance, contractAddress, handle, signature, type) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  validateHandle(handle);
  try {
    if (!instance.instance.decrypt) {
      throw new DecryptionError("Decryption not supported by this instance");
    }
    const result = await instance.instance.decrypt(contractAddress, handle, signature);
    return parseDecryptionResult(result, type);
  } catch (error) {
    throw new DecryptionError(`Failed to decrypt with signature: ${error}`);
  }
}
async function requestBatchDecryption(instance, requests) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  try {
    const results = await Promise.all(
      requests.map(
        ({ contractAddress, handle, type }) => requestDecryption(instance, contractAddress, handle, type)
      )
    );
    return results;
  } catch (error) {
    throw new DecryptionError(`Batch decryption failed: ${error}`);
  }
}
function parseDecryptionResult(result, type) {
  if (type === void 0) {
    return result;
  }
  switch (type) {
    case "ebool":
      return Boolean(result);
    case "euint4":
    case "euint8":
    case "euint16":
    case "euint32":
      return Number(result);
    case "euint64":
    case "euint128":
    case "euint256":
      return BigInt(result);
    case "eaddress":
      return String(result);
    case "ebytes64":
    case "ebytes128":
    case "ebytes256":
      return String(result);
    default:
      return result;
  }
}
async function waitForDecryption(instance, contractAddress, handle, options = {}) {
  const { timeout = 6e4, interval = 1e3, type } = options;
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      const result = await requestDecryption(instance, contractAddress, handle, type);
      return result;
    } catch (error) {
      if (error instanceof DecryptionError && error.message.includes("not ready")) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        continue;
      }
      throw error;
    }
  }
  throw new DecryptionError(`Decryption timeout after ${timeout}ms`);
}
async function isDecryptionReady(instance, contractAddress, handle) {
  try {
    await requestDecryption(instance, contractAddress, handle);
    return true;
  } catch (error) {
    return false;
  }
}

// src/core/permissions.ts
async function generatePermission(instance, contractAddress, userAddress) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  try {
    const signer = await getSigner(instance);
    const address = userAddress || await signer.getAddress();
    if (!isValidAddress(address)) {
      throw new PermissionError(`Invalid user address: ${address}`);
    }
    if (!instance.instance.generatePermitSignature) {
      throw new PermissionError("Permission signature generation not supported by this instance");
    }
    const signature = await instance.instance.generatePermitSignature(contractAddress, address);
    return signature;
  } catch (error) {
    throw new PermissionError(`Failed to generate permission: ${error}`);
  }
}
async function requestPermission(instance, contractAddress, handle) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  try {
    throw new PermissionError("ACL-based permissions not yet implemented");
  } catch (error) {
    throw new PermissionError(`Failed to request permission: ${error}`);
  }
}
async function checkPermission(instance, contractAddress, handle, userAddress) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  try {
    const signer = await getSigner(instance);
    const address = userAddress || await signer.getAddress();
    return true;
  } catch (error) {
    return false;
  }
}
async function grantPermission(instance, contractAddress, targetAddress, handle) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  if (!isValidAddress(targetAddress)) {
    throw new PermissionError(`Invalid target address: ${targetAddress}`);
  }
  try {
    throw new PermissionError("Permission granting not yet implemented");
  } catch (error) {
    throw new PermissionError(`Failed to grant permission: ${error}`);
  }
}
async function revokePermission(instance, contractAddress, targetAddress, handle) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  if (!isValidAddress(targetAddress)) {
    throw new PermissionError(`Invalid target address: ${targetAddress}`);
  }
  try {
    throw new PermissionError("Permission revocation not yet implemented");
  } catch (error) {
    throw new PermissionError(`Failed to revoke permission: ${error}`);
  }
}
async function getPermittedAddresses(instance, contractAddress, handle) {
  if (!instance || !instance.ready) {
    throw new FhevmNotReadyError();
  }
  validateContractAddress(contractAddress);
  try {
    return [];
  } catch (error) {
    throw new PermissionError(`Failed to get permitted addresses: ${error}`);
  }
}

export { DecryptionError, EncryptionError, FhevmError, FhevmNotReadyError, INPUT_TO_ENCRYPTED_TYPE, NETWORK_CONFIGS, NetworkError, PermissionError, ValidationError, areEncryptedValuesEqual, checkPermission, createFhevmInstance, encryptBatch, encryptValue, generatePermission, getChainId, getEncryptedSize, getEncryptedType, getGatewayUrl, getNetworkConfig, getPermittedAddresses, getPublicKey, getSigner, grantPermission, isDecryptionReady, isInstanceReady, isSupportedNetwork, isValidAddress, isValidHex, mergeNetworkConfig, normalizeValue, reinitializeInstance, requestBatchDecryption, requestDecryption, requestDecryptionWithSignature, requestPermission, revokePermission, toBigInt, toContractInput, toHex, validateContractAddress, validateEncryptionInput, validateHandle, validateNetworkConfig, waitForDecryption };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map