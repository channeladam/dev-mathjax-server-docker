
function startMathJax(){ // Based on https://github.com/tiarno/mathjax-server/
    let mathjax = require("mathjax-node-sre"); // https://github.com/pkra/mathjax-node-sre
    mathjax.config({
        MathJax: {
            SVG: {
                font: "STIX-Web"
            },
            tex2jax: {
                preview: ["[math]"],
                processEscapes: true,
                processClass: ['math'],
                skipTags: ["script","noscript","style","textarea","pre","code"]
            },
            TeX: {
                noUndefined: {disabled: true},
                Macros: {
                  mbox: ['{\\text{#1}}',1],
                  mb: ['{\\mathbf{#1}}',1],
                  mc: ['{\\mathcal{#1}}',1],
                  mi: ['{\\mathit{#1}}',1],
                  mr: ['{\\mathrm{#1}}',1],
                  ms: ['{\\mathsf{#1}}',1],
                  mt: ['{\\mathtt{#1}}',1]
                }
            }
        }
    });
    mathjax.start();
    return mathjax;
}

let mathjax = startMathJax();

const router = require('koa-router')();
const Koa = require('koa');
const app = new Koa();

app.on('error', function(err) {
    console.log(err);
});

app.use(async function(ctx, next) {
    try {
        await next();
    } catch (err) {
        // some errors will have .status however this is not a guarantee
        ctx.status = err.status || 500;
        ctx.type = 'html';
        ctx.body = '<p>Error happened</p>';

        // since we handled this manually we'll want to delegate to the regular app level error handling as well so that
        // centralized still functions correctly.
        ctx.app.emit('error', err, ctx);
    }
});

router.get('/', (ctx, next) => {
    let query = ctx.request.query;

    console.log('query is' + JSON.stringify(query));

    if (query) {
        let resp = ctx.response;

        return mathjax.typeset(query).then( (result) => {    // https://github.com/mathjax/MathJax-node
            if (!result.errors) {
                // See https://github.com/mathjax/MathJax-node#promiseresolveresultoptions--promiserejecterrors--callbackresult-options
                // The result object will contain (at most) the following structure:
                // {
                //   errors:                     // an array of MathJax error messages if any errors occurred
                //   mml:                        // a string of MathML markup if requested
                //   mmlNode:                    // a jsdom node of MathML markup if requested
                //   html:                       // a string of HTML markup if requested
                //   htmlNode:                   // a jsdom node of HTML markup if requested
                //   css:                        // a string of CSS if HTML was requested
                //   svg:                        // a string of SVG markup if requested
                //   svgNode:                    // a jsdom node of SVG markup if requested
                //   style:                      // a string of CSS inline style if SVG requested
                //   height:                     // a string containing the height of the SVG output if SVG was requested
                //   width:                      // a string containing the width of the SVG output if SVG was requested
                //   speakText:                  // a string of speech text if requested (the math that was converted)
                //
                //   state: {                    // the state object (if useGlobalCache or equationNumbers is set)
                //            glyphs:            // a collection of glyph data
                //            defs :             // a string containing SVG def elements
                //            AMS: {
                //                 startNumber:  // the current starting equation number
                //                 labels:       // the set of labels
                //                 IDs:          // IDs used in previous equations
                //              }
                //          }
                // }
                //
                // And https://github.com/pkra/mathjax-node-sre/blob/master/lib/main.js
                //   provides result.speech which is suitable for alt text.
                resp.status = 200;
                resp.set('Content-Type', 'application/json');
                resp.body = JSON.stringify(result);
            } else {
                resp.status = 400;
                resp.set('Content-Type', 'text/plain');
                resp.body = 'Error - MathJax processing failed. \n' + String(result.errors) + '\n' + JSON.stringify(query) + '\n';
            }
        });
    } else {
        ctx.status = 400;   // Bad request
        resp.body = 'Error - ' + JSON.stringify(query) + '\n';
        console.log(resp.body);
    }
});

app.use(router.routes());

app.listen(3000, () => console.log('server started 3000'));
