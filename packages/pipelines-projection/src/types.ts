import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'

type ProjectionPipelineErrorBase = {
  msg: string
}

export type CommitExistsError = { type: 'CommitExistsError' } & ProjectionPipelineErrorBase
export type InvalidDomainEventError = { type: 'InvalidDomainEventError' } & ProjectionPipelineErrorBase
export type InvalidPayloadError = { type: 'InvalidPayloadError' } & ProjectionPipelineErrorBase
export type InvalidProjectionError = { type: 'InvalidProjectionError' } & ProjectionPipelineErrorBase
export type RemoteServerError = { type: 'RemoteServerError', err: unknown } & ProjectionPipelineErrorBase
export type ProjectionPipelineError = CommitExistsError |
  InvalidDomainEventError|
  InvalidPayloadError |
  InvalidProjectionError |
  RemoteServerError

export type LoadDomainEventsArgs = {
  entityId: string
}
export type LoadDomainEvents = (args: LoadDomainEventsArgs) => TE.TaskEither<ProjectionPipelineError, unknown[]>

export type ApplyDomainEvent<Projection, DomainEvent> = (event: DomainEvent) => (state: Partial<Projection>) => Partial<Projection>

export type UpdateProjectionArgs<Projection, DomainEvent> = {
  projection: Projection
  domainEvents: DomainEvent[]
}
export type UpdateProjection<Projection, DomainEvent> = (args: UpdateProjectionArgs<Projection, DomainEvent>) => E.Either<ProjectionPipelineError, Projection>

export type LoadProjectionArgs = {
  entityId: string
}
export type LoadProjection = (args: LoadProjectionArgs) => TE.TaskEither<ProjectionPipelineError, unknown>


export type SaveProjectionArgs<Projection> = {
  projection: Projection
}
export type SaveProjection<Projection> = (args: SaveProjectionArgs<Projection>) => TE.TaskEither<ProjectionPipelineError, void>
