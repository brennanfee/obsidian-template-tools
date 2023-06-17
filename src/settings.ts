export interface UniqueNoteIdSettings {
  idField: string
  idFormat: string
  customIdFormat: string
  idTemplatePlaceholder: string
}

export const DEFAULT_SETTINGS: UniqueNoteIdSettings = {
  idField: "id",
  idFormat: "uuid",
  customIdFormat: "",
  idTemplatePlaceholder: "{{note_id}}",
}
