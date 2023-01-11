import React, {useEffect, useState} from "react";
import {AdaptiveForm} from "@aemforms/af-react-renderer";
import {mappings} from "@aemforms/af-react-components";
import useEditorEvents from "./hooks/useEditorEvents";
import ReactDOM from "react-dom";
import {Action} from "@aemforms/af-core";
//@ts-ignore
import {Provider as Spectrum3Provider, defaultTheme} from '@adobe/react-spectrum'

const base64url = (s: any) => {
    var to64url = btoa(s);
    // Replace non-url compatible chars with base64url standard chars and remove leading =
    return to64url.replace(/\+/g, '_').replace(/\//g, '-').replace(/=+${symbol_dollar}/g, '');
}


export const getId = () => {
    let id =  ""
    if (!process.env.FORMPATH) {
        const parent = document.querySelector(".cmp-formcontainer")
        if (parent) {
            id = parent.getAttribute("data-form-id")
        }
    } else {
        id = base64url(process.env.FORMPATH)
    }
    return id;
}

const getForm = async (id: string) => {
    const resp = await fetch(`/adobe/forms/af/${symbol_dollar}{id}`)
    const json = (await resp.json())
    return json
}

const Form = (props: any) => {
    const [form, setForm] = useState("")
    const [state, setState] = useEditorEvents()
    const fetchForm = async () => {
        let id = getId();
        if (id) {
            const json:any = await getForm(id);
            setForm(JSON.stringify(json.afModelDefinition))
        }
    }
    const onSubmit= (action: Action) => {
      const thankyouPage =  action?.payload?.redirectUrl;
      const thankYouMessage = action?.payload?.thankYouMessage;
      if(thankyouPage){
        window.location.replace(thankyouPage);
      }else if(thankYouMessage){
        alert(thankYouMessage);
      }
    };
    useEffect(() => {
        fetchForm()
    }, [state]);
    if (form != "") {
        const element = document.querySelector(".cmp-formcontainer__content")
        const retVal = (<Spectrum3Provider theme={defaultTheme}>
            <AdaptiveForm formJson={JSON.parse(form)} mappings={mappings} onSubmit={onSubmit}/>
        </Spectrum3Provider>)
        return ReactDOM.createPortal(retVal, element)
    }
    return null
}

export default Form