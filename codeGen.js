/*OP CODE REFERENCE TABLE
----------------------------------------------
A9		Load the accumulator with a constant
AD 		Load the accumulator from memory
8D 		Store the accumulator in memory
6D 		Add with carry (Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator)
A2 		Load the X register with a constant
AE 		Load the X register from memory
A0 		Load the Y register with a constant
AC 		Load the Y register from memory
EA 		No Operation
00 		Break (which is really a system call)
EC 		Compare a byte in memory to the X reg, Sets the Z (zero) flag if equal
D0 		Branch X bytes if Z flag = 0
EE 		Increment the value of a byte
FF 		System Call
 #$01 in X reg = print the integer stored in the Y register.
 #$02 in X reg = print the 00-terminated string stored at the address in 
 the Y register.

List of tree possibilities:

StatementBlock
- Statement
+ ...

print
- Expr //IntExpr, string, BooleanExpr, char

declare
-type // int | str | bool
-char

=
-Id 
-Expr

+ | -
-digit
-(IntExpr) // digit || op

if/while
-Boolean
-Statement
 */

function codeGen()
{

	//printCode("Code Gen Started.");
	memIndex = 0; //need to know where in memory we're saved
	skip = false;
	machineCode = [];
	memArray = [];
	//tempMem1 = "";
	//tempMem2 = "";
	skipXTimes = 0;

	//This is the stupidest thing ever but it wouldn't work unless i did this. -__-
	if(eyyEssTee[eyyEssTee.length - 2][0] == "print"){
		eyyEssTee.push(["dummy", 0]);
	}

	//eyyEssTee.push(["end", 0]);
	//print2DArray(eyyEssTee); //For testing purposes    
	//machineCode.push("codeGen Started");
	prepCode();
	//printCode("\nLoop Complete\n\n");
	//machineCode.push("codeGen Finished");
	printArray(machineCode);
}

function prepCode()
{
	//TODO:
	//Iterate through AST.
	
	for(var i = 0; i < eyyEssTee.length; i++)
	{
		if(skipXTimes > 0)
		{
			skipXTimes--;
		}
		else
		{
			generateMachineCode(eyyEssTee[i][0], eyyEssTee[i][1], eyyEssTee[i+1][0], eyyEssTee[i+2][0], i);
		}

	}

}

function generateMachineCode(expected, daScope, branch1, branch2, dex)
{
	switch(expected)
		{
			//case "StatementBlock" //Not incorporating scope yet
			case "print": 		printWhat(branch1);
								//then load the X register with 01 (meaning print this)
								machineCode.push("A2");
								machineCode.push("01");
								//This is a syscall, so confirm that.
								machineCode.push("FF");

								if(eyyEssTee[eyyEssTee.length - 1][0] == "dummy"){
								skipXTimes = 2;
								}
								else
								{
									skipXTimes = 1;
								}
								
								break;

								//You will need to rewrite this such that it can handle all such requests.*/

			case "=": 			getValue(branch2); //value at branch 2
								machineCode.push("8D"); // SAVE IT TO...
								whereis(branch1); //wherever branch 1 is.
								skipXTimes = 2;
								break;


			case "declare": 	machineCode.push("A9"); //Load the accumlator with...
								machineCode.push("00"); //00 because initialization.
								machineCode.push("8D"); // SAVE IT TO...
								toMem(branch2);
								skipXTimes = 2;
								//machineCode.push("\n");
								break;

			default: 			//machineCode.push("NAC");
								//machineCode.push("\n");
								break;

								//we shouldn't need to parse, but make sure you leave the option open.
		}
}

function getValue(id)
{
	var tempValue = "";
	if (id == "a" || id == "b" || id == "c" || id == "d" || id == "e"
		|| id == "f" || id == "g" || id == "h" || id == "i" || id == "j")
	{
		machineCode.push("AD"); //Load the accumulator with mem loc...
		whereis(id);
	}
	else
	{ 
		machineCode.push("A9"); //Load the accumlator with...

		if (id == "0" || id == "1" || id == "2" || id == "3" || id == "4"
		|| id == "5" || id == "6" || id == "7" || id == "8" || id == "9")
		{
			tempValue = "0"+id;
		}
	else if (id == "true"){
		tempValue = "01";
	}
	else {
		tempValue = "00";
	}
}

	machineCode.push(tempValue);
}

//METHOD THAT DECIDES WHERE IN THE MEMORY A THING SHOULD GO
function toMem(id)
{
	memArray.push(id);
	var firstHalf = "T"+memIndex;
	machineCode.push(firstHalf);
	machineCode.push("XX");
	memIndex++;
}

function printWhat(id)
{
	if(declaredBefore(id))
	{
		machineCode.push("AC"); //load Y register with...
		whereis(id); //the value from this register
	}
	else
	{
		machineCode.push("A0"); //load Y register with a constant...
		//stringToCode(id); TODO Insert super-clever string-to-code method here. In the meantime:
		machineCode.push("00"); //For now we'll just represent strings as the constant 0.
	}
}

function declaredBefore(id)
{
	for(var i = 0; i < memArray.length; i++)
	{
		if(memArray[i] == id)
		{
			return true;
		}
	}
	return false;
}

function whereis(id) //var a
{
	var locat = "T0";
	for(var i = 0; i < memArray.length; i++)
	{
		if(memArray[i] == id)
		{
			locat = "T"+i;
		}
	}

	machineCode.push(locat);
	machineCode.push("XX");
}

function printArray(a)
{
    for (var i = 0;i<a.length;i++)
    {
        printCode(a[i]+" ");
    }
}

/*

TODO:

> TypeChecker: Recognition of mismatched types.

>	String - to - code generator.

>	+/- Operations on integers.

>	If/While Support.

>	Scope. (At all.)

>	Populate remainder of code space with 00
	(Won't be difficult but I forget the exact number. Was it 256?)

*/
