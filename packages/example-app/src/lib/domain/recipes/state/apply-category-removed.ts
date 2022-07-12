import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { ApplyDomainEvent } from '@ts-cqrs/pipelines-domain'
import { Recipe } from '../entity'
import { RecipeCategoryRemoved } from '../events'

export const applyCategoryRemoved: ApplyDomainEvent<Recipe, RecipeCategoryRemoved> = (event) => (state) => ({
  ...state,
  categories: pipe(
    O.fromNullable(state.categories),
    O.fold(
      () => [],
      (categories) => categories.filter((category) => category !== event.data.category)
    )
  )
})
