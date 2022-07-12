import * as t from 'io-ts'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

type PipelineErrorBase = {
  msg: string
}

export type CommitExistsError = { type: 'CommitExistsError' } & PipelineErrorBase
export type InvalidActionError = { type: 'InvalidActionError' } & PipelineErrorBase
export type InvalidDomainEventError = { type: 'InvalidDomainEventError' } & PipelineErrorBase
export type InvalidPayloadError = { type: 'InvalidPayloadError' } & PipelineErrorBase
export type InvalidStateError = { type: 'InvalidStateError' } & PipelineErrorBase
export type RemoteServerError = { type: 'RemoteServerError', err: unknown } & PipelineErrorBase
export type PipelineError = CommitExistsError |
  InvalidActionError |
  InvalidDomainEventError|
  InvalidPayloadError |
  InvalidStateError |
  RemoteServerError


export type ActionArgs<EntityState, Payload> = {
  entityState: O.Option<EntityState>,
  payload: Payload
}
export type Action<EntityState, Payload, DomainEvent> = (args: ActionArgs<EntityState, Payload>) => TE.TaskEither<PipelineError, DomainEvent[]>

export type AppendDomainEventsArgs<DomainEvent> = {
  entityName: string
  entityId: string
  version: number
  domainEvents: DomainEvent[]
}
export type AppendDomainEvents<DomainEvent> = (args: AppendDomainEventsArgs<DomainEvent>) => TE.TaskEither<PipelineError, void>


export type ApplyDomainEvent<EntityState, DomainEvent> = (event: DomainEvent) => (state: Partial<EntityState>) => Partial<EntityState>

export type GetEntityStateArgs<DomainEvent> = {
  domainEvents: DomainEvent[]
}
export type GetEntityState<EntityState, DomainEvent> = (args: GetEntityStateArgs<DomainEvent>) => E.Either<PipelineError, O.Option<EntityState>>

export type LoadDomainEventsArgs = {
  entityId: string
  version?: number
}
export type LoadDomainEvents = (args: LoadDomainEventsArgs) => TE.TaskEither<PipelineError, unknown[]>

type DomainEventPipelineArgs<EntityState, DomainEvent, Payload> = {
  action: Action<EntityState, Payload, DomainEvent>
  domainEventC: t.Type<DomainEvent, unknown>
  appendDomainEvents: AppendDomainEvents<DomainEvent>
  entityName: string
  getEntityState: GetEntityState<EntityState, DomainEvent>
  loadDomainEvents: LoadDomainEvents
  payloadC: t.Type<Payload, unknown>
}
type DomainEventPipeline = <EntityState, DomainEvent, Payload>(args: DomainEventPipelineArgs<EntityState, DomainEvent, Payload>)=> (entityId: string, payload: Payload) => TE.TaskEither<PipelineError, void>

export const domainEventPipeline: DomainEventPipeline = ({
  action,
  appendDomainEvents,
  domainEventC,
  entityName,
  getEntityState,
  loadDomainEvents,
  payloadC,
}) => (entityId, payload) => pipe(
  decodePayload({ payload, payloadC }),
  TE.bindTo('payload'),
  TE.bind('unkownHistory', () => loadDomainEvents({ entityId })),
  TE.bind('domainEventHistory', ({unkownHistory}) => decodeDomainEvents({ domainEvents: unkownHistory, domainEventC} )),
  TE.bind('entityState', ({domainEventHistory}) => TE.fromEither(getEntityState({ domainEvents: domainEventHistory} ))),
  TE.bind('unknownEvents', ({ entityState, payload }) => action({ entityState, payload} )),
  TE.bind('domainEvents', ({unknownEvents}) => decodeDomainEvents({domainEvents: unknownEvents, domainEventC})),
  TE.chain(({domainEvents, domainEventHistory}) => appendDomainEvents({
    entityId,
    domainEvents,
    entityName,
    version: domainEventHistory.length
  })),
)

type DecodePayloadArgs<Payload> = {
  payload: Payload,
  payloadC: t.Type<Payload, unknown>
}
type DecodePayload = <Payload>(args: DecodePayloadArgs<Payload>) => TE.TaskEither<PipelineError, Payload>

const decodePayload: DecodePayload = ({payload, payloadC} ) => {
  return pipe(TE.fromEither(payloadC.decode(payload)), TE.mapLeft(() => ({type: 'InvalidPayloadError', msg: ''})))
}



type DecodeDomainEventsArgs<DomainEvent> = {
  domainEvents: unknown[]
  domainEventC: t.Type<DomainEvent, unknown>
}
type DecodeDomainEvents = <DomainEvent>(args: DecodeDomainEventsArgs<DomainEvent>) => TE.TaskEither<PipelineError, DomainEvent[]>

export const decodeDomainEvents: DecodeDomainEvents = ({ domainEvents, domainEventC} ) => {
  const rights = A.rights(domainEvents.map((event) => domainEventC.decode(event)))
  return (rights.length === domainEvents.length) ? TE.right(rights) : TE.left({type: 'InvalidDomainEventError', msg: ''})
}
