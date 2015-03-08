function parse()
    {
        putMessage("\nP A R S I N G ...\n-----------------\n[" + tokens + "]");
        //Reinforcing values of variables from earlier:
        inQuote = false;
        assignId = false;
        printExpr = false;
        inIntExpr = false;
        firstInt = false;
        inBoolExpr = false;
        firstObj = false;
        //assignExpr = false;
        scope = 0;
        treeDepth = 0;
        tempLoc = 0;
        // Grab the next token.
        currentToken = getNextToken();
        // First parse is Program Production
        parseProgram();
        // Report the results.
        //putMessage("\n>>>" + parseErrors + " parse error(s) found.<<<");
        putMessage("\nProducing Symbol Table & Syntax Tree...");
        printSymbolTable();
        //printCST(); Not Needed
        printAST(); 
    }
    
 function parseProgram()
    {
        seeEssTee.push(["Program", treeDepth]);
        //eyyEssTee.push(["StatementBlock", scope]);
        parseStatement();
        checkToken("EOF");
    }

 function parseStatement()
 {
        treeDepth++;
        //scope++;
        seeEssTee.push(["Statement", treeDepth]);
        //eyyEssTee.push(["StatementBlock", scope]);
        if (tokenVerify("type")) //Must check for type *before* char.
        {
        parseVarDecl();
        }
        else if (tokenVerify("while")) //"words" must go before char.
        {
        parseWhileStatement();
        }
        else if (tokenVerify("if"))
        {
        parseIfStatement();
        }
        else if (tokenVerify("print"))
        {
        printExpr = true;
        tempLoc = tokenIndex;
        checkToken("print");
        eyyEssTee.push(["print", scope]);
        checkToken("(");
        //scope++;
        parseExpr();
        checkToken(")");
        //scope--
        printExpr = false;
        }
        else if (tokenVerify("char"))
        {
        assignId = true;
        eyyEssTee.push(["=", scope]);
        tempLoc = tokenIndex;
        parseId();
        assignId = false;
        checkToken("=");
        //assignExpr = true; No need for
        parseExpr();
        //assignId = false;
        }
        else if (tokenVerify("{"))
        {
        eyyEssTee.push(["StatementBlock", scope]);
        checkToken("{");
        scope++;
        parseStatementList();
        checkToken("}");
        scope--;
        }

        else elseError();
        //scope--;
        treeDepth--;
 }

 function parseWhileStatement()
 {
    treeDepth++;
    seeEssTee.push(["WhileStatement", treeDepth]);

    checkToken("while");
    eyyEssTee.push(["while", scope]);
    parseBooleanExpr();
    checkToken("{");
    scope++;
    eyyEssTee.push(["StatementBlock", scope]);
    scope++;
    parseStatementList();
    checkToken("}");
    scope -= 2;
    treeDepth--;
 }

function parseIfStatement()
{
    treeDepth++;
    seeEssTee.push(["IfStatement", treeDepth]);
    checkToken("if");
    eyyEssTee.push(["if", scope]);
    parseBooleanExpr();
    checkToken("{");
    eyyEssTee.push(["StatementBlock", scope+1]);
    scope++;
    parseStatementList();
    checkToken("}");
    scope--;
    treeDepth--;
 }

function parseStatementList()
{
    treeDepth++;
    seeEssTee.push(["StatementList", treeDepth]);
    if (tokenVerify("print") || tokenVerify("type") 
    || tokenVerify("char") || tokenVerify("{")
    || tokenVerify("while") || tokenVerify("if"))
    {
    parseStatement();
    parseStatementList();
    }
    else
        {
            epsilon();
        }
    treeDepth--;
}

function parseExpr()
{
    treeDepth++;
    seeEssTee.push(["Expr", treeDepth]);
    if (tokenVerify("digit"))
    {
    parseIntExpr();
    }
    else if (tokenVerify("quote"))
    {
    parseStringExpr();
    }
    else if (tokenVerify("(") || tokenVerify("boolVal"))
    {
        parseBooleanExpr();
    }
    else if (tokenVerify("char"))
    {
    parseId();
    }
    else elseError();
    treeDepth--;
}

