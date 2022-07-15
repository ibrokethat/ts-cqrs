import * as t from 'io-ts'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Action, AppendDomainEvents, GetEntityState, LoadDomainEvents, DomainEventPipelineError} from './types'
import { decodeDomainEvents } from './decode-domain-event'
import { decodePayload } from './decode-payload'

type DomainEventPipelineArgs<EntityState, DomainEvent, Payload> = {
  action: Action<EntityState, Payload, DomainEvent>
  domainEventC: t.Type<DomainEvent, unknown>
  appendDomainEvents: AppendDomainEvents<DomainEvent>
  entityName: string
  getEntityState: GetEntityState<EntityState, DomainEvent>
  loadDomainEvents: LoadDomainEvents
  payloadC: t.Type<Payload, unknown>
}
type DomainEventPipeline = <EntityState, DomainEvent, Payload>(args: DomainEventPipelineArgs<EntityState, DomainEvent, Payload>)=> (entityId: string, payload: Payload) => TE.TaskEither<DomainEventPipelineError, void>

export const domainEventPipeline: DomainEventPipeline = ({
  action,
  appendDomainEvents,
  domainEventC,
  entityName,
  getEntityState,
  loadDomainEvents,
  payloadC,
}) => (entityId, payload) => pipe(
  TE.fromEither(decodePayload({ payload, payloadC })),
  TE.bindTo('payload'),
  TE.bind('unkownHistory', () => loadDomainEvents({ entityId })),
  TE.bind('domainEventHistory', ({unkownHistory}) => TE.fromEither(decodeDomainEvents({ domainEvents: unkownHistory, domainEventC} ))),
  TE.bind('entityState', ({domainEventHistory}) => TE.fromEither(getEntityState({ domainEvents: domainEventHistory} ))),
  TE.bind('unknownEvents', ({ entityState, payload }) => action({ entityState, payload} )),
  TE.bind('domainEvents', ({unknownEvents}) => TE.fromEither(decodeDomainEvents({domainEvents: unknownEvents, domainEventC}))),
  TE.chain(({domainEvents, domainEventHistory}) => appendDomainEvents({
    entityId,
    domainEvents,
    entityName,
    version: domainEventHistory.length
  })),
)
