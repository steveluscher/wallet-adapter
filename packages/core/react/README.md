# `@solana/wallet-adapter-react`

## Creating a custom connect button

The `useWalletButton()` hook returns the current state of the your web application's wallet connection.

### States

-   `no-wallet` \
    In this state you are neither connected nor is there a wallet selected. Allow your users to select from the list of `wallets`, then call `onSelectWallet()` with the name of the wallet they chose.
-   `disconnected` \
    This state implies that there is a wallet selected, but that your app is not connected to it. Render a connect button that calls `onConnect()` when clicked. At any time you can read from the list of `wallets` and call `onSelectWallet()` to change wallets.
-   `disconnecting` \
    When in this state, the last-connected wallet is in mid-disconnection.
-   `connected` \
    In this state, you have access to the connected `publicKey` and an `onDisconnect()` method that you can call to disconnect from the wallet. At any time you can read from the list of `wallets` and call `onSelectWallet()` to change wallets.
-   `connecting` \
    When in this state, the wallet is in mid-connection.

### Example

```ts
function CustomConnectButton() {
    const [walletModalState, setWalletModalState] = useState<Readonly<{
        onSelectWallet(walletName: WalletName): void;
        wallets: Wallet[];
    }> | null>(null);
    const walletButtonState = useWalletButton();
    const { walletState } = walletButtonState;
    let label;
    switch (walletState) {
        case 'connected':
            label = 'Disconnect';
            break;
        case 'connecting':
            label = 'Connecting';
            break;
        case 'disconnected':
            label = 'Connect';
            break;
        case 'disconnecting':
            label = 'Disconnecting';
            break;
        case 'no-wallet':
            label = 'Select Wallet';
            break;
    }
    const handleClick = useCallback(() => {
        switch (walletState) {
            case 'connected':
                return walletButtonState.onDisconnect();
            case 'disconnected':
                return walletButtonState.onConnect();
            case 'connecting':
            case 'disconnecting':
                break;
            case 'no-wallet':
                setWalletModalState(walletButtonState);
                break;
        }
    }, [walletButtonState, walletState]);
    return (
        <>
            <button disabled={walletState === 'connecting' || walletState === 'disconnecting'} onClick={handleClick}>
                {label}
            </button>
            {walletModalState ? (
                <Modal>
                    {walletModalState.wallets.map((wallet) => (
                        <button
                            key={wallet.adapter.name}
                            onClick={() => {
                                walletModalState.onSelectWallet(wallet.adapter.name);
                                setWalletModalState(null);
                            }}
                        >
                            {wallet.adapter.name}
                        </button>
                    ))}
                </Modal>
            ) : null}
        </>
    );
}
```
