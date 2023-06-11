import type { Wallet } from '@solana/wallet-adapter-react';
import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import React from 'react';
import { WalletIcon } from './WalletIcon.js';

type Props = ButtonProps &
    Readonly<{
        wallet?: Wallet;
    }>;

export function WalletButtonBase({
    htmlType = 'button',
    size = 'large',
    type = 'primary',
    wallet,
    ...buttonProps
}: Props) {
    return (
        <Button
            {...buttonProps}
            htmlType={htmlType}
            icon={wallet ? <WalletIcon wallet={wallet} /> : undefined}
            size={size}
            type={type}
        />
    );
}
