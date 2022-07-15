import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { Action } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { eventC, userC  } from '../types'

const dataC = t.type({
  category: t.string
})

export type RecipeCategoryAddedPayload = t.TypeOf<typeof recipeCategoryAddedPayloadC>
export const recipeCategoryAddedPayloadC = t.type({
  user: userC,
  data: dataC
})

export type RecipeCategoryAdded = t.TypeOf<typeof recipeCategoryAddedC>
export const recipeCategoryAddedC = t.intersection([
  eventC,
  t.type({
    type: t.literal('RecipeCategoryAdded'),
    data: dataC
  })
])

type AddCategory = Action<Recipe, RecipeCategoryAddedPayload, RecipeCategoryAdded>
export const addCategory: AddCategory = ({ entityState, payload} ) =>
  pipe(
    entityState,
    O.fold(
      () => TE.left({ type: 'InvalidActionError', msg: 'Cannot add category to recipe. Recipe does not exist' } ),
      () => TE.right([{
        at: Date.now(),
        data: payload.data,
        meta: { user: payload.user },
        type: 'RecipeCategoryAdded',
        version: 1,
      }]),
    )
  )

