Trix.config.toolbar.getDefaultHTML = toolbarDefaultHTML;

document.addEventListener('trix-initialize', updateToolbars, { once: true });

function updateToolbars(event) {
  const toolbars = document.querySelectorAll('trix-toolbar');
  const html = Trix.config.toolbar.getDefaultHTML();
  toolbars.forEach((toolbar) => (toolbar.innerHTML = html));
}

/**
 * @see https://github.com/basecamp/trix/blob/main/src/trix/config/toolbar.coffee
 */
function toolbarDefaultHTML() {
  const { lang } = Trix.config


var toolbar = document.getElementById("toolbar-trix")

return toolbar.innerHTML
}
