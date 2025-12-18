<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  size: 'medium',
})

// 多链地址配置
const WALLET_ADDRESSES = {
  ethereum: '0x859b52373fb6a83bb9e622492bC19D566f5Eb2fe',
  polygon: '0x859b52373fb6a83bb9e622492bC19D566f5Eb2fe',
  solana: '58meNUBkVnCpqh2Tosk3YSFUNBd57AsTqeXp8YnLoiuK',
}

// 链配置
const CHAINS = {
  ethereum: {
    id: '0x1',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'i-simple-icons-ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorer: 'https://etherscan.io',
  },
  polygon: {
    id: '0x89',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: 'i-simple-icons-polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: 'i-simple-icons-solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
  },
}

const isConnecting = ref(false)
const isConnected = ref(false)
const userAddress = ref('')
const tipAmount = ref('0.01')
const selectedChain = ref<keyof typeof CHAINS>('ethereum')
const txHash = ref('')
const error = ref('')
const isSending = ref(false)

// 检查是否安装了钱包
const hasWallet = computed(() => {
  if (typeof window === 'undefined') return false
  
  if (selectedChain.value === 'solana') {
    return typeof (window as any).solana !== 'undefined'
  }
  return typeof (window as any).ethereum !== 'undefined'
})

// 当前链配置
const currentChain = computed(() => CHAINS[selectedChain.value])

// 当前接收地址
const recipientAddress = computed(() => WALLET_ADDRESSES[selectedChain.value])

// 切换链
async function switchChain(chain: keyof typeof CHAINS) {
  selectedChain.value = chain
  
  // 如果已连接，断开重连
  if (isConnected.value) {
    disconnectWallet()
  }
  
  error.value = ''
  txHash.value = ''
}

// 连接钱包
async function connectWallet() {
  if (!hasWallet.value) {
    if (selectedChain.value === 'solana') {
      error.value = '请先安装 Phantom 钱包'
      window.open('https://phantom.app/', '_blank')
    } else {
      error.value = '请先安装 MetaMask 钱包'
      window.open('https://metamask.io/', '_blank')
    }
    return
  }

  try {
    isConnecting.value = true
    error.value = ''
    
    if (selectedChain.value === 'solana') {
      await connectSolana()
    } else {
      await connectEVM()
    }
  } catch (err: any) {
    error.value = err.message || '连接钱包失败'
    console.error('连接钱包错误:', err)
  } finally {
    isConnecting.value = false
  }
}

// 连接 Solana (Phantom)
async function connectSolana() {
  const solana = (window as any).solana
  
  if (!solana?.isPhantom) {
    throw new Error('请使用 Phantom 钱包')
  }
  
  const response = await solana.connect()
  userAddress.value = response.publicKey.toString()
  isConnected.value = true
}

// 连接 EVM 链 (MetaMask)
async function connectEVM() {
  const ethereum = (window as any).ethereum
  
  // 请求账户
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  
  if (accounts.length === 0) {
    throw new Error('未找到账户')
  }
  
  userAddress.value = accounts[0]
  
  // 检查并切换网络
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currentChain.value.id }],
    })
  } catch (switchError: any) {
    // 如果网络不存在，尝试添加
    if (switchError.code === 4902) {
      await addNetwork()
    } else {
      throw switchError
    }
  }
  
  isConnected.value = true
}

// 添加网络到 MetaMask
async function addNetwork() {
  const ethereum = (window as any).ethereum
  const chain = currentChain.value
  
  if (selectedChain.value === 'polygon') {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: chain.id,
        chainName: chain.name,
        nativeCurrency: {
          name: chain.symbol,
          symbol: chain.symbol,
          decimals: 18,
        },
        rpcUrls: [chain.rpcUrl],
        blockExplorerUrls: [chain.explorer],
      }],
    })
  }
}

