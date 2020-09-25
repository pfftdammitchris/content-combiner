export type Fetcher<DataObject = any> = (...args: any[]) => Promise<DataObject[]>

export type Keymap<DataObject> = Partial<Record<keyof DataObject, Mapper<DataObject>>>

export type Mapper<DataObject extends {} = any> =
  | StringMapper
  | ArrayMapper
  | FuncMapper<DataObject>

export type StringMapper = string

export type ArrayMapper = string[]

export interface FuncMapper<DataObject> {
  (item: DataObject): any
}

export type FinalizedKeymap<DataObject> = Partial<
  Record<keyof DataObject, (item: DataObject) => any>
>
