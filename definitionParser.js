"use strict";
var ts = require('typescript');
var fs = require('fs');
var path = require('path');

function printChildTypes(root) {
  ts.forEachChild(root, function (n) { return console.log(n.kind + ' ' + ts.SyntaxKind[n.kind]); });
}
function getKind(isKind, roots) {
  var result = [];
  roots.forEach(function (root) {
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
  roots.forEach(function (root) { return aggregate(root); });
  return result;
  function aggregate(node) {
    if (isKind(node.kind)) {
      result.push(node);
    }
    ts.forEachChild(node, aggregate);
  }
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
var results = {};


function extractFunctions(mbs, currentResult, indent) {
  var fds = getFunctionDeclarations(mbs);
  fds.map(function (fd) {
    if (fd.name !== undefined) {
      if (PRINT_DEBUG || PRINT_METHODS) process.stdout.write(indent + fd.name.text);
      printReturnType(fd, '  returns ');
      var pds = getParameters([fd]);
      pds.forEach(function (pd) {
        printText(pd.name, '  parameter ');
        var parameterType = printReturnType(pd, '    ');
        if (PRINT_DEBUG || PRINT_METHODS) process.stdout.write(' - ' + parameterType);
        if (parameterType.startsWith('array') && parameterType.includes('-')) {
          currentResult.arguments.array += 1;
          parameterType = parameterType.split('-')[1];
        }
        var totalSimple = true;
        switch (parameterType) {
          case 'boolean':
            currentResult.arguments.boolean += 1;
            break;
          case 'string':
            currentResult.arguments.string += 1;
            break;
          case 'number':
            currentResult.arguments.number += 1;
            break;
          case 'any':
            currentResult.arguments.any += 1;
            break;
          case 'array':
            currentResult.arguments.array += 1;
            totalSimple = false;
            break;
          case 'union_basic':
            break;
          default:
            currentResult.arguments.complex += 1;
            totalSimple = false;
            break;
        }
        if (totalSimple) {
          currentResult.arguments.totalSimple += 1;
        } else {
          currentResult.arguments.totalComplex += 1;
        }
      });
      if (PRINT_DEBUG || PRINT_METHODS) process.stdout.write('\n');
    }
  });
}

function processFile(project, filename) {
  console.log('File >>> ' + filename);
  var currentResult = {
    filename:filename,
    arguments:{
      boolean:0,string:0,number:0, any:0, array:0, complex:0, totalSimple:0, totalComplex:0
    },
    variables:{
      boolean:0,string:0,number:0, any:0, array:0, complex:0
    }
  };
  var source = String(fs.readFileSync(filename));
  var sf = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest);

  /* var text = sf.text;

   var syntaxTree = TypeScript.Parser.parse('syntaxNode.d.ts', source, True);
   console.log(JSON.stringify(syntaxTree.toJSON(), null, 4));
   */
  if(PRINT_DEBUG) console.log('\n# Modules');
  var mds = getModulesDeclarations([sf]);
  //mds.map(m => m.name.text).sort().forEach(nm => console.log(nm));
  var mbs = getModuleBlocks(mds);
  var subMds = getModulesDeclarations(mbs);
  subMds.map(function (md) { return md.name.text; }).sort().forEach(function (nm) { if(PRINT_DEBUG) return console.log(nm); });
  if(PRINT_DEBUG) console.log('\n# Functions');
  extractFunctions(mbs, currentResult , '');

  results[project] = currentResult;

  if(PRINT_DEBUG) console.log('\n# Enums');
  var eds = getEnumDeclarations(mbs);
  eds.map(function (ed) {
    if(PRINT_DEBUG) console.log(ed.name.text);
    var ems = getEnumMembers([ed]);
    ems.forEach(function (em) {
      printText(em.name, '  ');
      var lts = getLiteralTokens([em]);
      lts.forEach(function (lt) { return printText(lt, '    = '); });
    });
  });
  if(PRINT_DEBUG) console.log('\n# Interfaces');
  var ifds = getInterfaceDeclarations(mbs);

  ifds.map(function (ifd) {
    if(PRINT_DEBUG || PRINT_METHODS) console.log(ifd.name.text);
    extractFunctions([ifd], currentResult, '     ');
    var tps = getTypeParameters([ifd]);
    tps.forEach(function (tp) {
      if(PRINT_DEBUG) console.log('  of ' + tp.name.text);
    });
    var hcs = getHeritageClauses([ifd]);
    var ewtas = getExpressionWithTypeArguments(hcs);
    ewtas.forEach(function (ewta) {
      printIdentifiers([ewta], '  ');
      printTypeReferences([ewta], '    ');
    });
    var pss = getPropertySignatures([ifd]);
    pss.forEach(function (ps) {
      printText(ps.name, '  prop: ');
      printType(ps, '    ');
    });
  });
  if(PRINT_DEBUG) console.log('\n# Variables');
  var vbs = getVariableStatements(mbs);
  var vdls = getVariableDeclarationLists(vbs);
  var vds = getVariableDeclarations(vdls);
  vds.map(function (vd) {
    printIdentifiers([vd], '');
    var keyTypes = printType(vd, '  ');
    for (var i = 0; i < keyTypes.length; i++) {
      switch (keyTypes[i]){
        case 'boolean':
          currentResult.variables.boolean += 1;
          break;
        case 'string':
          currentResult.variables.string += 1;
          break;
        case 'number':
          currentResult.variables.number += 1;
          break;
        case 'any':
          currentResult.variables.any += 1;
          break;
        case 'array':
          currentResult.variables.array += 1;
          break;
        default:
          currentResult.variables.complex += 1;
          break;
      }
    }
  });
  if(WRITE_FILE) {
    fs.appendFile('message.txt', JSON.stringify(currentResult) + ',', function (err) {

    });
  }
  /*if(currentResult.arguments.totalSimple>5) {
   console.log(currentResult);
   }*/
  //printChildTypes(sf);
}
exports.main = main;
function printText(node, indent) {
  if (isIdentifier(node))
    if(PRINT_DEBUG) console.log(indent + node.text);
    else if (isLiteralToken(node))
      if(PRINT_DEBUG) console.log(indent + node.text);
      else
      if(PRINT_DEBUG) console.log(indent + 'name kind ' + node.kind);
}
function printType(node, indent) {
  printTypeReferences([node], indent);
  var keywords = printKeywords([node], indent); // if simple types like string, bool
  if (hasQuestionToken([node]))
    if(PRINT_DEBUG) console.log(indent + '?');
  return keywords;
}
function printIdentifiers(nodes, indent) {
  var ids = getIdentifiers(nodes);
  ids.forEach(function (id) { if(PRINT_DEBUG) return console.log(indent + id.text); });
}
function printTypeReferences(nodes, indent) {
  var trs = getTypeReferences(nodes);
  trs.forEach(function (tr) { return printIdentifiers(trs, indent); });
}
function printKeywords(nodes, indent) {
  var resultList = [];
  var kws = getKeywords(nodes);
  kws.forEach(function (kw) {
    switch (kw.kind) {
      case ts.SyntaxKind.AnyKeyword:
        if(PRINT_DEBUG) console.log(indent + 'any_type');
        resultList.push('any');
        break;
      case ts.SyntaxKind.BooleanKeyword:
        if(PRINT_DEBUG) console.log(indent + 'boolean');
        resultList.push('boolean');
        break;
      case ts.SyntaxKind.StringKeyword:
        if(PRINT_DEBUG) console.log(indent + 'string');
        resultList.push('string');
        break;
      case ts.SyntaxKind.NumberKeyword:
        if(PRINT_DEBUG) console.log(indent + 'number');
        resultList.push('number');
        break;
      case ts.SyntaxKind.ArrayType:
        if(PRINT_DEBUG) console.log(indent + 'array');
        resultList.push('array');
        break;
      default:
        if(PRINT_DEBUG) console.log(indent + ts.SyntaxKind[kw.kind]);
        resultList.push('complex');
    }
  });
  return resultList;
}

function printReturnType(node, indent){
  var tr = node;
  if(tr.type===undefined) {
    if(PRINT_DEBUG) console.log(indent + 'any');
    return 'any';
  }
  var currentNode = tr.type;
  var returnType = '';
  var baseReturnType = '';
  var currentKind = tr.type.kind;
  if(ts.SyntaxKind.ArrayType == currentKind){
    currentKind = tr.type.elementType.kind;
    currentNode = tr.type.elementType;
    returnType = 'array ';
    baseReturnType = 'array';
  }
  var switchReturnType = ' ';
  switch(currentKind) {
    case ts.SyntaxKind.TypeReference:
      switchReturnType = 'complex';
      if(currentNode.typeName.kind == ts.SyntaxKind.QualifiedName) {
        returnType += currentNode.typeName.left.text + '.' + currentNode.typeName.right.text;
      } else if (currentNode.typeName.kind == ts.SyntaxKind.Identifier) {
        returnType += currentNode.typeName.text;
      } else {
        if(PRINT_DEBUG)  console.log();
      }
      break;
    case ts.SyntaxKind.ArrayType:
      returnType += 'array';
      switchReturnType = 'array';
      break;
    case ts.SyntaxKind.BooleanKeyword:
      returnType +=  'boolean';
      switchReturnType = 'boolean';
      break;
    case ts.SyntaxKind.StringKeyword:
      returnType += 'string';
      switchReturnType = 'string';
      break;
    case ts.SyntaxKind.NumberKeyword:
      returnType += 'number';
      switchReturnType = 'number';
      break;
    case ts.SyntaxKind.AnyKeyword:
      returnType += 'any';
      switchReturnType = 'any';
      break;
    case ts.SyntaxKind.VoidKeyword:
      returnType += 'void';
      switchReturnType = 'void';
      break;
    case ts.SyntaxKind.UnionType:
      switchReturnType = 'union_basic';
      returnType += '{ ';
      currentNode.types.forEach(function(union) {
        if(union.kind == ts.SyntaxKind.StringKeyword)
          returnType += 'string, ';
        else if(union.kind == ts.SyntaxKind.BooleanKeyword)
          returnType += 'boolean, ';
        else if(union.kind == ts.SyntaxKind.NumberKeyword)
          returnType += 'number, ';
        else if(union.kind == ts.SyntaxKind.AnyKeyword)
          returnType += 'any, ';
        else {
          returnType += 'complex, ';
          switchReturnType = 'union_complex';
        }
      });
      returnType += '}';
      break;
    case ts.SyntaxKind.FunctionType:
      returnType += 'function';
      switchReturnType = 'complex';
      break;
    default:
      returnType += 'complex';
      switchReturnType = 'complex';
      break
  }
  baseReturnType += '-'+switchReturnType;
  if(PRINT_DEBUG) console.log(indent + ts.SyntaxKind[tr.type.kind] + ' : ' + returnType);
  return baseReturnType;
}

function main(ROOT, cb) {
  fs.readdir( ROOT, function( err, files ) {
    if(err) throw err;
    files.forEach(function(file){
      var filePath = path.resolve(ROOT, file);
      fs.stat(filePath, function(err, stats) {
//                if(file=='absolute' && !file.startsWith('.') && stats && stats.isDirectory()) {
        if(!file.startsWith('.') && stats && stats.isDirectory()) {
          fs.exists(path.resolve(ROOT, file, file + '.d.ts'), function(exists) {
            if (exists) {
              processFile(file, ROOT + file + '/' + file + '.d.ts');
            }
          });
        }
      });
    });
    return results;
  });
}

function printResults(data) {
  //console.log(data);
}

var WRITE_FILE = false;
var PRINT_DEBUG = false;
var PRINT_METHODS = true;
var ROOT = '/Users/Pankajan/Edinburgh/Source/DefinitelyTyped/';

var projectName = 'error-stack-parser';
//    var filename = '/Users/Pankajan/Edinburgh/Source/DefinitelyTyped/error-stack-parser/error-stack-parser.d.ts';
//    var filename = '/Users/Pankajan/Edinburgh/Source/DefinitelyTyped/errorhandler/errorhandler.d.ts';
processFile(projectName,  ROOT + projectName + '/' + projectName + '.d.ts');

/*main(ROOT, function (data) {
 printResults(data);
 });*/

