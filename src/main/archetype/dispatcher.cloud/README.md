# Dispatcher configuration

This module contains the basic dispatcher configurations. The configuration gets bundled in a ZIP file,
and can be downloaded and unzipped to a local folder for development.

## File Structure

```
./
├── conf.d
│   ├── available_vhosts
│   │   └── default.vhost
│   ├── dispatcher_vhost.conf
│   ├── enabled_vhosts
│   │   ├── README
│   │   └── default.vhost -> ../available_vhosts/default.vhost
│   └── rewrites
│   │   ├── default_rewrite.rules
│   │   └── rewrite.rules
│   └── variables
│       └── custom.vars
└── conf.dispatcher.d
    ├── available_farms
    │   └── default.farm
    ├── cache
    │   ├── default_invalidate.any
    │   ├── default_rules.any
    │   └── rules.any
    ├── clientheaders
    │   ├── clientheaders.any
    │   └── default_clientheaders.any
    ├── dispatcher.any
    ├── enabled_farms
    │   ├── README
    │   └── default.farm -> ../available_farms/default.farm
    ├── filters
    │   ├── default_filters.any
    │   └── filters.any
    ├── renders
    │   └── default_renders.any
    └── virtualhosts
        ├── default_virtualhosts.any
        └── virtualhosts.any
```

## Files Explained

- `conf.d/available_vhosts/default.vhost`
  - `*.vhost` (Virtual Host) files are included from inside the `dispatcher_vhost.conf`. These are `<VirtualHosts>` entries to match host names and allow Apache to handle each domain traffic with different rules. From the `*.vhost` file, other files like rewrites, white listing, etc. will be included. The `available_vhosts` directory is where the `*.vhost` files are stored and `enabled_vhosts` directory is where you enable Virtual Hosts by using a symbolic link from a file in the `available_vhosts` to the `enabled_vhosts` directory.

- `conf.d/rewrites/rewrite.rules`
  - `rewrite.rules` file is included from inside the `conf.d/enabled_vhosts/*.vhost` files. It has a set of rewrite rules for `mod_rewrite`.

- `conf.d/variables/custom.vars`
  - `custom.vars` file is included from inside the `conf.d/enabled_vhosts/*.vhost` files. You can put your Apache variables in there.

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

Some files are immutable, meaning they cannot be altered or deleted.  These are part of the base framework and enforce standards and best practices.  When customization is needed, copies of immutable files (i.e. `default.vhost` -> `publish.vhost`) can be used to modify the behavior.  Where possible, be sure to retain includes of immutable files unless customization of included files is also needed.

### Immutable Files

```
conf.d/available_vhosts/default.vhost
conf.d/dispatcher_vhost.conf
conf.d/rewrites/default_rewrite.rules
conf.dispatcher.d/available_farms/default.farm
conf.dispatcher.d/cache/default_invalidate.any
conf.dispatcher.d/cache/default_rules.any
conf.dispatcher.d/clientheaders/default_clientheaders.any
conf.dispatcher.d/dispatcher.any
conf.dispatcher.d/enabled_farms/default.farm
conf.dispatcher.d/filters/default_filters.any
conf.dispatcher.d/renders/default_renders.any
conf.dispatcher.d/virtualhosts/default_virtualhosts.any
```