import {
    // FIXME(https://github.com/mui/material-ui/issues/35233)
    FileCopy as CopyIcon,
    // FIXME(https://github.com/mui/material-ui/issues/35233)
    LinkOff as DisconnectIcon,
    // FIXME(https://github.com/mui/material-ui/issues/35233)
    SwapHoriz as SwitchIcon,
} from '@mui/icons-material';
import type { ButtonProps, Theme } from '@mui/material';
import { Collapse, Fade, ListItemIcon, Menu, MenuItem, styled } from '@mui/material';
import { useWalletButton } from '@solana/wallet-adapter-react';
import type { FC } from 'react';
import React, { useMemo, useState } from 'react';
import { useWalletDialog } from './useWalletDialog.js';
import { WalletConnectButton } from './WalletConnectButton.js';
import { WalletDialogButton } from './WalletDialogButton.js';
import { WalletButtonBase } from './WalletButtonBase.js';

const StyledMenu = styled(Menu)(({ theme }: { theme: Theme }) => ({
    '& .MuiList-root': {
        padding: 0,
    },
    '& .MuiListItemIcon-root': {
        marginRight: theme.spacing(),
        minWidth: 'unset',
        '& .MuiSvgIcon-root': {
            width: 20,
            height: 20,
        },
    },
}));

const WalletActionMenuItem = styled(MenuItem)(({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(1, 2),
    boxShadow: 'inset 0 1px 0 0 ' + 'rgba(255, 255, 255, 0.1)',

    '&:hover': {
        boxShadow: 'inset 0 1px 0 0 ' + 'rgba(255, 255, 255, 0.1)' + ', 0 1px 0 0 ' + 'rgba(255, 255, 255, 0.05)',
    },
}));

const WalletMenuItem = styled(WalletActionMenuItem)(({ theme }: { theme: Theme }) => ({
    padding: 0,

    '& .MuiButton-root': {
        borderRadius: 0,
    },
}));

export const WalletMultiButton: FC<ButtonProps> = ({ children, ...props }) => {
    const walletButtonState = useWalletButton();
    const { setOpen } = useWalletDialog();
    const [anchor, setAnchor] = useState<HTMLElement>();

    const base58 = useMemo(
        () => ('publicKey' in walletButtonState ? walletButtonState.publicKey.toBase58() : null),
        [walletButtonState]
    );
    const content = useMemo(() => {
        if (children) return children;
        if (!base58) return null;
        return base58.slice(0, 4) + '..' + base58.slice(-4);
    }, [children, base58]);

    if (walletButtonState.walletState === 'no-wallet') {
        return <WalletDialogButton {...props}>{children}</WalletDialogButton>;
    }
    if (!base58) {
        return <WalletConnectButton {...props}>{children}</WalletConnectButton>;
    }
    const wallet = 'wallet' in walletButtonState ? walletButtonState.wallet : undefined;
    return (
        <>
            <WalletButtonBase
                {...props}
                aria-controls="wallet-menu"
                aria-haspopup="true"
                onClick={(event) => setAnchor(event.currentTarget)}
                wallet={wallet}
            >
                {content}
            </WalletButtonBase>
            <StyledMenu
                id="wallet-menu"
                anchorEl={anchor}
                open={!!anchor}
                onClose={() => setAnchor(undefined)}
                marginThreshold={0}
                TransitionComponent={Fade}
                transitionDuration={250}
                keepMounted
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <WalletMenuItem onClick={() => setAnchor(undefined)}>
                    <WalletButtonBase {...props} fullWidth onClick={() => setAnchor(undefined)} wallet={wallet}>
                        {wallet?.adapter.name}
                    </WalletButtonBase>
                </WalletMenuItem>
                <Collapse in={!!anchor}>
                    <WalletActionMenuItem
                        onClick={async () => {
                            setAnchor(undefined);
                            await navigator.clipboard.writeText(base58);
                        }}
                    >
                        <ListItemIcon>
                            <CopyIcon />
                        </ListItemIcon>
                        Copy address
                    </WalletActionMenuItem>
                    <WalletActionMenuItem
                        onClick={() => {
                            setAnchor(undefined);
                            setOpen(true);
                        }}
                    >
                        <ListItemIcon>
                            <SwitchIcon />
                        </ListItemIcon>
                        Change wallet
                    </WalletActionMenuItem>
                    {'onDisconnect' in walletButtonState ? (
                        <WalletActionMenuItem
                            onClick={() => {
                                setAnchor(undefined);
                                walletButtonState.onDisconnect();
                            }}
                        >
                            <ListItemIcon>
                                <DisconnectIcon />
                            </ListItemIcon>
                            Disconnect
                        </WalletActionMenuItem>
                    ) : null}
                </Collapse>
            </StyledMenu>
        </>
    );
};
