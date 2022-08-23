var module = module ? module : {}; // shim for browser use

function hljsDefineText() {
  return {}
}

module.exports = function(hljs) {
  hljs.registerLanguage("text", hljsDefineText);
};

module.exports.definer = hljsDefineText;
