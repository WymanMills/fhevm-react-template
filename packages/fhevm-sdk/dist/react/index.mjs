import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { createInstance } from 'fhevmjs';
import 'ethers';
import { jsx } from 'react/jsx-runtime';

var FhevmContext = createContext(null);
FhevmContext.displayName = "FhevmContext";

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

// src/react/hooks/useFhevm.ts
function useFhevm() {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new FhevmError(
      "useFhevm must be used within FhevmProvider. Wrap your component tree with <FhevmProvider>."
    );
  }
  return {
    instance: context.instance,
    ready: context.ready,
    error: context.error,
    loading: context.loading
  };
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

// src/react/hooks/useEncrypt.ts
function useEncrypt() {
  const { instance, ready } = useFhevm();
  const [encrypting, setEncrypting] = useState(false);
  const [error, setError] = useState(null);
  const encrypt = useCallback(
    async (value, type) => {
      if (!instance || !ready) {
        const err = new Error("FHEVM instance not ready");
        setError(err);
        throw err;
      }
      setEncrypting(true);
      setError(null);
      try {
        const encrypted = await encryptValue(instance, value, type);
        return encrypted;
      } catch (err) {
        const error2 = err instanceof Error ? err : new Error(String(err));
        setError(error2);
        throw error2;
      } finally {
        setEncrypting(false);
      }
    },
    [instance, ready]
  );
  return {
    encrypt,
    encrypting,
    error
  };
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

// src/react/hooks/useDecrypt.ts
function useDecrypt() {
  const { instance, ready } = useFhevm();
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(null);
  const decrypt = useCallback(
    async (contractAddress, handle, type) => {
      if (!instance || !ready) {
        const err = new Error("FHEVM instance not ready");
        setError(err);
        throw err;
      }
      setRequesting(true);
      setError(null);
      try {
        const decrypted = await requestDecryption(instance, contractAddress, handle, type);
        return decrypted;
      } catch (err) {
        const error2 = err instanceof Error ? err : new Error(String(err));
        setError(error2);
        throw error2;
      } finally {
        setRequesting(false);
      }
    },
    [instance, ready]
  );
  return {
    decrypt,
    requesting,
    error
  };
}

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
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
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
function FhevmProvider({ children, network = "sepolia", config }) {
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function initializeFhevm() {
      try {
        setLoading(true);
        setError(null);
        const fhevmConfig = config || { network };
        const fhevmInstance = await createFhevmInstance(fhevmConfig);
        if (!cancelled) {
          setInstance(fhevmInstance);
          setReady(fhevmInstance.ready);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          const error2 = err instanceof Error ? err : new Error(String(err));
          setError(error2);
          setLoading(false);
          setReady(false);
          console.error("Failed to initialize FHEVM:", error2);
        }
      }
    }
    initializeFhevm();
    return () => {
      cancelled = true;
    };
  }, [network, config]);
  const contextValue = useMemo(
    () => ({
      instance,
      ready,
      error,
      loading
    }),
    [instance, ready, error, loading]
  );
  return /* @__PURE__ */ jsx(FhevmContext.Provider, { value: contextValue, children });
}

export { FhevmContext, FhevmProvider, useDecrypt, useEncrypt, useFhevm };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map