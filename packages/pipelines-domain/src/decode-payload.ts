import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { DomainEventPipelineError } from './types'

type DecodePayloadArgs<Payload> = {
  payload: unknown,
  payloadC: t.Type<Payload, unknown>
}
type DecodePayload = <Payload>(args: DecodePayloadArgs<Payload>) => E.Either<DomainEventPipelineError, Payload>

export const decodePayload: DecodePayload = ({payload, payloadC} ) =>
  pipe(payloadC.decode(payload), E.mapLeft(() => ({type: 'InvalidPayloadError', msg: ''})))
