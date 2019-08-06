# Overview
A MathJax server docker container to convert inline LaTeX to SVG, MathML or HTML.

Intended only for running locally on a development or build server - through perhaps as a Hugo shortcode...

# Example Usage

After starting the docker container:

```bash
$ curl "http://localhost:3000/?format=inline-TeX&svg=1&speakText=1&math=\mu"
```

Example result: 

```javascript
{
    "svg":"<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"1.346ex\" height=\"1.843ex\" style=\"vertical-align: -0.671ex;\" viewBox=\"0 -504.3 579.5 793.3\" role=\"img\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" aria-labelledby=\"MathJax-SVG-1-Title\">\n<title id=\"MathJax-SVG-1-Title\">mu</title>\n<defs aria-hidden=\"true\">\n<path stroke-width=\"1\" id=\"E1-STIXWEBNORMALI-1D707\" d=\"M549 428l-86 -338c-4 -16 -8 -29 -8 -39c0 -8 5 -14 17 -14c23 0 45 27 57 48l15 -6c-15 -44 -84 -106 -131 -106c-29 0 -41 13 -41 41s14 94 33 171c-97 -146 -148 -191 -194 -191c-17 0 -36 11 -41 25c-36 -142 -43 -176 -66 -202h-74c14 20 30 53 45 114l125 497h79 l-71 -298c-2 -9 -4 -18 -4 -27c0 -27 14 -45 54 -45c53 0 178 216 197 299l16 71h78Z\"></path>\n</defs>\n<g stroke=\"currentColor\" fill=\"currentColor\" stroke-width=\"0\" transform=\"matrix(1 0 0 -1 0 0)\" aria-hidden=\"true\">\n <use xlink:href=\"#E1-STIXWEBNORMALI-1D707\" x=\"0\" y=\"0\"></use>\n</g>\n</svg>",
    "width":"1.346ex",
    "height":"1.843ex",
    "style":"vertical-align: -0.671ex;",
    "speakText":"\\mu",
    "speech":"mu"}
```

# Input

Perform an HTTP GET with the options below as query string parameters.

The options documented by [MathJax-node](https://github.com/mathjax/MathJax-node) 
```javascript
  ex: 6,                          // ex-size in pixels
  width: 100,                     // width of container (in ex) for linebreaking and tags
  useFontCache: true,             // use <defs> and <use> in svg output?
  useGlobalCache: false,          // use common <defs> for all equations?
  linebreaks: false,              // automatic linebreaking
  equationNumbers: "none",        // automatic equation numbering ("none", "AMS" or "all")
  cjkCharWidth: 13,               // width of CJK character

  math: "",                       // the math string to typeset
  format: "TeX",                  // the input format (TeX, inline-TeX, AsciiMath, or MathML)
  xmlns: "mml",                   // the namespace to use for MathML

  html: false,                    // generate HTML output
  htmlNode: false,                // generate HTML output as jsdom node
  css: false,                     // generate CSS for HTML output
  mml: false,                     // generate MathML output
  mmlNode: false,                 // generate MathML output as jsdom node
  svg: false,                     // generate SVG output
  svgNode: false,                 // generate SVG output as jsdom node

  speakText: true,                // add textual alternative (for TeX/asciimath the input string, for MathML a dummy string)

  state: {},                      // an object to store information from multiple calls (e.g., <defs> if useGlobalCache, counter for equation numbering if equationNumbers ar )
  timeout: 10 * 1000,             // 10 second timeout before restarting MathJax
```

In addition, [mathjax-node-sre](https://github.com/pkra/mathjax-node-sre) accepts:

```javascript
speakText: false,               // adds spoken annotations to output
speakRuleset: "mathspeak",      // set speech ruleset; default (= chromevox rules) or mathspeak
speakStyle: "default",          // set speech style for mathspeak rules:  default, brief, sbrief)
semantic: false,                // adds semantic tree information to output
minSTree: false,                // if true the semantic tree is minified
enrich: false                   // replace the math input with MathML resulting from SRE enrichment
speech: 'deep'                  // sets depth of speech; 'shallow' or 'deep'
```

# Output

The result object will contain (at most) the following structure:

```javascript
  mml:                        // a string of MathML markup if requested
  mmlNode:                    // a jsdom node of MathML markup if requested
  html:                       // a string of HTML markup if requested
  htmlNode:                   // a jsdom node of HTML markup if requested
  css:                        // a string of CSS if HTML was requested
  svg:                        // a string of SVG markup if requested
  svgNode:                    // a jsdom node of SVG markup if requested
  style:                      // a string of CSS inline style if SVG requested
  height:                     // a string containing the height of the SVG output if SVG was requested
  width:                      // a string containing the width of the SVG output if SVG was requested

  speakText:                  // a string of speech text if requested (the math that was converted)
  speech:                     // a string of the speakText converted into English - suitable for alt text

  state: {                    // the state object (if useGlobalCache or equationNumbers is set)
           glyphs:            // a collection of glyph data
           defs :             // a string containing SVG def elements
           AMS: {
                startNumber:  // the current starting equation number
                labels:       // the set of labels
                IDs:          // IDs used in previous equations
             }
         }
```

This is a composition from:
- [MathJax-node](https://github.com/mathjax/MathJax-node#promiseresolveresultoptions--promiserejecterrors--callbackresult-options); and
- [mathjax-node-sre](https://github.com/pkra/mathjax-node-sre/blob/master/lib/main.js)
