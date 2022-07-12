import * as A from 'fp-ts/lib/Array';
import * as TE from 'fp-ts/lib/TaskEither';
import { QueryCommand,  DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { parseCommit } from './parse-commit';
import { Commit, RemoteServerError } from './types'

type ListCommitsArgs = {
  dynamodb: DynamoDBClient
  entityName: string
  tableName: string
}

type ListCommits = (args: ListCommitsArgs) => (commitId: string) => TE.TaskEither<RemoteServerError, Commit[]>
export const listCommits: ListCommits = ({ dynamodb, entityName, tableName }) => (indexName: string, commitId = '0') => TE.tryCatch(
  async () => {
    const params = {
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: 'entityName = :entityName and commitId > :commitId',
      ExpressionAttributeValues: {
        ':entityName': { S: entityName },
        ':commitId': { S: commitId },
      },
    }

    const data = await dynamodb.send(new QueryCommand(params))

    return A.compact((data.Items || []).map((item) => parseCommit({entityName})(unmarshall(item))))
  },
  (err) => ({
    err,
    msg: 'listCommits: DynamoDB failure',
    type: 'RemoteServerError',
  })
)
