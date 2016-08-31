"use strict";
var ts = require('typescript');
var fs = require('fs');
var path = require('path');
var util = require('./util.js');

function printChildTypes(root) {
    ts.forEachChild(root, function (n) {
        return console.log(n.kind + ' ' + ts.SyntaxKind[n.kind]);
    });
}
function getKind(isKind, roots) {
    var result = [];
    roots.forEach(function (root) {
        if (isKind(root.kind))
            result.push(root);
        ts.forEachChild(root, function (node) {
            if (isKind(node.kind))
                result.push(node);
        });
    });
    return result;
}
function hasKind(isKind, roots) {
    var result = false;
    roots.forEach(function (root) {
        ts.forEachChild(root, function (node) {
            if (isKind(node.kind)) {
                result = true;
                return;
            }
        });
    });
    return result;
}
function getKindRecurse(isKind, roots) {
    var result = [];
    roots.forEach(function (root) {
        return aggregate(root);
    });
    return result;
    function aggregate(node) {
        if (isKind(node.kind)) {
            result.push(node);
        }
        ts.forEachChild(node, aggregate);
    }
}
function isClassInterfaceRecursively(kind) {
    return kind === ts.SyntaxKind.InterfaceDeclaration || kind === ts.SyntaxKind.ClassDeclaration;
}
function isTypeAliasDeclarationRecursively(kind) {
    return kind === ts.SyntaxKind.TypeAliasDeclaration;
}
function isKindNamespaceDeclaration(kind) {
    return kind === ts.SyntaxKind.NamespaceImport;
}
function isClassDeclaration(kind) {
    return kind === ts.SyntaxKind.ClassDeclaration;
}
function isKindModuleDeclaration(kind) {
    return kind === ts.SyntaxKind.ModuleDeclaration;
}
function isKindModuleBlock(kind) {
    return kind === ts.SyntaxKind.ModuleBlock;
}
function isKindInterfaceDeclaration(kind) {
    return kind === ts.SyntaxKind.InterfaceDeclaration;
}
function isKindEnumDeclaration(kind) {
    return kind === ts.SyntaxKind.EnumDeclaration;
}
function isKindEnumMember(kind) {
    return kind === ts.SyntaxKind.EnumMember;
}
function isKindFunctionDeclaration(kind) {
    return kind === ts.SyntaxKind.FunctionDeclaration || kind === ts.SyntaxKind.MethodDeclaration || kind === ts.SyntaxKind.MethodSignature;
}
function isKindConstructSignature(kind) {
    return kind === ts.SyntaxKind.ConstructSignature || kind === ts.SyntaxKind.Constructor || kind === ts.SyntaxKind.CallSignature;
}
function isKindExportAssignment(kind) {
    return kind === ts.SyntaxKind.ExportAssignment;
}
function isKindIdentifier(kind) {
    return kind === ts.SyntaxKind.Identifier;
}
function isKindLiteralToken(kind) {
    return ts.SyntaxKind.FirstLiteralToken <= kind && kind <= ts.SyntaxKind.LastLiteralToken;
}
function isKindHeritageClause(kind) {
    return kind === ts.SyntaxKind.HeritageClause;
}
function isKindPropertyDeclaration(kind) {
    return kind === ts.SyntaxKind.PropertyDeclaration;
}
function isKindPropertySignature(kind) {
    return kind === ts.SyntaxKind.PropertySignature;
}
function isKindTypeReference(kind) {
    return kind === ts.SyntaxKind.TypeReference;
}
function isKindExpressionWithTypeArguments(kind) {
    return kind === ts.SyntaxKind.ExpressionWithTypeArguments;
}
function isKindQuestionToken(kind) {
    return kind === ts.SyntaxKind.QuestionToken;
}
function isKindTypeParameter(kind) {
    return kind === ts.SyntaxKind.TypeParameter;
}
function isKindVariableStatement(kind) {
    return kind === ts.SyntaxKind.VariableStatement;
}
function isKindVariableDeclarationList(kind) {
    return kind === ts.SyntaxKind.VariableDeclarationList;
}
function isKindVariableDeclaration(kind) {
    return kind === ts.SyntaxKind.VariableDeclaration;
}
function isKindKeyword(kind) {
    return ts.SyntaxKind.FirstKeyword <= kind && kind <= ts.SyntaxKind.LastKeyword;
}
function isKindParameter(kind) {
    return kind === ts.SyntaxKind.Parameter;
}
function getClassInterfaceRecursively(roots) {
    return getKindRecurse(isClassInterfaceRecursively, roots);
}
function getTypeAliasDeclarationRecursively(roots) {
    return getKindRecurse(isTypeAliasDeclarationRecursively, roots);
}
function getNamespaceDeclarations(roots) {
    return getKind(isKindNamespaceDeclaration, roots);
}
function getClassDeclarations(roots) {
    return getKind(isClassDeclaration, roots);
}
function getModulesDeclarations(roots) {
    return getKind(isKindModuleDeclaration, roots);
}
function getModuleBlocks(roots) {
    return getKind(isKindModuleBlock, roots);
}
function getInterfaceDeclarations(roots) {
    return getKind(isKindInterfaceDeclaration, roots);
}
function getInterfaceDeclarationsRecurse(roots) {
    return getKindRecurse(isKindInterfaceDeclaration, roots);
}
function getEnumDeclarations(roots) {
    return getKind(isKindEnumDeclaration, roots);
}
function getEnumMembers(roots) {
    return getKind(isKindEnumMember, roots);
}
function getFunctionDeclarations(roots) {
    return getKind(isKindFunctionDeclaration, roots);
}
function getConstructSignatures(roots) {
    return getKind(isKindConstructSignature, roots);
}
function getExportAssigments(roots) {
    return getKind(isKindExportAssignment, roots);
}
function getLiteralTokens(roots) {
    return getKind(isKindLiteralToken, roots);
}
function getHeritageClauses(roots) {
    return getKind(isKindHeritageClause, roots);
}
function getExpressionWithTypeArguments(roots) {
    return getKind(isKindExpressionWithTypeArguments, roots);
}
function getTypeReferences(roots) {
    return getKind(isKindTypeReference, roots);
}
function getIdentifiers(roots) {
    return getKind(isKindIdentifier, roots);
}
function getTypeParameters(roots) {
    return getKind(isKindTypeParameter, roots);
}
function getVariableStatements(roots) {
    return getKind(isKindVariableStatement, roots);
}
function getVariableDeclarationLists(roots) {
    return getKind(isKindVariableDeclarationList, roots);
}
function getVariableDeclarations(roots) {
    return getKind(isKindVariableDeclaration, roots);
}
function getKeywords(roots) {
    return getKind(isKindKeyword, roots);
}
function getParameters(roots) {
    return getKind(isKindParameter, roots);
}
function getPropertyDeclarations(roots) {
    return getKind(isKindPropertyDeclaration, roots);
}
// TODO ts.PropertySignature exposed in newer version
// https://github.com/Microsoft/TypeScript/blob/master/src/compiler/types.ts#L590
function getPropertySignatures(roots) {
    return getKind(isKindPropertySignature, roots);
}
function hasQuestionToken(roots) {
    return hasKind(isKindQuestionToken, roots);
}
// type guards
function isIdentifier(node) {
    return isKindIdentifier(node.kind);
}
function isLiteralToken(node) {
    return isKindLiteralToken(node.kind);
}
function isHeritageClause(node) {
    return isKindHeritageClause(node.kind);
}
function isPropertySignature(node) {
    return isKindPropertySignature(node.kind);
}
function isTypeReference(node) {
    return isKindTypeReference(node.kind);
}
function isExpressionWithTypeArguments(node) {
    return isKindExpressionWithTypeArguments(node.kind);
}
function isVariableStatement(node) {
    return isKindVariableStatement(node.kind);
}
function isVariableDeclaration(node) {
    return isKindVariableDeclaration(node.kind);
}
function isVariableDeclarationList(node) {
    return isKindVariableDeclarationList(node.kind);
}
function isKeyword(node) {
    return isKindKeyword(node.kind);
}
function isParameter(node) {
    return isKindParameter(node.kind);
}

