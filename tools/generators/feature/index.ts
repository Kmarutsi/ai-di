import { Tree, formatFiles, installPackagesTask, normalizePath, joinPathFragments, getProjects } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { libraryGenerator as library, ngrxGenerator} from '@nrwl/angular/generators';
import { SchematicOptions } from './schema';
import { wrapAngularDevkitSchematic } from '@nrwl/devkit/ngcli-adapter';

export default async function (tree: Tree, schema: SchematicOptions) {
  const featureShell = `${schema.name}-feature-shell`;
  const dataAccess = `${schema.name}-data-access`;

  if (['all', 'feature'].includes(schema.type)) {
    await library(tree, {
      name: featureShell,
      directory: normalizePath(joinPathFragments(...[schema.directory, schema.name])),
      importPath: `@${normalizePath(
        joinPathFragments(...[schema.directory, featureShell])
      )}`,
      lazy: schema.lazy,
      parentModule: normalizePath(
        joinPathFragments(
          ...[
            getProjects(tree).get(schema.app)?.sourceRoot as string,
            'app',
            'app-routing.module.ts',
          ]
        )
      ),
      prefix: schema.prefix,
      routing: schema.routing,
      simpleModuleName: true,
      standaloneConfig: true,
      unitTestRunner: schema.unitTestRunner,
      tags: schema.tags,
      strict: schema.strict,
      skipFormat: true
    });
  }

  if (['all', 'data-access'].includes(schema.type)) {
    await library(tree, {
      name: dataAccess,
      directory: normalizePath(joinPathFragments(...[schema.directory, schema.name])),
      importPath: `@${normalizePath(
        joinPathFragments(...[schema.directory, dataAccess])
      )}`,
      prefix: schema.prefix,
      simpleModuleName: true,
      standaloneConfig: true,
      unitTestRunner: schema.unitTestRunner,
      tags: 'scope:shared,type:data-access',
      strict: schema.strict,
      skipFormat: true
    });

    await ngrxGenerator(tree, {
      name: schema.name,
      directory: `+state`,
      minimal: false,
      module: normalizePath(joinPathFragments(
        ...[
          getProjects(tree).get(
            `${schema.directory.replace(/[/]/g, '-')}-${schema.name}-${
              schema.name
            }-data-access`
          )?.sourceRoot as string,
          `lib`,
          `${schema.name}-data-access.module.ts`,
        ]
      )),
      useDataPersistence: true,
      barrels: true,
      facade: true,
      syntax: 'creators',
      skipFormat: true
    });

    const service = wrapAngularDevkitSchematic(
      '@schematics/angular',
      'service'
    );

    await service(tree, {
      name: schema.name,
      project: `${schema.directory.replace(/[/]/g, '-')}-${schema.name}-${
        schema.name
      }-data-access`
    });
  }

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
