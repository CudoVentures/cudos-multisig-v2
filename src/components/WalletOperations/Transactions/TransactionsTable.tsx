//@ts-nocheck
import * as React from 'react';
import { visuallyHidden } from '@mui/utils'
import { styles } from './styles'
import { formatAddress } from 'utils/helpers'
import { COLORS_DARK_THEME } from 'theme/colors'
import ClockIcon from 'assets/vectors/clock-icon.svg'
import MembersIcon from 'assets/vectors/members-icon.svg'
import { NO_TX_HASH_MSG } from 'utils/constants'
import { TX_HASH_DETAILS } from 'api/endpoints'
import { ProposalStatusComponent } from 'utils/proposalStatusHandler'
import { TxTypeComponent } from 'utils/TxTypeHandler'
import { useDispatch } from 'react-redux'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
  Typography,
} from '@mui/material'

import { 
  HeadCell, 
  Order, 
  stableSort, 
  getComparator, 
  TableData 
} from 'utils/tableSortingHelper'

function createData(
  blockHeight: string,
  type: string,
  txHash: string,
  date: string,
  status: string,
  votesCount: number,
  membersCount: number,
  proposalID: number
): TableData {
  return {
    blockHeight,
    type,
    txHash,
    date,
    status,
    votesCount,
    membersCount,
    proposalID
  }
}

const headCells: readonly HeadCell[] = [
  {
    id: 'blockHeight',
    numeric: false,
    label: 'Block Height',
  },
  {
    id: 'type',
    numeric: false,
    label: 'Type',
  },
  {
    id: 'txHash',
    numeric: false,
    label: 'Transaction Hash',
  },
  {
    id: 'date',
    numeric: false,
    label: 'Date',
  },
  {
    id: 'votesCount',
    numeric: false,
    label: 'Votes',
  },
  {
    id: 'status',
    numeric: false,
    label: 'Status',
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TableData) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    }

  return (
    <TableHead style={styles.tableHead}>
      <TableRow style={styles.tableRow}>
        {headCells.map((headCell, idx) => (
          <TableCell
            width={(
              idx === 0 ? 135 :
                idx === 1 ? 125 :
                  idx === 2 ? 200 :
                    idx === 3 ? 205 :
                      idx === 4 ? 175 :
                        100)}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {idx === 3 ?
              <TableSortLabel
                style={{ color: COLORS_DARK_THEME.SECONDARY_TEXT }}
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
              }}
              >
                {headCell.label}
              </div>}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TransactionsTable({ fetchedData }: { fetchedData: TableData[] }) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof TableData>('date');
  const dispatch = useDispatch()

  const rows: TableData[] = [];
  if (fetchedData.length > 0) {
    for (const data of fetchedData) {
      rows.push(createData(
        data.blockHeight,
        data.type,
        data.txHash,
        data.date,
        data.status,
        data.votesCount,
        data.membersCount,
        data.proposalID
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
  }

  const openDetails = (proposalID: number) => {
    dispatch(updateModalState({ 
      showProposalDetails: true,
      dataObject: {
        proposalID: proposalID
      } 
    }))
  }

  return (
    <Box>
      <Dialog />
      <TableContainer style={styles.tableContainer}>
        <Table
          aria-labelledby="tableTitle"
          size='medium'
          sx={{
            marginTop: '10px',
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
              .map((row, index) => {

                return (
                  <Box
                    onClick={() => openDetails(row.proposalID)}
                    key={row.date}
                    sx={styles.selectableBox}
                  >

                    <TableCell width={100}>
                      {row.blockHeight}
                    </TableCell>

                    <TableCell width={150} align="left">
                      <TxTypeComponent type={row.type.toString()} />
                    </TableCell>

                    <TableCell style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE }} width={170} align="left">
                      {row.txHash === NO_TX_HASH_MSG ? row.txHash :
                        <a
                          style={{ textDecoration: 'none' }}
                          href={TX_HASH_DETAILS(row.txHash.toString())}
                          target='_blank'
                        >
                          <Tooltip title={row.txHash}>
                            <div style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE }} >
                              {formatAddress(row.txHash.toString(), 9)}
                            </div>
                          </Tooltip>
                        </a>
                      }
                    </TableCell>

                    <TableCell width={210} align="left">
                      <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <img style={styles.clockIcon} src={ClockIcon} alt={`Clock logo`} />
                        <Typography variant='subtitle2' color="text.secondary" fontWeight={600}>
                          {row.date}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="left" width={120}>
                      <Box style={styles.votesBox}>
                        <img style={{ width: '20px' }} src={MembersIcon} alt="Members Icon" />
                        <Typography style={{ margin: '0 10px' }} variant="inherit" color="text.secondary">
                          {`${row.votesCount} of ${row.membersCount}`}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell width={175}>
                      <Box style={styles.proposalStatusBox}>
                        <ProposalStatusComponent status={row.status.toString()} />
                      </Box>
                    </TableCell>

                  </Box>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
