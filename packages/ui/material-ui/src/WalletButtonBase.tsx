import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import type { Wallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { WalletIcon } from './WalletIcon.js';

type Props = ButtonProps &
    Readonly<{
        wallet?: Wallet;
    }>;

export function WalletButtonBase({
    color = 'primary',
    variant = 'contained',
    type = 'button',
    wallet,
    ...buttonProps
}: Props) {
    return (
        <Button
            {...buttonProps}
            color={color}
            variant={variant}
            type={type}
            startIcon={wallet ? <WalletIcon wallet={wallet} /> : undefined}
        />
    );
}
