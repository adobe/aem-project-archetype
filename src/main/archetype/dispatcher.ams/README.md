# Dispatcher configuration

This module contains the basic dispatcher configurations. The configuration gets bundled in a ZIP file,
and can be downloaded and unzipped to a local folder for development.

## File Structure

```
├── conf
│   ├── httpd.conf
│   └── magic
├── conf.d
│   ├── README
│   ├── autoindex.conf
│   ├── available_vhosts
│   │   ├── 000_unhealthy_author.vhost
│   │   ├── 000_unhealthy_publish.vhost
│   │   ├── aem_author.vhost
│   │   ├── aem_flush.vhost
│   │   ├── aem_health.vhost
│   │   ├── aem_lc.vhost
│   │   ├── aem_publish.vhost
│   │   └── ${appId}_publish.vhost
│   ├── dispatcher_vhost.conf
│   ├── enabled_vhosts
│   │   ├── aem_author.vhost -> ../available_vhosts/aem_author.vhost
│   │   ├── aem_flush.vhost -> ../available_vhosts/aem_flush.vhost
│   │   ├── aem_health.vhost -> ../available_vhosts/aem_health.vhost
│   │   └── ${appId}_publish.vhost -> ../available_vhosts/${appId}_publish.vhost
│   ├── logformat.conf
│   ├── remoteip.conf
│   ├── rewrites
│   │   ├── base_rewrite.rules
│   │   ├── ${appId}_rewrite.rules
│   │   └── xforwarded_forcessl_rewrite.rules
│   ├── security.conf
│   ├── userdir.conf
│   ├── variables
│   │   └── ams_default.vars
│   ├── welcome.conf
│   └── allowlists
│       └── 000_base_allowlist.rules
├── conf.dispatcher.d
│   ├── available_farms
│   │   ├── 000_ams_author_farm.any
│   │   ├── 001_ams_lc_farm.any
│   │   └── 999_ams_publish_farm.any
│   ├── cache
│   │   ├── ams_author_cache.any
│   │   ├── ams_author_invalidate_allowed.any
│   │   ├── ams_publish_cache.any
│   │   └── ams_publish_invalidate_allowed.any
│   ├── clientheaders
│   │   ├── ams_author_clientheaders.any
│   │   ├── ams_common_clientheaders.any
│   │   ├── ams_lc_clientheaders.any
│   │   └── ams_publish_clientheaders.any
│   ├── dispatcher.any
│   ├── enabled_farms
│   │   ├── 000_ams_author_farm.any -> ../available_farms/000_ams_author_farm.any
│   │   └── 999_ams_publish_farm.any -> ../available_farms/999_ams_publish_farm.any
│   ├── filters
│   │   ├── ams_author_filters.any
│   │   ├── ams_lc_filters.any
│   │   └── ams_publish_filters.any
│   ├── renders
│   │   ├── ams_author_renders.any
│   │   ├── ams_lc_renders.any
│   │   └── ams_publish_renders.any
│   └── vhosts
│       ├── ams_author_vhosts.any
│       ├── ams_lc_vhosts.any
│       └── ams_publish_vhosts.any
└── conf.modules.d
    ├── 00-base.conf
    ├── 00-dav.conf
    ├── 00-lua.conf
    ├── 00-mpm.conf
    ├── 00-proxy.conf
    ├── 00-systemd.conf
    ├── 01-cgi.conf
    └── 02-dispatcher.conf
```

## Files Explained

- `conf.d/available_vhosts/<CUSTOMER_CHOICE>.vhost`
  - `*.vhost` (Virtual Host) files are included from inside the `dispatcher_vhost.conf`. These are `<VirtualHosts>` entries to match host names and allow Apache to handle each domain traffic with different rules. From the `*.vhost` file, other files like rewrites, white listing, etc. will be included. The `available_vhosts` directory is where the `*.vhost` files are stored and `enabled_vhosts` directory is where you enable Virtual Hosts by using a symbolic link from a file in the `available_vhosts` to the `enabled_vhosts` directory.
  
  The `${appId}_publish.vhost` file is an updated version of the default `ams_publish.vhost`, the changes allow for including additional rewrite files. 

- `conf.d/rewrites/*.rules`
  - `base_rewrite.rules`: included from inside the `conf.d/enabled_vhosts/*.vhost` files. It has a set of default AMS rewrite rules for `mod_rewrite`.
  - `${appId}_rewrite.rules`: included from the the `conf.d/enabled_vhosts/${appId}_publish.vhost` file. It sets up default rewrite rules for root page resolution. Additional rewrite rules are provided to expand resource mapping paths. 

