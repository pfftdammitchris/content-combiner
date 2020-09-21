export type Fetcher<DataObject = any> = (
  ...args: any[]
) => Promise<DataObject[]>

export type Keymap<DataObject> = Partial<
  Record<keyof DataObject, Keymapper<DataObject>>
>

// Value of a target key
export type Keymapper<DataObject> =
  | string
  | string[]
  | ((obj: DataObject) => any)

export type FinalizedKeymap<DataObject> = Partial<
  Record<keyof DataObject, (item: DataObject) => any>
>
