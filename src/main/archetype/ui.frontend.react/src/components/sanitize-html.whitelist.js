import sanitizeHtml from "sanitize-html";

sanitizeHtml.defaults.allowedAttributes['div'] = [ 'class' ];
sanitizeHtml.defaults.allowedAttributes['span'] = [ 'class' ];

export default sanitizeHtml.defaults;
