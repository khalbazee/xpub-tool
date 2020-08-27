import React from "react"
import { Table } from "react-bootstrap"
import { maskXPub } from "../lib/xpub.js"

const DerivedAddressesTable = props => {
  const showCount = props.showCount || props.addressList.length
  return (
    <Table bordered>
      <thead>
        <tr>
          <th>
            Addresses for <code>{maskXPub(props.xpub)}</code>
          </th>
        </tr>
      </thead>
      <tbody>
        {props.addressList.map(({ path, address }, i) => {
          return (
            i < showCount && (
              <PathAddressRow key={path} path={path} address={address} />
            )
          )
        })}
        <PathAddressRow path="..." address="..." />
      </tbody>
    </Table>
  )
}

const PathAddressRow = props => (
  <tr>
    <td>
      <span title={props.path}>{props.address}</span>
    </td>
  </tr>
)

export default DerivedAddressesTable