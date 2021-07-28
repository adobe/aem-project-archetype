var selectors = {
    editor : {
        layerSwitcher : '.editor-GlobalBar-layerSwitcher',
        layerSelector : {
            initial : '.editor-GlobalBar-layerSwitcherPopoverContent button[data-layer="initial"]',
            structure : '.editor-GlobalBar-layerSwitcherPopoverContent button[data-layer="structure"]'
        },
        themeEditor : {
            themeEditorObjSelector : '.themeEditableObject'
        },
        templateEditor : {
            structureLayer : {
                policyButton : '.cq-editable-action[title="Policy"]',
                policyPage : {
                    allowedComponent : {
                        adaptiveFormGroup : '.js-cq-AllowedComponents-groupCheckbox[value="group:Adaptive Form"]'
                    },
                    cancel : 'button.cq-dialog-header-action[title="Cancel"]'
                }
            }
        }
    },
    content : {
        genericAFField : '.guidefield'
    }

};

module.exports = selectors;