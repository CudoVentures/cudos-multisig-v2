//@ts-nocheck
import { RootState } from 'store'
import { styles } from '../styles'
import copy from 'copy-to-clipboard'
import Dialog from 'components/Dialog'
import { useEffect, useState } from 'react'
import { alpha } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import { formatAddress } from 'utils/helpers'
import { updateModalState } from 'store/modals'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_VOTING_WEIGHT } from 'utils/constants'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { Member, updateWalletObjectState } from 'store/walletObject'

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
import {
  HeadCell,
  TableData,
  Order,
  createData,
  stableSort,
  getComparator,
  EnhancedTableProps
} from 'utils/tableSortingHelper'
import { updateUser } from 'store/user'

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

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort!(event, property);
    };

  return (
    <TableHead style={{ display: 'block', borderRadius: '5px', backgroundColor: 'rgba(99, 109, 143, 0.2)' }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected! > 0 && numSelected! < rowCount}
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
            {idx === 0 ?
              <TableSortLabel
                style={{ color: '#7D87AA', width: "200px" }}
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
              <div style={{ color: '#7D87AA' }}> {headCell.label} </div>}
          </TableCell>
        ))}
        <TableCell>
          <EnhancedTableToolbar numSelected={numSelected!} />
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
    <div style={{ height: '0', width: '20px' }}>
      <Toolbar
        style={{ backgroundColor: 'transparent' }}
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
  const { addressBook, newAddedAddress, address: logedInUserAddr } = useSelector((state: RootState) => state.userState)
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof TableData>('name');
  const [copied, setCopied] = useState<boolean>(false)
  const [selected, setSelected] = useState<readonly string[]>([]);
  let addressesInAddressBook: number = 0

  if (addressBook) {
    addressesInAddressBook = Object.keys(addressBook).length
  }

  const addSelectedMembersToWalletObject = (addresses: string[]) => {
    let newMembers: Member[] = []
    addresses.map((address) => {
      newMembers.push({
        address: address,
        weight: DEFAULT_VOTING_WEIGHT,
      })
    })
    dispatch(updateWalletObjectState({ members: newMembers }))
  }

  const rows: TableData[] = [];
  if (addressBook) {
    Object.entries(addressBook!).forEach(
      ([address, name]) => rows.push(createData(name, address))
    )
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TableData,
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

  const checkForNewAddedAddress = () => {
    if (!newAddedAddress || newAddedAddress == '') {
      return
    }

    const newSelected = selected
    newSelected.push(newAddedAddress)

    addSelectedMembersToWalletObject(newSelected)
    setSelected(newSelected);

    dispatch(updateUser({
      newAddedAddress: ''
    }))
  }

  useEffect(() => {
    checkForNewAddedAddress()
  }, [newAddedAddress])

  useEffect(() => {
    addSelectedMembersToWalletObject([])
    // Make sure owner address is auto selected on component load
    handleClick(null, logedInUserAddr)
  }, [])

  return (
    <Box id='step-three-holder' style={styles.stepOneHolder}>
      <Dialog />
      <Paper style={{ borderRadius: '20px' }} elevation={1}>
        <Box style={styles.tableContainerHolder}>
          <div style={{ width: '100%' }}>
            <div style={styles.tableInfo}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography style={{ float: 'left' }} variant="h6" fontWeight={900} letterSpacing={2}>
                  Selected
                </Typography>
                <span style={styles.spanHolder}>{selected.length}</span>
                <Typography style={{}} variant="h6" fontWeight={900} letterSpacing={2}>
                  from
                </Typography>
                <span style={styles.spanHolder}>{addressesInAddressBook}</span>
                <Typography style={{ float: 'left' }} variant="h6" fontWeight={900} letterSpacing={2}>
                  Addresses
                </Typography>
              </div>
              <Typography style={{ float: 'left' }} variant="subtitle2" color="text.secondary">
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
                    const isItemSelected = isSelected(row.address.toString());
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
                          onClick={(event) => handleClick(event, row.address.toString())}>
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          style={{ width: "200px" }}
                          onClick={(event) => handleClick(event, row.address.toString())}
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name.toString().length > 30 ?
                            <Tooltip title={row.name}>
                              <div>
                                {formatAddress(row.name.toString(), 10)}
                              </div>
                            </Tooltip>
                            : row.name
                          }
                        </TableCell>
                        <TableCell
                          onClick={(event) => handleClick(event, row.address.toString())} style={{ color: '#7D87AA' }} align="left">
                          {row.address}
                        </TableCell>
                        <TableCell style={{ width: '150px' }}>
                          <Box style={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip
                              onClick={() => handleCopy(row.address.toString())}
                              title={copied ? 'Copied' : 'Copy to clipboard'}
                            >
                              <img
                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                src={CopyIcon}
                                alt="Copy"
                              />
                            </Tooltip>
                            <Tooltip title="Check address on explorer">
                              <a href={EXPLORER_ADDRESS_DETAILS(row.address.toString())} target='_blank'>
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
