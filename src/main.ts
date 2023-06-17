import { Editor, MarkdownView, Plugin, TFile, parseFrontMatterEntry } from "obsidian"
import { UniqueNoteIdSettings, DEFAULT_SETTINGS } from "./settings"
import { UniqueNoteIdSettingTab } from "./settingsUI"
import { v4 as uuidv4 } from "uuid"

// Remember to rename these classes and interfaces!

export default class UniqueNoteIdPlugin extends Plugin {
  settings: UniqueNoteIdSettings

  async onload() {
    console.log("Loading Unique Note ID plugin...")
    await this.loadSettings()

    // Add ID command (to frontmatter)
    this.addCommand({
      id: "add-unique-note-id",
      name: "Add Unique Note ID",
      editorCallback: async (_: Editor, view: MarkdownView) => {
        await this.getNoteId(view)
      },
    })

    // Replace ID command (in frontmatter)
    this.addCommand({
      id: "replace-unique-note-id",
      name: "Replace Unique Note ID",
      editorCallback: async (_: Editor, view: MarkdownView) => {
        const newId = this.generateNoteId()
        await this.setNoteId(newId, view)
      },
    })

    // Insert in text command
    this.addCommand({
      id: "paste-unique-note-id",
      name: "Paste Unique Note ID",
      editorCallback: async (editor: Editor, view: MarkdownView) => {
        // TBD
        const id = await this.getNoteId(view)
        editor.replaceSelection(id)
      },
    })

    // Copy note id to clipboard
    this.addCommand({
      id: "copy-note-id-to-clipboard",
      name: "Copy Note ID To Clipboard",
      editorCallback: async (_: Editor, view: MarkdownView) => {
        const id = await this.getNoteId(view)
        navigator.clipboard.writeText(id)
      },
    })

    // Copy note link to clipboard
    this.addCommand({
      id: "copy-note-link-to-clipboard",
      name: "Copy Note Link To Clipboard",
      editorCallback: async (_: Editor, view: MarkdownView) => {
        const id = await this.getNoteId(view)
        const prefix = `obsidian://open_note?vault=${encodeURIComponent(app.vault.getName())}`
        navigator.clipboard.writeText(`${prefix}&note_id=${id}`)
      },
    })

    // Template events
    this.registerEvent(
      this.app.workspace.on("create", async (file) => {
        if (file) {
          await new Promise((r) => setTimeout(r, 2000)) // Wait for Templater to do its thing
          this.replaceNoteTemplateStrings(file)
        }
      })
    )

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new UniqueNoteIdSettingTab(this.app, this))
  }

  onunload() {
    console.log("Unloading Unique Note ID plugin")
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }

  getFileFromID(id: string): TFile | undefined {
    const files = this.app.vault.getFiles()
    const idKey = this.settings.idField
    return files.find((file) => {
      const fieldValue = parseFrontMatterEntry(
        this.app.metadataCache.getFileCache(file)?.frontmatter,
        idKey
      )

      if (fieldValue instanceof Array) {
        return fieldValue.contains(id)
      } else {
        return fieldValue == id
      }
    })
  }

  async getNoteId(view: MarkdownView): Promise<string> {
    const idKey = this.settings.idField
    const frontmatter = this.app.metadataCache.getFileCache(view.file)?.frontmatter
    const fieldValue = parseFrontMatterEntry(frontmatter, idKey)

    //new Notice(`field value: ${fieldValue}`, 5000)

    if (fieldValue == null) {
      // generate
      const newId = this.generateNoteId()
      // add to the frontmatter
      await this.setNoteId(newId, view)
      // return the id
      return newId
    } else if (fieldValue instanceof Array) {
      return fieldValue[0] // ??
    } else {
      return fieldValue
    }
  }

  async setNoteId(id: string, view: MarkdownView) {
    const frontmatter = this.app.metadataCache.getFileCache(view.file)?.frontmatter
    const fileContent: string = await app.vault.read(view.file)

    const isYamlEmpty: boolean =
      (!frontmatter || frontmatter.length === 0) && !fileContent.match(/^-{3}\s*\n*\r*-{3}/)

    const splitContent = fileContent.split("\n")
    if (isYamlEmpty) {
      splitContent.unshift("---")
      splitContent.unshift(`${this.settings.idField}: ${id}`)
      splitContent.unshift("---")
    } else {
      const startsTest = (element: string) => element.startsWith(`${this.settings.idField}:`)
      const idLine = splitContent.findIndex(startsTest)
      if (idLine > -1) {
        splitContent[idLine] = `${this.settings.idField}: ${id}`
      } else {
        splitContent.splice(1, 0, `${this.settings.idField}: ${id}`)
      }
    }

    const newFileContent = splitContent.join("\n")
    await app.vault.modify(view.file, newFileContent)
  }

  generateNoteId(): string {
    //TODO: Add other id formats
    //const idFormat = this.settings.idFormat;
    return uuidv4()
  }

  replaceNoteTemplateStrings(file: TFile) {
    // TBD
  }
}