function parseIntExpr()
{
    treeDepth++;
    inIntExpr = true;
    firstInt = true;
    seeEssTee.push(["IntExpr", treeDepth]);
    parseDigit();
    if (tokenVerify("op"))
    {
        firstInt = false;
        parseOp();
        eyyEssTee.push([tempOp, scope+1]);
        scope++;
        eyyEssTee.push([tempDigit, scope+1]);
        parseExpr();
        scope--;
    }
    else
    {
        eyyEssTee.push([tempDigit, scope+1]);
    }
    inIntExpr = false;
    treeDepth--;
}

function parseStringExpr()
{
    treeDepth++;
    seeEssTee.push(["StringExpr", treeDepth]);
    inQuote = true;
    checkToken("quote");
    parseCharList();
    checkToken("quote");
    inQuote = false;
    eyyEssTee.push([tempString, scope+1]);
    tempString = "";
    treeDepth--;
}

function parseBooleanExpr()
{
    treeDepth++;
    inBoolExpr = true;
    seeEssTee.push(["BooleanExpr", treeDepth]);
    if(tokenVerify("("))
    {
        checkToken("(");
            firstObj = true;
        parseExpr();
            firstObj = false;
        checkToken("=");
        checkToken("=");
            eyyEssTee.push(["==", scope+1]);
            scope++;
            eyyEssTee.push([tempBoolExpr, scope+1]);
            parseExpr();
            scope--;
        checkToken(")");
    }
    else if (tokenVerify("boolVal"))
    {
        parseBoolVal();
    }
    else elseError();
    inBoolExpr = false;
    treeDepth--;
}

function parseCharList()
{
    treeDepth++;
    seeEssTee.push(["CharList", treeDepth]);
    if (tokenVerify("char"))
    {
    parseChar();
    parseCharList();
    }
    else if (tokenVerify("Space"))
        {
            parseSpace();
            parseCharList();
        }
    else epsilon();
    treeDepth--;
}

function parseVarDecl()
{
    treeDepth++;
    seeEssTee.push(["VarDecl", treeDepth]);
    eyyEssTee.push(["declare", scope]);
    vareDeckle = true;
    tempLoc = tokenIndex;

    parseType();
    parseId();

    //if (isType && isChar){
    vareDeckle = false;
    treeDepth--;
//}
}

function parseId()
{
    treeDepth++;
    seeEssTee.push(["Id", treeDepth]);
    parseChar();
    treeDepth--;
}

function parseType()
{
    treeDepth++;
    seeEssTee.push(["type", treeDepth]);
    checkToken("type"); //int or string.
    treeDepth--;
}

function parseChar()
{
    treeDepth++;
    seeEssTee.push(["char", treeDepth]);   
    checkToken("char");
    treeDepth--;
}

function parseSpace()
{
    treeDepth++;
    seeEssTee.push(["space", treeDepth]);
    checkToken("Space");
    treeDepth--;
}

function parseDigit()
{
    treeDepth++;
    seeEssTee.push(["digit", treeDepth]);    
    checkToken("digit");
    treeDepth--;
}

function parseBoolVal()
{
    treeDepth++;
    seeEssTee.push(["boolVal", treeDepth]);
    checkToken("boolVal");
    treeDepth--;
}

function parseOp()
{
    treeDepth++;
    seeEssTee.push(["Op", treeDepth]);
    checkToken("op");
    treeDepth--;
}


