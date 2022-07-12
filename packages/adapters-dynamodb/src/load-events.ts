import * as TE from 'fp-ts/lib/TaskEither';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { InitAdapterArgs } from './types'
import { LoadDomainEvents } from '@ts-cqrs/pipelines-domain'

export type InitLoadDomainEvents = (args: InitAdapterArgs) => LoadDomainEvents
export const initLoadDomainEvents: InitLoadDomainEvents = ({ tableName, dynamodb}) => ({ entityId, version = 0 }) => TE.tryCatch(
  async () => {
    const params = {
      TableName: tableName,
      ConsistentRead: true,
      KeyConditionExpression: 'entityId = :id and version >= :v',
      ExpressionAttributeValues: {
        ':id': { S: entityId },
        ':v': { N: version.toString() },
      }
    }

    const data = await dynamodb.send(new QueryCommand(params))
    return (data.Items || [])
      .map((item) => unmarshall(item))
      .flatMap((item) => item['events'].s)
  },
  (err) => ({
    err,
    msg: 'loadEvents: DynamoDB failure',
    type: 'RemoteServerError',
  })
)
