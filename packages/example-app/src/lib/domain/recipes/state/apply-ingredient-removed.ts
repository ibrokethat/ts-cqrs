import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { ApplyDomainEvent } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { RecipeIngredientRemoved } from '../events'

export const applyIngredientRemoved: ApplyDomainEvent<Recipe, RecipeIngredientRemoved> = (event) => (state) => ({
  ...state,
  ingredients: pipe(
    O.fromNullable(state.ingredients),
    O.fold(
      () => [],
      (ingredients) => ingredients.filter((ingredient) => ingredient.ingredientId !== event.data.ingredientId)
    )
  )
})






