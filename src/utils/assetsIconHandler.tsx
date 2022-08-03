import { Box, Tooltip, Typography } from '@mui/material'
import { cutFractions, separateDecimals, separateFractions, setDecimalPrecisionTo } from './regexFormatting'
import { COLORS_DARK_THEME } from 'theme/colors'
import { useEffect, useState } from 'react'
import { getCudosBalanceInUSD } from './helpers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from './styles'
import { denomToIcon, denomToAlias } from './helpers'
import { updateUser } from 'store/user'
import { updateModalState } from 'store/modals'

const AssetIconComponent = ({ 
        denom, 
        amount,
        selectable = false,
        smaller = false
    }:{ 
        denom: string, 
        amount: string,
        smaller?: boolean,
        selectable?: boolean })
    : JSX.Element => {

    const dispatch = useDispatch()
    const [usdValue, setUsdValue] = useState<string>('')
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const iconImg = denomToIcon[denom as keyof typeof denomToIcon]
    const denomToDisplay = denomToAlias[denom as keyof typeof denomToAlias]
    const tooltipTitle = denom === 'cudosAdmin'?amount:separateDecimals(separateFractions(amount))
    const amountToDisplay  = denom === 'cudosAdmin'?amount:cutFractions(separateDecimals(separateFractions(amount)))
    const usdPriceToDisplay = denom ==='cudosAdmin'?'Priceless':`$ ${setDecimalPrecisionTo(usdValue, 2)}`

    const setSelected = () => {
        dispatch(updateUser({ chosenBalance: {
            denom: denom,
            amount: amount
        }}))

        dispatch(updateModalState({ openAssetsTable: false}))
    }

    const selectableBox = {
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
        "&:hover": selectable? {
            cursor: 'pointer',
            backgroundColor: 'rgba(82, 166, 248, 0.1)'
        }:{},
      }

    useEffect(() => {
        const getCurrencies = async () => {
            const usdValue = await getCudosBalanceInUSD(amount)
            setUsdValue(usdValue)
          }
          getCurrencies()

        const timer = setInterval(async () => {
            await getCurrencies()
            }, 15000)

        return () => {
        clearInterval(timer)
        }

    }, [selectedWallet?.walletBalances])

    return denom === 'noBalance'? (
        <Box style={{...styles.assetsIconHolder, justifyContent: 'center', height: '110%'}}>
            <Typography variant="inherit" fontWeight={600} fontSize={17} color="text.primary">
                It seems your wallet have no assets yet
            </Typography>
        </Box>
    ) : (
        <div style={{height: 'max-content'}}>
            <Box
            sx={selectableBox}
            onClick={selectable?() => setSelected():undefined} 
            style={{...styles.assetsIconHolder}}
            >
                <div style={{width: '20px', height: '20px', marginRight:'15px'}}>
                    <img src={iconImg} alt={`${denom} logo`}/>
                </div>
                <Typography style= {{float: 'left'}} variant={smaller?"subtitle2":"h6"} fontWeight={600} color="text.primary">
                    <Tooltip title={tooltipTitle}>
                        <div>{amountToDisplay}</div>
                    </Tooltip>
                </Typography>
                <Typography style= {{margin: '0 10px', float: 'left'}} variant={smaller?"subtitle2":"h6"} fontWeight={600} color="text.secondary">
                    {denomToDisplay}
                </Typography>
                {smaller?null:
                <Typography style= {{marginLeft: '20px', float: 'left'}} variant={smaller?"subtitle2":"subtitle1"} fontWeight={600} color={COLORS_DARK_THEME.PRIMARY_BLUE}>
                    <Tooltip title={usdValue}>
                        <div>{usdPriceToDisplay}</div>
                    </Tooltip>
                </Typography>
                }
            </Box>
        </div>
    )
}

export default AssetIconComponent
