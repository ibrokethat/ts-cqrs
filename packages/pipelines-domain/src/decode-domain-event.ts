import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { DomainEventPipelineError } from './types'

type DecodeDomainEventsArgs<DomainEvent> = {
  domainEvents: unknown[]
  domainEventC: t.Type<DomainEvent, unknown>
}
type DecodeDomainEvents = <DomainEvent>(args: DecodeDomainEventsArgs<DomainEvent>) => E.Either<DomainEventPipelineError, DomainEvent[]>

export const decodeDomainEvents: DecodeDomainEvents = ({ domainEvents, domainEventC} ) =>
  pipe(t.array(domainEventC).decode(domainEvents), E.mapLeft(() => ({type: 'InvalidDomainEventError', msg: ''})))
