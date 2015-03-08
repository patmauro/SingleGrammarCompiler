function semanticAnalysis()
{
	typeErrors = 0;
    putMessage("\nPERFORMING SEMANTIC ANALYSIS...\n---------------\n");
    
    //Verifies no scope issues are made by parsing through symbol table.
    scopeCheck();

    //Verifies all type associations are valid by running through AST.
    typeCheck();
    
}

function scopeCheck()
    {
        if(symTableau.length > 0)
        	{
        	putMessage("Identifiers detected.");
            for (var i = 0;i<symTableau.length;i++)
            	{
            	putMessage("Analyzing "+symTableau[i][1]+" at index "+symTableau[i][3]+"...");
            	//Case 0: Non-declared item
            	if (symTableau[i][0] == "")
            	{
            		putMessage("This item is NOT a declaration.");
                    //Replaced above code with much more efficient method below.
                    if(previouslyDeclared(symTableau, i))
                    {
                        putMessage("This item was previously declared in a correct scope.");
                    }
                    else
                    {
                        errorCount++;
                        typeErrors++;
                        putMessage("ERROR: Identifier at position "+symTableau[i][3]+" is undeclared in this scope.");
                    }
            	}
            	//Case 1: A declaration
            	else
            	{
            		putMessage("This item IS a declaration.");
                    /*if(symTableau[i][0] == "tmp"){
                        putMessage("")
                        On second thought nevermind. This is pointless.
                    }*/
            		//	Subcase: This declaration has already been declared (in this scope) - Error.
            		if(contains(declared, [symTableau[i][1], symTableau[i][2]]))
            		{
            			//putMessage("The declared array already contains ["+symTableau[i][1]+", "+symTableau[i][2]+"].");
            			errorCount++;
                        typeErrors++;
                        putMessage("ERROR: identifier at "+symTableau[i][3]+" already declared in scope "+symTableau[i][2]+".");
            		}
            	//	Subcase: Else, add it to the array of declared identifiers.
            		else
            		{
            			putMessage("This declaration does not conflict with a prior one.");
            			everDeclared.push(symTableau[i][1]);
            			declared.push([symTableau[i][1], symTableau[i][2]]);
            		}
            	}
            }
        }
        else putMessage("No data to scope-check.\n")
    }

function typeCheck()
{
    //Super clever method that runs through an AST and makes sure all the associations are correct.
}


// SUPER AWESOME HELPER METHODS FOLLOW
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function correctScope(decList, obj, objScope){
	var listOScopes = [];
	containsToScopeList(decList, listOScopes, obj);
	for (var i = 0; i < listOScopes.length; i++) {
		if(objScope>=listOScopes[i])
		{
			//putMessage(objScope+" is >= "+listOScopes[i])
			return true;
		}
	}
	return false;
}

function containsToScopeList(a, a2, obj){
	for (var i = 0; i < a.length; i++) {
        //If this spot in the list of declared objects has that object
		if (a[i][0] == obj)
		{
			a2.push(a[i][1]);
		}
	}
	//putMessage("Scope list: ");
	//printArray(a2);
}
             

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

/*function inSameScope(a, a2, obj, i)
{
    a.slice(i, os)
}*/

function previouslyDeclared(a, i)
{
    //var obj = a[i][1];
    //var objScope = a[i][2];
    var a2 = [];
    a2 = a.slice(0, i);
    //var foundOne = 0;
    var tempScope = 0;
    var scopeDecreased = 0;
    for (var j = 0; j < a2.length; j++) {
        if(a2[j][2] < tempScope)
        {
            scopeDecreased++;
        }
        if(a2[j][0]!=""&&a2[j][1]==a[i][1]&&a2[j][2]<=a[i][2])
        {
            tempScope = a2[j][2];
            scopeDecreased = 0;
        }
    }
    if(tempScope==0)
    {
        return false;
    }
    else if(scopeDecreased>0)
    {
        return false;
    }
    else return true;
}


/*function printArray(a) {
	document.getElementById("taOutput").value += "[";
	for (var i = 0; i < a.length-1; i++) {
        document.getElementById("taOutput").value += a[i] + ", ";
    }
    document.getElementById("taOutput").value += a[a.length-1] + "]\n";
}*/