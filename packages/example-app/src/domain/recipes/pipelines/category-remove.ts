import { domainEventPipeline } from '@ts-cqrs/pipelines-domain'
import { initAppendDomainEvents, initLoadDomainEvents, InitAdapterArgs } from "@ts-cqrs/adapters-dynamodb";
import { removeCategory, recipeCategoryRemovedC, recipeCategoryRemovedPayloadC } from '../actions/category-remove'
import { getEntityState } from '../state';

export const initRemoveCategoryPipeline = (entityName: string, { dynamodb, tableName }: InitAdapterArgs) => domainEventPipeline({
  action: removeCategory,
  appendDomainEvents: initAppendDomainEvents({ dynamodb, tableName }),
  entityName,
  domainEventC: recipeCategoryRemovedC,
  getEntityState,
  loadDomainEvents: initLoadDomainEvents({ dynamodb, tableName }),
  payloadC: recipeCategoryRemovedPayloadC
})
