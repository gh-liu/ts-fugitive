local M = {}

local function root_dir()
  local source = debug.getinfo(1, "S").source
  local path = source:sub(1, 1) == "@" and source:sub(2) or source
  return vim.fs.dirname(vim.fs.dirname(vim.fs.dirname(path)))
end

local function parser_path()
  return root_dir() .. "/parser/fugitive.so"
end

function M.ensure_registered()
  vim.treesitter.language.register("fugitive", "fugitive")

  local path = parser_path()
  if vim.uv.fs_stat(path) == nil then
    return false, ("missing parser at %s"):format(path)
  end

  return vim.treesitter.language.add("fugitive", { path = path })
end

function M.start(bufnr)
  local ok, err = M.ensure_registered()
  if not ok then
    vim.notify_once(
      ("tree-sitter-fugitive: %s"):format(err),
      vim.log.levels.WARN
    )
    return false, err
  end

  bufnr = bufnr or 0
  vim.treesitter.start(bufnr, "fugitive")

  vim.wo.foldmethod = "expr"
  vim.wo.foldexpr = "v:lua.vim.treesitter.foldexpr()"

  return true
end

return M
