# Visual regression plugin based on pixelmatch for WDIO

This plugin can be used for visual regression testing, it is based on https://www.npmjs.com/package/pixelmatch 
The plugin exposed function matchScreenshot
Example usage
```
it('Basic Visual test', () => {

browser.url('https://www.example.com');

const  isMatched = browser.call(() =>  browser.matchScreenshot(this, 'Homepage', { errorThreshold:  .2, baseDir:'./assets/homepage' }));

expect(isMatched, `screenshot did not match`).true;

});
```
The first param is the instance(this) of current executing test
The second param to matchScreenshot is the screenshot name (required),
the third param is config object.
The config object takes 2 properties for now
1. errorThreshold : The smaller the more sensitive comparison is
More examples:

| Threshold | Fails when |
|-----------|------------|
| .25 | > 25%  |
| .30 | > 30% |
| .50 | > 50% |
| .75 | > 75% |
2. baseDir: the dir where the screenshots should be stored. (base, current and diff screenshot)
```
let  PixelMatchPlugin = require('./lib/wdio-pixelmatch-service/launcher').PixelMatchPlugin;
wdio_config.services = [

[PixelMatchPlugin, {

viewportSize: { height:  768, width:  1024 },

pixelmatchDirectory:  './assets'

}]

];
```
The config object for the plugin takes two properties for now,
1. viewportSize : The size of screenshot you want
2. pixelmatchDirectory : top level config of where to store screenshots.

In case when you want to accept some changes, just delete the existing baseline image. The plugin will then create a new baseline image for you, which will be used for future comparisons.