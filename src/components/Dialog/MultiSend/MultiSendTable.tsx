import UploadFromCsv from 'assets/vectors/csv-upload.svg'
import TrashBinIcon from 'assets/vectors/trashbin-icon.svg'
import CachedIcon from '@mui/icons-material/Cached'
import { Fragment, useEffect, useRef } from "react"
import { denomToAlias } from "utils/helpers"
import { HtmlTooltip, mergeData, TableRecipients } from "utils/multiSendTableHelper"
import { styles } from "./styles"
import { RootState } from "store"
import { useDispatch, useSelector } from "react-redux"
import { updateSendFunds } from "store/sendFunds"
import { updateModalState } from "store/modals"
import { isValidAmount, isValidCudosAddress } from "utils/validation"
import { FILE_ERROR_MSG, FILE_ERROR_TITLE } from "utils/constants"
import { COLORS_DARK_THEME } from "theme/colors"

import {
    TableContainer,
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Tooltip,
    TableBody
} from "@mui/material"

const MultiSendTable = () => {

    const dispatch = useDispatch()
    const autoScroll = useRef<null | HTMLDivElement>(null)
    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    let fileReader: FileReader
    let invdalidData: boolean = false

    useEffect(() => {
        if (autoScroll.current) {
            setTimeout(() => {
                autoScroll!.current!.scrollIntoView({
                    behavior: "smooth",
                    block: 'nearest',
                    inline: 'start'
                })
            }, 200)
        }
    }, [multisendRows])

    const validDenom = (denom: string): boolean => {
        for (const balance of selectedWallet!.walletBalances!) {
            if (balance.denom === denom) {
                return true
            }
        }
        return false
    }

    const handleCsvClick = () => {
        document.getElementById("csv-file")?.click()
    }

    const handleFileRead = (e: ProgressEvent<FileReader>) => {

        const content = fileReader.result!.toString().split('\n')
        let txBatch: TableRecipients = {}

        for (let line of content) {
            line = line.trim()
            line = line.replaceAll('"', '')
            line = line.replaceAll("'", "")
            if (line.length === 0) { invdalidData = true; break }

            const columns = line.split(',')
            if (columns.length !== 2) { invdalidData = true; break }

            const recipient = columns[0]
            const rawAmount = columns[1]

            const regex = /^([0-9]*[\.,]?[0-9]+)(\D+)$/gm
            const result = regex.exec(rawAmount)

            if (!result![1] || !result![2]) { invdalidData = true; break }

            const amount = parseFloat(result![1])
            const denom = result![2]

            if (
                !validDenom(denom) ||
                recipient === undefined ||
                recipient === '' ||
                !isValidCudosAddress(recipient) ||
                amount === undefined ||
                amount === 0 ||
                !isValidAmount(amount.toString())) {
                invdalidData = true
                break
            }

            if (!txBatch[recipient]) {
                txBatch[recipient] = { [denom]: amount }
                continue
            }

            if (!txBatch[recipient][denom]) {
                txBatch[recipient][denom] = amount
                continue
            }

            txBatch[recipient][denom] += amount
        }

        if (invdalidData) {
            dispatch(updateModalState({
                failure: true,
                title: FILE_ERROR_TITLE,
                message: FILE_ERROR_MSG
            }))
            return
        }

        const updatedData = mergeData(multisendRows!, txBatch)
        dispatch(updateSendFunds({ multisendRows: updatedData }))
    }

    const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files![0]
        fileReader = new FileReader()
        fileReader.onloadend = handleFileRead
        fileReader.readAsText(file)
        e.target.value = ''
    }

    const handleRemoveSpecificRow = (idx: number) => () => {
        const newRows = [...multisendRows!]
        newRows.splice(idx, 1)
        dispatch(updateSendFunds({ multisendRows: newRows }))
    }

    return (
        <TableContainer id='table-container' style={styles.tableContainer}>
            <h4 style={{ marginBottom: '10px', float: "left" }}>List of recipients</h4>
            <HtmlTooltip
                style={{ marginTop: '20px' }}
                title={
                    <Fragment>
                        <Typography color="inherit">CSV file format</Typography>
                        <em>{"<address>"}</em><b>{','}</b> <em>{"<amount>"}</em><em>{"<denom>"}</em><br />
                        <em>{"<address>"}</em><b>{','}</b> <em>{"<amount>"}</em><em>{"<denom>"}</em><br />
                        <em>{"validcudosaddress"}</em><b>{','}</b> <em>{"123"}</em><em>{"cudos"}</em><br />
                        <em>{"validcudosaddress"}</em><b>{','}</b> <em>{"1"}</em><em>{"cudosAdmin"}</em><br />
                        <small>{'*Each pair should be comma separated and on a new line.'}</small><br />
                        <small>{'*Duplicated addresses will accumulate balances as long as from same denom.'}</small><br />
                    </Fragment>}
            >
                <div className='tooltip-base'>
                    <Button
                        disableRipple
                        style={styles.csvBtn}
                        onClick={handleCsvClick}
                    >
                        <img src={UploadFromCsv} alt="Upload from CSV file" />
                    </Button>
                </div>
            </HtmlTooltip>
            <input
                name="multiSendCsv"
                type='file'
                id='csv-file'
                accept='.csv'
                onChange={handleFileChosen}
                hidden
            />
            <Table id='table'>
                {/* TABLE HEADER */}
                <TableHead style={styles.tableHead}>
                    <TableRow style={styles.resultRow}>
                        <TableCell style={{ ...styles.headerCells, ...styles.hashHeadCell }}>#</TableCell>
                        <TableCell style={{ ...styles.headerCells, ...styles.addressHeadCell }}>Address</TableCell>
                        <TableCell></TableCell>
                        <TableCell style={{ ...styles.headerCells, ...styles.amountHeadCell }}>Amount</TableCell>
                        <TableCell style={styles.headerCells}>
                            <Tooltip title={'Clear table'}>
                                <Button
                                    disableRipple
                                    onClick={() => dispatch(updateSendFunds({ multisendRows: [] }))}
                                    style={multisendRows!.length > 0 ? styles.visibleClearBtn : styles.invisibleClearBtn}
                                >
                                    <CachedIcon sx={{ color: 'rgba(82, 166, 248, 0.5)' }} />
                                </Button>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* TABLE BODY */}
                <TableBody style={styles.tableBody}>
                    {multisendRows!.map((item, idx) => (
                        //@ts-ignore
                        <TableRow
                            style={{
                                ...styles.resultRow,
                                backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND
                            }}
                            key={idx}
                            ref={autoScroll}
                        >
                            <TableCell style={{
                                ...styles.headerCells,
                                width: '50px',
                                textAlign: 'center'
                            }}
                            >
                                {idx + 1}
                            </TableCell>
                            <TableCell style={{
                                ...styles.resultCells,
                                width: '410px',
                                color: COLORS_DARK_THEME.PRIMARY_BLUE
                            }}
                            >
                                {item.recipient}
                            </TableCell>
                            <TableCell style={{
                                ...styles.resultCells,
                                display: 'inline-flex',
                                width: '300px'
                            }}
                            >
                                <div style={{ marginRight: '5px', textAlign: 'left', width: '100px' }}>
                                    {item.amount.length < 13 ?
                                        item.amount :
                                        <Tooltip title={item.amount}>
                                            <div>
                                                {item.amount.slice(0, 4) + '.....' + item.amount.slice(-4)}
                                            </div>
                                        </Tooltip>}
                                </div>
                                {denomToAlias[item.denom as keyof typeof denomToAlias]}
                            </TableCell>
                            <TableCell style={styles.resultCells}>
                                <Button
                                    disableRipple
                                    style={styles.thrashBinIcon}
                                    onClick={handleRemoveSpecificRow(idx)}
                                >
                                    <img src={TrashBinIcon} alt="remove row icon" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default MultiSendTable
