export function buildLogSearchEventQuery(
  searchTerm: string,
  sourceSystem: string,
): { query: string; variables: { searchTerm: string; sourceSystem: string } } {
  const query = `
    query LogSearchEvent($searchTerm: String!, $sourceSystem: String!) {
      logSearchEvent(searchTerm: $searchTerm, sourceSystem: $sourceSystem) {
        phrase
        detectors {
          suggestedResources {
            title
            url
          }
        }
      }
    }
  `;

  return {
    query,
    variables: {
      searchTerm,
      sourceSystem,
    },
  };
}
