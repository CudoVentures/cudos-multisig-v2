import * as React from 'react';
import { 
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
import copy from 'copy-to-clipboard'
import { visuallyHidden } from '@mui/utils'

import { styles } from './styles'
import { formatAddress } from 'utils/helpers'
import { COLORS_DARK_THEME } from 'theme/colors'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'

import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import editIcon from 'assets/vectors/edit-icon.svg'
import trashbinIcon from 'assets/vectors/gray-trashbin-icon.svg'

export interface FetchedData {
  name: string;
  address: string;
}

interface TableData {
  name: string;
  address: string;
  action: string;
}

function createData(
  name: string,
  address: string,
  action: string
): TableData {
  return {
    name,
    address,
    action
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  })
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof TableData;
  label: string;
  numeric: boolean;
}

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
      <TableRow style={styles.headRow}>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            align='left'
            sortDirection={orderBy === headCell.id ? order : false}
          >
              {idx === 0?
                <TableSortLabel
                style={{color: COLORS_DARK_THEME.SECONDARY_TEXT, width: "155px"}}
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
                left:headCell.id === 'address'?'-190px':'default'
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

export default function MembersTable({fetchedData}: {fetchedData: FetchedData[]}) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof TableData>('name');
    const [copied, setCopied] = React.useState<boolean>(false)

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

  return (
    <Box>
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
                .map((row, index) => {

                  return (
                    <TableRow style={styles.bodyRow} key={row.address}>
                      <TableCell width={170}>
                        {row.name.length > 24?
                        <Tooltip title={row.name}>
                            <div>
                                {formatAddress(row.name, 12)}
                            </div>
                        </Tooltip>
                        :row.name
                        }
                      </TableCell>
                      <TableCell style={styles.addressHolderCell} align="left">
                          {row.address}
                          <Box>
                        <Tooltip
                            onClick={() => handleCopy(row.address)}
                            title={copied ? 'Copied' : 'Copy to clipboard'}
                        >
                            <img
                            style={styles.icons}
                            src={CopyIcon}
                            alt="Copy"
                            />
                        </Tooltip>
                        <Tooltip title="Check address on explorer">
                            <a href={EXPLORER_ADDRESS_DETAILS(row.address)} target='_blank'>
                            <img
                                style={{paddingTop: '5px', ...styles.icons}}
                                src={LinkIcon}
                                alt="Link"
                            />
                            </a>
                        </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip 
                            title={`Create EDIT MEMBER proposal`}>
                            <img
                            style={styles.icons}
                            src={editIcon} 
                            alt="Edit icon" />
                          </Tooltip>
                          <Tooltip 
                            title={`Create DELETE MEMBER proposal`}>
                            <img
                            style={styles.icons}
                            src={trashbinIcon} 
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
