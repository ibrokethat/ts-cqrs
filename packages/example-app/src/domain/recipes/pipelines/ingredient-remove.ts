import { domainEventPipeline } from "@ts-cqrs/pipelines-domain";
import { initAppendDomainEvents, initLoadDomainEvents, InitAdapterArgs } from "@ts-cqrs/adapters-dynamodb";
import { removeIngredient, recipeIngredientRemovedC, recipeIngredientRemovedPayloadC } from '../actions/ingredient-remove'
import { getEntityState } from '../state';

export const initRemoveIngredientPipeline = (entityName: string, { dynamodb, tableName }: InitAdapterArgs) => domainEventPipeline({
  action: removeIngredient,
  appendDomainEvents: initAppendDomainEvents({ dynamodb, tableName }),
  entityName,
  domainEventC: recipeIngredientRemovedC,
  getEntityState,
  loadDomainEvents: initLoadDomainEvents({ dynamodb, tableName }),
  payloadC: recipeIngredientRemovedPayloadC
})



