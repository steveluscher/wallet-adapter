import type { Wallet } from '@solana/wallet-adapter-react';
import React from 'react';
import type { ButtonProps } from './Button.js';
import { Button } from './Button.js';
import { WalletIcon } from './WalletIcon.js';

type Props = ButtonProps &
    Readonly<{
        wallet?: Wallet;
    }>;

export function WalletButtonBase({ wallet, ...buttonProps }: Props) {
    return (
        <Button
            {...buttonProps}
            className="wallet-adapter-button-trigger"
            startIcon={wallet ? <WalletIcon wallet={wallet} /> : undefined}
        />
    );
}
