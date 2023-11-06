//@ts-nocheck
import * as React from 'react';

import { visuallyHidden } from '@mui/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import trashbinIcon from 'assets/vectors/trashbin-icon.svg'
import editIcon from 'assets/vectors/edit-icon.svg'
import HomeIcon from '@mui/icons-material/Home';

import { styles } from '../styles';
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints';
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import copy from 'copy-to-clipboard'
import { formatAddress } from 'utils/helpers';
import { updateUser } from 'store/user';
import { updateModalState } from 'store/modals';
import { saveAddressBook } from 'utils/firebase'
import { getConnectedUserAddressAndName } from 'utils/config'

import {
  Order,
  stableSort,
  getComparator,
  HeadCell,
  createData,
  TableData,
  EnhancedTableProps
} from 'utils/tableSortingHelper';

import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  Box,
  Toolbar,
  alpha,
  Tooltip,
  Button,
  TableContainer,
  Table,
  TableBody
} from '@mui/material'

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
  const { onSelectAllClick, deleteSelected, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort!(event, property);
    };

  return (
    <TableHead style={{ display: 'block' }}>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 1 && numSelected === rowCount - 1}
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
                style={{ color: '#7D87AA', width: "155px" }}
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
          <EnhancedTableToolbar deleteSelected={deleteSelected!} numSelected={numSelected} />
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
  const { addressBook, connectedLedger, address: logedInUserAddr } = useSelector((state: RootState) => state.userState)
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof TableData>('name');
  const [copied, setCopied] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const dispatch = useDispatch()

  const deleteSelected = async () => {
    let newAddressBook = { ...addressBook }
    for (let address of selected) {
      delete newAddressBook![address]
    }

    const { address } = await getConnectedUserAddressAndName(connectedLedger!)
    await saveAddressBook(address, newAddressBook);
    dispatch(updateUser({
      addressBook: newAddressBook
    }))
    setSelected([])
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
      const newSelecteds = rows
        .filter((n) => n.address !== logedInUserAddr)
        .map((n) => n.address);
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

  const editSelected = (row: TableData, idx: number) => {
    dispatch(updateModalState({
      editAddressBookRecord: true,
      dataObject: { index: idx, name: row.name, address: row.address }
    }))
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%', height: '250px' }}>
      <TableContainer style={{ display: "flex", justifyContent: "center" }}>
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
          <TableBody style={{ display: 'block', height: '185px', overflow: 'scroll' }}>
            {stableSort(rows, getComparator(order, orderBy), logedInUserAddr)
              .map((row, index) => {
                const rowAddress = row.address.toString()
                const isItemSelected = isSelected(rowAddress)
                const labelId = `enhanced-table-checkbox-${index}`
                const isOwnAddress = rowAddress === logedInUserAddr

                return (
                  <TableRow
                    sx={{ pointerEvents: isOwnAddress ? 'none' : 'auto' }}
                    hover={isOwnAddress ? false : true}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.address}
                    selected={isItemSelected}
                  >
                    <TableCell
                      padding="checkbox"
                      onClick={(event) => handleClick(event, row.address.toString())}>
                      {
                        isOwnAddress ?
                          <Checkbox
                            checkedIcon={<HomeIcon />}
                            color="success"
                            checked={true}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                          :
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                      }
                    </TableCell>
                    <TableCell
                      style={{ width: "155px" }}
                      onClick={(event) => handleClick(event, row.address.toString())}
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name.toString().length > 15 ?
                        <Tooltip title={row.name}>
                          <div>
                            {formatAddress(row.name.toString(), 8)}
                          </div>
                        </Tooltip>
                        : row.name
                      }
                    </TableCell>
                    <TableCell
                      onClick={(event) => handleClick(event, row.address.toString())} style={{ color: '#7D87AA' }} align="left">
                      {formatAddress(row.address.toString(), 20)}
                    </TableCell>
                    <TableCell>
                      <Box style={{ pointerEvents: 'all', display: 'flex', justifyContent: 'center' }}>
                        <Tooltip
                          onClick={() => editSelected(row, index)}
                          title={`Edit record`}>
                          <img
                            style={isOwnAddress ? styles.disabledIcons : styles.icons}
                            src={editIcon}
                            alt="Edit icon" />
                        </Tooltip>
                        <Tooltip
                          onClick={() => handleCopy(row.address.toString())}
                          title={copied ? 'Copied' : 'Copy to clipboard'}
                        >
                          <img
                            style={styles.icons}
                            src={CopyIcon}
                            alt="Copy"
                          />
                        </Tooltip>
                        <Tooltip title="Check address on explorer">
                          <a href={EXPLORER_ADDRESS_DETAILS(row.address.toString())} target='_blank'>
                            <img
                              style={{ paddingTop: '5px', ...styles.icons }}
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
