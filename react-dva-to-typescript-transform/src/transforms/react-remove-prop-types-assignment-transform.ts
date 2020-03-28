import * as ts from "typescript";

import * as helpers from "../helpers";

export type Factory = ts.TransformerFactory<ts.SourceFile>;

/**
 * Remove Component.propTypes statements
 *
 * @example
 * Before:
 * class SomeComponent extends React.Component<{foo: number;}, {bar: string;}> {}
 * SomeComponent.propTypes = { foo: React.PropTypes.string }
 *
 * After
 * class SomeComponent extends React.Component<{foo: number;}, {bar: string;}> {}
 */
export function reactRemovePropTypesAssignmentTransformFactoryFactory(
  typeChecker: ts.TypeChecker
): Factory {
  return function reactRemovePropTypesAssignmentTransformFactory(
    context: ts.TransformationContext
  ) {
    return function reactRemovePropTypesAssignmentTransform(
      sourceFile: ts.SourceFile
    ) {
      const visited = ts.updateSourceFileNode(
        sourceFile,
        sourceFile.statements.filter(
          (s) => !helpers.isReactPropTypeAssignmentStatement(s)
        )
      );
      ts.addEmitHelpers(visited, context.readEmitHelpers());
      return visited;
    };
  };
}
