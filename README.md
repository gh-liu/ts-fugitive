# tree-sitter-fugitive

Tree-sitter grammar for fugitive status-style buffers.

Current scope:

- fugitive headers such as `Head:`, `Pull:`, `Merge:`, `Rebase:`, `Push:`, and `Help:`
- section headings such as `Staged (2)`
- file entries such as `M path/to/file`
- instruction lines such as `pick <hash>`
- hunk headers and diff body lines
- Treesitter highlight and fold queries for Neovim

Not in scope yet:

- patch-body source-language injections
- non-status fugitive buffer families

## Development

Generate the parser:

```sh
tree-sitter generate
```

Build the parser shared library for Neovim:

```sh
tree-sitter build -o parser/fugitive.so
```

Run corpus tests:

```sh
tree-sitter test
```

The Neovim runtime glue loads `parser/fugitive.so`, registers it for the `fugitive` filetype, and starts Treesitter from [`ftplugin/fugitive.lua`](/home/liu/dev/vim/ts-fugitive/ftplugin/fugitive.lua).