- `conf.d/variables/ams_default.vars`
  - `ams_default.vars` file is included from inside the `conf.d/enabled_vhosts/*.vhost` files. You can put your Apache variables here.

- `conf.dispatcher.d/available_farms/<CUSTOMER_CHOICE>.farm`
  - `*.farm` files are included inside the `conf.dispatcher.d/dispatcher.any` file. These parent farm files exist to control module behavior for each render or website type. Files are created in the `available_farms` directory and enabled with a symbolic link into the `enabled_farms` directory. 

- `conf.dispatcher.d/filters/filters.any`
  - `filters.any` file is included from inside the `conf.dispatcher.d/enabled_farms/*.farm` files. It has a set of rules change what traffic should be filtered out and not make it to the backend.

- `conf.dispatcher.d/virtualhosts/virtualhosts.any`
  - `virtualhosts.any` file is included from inside the `conf.dispatcher.d/enabled_farms/*.farm` files. It has a list of host names or URI paths to be matched by blob matching to determine which backend to use to serve that request.

- `conf.dispatcher.d/cache/rules.any`
  - `rules.any` file is included from inside the `conf.dispatcher.d/enabled_farms/*.farm` files. It specifies caching preferences.

- `conf.dispatcher.d/clientheaders.any`
  - `clientheaders.any` file is included inside the `conf.dispatcher.d/enabled_farms/*.farm` files. It specifies which client headers should be passed through to each renderer.

## Environment Variables

- `CONTENT_FOLDER_NAME`
  - This is the customer's content folder in the repository. This is used in the `customer_rewrite.rules` to map shortened URLs to their correct repository path.  

## Immutable Configuration Files

Some files are immutable, meaning they cannot be altered or deleted.  These are part of the base framework and enforce standards and best practices.  When customization is needed, copies of immutable files (i.e. `ams_author.vhost` -> `customer_author.vhost`) can be used to modify the behavior.  Where possible, be sure to retain includes of immutable files unless customization of included files is also needed.

### Immutable Files

```
conf/httpd.conf

conf.d/dispatcher_vhost.conf
conf.d/logformat.conf
conf.d/security.conf

conf.d/available_vhosts/aem_author.vhost
conf.d/available_vhosts/aem_publish.vhost
conf.d/available_vhosts/aem_lc.vhost
conf.d/available_vhosts/aem_flush.vhost
conf.d/available_vhosts/aem_health.vhost
conf.d/available_vhosts/000_unhealthy_author.vhost
conf.d/available_vhosts/000_unhealthy_publish.vhost

conf.d/rewrites/base_rewrite.rules
conf.d/rewrites/xforwarded_forcessl_rewrite.rules

conf.d/allowlists/000_base_allowlist.rules

conf.modules.d/02-dispatcher.conf

conf.dispatcher.d/dispatcher.any

conf.dispatcher.d/available_farms/000_ams_author_farm.any
conf.dispatcher.d/available_farms/999_ams_publish_farm.any
conf.dispatcher.d/available_farms/001_ams_lc_farm.any

conf.dispatcher.d/cache/ams_author_cache.any
conf.dispatcher.d/cache/ams_author_invalidate_allowed.any
conf.dispatcher.d/cache/ams_publish_cache.any
conf.dispatcher.d/cache/ams_publish_invalidate_allowed.any

conf.dispatcher.d/clientheaders/ams_author_clientheaders.any
conf.dispatcher.d/clientheaders/ams_publish_clientheaders.any
conf.dispatcher.d/clientheaders/ams_common_clientheaders.any
conf.dispatcher.d/clientheaders/ams_lc_clientheaders.any

conf.dispatcher.d/filters/ams_author_filters.any
conf.dispatcher.d/filters/ams_publish_filters.any
conf.dispatcher.d/filters/ams_lc_filters.any

conf.dispatcher.d/renders/ams_author_renders.any
conf.dispatcher.d/renders/ams_publish_renders.any
conf.dispatcher.d/renders/ams_lc_renders.any

conf.dispatcher.d/vhosts/ams_author_vhosts.any
conf.dispatcher.d/vhosts/ams_publish_vhosts.any
conf.dispatcher.d/vhosts/ams_lc_vhosts.any
```
