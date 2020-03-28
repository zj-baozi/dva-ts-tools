/**
 * @file
 * Test runner
 */

import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';

import {
    reactJSMakePropsAndStateInterfaceTransformFactoryFactory,
    reactStatelessFunctionMakePropsTransformFactoryFactory,
    reactMovePropTypesToClassTransformFactoryFactory,
    reactRemovePropTypesAssignmentTransformFactoryFactory,
    reactRemoveStaticPropTypesMemberTransformFactoryFactory,
    collapseIntersectionInterfacesTransformFactoryFactory,
    reactRemovePropTypesImportTransformFactoryFactory,
    allTransforms,
    compile,
    TransformFactoryFactory,
    classInstanceVariablesTransformFactoryFactory,
} from '../src';


/** Map between a transform and its test folder */
const transformToFolderMap: [string, TransformFactoryFactory[]][] = [
    ['class-instance-variables-transform',[classInstanceVariablesTransformFactoryFactory]],
    ['react-js-make-props-and-state-transform', [reactJSMakePropsAndStateInterfaceTransformFactoryFactory]],
    ['react-stateless-function-make-props-transform', [reactStatelessFunctionMakePropsTransformFactoryFactory]],
    ['react-remove-static-prop-types-member-transform', [reactRemoveStaticPropTypesMemberTransformFactoryFactory]],
    ['react-remove-prop-types-assignment-transform', [reactRemovePropTypesAssignmentTransformFactoryFactory]],
    ['collapse-intersection-interfaces-transform', [collapseIntersectionInterfacesTransformFactoryFactory]],
    ['react-move-prop-types-to-class-transform', [reactMovePropTypesToClassTransformFactoryFactory]],
    ['react-remove-prop-types-import', [reactRemovePropTypesImportTransformFactoryFactory]],
    ['end-to-end', allTransforms],
    ['dva-connect-transform', allTransforms],
    ['dva-model-transform', allTransforms]
];

const isJestUpdateSnapshotEnabled = !!_.intersection(process.argv, ['-u', '--updateSnapshot']).length;

for (const [testFolderName, getFactory] of transformToFolderMap) {
    describe(testFolderName.replace(/\-/g, ' ').replace('transform', ''), () => {
        for (const folderName of fs.readdirSync(path.join(__dirname, testFolderName))) {
            const folder = path.join(path.join(__dirname, testFolderName, folderName));
            if (fs.statSync(folder).isDirectory()) {
                it(`${testFolderName} ${folderName}`, async () => {
                    const inputPath = path.join(folder, 'input.tsx');
                    const outputPath = path.join(folder, 'output.tsx');
                    const result = compile(inputPath, getFactory, {
                        singleQuote: true,
                        printWidth: 120,
                        tabWidth: 2,
                        trailingComma: 'all',
                    });
                    if (isJestUpdateSnapshotEnabled) {
                        await writeFile(outputPath, result);
                    }
                    const output = await readFile(outputPath);
                    expect(stripEmptyLines(result)).toEqual(stripEmptyLines(output));
                });
            }
        }
    });
}

/**
 * Remove extra empty lines
 * @param s A file text
 */
function stripEmptyLines(s: string) {
    const newLineRegex = /\n|\r\n/;
    return s.split(newLineRegex).filter((l) => l.trim()).join('\n');
}

/**
 * Read a string file
 * @param pathToFile Path to a string file
 */
function readFile(pathToFile: string) {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(pathToFile, (error, buffer) => {
            if (error) { return reject(error); }
            resolve(buffer.toString());
        });
    });
}

/**
 * Read a file
 * @param pathToFile Path to a string file
 * @param contents Contents of the file
 */
function writeFile(pathToFile: string, contents: string) {
    return new Promise<string>((resolve, reject) => {
        fs.writeFile(pathToFile, contents, (error) => {
            if (error) { return reject(error); }
            resolve();
        });
    });
}
