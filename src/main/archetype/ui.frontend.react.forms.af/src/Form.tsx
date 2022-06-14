import React, {useEffect, useState} from "react";
import {AdaptiveForm} from "@adobe/forms-super-component";
import {mappings} from "@adobe/forms-react-components";
import useEditorEvents from "./hooks/useEditorEvents";
import ReactDOM from "react-dom";
//@ts-ignore
import Spectrum2Provider from '@react/react-spectrum/Provider';
import {Provider as Spectrum3Provider, defaultTheme} from '@adobe/react-spectrum'


const getForm = async (id: string) => {
    const resp = await fetch(`/adobe/forms/af/v1/${symbol_dollar}{id}`)
    const json = (await resp.json())
    return json
}

const Form = (props: any) => {
    const {id} = props;
    const [form, setForm] = useState("")
    const [state, setState] = useEditorEvents()
    const fetchForm = async () => {
        const json:any = await getForm(id);
        setForm(JSON.stringify(json.afModelDefinition))
    }
    useEffect(() => {
        fetchForm()
    }, [state]);
    if (form != "") {
        const element = document.querySelector(".cmp-formcontainer__content")
        const retVal = (<Spectrum2Provider>
                <Spectrum3Provider theme={defaultTheme}>
                    <AdaptiveForm formJson={JSON.parse(form)} mappings={mappings} />
                </Spectrum3Provider>
            </Spectrum2Provider>)
        return ReactDOM.createPortal(retVal, element)
    }
    return null
}

export default Form