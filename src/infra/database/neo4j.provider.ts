import neo4j, { Driver, Session } from 'neo4j-driver';
import { injectable } from 'inversify';
import { env } from '../env/index.js';

@injectable()
export class Neo4jProvider {
  private driver: Driver;

  constructor() {
    this.driver = neo4j.driver(
      env.NEO4J_URI,
      neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD)
    );
  }

  async getSession(): Promise<Session> {
    return this.driver.session();
  }

  async close(): Promise<void> {
    await this.driver.close();
  }
}
