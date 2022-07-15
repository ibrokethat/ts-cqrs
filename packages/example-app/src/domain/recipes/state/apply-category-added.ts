import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { ApplyDomainEvent } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { RecipeCategoryAdded } from '../events'

export const applyCategoryAdded: ApplyDomainEvent<Recipe, RecipeCategoryAdded> = (event) => (state) => ({
  ...state,
  categories: pipe(
    O.fromNullable(state.categories),
    O.fold(
      () => [event.data.category],
      (categories) => [...categories, event.data.category]
    )
  )
})

