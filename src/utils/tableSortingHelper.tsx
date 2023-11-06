import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from "@mui/material"
import { visuallyHidden } from '@mui/utils'
import { COLORS_DARK_THEME } from "theme/colors"

export type Order = 'asc' | 'desc'

export interface EnhancedTableProps {
    headCells?: readonly HeadCell[];
    numSelected?: number;
    onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof TableData) => void;
    onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteSelected?: () => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export interface HeadCell {
    disablePadding?: boolean;
    width?: number;
    id: keyof TableData;
    label: string;
    numeric: boolean;
}

export interface TableData {
    name?: string;
    address?: string;
    action?: string;
    blockHeight?: string;
    type?: string;
    txHash?: string;
    date?: string | Date;
    status?: string;
    votesCount?: number;
    membersCount?: number;
    proposalID?: number;
}

export function createData(
    name?: string,
    address?: string,
    action?: string,
    blockHeight?: string,
    type?: string,
    txHash?: string,
    date?: string,
    status?: string,
    votesCount?: number,
    membersCount?: number,
    proposalID?: number
): TableData {
    return {
        name,
        address,
        action,
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

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(
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

export function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number,
    loggedInUserAddress?: string
) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {

        if (loggedInUserAddress) {
            if ((a[0] as any).address === loggedInUserAddress) {
                return -1;
            }

            if ((b[0] as any).address === loggedInUserAddress) {
                return 1;
            }
        }

        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, headCells, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof TableData) => (event: React.MouseEvent<unknown>) => {
            onRequestSort!(event, property);
        };

    return (
        <TableHead style={{ marginTop: '10px', display: 'block', borderRadius: '5px' }}>
            <TableRow>
                <TableCell
                    style={{ width: '10%' }}
                    padding="checkbox">
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
                {headCells!.map((headCell, idx) => (
                    <TableCell
                        style={{ paddingLeft: '0', width: idx === 0 ? '40%' : '50%' }}
                        key={headCell.id}
                        align='left'
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {idx === 0 ?
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
                            <div style={{ color: COLORS_DARK_THEME.SECONDARY_TEXT }}> {headCell.label} </div>}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
