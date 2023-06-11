import type { WalletName } from '@solana/wallet-adapter-base';
import type { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import type { Wallet } from './useWallet.js';
import { useWallet } from './useWallet.js';

type WalletButtonState = Readonly<
    | {
          onDisconnect: () => void;
          onSelectWallet: (walletName: WalletName | null) => void;
          publicKey: PublicKey;
          wallet: Wallet;
          wallets: Wallet[];
          walletState: 'connected';
      }
    | { wallet: Wallet; walletState: 'connecting' }
    | {
          onConnect: () => void;
          onSelectWallet: (walletName: WalletName | null) => void;
          wallet: Wallet;
          wallets: Wallet[];
          walletState: 'disconnected';
      }
    | { wallet: Wallet; walletState: 'disconnecting' }
    | { onSelectWallet: (walletName: WalletName) => void; wallets: Wallet[]; walletState: 'no-wallet' }
>;

function invariant<T>(condition: T, message?: string): asserts condition is NonNullable<T> {
    if (!condition) {
        throw new Error(`invariant violation${message ? ': ' + message : ''}`);
    }
}

export function useWalletButton(): WalletButtonState {
    const { connect, connected, connecting, disconnecting, disconnect, publicKey, select, wallet, wallets } =
        useWallet();
    return useMemo<WalletButtonState>(() => {
        let state: WalletButtonState['walletState'];
        if (connected) {
            state = 'connected';
        } else if (connecting) {
            state = 'connecting';
        } else if (disconnecting) {
            state = 'disconnecting';
        } else {
            state = 'disconnected';
        }
        switch (state) {
            case 'connected':
                invariant(publicKey, `Expected a public key while in the \`${state}\` state`);
                invariant(wallet, `Expected a selected wallet while in the \`${state}\` state`);
                return {
                    onDisconnect() {
                        disconnect().catch(() => {
                            // Silently catch because any errors are caught by the context `onError` handler
                        });
                    },
                    onSelectWallet(walletName: WalletName | null) {
                        select(walletName);
                    },
                    publicKey,
                    wallet,
                    wallets,
                    walletState: 'connected',
                };
            case 'connecting': {
                invariant(wallet, `Expected a selected wallet while in the \`${state}\` state`);
                return {
                    wallet,
                    walletState: 'connecting',
                };
            }
            case 'disconnected': {
                if (wallet) {
                    return {
                        onConnect() {
                            connect().catch(() => {
                                // Silently catch because any errors are caught by the context `onError` handler
                            });
                        },
                        onSelectWallet(walletName: WalletName | null) {
                            select(walletName);
                        },
                        wallet,
                        wallets,
                        walletState: 'disconnected',
                    };
                } else {
                    return {
                        onSelectWallet(walletName: WalletName) {
                            select(walletName);
                        },
                        wallets,
                        walletState: 'no-wallet',
                    };
                }
            }
            case 'disconnecting': {
                invariant(wallet, `Expected a selected wallet while in the \`${state}\` state`);
                return {
                    wallet,
                    walletState: 'disconnecting',
                };
            }
        }
    }, [connect, connected, connecting, disconnect, disconnecting, publicKey, select, wallet, wallets]);
}
