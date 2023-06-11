import type { FC, MouseEvent } from 'react';
import React, { useCallback } from 'react';
import type { ButtonProps } from './Button.js';
import { WalletButtonBase } from './WalletButtonBase.js';
import { useWalletModal } from './useWalletModal.js';

export const WalletModalButton: FC<ButtonProps> = ({ children = 'Select Wallet', onClick, ...props }) => {
    const { visible, setVisible } = useWalletModal();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) setVisible(!visible);
        },
        [onClick, setVisible, visible]
    );

    return (
        <WalletButtonBase {...props} onClick={handleClick}>
            {children}
        </WalletButtonBase>
    );
};
