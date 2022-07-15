import * as t from 'io-ts'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { decodeDomainEvents } from './decode-domain-events'
import { decodePayload } from './decode-payload'
import { decodeProjection } from './decode-projection'
import { loadNewDomainEvents } from './load-new-domain-events'
import { LoadDomainEvents, LoadProjection, ProjectionPipelineError, SaveProjection, UpdateProjection } from './types'

type ProjectionPipelineArgs<Projection, DomainEvent, Payload> = {
  domainEventC: t.Type<DomainEvent, unknown>
  entityName: string
  loadDomainEvents: LoadDomainEvents
  loadProjection: LoadProjection
  payloadC: t.Type<Payload, unknown>
  projectionC: t.Type<Projection, unknown>
  saveProjection: SaveProjection<Projection>
  updateProjection: UpdateProjection<Projection, DomainEvent>
}
type ProjectionPipeline = <Projection, DomainEvent, Payload>(args: ProjectionPipelineArgs<Projection, DomainEvent, Payload>)=> (entityId: string, payload: Payload) => TE.TaskEither<ProjectionPipelineError, void>

export const projectionPipeline: ProjectionPipeline = ({
  domainEventC,
  entityName,
  updateProjection,
  loadDomainEvents,
  loadProjection,
  payloadC,
  projectionC,
  saveProjection,
}) => (entityId, payload) => pipe(
  TE.fromEither(decodePayload({ payload, payloadC })),
  TE.bindTo('payload'),
  TE.bind('unknownProjection', () => loadProjection({ entityId })),
  TE.bind('currentProjection', ({unknownProjection}) =>  TE.fromEither(decodeProjection({ projection: unknownProjection, projectionC }))),
  TE.bind('unknownEvents', ({ currentProjection }) => loadNewDomainEvents({ entityId, projection: currentProjection, loadDomainEvents})),
  TE.bind('domainEvents', ({unknownEvents}) => TE.fromEither(decodeDomainEvents({domainEvents: unknownEvents, domainEventC}))),
  TE.bind('updatedProjection', ({currentProjection, domainEvents}) => TE.fromEither(updateProjection({ domainEvents, projection: currentProjection} ))),
  TE.chain(({updatedProjection}) => saveProjection({
    entityId,
    updatedProjection,
    entityName,
    version: '?'
  })),
)
