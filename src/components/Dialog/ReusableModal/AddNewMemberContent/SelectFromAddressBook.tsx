//@ts-nocheck
import { RootState } from 'store'
import { styles } from './styles'
import { useEffect, useState } from 'react'
import { formatAddress } from 'utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_VOTING_WEIGHT } from 'utils/constants'
import { Member, updateWalletObjectState } from 'store/walletObject'
import { COLORS_DARK_THEME } from 'theme/colors'
import { useGetWalletMembersQuery } from 'graphql/types'
import { AddressBook } from 'store/user'

import {
    Box,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
} from '@mui/material'

import {
    HeadCell,
    TableData,
    Order,
    createData,
    stableSort,
    getComparator,
    EnhancedTableHead,
} from 'utils/tableSortingHelper'

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


const SelectFromAddressBook = () => {

    const dispatch = useDispatch()
    const { addressBook, selectedWallet } = useSelector((state: RootState) => state.userState)
    const [order, setOrder] = useState<Order>('asc')
    const oldWalletMembers: AddressBook = {}
    const [orderBy, setOrderBy] = useState<keyof TableData>('name')
    const [selected, setSelected] = useState<readonly string[]>([])
    const walletId: number = selectedWallet!.walletID!
    const { loading, error, data } = useGetWalletMembersQuery({
        variables: { id: walletId }
    })

    if (data) {
        for (const member of data.group_with_policy_by_pk!.group_members) {
            oldWalletMembers[member.address] = member.metadata!
        }
    }

    const addSelectedMembersToWalletObject = (addresses: string[]) => {
        let newMembers: Member[] = []
        addresses.map((address) => {
            newMembers.push({
                address: address,
                weight: DEFAULT_VOTING_WEIGHT,
                metadata: JSON.stringify({
                    memberName: addressBook![address]
                })
            })
        })
        dispatch(updateWalletObjectState({ members: newMembers }))
    }

    useEffect(() => {
        addSelectedMembersToWalletObject([])
    }, [])

    const rows: TableData[] = [];
    if (addressBook && !loading) {
        Object.entries(addressBook!).forEach(
            // Only addresses not already in the wallet are displayed to the user to choose from
            ([address, name]) => oldWalletMembers[address] ? null : rows.push(createData(name, address))
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

    const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const newSelecteds = rows.map((n) => n.address);
            addSelectedMembersToWalletObject(newSelecteds as string[])
            setSelected(newSelecteds as string[]);
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

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    return (
        <Box marginTop={4}>
            <TableContainer style={styles.tableContainer}>
                <Table
                    sx={styles.table}
                    aria-labelledby="tableTitle"
                    size='small'
                >
                    <EnhancedTableHead
                        headCells={headCells}
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
                                        <TableCell
                                            style={{ width: "10%" }}
                                            padding="checkbox"
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
                                            style={{ width: "40%" }}
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
                                            style={{ width: "50%", color: COLORS_DARK_THEME.SECONDARY_TEXT }}
                                            onClick={(event) => handleClick(event, row.address.toString())} align="left">
                                            {formatAddress(row.address.toString(), 20)}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default SelectFromAddressBook
