import Form from 'react-jsonschema-form'

type QueryFunc = (queryArgs: string) => Promise<string>
type ExecuteFunc = (executeArgs: string) => Promise<boolean>

interface ISmartContractInteractionProps {
    querySchema: string,
    executeSchema: string,
    queryFunc: QueryFunc,
    executeFunc: ExecuteFunc
}

const SmartContractInteraction = (props: ISmartContractInteractionProps) => {
    const querySchemaObj = JSON.parse(props.querySchema)
    const executeSchemaObj = JSON.parse(props.executeSchema)

    AddMissingTitles(querySchemaObj, '')
    AddMissingTitles(executeSchemaObj, '')

    const onSubmitQuery = (event: any) => {
        const formData = getFormData(event, 0)
        const res = props.queryFunc(formData)
        console.log(res)
    }
    
    const onSubmitExecute = async (event: any) => {
        const formData = getFormData(event, 1)
        const res = await props.executeFunc(formData)
        console.log(res)
    }

    return (
        <>
            <h2>Query:</h2>
            <Form schema={querySchemaObj} onSubmit={onSubmitQuery} noValidate={true} />

            <h2>Execute:</h2>
            <Form schema={executeSchemaObj} onSubmit={onSubmitExecute} noValidate={true} />
        </>
    )
}

const getFormData = (event: any, menuIndex: number): string => {
    const menu = document.querySelectorAll("select[id='root_anyof_select']")[menuIndex] as any
    const selectedOption = menu['selectedOptions'][0]['text'] as string
    
    if (!(selectedOption in event.formData)) {
        throw 'Invalid form data'
    }

    // Not using event.formData directly becasue it may contain unnecessary properties

    return JSON.stringify({ [selectedOption]: event.formData[selectedOption] })
}


const AddMissingTitles = (obj: any, parentProp: string) => {
    if (typeof obj !== 'object') {
        return
    }

    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue
        }

        let nextKey = key

        if (Number.isInteger(key)) {
            nextKey = parentProp
        }

        AddMissingTitles(obj[key], nextKey)

        if (['oneOf', 'anyOf'].includes(parentProp)) {
            AddMissingTitle(obj[nextKey])
        }
    }
}

const AddMissingTitle = (obj: any) => {
    if ('title' in obj) {
        return
    }

    if ('required' in obj && obj['required'].length == 1) {
        obj['title'] = obj['required'][0]
        return
    }
    
    if ('type' in obj && obj['type'] === 'null') {
        obj['title'] = 'None'
        return
    }

    if ('$ref' in obj) {
        const parts = obj['$ref'].split('/')
        obj['title'] = parts[parts.length - 1]
    }
}

export default SmartContractInteraction