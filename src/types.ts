export type Fetcher<DataObject = any> = (
  ...args: any[]
) => Promise<DataObject[]>

export type Keymap<DataObject> = Partial<
  Record<keyof DataObject, Mapper<DataObject>>
>

export type Mapper<DataObject extends {} = any> =
  | string
  | string[]
  | ((obj: DataObject) => any)

export type FinalizedKeymap<DataObject> = Partial<
  Record<keyof DataObject, (item: DataObject) => any>
>
