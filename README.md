# js-random-tester
##JS Random testing tool and new Definition File creator using old versions

Random Testing for JavaScript is relatively harder than typed language because of its dynamic nature. TypeScript helps to solve this by defining types which can be combined with a library as a definition file. Popular repository for definition files is: https://github.com/DefinitelyTyped/DefinitelyTyped.

In this project, two problems have been tried to resolve by combining definitions files and JavaScript libraries. 

##Features:

###Create random tests for JavaScript libraries using TypeScript defintion files. 

####Usage:
```
node randomTestGenerator.js [libraryName] [pathForDefinitionFile] [OPTIONAL- pathForRandomTestFile]
```

####Ex:
```
node randomTestGenerator.js benchmark [DefinitelyTyped_ROOT_Folder]/benchmark/benchmark.d.ts
```

(assuming that benchmark is already installed via NPM)

###Create new version of TypeScript definition file given an old definition file and new version of library

####Usage:
```
node getNewVersionDTFile.js [libraryName] [pathForOldDefinitionFile] [OPTIONAL- pathForNewDefinitionFile]
```

####Ex: 
```
node getNewVersionDTFile.js azure-mobile-apps [DefinitelyTyped_ROOT_Folder]/azure-mobile-apps/azure-mobile-apps.d.ts
```

Note that, particular module should be installed using npm before executing these commands.

