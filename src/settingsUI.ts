import { App, PluginSettingTab, Setting } from "obsidian"
import UniqueNoteIdPlugin from "./main"

export class UniqueNoteIdSettingTab extends PluginSettingTab {
  plugin: UniqueNoteIdPlugin

  constructor(app: App, plugin: UniqueNoteIdPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    containerEl.createEl("h2", { text: "Unique Note ID Settings" })

    new Setting(containerEl)
      .setName("ID Field Name")
      .setDesc("The name to use for the ID field in the Frontmatter")
      .addText((text) =>
        text
          .setPlaceholder("Enter field name")
          .setValue(this.plugin.settings.idField)
          .onChange(async (value) => {
            this.plugin.settings.idField = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("ID Format")
      .setDesc("The format to use of the generated ID")
      .addDropdown((dropDown) => {
        dropDown.addOption("uuid", "UUID")
        dropDown.addOption("zet", "Zettelkasten")
        dropDown.addOption("custom", "Custom")
        dropDown
          .onChange(async (value) => {
            this.plugin.settings.idFormat = value
            await this.plugin.saveSettings()
          })
          .setValue(this.plugin.settings.idFormat)
      })

    new Setting(containerEl)
      .setName("Custom ID Format")
      .setDesc("The format to use to generate a unique ID")
      .addText((text) =>
        text
          .setPlaceholder("Enter custom format")
          .setValue(this.plugin.settings.customIdFormat)
          .onChange(async (value) => {
            this.plugin.settings.customIdFormat = value
            await this.plugin.saveSettings()
          })
      )

    containerEl.createEl("br")
    containerEl.createEl("h2", {
      text: "Template Variables",
    })

    new Setting(containerEl)
      .setName("Note ID Template Format")
      .setDesc("The replacement format to use for the Note ID")
      .addText((text) =>
        text
          .setPlaceholder("Enter ID template format")
          .setValue(this.plugin.settings.idTemplatePlaceholder)
          .onChange(async (value) => {
            this.plugin.settings.idTemplatePlaceholder = value
            await this.plugin.saveSettings()
          })
      )
  }
}