// 发送打赏
async function sendTip() {
  if (!isConnected.value) {
    await connectWallet()
    return
  }

  try {
    isSending.value = true
    error.value = ''
    txHash.value = ''
    
    if (selectedChain.value === 'solana') {
      await sendSolanaTip()
    } else {
      await sendEVMTip()
    }
  } catch (err: any) {
    if (err.code === 4001) {
      error.value = '用户取消了交易'
    } else {
      error.value = err.message || '打赏失败'
    }
    console.error('打赏错误:', err)
  } finally {
    isSending.value = false
  }
}

// 发送 Solana 打赏
async function sendSolanaTip() {
  const solana = (window as any).solana
  
  // 动态导入 Solana Web3.js
  const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = await import('@solana/web3.js')
  
  const connection = new Connection(currentChain.value.rpcUrl, 'confirmed')
  const fromPubkey = new PublicKey(userAddress.value)
  const toPubkey = new PublicKey(recipientAddress.value)
  
  const lamports = Math.floor(parseFloat(tipAmount.value) * LAMPORTS_PER_SOL)
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  )
  
  transaction.feePayer = fromPubkey
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  
  const signed = await solana.signTransaction(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize())
  
  txHash.value = signature
}

// 发送 EVM 打赏
async function sendEVMTip() {
  const ethereum = (window as any).ethereum
  
  // 将金额转换为 Wei
  const amountInWei = `0x${(parseFloat(tipAmount.value) * 1e18).toString(16)}`
  
  const transactionParameters = {
    from: userAddress.value,
    to: recipientAddress.value,
    value: amountInWei,
    gas: '0x5208', // 21000 gas
  }
  
  const txHashResult = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  })
  
  txHash.value = txHashResult
}

// 断开钱包
function disconnectWallet() {
  isConnected.value = false
  userAddress.value = ''
  txHash.value = ''
  error.value = ''
}

