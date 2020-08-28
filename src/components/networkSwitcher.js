import React from "react"
import { Button, ButtonGroup } from "react-bootstrap"
import { MAINNET, TESTNET } from "unchained-bitcoin"

const NETWORKS = [MAINNET, TESTNET]

const NetworkSwitcher = ({ network, onClick }) => {
  return (
    <ButtonGroup size="lg" className="mb-2">
      {NETWORKS.map(net => {
        return (
          <Button
            key={net}
            value={net}
            variant={net === network ? "secondary" : "outline-secondary"}
            size="sm"
            onClick={onClick}
          >
            {net}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}

export default NetworkSwitcher
