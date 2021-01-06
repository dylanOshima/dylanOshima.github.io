/**
 * Generates a nav
 */
const NAV_ITEMS = [
  'art',
  'bio',
  'blog',
  'chat',
  'work'
]

module.exports = {
  gen_nav: function(el) {
    const currentItem = el.toLowerCase();
    let output = '<ul id="nav">\n';
    NAV_ITEMS.forEach(nav_item => {
      let classes = 'nav-item';
      if (nav_item === currentItem) classes += ' current-nav-item';
      output += `<li class="${classes}"><a href="./${nav_item}.html">${nav_item[0].toUpperCase() + nav_item.slice(1)}</a></li>\n`
    })
    output += '</ul>'
    return output
  },
  gen_header: function(page_title) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DRO | ${page_title}</title>
    </head>
    <body>
    <canvas width="100vw" height="100vh" id="background">Uh oh, there's supposed to be a beautiful harmonograph here. Can you find it?</canvas>
    <div class="wrapper">
    <h1 id="title">DRO</h1>`
  },
  gen_footer: function() {
    return '</div>\n</body>\n</html>\n'
  }
}