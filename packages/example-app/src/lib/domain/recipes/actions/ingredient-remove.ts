import * as t from 'io-ts';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function'
import { Action } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { eventC, userC  } from '../types'

const dataC = t.type({
  ingredientId: t.string,
})

export type RecipeIngredientRemovedPayload = t.TypeOf<typeof recipeIngredientRemovedPayloadC>
export const recipeIngredientRemovedPayloadC = t.type({
  user: userC,
  data: dataC
})

export type RecipeIngredientRemoved = t.TypeOf<typeof recipeIngredientRemovedC>
export const recipeIngredientRemovedC = t.intersection([
  eventC,
  t.type({
    type: t.literal('RecipeIngredientRemoved'),
    data: dataC
  })
])

type IngredientRemove = Action<Recipe, RecipeIngredientRemovedPayload, RecipeIngredientRemoved>
export const removeIngredient: IngredientRemove = ({ entityState, payload} ) =>
  pipe(
    entityState,
    O.fold(
      () => TE.left({ type: 'InvalidActionError', msg: `Cannot update ingredient in recipe. Recipe does not exist` } ),
      (recipe) =>
        pipe(
          O.of(recipe.ingredients.find(ingredient => ingredient.ingredientId === payload.data.ingredientId)),
          O.fold(
            () => TE.left({ type: 'InvalidActionError', msg: 'Cannot remove ingredient from recipe. Ingedient does not exist in recipe' } ),
            () => TE.right([{
              at: Date.now(),
              data: payload.data,
              meta: { user: payload.user },
              type: 'RecipeIngredientRemoved',
              version: 1,
            }]),
          )
        )
    )
  )

