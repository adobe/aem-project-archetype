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
        sidePanel : {
            afPropertiesContainer : '#sidepanel-guide-properties',
            stylePropertySheetSelector : '#style-propertySheetContainer'
        },
        overlay : {
            guideFieldLabelOvelaySelector : '#af-overlay-selector-text > button[data-target-selector="af_fieldlabel"]'
        },
        themeEditor : {
            themeEditorObjSelector : '.themeEditableObject'
        }
    },
    content : {
        genericAFField : '.guideFieldNode',
        guideFieldLabelSelector : '.guideFieldLabel > label',
    }

};

module.exports = selectors;