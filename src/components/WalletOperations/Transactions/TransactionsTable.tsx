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
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

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
  TableFooter,
  Pagination,
  PaginationItem,
  Stack
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
    width: 100
  },
  {
    id: 'type',
    numeric: false,
    label: 'Type',
    width: 140
  },
  {
    id: 'txHash',
    numeric: false,
    label: 'Transaction Hash',
    width: 175
  },
  {
    id: 'date',
    numeric: false,
    label: 'Date',
    width: 210
  },
  {
    id: 'votesCount',
    numeric: false,
    label: 'Votes',
    width: 185
  },
  {
    id: 'status',
    numeric: false,
    label: 'Status',
    width: 50
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
            width={headCell.width}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === 'date' ?
              <TableSortLabel
                style={styles.enhancedTableHeadCell}
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
              <div style={styles.enhancedTableHeadCell}
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
  const rowRef = React.useRef(row.proposalID)
  const toolTipMsg = row.txHash === NO_TX_HASH_MSG ? '' : row.txHash

  //TODO: Do we need this?
  const autoCenterTheCollapsedRow = () => {
    // setTimeout(() => rowRef.current.scrollIntoView({ behavior: "smooth" }), 350)
  }

  return (
    <TableRow style={{ display: 'flex', flexDirection: 'column', scrollMarginTop: "10px" }} ref={rowRef}>
      <Box
        component={'td'}
        onClick={() => setOpen(!open)}
        key={row.date}
        sx={styles.selectableBox}
      >
        <TableCell component={'span'} style={{width: '70px'}}>
          {row.blockHeight}
        </TableCell>

        <TableCell component={'span'} style={{width: '170px'}}>
          <TxTypeComponent type={row.type!.toString()} />
        </TableCell>

        <TableCell component={'span'}  style={{width: '150px'}}>
          <Tooltip title={toolTipMsg}>
            <Typography style={{ fontSize: '14px', color: COLORS_DARK_THEME.PRIMARY_BLUE }} >
              {row.txHash === NO_TX_HASH_MSG ? NO_TX_HASH_MSG : formatAddress(row.txHash!.toString(), 8)}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell component={'span'}  style={styles.dateHolderCell}>
          <img style={styles.clockIcon} src={ClockIcon} alt={`Clock logo`} />
          {formatDateTime(row.date?.toString()!)}
        </TableCell>

        <TableCell component={'span'}  style={styles.votesCountHolder}>
          <img style={{ width: '20px', marginRight: '10px' }} src={MembersIcon} alt="Members Icon" />
          {`${row.votesCount} of ${row.membersCount}`}
        </TableCell>

        <TableCell component={'span'}  style={{width: '175px'}}>
          <Box style={styles.proposalStatusBox}>
            <ProposalStatusComponent status={row.status!.toString()} />
          </Box>
        </TableCell>

        <TableCell component={'span'}  style={{width: '50px'}}>
          <IconButton
            size="small"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

      </Box>

      <Box component={'td'}>
        <Collapse in={open} timeout='auto' addEndListener={open ? autoCenterTheCollapsedRow : null}>
          <ProposalDetails proposalID={row.proposalID!} />
        </Collapse>
      </Box>

    </TableRow>
  )
}

export default function TransactionsTable({ fetchedData }: { fetchedData: TableData[] }) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof TableData>('date');
  const [page, setPage] = React.useState<number>(0)
  const rowsPerPage: number = 8

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

  const handlePageChange = (event: React.BaseSyntheticEvent, pageNumber: number) => {
    setPage(pageNumber - 1)
  }

  return (
    <Box>
      <Dialog />
      <TableContainer style={styles.tableContainer}>
        <Table
          aria-labelledby="tableTitle"
          size='medium'
          sx={styles.table}
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody style={styles.tableBody}>
            {
              stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <Row key={row.proposalID} row={row} />
                  )
                })}
          </TableBody>
          {
            rows.length > rowsPerPage ?
              <TableFooter>
                <TableRow>
                  <Stack component={'td'} alignItems={'center'} spacing={2}>
                    <Pagination
                      onChange={handlePageChange}
                      count={Math.ceil(rows.length / rowsPerPage)}
                      renderItem={(item) => (
                        <PaginationItem
                          components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                          {...item}
                        />
                      )}
                    />
                  </Stack>
                </TableRow>
              </TableFooter>
              : null
          }
        </Table>
      </TableContainer>
    </Box>
  )
}
