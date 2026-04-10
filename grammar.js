module.exports = grammar({
  name: "fugitive",

  extras: () => [],

  supertypes: ($) => [$._section_item, $._header_line, $._diff_line],

  rules: {
    document: ($) => repeat(choice($._header_line, $.section, $.blank_line, $.text_line)),

    _header_line: ($) =>
      choice(
        $.head_header,
        $.ref_header,
        $.help_header,
      ),

    head_header: ($) =>
      seq(
        field("key", alias("Head", $.header_key)),
        ":",
        optional(seq(" ", field("target", choice($.hash, $.symbolic_ref, $.inline_text)))),
        $._newline,
      ),

    ref_header: ($) =>
      seq(
        field(
          "key",
          alias(choice("Pull", "Rebase", "Merge", "Push"), $.header_key),
        ),
        ":",
        optional(seq(" ", field("target", choice($.symbolic_ref, $.inline_text)))),
        $._newline,
      ),

    help_header: ($) =>
      seq(
        field("key", alias("Help", $.help_header_key)),
        ":",
        optional(seq(" ", field("tag", $.help_tag))),
        optional(field("text", $.inline_text)),
        $._newline,
      ),

    section: ($) =>
      prec.right(
        seq(
          $.section_heading,
          repeat(choice($._section_item, $.blank_line)),
        ),
      ),

    _section_item: ($) =>
      choice(
        $.instruction_line,
        $.done_line,
        $.stop_line,
        $.file_entry,
        $.hunk,
        $.text_line,
      ),

    section_heading: ($) =>
      seq(
        field("title", $.section_title),
        repeat(seq(" ", choice($.preposition, $.hash, $.symbolic_ref, $.heading_word))),
        " ",
        "(",
        field("count", $.section_count),
        ")",
        $._newline,
      ),

    section_title: ($) =>
      choice(
        alias("Untracked", $.section_title_word),
        alias("Unstaged", $.section_title_word),
        alias("Staged", $.section_title_word),
      ),

    section_count: () => token(/[0-9]+\+?/),

    preposition: () =>
      choice(
        "into",
        "onto",
        "from",
        "to",
        "Rebasing",
        "detached",
      ),

    instruction_line: ($) =>
      seq(
        field("instruction", $.instruction),
        " ",
        field("commit", $.hash),
        optional(seq(" ", field("text", $.inline_text))),
        $._newline,
      ),

    done_line: ($) =>
      seq(
        field("instruction", alias("done", $.done)),
        optional(seq(" ", field("commit", $.hash))),
        optional(seq(" ", field("text", $.inline_text))),
        $._newline,
      ),

    stop_line: ($) =>
      seq(
        field("instruction", alias("stop", $.stop)),
        optional(seq(" ", field("commit", $.hash))),
        optional(seq(" ", field("text", $.inline_text))),
        $._newline,
      ),

    file_entry: ($) =>
      seq(
        field("status", $.modifier),
        optional(field("secondary_status", $.modifier)),
        " ",
        field("path", $.inline_text),
        $._newline,
      ),

    hunk: ($) =>
      prec.right(
        seq(
          $.hunk_header,
          repeat1(choice($._diff_line, $.blank_line)),
        ),
      ),

    hunk_header: ($) =>
      seq(
        field("start", alias(token(prec(2, /@@+/)), $.hunk_delimiter)),
        " ",
        field("old_range", $.range),
        " ",
        field("new_range", $.range),
        " ",
        field("end", alias(token(prec(2, /@@+/)), $.hunk_delimiter)),
        optional(seq(" ", field("text", $.inline_text))),
        $._newline,
      ),

    _diff_line: ($) =>
      choice($.diff_context, $.diff_add, $.diff_delete, $.diff_note),

    diff_context: ($) => seq(" ", optional(field("text", $.inline_text)), $._newline),

    diff_add: ($) => seq("+", optional(field("text", $.inline_text)), $._newline),

    diff_delete: ($) => seq("-", optional(field("text", $.inline_text)), $._newline),

    diff_note: ($) => seq("\\", optional(field("text", $.inline_text)), $._newline),

    modifier: () => choice("M", "A", "D", "R", "C", "U", "?"),

    instruction: () =>
      choice(
        "pick",
        "reword",
        "edit",
        "squash",
        "fixup",
        "exec",
        "break",
        "drop",
        "label",
        "reset",
        "merge",
        "update-ref",
        "noop",
      ),

    hash: () => token(prec(2, /[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]*/)),

    symbolic_ref: () => token(prec(1, /[^\s:.()][^\s:()]*/)),

    help_tag: () => token(prec(2, /\S+/)),

    range: () => token(prec(2, /[-+][0-9,]+/)),

    heading_word: () => token(prec(1, /[A-Za-z][A-Za-z-]*/)),

    inline_text: ($) => repeat1($._text_char),

    text_line: ($) => seq(field("text", $.inline_text), $._newline),

    blank_line: ($) => $._newline,

    _text_char: () => token(/[^\n]/),

    _newline: () => token(choice("\n", "\r\n")),
  },
});