/**
 * Function to extract functions/constructors from given node
 * @param mbs
 * @param isFunctions
 * @returns {Array}
 */
function extractFunctions(mbs, isFunctions) {
    var fds;
    if(isFunctions)
        fds = getFunctionDeclarations(mbs);
    else
        fds = getConstructSignatures(mbs);

    var result = [];
    fds.map(function (fd) {
        if (fd.name !== undefined || !isFunctions) {
            var isStatic = false;
            if(fd.flags===ts.NodeFlags.Static) {
                isStatic = true;
            }
            var pds = getParameters([fd]);
            var returnType = 'void';
            if (fd.type) {
                returnType = getTypeForProperty(fd.type);
            } else if(!isFunctions) {
                returnType = mbs[0].name.text;
            }
            var params = [];
            pds.forEach(function (pd) {
                if(pd.type===undefined) {
                    params.push(undefined);
                } else {
                    var varType = getVariableType(pd.type, pd.questionToken === undefined);
                    varType['name'] = pd.name.text;
                    params.push(varType);
                }
            });
            if(isFunctions)
                result.push({name: fd.name.text, arguments: params, returnType: returnType, isStatic:isStatic});
            else
                result.push({name: 'constructor', arguments: params, returnType: returnType, isStatic:isStatic});
        }
    });
    return result;
}

