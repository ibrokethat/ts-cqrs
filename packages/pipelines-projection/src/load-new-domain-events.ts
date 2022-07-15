import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { LoadDomainEvents, ProjectionPipelineError } from './types'

type LoadNewdomainEventsArgs<Projection> = {
  entityId: string,
  loadDomainEvents: LoadDomainEvents
  projection: Projection
}
type LoadNewdomainEvents = <Projection>(args: LoadNewdomainEventsArgs<Projection>) => TE.TaskEither<ProjectionPipelineError, unknown[]>

export const loadNewDomainEvents: LoadNewdomainEvents = ({ entityId, loadDomainEvents, projection} ) =>
  pipe(
    loadDomainEvents({ entityId, version: projection.version }),
  )
