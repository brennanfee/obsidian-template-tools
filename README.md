# Obsidian Template Tools Plugin

This is an [Obsidian](https://obsidian.md) that compliments and extends the built-in template
functionality.

## Overview

Please note that at present this plugin is in **VERY EARLY DEVELOPMENT.** As such, it might do
wonderful things like grow flowers in your garden or terrible things like eat all your Obsidian
notes and blow up your computer. As it matures I expect it to become more stable and less
dangerous. By 1.0 it should be safe and stable. For now, use at your own risk.

In all cases this plugin will use the existing note id if one has already been added to the file,
or it will generate one as needed.

The intended 1.0 functionality for this plugin is as follows:

- [ ] Provide a command to add the note id into the front-matter.
- [ ] Provide a command to replace the note id in the front-matter (generate a new id).
- [ ] Provide a command to insert the note id into the text at the current cursor position (this
      may also add to the front-matter if no current note id has been created).
- [ ] Provide a command to copy the current note id to the clipboard.
- [ ] Support templates with a configurable {{note_id}} variable.
- [ ] Allow navigating directly to your note with a URL, obsidian://open_note?vault=<your-vault>&note_id=<your-note-id>
- [ ] Support a configurable template variable for {{yesterday}}.
- [ ] Support a configurable template variable for {{tomorrow}}.
- [ ] Support the ability to auto-update a front-matter value upon note modification (record last
      modified date).

Future possibilities:

- [ ] Custom format for the ID generation
- [ ] Support direct linking to note id with wikilink [[<note-id>]]. Not even sure if this is even possible in Obsidian.

## License

[MIT](license.md) © 2023 [Brennan Fee](https://github.com/brennanfee)