function checkToken(expectedKind)
    {
        // Validate that we have the expected token kind and et the next token.
        switch(expectedKind)
        {
            case "print":   putMessage("Expecting 'print'");
                            if(currentToken == "p" && nthToken(tokenIndex) == "r"
                                    && nthToken(tokenIndex + 1) == "i" && nthToken(tokenIndex + 2) == "n"
                                    && nthToken(tokenIndex + 3) == "t")
                            {
                                putMessage("Got a 'print'!");
                                seeEssTee.push(["print", treeDepth+1]);
                                //eyyEssTee.push(["print", scope+1]);
                                currentToken = getNthNextToken(4);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT 'print'.  Error at position " + tokenIndex + ".");
                                currentToken = getNextToken();
                            }
                            break;
            case "(":      putMessage("Expecting '('");
                            if (currentToken=="(")
                            {
                                putMessage("Got '('!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                //eyyEssTee.push([currentToken, scope+1]);
                                //scope++;
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT '('.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case ")":      putMessage("Expecting ')'");
                            if (currentToken==")")
                            {
                                putMessage("Got ')'!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                //eyyEssTee.push([currentToken, scope+1]);
                                //scope--;
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT ')'.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case "=":      putMessage("Expecting '='");
                            if (currentToken=="=")
                            {
                                putMessage("Got '='!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                //eyyEssTee.push([currentToken, scope+1]);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT '='.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case "{":      putMessage("Expecting '{'");
                            if (currentToken=="{")
                            {
                                putMessage("Got '{'!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                //eyyEssTee.push([currentToken, scope+1]);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT '{'.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case "}":      putMessage("Expecting '}'");
                            if (currentToken=="}")
                            {
                                putMessage("Got '}'!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                //eyyEssTee.push([currentToken, scope+1]);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT '}'.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;

            case "while":   putMessage("Expecting 'while'");
                            if(currentToken == "w" && nthToken(tokenIndex) == "h"
                                    && nthToken(tokenIndex + 1) == "i" && nthToken(tokenIndex + 2) == "l"
                                    && nthToken(tokenIndex + 3) == "e")
                            {
                                putMessage("Got a 'while'!");
                                seeEssTee.push(["while", treeDepth+1]);
                                //eyyEssTee.push(["while", scope+1]);
                                currentToken = getNthNextToken(4);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT 'while'.  Error at position " + tokenIndex + ".");
                                currentToken = getNextToken();
                            }
                            break;

            case "if":   putMessage("Expecting 'if'");
                            if(currentToken == "i" && nthToken(tokenIndex) == "f")
                            {
                                putMessage("Got 'if'!");
                                seeEssTee.push(["if", treeDepth+1]);
                                //eyyEssTee.push(["if", scope+1]);
                                currentToken = getNthNextToken(1);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT 'if'.  Error at position " + tokenIndex + ".");
                                currentToken = getNextToken();
                            }
                            break;

            case "quote":   putMessage("Expecting a quote");
                            if (currentToken == "\"")
                            {
                                putMessage("Got a quote!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                if(inQuote)
                                {
                                    //tempString+=currentToken;
                                }
                                //this should never happen:
                                else eyyEssTee.push([currentToken, scope+1]);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT a quote.  Error at position " + tokenIndex + ".");
                            }
                            //inQuote = !inQuote;
                            currentToken = getNextToken();
                            break;
            case "type":   putMessage("Expecting a type");
                            if(currentToken == "i" && nthToken(tokenIndex) == "n"
                                    && nthToken(tokenIndex + 1) == "t")
                            {
                                putMessage("Got a type (int)!");
                                seeEssTee.push(["int", treeDepth+1]);
                                eyyEssTee.push(["int", scope+1]);
                                tempType = "int";
                                currentToken = getNthNextToken(2);
                            }
                            else if (currentToken == "s" && nthToken(tokenIndex) == "t"
                                    && nthToken(tokenIndex + 1) == "r" && nthToken(tokenIndex + 2) == "i"
                                    && nthToken(tokenIndex + 3) == "n" && nthToken(tokenIndex + 4) == "g")
                            {
                                putMessage("Got a type (string)!");
                                seeEssTee.push(["string", treeDepth+1]);
                                eyyEssTee.push(["string", scope+1]);
                                //boolean isType = true;
                                tempType = "str";
                                currentToken = getNthNextToken(5);
                            }
                            else if (currentToken == "b" && nthToken(tokenIndex) == "o"
                                    && nthToken(tokenIndex + 1) == "o" && nthToken(tokenIndex + 2) == "l"
                                    && nthToken(tokenIndex + 3) == "e" && nthToken(tokenIndex + 4) == "a"
                                    && nthToken(tokenIndex + 5) == "n")
                            {
                                putMessage("Got a type (boolean)!");
                                seeEssTee.push(["boolean", treeDepth+1]);
                                eyyEssTee.push(["boolean", scope+1]);
                                //boolean isType = true;
                                tempType = "bool";
                                currentToken = getNthNextToken(6);
                            }
                            else {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT a type.  Error at position " + tokenIndex + ".");
                                currentToken = getNextToken();
                            }
                            break;
            case "digit":   putMessage("Expecting a digit");
                            if (currentToken.match(/[0-9]/))
                            {
                                putMessage("Got a digit!");
                                seeEssTee.push([currentToken, treeDepth+1]);

                                if(firstInt)
                                {
                                    tempDigit = currentToken;
                                }
                                else if (firstObj)
                                {
                                    tempBoolExpr = currentToken;
                                }
                                else
                                {
                                    eyyEssTee.push([currentToken, scope+1]);
                                }
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT a digit.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case "char":   putMessage("Expecting a character");
                            if (currentToken.match(/[a-z]/))
                            {
                                putMessage("Got a character!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                if (!inQuote)
                                {
                                    if (firstObj)
                                    {
                                        tempBoolExpr = currentToken;
                                    }
                                    else
                                    {
                                        eyyEssTee.push([currentToken, scope+1]);
                                    }
                                    if (vareDeckle)
                                    {
                                        symTableau.push([tempType, currentToken, scope, tempLoc])
                                    }
                                    else if (printExpr||assignId)
                                    {
                                        symTableau.push([[], currentToken, scope, tempLoc]);
                                    }
                                }
                                else
                                {
                                    tempString+=currentToken;
                                }
                                //else if (assignExpr)
                                //{
                                //    temp??? = currentToken;
                                //} //I tried to implement a value storer
                                    //and then realized you said not to
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT a character.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case "op":      putMessage("Expecting an operator");
                            if (currentToken=="+" || currentToken=="-")
                            {
                                putMessage("Got an operator!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                //eyyEssTee.push([currentToken, scope+1]);
                                tempOp = currentToken;
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT an operator.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case "EOF":     putMessage("Expecting End of File marker");
                            if (currentToken==EOF)
                            {
                                putMessage("Got EOF marker!");
                                seeEssTee.push([currentToken, treeDepth+1]);
                                //eyyEssTee.push([currentToken, scope+1]);
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT an EOF marker.  Error at position " + tokenIndex + ".");
                            }
                            break;
            case "Space":   putMessage("Expecting the space character");
                            if (currentToken==" "&&inQuote)
                            {
                                putMessage("Got space character!");
                                seeEssTee.push(["_", treeDepth+1]);
                                //eyyEssTee.push(["_", scope+1]);
                                tempString+=" ";
                            }
                            //This should never happen:
                            else if (!inQuote)
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("Space detected outside of a string. Error at position " + tokenIndex + ".");
                            }
                            else
                            {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT a space character.  Error at position " + tokenIndex + ".");
                            }
                            currentToken = getNextToken();
                            break;
            case "boolVal":   putMessage("Expecting a boolean");
                            if(currentToken == "f" && nthToken(tokenIndex) == "a"
                                    && nthToken(tokenIndex + 1) == "l" && nthToken(tokenIndex + 2) == "s"
                                    && nthToken(tokenIndex + 3) == "e")
                            {
                                putMessage("Got a boolean (false)!");
                                seeEssTee.push(["false", treeDepth+1]);
                                eyyEssTee.push(["false", scope+1]);
                                currentToken = getNthNextToken(4);
                            }
                            else if (currentToken == "t" && nthToken(tokenIndex) == "r"
                                    && nthToken(tokenIndex + 1) == "u" && nthToken(tokenIndex + 2) == "e")
                            {
                                putMessage("Got a boolean (true)!");
                                seeEssTee.push(["true", treeDepth+1]);
                                eyyEssTee.push(["true", scope+1]);
                                //boolean isType = true;
                                //tempType = "string";
                                currentToken = getNthNextToken(3);
                            }
                            else {
                                errorCount++;
                                parseErrors++;
                                putMessage("NOT a boolean.  Error at position " + tokenIndex + ".");
                                currentToken = getNextToken();
                            }
                            break;

            default:        putMessage("Parse Error: Invalid Token Type at position " + tokenIndex + ".");
                            errorCount++;
                            parseErrors++;
                            currentToken = getNextToken();
                            break;         
        }
    }

/*function tokenVerify(expectedKind)
    {
    putMessage("Everything is fine with tokenVerify. By the way, "+expectedKind+".");
    }*/
function tokenVerify(expectedKind)
    {
    switch(expectedKind)
        {
        case "print":   return (currentToken == "p" && nthToken(tokenIndex) == "r" && nthToken(tokenIndex + 1) == "i"
                                && nthToken(tokenIndex + 2) == "n" && nthToken(tokenIndex + 3) == "t");
                        break;
        //!!! MAY BE BROKEN
        case "while":   return (currentToken == "w" && nthToken(tokenIndex) == "h" && nthToken(tokenIndex + 1) == "i"
                                && nthToken(tokenIndex + 2) == "l" && nthToken(tokenIndex + 3) == "e");
                        break;
        //!!! MAY BE BROKEN
        case "if":      return (currentToken == "i" && nthToken(tokenIndex) == "f");
                        break;
        //!!! MAY BE BROKEN
        case "type":    return ((currentToken == "i" && nthToken(tokenIndex) == "n" && nthToken(tokenIndex + 1) == "t")
                                || (currentToken == "s" && nthToken(tokenIndex) == "t"
                                    && nthToken(tokenIndex + 1) == "r" && nthToken(tokenIndex + 2) == "i"
                                    && nthToken(tokenIndex + 3) == "n" && nthToken(tokenIndex + 4) == "g")
                                || (currentToken == "b" && nthToken(tokenIndex) == "o"
                                    && nthToken(tokenIndex + 1) == "o" && nthToken(tokenIndex + 2) == "l"
                                    && nthToken(tokenIndex + 3) == "e" && nthToken(tokenIndex + 4) == "a"
                                    && nthToken(tokenIndex + 5) == "n"));
                        break;
        //!!! MAY BE BROKEN
        case "boolVal":  return ((currentToken == "f" && nthToken(tokenIndex) == "a" && nthToken(tokenIndex + 1) == "l"
                                && nthToken(tokenIndex + 2) == "s" && nthToken(tokenIndex + 3) == "e")
                                || (currentToken == "t" && nthToken(tokenIndex) == "r"
                                    && nthToken(tokenIndex + 1) == "u" && nthToken(tokenIndex + 2) == "e"));
                        break;
        case "char":    return (currentToken.match(/[a-z]/));
                        break;
        case "digit":   return (currentToken.match(/[0-9]/));
                        break;
        case "quote":   return currentToken == "\"";
                        break;
        case "op":      return (currentToken == "+" || currentToken=="-");
                        break;
        case "{":       return currentToken == "{";
                        break;
        case "(":       return currentToken == "(";
                        break;
        case "Space":   return currentToken == " ";
                        break;
        }
    }

function getNextToken()
    {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length)
        {
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            putMessage("\nCurrent token:" + thisToken+" ");
            tokenIndex++;
            putMessage("Current index:" + tokenIndex);
        }
        return thisToken;
    }

function arrayToString(a)
{

}

function getNthNextToken(n)
    {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if ((tokenIndex + n) < tokens.length)
        {
            // If we're not at EOF, then return the nth token in the stream and advance the index accordingly.
            thisToken = tokens[tokenIndex + n];
            putMessage("\nCurrent token:" + thisToken);
            tokenIndex = tokenIndex + n + 1;
            putMessage("Current index:" + tokenIndex);
        }
        return thisToken;
    }

function nthToken(n)
    {
        return tokens[n];
    }

function epsilon()
    {
        putMessage("Epsilon Transition")
        //currentToken = getNextToken(); //Was ultimately not necessary.
    }
function elseError()
    {
        putMessage("Parse Error: Current token does not match current Production.")
        errorCount++;
        parseErrors++;
        currentToken = getNextToken();
    }

function printSymbolTable()
    {
        //SYMBOL TABLE --- Only prints when there is actually any data in the symbol table.
        if(symTableau.length > 0)
            {
        printTable("S Y M B O L    T A B L E:\n------------------------------\nType\tID\tLv\tIndex\n------------------------------");
            for (var i = 0;i<symTableau.length;i++)
            {
                printTable(symTableau[i][0] + "\t"+symTableau[i][1]+ "\t"+symTableau[i][2]+"   \t"+symTableau[i][3]);
            }
        }
        else
        {
            printTable("[No symbol table for this data]")
        }
    }