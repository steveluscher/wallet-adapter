import { useWalletButton } from '@solana/wallet-adapter-react';
import type { FC } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ButtonProps } from './Button.js';
import { WalletButtonBase } from './WalletButtonBase.js';
import { WalletConnectButton } from './WalletConnectButton.js';
import { WalletModalButton } from './WalletModalButton.js';
import { useWalletModal } from './useWalletModal.js';

export const WalletMultiButton: FC<ButtonProps> = ({ children, ...props }) => {
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const ref = useRef<HTMLUListElement>(null);

    const onSelectWallet = useCallback(() => {
        setDropdownOpen(false);
        setVisible(true);
    }, [setVisible]);

    const walletButtonState = useWalletButton();

    const base58 = useMemo(
        () => ('publicKey' in walletButtonState ? walletButtonState.publicKey.toBase58() : null),
        [walletButtonState]
    );
    const content = useMemo(() => {
        if (children) return children;
        if (!base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [base58, children]);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const node = ref.current;

            // Do nothing if clicking dropdown or its descendants
            if (!node || node.contains(event.target as Node)) return;

            setDropdownOpen(false);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref]);

    if (walletButtonState.walletState === 'no-wallet') {
        return <WalletModalButton {...props}>{children}</WalletModalButton>;
    }
    if (!base58) return <WalletConnectButton {...props}>{children}</WalletConnectButton>;

    return (
        <div className="wallet-adapter-dropdown">
            <WalletButtonBase
                {...props}
                aria-expanded={dropdownOpen}
                style={{ pointerEvents: dropdownOpen ? 'none' : 'auto', ...props.style }}
                onClick={() => setDropdownOpen(true)}
                wallet={'wallet' in walletButtonState ? walletButtonState.wallet : undefined}
            >
                {content}
            </WalletButtonBase>
            <ul
                aria-label="dropdown-list"
                className={`wallet-adapter-dropdown-list ${dropdownOpen && 'wallet-adapter-dropdown-list-active'}`}
                ref={ref}
                role="menu"
            >
                <li
                    onClick={async () => {
                        await navigator.clipboard.writeText(base58);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 400);
                    }}
                    className="wallet-adapter-dropdown-list-item"
                    role="menuitem"
                >
                    {copied ? 'Copied' : 'Copy address'}
                </li>
                <li onClick={onSelectWallet} className="wallet-adapter-dropdown-list-item" role="menuitem">
                    Change wallet
                </li>
                {'onDisconnect' in walletButtonState ? (
                    <li
                        onClick={walletButtonState.onDisconnect}
                        className="wallet-adapter-dropdown-list-item"
                        role="menuitem"
                    >
                        Disconnect
                    </li>
                ) : null}
            </ul>
        </div>
    );
};
