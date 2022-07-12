import { domainEventPipeline } from "@ts-cqrs/pipelines-domain";
import { initAppendDomainEvents, initLoadDomainEvents, InitAdapterArgs } from "@ts-cqrs/adapters-dynamodb";
import { updateIngredient, recipeIngredientUpdatedC, recipeIngredientUpdatedPayloadC } from '../actions/ingredient-update'
import { getEntityState } from '../state';

export const initUpdateIngredientPipeline = (entityName: string, { dynamodb, tableName }: InitAdapterArgs) => domainEventPipeline({
  action: updateIngredient,
  appendDomainEvents: initAppendDomainEvents({ dynamodb, tableName }),
  entityName,
  domainEventC: recipeIngredientUpdatedC,
  getEntityState,
  loadDomainEvents: initLoadDomainEvents({ dynamodb, tableName }),
  payloadC: recipeIngredientUpdatedPayloadC
})



