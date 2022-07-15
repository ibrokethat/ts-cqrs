import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'

type DomainEventPipelineErrorBase = {
  msg: string
}

export type CommitExistsError = { type: 'CommitExistsError' } & DomainEventPipelineErrorBase
export type InvalidActionError = { type: 'InvalidActionError' } & DomainEventPipelineErrorBase
export type InvalidDomainEventError = { type: 'InvalidDomainEventError' } & DomainEventPipelineErrorBase
export type InvalidPayloadError = { type: 'InvalidPayloadError' } & DomainEventPipelineErrorBase
export type InvalidStateError = { type: 'InvalidStateError' } & DomainEventPipelineErrorBase
export type RemoteServerError = { type: 'RemoteServerError', err: unknown } & DomainEventPipelineErrorBase
export type DomainEventPipelineError = CommitExistsError |
  InvalidActionError |
  InvalidDomainEventError|
  InvalidPayloadError |
  InvalidStateError |
  RemoteServerError


export type ActionArgs<EntityState, Payload> = {
  entityState: O.Option<EntityState>,
  payload: Payload
}
export type Action<EntityState, Payload, DomainEvent> = (args: ActionArgs<EntityState, Payload>) => TE.TaskEither<DomainEventPipelineError, DomainEvent[]>

export type AppendDomainEventsArgs<DomainEvent> = {
  entityName: string
  entityId: string
  version: number
  domainEvents: DomainEvent[]
}
export type AppendDomainEvents<DomainEvent> = (args: AppendDomainEventsArgs<DomainEvent>) => TE.TaskEither<DomainEventPipelineError, void>


export type ApplyDomainEvent<EntityState, DomainEvent> = (event: DomainEvent) => (state: Partial<EntityState>) => Partial<EntityState>

export type GetEntityStateArgs<DomainEvent> = {
  domainEvents: DomainEvent[]
}
export type GetEntityState<EntityState, DomainEvent> = (args: GetEntityStateArgs<DomainEvent>) => E.Either<DomainEventPipelineError, O.Option<EntityState>>

export type LoadDomainEventsArgs = {
  entityId: string
  version?: number
}
export type LoadDomainEvents = (args: LoadDomainEventsArgs) => TE.TaskEither<DomainEventPipelineError, unknown[]>
