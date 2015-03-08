function lex()
{
    inQuote = false;
    // Grab the "raw" source code.
    var sourceCode = document.getElementById("taSourceCode").value;
    // Trim the leading and trailing spaces.
    sourceCode = trim(sourceCode);
    //Rather than removing the whitespace this way, since now we have stuff in quotes to worry about, we can simplify code as we lex.
    tokens = sourceCode;
    lexCheck();
    //tokens = sourceCode; //resets tokens for parse //Why did I do this?? Better to keep changes made.
}

function lexCheck()
{
    // Grab the next token.
    putMessage("\nL E X I N G ...\n---------------\n[" + tokens + "]");

    if (tokens[tokens.length] != EOF){
        putMessage("\nW A R N I N G :\nNo EOF marker found in source code.\nOne will be added and compilation will proceed.");
        tokens += "$";
        putMessage("Input string adjusted to:\n["+tokens+"]\n");
        }

    currentToken = getNextToken();
    lexRun();
    //putMessage("\n>>> " + lexErrors + " lex error(s) found. <<<");
    reInit();
}

function lexRun()
{
    /*if (tokenIndex >= tokens.length-1 && currentToken != EOF){
        putMessage("\nW A R N I N G :\nEOF reached without EOF marker.\nOne will be added and compilation will proceed.\n");
        tokens += "$";
        }*/
    if (currentToken != EOF)
        {
            cleanUp();
            if(currentToken != EOF)
                {
            lexToken();
            //currentToken = getNextToken();
            lexRun();
                }
            else
            {
        // There is nothing else in the token stream, 
        // and that's cool since E --> digit is valid.
        putMessage("EOF reached");
        if (tokenIndex != tokens.length)
        {
            putMessage("W A R N I N G :\nExtra character(s) detected after EOF marker.\nThese characters will be ignored during parse.\n")
        }
    }
    }
    else
    {
        // There is nothing else in the token stream, 
        // and that's cool since E --> digit is valid.
        putMessage("EOF reached");
        if (tokenIndex != tokens.length)
        {
            putMessage("W A R N I N G :\nExtra character(s) detected after EOF marker.\nThese characters will be ignored during parse.\n")
        }
    }
}

function cleanUp(){
    if(!inQuote){
        //putMessage("We're not in a quote. Gotta check for spaces.");
        if (currentToken.match(/\s/))
        {
            //putMessage("We've got an extra space. TODO: Remove.");
            tokens = removeCharAt(tokens, tokenIndex);
            putMessage("Removed extra whitespace;\nString simplified to:\n["+tokens+"]");
            currentToken = tokens[tokenIndex-1];
            putMessage("\nCurrent Token: "+currentToken+"\nCurrent Index = "+tokenIndex);
            cleanUp(); //Run again to check for any more whitespace
        }
    }
    /*else{
        //putMessage("In quote; do nothing.");
        //continues onwards to lexToken
        }*/
    }

function removeCharAt(str, pos)
{
return (str.substring(0, pos-1) + str.substring(pos));
}
function replaceCharAt(str, pos, newChar)
{
return (str.substring(0, pos-1) + newChar + str.substring(pos));
}

function lexToken()
{
    // Validate that we have the expected token kind and et the next token.
    putMessage("Expecting a terminal");
						//if (currentToken.match(/[0-9]/) || currentToken =="+" || currentToken =="-" )
                        if (currentToken.match(/[A-Z]/))
                            {
                                putMessage("W A R N I N G :\nUppercase characters are not supported in this grammar.\nThese characters will be converted to lowercase.");
                                currentToken = currentToken.toLowerCase();
                                tokens = replaceCharAt(tokens, tokenIndex, currentToken);
                            }
                        //word tokens outside of quotes 
						if (currentToken == "p" && nthToken(tokenIndex) == "r"
                            && nthToken(tokenIndex + 1) == "i" && nthToken(tokenIndex + 2) == "n"
                            && nthToken(tokenIndex + 3) == "t" && (!inQuote))
                            {
                                putMessage("Got a terminal - print.")
                                currentToken = getNthNextToken(4);
                            }
                        else if (currentToken == "w" && nthToken(tokenIndex) == "h"
                            && nthToken(tokenIndex + 1) == "i" && nthToken(tokenIndex + 2) == "l"
                            && nthToken(tokenIndex + 3) == "e" && (!inQuote))
                            {
                                putMessage("Got a terminal - while.")
                                currentToken = getNthNextToken(4);
                            }
                         else if (currentToken == "i" && nthToken(tokenIndex) == "f" && (!inQuote))
                            {
                                putMessage("Got a terminal - if.")
                                currentToken = getNthNextToken(1);
                            }   
                        else if (currentToken == "i" && nthToken(tokenIndex) == "n"
                            && nthToken(tokenIndex+1) == "t" && (!inQuote))
                            {
                                putMessage("Got a terminal - int.")
                                currentToken = getNthNextToken(2);
                            }
                        else if (currentToken == "s" && nthToken(tokenIndex) == "t"
                            && nthToken(tokenIndex + 1) == "r" && nthToken(tokenIndex + 2) == "i"
                            && nthToken(tokenIndex + 3) == "n" && nthToken(tokenIndex + 4) == "g" && (!inQuote))
                            {
                                putMessage("Got a terminal - string.")
                                currentToken = getNthNextToken(5);
                            }      
                        else if (currentToken == "b" && nthToken(tokenIndex) == "o"
                            && nthToken(tokenIndex + 1) == "o" && nthToken(tokenIndex + 2) == "l"
                            && nthToken(tokenIndex + 3) == "e" && nthToken(tokenIndex + 4) == "a"
                            && nthToken(tokenIndex + 5) == "n" && (!inQuote))
                            {
                                putMessage("Got a terminal - boolean.")
                                currentToken = getNthNextToken(6);
                            }   
                        else if (currentToken == "f" && nthToken(tokenIndex) == "a"
                            && nthToken(tokenIndex + 1) == "l" && nthToken(tokenIndex + 2) == "s"
                            && nthToken(tokenIndex + 3) == "e" && (!inQuote))
                            {
                                putMessage("Got a terminal - false.")
                                currentToken = getNthNextToken(4);
                            }
                        else if (currentToken == "t" && nthToken(tokenIndex) == "r"
                            && nthToken(tokenIndex + 1) == "u" && nthToken(tokenIndex + 2) == "e"
                            && (!inQuote))
                            {
                                putMessage("Got a terminal - true.")
                                currentToken = getNthNextToken(3);
                            }
                        //char tokens
                        else if ( currentToken =="(" || currentToken ==")"
							||currentToken =="=" || currentToken =="{" || currentToken =="}"
							||currentToken.match(/[0-9]/) || currentToken.match(/[a-z]/)
							|| currentToken =="+" || currentToken =="-"
                            || currentToken==" " ) //provididng other whitespace characters have already been removed
                            {
                                putMessage("Got a terminal - valid char");
                                currentToken = getNextToken();
                            }
                        else if (currentToken == "\"")
                            {
                                putMessage("Got a terminal - quote");
                                inQuote = !inQuote;
                                currentToken = getNextToken();
                            }

                        else
                            {
                                errorCount++;
                                lexErrors++;
                                putMessage("Error: Non-terminal found at position " + tokenIndex + ".");
                                currentToken = getNextToken();
                            }
    // Consume another token, having just checked this one, because that 
    // will allow the code to see what's coming next... a sort of "look-ahead".
}