/**
 * Extract proper node objects for given variable names
 * @param cn
 * @param mbs
 * @param exportVariables
 * @param vd
 * @param sf
 * @returns {*[]}
 */
function getProperNode(cn, mbs, exportVariables, vd, sf) {
    var currentNode = [cn];
    for (var i = 0; i < exportVariables.length; i++) {
        if (exportVariables[i] !== undefined) {
            var currentVar = exportVariables[i].split('.');
            for (var j = 0; j < currentVar.length; j++) {
                if (j === 0) {
                    currentNode = detectExportedModule(currentVar[j], mbs, vd, sf);
                } else {
                    if (currentNode.length>0) {
                        currentNode = detectExportedModule(currentVar[j], currentNode);
                    }
                }
            }
        }
    }
    for(i=0;i<currentNode.length;i++) {
        if(currentNode[i].heritageClauses!==undefined  && currentNode[i].heritageClauses.length > 0 &&
            currentNode[i].heritageClauses[0].types !== undefined && currentNode[i].heritageClauses[0].types.length > 0 &&
            currentNode[i].heritageClauses[0].types[0].expression !== undefined &&
            currentNode[i].heritageClauses[0].types[0].expression.text !== undefined) {
            var extendedNode = getProperNode(cn, mbs, [currentNode[i].heritageClauses[0].types[0].expression.text], vd, sf)
            if(extendedNode!==undefined) {
                for(var j=0; j<extendedNode.length;j++) {
                    currentNode.push(extendedNode[j]);
                }
            }
        }
    }
    return currentNode;
}

/**
 * Main method to process given file
 * @param project
 * @param filename
 */
