// Global variables
    var tokens = "";
    var tokenIndex = 0;
    var currentToken = "";
    var errorCount = 0;
    var lexErrors = 0;
    var parseErrors = 0;
    var typeErrors = 0;
    var EOF = "$";
    var symTableau = [];
    var seeEssTee = [];
    var eyyEssTee = [];
    var declared = [];
    var everDeclared = [];
    var machineCode = [];
    var vareDeckle = new Boolean(false);
    var assignId = new Boolean(false);
    var assignExpr = new Boolean(false);
    var printExpr = new Boolean(false);
    var tempType = "";
    var tempId = "";
    var tempString = "";
    var tempBoolExpr = "";
    //var tempExpr = "";
    var tempDigit = "";
    var tempOp = "";
    var tempLoc = 0;
    var inQuote = new Boolean(false);
    var inIntExpr = new Boolean(false);
    var firstInt = new Boolean(false);
    var inBoolExpr = new Boolean(false);
    var firstObj = new Boolean(false);
    var scope = 0;
    var treeDepth = 0;
    var currentPhase = "";
    var memIndex = 0;
    var tempMem1 = "";
    var tempMem2 = "";
    var skipXTimes = 0;
    var skip = new Boolean(false);
    var memArray = [];

    function init()
    {
        // Clear the message box.
        document.getElementById("taOutput").value = "";
        document.getElementById("taIR").value = "";
        document.getElementById("taCodeGen").value = "";
        // Set the initial values for our globals.
        symTableau = [];
        seeEssTee = [];
        eyyEssTee = [];
        machineCode = [];
        tokens = "";
        tokenIndex = 0;
        currentToken = ' ';
        lexErrors = 0;
        parseErrors = 0;
        typeErrors = 0;
        errorCount = 0;  
        var memArray = [];      
    }

    function reInit(){
        //symTableau = [];
        tokenIndex = 0;
        currentToken = ' ';
    }
    
    function btnCompile_click()
    {        
        // This is executed as a result of the usr pressing the 
        // "compile" button between the two text areas, above.  
        // Note the <input> element's event handler: onclick="btnCompile_click();
        init();
        //putMessage("Compilation Started...");
        //putMessage("''I'm as serious as a heart attack.''\n");
        //Lex and Parse
        //putMessage("Starting Lexical Analysis:");
        currentPhase = "LEXICAL";
        lex();
        if(errorCount==0){
            //putMessage("Starting Code Parse:");
            currentPhase = "PARSE";
            parse();
            if(errorCount==0){
            //putMessage("Starting Semantic Analysis:");
            currentPhase = "SEMANTIC";
            semanticAnalysis();
            if(errorCount==0){
                //Will only proceed to code generation if code is perfect and has no errors.
                putMessage("Starting Code Generation...");
                codeGen();
        }}}
        if(errorCount!=0){
            if(errorCount==1)
            {
                putMessage("\n1 "+currentPhase+" ERROR DETECTED.");
                printTable("1 "+currentPhase+" ERROR DETECTED; SEE OUTPUT");
                printCode("1 "+currentPhase+" ERROR DETECTED; SEE OUTPUT");
            }
            else
            {
                putMessage("\n"+errorCount+" "+currentPhase+" ERRORS DETECTED.");
                printTable(errorCount+" "+currentPhase+" ERRORS DETECTED; SEE OUTPUT");
                printCode(errorCount+" "+currentPhase+" ERRORS DETECTED; SEE OUTPUT");
            }
            putMessage("COMPILATION WILL NOW CEASE.\nPLEASE REFER TO THE ABOVE OUTPUT FOR DETAILS.");
        }
        //putMessage("\n>>" + errorCount + " total compile error(s).<<");
        //putMessage("\n''If my answers frighten you, \nthen you should cease \nasking scary questions.''");

    }
    
    function putMessage(msg)
    {
        document.getElementById("taOutput").value += msg + "\n";
    }

    function printTable(msg)
    {
        document.getElementById("taIR").value += msg + "\n";
    }

    function printCode(msg)
    {
        document.getElementById("taCodeGen").value += msg;
    }
