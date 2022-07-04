//@ts-nocheck
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import trashbinIcon from 'assets/vectors/trashbin-icon.svg'
import { Button } from '@mui/material';
import { styles } from '../styles';
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints';
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import copy from 'copy-to-clipboard'
import { formatAddress } from 'utils/helpers';
import { updateUser } from 'store/user';

interface Data {
  name: string;
  address: string;
}

function createData(
  name: string,
  address: string,
): Data {
  return {
    name,
    address,
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
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'address',
    numeric: false,
    disablePadding: false,
    label: 'Address',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteSelected: () => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, deleteSelected, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead style={{display: 'block'}}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
              {idx === 0?
                <TableSortLabel
                style={{color: '#7D87AA', width: "155px"}}
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
              <div style={{color: '#7D87AA'}}> {headCell.label} </div>}
          </TableCell>
        ))}
        <TableCell>
            <EnhancedTableToolbar deleteSelected={deleteSelected} numSelected={numSelected} />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  deleteSelected: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, deleteSelected } = props;

  return (
    <div style={{height: '0', width: '20px'}}>
        <Toolbar
        style={{backgroundColor: 'transparent'}}
        sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
            bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
        }}
        >
      {numSelected > 0 ? (
        <Tooltip title={`Delete ${numSelected} selected`}>
            <Button 
                disableRipple 
                style={styles.trashbin}
                onClick={deleteSelected}
            >
                <img src={trashbinIcon} alt="Trashbin icon" />
            </Button>
        </Tooltip>
      ) : null}
    </Toolbar>
    </div>
  );
};

export default function AddressBookTable() {
    const { addressBook } = useSelector((state: RootState) => state.userState)
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
    const [copied, setCopied] = React.useState<boolean>(false)
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const dispatch = useDispatch()

    const deleteSelected = () => {
    
        let newAddressBook = {...addressBook}
        for (let address of selected) {
            delete newAddressBook![address]
        }
    
        dispatch(updateUser({
            addressBook: newAddressBook
        }))
        setSelected([])
      }

    const rows: Data[] = [];
    if (addressBook) {
      Object.entries(addressBook!).forEach(
          ([address, name]) => rows.push(createData(name, address))
      )
    }
    
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.address);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleCopy = (value: string) => {
    copy(value)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%', height: '250px'}}>
        <TableContainer style={{display: "flex", justifyContent: "center" }}>
          <Table
            sx={{ marginTop: '20px', minWidth: 530, width: 530, height: 230 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                deleteSelected={deleteSelected}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
            />
            <TableBody style={{display: 'block', height: '185px', overflow: 'scroll'}}>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.address);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.address}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox"
                        onClick={(event) => handleClick(event, row.address)}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        style={{width: "155px"}}
                        onClick={(event) => handleClick(event, row.address)}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name.length > 18?
                        <Tooltip title={row.name}>
                            <div>
                                {formatAddress(row.name, 10)}
                            </div>
                        </Tooltip>
                        :row.name
                        }
                      </TableCell>
                      <TableCell 
                        onClick={(event) => handleClick(event, row.address)} style={{color: '#7D87AA'}} align="left">
                            {formatAddress(row.address, 20)}
                        </TableCell>
                      <TableCell style={{width:'100px'}}>
                        <Box style={{ display: 'flex', justifyContent: 'center'}}>
                        <Tooltip
                            onClick={() => handleCopy(row.address)}
                            title={copied ? 'Copied' : 'Copy to clipboard'}
                        >
                            <img
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            src={CopyIcon}
                            alt="Copy"
                            />
                        </Tooltip>
                        <Tooltip title="Check address on explorer">
                            <a href={EXPLORER_ADDRESS_DETAILS(row.address)} target='_blank'>
                            <img
                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                src={LinkIcon}
                                alt="Link"
                            />
                            </a>
                        </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}
