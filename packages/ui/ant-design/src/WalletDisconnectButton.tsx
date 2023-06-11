import { useWalletButton } from '@solana/wallet-adapter-react';
import type { ButtonProps } from 'antd';
import type { FC, MouseEvent } from 'react';
import React, { useCallback, useMemo } from 'react';
import { WalletButtonBase } from './WalletButonBase.js';

export const WalletDisconnectButton: FC<ButtonProps> = ({ children, disabled, onClick, ...props }) => {
    const walletButtonState = useWalletButton();
    const { walletState } = walletButtonState;
    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) {
                if ('onDisconnect' in walletButtonState) {
                    walletButtonState.onDisconnect();
                } else if (walletButtonState.walletState === 'disconnected') {
                    walletButtonState.onSelectWallet(null);
                }
            }
        },
        [onClick, walletButtonState]
    );
    const label = useMemo(() => {
        if (children) return children;
        switch (walletState) {
            case 'disconnecting':
                return 'Disconnecting ...';
            default:
                return 'wallet' in walletButtonState ? 'Disconnect' : 'Disconnect Wallet';
        }
    }, [children, walletButtonState, walletState]);
    return (
        <WalletButtonBase
            {...props}
            disabled={disabled || !('wallet' in walletButtonState)}
            onClick={handleClick}
            wallet={'wallet' in walletButtonState ? walletButtonState.wallet : undefined}
        >
            {label}
        </WalletButtonBase>
    );
};
