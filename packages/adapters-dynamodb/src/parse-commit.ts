import * as O from 'fp-ts/lib/Option';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { commitC, Commit } from './types'


type ParseCommitArgs = { entityName: string }
type ParseCommit = (args: ParseCommitArgs) => (item: Record<string, AttributeValue>) => O.Option<Commit>
export const parseCommit: ParseCommit = ({entityName}) => (item) => {
  if (item['entityName'].S !== entityName) {
    return O.none
  }

  return O.getRight(commitC.decode({
    id: item.entityId.S,
    version: item.version.N ? parseInt(item.version.N, 10) : null,
    entity: item.entityName.S,
    commitId: item.commitId.S,
    events: item.events.S ? JSON.parse(item.events.S) : [],
  }))
}
