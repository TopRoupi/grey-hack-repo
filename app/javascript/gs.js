var module = module ? module : {}; // shim for browser use

const decimalDigits = '[0-9](_?[0-9])*';
const frac = `\\.(${decimalDigits})`;
const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;

function hljsDefineGreyScript(hljs) {
  return {
    keywords: 'for function break continue else or if not and or end then return while with in',
    literal: ['false','true','null'],
    contains: [
      {
        scope: 'string',
        begin: '"',
        end: '"'
      },
      {
        scope: 'number',
        variants: [
          {
            begin: hljs.C_NUMBER_RE + '[i]',
            relevance: 1
          },
          hljs.C_NUMBER_MODE
        ]
      },
      hljs.COMMENT(
        '//', // begin
        '\n', // end
      )
    ]
  }
}

module.exports = function(hljs) {
  hljs.registerLanguage('greyscript', hljsDefineGreyScript);
};

module.exports.definer = hljsDefineGreyScript;
