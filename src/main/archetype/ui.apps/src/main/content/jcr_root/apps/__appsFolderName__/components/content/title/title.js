/*
 *  Copyright 2014 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";

/**
 * Title foundation component JS backing script
 */
 use(function () {
    
    // TODO: change currentStyle to wcm.currentStyle
    
    var CONST = {
        PROP_TITLE: "jcr:title",
        PROP_PAGE_TITLE: "pageTitle",
        PROP_TYPE: "type",
        PROP_DEFAULT_TYPE: "defaultType"
    }
    
    var title = {};
    
    // The actual title content
    title.text = granite.resource.properties[CONST.PROP_TITLE]
            || wcm.currentPage.properties[CONST.PROP_PAGE_TITLE]
            || wcm.currentPage.properties[CONST.PROP_TITLE]
            || wcm.currentPage.name;
    
    // The HTML element name
    var propType = granite.resource.properties[CONST.PROP_TYPE]
            || currentStyle.get(CONST.PROP_DEFAULT_TYPE, "");
            
	var tagName = "h2";
	if (propType=="small") {
        tagName = "h3";
    } else if (propType=="extralarge") {
        tagName = "h1";
    }
    title.element = tagName; 
    
    // Adding the constants to the exposed API
    title.CONST = CONST;
    
    return title;
    
});