import { UnitTestRunner } from '@nrwl/angular/src/utils/test-runners';

export interface SchematicOptions {
  name: string;
  app: string;
  type: 'all' | 'feature' | 'data-access';
  directory: string;
  prefix: string;
  routing: boolean;
  lazy: boolean;
  tags: string;
  unitTestRunner: UnitTestRunner;
  strict: boolean;
}
