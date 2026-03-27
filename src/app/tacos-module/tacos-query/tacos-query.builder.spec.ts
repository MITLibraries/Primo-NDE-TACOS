import { parse, validate, buildSchema } from 'graphql';
import { buildLogSearchEventQuery } from './tacos-query.builder';

describe('TacosQueryBuilder', () => {
  // Define or import the schema from TACOS API
  const schema = buildSchema(`
    type Query {
      logSearchEvent(searchTerm: String!, sourceSystem: String!): LogSearchEventResult
    }

    type LogSearchEventResult {
      phrase: String
      detectors: Detectors
    }

    type Detectors {
      suggestedResources: [SuggestedResource]
    }

    type SuggestedResource {
      title: String
      url: String
    }
  `);

  it('builds a valid GraphQL query', () => {
    const { query } = buildLogSearchEventQuery('foo', 'fake-source-system');

    const ast = parse(query);
    const errors = validate(schema, ast);

    expect(errors).toEqual([]);
  });

  it('builds correct variables', () => {
    const { variables } = buildLogSearchEventQuery('foo', 'fake-source-system');
    expect(variables).toEqual({
      searchTerm: 'foo',
      sourceSystem: 'fake-source-system',
    });
  });
});
