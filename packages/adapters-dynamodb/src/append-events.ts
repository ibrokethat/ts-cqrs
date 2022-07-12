import * as TE from 'fp-ts/lib/TaskEither';
import * as cuid from 'cuid';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { AppendDomainEvents } from '@ts-cqrs/pipelines-domain'
import { InitAdapterArgs } from './types'

export type InitAppendDomainEvents = <DomainEvent>(args: InitAdapterArgs) => AppendDomainEvents<DomainEvent>
export const initAppendDomainEvents: InitAppendDomainEvents = ({ dynamodb, tableName }) => ({ entityName, entityId, version, domainEvents }) => TE.tryCatch(
  async () => {
    const now = Date.now()
    const commitId = cuid()

    const params = {
      TableName: tableName,
      Item: {
        commitId: { S: commitId },
        committedAt: { N: now.toString() },
        entityId: { S: entityId },
        entityName: { S: entityName },
        version: { N: version.toString() },
        events: { S: JSON.stringify(domainEvents) }
      },
      ConditionExpression: 'attribute_not_exists(version)',
      ReturnValues: 'NONE'
    }

    await dynamodb.send(new PutItemCommand(params))
  },
  (err) => (err as Error).name === 'ConditionalCheckFailedException'
  ? {
      type: 'CommitExistsError',
      msg: `Entity of type ${entityName}, ${entityId}${version}`
    }
  : {
      err,
      msg: 'appendEvents: DynamoDB failure',
      type: 'RemoteServerError',
    }
)
