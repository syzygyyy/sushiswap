import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChevronDoubleDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Button, ButtonProps } from '@sushiswap/ui/future/components/button'
import {
  CoinbaseWalletIcon,
  GnosisSafeIcon,
  MetamaskIcon,
  TrustWalletIcon,
  WalletConnectIcon,
} from '@sushiswap/ui/future/components/icons'
import { List } from '@sushiswap/ui/future/components/list/List'
import { Loader } from '@sushiswap/ui/future/components/Loader'
import React, { Fragment, useCallback, useMemo } from 'react'
import { useConnect } from 'wagmi'
import { classNames } from '@sushiswap/ui'

const Icons: Record<string, React.ElementType> = {
  Injected: ChevronDoubleDownIcon,
  MetaMask: MetamaskIcon,
  'Trust Wallet': TrustWalletIcon,
  WalletConnect: WalletConnectIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Safe: GnosisSafeIcon,
}

export type Props<C extends React.ElementType> = ButtonProps<C> & {
  // TODO ramin: remove param when wagmi adds onConnecting callback to useAccount
  hack?: ReturnType<typeof useConnect>
  hideChevron?: boolean
}

export const ConnectButton = <C extends React.ElementType>({ hack, children, hideChevron, ...rest }: Props<C>) => {
  const { connectors, connect, pendingConnector } = useConnect()

  const onSelect = useCallback(
    (connectorId: string) => {
      return connect({
        connector: connectors.find((el) => el.id === connectorId),
      })
    },
    [connect, connectors]
  )

  const _connectors = useMemo(() => {
    const conns = [...connectors]
    const injected = conns.find((el) => el.id === 'injected')

    if (injected) {
      return [injected, ...conns.filter((el) => el.id !== 'injected' && el.name !== injected.name)]
    }

    return conns
  }, [connectors])

  // Pending confirmation state
  // Awaiting wallet confirmation
  if (pendingConnector) {
    return (
      <Button endIcon={<Loader />} variant="filled" color="blue" disabled {...rest}>
        Authorize Wallet
      </Button>
    )
  }

  return (
    <Popover className={rest.fullWidth ? 'relative w-full' : ''}>
      {({ open }) => (
        <>
          <Popover.Button as={Button} {...rest}>
            <span className="hidden md:block">{children || 'Connect Wallet'}</span>
            <span className="block md:hidden">{children || 'Connect'}</span>
            {!hideChevron && (
              <ChevronDownIcon
                width={24}
                height={24}
                className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
              />
            )}
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition duration-300 ease-out"
            enterFrom="transform translate-y-[-16px] opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform translate-y-[-16px] opacity-0"
          >
            <div
              className={classNames(
                rest.fullWidth ? 'w-full' : 'sm:w-[320px]',
                'z-[1] absolute pt-2 -top-[-1] right-0'
              )}
            >
              <Popover.Panel className="p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                <List.Control className="bg-gray-100 dark:!bg-slate-700">
                  {_connectors.map((connector) => {
                    return (
                      <List.MenuItem
                        onClick={() => onSelect(connector.id)}
                        icon={Icons[connector.name]}
                        title={connector.name == 'Safe' ? 'Gnosis Safe' : connector.name}
                        key={connector.id}
                        hoverIcon={ChevronRightIcon}
                      />
                    )
                  })}
                </List.Control>
              </Popover.Panel>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  )
}
