//@ts-nocheck
import * as React from 'react';
import copy from 'copy-to-clipboard'
import { visuallyHidden } from '@mui/utils'
import { useDispatch } from 'react-redux'
import { styles } from './styles'
import { formatAddress } from 'utils/helpers'
import { COLORS_DARK_THEME } from 'theme/colors'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'
import trashbinIcon from 'assets/vectors/gray-trashbin-icon.svg'
import { DELETE_MEMBER_TYPE_URL } from 'utils/constants'
import { CopyAndFollowComponent } from 'components/Dialog/ReusableModal/helpers'

import {
  Order,
  stableSort,
  getComparator,
  HeadCell,
  TableData,
  createData,
  EnhancedTableProps
} from 'utils/tableSortingHelper'

import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel
} from '@mui/material'


const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    label: 'Name',
  },
  {
    id: 'address',
    numeric: false,
    label: 'Address',
  },
  {
    id: 'action',
    numeric: false,
    label: 'Action',
  },
]

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort!(event, property);
    }

  return (
    <TableHead style={styles.tableHead}>
      <TableRow style={styles.headRow}>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            align='left'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {idx === 0 ?
              <TableSortLabel
                style={{ color: COLORS_DARK_THEME.SECONDARY_TEXT, width: "155px" }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
              :
              <div style={{
                color: COLORS_DARK_THEME.SECONDARY_TEXT,
                position: 'relative',
                left: headCell.id === 'address' ? '-180px' : 'default'
              }}
              >
                {headCell.label}
              </div>}
          </TableCell>
        ))}
        <></>
      </TableRow>
    </TableHead>
  );
}

export default function MembersTable({ fetchedData }: { fetchedData: TableData[] }) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof TableData>('name');
  const [copied, setCopied] = React.useState<boolean>(false)
  const dispatch = useDispatch()

  const rows: TableData[] = [];
  if (fetchedData.length > 0) {
    for (const data of fetchedData) {
      rows.push(createData(
        data.name,
        data.address,
        ''
      ))
    }
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCopy = (value: string) => {
    copy(value)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const startDeleteMemberProposal = (address: string) => {
    dispatch(updateModalState({
      openReusableModal: true,
      dataObject: {
        memberAddress: address,
        msgType: DELETE_MEMBER_TYPE_URL,
        walletMembers: fetchedData
      }
    }))
  }

  const handleAddPredefinedAddress = (predefinedAddr: string) => {
    dispatch(updateModalState({
      openAddressBook: true,
      addNewAddress: true,
      predefinedAddr: predefinedAddr
    }))
  }

  const userNameHandler = (userName: string, predefinedAddr?: string) => {
    if (!userName && predefinedAddr) {
      return (
        <Button
          variant="outlined"
          color="primary"
          sx={styles.addToWalletBtn}
          onClick={() => handleAddPredefinedAddress(predefinedAddr)}
        >
          Add to Wallet
        </Button>
      )
    }

    if (userName.length > 24) {
      return (
        <Tooltip title={userName}>
          <div>
            {formatAddress(userName, 12)}
          </div>
        </Tooltip>
      )
    }

    return userName
  }

  return (
    <Box>
      <Dialog />
      <TableContainer style={styles.tableContainer}>
        <Table
          aria-labelledby="tableTitle"
          size='medium'
          sx={{
            marginTop: '15px',
            width: '100%'
          }}
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody style={styles.tableBody}>
            {stableSort(rows, getComparator(order, orderBy))
              .map((row) => {
                return (
                  <TableRow style={styles.bodyRow} key={row.address}>
                    <TableCell width={170} align='center'>
                      {userNameHandler(row.name, row.address)}
                    </TableCell>
                    <TableCell style={styles.addressHolderCell} align="left">
                      {row.address}
                      <CopyAndFollowComponent address={row.address} />
                    </TableCell>
                    <TableCell>
                      {/* COMMENTING OUT EDITING OPTION FOR A WALLET MEMBER */}
                      {/* <Tooltip
                        title={`Create EDIT MEMBER proposal`}>
                        <img
                          style={styles.icons}
                          src={editIcon}
                          alt="Edit icon" />
                      </Tooltip> */}
                      <Tooltip
                        title={`Create DELETE MEMBER proposal`}>
                        <img
                          style={{ ...styles.icons, marginRight: '5px' }}
                          src={trashbinIcon}
                          onClick={() => startDeleteMemberProposal(row.address.toString())}
                          alt="Trashbin icon" />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
