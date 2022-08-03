//@ts-nocheck
import * as React from 'react'
import Dialog from 'components/Dialog'
import { visuallyHidden } from '@mui/utils'
import { styles } from './styles'
import { formatAddress, formatDateTime } from 'utils/helpers'
import { COLORS_DARK_THEME } from 'theme/colors'
import { NO_TX_HASH_MSG } from 'utils/constants'
import { TxTypeComponent } from 'utils/TxTypeHandler'
import ClockIcon from 'assets/vectors/clock-icon.svg'
import MembersIcon from 'assets/vectors/members-icon.svg'
import { ProposalStatusComponent } from 'utils/proposalStatusHandler'
import ProposalDetails from 'components/Dialog/ProposalDetails'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

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
  Collapse,
  IconButton,
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
  date: Date,
  status: string,
  votesCount: number,
  membersCount: number,
  proposalID: number,
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
    label: 'Height',
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
              idx === 0 ? 100 :
                idx === 1 ? 140 :
                  idx === 2 ? 175 :
                    idx === 3 ? 210 :
                      idx === 4 ? 185 :
                        idx === 5 ? 50 :
                          idx === 6 ? 20 :
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

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props
  const [open, setOpen] = React.useState(false)

  return (
    <Box>
      <Box style={{ margin: '9px 0' }}>
        <Box
          onClick={() => setOpen(!open)}
          key={row.date}
          sx={styles.selectableBox}
        >

          <TableCell width={70}>
            {row.blockHeight}
          </TableCell>

          <TableCell width={170} align="left">
            <TxTypeComponent type={row.type!.toString()} />
          </TableCell>

          <TableCell style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE }} width={150} align="left">
            {row.txHash === NO_TX_HASH_MSG ? row.txHash :
              <Tooltip title={row.txHash}>
                <div style={{ color: COLORS_DARK_THEME.PRIMARY_BLUE }} >
                  {formatAddress(row.txHash!.toString(), 9)}
                </div>
              </Tooltip>
            }
          </TableCell>

          <TableCell width={220} align="left">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <img style={styles.clockIcon} src={ClockIcon} alt={`Clock logo`} />
              <Typography variant='subtitle2' color="text.secondary" fontWeight={600}>
                {formatDateTime(row.date?.toString()!)}
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
              <ProposalStatusComponent status={row.status!.toString()} />
            </Box>
          </TableCell>
          <TableCell width={50}>
            <IconButton
              size="small"
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

        </Box>
        <Collapse in={open} timeout='auto'>
          <ProposalDetails proposalID={row.proposalID!} />
        </Collapse>
      </Box>

    </Box>

  )
}

export default function TransactionsTable({ fetchedData }: { fetchedData: TableData[] }) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof TableData>('date');

  const rows: TableData[] = [];
  if (fetchedData.length > 0) {
    for (const data of fetchedData) {
      rows.push(createData(
        data.blockHeight!,
        data.type!,
        data.txHash!,
        data.date!,
        data.status!,
        data.votesCount!,
        data.membersCount!,
        data.proposalID!
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

  return (
    <Box>
      <Dialog />
      <TableContainer style={styles.tableContainer}>
        <Table
          aria-labelledby="tableTitle"
          size='medium'
          sx={{
            marginTop: '10px',
            width: '100%',
            maxHeight: '100%'
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
                  <Row key={row.proposalID} row={row} />
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
