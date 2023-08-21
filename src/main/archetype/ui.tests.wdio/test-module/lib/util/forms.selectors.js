
export const selectors = {
    editor : {
        fdmEditor : {
            title : '#fdm-editor-header-title',
            modelTab : 'coral-tab=Model',
            servicesTab : 'coral-tab=Services'
        },
        dataSourceEditor : {
            generalTab : 'coral-tab=General',
            authenticationTab : 'coral-tab=Authentication Settings',
            title : '[name="./jcr:title"]',
            authenticationSelector : '[name="./selectAuthentication"]',
            authenticationSelectorInput : 'input[name="./selectAuthentication"]',
            oAuthUrl : '[name="./oAuthUrl"]',
            refreshTokenUrl : '[name="./refresh_token_uri"]',
            accessTokenUrl : '[name="./access_token_uri"]',
            authScope : '[name="./authorization_scope"]'
        }
    },
    content : {
        afFieldTypes : {
            genericAFField : '.guidefield',
            afImage : '.guideimage',
            aftable : '.table'
        }
    }
};

