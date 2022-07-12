import { domainEventPipeline } from "@ts-cqrs/pipelines-domain";
import { initAppendDomainEvents, initLoadDomainEvents, InitAdapterArgs } from "@ts-cqrs/adapters-dynamodb";
import { updateRecipeCost, recipeCostUpdatedC, recipeCostUpdatedPayloadC } from '../actions/cost-update'
import { getEntityState } from '../state';

export const initRecipeCostUpdatePipeline = (entityName: string, { dynamodb, tableName }: InitAdapterArgs) => domainEventPipeline({
  action: updateRecipeCost,
  appendDomainEvents: initAppendDomainEvents({ dynamodb, tableName }),
  entityName,
  domainEventC: recipeCostUpdatedC,
  getEntityState,
  loadDomainEvents: initLoadDomainEvents({ dynamodb, tableName }),
  payloadC: recipeCostUpdatedPayloadC
})