function processFile(project, filename) {
    var result = {};
    try {
        source = String(fs.readFileSync(filename));
        var sf = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest);

        var mds = getModulesDeclarations([sf]);
        var vd = getVariableStatements([sf]);

        var mbs = getModuleBlocks(mds);
        var ea = getExportAssigments(mbs);

        var exportVariables = [];

        var totalClassInterface = getClassInterfaceRecursively([sf]);
        var typeAliases = getTypeAliasDeclarationRecursively([sf]);

        var types = {};
        if(typeAliases!==undefined && typeAliases.length>0){
            for(var i=0; i<typeAliases.length;i++) {
                var typeAl = [];
                if(typeAliases[i].type.types) {
                    for(var j=0; j<typeAliases[i].type.types.length;j++) {
                        typeAl.push(getTypeForProperty(typeAliases[i].type.types[j]));
                    }
                } else if(typeAliases[i].type.type !== undefined) {
                    typeAl.push(getTypeForProperty(typeAliases[i].type.type));
                }
                types[typeAliases[i].name.text] = typeAl;
            }
        }
        var definedClasses = [];
        for (i = 0; i < totalClassInterface.length; i++) {
            var curClass = totalClassInterface[i];
            var constructors = extractFunctions([curClass], false);
            var methodNamesAndArguments = extractFunctions([curClass], true);
            var propSig = getPropertySignatures([curClass]);
            var definedClass = {name: curClass.name.text};
            var definedProperties = {};
            //console.log(curClass.name.text);
            for (j = 0; j < propSig.length; j++) {
                var curProp = propSig[j];
                var propvalues = {};
                propvalues['optional'] = curProp.questionToken !== undefined;
                //console.log('        ' + curProp.name.text);
                propvalues['type'] = getTypeForProperty(curProp.type, curProp);
                definedProperties[curProp.name.text] = propvalues;
            }
            definedClass['properties'] = definedProperties;
            definedClass['constructors'] = constructors;
            definedClass['methods'] = methodNamesAndArguments;
            definedClasses.push(definedClass);
        }

        ea.map(function (dd) {
            if(dd.expression.text !== undefined){
                exportVariables.push(dd.expression.text);
            } else if (dd.expression !== undefined && dd.expression.text === undefined) {
                exportVariables.push(source.substring(ts.skipTrivia(source, dd.expression.pos), dd.expression.end))
            }
        });
        if (exportVariables.length === 0) {
            var vs = getVariableStatements([sf]);
            vs.map(function (dd) {
                var varDeclared = dd.declarationList.declarations[0].type;
                var s = source.substring(ts.skipTrivia(source, varDeclared.pos), varDeclared.end);
                if (s !== undefined) {
                    exportVariables.push(s);
                }
            });
        }
        var tmpCurrentNodes = getProperNode(mbs, mbs, exportVariables, vd, sf);
        var currentNode=[];
        var unreachable = false;
        for(i=0; i<tmpCurrentNodes.length; i++) {
            var tmp = tmpCurrentNodes[i];
                while (!unreachable && tmp.kind === ts.SyntaxKind.VariableDeclaration) {
                    var varDeclared = tmp.type;
                    exportVariables = [];
                    var s = source.substring(ts.skipTrivia(source, varDeclared.pos), varDeclared.end);
                    if(s.split(" ").length>1 && varDeclared.exprName!==undefined) {
                        s = source.substring(ts.skipTrivia(source, varDeclared.exprName.pos), varDeclared.exprName.end);
                    }
                    if (s !== undefined) {
                        exportVariables.push(s);
                        tmp = getProperNode([tmp], mbs, exportVariables, vd, sf);
                    } else {
                        unreachable = true;
                    }
                }
            if(tmp.length)
                for(j=0; j<tmp.length; j++)
                    currentNode.push(tmp[j]);
            else
                currentNode.push(tmp);
        }

        var tmpCurNodeIndex = [];
        tmpCurrentNodes = [];
        for(var x=0;x<currentNode.length;x++){
            var index = currentNode[x].pos+'_'+currentNode.end;
            if(tmpCurNodeIndex.indexOf(index)===-1) {
                tmpCurNodeIndex.push(index);
                tmpCurrentNodes.push(currentNode[x]);
            }
        }

        currentNode = tmpCurrentNodes;
        methodNamesAndArguments = [];
        constructors = [];
        for(i=0; i<currentNode.length;i++) {
            var tmpMethodNamesAndArguments;
            var tmpconstructors;
            if (currentNode[i].kind === ts.SyntaxKind.ModuleDeclaration) {
                tmpMethodNamesAndArguments = extractFunctions(getModuleBlocks([currentNode[i]]), true);
                tmpconstructors = extractFunctions(getModuleBlocks([currentNode[i]]), false)
            } else {
                tmpMethodNamesAndArguments = extractFunctions([currentNode[i]], true);
                tmpconstructors = extractFunctions([currentNode[i]], false)
            }
            for(j=0; j<tmpMethodNamesAndArguments.length; j++) {
                methodNamesAndArguments.push(tmpMethodNamesAndArguments[j]);
            }
            for(j=0; j<tmpconstructors.length; j++) {
                constructors.push(tmpconstructors[j]);
            }
        }

        var finalResults = {isMethod:false};
        finalResults['classes'] = definedClasses;
        finalResults['methods'] = methodNamesAndArguments;
        finalResults['constructors'] = constructors;
        finalResults['types'] = types;
        for(var k=0;k<currentNode.length;k++) {
            if (currentNode[k].kind === ts.SyntaxKind.FunctionDeclaration) {
                finalResults['isMethod'] = true;
            }
        }
        console.log(JSON.stringify(finalResults));
        return finalResults;
    } catch (err) {
        console.log(err.stack);
        console.log('Unable to process : ' + filename);
    }
}

