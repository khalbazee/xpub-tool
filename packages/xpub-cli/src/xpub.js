#!/usr/bin/env node

import {
  NETWORKS,
  isValidAddress,
  isValidExtPubKey,
  addressFromExtPubKey,
  addressesFromExtPubKey,
  Purpose,
} from "@swan-bitcoin/xpub-lib"

import { version } from "../package.json"

function parsePurpose(purpose) {
  switch (purpose.toLowerCase()) {
    case "p2pkh": {
      return Purpose.P2PKH
    }
    case "p2sh": {
      return Purpose.P2SH
    }
    case "p2wpkh": {
      return Purpose.P2WPKH
    }
    default: {
      return undefined
    }
  }
}

const { program } = require("commander")

program.version(`${version}`)

program
  .command("derive [extPubKey]")
  .description("derive address(es) from an extended public key")
  .option(
    "-p, --purpose <purpose>",
    "derivation purpose which dictates the address type ['p2pkh', 'p2sh', 'p2wpkh']",
    "p2wpkh"
  ) // use `choices` once this feature is released: https://github.com/tj/commander.js/issues/518
  .option(
    "-n, --addressCount <addressCount>",
    "number of addresses to generate",
    1
  )
  .option(
    "-c, --accountNumber <accountNumber>",
    "the account number as defined in BIP 44",
    0
  )
  .option(
    "-i, --keyIndex <keyIndex>",
    "index of the address to generate (ignored if `addressCount` is set)",
    0
  )
  .option("-t, --testnet", "use TESTNET")
  .option("-v, --verbose", "verbose output")
  .action((extPubKey, cmdObj) => {
    if (!extPubKey) {
      cmdObj.help()
    }

    const network = cmdObj.testnet ? NETWORKS.TESTNET : NETWORKS.MAINNET
    if (!isValidExtPubKey(extPubKey, network)) {
      console.error(`error: invalid extended public key '${extPubKey}'`)
      process.exitCode = 1
      return
    }

    const purpose = cmdObj.purpose
      ? parsePurpose(cmdObj.purpose)
      : Purpose.P2WPKH // default to P2WPKH
    const keyIndex = cmdObj.keyIndex ? cmdObj.keyIndex : 0 // default to P2WPKH
    const accountNumber = cmdObj.accountNumber ? cmdObj.accountNumber : 0 // default to P2WPKH

    if (cmdObj.addressCount > 1) {
      // Multiple addresses
      const { addressCount } = cmdObj
      const addresses = addressesFromExtPubKey({
        extPubKey,
        addressCount,
        accountNumber,
        purpose,
        network,
      })
      console.log(addresses)
    } else {
      // Single address
      const address = addressFromExtPubKey({
        extPubKey,
        accountNumber,
        keyIndex,
        purpose,
        network,
      })
      if (cmdObj.verbose) console.log(address)
      console.log(address.address)
    }
  })

program
  .command("validate [encoded]")
  .description(
    "check an encoded bitcoin address or extended public key for validity"
  )
  .option("-a, --check-address", "check bitcoin address for validity")
  .option("-x, --check-ext", "check extended public key for validity")
  .option("-t, --testnet", "use TESTNET")
  .option("-v, --verbose", "verbose output")
  .action((encoded, cmdObj) => {
    if (!encoded) {
      cmdObj.help()
    }

    const network = cmdObj.testnet ? NETWORKS.TESTNET : NETWORKS.MAINNET
    let isValid = false
    let type = ""
    if (cmdObj.checkAddress) {
      isValid = isValidAddress(encoded, network)
      type = "address"
    } else if (cmdObj.checkExt) {
      isValid = isValidExtPubKey(encoded, network)
      type = "extPubKey"
    } else {
      isValid =
        isValidExtPubKey(encoded, network) || isValidAddress(encoded, network)
    }

    if (cmdObj.verbose) {
      console.log(`${isValid ? "valid" : "invalid"} ${type} ${encoded}`)
    }
    process.exitCode = isValid ? 0 : 1
  })

program.parse(process.argv)
