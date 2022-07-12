import * as t from 'io-ts'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export type DomainEvent = t.TypeOf<typeof domainEventC>
export const domainEventC = t.type({
  at: t.string,
  data: t.UnknownRecord,
  meta: t.UnknownRecord,
  type: t.string,
  version: t.number,
})


export type Commit = t.TypeOf<typeof commitC>
export const commitC = t.type({
  id: t.string,
  version: t.number,
  entity: t.string,
  commitId: t.string,
  events: t.array(domainEventC)
})

export type RemoteServerError = {
  err: unknown
  msg: string
  type: 'RemoteServerError'
}

export type InitAdapterArgs = {
  dynamodb: DynamoDBClient
  tableName: string
}
