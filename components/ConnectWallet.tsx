'use client'

import {
  ConnectWallet as OnchainKitConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity'

export function ConnectWallet() {
  return (
    <Wallet>
      <OnchainKitConnectWallet className="!bg-primary !text-white hover:!bg-accent !px-4 !py-2 !text-sm !font-semibold !rounded-lg !shadow-card transition-all duration-200">
        <Avatar className="h-6 w-6" />
        <Name />
      </OnchainKitConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  )
}
