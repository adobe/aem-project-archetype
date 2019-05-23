 "use strict";
use(function () {
    var pageName = currentPage.name;
    var title = currentPage.properties.get("jcr:title");
    var resourcePath = currentPage.path;

    return {
        pageName: pageName,
        title: title,
        path: resourcePath
    };
});