// 格式化地址显示
function formatAddress(address: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 获取浏览器链接
function getExplorerLink(hash: string) {
  const explorer = currentChain.value.explorer
  if (selectedChain.value === 'solana') {
    return `${explorer}/tx/${hash}`
  }
  return `${explorer}/tx/${hash}`
}

// 预设金额
const presetAmounts = ['0.01', '0.05', '0.1', '0.5']
</script>

<template>
  <div class="web3-tip-container" :class="`size-${size}`">
    <!-- 成功提示 -->
    <div v-if="txHash" class="success-message glass-card">
      <div class="success-icon" i-ri-check-line />
      <div>
        <div class="success-title">打赏成功！感谢支持 🎉</div>
        <a 
          :href="getExplorerLink(txHash)" 
          target="_blank" 
          class="tx-link"
        >
          查看交易: {{ formatAddress(txHash) }}
          <span i-ri-external-link-line ml-1 />
        </a>
        <button class="reset-button" @click="txHash = ''">
          再次打赏
        </button>
      </div>
    </div>

    <!-- 主界面 -->
    <div v-else class="tip-card glass-card">
      <div v-if="showLabel" class="tip-header">
        <span class="tip-icon" i-ri-coin-line />
        <span class="tip-title">Web3 打赏</span>
      </div>

      <!-- 链选择 -->
      <div class="chain-selector">
        <button
          v-for="(chain, key) in CHAINS"
          :key="key"
          class="chain-button"
          :class="{ active: selectedChain === key }"
          @click="switchChain(key as keyof typeof CHAINS)"
        >
          <span :class="chain.icon" />
          <span>{{ chain.name }}</span>
        </button>
      </div>

      <!-- 未连接状态 -->
      <div v-if="!isConnected" class="connect-section">
        <button 
          class="connect-button"
          :disabled="isConnecting || !hasWallet"
          @click="connectWallet"
        >
          <span v-if="isConnecting" i-ri-loader-4-line class="animate-spin" />
          <span v-else-if="selectedChain === 'solana'" i-simple-icons-solana />
          <span v-else i-simple-icons-metamask />
          <span>
            {{ isConnecting ? '连接中...' : `连接 ${selectedChain === 'solana' ? 'Phantom' : 'MetaMask'}` }}
          </span>
        </button>
        
        <div v-if="!hasWallet" class="warning-message">
          <span i-ri-error-warning-line />
          <span>
            请先安装 
            <a 
              :href="selectedChain === 'solana' ? 'https://phantom.app' : 'https://metamask.io'" 
              target="_blank"
            >
              {{ selectedChain === 'solana' ? 'Phantom' : 'MetaMask' }}
            </a>
          </span>
        </div>
      </div>

      <!-- 已连接状态 -->
      <div v-else class="tip-section">
        <div class="connected-info">
          <span class="connected-badge">
            <span i-ri-checkbox-circle-fill class="text-green-500" />
            已连接
          </span>
          <span class="user-address">{{ formatAddress(userAddress) }}</span>
          <button class="disconnect-button" @click="disconnectWallet" title="断开连接">
            <span i-ri-logout-box-line />
          </button>
        </div>

        <!-- 金额选择 -->
        <div class="amount-section">
          <label class="amount-label">打赏金额</label>
          <div class="amount-input-group">
            <input 
              v-model="tipAmount" 
              type="number" 
              step="0.01" 
              min="0.001"
              class="amount-input"
              placeholder="0.01"
            />
            <span class="token-badge">{{ currentChain.symbol }}</span>
          </div>
          
          <div class="preset-amounts">
            <button
              v-for="amount in presetAmounts"
              :key="amount"
              class="preset-button"
              :class="{ active: tipAmount === amount }"
              @click="tipAmount = amount"
            >
              {{ amount }} {{ currentChain.symbol }}
            </button>
          </div>
        </div>

        <!-- 发送按钮 -->
        <button 
          class="send-button" 
          :disabled="isSending"
          @click="sendTip"
        >
          <span v-if="isSending" i-ri-loader-4-line class="animate-spin" />
          <span v-else i-ri-send-plane-fill />
          <span>{{ isSending ? '发送中...' : '发送打赏' }}</span>
        </button>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        <span i-ri-error-warning-line />
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.web3-tip-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.tip-card,
.success-message {
  padding: 1.5rem;
  margin: 1rem 0;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.tip-icon {
  font-size: 1.5rem;
  color: #f59e0b;
}

/* 链选择器 */
.chain-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.chain-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chain-button span:first-child {
  font-size: 1.5rem;
}

.chain-button:hover {
  background: var(--glass-bg-hover);
}

.chain-button.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #3b82f6;
  font-weight: 600;
}

.connect-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.connect-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connect-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.connect-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.connect-button span:first-child {
  font-size: 1.5rem;
}

.warning-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #f59e0b;
}

.tip-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.connected-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.connected-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
}

.user-address {
  flex: 1;
  font-family: monospace;
  opacity: 0.8;
}

.disconnect-button {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.disconnect-button:hover {
  opacity: 1;
}

.amount-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.amount-label {
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.8;
}

.amount-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 0.5rem;
}

.amount-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
  font-weight: 600;
  color: inherit;
}

.token-badge {
  padding: 0.25rem 0.75rem;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
}

.preset-amounts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.preset-button {
  padding: 0.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-button:hover {
  background: var(--glass-bg-hover);
}

.preset-button.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #3b82f6;
  font-weight: 600;
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.success-message {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.success-icon {
  font-size: 2rem;
  color: #10b981;
}

.success-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.tx-link {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-family: monospace;
  color: #3b82f6;
  text-decoration: none;
  transition: opacity 0.2s;
  margin-bottom: 0.75rem;
}

.tx-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.reset-button {
  padding: 0.5rem 1rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background: var(--glass-bg-hover);
}

/* Size variants */
.size-small .tip-card {
  padding: 1rem;
}

.size-small .tip-header {
  font-size: 0.95rem;
}

.size-large .tip-card {
  padding: 2rem;
}

.size-large .tip-header {
  font-size: 1.25rem;
}

/* Dark mode adjustments */
html.dark .amount-input {
  color: #fff;
}

html.dark .token-badge {
  background: rgba(59, 130, 246, 0.3);
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 640px) {
  .web3-tip-container {
    max-width: 100%;
  }
  
  .preset-amounts {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chain-selector {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
