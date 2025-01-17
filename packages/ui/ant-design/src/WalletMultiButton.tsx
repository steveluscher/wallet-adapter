import {
    CopyOutlined as CopyIcon,
    DisconnectOutlined as DisconnectIcon,
    SwapOutlined as SwitchIcon,
} from '@ant-design/icons';
import type { ButtonProps } from 'antd';
import { Dropdown, Menu } from 'antd';
import React, { useMemo } from 'react';

import { useWalletMultiButton } from '@solana/wallet-adapter-react';
import { BaseWalletConnectionButton } from './BaseWalletConnectionButton.js';
import { useWalletModal } from './useWalletModal.js';

export function WalletMultiButton({ children, ...props }: ButtonProps) {
    const { setVisible: setModalVisible } = useWalletModal();
    const { buttonState, onConnect, onDisconnect, publicKey, walletIcon, walletName } = useWalletMultiButton({
        onSelectWallet() {
            setModalVisible(true);
        },
    });
    const content = useMemo(() => {
        if (children) {
            return children;
        } else if (buttonState === 'connecting') {
            return 'Connecting ...';
        } else if (publicKey) {
            const base58 = publicKey.toBase58();
            return base58.slice(0, 4) + '..' + base58.slice(-4);
        } else if (buttonState === 'has-wallet') {
            return 'Connect';
        } else {
            return 'Select Wallet';
        }
    }, [buttonState, children, publicKey]);
    return (
        <Dropdown
            overlay={
                <Menu className="wallet-adapter-multi-button-menu">
                    <Menu.Item className="wallet-adapter-multi-button-menu-item">
                        <BaseWalletConnectionButton
                            {...props}
                            block
                            className="wallet-adapter-multi-button-menu-button"
                            walletIcon={walletIcon}
                            walletName={walletName}
                        >
                            {walletName}
                        </BaseWalletConnectionButton>
                    </Menu.Item>
                    {publicKey ? (
                        <Menu.Item
                            className="wallet-adapter-multi-button-item"
                            icon={<CopyIcon className=".wallet-adapter-multi-button-icon" />}
                            onClick={async () => {
                                await navigator.clipboard.writeText(publicKey?.toBase58());
                            }}
                        >
                            Copy address
                        </Menu.Item>
                    ) : null}
                    <Menu.Item
                        onClick={() => setTimeout(() => setModalVisible(true), 100)}
                        icon={<SwitchIcon className=".wallet-adapter-multi-button-icon" />}
                        className="wallet-adapter-multi-button-item"
                    >
                        Change wallet
                    </Menu.Item>
                    {onDisconnect ? (
                        <Menu.Item
                            onClick={onDisconnect}
                            icon={<DisconnectIcon className=".wallet-adapter-multi-button-icon" />}
                            className="wallet-adapter-multi-button-item"
                        >
                            Disconnect
                        </Menu.Item>
                    ) : null}
                </Menu>
            }
            trigger={buttonState === 'connected' ? ['click'] : []}
        >
            <BaseWalletConnectionButton
                {...props}
                onClick={() => {
                    switch (buttonState) {
                        case 'no-wallet':
                            setModalVisible(true);
                            break;
                        case 'has-wallet':
                            if (onConnect) {
                                onConnect();
                            }
                            break;
                    }
                }}
                walletIcon={walletIcon}
                walletName={walletName}
            >
                {content}
            </BaseWalletConnectionButton>
        </Dropdown>
    );
}
