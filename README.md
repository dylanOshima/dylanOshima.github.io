# Introduction
This is the code for my personal site. It is meant to be light, accessible, and easy to use.

It offers:
1. my bloggy blogs
2. my self-expression (imgs, videos, music)
3. my basic information (meh)

This is also an experiment for me to make light weight websites.

## Style
I want to keep it minimalistic. I also want it to represent the different cultures and aspects I've been brought up in and have adopted. I decided to use Lato, Karla, and Ubunutu Mono as my three fonts of choice. They're clean simple and the former has been a long term favorite of mine.

## Hosting Plan
I plan to use github pages to host the page since it's really meant to be quite simple and barebones. Since github pages reads the `index.html` in a given branch and hosts that, thus it would need to live in the root directory.

**Issues**: I'm running into some issues with hot reloading not picking up changes with the styles or the html during development which is kind of annoying. 

~~I basically had the whole development process planned so that the html would be the entrypoint for webpack. Reading [this discussion](https://github.com/webpack/webpack/issues/536) made me realize that it's not quite ready for that...~~ I'm going to put this aside for now and just use webpack to bundle my javascript and nothing else.

## Todo
- [ ] Setup webpack to auto convert `.md` files to html
    * See the [docs here](https://github.com/jantimon/html-webpack-plugin)
- [ ] Have webpack create the relative links for converted markdown files
- [ ] Figure out a way to measure the time to load on a computer
- [ ] Setup custom css for different device] using the [`HtmlWebpackPlugin`](https://github.com/yaycmyk/link-media-html-webpack-plugin)
- [ ] Checkout how the site looks like on the backup fonts.
- [ ] Make sure things load aptly 
    * Check that the harmonograph follows [best practices](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [ ] Add some fancy transition for flipping through the welcome text in the Welcome page.
- [ ] Replace the `/lib/html_build` script with [webpack plugins](https://github.com/pcardune/handlebars-loader)
    * The current implementation can be done with a mixture of the `handlebars-loader` and the `html-webpack-plugin`, but I have to figure out how export certain configurations since they're dependent on the file.