---
title: 智能合约开发实战 - 从 Solidity 基础到 DApp 部署
date: 2024-12-16
description: 深入学习 Solidity 智能合约开发，包含完整的代码示例和最佳实践
tags: [web3, blockchain, solidity, ethereum]
---

# 智能合约开发实战

智能合约是运行在区块链上的程序，一旦部署就无法修改。本文将带你从零开始学习 Solidity 开发，并构建一个完整的 DApp。

## Solidity 基础

### 数据类型

Solidity 是静态类型语言，常用的数据类型包括：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DataTypes {
    // 值类型
    bool public isActive = true;
    uint256 public count = 100;        // 无符号整数
    int256 public temperature = -10;   // 有符号整数
    address public owner;              // 以太坊地址
    bytes32 public hash;               // 固定大小字节数组
    
    // 引用类型
    string public name = "AimerFeng";
    uint256[] public numbers;          // 动态数组
    mapping(address => uint256) public balances;  // 映射
    
    // 枚举
    enum Status { Pending, Active, Completed }
    Status public status;
    
    // 结构体
    struct User {
        string name;
        uint256 balance;
        bool isVerified;
    }
    
    User[] public users;
}
```

### 函数修饰符

```solidity
contract Modifiers {
    address public owner;
    bool public paused;
    
    constructor() {
        owner = msg.sender;
    }
    
    // 自定义修饰符
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    // 使用修饰符
    function withdraw() external onlyOwner whenNotPaused {
        // 只有 owner 在合约未暂停时才能调用
        payable(owner).transfer(address(this).balance);
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
}
```

## 实战项目：ERC20 代币

让我们实现一个标准的 ERC20 代币合约：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract MyToken is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 private _totalSupply;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    constructor(string memory _name, string memory _symbol, uint256 initialSupply) {
        name = _name;
        symbol = _symbol;
        _mint(msg.sender, initialSupply * 10 ** decimals);
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "ERC20: insufficient allowance");
        
        unchecked {
            _approve(from, msg.sender, currentAllowance - amount);
        }
        
        _transfer(from, to, amount);
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(_balances[from] >= amount, "ERC20: insufficient balance");
        
        unchecked {
            _balances[from] -= amount;
            _balances[to] += amount;
        }
        
        emit Transfer(from, to, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from zero address");
        require(spender != address(0), "ERC20: approve to zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to zero address");
        
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}
```

## 安全最佳实践

### 1. 重入攻击防护

```solidity
contract ReentrancyGuard {
    bool private _locked;
    
    modifier nonReentrant() {
        require(!_locked, "ReentrancyGuard: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }
}

contract SecureVault is ReentrancyGuard {
    mapping(address => uint256) public balances;
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    
    // 使用 nonReentrant 防止重入攻击
    function withdraw() external nonReentrant {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance");
        
        // 先更新状态，再转账（Checks-Effects-Interactions 模式）
        balances[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
    }
}
```

### 2. 整数溢出保护

Solidity 0.8+ 默认检查溢出，但了解原理很重要：

```solidity
contract SafeMath {
    // Solidity 0.8+ 自动检查溢出
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;  // 溢出会自动 revert
    }
    
    // 如果需要不检查溢出（节省 gas）
    function uncheckedAdd(uint256 a, uint256 b) public pure returns (uint256) {
        unchecked {
            return a + b;  // 不检查溢出
        }
    }
}
```

### 3. 访问控制

```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        // 只有 MINTER_ROLE 可以调用
    }
    
    function setConfig(uint256 value) external onlyRole(ADMIN_ROLE) {
        // 只有 ADMIN_ROLE 可以调用
    }
}
```

## 开发工具链

### Hardhat 配置

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### 部署脚本

```javascript
// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy("AimerToken", "AFT", 1000000);
  
  await token.waitForDeployment();
  
  console.log("Token deployed to:", await token.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### 测试用例

```javascript
// test/MyToken.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const MyToken = await ethers.getContractFactory("MyToken");
    token = await MyToken.deploy("AimerToken", "AFT", 1000000);
  });

  describe("Deployment", function () {
    it("Should set the right owner balance", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("AimerToken");
      expect(await token.symbol()).to.equal("AFT");
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, 50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);

      await token.connect(addr1).transfer(addr2.address, 50);
      expect(await token.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialBalance = await token.balanceOf(owner.address);
      
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: insufficient balance");

      expect(await token.balanceOf(owner.address)).to.equal(initialBalance);
    });
  });
});
```

## 前端集成

使用 ethers.js 与合约交互：

```typescript
import { ethers } from 'ethers'
import MyTokenABI from './MyToken.json'

const CONTRACT_ADDRESS = '0x...'

async function connectAndInteract() {
  // 连接钱包
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  
  // 创建合约实例
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    MyTokenABI.abi,
    signer
  )
  
  // 读取数据
  const balance = await contract.balanceOf(signer.address)
  console.log('Balance:', ethers.formatEther(balance))
  
  // 发送交易
  const tx = await contract.transfer(
    '0x...recipient',
    ethers.parseEther('10')
  )
  await tx.wait()
  console.log('Transfer successful!')
}
```

## Gas 优化技巧

1. **使用 `calldata` 代替 `memory`**
2. **打包存储变量**
3. **使用 `unchecked` 块**
4. **避免循环中的存储操作**
5. **使用事件代替存储**

```solidity
// Gas 优化示例
contract GasOptimized {
    // 打包存储 - 这些变量会被打包到一个 slot
    uint128 public value1;
    uint128 public value2;
    
    // 使用 calldata 节省 gas
    function processData(uint256[] calldata data) external pure returns (uint256) {
        uint256 sum;
        uint256 length = data.length;  // 缓存长度
        
        for (uint256 i; i < length; ) {
            unchecked {
                sum += data[i];
                ++i;  // 前置递增更省 gas
            }
        }
        return sum;
    }
}
```

## 总结

智能合约开发需要特别注意安全性，因为一旦部署就无法修改。建议：

- ✅ 始终进行充分的测试
- ✅ 使用经过审计的库（如 OpenZeppelin）
- ✅ 在测试网充分测试后再部署主网
- ✅ 考虑进行专业的安全审计

下一篇文章，我们将探讨 AI Agent 开发，看看如何将 AI 与 Web3 结合！

---

<div class="mt-8 p-4 glass-card">
  <p class="text-sm op-75">
    🔗 完整代码已开源在 GitHub，欢迎 Star 和 Fork！
  </p>
</div>
