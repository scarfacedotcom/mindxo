export const CONTRACT_ADDRESS = '0x82BebE878aeab67408a1db6F4953D69Fdb492990'; // MindXO Escrow on Base
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base USDC

export const USDC_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_from", "type": "address"},
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transferFrom",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
]

export const ESCROW_ABI = [{"inputs":[{"internalType":"address","name":"_paymaster","type":"address"},{"internalType":"address","name":"_usdc","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"GameCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":true,"internalType":"address","name":"player1","type":"address"},{"indexed":true,"internalType":"address","name":"player2","type":"address"}],"name":"GameCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":true,"internalType":"address","name":"player2","type":"address"}],"name":"GameJoined","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"},{"indexed":true,"internalType":"address","name":"player","type":"address"}],"name":"SponsoredEntry","type":"event"},{"inputs":[],"name":"CREATOR","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CREATOR_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ENTRY_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAYMASTER","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"USDC","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WINNER_PAYOUT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"opponent","type":"address"}],"name":"createGame","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"player1","type":"address"},{"internalType":"address","name":"opponent","type":"address"}],"name":"createGameSponsored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"gameCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"games","outputs":[{"internalType":"address","name":"player1","type":"address"},{"internalType":"address","name":"player2","type":"address"},{"internalType":"uint256","name":"pot","type":"uint256"},{"internalType":"bool","name":"active","type":"bool"},{"internalType":"bool","name":"completed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"getGame","outputs":[{"components":[{"internalType":"address","name":"player1","type":"address"},{"internalType":"address","name":"player2","type":"address"},{"internalType":"uint256","name":"pot","type":"uint256"},{"internalType":"bool","name":"active","type":"bool"},{"internalType":"bool","name":"completed","type":"bool"}],"internalType":"struct TicTacToeEscrow.Game","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"getLeaderboard","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getPlayerStats","outputs":[{"internalType":"uint256","name":"_wins","type":"uint256"},{"internalType":"uint256","name":"_losses","type":"uint256"},{"internalType":"uint256","name":"_total","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"}],"name":"joinGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"address","name":"player2","type":"address"}],"name":"joinGameSponsored","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"losses","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gameId","type":"uint256"},{"internalType":"address","name":"winner","type":"address"}],"name":"payout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalGames","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wins","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}] as const;
