import { FC } from 'react'

import { Amounts, AmountsProps } from './Amounts'
import { Custom, CustomProps } from './Custom'
import { Network, NetworkProps } from './Network'
import { ApproveERC20, ApproveERC20Props } from './ApproveERC20'
import { Connect } from './Connect'
import { ButtonProps } from '@sushiswap/ui/future/components/button'
import { ApproveBentobox, ApproveBentoboxProps } from './ApproveBentobox'
import { Success, SuccessProps } from './Success'
import { CheckerProvider as Root, ProviderProps } from './Provider'

export type CheckerProps = {
  Amounts: FC<AmountsProps>
  Network: FC<NetworkProps>
  Custom: FC<CustomProps>
  ApproveERC20: FC<ApproveERC20Props>
  Connect: FC<ButtonProps<'button'>>
  ApproveBentobox: FC<ApproveBentoboxProps>
  Success: FC<SuccessProps>
  Root: FC<ProviderProps>
}

export const Checker: CheckerProps = { Amounts, Connect, Network, Custom, ApproveERC20, ApproveBentobox, Success, Root }