/**
 * Method to identify initialized (globally accessible) module
 * @param currentVar
 * @param mbs
 * @param vd
 * @param sf
 * @returns {Array}
 */
function detectExportedModule(currentVar, mbs, vd, sf) {
    if(currentVar==='__Autolinker') currentVar = '___Autolinker';
    var suitableModule = [];

    if (vd !== undefined) {
        vd.map(function (svd) {
            svd.declarationList.declarations.forEach(function (vd) {
                var variableName = vd.name.text;
                if (currentVar === variableName) {
                    suitableModule.push(vd);
                }
            })
        });
    }

    getVariableStatements(mbs).map(function (svd) {
        svd.declarationList.declarations.forEach(function (vd) {
            var variableName = vd.name.text;
            if (currentVar === variableName) {
                suitableModule.push(vd);
            }
        })
    });

    getFunctionDeclarations(mbs).map(function (sfd) {
        var variableName = sfd.name.text;
        if (currentVar === variableName) {
            suitableModule.push(sfd);
        }
    });

    getInterfaceDeclarations(mbs).map(function (sfd) {
        var variableName = sfd.name.text;
        if (currentVar === variableName) {
            suitableModule.push(sfd);
        }
    });

    getNamespaceDeclarations(mbs).map(function (sfd) {
        var variableName = sfd.name.text;
        if (currentVar === variableName) {
            suitableModule.push(sfd);
        }
    });

    getClassDeclarations(mbs).map(function (sfd) {
        var variableName = sfd.name.text;
        if (currentVar === variableName) {
            suitableModule.push(sfd);
        }
    });

    getModulesDeclarations(mbs).map(function (sfd) {
        var variableName = sfd.name.text;
        if (currentVar === variableName) {
            suitableModule.push(sfd);
        }
    });

    if (sf !== undefined) {
        getFunctionDeclarations([sf]).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule.push(sfd);
            }
        });
    }

    if (sf !== undefined) {
        getModulesDeclarations([sf]).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule.push(sfd);
            }
        });
    }

    if (sf !== undefined) {
    getInterfaceDeclarations([sf]).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule.push(sfd);
            }
        });
    }
    if (sf !== undefined) {
    getClassDeclarations([sf]).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule.push(sfd);
            }
        });
    }
    for (var i = 0; i < mbs.length; i++) {
        if (mbs[i].body !== undefined) {
            getInterfaceDeclarations([mbs[i].body]).map(function (sfd) {
                var variableName = sfd.name.text;
                if (currentVar === variableName) {
                    suitableModule.push(sfd);
                }
            });
        }
    }
    if(suitableModule.length==0) {
        getClassInterfaceRecursively(mbs).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule.push(sfd);
            }
        });
    }
    if(suitableModule.length==0 && sf !== undefined) {
        getClassInterfaceRecursively([sf]).map(function (sfd) {
            var variableName = sfd.name.text;
            if (currentVar === variableName) {
                suitableModule.push(sfd);
            }
        });
    }
    return suitableModule;
}

/**
 * Method to extract proper variable type for given node
 * @param nodeType
 * @param node
 * @returns {{object: boolean, array: boolean, function: boolean, properties: {}}}
 */
