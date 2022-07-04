import { useDispatch, useSelector } from 'react-redux'
import { alpha } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils';
import { styles } from '../styles'
import { RootState } from 'store'
import { DEFAULT_VOTING_WEIGHT } from 'utils/constants'
import Dialog from 'components/Dialog'
import { formatAddress } from 'utils/helpers'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import copy from 'copy-to-clipboard'
import { useEffect, useState } from 'react'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { updateModalState } from 'store/modals'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import { member, updateWalletObjectState } from 'store/walletObject'
import { 
  Box, 
  Button, 
  Checkbox, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableSortLabel, 
  Toolbar, Tooltip, 
  Typography 
} from '@mui/material'

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
    order: Order;
    orderBy: string;
    rowCount: number;
  }
  
  function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler =
      (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
  
    return (
      <TableHead style={{display: 'block', borderRadius: '5px', backgroundColor: 'rgba(99, 109, 143, 0.2)'}}>
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
                  style={{color: '#7D87AA', width: "200px"}}
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
              <EnhancedTableToolbar numSelected={numSelected} />
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  interface EnhancedTableToolbarProps {
    numSelected: number;
  }
  
  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;
  
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
      </Toolbar>
      </div>
    );
  };
  
const StepThree = () => {

    const dispatch = useDispatch()
    const { addressBook } = useSelector((state: RootState) => state.userState)
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Data>('name');
    const [copied, setCopied] = useState<boolean>(false)
    const [selected, setSelected] = useState<readonly string[]>([]);
    let addressesInAddressBook: number = 0

    if (addressBook) {
      addressesInAddressBook = Object.keys(addressBook).length
    } 

    const addSelectedMembersToWalletObject = (addresses: string[]) => {
      let newMembers: member[] = []
      addresses.map((address) => {
        const metaData = `{memberName: ${addressBook![address]}}`
        newMembers.push({
          address: address,
          weight: DEFAULT_VOTING_WEIGHT,
          metadata: metaData
        })
      })
      dispatch(updateWalletObjectState({ members: newMembers }))
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
      addSelectedMembersToWalletObject(newSelecteds)
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
    addSelectedMembersToWalletObject([])
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

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
    addSelectedMembersToWalletObject(newSelected)
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
  
  const handleAddressBookOpen = () => {
    dispatch(updateModalState({ addNewAddress: true, openAddressBook: true }))
  }

  useEffect(() => {
    addSelectedMembersToWalletObject([])
  }, [])
  
  return (
    <Box id='step-three-holder' style={styles.stepOneHolder}>
        <Dialog />
        <Paper style={{borderRadius: '20px'}} elevation={1}>
            <Box style={styles.tableContainerHolder}>
                <div style={{width: '100%'}}>
                    <div style={styles.tableInfo}>
                        <div style={{display: "flex", alignItems: "center"}}>
                          <Typography style={{float: 'left'}} variant="h6" fontWeight={900} letterSpacing={2}>
                              Selected
                          </Typography>
                          <span style={styles.spanHolder}>{selected.length}</span>
                          <Typography style={{}} variant="h6" fontWeight={900} letterSpacing={2}>
                              from
                          </Typography>
                          <span style={styles.spanHolder}>{addressesInAddressBook}</span>
                          <Typography style={{float: 'left'}} variant="h6" fontWeight={900} letterSpacing={2}>
                              Addresses
                          </Typography>
                        </div>
                        <Typography style={{float: 'left'}} variant="subtitle2" color="text.secondary">
                            Here is your list of addresses to choose from
                        </Typography>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddressBookOpen()}
                        sx={styles.connectButton}
                    >
                        <img style={styles.btnLogo} src={PlusIcon} alt="Plus Icon" />
                        Add New
                    </Button>
                </div>
                <TableContainer style={styles.tableContainer}>
                <Table
                    sx={styles.table}
                    aria-labelledby="tableTitle"
                    size='small'
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody style={styles.tableBody}>
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
                                style={{width: "200px"}}
                                onClick={(event) => handleClick(event, row.address)}
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                            >
                                {row.name.length > 30?
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
                                    {row.address}
                            </TableCell>
                            <TableCell style={{width:'150px'}}>
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
        </Paper>
    </Box>
  )
}

export default StepThree
