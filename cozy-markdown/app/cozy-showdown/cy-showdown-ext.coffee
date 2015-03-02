# demo = (converter) ->
#   [
#     # Replace escaped @ symbols
#     type: "lang"
#     regex: "\\@"
#     replace: "@toto"
#   ]

# # Server-side export
# module.exports = demo  if typeof module isnt "undefined"

strike = (converter) ->
    [
        # strike-through
        # NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
        type: "lang"
        # regex: "(###){1}([^#]+)(###){1}"
        # regex: "(####){1}([^]+)(####){1}"
        regex: "(<<)([^]+)(<<)"
        # regex: "(~T){2}([^~]+)(~T){2}"
        replace: (match, prefix, content, suffix) ->
            "<del>" + content + "</del>"
    ]

module.exports = strike