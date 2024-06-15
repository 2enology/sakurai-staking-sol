import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js'

export interface GlobalPool {
    admin: PublicKey,
}

export interface UserPool {
    owner: PublicKey,
    itemCount: anchor.BN,
    items: StakedNFT[],
    rewardTime: anchor.BN,
    pendingReward: anchor.BN,
}

export interface StakedNFT {
    nftAddr: PublicKey,
    stakeTime: anchor.BN,
    rewardTime: anchor.BN,
    lockTime: anchor.BN,
    rate: anchor.BN,
}