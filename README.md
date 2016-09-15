# js-random-tester
JS Random testing tool and new Definition File creator using old versions

Feaures:
1. Create random tests for JavaScript libraries using TypeScript defintion files. 
Popular repository for definition files is: https://github.com/DefinitelyTyped/DefinitelyTyped

Usage:

2. Create new version of TypeScript definition file given an old definition file and new version of library

Usage:
node getNewVersionDTFile.js [libraryName] [pathForOldDefinitionFile] [OPTIONAL- pathForNewDefinitionFile]

Ex: node getNewVersionDTFile.js azure-mobile-apps /Users/Pankajan/Edinburgh/Source/DefinitelyTyped/azure-mobile-apps/azure-mobile-apps.d.ts

Note that, module should be installed using npm before executing this command.

