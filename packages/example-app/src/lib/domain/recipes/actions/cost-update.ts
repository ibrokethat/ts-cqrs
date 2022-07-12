import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { Action } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { eventC, userC  } from '../types'

const dataC = t.type({ cost: t.number  })

export type RecipeCostUpdatedPayload = t.TypeOf<typeof recipeCostUpdatedPayloadC>
export const recipeCostUpdatedPayloadC = t.type({
  user: userC,
  data: dataC,
})

export type RecipeCostUpdated = t.TypeOf<typeof recipeCostUpdatedC>
export const recipeCostUpdatedC = t.intersection([
  eventC,
  t.type({
    type: t.literal('RecipeCostUpdated'),
    data: dataC
  })
])

type UpdateRecipeCost = Action<Recipe, RecipeCostUpdatedPayload, RecipeCostUpdated>
export const updateRecipeCost: UpdateRecipeCost = ({ entityState, payload} ) =>
  pipe(
    entityState,
    O.fold(
      () => TE.left({ type: 'InvalidActionError', msg: 'Cannot update cost of recipe. Recipe does not exist' } ),
      (recipe) =>
        pipe(
          O.of(recipe.ingredients.length),
          O.fold(
            () => TE.left({ type: 'InvalidActionError', msg: 'Cannot update cost of recipe. Recipe has no ingredients' } ),
            () => TE.right([{
              at: Date.now(),
              data: payload.data,
              meta: { user: payload.user },
              type: 'RecipeCostUpdated',
              version: 1,
            }]),
          )
        )
    )
  )
