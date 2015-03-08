function printCST()
    {
    //putMessage("I've started printing the CST...");
    if(seeEssTee.length > 0)
        {
            printSemantics("CONCRETE SYNTAX TREE:\n---------------------");
            for (var i = 0;i<seeEssTee.length;i++)
            {
                printTreeNode(seeEssTee[i][0], seeEssTee[i][1]);
                //printSemantics()
            }
        }
    else
        {
            printSemantics("\n[No CST found]")
        }
    }
function printAST()
    {
    //putMessage("I've started printing the AST...");
    if(eyyEssTee.length > 0)
        {
            printSemantics("\nABSTRACT SYNTAX TREE:\n---------------------");
            for (var i = 0;i<eyyEssTee.length;i++)
            {
                printTreeNode(eyyEssTee[i][0], eyyEssTee[i][1]);
                //printSemantics()
            }
            printSemantics("\n");
        }
    else
        {
            printSemantics("\n[No AST found]\n")
        }
    }

function printSemantics(msg)
    {
        document.getElementById("taIR").value += msg + "\n";
    }

function printTreeBranch(n)
    {
        for (var i = 0;i<n;i++)
        {
            document.getElementById("taIR").value += "-";
        }
    }

function printTreeNode(msg, n)
    {
        printTreeBranch(n);
        document.getElementById("taIR").value += msg + "\n";
    }

//for testing purposes
function print2DArray(a)
{
    printCode("Actual AST:\neyyEssTee.length = "+a.length+"\n");
    for (var i = 0;i<a.length;i++)
    {
        printCode("INDEX "+i+": ["+a[i][0]+", "+a[i][1]+"]\n");
    }
}