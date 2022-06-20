import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';
import * as path from 'path';

export default function(schema: any): Rule {
  return chain([
    externalSchematic('@nrwl/angular', 'lib', {
      name: !schema.name.includes('-feature-shell')
        ? `${schema.name}-feature-shell`
        : schema.name,
      directory:
        schema.directory +
        `/${
          schema.name.includes('-feature-shell')
            ? schema.name.replace('-feature-shell', '')
            : schema.name
        }`,
      prefix: schema.prefix,
      simpleModuleName: true,
      style: schema.style,
      routing: schema.routing,
      lazy: schema.lazy,
      parentModule: schema.parentModule,
      unitTestRunner: schema.unitTestRunner,
      tags: schema.tags
    }),
    externalSchematic('@nrwl/angular', 'library', {
      name: `${
        schema.name.includes('data-access-')
          ? schema.name.replace('data-access-', '')
          : schema.name
      }-data-access`,
      directory:
        schema.directory +
        `/${
          schema.name.includes('data-access-')
            ? schema.name.replace('data-access-', '')
            : schema.name
        }`,
      unitTestRunner: schema.unitTestRunner,
      prefix: schema.prefix,
      style: schema.style,
      tags: 'scope:shared,type:data-access',
      simpleModuleName: true
    }),
    externalSchematic('@nrwl/angular', 'ngrx', {
      name: schema.name,
      root: false,
      module: path.join(
        'libs',
        schema.directory,
        schema.name,
        `${schema.name}-data-access`,
        `src`,
        `lib`,
        `${schema.name}-data-access.module.ts`
      ),
      facade: true,
      syntax: 'creators'
      // useDataPersistence: true
    }),
    externalSchematic('@schematics/angular', 'service', {
      name: schema.name,
      project: `${schema.directory.replace(/\//g, '-')}-${schema.name.replace(
        /\//g,
        '-'
      )}-${schema.name.replace(/\//g, '-')}-data-access`
    })
  ]);
}

