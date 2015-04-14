<<<<<<< HEAD
Part 2
#Complex Webpack Dependencies with LumX

If you're unfamiliar with the Webpack, you might want to checkout [Part 1]() of this Article on setting up a project with Webpack. This demo will continue from the previous article's [code-base]().

In this article we'll look at loading different types of dependencies: scripts, styles, fonts, etc. using Webpack. We'll also look at loading modules from NPM & Bower.

LumX
  
[LumX](http://ui.lumapps.com/) is a great Material Design based CSS Framework built for Angular. 

I would argue LumX looks better in both style and code-style when compared to [angular-material](https://material.angularjs.org/). Again, that's largely a matter of opinion. 

LumX comes with a lot of different types of dependencies: scripts, styles, fonts. Let's see how Webpack can combine them into a single `bundle.js` file. 

## Bower Setup

Make a bower.json file. 

```shell
bower init
```
Get some practice pressing enter really fast and agree to all the defaults.

Create a file called `.bowerrc` in the root. This will move all our downloaded bower components into the specified directory.

```json
{
  "directory": "app/bower_components"
}
```

We're going to need `lumx`, install it.

```shell
bower install --save lumx
```

We should let Angular know we're going to be using Lumx.

/app/index.js

```js
module.exports = angular.module('app', [
  'lumx'
]);
```

LumX comes with a party of dependencies.  Look in `app/bower_components` and you'll see them all. 

```
bower_components
├── angular
├── bourbon			// Sass mixins
├── jquery
├── lumx				
├── mdi				// Material Design Icons
├── moment 			// time
└── velocity			// jQuery animations
```

Bad news at this point.

> Webpack Prefers NPM over Bower.

And that's a lot of Bower files that Webpack is grimacing at.

## Showdown: NPM vs. Bower

It's true, Webpack can handle both CommonJS & AMD modules. But Webpack has a preference: CommonJS. 

Let's compare NPM and Bower for a minute.

NPM has nested dependencies, meaning that you can have different packages all loading different versions of `lodash` at the same time. 

Bower, on the other hand, is often used on the front-end because, well, obviously, it isn't ideal to have 3 versions of jQuery loaded every time you go to a webpage.

Anyway, that wasn't helpful at all, but it's nice to know. To the point:

Webpack prefers NPM (CommonJS). According to the Docs:

> In many cases modules from npm are better than the same module from 
> bower. Bower mostly contain only concatenated/bundled files which
>  are:
> 
> More difficult to handle for webpack
> More difficult to optimize for webpack
> Sometimes only useable without a module system
> So prefer to use the CommonJs-style module and let webpack build it.
[Source](http://webpack.github.io/docs/usage-with-bower.html). 

Luckily most packages have NPM & Bower equivalents, though there doesn't seem to be much interest in making LumX an npm module. See the [open issue](https://github.com/lumapps/lumX/issues/74) and comment! 

Let's get emotional now and get rid of all of the Lumx dependencies. If it's not NPM, it deserves a subtle level of disgust.

```
bower_components
├── bourbon	
└── lumx
```

If you want to keep them from coming back, go into `bower_components/lumx/bower.json` and delete the dependencies. However, you'll just have to do this again if you update LumX in the future.

From here on in, we're going to NPM everything. 

## NPM! NPM!

Now let's install the dependencies we just deleted from Bower on NPM.

```json
			                   /* NPM Package Name */
"dependencies": {	           ====================
    "angular": "latest",		// angular
    "jquery": "latest",			// jquery
    "velocity": "latest",		// velocity-animate
    "moment": "latest",			// moment
    "bourbon": "latest",        // node-bourbon (not necessary)
    "mdi": "1.0.8-beta"			// mdi
  }
```

As you can see, there really are easy NPM equivalents. Install the dependencies.

```shell
npm install --save angular jquery velocity-animate moment mdi
```

### Require(NPM_Module)

It should still work. Now let's load some primary NPM dependencies in vendor.js.

/app/core/vendor.js

```js
module.exports = function () {
	/* must be in order */
  require('jquery');
  require('velocity-animate');
  require('angular');
};
```

LumX seeks a few dependencies as globals, so we'll have to change this a little.

/app/core/vendor.js

```js
module.exports = function () {
global.$ = global.jQuery = require('jquery');   // $ for Lumx, jQuery for velocity
  require('velocity-animate');
  require('angular');
  global.moment = require('moment');            // for LumX
  };
```

### Require(Bower_Component)

We'll have to inject some dependencies into LumX to get it to load properly. For this we need the [`imports-loader`](https://github.com/webpack/imports-loader).

`npm install -D imports-loader`

Now we can require Lumx as a bower package. 

```js
module.exports = function () {
global.$ = global.jQuery = require('jquery');
  require('velocity-animate');
  require('angular');
  global.moment = require('moment');
  require('imports?angular!../bower_components/lumx/dist/lumx.js');
  };
```

`imports?` tells webpack to use the imports-loader, and `angular!` says to inject angular into the file. 
 
 There is probably an easier to way load bower packages, if you know, please post in the comments. This just worked for me.
  
 Another possible suggestion would be to load Lumx as an NPM module using [`debowerify`](https://github.com/eugeneware/debowerify), as posted by Mallim [here](https://github.com/lumapps/lumX/issues/74). I plan to explore this option later. 

### Require(Styles)

LumX depends on a Bourbon Sass mixins which also have an NPM equivalent: `node-bourbon`. However, LumX requires them using a relative path, so it's better just to keep the Bower bourbon file.

Style sheets can be loaded using `require('.path/to/_lumx.scss')`, as in the [previous article]() but due to the cascading nature of stylesheets, it's likely better to keep them in a root `index.scss` file. Simply import the Lumx styles.

/app/index.scss

`@import './bower_components/lumx/dist/scss/_lumx';`

This will also load bourbon.

### Require(Fonts & Icons)

We'll need another loader for fonts & icons. Install the [`file-loader`](https://github.com/webpack/file-loader).

`npm install -D file-loader`

Add the loader to your webpack.config file and tell it to grab anything that looks like a font.

/app/webpack.config.js

```js
{
    test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?name=res/[name].[ext]?[hash]'
}
```

Simply require the material design icons:

/app/core/vendor.js

```js
/* Styles */
  require('../index.scss');
  require('../../node_modules/mdi/scss/materialdesignicons.scss');
```

Create a test to see if icons and fonts are loading in `index.html`.
 
/app/index.html

```html
<p class='fs-headline'>Icon Test: <i class="mdi mdi-twitter"></i> @Sh_McK</p>
```

## Conclusion

We now have our LumX dependencies running: scripts, styles, fonts & icons, oh my! 

We saw how Webpack can load different file formats, as well as different modules (NPM or Bower). NPM being the preferred choice.

Checkout [Github]() for the full codebase.

In [Part 3]() we'll finally be able to take advantage of using Webpack with Angular for creating incredibly modular code.
=======
# WebpackAngularDemos
For tutorial using Webpack + Angular + LumX
>>>>>>> 00c97cc7eb60c305a1fece9e5b94bd020479db73
