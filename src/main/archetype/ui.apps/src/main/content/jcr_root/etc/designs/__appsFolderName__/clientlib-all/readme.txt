
This client library should be left empty: it's purpose is only to embed all other client libraries that are needed. This allows to manage flexibly what is to be included in which order, as well as to accelerate the site by concatenating all client libraries into one file.

Another reason why this client library is playing an essential role is that in production, no client library located under /apps can be directly accessed, because all access to /apps must be blocked by the dispatcher for security reasons.
