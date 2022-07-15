import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { ApplyDomainEvent } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { RecipeIngredientAdded } from '../events'

export const applyIngredientAdded: ApplyDomainEvent<Recipe, RecipeIngredientAdded> = (event) => (state) => ({
  ...state,
  ingredients: pipe(
    O.fromNullable(state.ingredients),
    O.fold(
      () => [event.data],
      (ingredients) => [...ingredients, event.data]
    )
  )
})
