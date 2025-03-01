import { ChevronDoubleDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import {
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  MetamaskIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from '@sushiswap/ui/future/components/icons'
import { List } from '@sushiswap/ui/future/components/list/List'
import React, { FC, SVGProps, useCallback, useMemo } from 'react'
import { useConnect } from 'wagmi'

const Icons: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element | null> = {
  Injected: ChevronDoubleDownIcon,
  MetaMask: MetamaskIcon,
  'Trust Wallet': TrustWalletIcon,
  WalletConnect: WalletConnectIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Safe: GnosisSafeIcon,
}

export const ConnectView: FC<{ onSelect(): void }> = ({ onSelect }) => {
  const { connectors, connect } = useConnect()

  const _connectors = useMemo(() => {
    const conns = [...connectors]
    const injected = conns.find((el) => el.id === 'injected')

    if (injected) {
      return [injected, ...conns.filter((el) => el.id !== 'injected' && el.name !== injected.name)]
    }

    return conns
  }, [connectors])

  const _onSelect = useCallback(
    (connectorId: string) => {
      onSelect()
      setTimeout(
        () =>
          connect({
            connector: _connectors.find((el) => el.id === connectorId),
          }),
        250
      )
    },
    [connect, _connectors, onSelect]
  )

  return (
    <List className="!p-0">
      {/* <List.Label>Wallet</List.Label> */}
      <List.Control className="bg-gray-100 dark:!bg-slate-700">
        {_connectors.map((connector) => (
          <List.MenuItem
            onClick={() => _onSelect(connector.id)}
            icon={Icons[connector.name]}
            title={connector.name == 'Safe' ? 'Gnosis Safe' : connector.name}
            key={connector.id}
            hoverIcon={ChevronRightIcon}
          />
        ))}
      </List.Control>
    </List>
  )
}
