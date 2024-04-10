/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

export class ProductPayloadBuilder {
  constructor() {
    this.payload = {};
  }

  withAnalytics(analytics) {
    this.payload.analytics = analytics;
    return this;
  }

  withActionHistory(actionHistory) {
    this.payload.actionHistory = actionHistory;
    return this;
  }

  withActionCause(actionCause) {
    this.payload.actionCause = actionCause;
    return this;
  }

  withAnonymous(anonymous) {
    this.payload.anonymous = anonymous;
    return this;
  }

  withAQ(aq) {
    this.payload.aq = aq;
    return this;
  }

  withContext(context) {
    this.payload.context = context;
    return this;
  }

  withFieldsToInclude(fieldsToInclude) {
    this.payload.fieldsToInclude = fieldsToInclude;
    return this;
  }

  withCollectionName(collectionName) {
    this.payload.collectionName = collectionName;
    return this;
  }

  withCustomData(customData) {
    this.payload.customData = customData;
    return this;
  }

  withDocuentPosition(documentPosition) {
    this.payload.documentPosition = documentPosition;
    return this;
  }

  withDocumentTitle(documentTitle) {
    this.payload.documentTitle = documentTitle;
    return this;
  }

  withDocumentURL(documentURL) {
    this.payload.documentURL = documentURL;
    return this;
  }

  withDocumentUriHash(documentUriHash) {
    this.payload.documentUriHash = documentUriHash;
    return this;
  }

  withLanguage(language) {
    this.payload.language = language;
    return this;
  }

  withLocale(locale) {
    this.payload.locale = locale;
    return this;
  }

  withFirstResult(firstResult) {
    this.payload.firstResult = firstResult;
    return this;
  }

  withNumberOfResults(numberOfResults) {
    this.payload.numberOfResults = numberOfResults;
    return this;
  }

  withOriginLevel1(originLevel1) {
    this.payload.originLevel1 = originLevel1;
    return this;
  }

  withOriginLevel2(originLevel2) {
    this.payload.originLevel2 = originLevel2;
    return this;
  }

  withOriginLevel3(originLevel3) {
    this.payload.originLevel3 = originLevel3;
    return this;
  }

  withQueryPipeline(queryPipeline) {
    this.payload.queryPipeline = queryPipeline;
    return this;
  }

  withQueryText(queryText) {
    this.payload.queryText = queryText;
    return this;
  }

  withResponseTime(responseTime) {
    this.payload.responseTime = responseTime;
    return this;
  }

  withResults(results) {
    this.payload.results = results;
    return this;
  }

  withReferrer(referrer) {
    this.payload.referrer = referrer;
    return this;
  }

  withSearchQueryUid(searchQueryUid) {
    this.payload.searchQueryUid = searchQueryUid;
    return this;
  }

  withTab(tab) {
    this.payload.tab = tab;
    return this;
  }

  withTimeZone(timeZone) {
    this.payload.timezone = timeZone;
    return this;
  }

  withFacets(facets) {
    this.payload.facets = facets;
    return this;
  }

  withSearchHub(searchHub) {
    this.payload.searchHub = searchHub;
    return this;
  }

  withSourceName(sourceName) {
    this.payload.sourceName = sourceName;
    return this;
  }

  withUserAgent(userAgent) {
    this.payload.userAgent = userAgent;
    return this;
  }

  withClientId(clientId) {
    this.payload.clientId = clientId;
    return this;
  }

  // Method to build the payload
  build() {
    return this.payload;
  }
}

export class Context {
  constructor() {
    this.context = {};
  }

  withContext(key, value) {
    this.context[key] = value;
    return this;
  }

  withHost(host) {
    this.context.host = host;
    return this;
  }

  withInternal(internal) {
    this.context.internal = internal;
    return this;
  }

  // Method to build the context
  build() {
    return this.context;
  }
}

export class CustomDataBuilder {
  constructor() {
    this.customData = {};
  }

  withContext(key, value) {
    this.customData[key] = value;
    return this;
  }

  withContextHost(contextHost) {
    this.customData.context_host = contextHost;
    return this;
  }

  withContextInternal(contextInternal) {
    this.customData.context_internal = contextInternal;
    return this;
  }

  withContentIDKey(contentIDKey) {
    this.customData.contentIDKey = contentIDKey;
    return this;
  }

  withContentIDValue(contentIDValue) {
    this.customData.contentIDValue = contentIDValue;
    return this;
  }

  // Method to build the custom data
  build() {
    return this.customData;
  }
}

export class AnalyticsBuilder {
  constructor() {
    this.analytics = {};
  }

  withActionCause(actionCause) {
    this.analytics.actionCause = actionCause;
    return this;
  }

  withClientTimestamp(clientTimestamp) {
    this.analytics.clientTimestamp = clientTimestamp;
    return this;
  }

  withCustomData(customData) {
    this.analytics.customData = customData;
    return this;
  }

  withDocumentReferrer(documentReferrer) {
    this.analytics.documentReferrer = documentReferrer;
    return this;
  }

  withDocumentLocation(documentLocation) {
    this.analytics.documentLocation = documentLocation;
    return this;
  }

  withOriginContext(originContext) {
    this.analytics.originContext = originContext;
    return this;
  }

  withClientId(clientId) {
    this.analytics.clientId = clientId;
    return this;
  }

  // Method to build the analytics
  build() {
    return this.analytics;
  }
}

export class FacetBuilder {
  constructor() {
    this.facet = {};
  }

  withDelimitingCharacter(delimitingCharacter) {
    this.facet.delimitingCharacter = delimitingCharacter;
    return this;
  }

  withFilterFacetCount(filterFacetCount) {
    this.facet.filterFacetCount = filterFacetCount;
    return this;
  }

  withInjectionDepth(injectionDepth) {
    this.facet.injectionDepth = injectionDepth;
    return this;
  }

  withNumberOfValues(numberOfValues) {
    this.facet.numberOfValues = numberOfValues;
    return this;
  }

  withSortCriteria(sortCriteria) {
    this.facet.sortCriteria = sortCriteria;
    return this;
  }

  withBasePath(basePath) {
    this.facet.basePath = basePath;
    return this;
  }

  withFilterByBasePath(filterByBasePath) {
    this.facet.filterByBasePath = filterByBasePath;
    return this;
  }

  withResultsMustMatch(resultsMustMatch) {
    this.facet.resultsMustMatch = resultsMustMatch;
    return this;
  }

  withCurrentValues(currentValues) {
    this.facet.currentValues = currentValues;
    return this;
  }

  withFreezeCurrentValues(freezeCurrentValues) {
    this.facet.freezeCurrentValues = freezeCurrentValues;
    return this;
  }

  withIsFieldExpanded(isFieldExpanded) {
    this.facet.isFieldExpanded = isFieldExpanded;
    return this;
  }

  withPreventAutoSelect(preventAutoSelect) {
    this.facet.preventAutoSelect = preventAutoSelect;
    return this;
  }

  withType(type) {
    this.facet.type = type;
    return this;
  }

  withFacetId(facetId) {
    this.facet.facetId = facetId;
    return this;
  }

  withField(field) {
    this.facet.field = field;
    return this;
  }

  withLabel(label) {
    this.facet.label = label;
    return this;
  }

  // Method to build the facet
  build() {
    return this.facet;
  }
}
