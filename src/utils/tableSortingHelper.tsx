
export type Order = 'asc' | 'desc'

export interface EnhancedTableProps {
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

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
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
