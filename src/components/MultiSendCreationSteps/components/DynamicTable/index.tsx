import { styles } from './styles'
import { RootState } from 'store'
import { useSelector, useDispatch } from 'react-redux'
import React, { useRef, useEffect, useState } from 'react'
import UploadFromCsv from 'assets/vectors/csv-upload.svg'
import TrashBinIcon from 'assets/vectors/trashbin-icon.svg'
import CachedIcon from '@mui/icons-material/Cached'
import Dialog from 'components/Dialog'
import { isValidAmount, isValidCudosAddress } from 'utils/validation'
import { updateModalState } from 'store/modals'
import { FILE_ERROR_MSG, FILE_ERROR_TITLE } from 'utils/constants'
import { updateSendFunds } from 'store/sendFunds'
import { SingleInputRow } from '../SingleInputRow'
import { Coin } from 'cudosjs'
import { mergeData, TableRecipients } from 'utils/multiSendTableHelper'
import { denomToAlias } from 'utils/helpers'
import { HtmlTooltip } from 'utils/multiSendTableHelper'

import { 
    Tooltip, 
    Typography, 
    Button, 
    TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell
 } from '@mui/material'

const DynamicTable = () => {

    const autoScroll = useRef()
    const dispatch = useDispatch()
    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)

    const validDenom = (denom: string): boolean => {
        for (const balance of selectedWallet!.walletBalances!) {
            if (balance.denom === denom) {
                return true
            }
        }
        return false
    }

    useEffect(() => {
        //@ts-ignore
        setTimeout(() => { autoScroll.current.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' }) }, 200)
    }, [multisendRows])

    const handleCsvClick = () => {
        document.getElementById("csv-file")?.click()
    }

    const handleRemoveSpecificRow = (idx: any) => () => {
        const newRows = [...multisendRows!]
        newRows.splice(idx, 1)
        dispatch(updateSendFunds({multisendRows: newRows}))
    }

    let fileReader: any
    let invdalidData: boolean = false

    const handleFileRead = (e: any) => {

        const content = fileReader.result.split('\n')
        
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
                !isValidAmount(amount.toString()))
                { 
                    invdalidData = true
                    break 
                }

            if (txBatch[recipient]) {
                if (txBatch[recipient][denom]) {
                    txBatch[recipient][denom] += amount
                } else {
                    txBatch[recipient][denom] = amount
                }
            } else {
                txBatch[recipient] = {
                    [denom]: amount
                }
            }
        }
        
        if (invdalidData) {
            dispatch(updateModalState({
                failure: true, 
                title: FILE_ERROR_TITLE, 
                message: FILE_ERROR_MSG
            }))
        } else {

            const updatedData = mergeData(multisendRows!, txBatch)
            dispatch(updateSendFunds({multisendRows: updatedData}))
        }
        
    }
    
    const handleFileChosen = (e: any) => {
        let file = e.target.files[0]
        fileReader = new FileReader()
        fileReader.onloadend = handleFileRead
        fileReader.readAsText(file)
        e.target.value = ''
    }

        const clearState = () => {
            dispatch(updateSendFunds({multisendRows: []}))
            //@ts-ignore
            document.getElementById('singleAddressTab').value = ''
            //@ts-ignore
            document.getElementById('singleAmountTab').value = ''
        }

        
    return (
        <div id='component-holder' style={{opacity: '1', transition: 'opacity 0.5s'}}>
            <Dialog />
            <SingleInputRow />
                <TableContainer id='table-container' style={styles.tableContainer}>
                    <h4 style={{marginBottom: '10px', float: "left"}}>List of recipients</h4>
                    <HtmlTooltip
                        style={{marginTop: '20px'}}
                        title={
                            <React.Fragment>
                            <Typography color="inherit">CSV file format</Typography>
                            <em>{"<address>"}</em><b>{','}</b> <em>{"<amount>"}</em><em>{"<denom>"}</em><br/> 
                            <em>{"<address>"}</em><b>{','}</b> <em>{"<amount>"}</em><em>{"<denom>"}</em><br/>
                            <em>{"validcudosaddress"}</em><b>{','}</b> <em>{"123"}</em><em>{"cudos"}</em><br/>
                            <em>{"validcudosaddress"}</em><b>{','}</b> <em>{"1"}</em><em>{"cudosAdmin"}</em><br/>   
                            <small>{'*Each pair should be comma separated and on a new line.'}</small><br/>
                            <small>{'*Duplicated addresses will accumulate balances as long as from same denom.'}</small><br/>
                            </React.Fragment>}
                    >
                        <div className='tooltip-base'>
                            <Button 
                                disableRipple 
                                style = {{ height: '30px', paddingRight: '0', marginBottom: '5px', float: 'right', background: 'none'}} 
                                onClick={handleCsvClick}>
                                <img src={UploadFromCsv} alt="Upload from CSV file" />
                            </Button>
                        </div>
                    </HtmlTooltip>
                    <input
                    name="multiSendCsv"
                    type='file'
                    id='csv-file'
                    accept='.csv'
                    onChange={e => handleFileChosen(e)}
                    hidden
                    />
                <Table id='table'>
                    {/* TABLE HEADER */}
                    <TableHead style={{borderRadius: '10px', width: '100%', display: 'block'}}>
                        <TableRow style={{...styles.resultRow, display: 'flex', background: 'rgba(99, 109, 143, 0.2)'}}>
                            <TableCell style={{...styles.headerCells, padding: '10px 10px 10px 24px'}}>#</TableCell>
                            <TableCell style={{...styles.headerCells, padding: '10px', width: '410px'}}>Address</TableCell>
                            <TableCell></TableCell>
                            <TableCell style={{...styles.headerCells, padding: '0px 0px 0px 65px', textAlign: 'left', width: '250px'}}>Amount</TableCell>
                            <TableCell style={styles.headerCells}>
                                <Tooltip title={'Clear table'}>
                                    <Button
                                        disableRipple
                                        onClick={clearState}
                                        style = {multisendRows!.length > 0?
                                            {padding: '0px', margin: '0', float: 'right', background: 'none'}:
                                            {visibility: 'hidden', padding: '0 0 0 5px', margin: '0', float: 'right', background: 'none'}}>
                                        <CachedIcon sx={{ color: 'rgba(82, 166, 248, 0.5)' }} />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* TABLE BODY */}
                    <TableBody style={{background: '#28314E', display: 'block', height: '130px', overflow: 'scroll', padding: '5px'}}>
                        {multisendRows!.map((item, idx) => (
                            //@ts-ignore
                            <TableRow id='auto-scrolling-table' style={{...styles.resultRow}} key={idx} ref={autoScroll}>
                                <TableCell style={{...styles.headerCells, width: '50px', textAlign: 'center' }} >{idx+1}</TableCell>
                                <TableCell style={{...styles.resultCells, width: '410px', color: '#52A6F8'}}>
                                    {item.recipient}
                                </TableCell>
                                <TableCell style={{...styles.resultCells, display: 'inline-flex', width: '300px'}}>
                                    
                                    <div style={{marginRight: '5px', textAlign: 'left', width: '100px'}}>
                                        {item.amount.length < 13?
                                        item.amount:
                                        <Tooltip title={item.amount}>
                                            <div>
                                            {item.amount.slice(0, 4 ) + '.....' + item.amount.slice(-4)}
                                            </div>
                                        </Tooltip>
                                        }
                                    </div>
                                    <span>
                                        {denomToAlias[item.denom as keyof typeof denomToAlias]}
                                    </span>
                                </TableCell>
                                <TableCell style={{...styles.resultCells}}>
                                    <Button 
                                    disableRipple 
                                    style = {{ paddingRight: '0', marginBottom: '5px', float: 'right', background: 'none'}} 
                                    onClick={handleRemoveSpecificRow(idx)}>
                                    <img src={TrashBinIcon} alt="remove row icon" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export {
    DynamicTable
}
