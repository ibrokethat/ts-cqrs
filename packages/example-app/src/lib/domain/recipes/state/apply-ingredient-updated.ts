import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { ApplyDomainEvent } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { RecipeIngredientUpdated } from '../events'

export const applyIngredientUpdated: ApplyDomainEvent<Recipe, RecipeIngredientUpdated> = (event) => (state) => ({
  ...state,
  ingredients: pipe(
    O.fromNullable(state.ingredients),
    O.fold(
      () => [],
      (ingredients) => ingredients.map((ingredient) => ingredient.ingredientId === event.data.ingredientId
        ? { ...ingredient, ...event.data }
        : ingredient
      )
    )
  )
})

