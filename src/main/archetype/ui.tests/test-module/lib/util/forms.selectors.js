var selectors = {
    editor : {
        layerSwitcher : '.editor-GlobalBar-layerSwitcher',
        layerSelector : {
            initial : '.editor-GlobalBar-layerSwitcherPopoverContent button[data-layer="initial"]',
            structure : '.editor-GlobalBar-layerSwitcherPopoverContent button[data-layer="structure"]'
        },
        previewButtonSelector : '.editor-GlobalBar-previewTrigger',
        previewLayerSelector : '.aem-AuthorLayer-Preview',
        currentLayerButtonSelector : '.editor-GlobalBar-layerCurrent',
        editorLayerSelector : 'html.aem-AuthorLayer-Theme.Edit',
        editToolBar : {
            configure : '#EditableToolbar button[data-action="CONFIGURE"]'
        },
        sidePanelToggleButton : '.toggle-sidepanel.editor-GlobalBar-item',
        sidePanelOpen : '#SidePanel.sidepanel-opened',
        sidePanel : {
            afPropertiesContainer : '#sidepanel-guide-properties',
            stylePropertySheetSelector : '#style-propertySheetContainer',
            propertiesTab : 'coral-tab[title="Properties"]'
        },
        overlay : {
            guideFieldLabelOvelaySelector : '#af-overlay-selector-text > button[data-target-selector="af_fieldlabel"]'
        },
        themeEditor : {
            themeEditorObjSelector : '.themeEditableObject'
        },
        templateEditor : {
            structureLayer : {
                policyButton : 'button.cq-editable-action[title="Policy"]',
                policyPage : {
                    allowedComponent : {
                        adaptiveFormGroup : '.js-cq-AllowedComponents-groupCheckbox[value="group:Adaptive Form"]'
                    },
                    cancel : 'button.cq-dialog-header-action[title="Cancel"]'
                }
            }
        },
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
            oAuthUrl : '[name="./oAuthUrl"]',
            refreshTokenUrl : '[name="./refresh_token_uri"]',
            accessTokenUrl : '[name="./access_token_uri"]',
            authScope : '[name="./authorization_scope"]'
        }
    },
    content : {
        genericAFField : '.guideFieldNode',
        guideFieldLabelSelector : '.guideFieldLabel > label',
    }

};

module.exports = selectors;