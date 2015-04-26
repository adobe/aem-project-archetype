
This client library should be left empty: it's purpose is to list all client libraries that the site requires. This allows to manage flexibly what is to be included in which order, as well as to accelerate the site by concatenating everything into one file.

Another reason why this client library is playing an essential role is that in production, access to /apps should be blocked by the dispatcher, therefore no client library located under /apps can be directly accessed anymore.
