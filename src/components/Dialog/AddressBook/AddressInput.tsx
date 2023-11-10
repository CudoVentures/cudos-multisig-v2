//@ts-nocheck
import { Input } from '@mui/material'
import { styles } from '../styles'

const INPUT_FIELD = {
    address: 'addressBookAccountAddress',
    name: 'addressBookAccountName'
}

const setEvent = (eventName: string, eventValue: string) => {
    localStorage.setItem(eventName, eventValue)
    dispatchEvent(new Event("storage"))
}

const AddressInput = ({ predefinedAddr }: { predefinedAddr?: string }) => {

    if (predefinedAddr) {
        setEvent(INPUT_FIELD.address, predefinedAddr)
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setEvent(event.target.name, event.target.value)
    }

    return (
        <div className='input-group' style={styles.inputGroup}>
            <div id='account-name-group' style={{ display: 'grid', justifyItems: 'start' }}>
                <span style={{ margin: '20px 0 10px 0' }}>Member name</span>
                <Input
                    disableUnderline
                    style={styles.addressInput}
                    type="text"
                    name={INPUT_FIELD.name}
                    id='singleNameTab'
                    placeholder="e.g James Bond"
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
            <div id='amount-group' style={{ display: 'grid', justifyItems: 'start', margin: 'auto 20px' }}>
                <span style={{ margin: '20px 0 10px 0' }}>Account address</span>
                <Input
                    disabled={!!predefinedAddr}
                    value={predefinedAddr || undefined}
                    disableUnderline
                    style={styles.addressInput}
                    type="text"
                    name={INPUT_FIELD.address}
                    id='singleAddressTab'
                    placeholder="e.g cudos1nkf0flyugd2ut40cg4tn48sp70p2e65wse8abc"
                    onChange={handleChange}
                    className="form-control"
                />
            </div>
        </div>
    )
}

export default AddressInput