function getTypeForProperty(nodeType) {
    var results = {library:library, object: false, array: false, function: false, paranthesis: false, predicate: false, properties: {}}
    var prop = {};
    if (nodeType.kind === ts.SyntaxKind.FunctionType) {
        //Function type. Complex so just mark as function and skip
        prop['kind'] = 'function';
        results.function = true;
    } else if (nodeType.kind === ts.SyntaxKind.ArrayType) {
        //Array type detected
        results.array = true;
        results.properties = {kind:'array', type:getTypeForProperty(nodeType.elementType)};
    } else if (nodeType.kind === ts.SyntaxKind.ParenthesizedType) {
        //Array type detected
        results.paranthesis = true;
        results.properties = {kind:'paranthesis', type:getTypeForProperty(nodeType.type)};
    } else if (nodeType.kind === ts.SyntaxKind.TypeQuery) {
        results = getTypeForProperty(nodeType.exprName);
    } else if (nodeType.kind === ts.SyntaxKind.QualifiedName) {
        results.object = true;
        results.properties = {kind:'complex', type:source.substring(ts.skipTrivia(source, nodeType.pos), nodeType.end)};
    } else if (nodeType.kind === ts.SyntaxKind.TypePredicate) {
        results.predicate = true;
        results.properties = {kind:'boolean', parameter:nodeType.parameterName, type:getTypeForProperty(nodeType.type)};
    } else {
        var tokenValue = ts.tokenToString(nodeType.kind);
        if (tokenValue === undefined) {
            //token value undefined so complex type. Further analyse
            if(nodeType.text !== undefined) {
                prop = {kind:'complex', type:nodeType.text};
            }else if (nodeType.members !== undefined) {
                //TODO: if object recursively call this method
                results.object = true;
                prop = {kind:'complex', type:{}};
                var members = nodeType.members;
                for (var i = 0; i < members.length; i++) {
                    if (members[i].name !== undefined) {
                        prop.type[members[i].name.text] = getTypeForProperty(members[i].type);
                    }
                }
            } else if(nodeType.elementTypes!==undefined) {
                if(nodeType.elementTypes.length==0) {
                    prop = {kind: 'array', type: []};
                } else {
                    prop = {kind: 'tuple', type: []};
                    for (i = 0; i < nodeType.elementTypes.length; i++) {
                        prop.type.push(getTypeForProperty(nodeType.elementTypes[i]));
                    }
                }
            } else if(nodeType.types !== undefined) {
                prop = {kind:'union', type:[]};
                for (i = 0; i < nodeType.types.length; i++) {
                    //Multiple types. Loop every one
                    var curType = nodeType.types[i];
                    prop.type.push(getTypeForProperty(curType))
                }
            }else if(nodeType.typeName !== undefined) {
                var typeName = nodeType.typeName;
                var tmpProp = source.substring(ts.skipTrivia(source, typeName.pos), typeName.end);
                if (tmpProp === undefined) {
                    prop = {kind:'complex'};
                } else {
                    tmpProp = tmpProp.split(".");
                    prop = {kind: tmpProp[tmpProp.length - 1]};
                }
            } else {
                prop = {kind:'complex'};
            }
        } else {
            //Simple type
            prop ={kind:tokenValue};
        }
        results.properties = prop;
    }
    return results;
}

/**
 * Util method to call 'getTypeForProperty' and build result object
 * @param node
 * @param isCompulsury
 * @returns {{type: string, array: boolean, optional: boolean}}
 */
function getVariableType(node, isCompulsury) {
    var currentNode = node;
    var varType = {type: '', optional: !isCompulsury};
    if (currentNode === undefined) {
        varType.type = 'any';
    } else {
        varType.type = getTypeForProperty(currentNode);
    }
    return varType;
}

//Constant to store Root folder of DefinitelyTyped project
var ROOT = '/Users/Pankajan/Edinburgh/Source/DefinitelyTyped/';
//Global variable to store current source code text
var source;
var library;
module.exports = {
    getFunctions: function (projectName, fileName) {
        library = projectName;
        return processFile(projectName, ROOT + projectName + '/' + fileName + '.d.ts');
    }
};