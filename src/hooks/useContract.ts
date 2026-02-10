import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, USDC_ADDRESS, ESCROW_ABI, USDC_ABI } from '@/config/contracts';
import { parseUnits } from 'viem';

export function useApproveUSDC() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = async () => {
    writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, parseUnits('1', 6)],
    });
  };

  return { approve, isPending, isConfirming, isSuccess, hash };
}

export function useCreateGame() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createGame = async (opponent: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'createGame',
      args: [opponent],
    });
  };

  return { createGame, isPending, isConfirming, isSuccess, hash };
}

export function useCreateGameSponsored() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createGameSponsored = async (player1: `0x${string}`, opponent: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'createGameSponsored',
      args: [player1, opponent],
    });
  };

  return { createGameSponsored, isPending, isConfirming, isSuccess, hash };
}

export function useJoinGame() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const joinGame = async (gameId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'joinGame',
      args: [gameId],
    });
  };

  return { joinGame, isPending, isConfirming, isSuccess, hash };
}

export function useJoinGameSponsored() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const joinGameSponsored = async (gameId: bigint, player2: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'joinGameSponsored',
      args: [gameId, player2],
    });
  };

  return { joinGameSponsored, isPending, isConfirming, isSuccess, hash };
}

export function usePayout() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const payout = async (gameId: bigint, winner: `0x${string}`) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ESCROW_ABI,
      functionName: 'payout',
      args: [gameId, winner],
    });
  };

  return { payout, isPending, isConfirming, isSuccess, hash };
}

export function usePlayerStats(address?: `0x${string}`) {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ESCROW_ABI,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
  });

  return {
    wins: data?.[0] || 0n,
    losses: data?.[1] || 0n,
    totalGames: data?.[2] || 0n,
    isLoading,
    refetch,
  };
}

export function useUSDCBalance() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  return {
    balance: data || 0n,
    isLoading,
    refetch,
  };
}

export function useUSDCAllowance() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESS] : undefined,
  });

  return {
    allowance: data || 0n,
    isLoading,
    refetch,
  };
}
