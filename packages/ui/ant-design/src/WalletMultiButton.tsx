import {
    CopyOutlined as CopyIcon,
    DisconnectOutlined as DisconnectIcon,
    SwapOutlined as SwitchIcon,
} from '@ant-design/icons';
import { useWalletButton } from '@solana/wallet-adapter-react';
import type { ButtonProps } from 'antd';
import { Dropdown, Menu } from 'antd';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { WalletButtonBase } from './WalletButonBase.js';
import { WalletConnectButton } from './WalletConnectButton.js';
import { WalletModalButton } from './WalletModalButton.js';
import { useWalletModal } from './useWalletModal.js';

export const WalletMultiButton: FC<ButtonProps> = ({
    type = 'primary',
    size = 'large',
    htmlType = 'button',
    children,
    ...props
}) => {
    const walletButtonState = useWalletButton();
    const { setVisible } = useWalletModal();

    const base58 = useMemo(
        () => ('publicKey' in walletButtonState ? walletButtonState.publicKey.toBase58() : null),
        [walletButtonState]
    );
    const content = useMemo(() => {
        if (children) return children;
        if (!base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [base58, children]);

    if (walletButtonState.walletState === 'no-wallet') {
        return (
            <WalletModalButton type={type} size={size} htmlType={htmlType} {...props}>
                {children}
            </WalletModalButton>
        );
    }
    if (!base58) {
        return (
            <WalletConnectButton type={type} size={size} htmlType={htmlType} {...props}>
                {children}
            </WalletConnectButton>
        );
    }
    const wallet = 'wallet' in walletButtonState ? walletButtonState.wallet : undefined;
    return (
        <Dropdown
            overlay={
                <Menu className="wallet-adapter-multi-button-menu">
                    <Menu.Item className="wallet-adapter-multi-button-menu-item">
                        <WalletButtonBase
                            {...props}
                            block
                            className="wallet-adapter-multi-button-menu-button"
                            wallet={wallet}
                        >
                            {wallet?.adapter.name}
                        </WalletButtonBase>
                    </Menu.Item>
                    <Menu.Item
                        onClick={async () => {
                            await navigator.clipboard.writeText(base58);
                        }}
                        icon={<CopyIcon className=".wallet-adapter-multi-button-icon" />}
                        className="wallet-adapter-multi-button-item"
                    >
                        Copy address
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => setTimeout(() => setVisible(true), 100)}
                        icon={<SwitchIcon className=".wallet-adapter-multi-button-icon" />}
                        className="wallet-adapter-multi-button-item"
                    >
                        Change wallet
                    </Menu.Item>
                    {'onDisconnect' in walletButtonState ? (
                        <Menu.Item
                            onClick={walletButtonState.onDisconnect}
                            icon={<DisconnectIcon className=".wallet-adapter-multi-button-icon" />}
                            className="wallet-adapter-multi-button-item"
                        >
                            Disconnect
                        </Menu.Item>
                    ) : null}
                </Menu>
            }
            trigger={['click']}
        >
            <WalletButtonBase {...props} wallet={wallet}>
                {content}
            </WalletButtonBase>
        </Dropdown>
    );
};
