local ok, ts_fugitive = pcall(require, "ts-fugitive")
if not ok then
  return
end

ts_fugitive.start(0)

vim.b.undo_ftplugin = (vim.b.undo_ftplugin or "")
  .. "\ncall v:lua.vim.treesitter.stop()"
  .. "\nsetlocal foldmethod<"
  .. "\nsetlocal foldexpr<"
