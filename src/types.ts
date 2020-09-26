export type Fetcher<DataObject = any> = (
  ...args: any[]
) => Promise<DataObject | DataObject[]>

export type Keymap<DataObject> = Map<string, Mapper<DataObject>>

export type ConsumerKeymap<DataObject> = Record<string, Mapper<DataObject>>

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
