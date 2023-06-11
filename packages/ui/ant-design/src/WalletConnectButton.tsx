import { useWalletButton } from '@solana/wallet-adapter-react';
import type { ButtonProps } from 'antd';
import type { FC, MouseEvent } from 'react';
import React, { useCallback, useMemo } from 'react';
import { WalletButtonBase } from './WalletButonBase.js';

export const WalletConnectButton: FC<ButtonProps> = ({ children, disabled, onClick, ...props }) => {
    const walletButtonState = useWalletButton();
    const { walletState } = walletButtonState;
    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) {
                if ('onConnect' in walletButtonState) {
                    walletButtonState.onConnect();
                }
            }
        },
        [onClick, walletButtonState]
    );
    const label = useMemo(() => {
        if (children) return children;
        switch (walletState) {
            case 'connecting':
                return 'Connecting ...';
            case 'connected':
                return 'Connected';
            default:
                return 'wallet' in walletButtonState ? 'Connect' : 'Connect Wallet';
        }
    }, [children, walletButtonState, walletState]);
    return (
        <WalletButtonBase
            {...props}
            disabled={
                disabled ||
                !('wallet' in walletButtonState) ||
                walletState === 'connected' ||
                walletState === 'connecting'
            }
            onClick={handleClick}
            wallet={'wallet' in walletButtonState ? walletButtonState.wallet : undefined}
        >
            {label}
        </WalletButtonBase>
    );
};
