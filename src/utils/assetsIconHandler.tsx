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
        selectable = false
    }:{ 
        denom: string, 
        amount: string, 
        selectable?: boolean })
    : JSX.Element => {

    const dispatch = useDispatch()
    const [usdValue, setUsdValue] = useState<string>('')
    const { selectedWallet } = useSelector((state: RootState) => state.userState)

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
                It seems you do not have any assets just yet
            </Typography>
        </Box>
    ) : (
        <div style={{height: 'max-content'}}>
            <Box
            sx={selectableBox}
            onClick={selectable?() => setSelected():undefined} 
            style={styles.assetsIconHolder}
            >
                <img style={{marginRight:'15px'}} src={denomToIcon[denom as keyof typeof denomToIcon]} alt={`${denom} logo`}/>
                <Typography style= {{float: 'left'}} variant="h6" fontWeight={600} color="text.primary">
                <Tooltip title={denom === 'cudosAdmin'?amount:separateDecimals(separateFractions(amount))}>
                    <div>
                        {denom === 'cudosAdmin'?amount:cutFractions(separateDecimals(separateFractions(amount)))}
                    </div>
                </Tooltip>
                </Typography>
                <Typography style= {{margin: '0 10px', float: 'left'}} variant="h6" fontWeight={600} color="text.secondary">
                    {denomToAlias[denom as keyof typeof denomToAlias]}
                </Typography>
                <Typography style= {{marginLeft: '20px', float: 'left'}} variant="subtitle1" fontWeight={600} color={COLORS_DARK_THEME.PRIMARY_BLUE}>
                    <Tooltip title={usdValue}>
                        <div>
                            <span>{denom==='cudosAdmin'?'Priceless':`$ ${setDecimalPrecisionTo(usdValue, 2)}`}</span>
                        </div>
                    </Tooltip>
                </Typography>
            </Box>
        </div>
    )
}

export default AssetIconComponent
