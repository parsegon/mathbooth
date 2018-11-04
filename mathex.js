/* Copyright 2016 Parsegon Inc. - All Rights Reserved
 * YOU ARE PROHIBITED to use this code for
 * commercial means without prior approval and/or license
 * from the owner above.  If you are interested in seeking
 * such license, please contact Mathew Pregasen
 * at mathew@parsegon.com.
 */

 /*Mathew:
 * Special thanks to Anuke Ganegoda for math language
 * help and Sahir Jaggi on general advice and feedback.
 *
 * Thanks to Dylan Madisetti as usual for RegEx Wizardry.
 *
 * Thanks to Dave Bayer, Antonius Deiker, Deborah Costello for advice
 * on the use case and the linguistics of the alogirthm.
 *
 * Thanks to Alma.Works of CORE@Columbia University for the help
 * and mentors provided through the way.

 */
/***********************************************************************
************************************************************************
**************************TABLE**OF**CONTENTS***************************
In order to CTRL-F any of these, use the following
format: "[TERM]".  For instance, to find, "Macro"
in the file, do CTRL-F "[Macro]";

1.  Macro                  - Macro Class
2.  Words After            - Helper Function for Word After
3.  Friendly Functions     - Helper Functions for Fractions & Roots
4.  Mark Flags             - Subfunction for Marking English Points
5.  Section                - Class for Sub-parts of a Macro
6.  Get Sections           - Helper Function to construct Sections
7.  Write HTML             - Helper Function to construct HTML from Sections
8.  Term                   - General Term Class
9.  Root                   - Root Class (Square Root etc.)
10. Fraction               - Fraction Class
11. Derivative             - Fraction Class
12. Limit                  - Limit Class
13. Product                - Product Class
14. Big Union              - Big Union Class
15. Summation              - Summation Class
16. Integral               - Integral Class
17. Graph                  - Graph Class
18. Venn                   - Venn Diagram Creation Function
19. Matrix                 - Matrix Creation Function
20. Geometry               - Helper Function to Prime for Geometry
21. Matrix Dimensions      - Matrix Dimensions Function
22. Prime                  - Major Priming Function in Conversion Sequence
23. Enclose                - Helper Function to Prime Sequence Enclosing Terms
24. Parse                  - Major Parse Function in Conversion Sequence
25. Post                   - Major Post Function in Conversion Sequence
26. Ada                    - Ada Main Class // Virtual Assistance
27. Macro Sort             - Major Sort Function in Conversion Sequence
28. Define                 - Helper Function for Term Definitions
29. Convert                - Top Level Function that calls Major Functions
30. Repeats                - Repetition Marker
31. Mathex                 - Main Class
***********************************************************************
***********************************************************************
***********************************************************************/

/*******
 All macro level functions are derived via extending the Macro
 object.  The macro object sets up the basic set up for any general
 macro object (integral, summation) etc.
 *******/

/******* MAIN FUNCTION COMPONENT *******/
/**** MARKER: [Macro] ****/
var Macro = function(str){
    this.str = str;
    /************************
    this.str is the holder of the string of a Macro.
    this.str is then split into this.arr by space.
    ************************/
    this.arr = str.split(" ");
    for(i = 0; i < this.arr.length; i++){
        a = [this.arr[i],0];
        /************************
        this.arr is then refactored to make an array of arrays
        with the first position being the word, and the other being a value.
        ************************/
        this.arr[i] = a;
    }
};

function matchLeftParens(str, ind1)
{
	var parcount = 0;
	for(var i = ind1; i<str.length; i++)
	{
		if(str.charAt(i)=="(") { parcount++; }
		if(str.charAt(i)==")") { parcount--; }
		if(str.charAt(i)==")" && parcount==0) { return i; }

	}
	return -1;

}

function matchRightParens(str, ind1)
{
	var parcount = 0;
	for(var i = ind1; i>=0; i--)
	{
		if(str.charAt(i)=="(") { parcount++; }
		if(str.charAt(i)==")") { parcount--; }
		if(str.charAt(i)=="(" && parcount==0) { return i; }

	}
	return -1;

}

/**Same as above, but finds the words before */
function wordsbefore(str,word,num,start){
    /************************
    str: the input string.
    word: the word we are seeking after
    num: the number of the occurance of the work we are
    skipping from the start point
    start: the starting point to search
    return: word before the specific word
    ************************/
    str = str + " ";
	var spaceafter = 0;
	var nextspace = 0;
    if(start == undefined){
        start = 0;
    }
    if(num == undefined){
        num = 1;
    }
    /**********************
    Start and Num are not necessary
    for this function, but since they are
    necessary in the loop below, we set
    a default in the case they are undefined.
    **********************/
    if(str.indexOf(word,start) != -1){
        start = str.indexOf(word,start);
        counter = 0;
while(counter < num){
            nextspace = str.lastIndexOf(" ", start);
            spaceafter = str.lastIndexOf(" ", nextspace-1);
            /************************
            Space functions find the bounds of
            the space functions
            *************************/
            start = spaceafter-1;
            counter++;
        }
        return str.substring(spaceafter+1, nextspace);
    } else {
        return -1;
    }
}

/******
Words after collects the word after
a certain word is.
******/
/**** MARKER: [Words After] ****/
function wordsafter(str,word,num,start){
    /************************
    str: the input string.
    word: the word we are seeking after
    num: the number of the occurance of the work we are
    skipping from the start point
    start: the starting point to search
    return: word after the specific word
    ************************/
    str = str + " ";
	var spaceafter = 0;
	var nextspace = 0;
    if(start == undefined){
        start = 0;
    }
    if(num == undefined){
        num = 1;
    }
    /**********************
    Start and Num are not necessary
    for this function, but since they are
    necessary in the loop below, we set
    a default in the case they are undefined.
    **********************/
    if(str.indexOf(word,start) != -1){
        start = str.indexOf(word,start);
        counter = 0;
        while(counter < num){
            nextspace = str.indexOf(" ", start);
            spaceafter = str.indexOf(" ", nextspace+1);
            /************************
            Space functions find the bounds of
            the space functions
            *************************/
            start = spaceafter-1;
            counter++;
        }
        return str.substring(nextspace,spaceafter);
    } else {
        return -1;
    }
}

/*******
Calculates the levenshtein distance between two  words
*******/
function levenshtein(a, b) {
  if(a.length == 0) return b.length;
  if(b.length == 0) return a.length;

  a = a.toLowerCase();
  b = b.toLowerCase();
  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}


/**
* Helper function to prime - returns an array of all occurrences of a substring in another string.
* MY
*/
function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}



function nextword(str,start){
  space = str.indexOf(" ", start);
  while(str.charAt(space) == " "){
    space++;
    if(space > str.length){
      return null;
    }
  }
  begin = space;
  endspace = str.indexOf(" ", begin);
  return str.substring(begin, endspace);
}


/**** fraction friendly ****/
/**** MARKER: [Friendly Functions] ****/
function ff(sst){

  regex = new RegExp(" over ","ig");
  sst = sst.replace(regex,"/");

  regex = new RegExp("root of ","ig");
  sst = sst.replace(regex,"<hr r00t>");

    regex = new RegExp("root with interior ","ig");
    sst = sst.replace(regex,"<hr r00t>");
  regex = new RegExp("root ","ig");
  sst = sst.replace(regex,"<hr r00t>");

  /************************
  This is a temporary function.  For now, fractions
  within the top and bottom of a fraction
  are treated to the defacto "/" treatment.

  Roots are broken down to a single root symbol.

  This is a lazy approach and should later be refactored
  to call the fraction function recursively onto itself
  until it is returning itself.  The challenge here
  is writing the CSS, not the JS.
  *************************/
  return sst;
}

/**** matrix friendly ****/
/**** MARKER: [Matrix Functions] ****/
function mf(sst){

  regex = new RegExp("over","ig");
  sst = sst.replace(regex,"/");
  regex = new RegExp("root of ","ig");
  sst = sst.replace(regex,"<hr r00t>");
  regex = new RegExp("root ","ig");
  sst = sst.replace(regex,"<hr r00t>");

  /************************
  This is a temporary function.  For now, fractions
  within the top and bottom of a fraction
  are treated to the defacto "/" treatment.

  Roots are broken down to a single root symbol.

  This is a lazy approach and should later be refactored
  to call the fraction function recursively onto itself
  until it is returning itself.  The challenge here
  is writing the CSS, not the JS.
  *************************/
  return sst;
}

/**** root friendly ****/
function rf(sst){

  regex = new RegExp("over","ig");
  sst = sst.replace(regex,"/");
  //////////////////////////////////////////console.log(sst);
  /************************
This is the same as the fraction friendly function,
but only takes case of fractions inside roots.

A similar appoach must eventually be created to
have it so that we can forge infinite roots within oneself.
This is again a quesiton more of CSS than JS.
  *************************/
  return sst;
}

/******
Mark flags simply delineates certain keywords to the HTML-CSS ready
class name/attribute name that will be used for the next step.
This is simply priming the function.
*******/

/**** MARKER: [Mark Flags] ****/
/***** [Commenting] *****/
function markflags(arr,flags){
    for(i = 0; i < arr.length; i++){
        for(j = 0; j < flags.length; j++){
            if(arr[i][1] == 0 && arr[i][0].toUpperCase() == flags[j].toUpperCase()){
                arr[i][1] = 1; // making it a flag.
            }
        }
    }
    return arr;
}
/******
HZ: Simple function, given a relation
between two terms, window.swaps it.
str: entire string
relation: name of relation
ex: swapterms("A onto B", "onto") = "B onto A"
*******/
function swapterms(str, relation) {
    index = str.indexOf(relation);
    firstElement = str.substring(0, index - 1);
    secondElement = str.substring(str.indexOf(" ", index) + 1);
    return secondElement + " " + relation + " " + firstElement;
}


/*******
A section is a micro-class that is used to establish each part
with two parameters - the type which is what is identified in
the HTML and the content which is what goes inside the HTML.
********/
/**** MARKER: [Section] ****/

    var Section = function (type,content) {
        this.type = type;
        this.content = content;
    };

/********
Get sections takes an array of sections and combines it
into HTML.  It has an optional array of aliases which can be
used to generate the more appropriate tag that may have
not been done in mark flags. An flag may not be found in
the object but may be compared to a specific alias.
********/

    var passback;
    /**** MARKER: [Get Sections] ****/
    function getSections(arr, html, alias){  // code to transform sections into blocks;
        arr_of_sections = [];
        var sections_done = [];
        for(i = 0; i < arr.length; i++){
            if(arr[i][1] == 1) { // checking for flag
                var code = "";
                for(j = i + 1; j < arr.length; j++){
                    if(arr[j][1] == 1){
                        break;
                    }
                    var code = code + " " + arr[j][0];
                }
                arr_of_sections.push(new Section(arr[i][0],code));
            }
        }
        passback = arr_of_sections;
        /** FOR EACH SECTION **/
        arr_of_sections.forEach(function(entry){
            for(i = 0; i < alias.length; i++){
                if(alias[i][0].toUpperCase() == entry.type.toUpperCase()){
                    type = alias[i][1];
                    break;
                }
            }
            if(sections_done.indexOf(type) == -1 && type != false){
              html.push("<div " + type + ">");

              if(type == "top" || type == "bottom" || type == "upperbound" || type == "lowerbound" || type == "goingto"){
                entry.content = ff(entry.content);
              }
              ////////////////////////////////////console.log("Sections: " + entry.content);
              html.push(parse(entry.content, false)); //recursive loop to parse
              ////////////////////////////////////console.log(html);
              html.push("</div>");
              sections_done.push(type);
            }
        });
        return html;
    }

/*******
Write takes the name, arr of values, and alises and
sets up the macro level tagging, ie the enclosing div.
This is different from sections which handles the internal
components.  Here, for instance, "integral" may be instantiated
but the parts "upperbound" and "lowerbound" would be found
in the upper section.
*******/
    /**** MARKER: [Write Html] ****/

    function writeHTML(name,arr, alias) {
        html = [];
        // opening tag
        html.push("<div " + name + ">");
        // compilation code
        html = getSections(arr,html,alias);
        //closing tag
        html.push("</div>");
        html = html.join("\n");
        return html;
    }

/*********
A term is base object which is basic, ie like 4 + 3x
*********/
/**** MARKER: [Term] ****/
    function Term(str) {
        Macro.call(this, str);
        this.html = "<div term>" + str + "</div>";
    }


/*******
Square Root object.
*******/
/**** MARKER: [Root] ****/
    function Root(str) {
        Macro.call(this, str);
        this.html = "<div term>" + str + "</div>";
        return false;
        str = rf(str);
        regex = new RegExp("with interior","ig");
        str = str.replace(regex,"of");
        if(str.indexOf('"') != -1 && str.indexOf('"') < str.lastIndexOf('"')){
          first = str.indexOf('"');
		  last = str.lastIndexOf('"');
          str = str.substring(0,first) + str.substring(first+1,last) + " escape " + str.substring(last+1);
        }

		var rootinds = getIndicesOf(" root ", str, false);
		var itrdiff = 0;
		var prevlength = str.length;
		for(rootind in rootinds)
		{
			var ri = rootinds[rootind] + itrdiff;
			var rootafter = wordsafter(str, "of", 1, ri);
			var rootafterind = str.indexOf(rootafter);
			var parin = rootafter.indexOf("parens");
      ////////////console.log(str);
			if(parin!=-1)
			{
				var spaceafter = str.indexOf(" ", rootafterind+2);
				if(spaceafter!=-1)
				{
					str = str.substring(0, rootafterind)  + swap(str.substring(rootafterind,spaceafter))
           + "$nb escape " + str.substring(spaceafter+1);
				}
			}
      ////////////console.log(str);
			itrdiff = str.length-prevlength;
		}

        Macro.call(this, str);
        this.flags = ["of", "ofthedegree"];
        this.alias = [["of","of"],["ofthedegree","degree"]];
        if(str.indexOf("of ") < 0){
          this.flags = ["of*", "ofthedegree", ";;"];
          this.alias = [["of*","of"],["ofthedegree","degree"]];
        }
        this.escaped = "";
        escaped = false;
        rootcount = 0;
        escapecount = 0;
        function findescape(str){
        for(i = 0; i < str.length; i++){

          if(str.substring(i, i+4) == "root"){
            rootcount++;
          }
          if(str.substring(i, i+6) == "escape"){
            escapecount++;
            if(escapecount == rootcount){

              return i;
            }
          }


        }

        return str.length;
        }

        if(findescape(str) != -1){
          escaped = true;
          temp = this.str;
          this.str = temp.substring(0,findescape(str));
          this.arr = this.str.split(" ");
          for(i = 0; i < this.arr.length; i++){
              a = [this.arr[i],0];
              /************************
              this.arr is then refactored to make an array of arrays
              with the first position being the word, and the other being a value.
              ************************/
              this.arr[i] = a;
          }
          this.escaped = temp.substring(findescape(str)+7);
        }
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("root",this.arr, this.alias);
        if(escaped == true){
          addHTML = parse(this.escaped, true);
          this.html = this.html + addHTML;
        }

        window.last_macro = "roots";
    }

/*******
Fraction object.
*******/
/**** MARKER: [Fraction] ****/
    function Fraction(str) {
		////////console.log(str + ": FRACTION before");
        Macro.call(this, str);
        this.flags = ["of", "of*", "over", "allover", "dividedby", ";;"];
        this.alias = [["of","top"],["of*","top"],["over","bottom"],["allover","bottom"],
        ["dividedby","bottom"],[";;",false]];
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("fraction",this.arr, this.alias);
        addHTML = parse(str.substring(str.indexOf(";;")+2,str.length), true);
        if(str.indexOf(";;") > 0){
          this.html = this.html + addHTML;
        }
		////////console.log(str + ": FRACTION after");
        window.last_macro = "fractions";
    }


/*******
Derivative object.
*******/
/**** MARKER: [Derivative] ****/
    function Derivative(str) {
        substr = str.substring(str.indexOf("derivative"), str.indexOf("derivative") + 31);
        substr2 = str.substring(str.indexOf("derivative"), str.indexOf("derivative") + 31);
        if(substr.indexOf("withrespectto") + substr.indexOf("inrespectto") + substr2.indexOf("over") == -3){
          str = str.replace("of","of*");
          str = str.replace("derivative","derivative of withrespectto x");
        }

        regex = new RegExp("inrespectto","ig");
        str = str.replace(regex,"withrespectto");

        regex = new RegExp("withrespectto ([a-zA-Z]+) of ([a-zA-Z]+) ","ig");
        str = str.replace(regex,"of $1 over $2 ");

        regex = new RegExp("over ([a-zA-Z]+) ","ig");
        str = str.replace(regex,"over $1 of* ");





        Macro.call(this, str);
        this.flags = ["of", "withrespectto", "inrespectto", "over","of*"];
        this.alias = [["of","top"],["withrespectto","bottom"],["inrespectto","bottom"],
        ["over","bottom"],["of*",false]];
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("derivative",this.arr, this.alias);
        addHTML = parse(str.substring(str.indexOf("of*")+3,str.length), true);
        if(str.indexOf("of*") > 0){
          this.html = this.html + addHTML;
        }
        window.last_macro = "derivatives";
    }



/*******
Derivative --> Partial Derivative
*******/

    function Partial_Derivative(str){
        Derivative.call(this,str);
        this.html = this.html.replace("div derivative", "div partial derivative");
    }

/*******
Derivative --> Double Partial Derivative
*******/

    function Double_Partial_Derivative(str){
        Derivative.call(this,str);
		//console.log(str + " You got here");
        this.html = this.html.replace("div derivative", "div double partial derivative");
    }

	/*******
Derivative --> Triple Partial Derivative
*******/

    function Triple_Partial_Derivative(str){
        Derivative.call(this,str);
        this.html = this.html.replace("div derivative", "div triple partial derivative");
    }


/*******
Derivative --> Double Derivative
*******/

    function Double_Derivative(str){
        Derivative.call(this,str);
        this.html = this.html.replace("div derivative", "div double derivative");
    }

/*******
Derivative --> Double Derivative
*******/

        function Triple_Derivative(str){
            Derivative.call(this,str);
            this.html = this.html.replace("div derivative", "div triple derivative");
        }


/*******
Limit
*******/
/**** MARKER: [Limit] ****/
    function Limit(str) {
        ////////console.log("entering Limiit");
        ////////////console.log(str);
        ////////console.log(str);

        if (str.indexOf("of*") == -1) {
          str = str.replace("of", "of*");
          extra = 1;
        }
        //console.log(str);

        //str = str.replace('of', 'off');
        Macro.call(this, str);
        // ////////////////console.log(str);
        this.flags = ["of", "as", "goingto", "headingto", "approaching", "approaches", "of*"];
        this.alias = [["of","variable"],["as","variable"],["goingto","goingto"],["headingto","goingto"],
        ["approaching","goingto"],["approaches","goingto"],["of*",false]];
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("limit",this.arr, this.alias);
        ////////console.log(str);
        ////////console.log(this.html);


        // ////////////////console.log(this.arr);
        // if (str.indexOf("as") > str.indexOf("of")) { // rearange string to proper format
        //
        // }
        // addHTML = "";

        if(str.indexOf("as") > 0){
          if(str.indexOf("as") > str.indexOf("of")){ end = str.indexOf("as");}
          else {end = str.length;}
          ////console.log(addHTML);
          addHTML = parse(str.substring(str.indexOf("of")+2+extra,end), true);
        } else {
          addHTML = parse(str.substring(str.indexOf("of")+2+extra,end), true);
        }

        ////////////////console.log("addition " + addHTML);
        if(str.indexOf("of*") > 0 || str.indexOf("of",str.indexOf("as")) > 0){
          this.html = this.html + addHTML;
        }
        ////////console.log(this.html);

        window.last_macro = "limits";
    }

/*******
Product
*******/
/**** MARKER: [Product] ****/
    function Product(str) {
        str = frombackRetrace(str,"product");
        Macro.call(this, str);
        this.flags = ["of", "of*", "from", "to", "for","index","steps"];
        this.alias = [["of",false],["of*",false],["steps",false],["from","lowerbound"],["index","lowerbound"],["to","upperbound"],["for","upperbound"]];
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("Product",this.arr, this.alias);
        addHTML = parse(str.substring(str.indexOf("of")+2,str.length), true);
        if(str.indexOf("of") > 0){
          this.html = this.html + addHTML;
        }
        window.last_macro = "products";
    }

/*******

Big Union
*******/
/**** MARKER: [Big Union] ****/
    function Bigunion(str) {
        Macro.call(this, str);
        this.flags = ["of", "of*", "from", "to", "for","index","steps"];
        this.alias = [["of",false],["of*",false],["steps",false],["from","lowerbound"],["index","lowerbound"],["to","upperbound"],["for","lowerbound"]];
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("bigunion",this.arr, this.alias);
        addHTML = parse(str.substring(str.indexOf("of")+2,str.length), true);
        if(str.indexOf("of") > 0){
          this.html = this.html + addHTML;
        }
        window.last_macro = "bigunions";
    }

/*******
Big Intersection
*******/
/**** MARKER: [Big Intersection] ****/
    function Bigintersect(str) {
        Bigunion.call(this, str);
        this.html = this.html.replace("div bigunion", "div bigintersect");
    }

/*******
Summation
*******/
/**** MARKER: [Summation] ****/
    function Summation(str) {
        str = flagunecessaries(str);
        str = frombackRetrace(str,"summation");
        Macro.call(this, str);
        this.flags = ["of", "of*", "from", "to", "for","index","steps"];
        this.alias = [["of",false],["of*",false],["steps",false],["from","lowerbound"],["index","lowerbound"],["to","upperbound"],["for","lowerbound"]];
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("Summation",this.arr, this.alias);
        //console.log(this.html);

        //addHTML = parse(str.substring(str.indexOf("from")+4,str.length), true);
        //if(str.indexOf("from") > 0){
          //this.html = writeHTML("Summation",this.arr, this.alias);
        //}





        addHTML = parse(str.substring(str.indexOf("of")+2,str.length), true);




        if(str.indexOf("of") > 0){
          this.html = this.html + addHTML;
        }
        //console.log(this.html);

        window.last_macro = "summations";
        this.sections = passback;
        this.name = "summation";
    }



/*******
Integral
*******/
/**** MARKER: [Integral] ****/

	/** Deletes variables that may interfere with variable recognition of determineVar
	 * MY
	 * Precondition: str must be a string
	 */
	function deleteVars(str) {
		var badWords = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'parens', 'hr'];
		for (var ind in badWords){
			regex = new RegExp(badWords[ind],'ig');
			str = str.replace(regex,'');
		}
		return str;
	}
	//Changes with bounds a,b,c,d to from a to b from c to d
	//with bounds, works with and and ,
	function noBounds(str)
	{
		//asterisks then ampersands
		var boundind = str.indexOf(" with bounds ");

		if(boundind!=-1)
		{
			str = str.replace(" with bounds ", " from ");

      str = str.replace(" and ", ",");


			var nextcomma = str.indexOf(",", boundind);

			if(nextcomma==-1) { nextcomma = str.indexOf("and", boundind); }

			////////console.log(nextcomma + ": nextcomma");
			var to = true;
			var itr = 1;
			while(nextcomma!=-1)
			{
				////////console.log(nextcomma + ": nextcomma");
				if(Math.floor(itr/2) ==0)
				{
					if(to) { str = str.substring(0,nextcomma) + " to " + str.substring(nextcomma+1);}
					else { str = str.substring(0, nextcomma) + " from " + str.substring(nextcomma + 1);}
				}
				else if (Math.floor(itr/2) == 1)
				{
					if(to) { str = str.substring(0,nextcomma) + " to* " + str.substring(nextcomma+1);}
					else { str = str.substring(0, nextcomma) + " from* " + str.substring(nextcomma + 1);}
				}
				else if (Math.floor(itr/2) ==2)
				{
					if(to) { str = str.substring(0,nextcomma) + " to& " + str.substring(nextcomma+1);}
					else { str = str.substring(0, nextcomma) + " from& " + str.substring(nextcomma + 1);}
				}
				else
				{ }
				nextcomma = str.indexOf(",", nextcomma+1);
				if(nextcomma==-1) { nextcomma = str.indexOf("and", nextcomma+1); }
				////////console.log(str);
				to = !to;
				itr++;
			}







		}
	    ////////console.log(str + ": after bounds stuf");
		return str;
	}

    function determineVar(str,num){
      //helper function that infers the respect derivative of the integral

      ////////////////////////////////////////console.log("examplestring");
      ////////////////console.log(str);
      // regex = "";
      //HZ: Removes anything in angle brackets (mostly tags) for more accurate variables
      str = swap(str);

      regex = new RegExp("<([^>])+>", "ig");
      str = str.replace(regex, "");

      regex = new RegExp("%([^>])+%%", "ig");
      str = str.replace(regex, "");

      regex = new RegExp("sup","ig");
      str = str.replace(regex, "");
      regex = new RegExp("sub","ig");
      str = str.replace(regex, "");
      str = str.replace(/[^a-z]/gi, '');

	    str = deleteVars(str);

      if(num > 1){
        //only executed if need more than one bound
        //dynamic programming more efficient otherwise.
        var freq = {};
        for (var i=0; i<str.length;i++) {
            var character = str.charAt(i);
            if (freq[character]) {
               freq[character]++;
            } else {
               freq[character] = 1;
            }
        } //pure frequency count by implicitly converting character into ASCII code.
        var sortable = [];
        for (var item in freq){
          sortable.push([item, freq[item]])
        }
        sortable.sort(function(a, b) {return  b[1] - a[1]})
        if(!sortable[0]){
          sortable[0] = ["x"];
        }
        if(!sortable[1]){
          sortable[1] = ["y"];
        }
        if(!sortable[2]){
          sortable[2] = ["z"];//triple main vars.
        }
        if(num == 2){
          return "d" + sortable[0][0] + " d" + sortable[1][0];
        }
        if(num == 3){
          return "d" + sortable[0][0] + " d" + sortable[1][0] + " d" + sortable[2][0];
        }
      }

      expCounts = {};
      maxKey = '';
      for(var i = 0; i < str.length; i++)
      {
          var key = str[i];
          if(key == " " || key == "e"){
            continue;
          }

          // if (i == str.indexOf("parens", i)) {
          //   i += 6;
          //   continue;
          // }
          if(!expCounts[key]){
           expCounts[key] = 0;
          }
          expCounts[key]++;
          if(maxKey == '' || expCounts[key] > expCounts[maxKey]){
              maxKey = key;
          }

      } //mapping for ranking, dynamically done.
      ////////////////console.log(str);
      if(maxKey == ''){
        return "dx";
      } else {
        return "d" + maxKey;
      }
    }

    function flagunecessaries(str){

      sep = [
        /*["root of","root with interior"]*/
      ]
      for(i = 0; i < sep.length; i++){
        if(str.toUpperCase().indexOf(sep[i][0].toUpperCase()) != -1){
              regEx = new RegExp(sep[i][0], "ig");
              str = str.replace(regEx,sep[i][1]);
        }
      }
      return str;
    }

    function frombackRetrace(str,term){
      if(str.indexOf("from") > str.indexOf("of") && (str.indexOf("of") != -1 || str.indexOf("integral") != -1)) { // && str.indexOf("of") != -1 ) { // remove with limits hack
            wls = str.indexOf("from");
            to = str.indexOf("to", wls+5);
            space = str.indexOf(" ", to+4);
            if(str.indexOf("<hr ", to+2)+3 == space){
              space = str.indexOf(" ", space+2);
            }
            intr = str.indexOf(term);
            intr = str.indexOf(" ",intr);
            if(space == -1 || to == -1){
                str = str.substring(0,wls);
            } else {
               str = str.substring(0,intr) + " " + str.substring(wls,space) + str.substring(intr,wls) + str.substring(space);
            }
      }
      return str;
    }

    function Integral(str,type) {
		str = noBounds(str);
        str = flagunecessaries(str);//return without flags pertinent to other mediums.
        //not robust.
        if (str.indexOf(" of") == -1) {
          str = str.replace("integral", "integral of");
        }
        str = frombackRetrace(str,"integral");
        Macro.call(this, str);


        this.flags = ["from", "to", "of*", "of&", "of", "from*", "to*", "from&", "to&", "wls","region"];
        this.alias = [["of",false],["of*",false],["of&",false],
                      ["from*","lowerboundtwo"],["to*","upperboundtwo"],
                      ["from&","lowerboundthree"],["to&","upperboundthree"],
                      ["from","lowerbound"],
                      ["wls","lowerbound"],
                      ["to","upperbound"],
                      ["region","region"]
                     ];
        this.arr = markflags(this.arr, this.flags);

        this.html = writeHTML("Integral",this.arr, this.alias);

        if(str.indexOf("of*") != -1 || str.indexOf("of&") != -1){
            addHTML = parse(str.substring(str.indexOf("of")+3,str.length), true);
        } else {
            addHTML = parse(str.substring(str.indexOf("of")+2,str.length), true);
        }

        if(addHTML.indexOf(" d") == -1 && addHTML.indexOf(">d")==-1){
          if(!type){type = 1}
          vartype = determineVar(str.substring(str.indexOf("of")+3,str.length),type);
          wrt = addHTML.indexOf("withrespectto");

          if (wrt != -1) {
            vartype = "d" + addHTML[wrt+ 14];
            addHTML = addHTML.substring(0, wrt) + addHTML.substring(wrt + 15);
          }
          if(addHTML.indexOf("=") != -1){
            equals = addHTML.indexOf("=");
            addHTML = addHTML.substring(0,equals) + vartype + " " + addHTML.substring(equals);
          } else {
            addHTML = addHTML + "<div term> " + vartype + "</div>";
          }
        }
        if(str.indexOf("of") > 0){
          this.html = this.html + addHTML;
        }
        this.sections = passback;
        this.name = "integral";
        window.last_macro = "integrals";
    }

/*******
EVALUATION


*******/
/**** MARKER: [EVALUATION] ****/
     function Evaluation(str) {

        Macro.call(this, str);
        this.flags = ["from", "to", "from*", "to*", "from&", "to&", "and"];
        this.alias = [
                      ["from*","lowerbound"],["to*","upperbound"],
                      ["from&","lowerbound"],["to&","upperbound"],
                      ["from","lowerbound"],
                      ["wls","lowerbound"],
                      ["and","upperbound"],
                      ["to","upperbound"]];
		//fas
		this.escaped = "";
        escaped = false;
        rootcount = 0;
        escapecount = 0;
        function findescape(str){
        for(i = 0; i < str.length; i++){

          if(str.substring(i, i+10) == "evaluation"){
            rootcount++;
          }
          if(str.substring(i, i+6) == "escape"){
            escapecount++;
            if(escapecount == rootcount){

              return i;
            }
          }


          //////////////////////////////console.log(rootcount + "root");
          //////////////////////////////console.log(escapecount + "esc");
        }
        return str.length;
        }
        //////////////////////////////console.log(findescape(str) + ": findescape returns this");

        if(findescape(str) != -1){
          escaped = true;
          temp = this.str;
          this.str = temp.substring(0,findescape(str));
          this.arr = this.str.split(" ");
          for(i = 0; i < this.arr.length; i++){
              a = [this.arr[i],0];
              /************************
              this.arr is then refactored to make an array of arrays
              with the first position being the word, and the other being a value.
              ************************/
              this.arr[i] = a;
          }
          this.escaped = temp.substring(findescape(str)+7);
        }
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("Evaluation",this.arr, this.alias);
        if(escaped == true){
          addHTML = parse(this.escaped, true);
          this.html = this.html + addHTML;
        }
		/**
		//endfas
        this.arr = markflags(this.arr, this.flags);

        this.html = writeHTML("Evaluation",this.arr, this.alias);
		*/
        this.sections = passback;
        this.name = "EVALUATION";
        window.last_macro = "EVALUATION";
    }
/*******
Integral --> Contour Integral
*******/

  function Contour_Integral(str){
      Integral.call(this,str,1);
      this.html = this.html.replace("div Integral", "div ContourIntegral");
  }

/*******
Integral --> Surface Integral
*******/

  function Surface_Integral(str){
      Integral.call(this,str,2);
      this.html = this.html.replace("div Integral", "div SurfaceIntegral");
  }

/*******
Integral --> Volume Integral
*******/

  function Volume_Integral(str){
      Integral.call(this,str,3);
      this.html = this.html.replace("div Integral", "div VolumeIntegral");
  }

/*******
Integral --> Double Integral
*******/

  function Double_Integral(str){
      Integral.call(this,str,2);
      this.html = this.html.replace("div Integral", "div DoubleIntegral");
  }

/*******
Integral --> Triple Integral
*******/

  function Triple_Integral(str){
      Integral.call(this,str,3);
      this.html = this.html.replace("div Integral", "div TripleIntegral");
  }

  function toBasics(str){
    //////console.log(str);
    str = ff(str);
    str = post(str);
    regex = new RegExp("<sup>([a-zA-Z0-9]+)<\\/sup>","ig");
    str = str.replace(regex,"^($1)");
    regex = new RegExp("escape","ig");
    str = str.replace(regex,"");
    regex = new RegExp("<span static>([0-9]+)<\\/span>","ig");
    str = str.replace(regex,"$1");
    // regex = new RegExp("<hr r00t>of \(([^)])+\)","ig");
    // str = str.replace(regex,"nthRoot ");
    ////console.log("woot:"str);
    if (str.indexOf("<hr r00t>of") > 2) {
      // //console.log("IN IFFFFF");
      regex = new RegExp("third <hr r00t>of ([^\s]+)","ig");
      str = str.replace(regex,"nthRoot \($1, 3\)");
      regex = new RegExp("fourth <hr r00t>of ([^\s]+)","ig");
      str = str.replace(regex,"nthRoot \($1, 4\)");
      regex = new RegExp("fifth <hr r00t>of ([^\s]+)","ig");
      str = str.replace(regex,"nthRoot \($1, 5\)");
      regex = new RegExp("sixth <hr r00t>of ([^\s]+)","ig");
      str = str.replace(regex,"nthRoot \($1, 6\)");
      regex = new RegExp("seventh <hr r00t>of ([^\s]+)","ig");
      str = str.replace(regex,"nthRoot \($1, 7\)");
      regex = new RegExp("eigth<hr r00t>of ([^\s]+)","ig");
      str = str.replace(regex,"nthRoot \($1, 8\)");
      regex = new RegExp("ninth <hr r00t>of ([^\s]+)","ig");
      str = str.replace(regex,"nthRoot \($1, 9\)");
    }
    regex = new RegExp("<hr r00t>of ([^\s]+)","ig");
    str = str.replace(regex,"nthRoot \($1, 2\)");
    regex = new RegExp("<hr th3ta>");
    str = str.replace(regex, "theta");
    regex = new RegExp("<hr theta>");
    str = str.replace(regex, "theta");

    //trig x shorthand
    regex = new RegExp("sin x", "ig");
    str = str.replace(regex,"sin(x)");
    regex = new RegExp("cos x", "ig");
    str = str.replace(regex,"cos(x)");
    regex = new RegExp("tan x", "ig");
    str = str.replace(regex,"tan(x)");

    regex = new RegExp("csc\\(", "ig");
    str = str.replace(regex,"1/sin(");
    regex = new RegExp("sec\\(", "ig");
    str = str.replace(regex,"1/cos(");
    regex = new RegExp("cot\\(", "ig");
    str = str.replace(regex,"1/tan(");

    //x^-1
    regex = new RegExp("([a-z0-9]+)<sup>-([a-z0-9]+)<\\/sup>", "ig");
    str = str.replace(regex,"1/($1^$2)");

    //a^x

    regex = new RegExp("([0-9]+)\\^\\(([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)x\\)", "ig");
    str = str.replace(regex,"exp(ln($1)$2x)");
    regex = new RegExp("e\\^\\(([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)x\\)", "ig");
    str = str.replace(regex,"exp($1x)");



    regex = new RegExp("([0-9]+)<sup>([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)x([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)<\\/sup>", "ig");
    str = str.replace(regex,"exp(ln($1)$2x)");
    regex = new RegExp("e<sup>([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)x([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)<\\/sup>", "ig");
    str = str.replace(regex,"exp($1x$2)");

    //u(x)
    regex = new RegExp("u\\(([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)\\)", "ig");
    str = str.replace(regex,"(2/(1+exp(-$1)))-mod((2/(1+exp(-$1))),1)");

    //floor and ceil

    regex = new RegExp("ceil\\(([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)\\)", "ig");
    str = str.replace(regex,"$1 - mod(mod($1,1) + 1,1)+1");
    regex = new RegExp("floor\\(([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)\\)", "ig");
    str = str.replace(regex,"$1 - mod(mod($1,1) + 1,1)");

    regex = new RegExp("abs\\(([a-z0-9\\+\\*\\.\\-\\/\\(\\)]*)\\)", "ig");
    str = str.replace(regex,"sqrt($1^2)");

    //////console.log("toBasics");
    //////console.log(str);
    return str;
  }

  function fromVerbatim(str){
    // return str; // Seems to be returning undefined?? commented out to prevent this
    sep = [
      ["thin parabola","2x^2"],
      ["fat parabola",".5x^2"],
      ["wide parabola",".5x^2"],
      ["parabola","x^2"],
      ["cubic","x^3"],
      ["quartic","x^4"],
      ["inverse function","(1) / (x)"],
      ["inverse","(1) / (x)"],
      ["horizontal ine","0"],
      ["line","x"]
    ];

    for(i = 0; i < sep.length; i++){
      regex = new RegExp(sep[i][0],"ig");
      // //console.log(str);
      str = str.replace(regex,sep[i][1]);
    }
    return str;
  }

  window.graphs = [];
  window.graph_counter = 0;
  window.polar = false;


/*******
Graph
*******/
/**** MARKER: [Graph] ****/
    function Graph(str) {
      // //console.log(str);
      // Finds bounds in graph
      //console.log("Graph:");
      //console.log(str);
      //console.log(window.graphs);
      str = str.replace("<span  vector>f</span>","f vector");
      str = str.replace("<span  vector>d</span>","d vector");
      //console.log("Graph:");
      //console.log(str);
      var bounds = [[-10, 10], [-10, 10]];
      var noLabels = false;
      newstr = economics(str);
      renderFunction = [];
      if(newstr[0] != str){
        str = newstr[0];
        var bounds = [[0, 10], [0, 10]];
        noLabels = true;
        renderFunction = newstr[1];
      }
      econ = false;
      macro = false;
      laffer = false;
      ppf = false;
      if(str.indexOf("graph ecn of") != -1){
        econ = true;
        str = str.replace("ecn ","");
        if(str.indexOf("macro") != -1){
          regex = new RegExp("macro","ig");
          str = str.replace(regex, "");
          macro = true;
        }
        else if(str.indexOf("laffer") != -1){
          regex = new RegExp("laffer","ig");
          str = str.replace(regex, "");
          laffer = true;
        }
        else if(str.indexOf("ppf") != -1){
          regex = new RegExp("ppf","ig");
          str = str.replace(regex, "");
          ppf = true;
        }
      }
      idx = str.indexOf("graph of");
      // //console.log("index: " + idx);
      if (idx == -1) {
        // Macro.call(this, str);
        // this.html = "";
        return false;
      }
      if (str.indexOf("from",idx) != -1 && str.indexOf("to ", idx) != -1) {
        from = str.indexOf("from", idx);
        // //console.log("from: " + from);
        lower = wordsafter(str, "from", 1, from);
        // //console.log("lower " + lower);
        lower = lower.substring(1);
        upper = wordsafter(str, "to", 1, from);
        upper = upper.substring(1);
        // //console.log("lower: " + lower);
        // //console.log("upper: " + upper);
        regex = new RegExp("^[0-9-]");
        if (lower.match(regex) != null) {
          lower = parseInt(lower, 10);
          bounds[0][0] = lower;
        }
        if (upper.match(regex) != null) {
          upper = parseInt(upper, 10);
          bounds[0][1] = upper;
        }

        // if (lower != NaN) {bounds[0][0] = lower};
        // if (upper != NaN && upper != "</div>") {bounds[0][1] = upper};
        // //console.log(bounds);
      }
      if (str.indexOf("from*",idx) != -1 && str.indexOf("to* ", idx) != -1) {
        from = str.indexOf("from*", from);
        // //console.log("from: " + from);
        lower = wordsafter(str, "from*", 1, from);
        // //console.log("lower " + lower);
        lower = lower.substring(1);
        upper = wordsafter(str, "to*", 1, from);
        upper = upper.substring(1);
        // lower = parseInt(lower, 10);
        // upper = parseInt(upper, 10);
        // if (lower != NaN) {bounds[1][0] = lower};
        // if (upper != NaN) {bounds[1][1] = upper};
        regex = new RegExp("^[0-9-]");
        // //console.log(lower);
        // //console.log(upper);
        if (lower.match(regex) != null) {
          lower = parseInt(lower, 10);
          bounds[1][0] = lower;
        }
        if (upper.match(regex) != null) {
          upper = parseInt(upper, 10);
          bounds[1][1] = upper;
        }
        // //console.log(bounds);
      }

      Macro.call(this, str);
      eqs = [];
      idx = str.indexOf("of ");
      fns = str.substring(idx + 3);
      eqs = fns.split(" and ");

      if(idx > -1 && str.indexOf("from") != -1){
        last = eqs[eqs.length-1];
        eqs[eqs.length-1] = last.substring(0, last.indexOf("from"));
      }

      names = [];

      for (var i = 0; i < eqs.length; i++) {
        //names.push(getName(eqs[i])[0]);
        //eqs[i] = getName(eqs[i])[1];
        eqs[i] = toBasics(eqs[i]);
        eqs[i] = fromVerbatim(eqs[i]);
         //[here3]
        if (eqs[i].indexOf("theta") != -1) { // SET POLAR GRAPH
          window.polar = true;
        // } else if (eqs[i].indexOf("i ") != -1) {
        //   window.vector = true;
        //   eqs[i] = eqs[i].replace(/\s/g, '');
        //   if (eqs[i].indexOf("+") != -1) {
        //     eqs[i] = eqs[i].split("+");
        //   } else if (eqs[i].indexOf("-") != -1) {
        //     eqs[i] = eqs[i].split("-");
        //   }
        //   real = eqs[i][0];
        //   im = eqs[i][1];
        //   if (real.indexOf("i") != -1) {
        //     store = real;
        //     real = im;
        //     im = store;
        //   }
        //   im = im.replace("i", "");
        //   real = parseInt(real, 10);
        //   im = parseInt(im, 10);
        //   eqs[i] = [real, im];
        //   // real = wordsbefore(eqs[i], "i", 1);
        //   // real = parseInt(real, 10);
        // } else if (eqs[i].indexOf("vector (") != -1) {
        //   window.vector = true;
        //   eqs[i] = eqs[i].replace(/\s/g, '');
        //   regex = new RegExp("\(([0-9]+),([0-9]+)\)");
        //   if (eqs[i].match(regex) != null) {
        //     first = eqs[i].match(regex)[2];
        //     second = eqs[i].match(regex)[3];
        //     first = parseInt(first, 10);
        //     second = parseInt(second, 10);
        //     eqs[i] = [first, second];
        //   }
        }
        eqs[i] = parseColor(eqs[i]);
        eqs[i] = parseVector(eqs[i]);
      }
      //console.log(eqs);
      // //console.log("equations: " + eqs);
      // eq = toBasics(eq);
      // eq = fromVerbatim(eq);
      if(laffer == true){this.html = "<div laffer graph id='graph_" + window.graph_counter + "'></div>";}
      else if(ppf == true){this.html = "<div ppf graph id='graph_" + window.graph_counter + "'></div>";}
      else if(econ == true){this.html = "<div sd graph id='graph_" + window.graph_counter + "'></div>";}
      else{this.html = "<div graph id='graph_" + window.graph_counter + "'></div>";}
      if(econ == true && macro != true && laffer != true && ppf != true){ this.html = this.html + " ecnkey"}
      if(econ == true && macro == true){ this.html = this.html + " ecnmkey"}
      if(econ == true && laffer == true){ this.html = this.html + " ecnlkey"}
      if(econ == true && ppf == true){ this.html = this.html + " ecnpkey"; noLabels = false;}
      window.graphs.unshift([eqs, window.graph_counter,str.substring(idx+3,str.length),bounds,noLabels,renderFunction]);
      window.graph_counter++;
      //this.html = writeHTML("Graph",this.arr, this.alias);
        /*sep = [
          [" thin parabola","pbla",["thin"]],
          [" fat parabola","pbla",["wide"]],
          [" wide parabola","pbla",["wide"]],
          [" cubic","cubic"],
          [" parabola","pbla"],
          [" root","squarert"],
          ["diagonal<span class='geo_line'>","line",["diagonal"]],
          ["<span class='geo_line'>","line"]
        ]
        for(i = 0; i < sep.length; i++){
          regex = new RegExp(sep[i][0],"ig");
          classes = "";
          if(sep[i][2] instanceof Array){
          for(j = 0; j < sep[i][2].length; j++){
            classes = classes + " " + sep[i][2][j];
          }
          }
          str = str.replace(regex," <hr class='" + classes + "' " + sep[i][1] + "> ");
        }

        sep = [
          ["pbla","parabola"]
        ]
        for(i = 0; i < sep.length; i++){
          regex = new RegExp(sep[i][0],"ig");
          str = str.replace(regex,sep[i][1]);
        }

        Macro.call(this, str);
        this.flags = ["of"];
        this.alias = [["of","of"]];
        this.arr = markflags(this.arr, this.flags);
        this.html = writeHTML("Graph",this.arr, this.alias);
        window.last_macro = "graph";*/
    }

    function parseVector(str){
      if(typeof str !== 'object' && str.indexOf("vector") != -1){
        str = str.replace("vector","");
        arr = str.split("%");
        first = arr[0].split(",");
        second = arr[1].split(",");
        str = {};
        str.name = "vector";
        str.fromX = first[0];
        str.fromY = first[1];
        str.toX = second[0];
        str.toY = second[1];
      }
      return str;
    }

    function parseColor(str){
      if(str.indexOf("color") != -1){
        color = str.indexOf("color");
        str = str.replace("color","");
        newobj = {};
        newobj.name = "function";
        newobj.equation = str.substring(0,color);
        newobj.color = str.substring(color);
        str = newobj;
      }
      return str;
    }
/*******
Venn Diagram creation functions.
*******/
/**** MARKER: [Venn] ****/

  function venn_factor(str){
      while(str.toUpperCase().indexOf("VENN DIAGRAM") != -1){
          window.last_macro = "venns";
          //prima identification
          venn_pos = str.toUpperCase().indexOf("VENN DIAGRAM");                 //position
          HTMLbuilder = "<div venn ";                                           //opening build
          of_pos = str.toUpperCase().indexOf("OF",venn_pos+9);                  //position of of
          if(of_pos == -1){
              of_pos = str.length;                                              //exception
          }
          where_pos = str.toUpperCase().indexOf("WITH",of_pos);                 //ending word
          if(where_pos == -1){
              where_pos = str.length;                                           //exception
          }
          shaded_pos = str.toUpperCase().indexOf("SHADED",where_pos);           //alternate ending
          if(shaded_pos == -1){
              shaded_pos = str.length;                                          //exception
          }
          items = str.substring(where_pos+4, shaded_pos);                       //vd options
          semi_pos = str.toUpperCase().indexOf(";",where_pos);                  //end of venn DIAGRAM
          if(semi_pos == -1){
              semi_pos = str.length;                                            //exception
          }
          terms = str.substring(of_pos+2, where_pos).replace(", and",",").replace("and",",");

          regex = new RegExp("%hrintegers%%","ig");
          terms = terms.replace(regex,"Z");
                                 //terms
          num = countInstances(terms,",");
          terms = terms.split(",");                                             //split terms by comma
                                      //# of terms
          if(num == 1){
              HTMLbuilder = HTMLbuilder + "two background>";                    //basic build of string
              HTMLbuilder = HTMLbuilder + "<div A><span>" + terms[0] + "</span><div AB></div></div><div B><span>" + terms[1] + "</span></div></div>";
          } else if(num == 2){
              HTMLbuilder = HTMLbuilder + "three background>";                  //basic three build of string
              HTMLbuilder = HTMLbuilder + "<div A><span>" + terms[0] + "</span><div AB><div ABC></div></div><div AC></div></div><div B><span>" + terms[1] + "</span><div BC></div></div><div C><span>" + terms[2] + "</span></div></div>";
          } else if(num == 3){
              HTMLbuilder = HTMLbuilder + "four background>";                   //basic four build of string
              HTMLbuilder = HTMLbuilder + "<div A><span>" + terms[0] + "</span><div AB> <div ABC> <div ABCE></div> </div> <div ABE></div> </div> <div AC> <div ACE></div> </div> <div AE></div> </div> <div B><span>" + terms[1] + "</span><div BE></div> <div BC></div> </div> <div C><span>" + terms[2] + "</span><div CE> <div BCE></div> </div> <div BC></div> </div> <div E><span>" + terms[3] + "</span><div AE></div> </div> </div>";
          }
          possibilities = ["%","#","@","!!"];                                   //window.swaps for ease
          regex = new RegExp("%hrintegers%%","ig");
          items = items.replace(regex,"Z");
          items_arr = items.split(",");
          for(k = 0; k < items_arr.length; k++){                                //loop through terms
              regex = new RegExp(" ","ig");
              items_arr[k] = items_arr[k].replace(regex,"");
              for(p = 0; p < terms.length; p++){                                //terms for subsequence
                  regex = new RegExp(" ","ig");
                  terms[p] = terms[p].replace(regex,"");
                  items_arr[k] = items_arr[k].replace(terms[p],possibilities[p]);
              }

              regex = new RegExp("%","ig");                                     //symbols
              items_arr[k] = items_arr[k].replace(regex,"A");                   //letter sequence
              regex = new RegExp("#","ig");
              items_arr[k] = items_arr[k].replace(regex,"B");
              regex = new RegExp("@","ig");
              items_arr[k] = items_arr[k].replace(regex,"C");
              regex = new RegExp("!!","ig");
              items_arr[k] = items_arr[k].replace(regex,"E");
              //add alphabetical window.swaps here
              items_arr[k] = items_arr[k].split("").sort().join("");            //sort to correct order
              regex = new RegExp(" " + items_arr[k] + ">","ig");                //add to venn diagram
  HTMLbuilder = HTMLbuilder.replace(regex," " + items_arr[k] + " shaded>" );    //replace with regex shaded
          }
          str = str.substring(0,venn_pos) + HTMLbuilder + str.substring(semi_pos+1);
      }
      return str;
  }


/*******
Matrix creation functions in two steps.  In the Prime() function below,
matrix_factor is called to check and create an matrixes in the string.
Note, this happens BEFORE the parse() lifecycle.
*******/
/**** MARKER: [Matrix] ****/
  function matrix_factor(str){
      equal_used = false;
      counter = 0;
      // loop while matrixes are in play.
      while(str.indexOf(" matrix:") != -1){

          window.last_macro = "matrices";
          loc = str.indexOf("matrix:");
          curled = false;
          if(str.lastIndexOf("curly",loc) > str.lastIndexOf(" ",loc-2)){
            curled = true;
          }
          if(curled == true){
            str = str.replace("curly","");
            loc = str.indexOf("matrix:");
          }

          dimensions = get_dimensions(str); // get dimensions gets the height of the matrix.
          height = dimensions[0];
          width = dimensions[1];
          all = [];
          total = width*height;
          if(width == "" || width == " m" || width.indexOf("escape") != -1){
            total = 0;
          }
          if(total == 0){total = 64;}
          last = loc+7;
          nextmatrix = str.indexOf("matrix:",loc+1);
          if(nextmatrix == -1){
              nextmatrix = str.length; // checking for next matrix to avoid using
              // a dangling comma.
          }
          bool = false;
          c = 0;
          while((str.indexOf(",",last) != -1 && str.indexOf(",",last) < nextmatrix && c < total)
               || (str.indexOf(";",last) != -1 && str.indexOf(";",last) < nextmatrix && c < total)
               || (str.indexOf("=",last) != -1 && str.indexOf("=",last) < nextmatrix && c < total)
             ){
              c++;
              next = str.indexOf(",",last);
              semi = str.indexOf(";",last);
              equal = str.indexOf("=",last);

              if(next == -1 || next > nextmatrix){
                  next = str.indexOf(";",last);
                  bool = true;
              }

              if(next == -1 || next > nextmatrix){
                  next = str.indexOf("=",last);
                  bool = true;
                  equal_used = true;
              }

              if(next > semi && semi != -1){
                next = semi;
              }

              if(next > equal && equal != -1){
                next = equal;
              }
              all.push(str.substring(last,next).replace(" over ","/"));
              last = next + 1;
              if(bool == true){
                  break;
              }
          }

          if(width*height == 0 || width == "" || width == " m" || width.indexOf("escape") != -1){
            width = 0;
            height = 0;
            while(width*height < all.length){
                if(width > height){
                  height++;
                } else {
                  width++;
                }
            }
            total = width*height;
          }

          if(all.length + 1 == width*height){
            all.push(str.substring(next+1).replace(" over ","/"));
            last = str.length - 1;
          }

          ////////////////////////////////////////////console.log(last);
          if(equal_used == true){
            last--;
          }
          ////////////////////////////////////////////console.log(last);

          //sorts all the value of the matrix into a single array above
          //known as all[]
          m = [];
          counter = 0;
          row = 0;
          col = 0;


          while(counter < all.length && counter < width*height){
              if(m[row%width] == undefined){
                  m[row%width] = [];
              }
              m[row%width][col] = all[counter];
              row++;

              if(row%width == 0){
                  col++;
              }
              counter++;
          }
          //modulo function that takes the values of the matrix and fits them
          //into the matrix shell.
          insert = "";
          for(i = 0; i < m.length; i++){
              insert = insert + "<b>";
              for(j = 0; j < m[i].length; j++){
                  insert = insert + "<a>";
                  insert = insert + mf(m[i][j]);
                  insert = insert + "</a>";
              }
              insert = insert + "</b>";
          }
          //formats the matrix into HTML.
          num = "one";
          if(height == 2){
              num = "two";
          }
          if(height == 3){
              num = "three";
          }
          if(height == 4){
              num = "four";
          }
          if(height == 5){
              num = "five";
          }
          if(height == 6){
              num = "six";
          }
          if(height == 7){
              num = "seven";
          }
          if(height == 8){
              num = "eight";
          }
          if(height > 2){
            window.large_eq = true;
          }
          modification_matrix = "";
          if(str.indexOf("modified by") != -1 && str.indexOf("modified by") < str.indexOf("matrix",last) && str.indexOf("matrix",last) != -1 ||
          str.indexOf("modified by") != -1 && str.indexOf("matrix",last) == -1
          ){
          modification_matrix = "<div modification " + num + "><b>";
          start = str.indexOf("modified by") + 11;
          counter = 0;
          while(start < str.indexOf(",",start) && counter < height || start < str.indexOf(";",start) && counter < height){
            nextcomma = str.indexOf(",",start);
            if(nextcomma == -1){
              nextcomma = str.indexOf(";",start);
            }
            term = str.substring(start,nextcomma);
            modification_matrix = modification_matrix + "<a>" + term + "</a>";
            start = nextcomma+1;
            counter++;
          }
          modification_matrix = modification_matrix + "</b></div>";
          last = nextcomma + 1;
          }
          //formats the number of eight.
          //inserts the matrix mid term.
          if(curled == true){ num = num + " curly";}
          insert = "</div><div matrix " + num + ">" + insert + "</div> " + modification_matrix + "<div term>";
          by = str.lastIndexOf(" by ",loc);
          if(by == -1){
            by = str.lastIndexOf(" x ",loc);
          }
          lastspace = str.lastIndexOf(" ", by);
          if(by == -1){
            lastspace = loc;
          }
          if(lastspace < str.lastIndexOf("matrix",loc-1)){
            lastspace = loc;
          }


          random = window.matrixcounter++;
          add_arr = ["mtrx_$" + random + "$_", insert];
          window.matrices.push(add_arr);
          str = str.substring(0,lastspace-1) + "mtrx_$" + random + "$_" + " " + str.substring(last+1);
          // replace above.
          counter++; //delete
      }
      return str;
  }


  /*******
  Table creation functions in two steps.  In the Prime() function below,
  Table is called to check and create an tables in the string.
  Note, this happens BEFORE the parse() lifecycle.
  *******/
  /**** MARKER: [Table] ****/
    function table_factor(str){
        equal_used = false;
        counter = 0;
        // loop while matrixes are in play.
        while(str.indexOf(" table:") != -1){

            window.last_macro = "tables";
            loc = str.indexOf("table:");
            dimensions = get_dimensions(str,"table"); // get dimensions gets the height of the matrix.
            width = dimensions[0];
            height = dimensions[1];
            all = [];
            total = width*height;
            if(width == ""){
              total = 0;
            }
            if(total == 0){total = 64;}
            last = loc+7;
            nextmatrix = str.indexOf("table:",loc+1);
            if(nextmatrix == -1){
                nextmatrix = str.length; // checking for next matrix to avoid using
                // a dangling comma.
            }
            bool = false;
            c = 0;
            while(str.indexOf(",",last) != -1 && str.indexOf(",",last) < nextmatrix && c < total
                 || str.indexOf(";",last) != -1 && str.indexOf(";",last) < nextmatrix && c < total
                 || str.indexOf("=",last) != -1 && str.indexOf("=",last) < nextmatrix && c < total
               ){
                c++;
                next = str.indexOf(",",last);
                semi = str.indexOf(";",last);
                equal = str.indexOf("=",last);

                if(next == -1 || next > nextmatrix){
                    next = str.indexOf(";",last);
                    bool = true;
                }

                if(next == -1 || next > nextmatrix){
                    next = str.indexOf("=",last);
                    bool = true;
                    equal_used = true;
                }

                if(next > semi && semi != -1){
                  next = semi;
                }

                if(next > equal && equal != -1){
                  next = equal;
                }
                all.push(str.substring(last,next).replace(" over ","/"));
                last = next + 1;
                if(bool == true){
                    break;
                }
            }
            if(all.length + 1 == width*height){
              all.push(str.substring(next+1).replace(" over ","/"));
              last = str.length - 1;
            }

            ////////////////////////////////////////////console.log(last);
            if(equal_used == true){
              last--;
            }
            ////////////////////////////////////////////console.log(last);

            //sorts all the value of the matrix into a single array above
            //known as all[]
            m = [];
            counter = 0;
            row = 0;
            col = 0;
            if(width*height == 0 || width == ""){
              width = 0;
              height = 0;
              while(width*height < all.length){
                  if(width > height){
                    height++;
                  } else {
                    width++;
                  }
              }
              total = width*height;
            }
            while(counter < all.length && counter < width*height){
                if(m[row%width] == undefined){
                    m[row%width] = [];
                }
                m[row%width][col] = all[counter];
                row++;

                if(row%width == 0){
                    col++;
                }
                counter++;
            }
            //modulo function that takes the values of the matrix and fits them
            //into the matrix shell.
            insert = "";
            for(i = 0; i < m.length; i++){
                insert = insert + "<b>";
                for(j = 0; j < m[i].length; j++){
                    if(m[i][j].indexOf("blank") > -1){
                      insert = insert + "<a blank>";
                    } else {insert = insert + "<a>";}
                    insert = insert + mf(m[i][j]);
                    insert = insert + "</a>";
                }
                insert = insert + "</b>";
            }
            //formats the matrix into HTML.
            num = "one";
            if(height == 2){
                num = "two";
            }
            if(height == 3){
                num = "three";
            }
            if(height == 4){
                num = "four";
            }
            if(height == 5){
                num = "five";
            }
            if(height == 6){
                num = "six";
            }
            if(height == 7){
                num = "seven";
            }
            if(height == 8){
                num = "eight";
            }
            if(height > 2){
              window.large_eq = true;
            }
            modification_matrix = "";
            if(str.indexOf("modified by") != -1 && str.indexOf("modified by") < str.indexOf("table",last) && str.indexOf("table",last) != -1 ||
            str.indexOf("modified by") != -1 && str.indexOf("table",last) == -1
            ){
            modification_matrix = "<div modification " + num + "><b>";
            start = str.indexOf("modified by") + 11;
            counter = 0;
            while(start < str.indexOf(",",start) && counter < height || start < str.indexOf(";",start) && counter < height){
              nextcomma = str.indexOf(",",start);
              if(nextcomma == -1){
                nextcomma = str.indexOf(";",start);
              }
              term = str.substring(start,nextcomma);
              modification_matrix = modification_matrix + "<a>" + term + "</a>";
              start = nextcomma+1;
              counter++;
            }
            modification_matrix = modification_matrix + "</b></div>";
            last = nextcomma + 1;
            }
            //formats the number of eight.
            //inserts the matrix mid term.
            insert = "</div><div table " + num + ">" + insert + "</div> " + modification_matrix + "<div term>";
            by = str.lastIndexOf(" by ",loc);
            if(by == -1){
              by = str.lastIndexOf(" x ",loc);
            }
            lastspace = str.lastIndexOf(" ", by);
            if(by == -1){
              lastspace = loc;
            }
            if(lastspace < str.lastIndexOf("table",loc-1)){
              lastspace = loc;
            }


            random = window.tablecounter++;
            add_arr = ["tble_$" + random + "$_", insert];
            window.tables.push(add_arr);
            str = str.substring(0,lastspace-1) + "tble_$" + random + "$_" + " " + str.substring(last+1);
            // replace above.
            counter++; //delete
        }
        return str;
    }

/*******
Pwise creation functions in two steps.  In the Prime() function below,
Pwise_factor is called to check and create an Pwises in the string.
Note, this happens BEFORE the parse() lifecycle.
*******/
/**** MARKER: [Pwise] ****/
    function pwise_factor(str){
        equal_used = false;
        counter = 0;
        // loop while pwisees are in play.
        while(str.indexOf(" pwise:") != -1){

            window.last_macro = "pwises";
            loc = str.indexOf("pwise:");
            dimensions = get_dimensions(str); // get dimensions gets the height of the pwise.
            width = ""; //fakes it out.
            height = dimensions[1];
            all = [];
            total = width*height;
            if(width == ""){
              total = 0;
            }
            if(total == 0){total = 64;}
            last = loc+7;
            nextpwise = str.indexOf("pwise:",loc+1);
            if(nextpwise == -1){
                nextpwise = str.length; // checking for next pwise to avoid using
                // a dangling comma.
            }
            bool = false;
            c = 0;
            end = str.indexOf("=",loc);
            if(end == -1){
              end = str.indexOf(";",loc);
            }
            if(end == -1){
              end = str.length;
            }

            while(str.indexOf("for",loc) != -1 && str.indexOf("for",loc) < end){
              str = str.replace("for",",");
            }
            while(str.indexOf(",",last) != -1 && str.indexOf(",",last) < nextpwise && c < total
                 || str.indexOf(";",last) != -1 && str.indexOf(";",last) < nextpwise && c < total
                 || str.indexOf("=",last) != -1 && str.indexOf("=",last) < nextpwise && c < total
               ){
                c++;
                next = str.indexOf(",",last);
                semi = str.indexOf(";",last);
                equal = str.indexOf("=",last);

                if(next == -1 || next > nextpwise){
                    next = str.indexOf(";",last);
                    bool = true;
                }

                if(next == -1 || next > nextpwise){
                    next = str.indexOf("=",last);
                    bool = true;
                    equal_used = true;
                }

                if(next > semi && semi != -1){
                  next = semi;
                }

                if(next > equal && equal != -1){
                  next = equal;
                }
                all.push(str.substring(last,next).replace(" over ","/"));
                last = next + 1;
                if(bool == true){
                    break;
                }
            }
            if(all.length + 1 == width*height){
              all.push(str.substring(next+1).replace(" over ","/"));
              last = str.length - 1;
            }

            ////////////////////////////////////////////console.log(last);
            if(equal_used == true){
              last--;
            }
            ////////////////////////////////////////////console.log(last);

            //sorts all the value of the pwise into a single array above
            //known as all[]
            m = [];
            counter = 0;
            row = 0;
            col = 0;
            if(width*height == 0 || width == ""){
              width = 2;
              height = 0;
              while(width*height < all.length){
                    height++;
              }
              total = width*height;
            }
            while(counter < all.length && counter < width*height){
                if(m[row%width] == undefined){
                    m[row%width] = [];
                }
                m[row%width][col] = all[counter];
                row++;

                if(row%width == 0){
                    col++;
                }
                counter++;
            }
            //modulo function that takes the values of the pwise and fits them
            //into the pwise shell.
            insert = "";
            for(i = 0; i < m.length; i++){
                insert = insert + "<b>";
                for(j = 0; j < m[i].length; j++){
                    insert = insert + "<a>";
                    insert = insert + mf(m[i][j]);
                    insert = insert + "</a>";
                }
                insert = insert + "</b>";
            }
            //formats the pwise into HTML.
            num = "one";
            if(height == 2){
                num = "two";
            }
            if(height == 3){
                num = "three";
            }
            if(height == 4){
                num = "four";
            }
            if(height == 5){
                num = "five";
            }
            if(height == 6){
                num = "six";
            }
            if(height == 7){
                num = "seven";
            }
            if(height == 8){
                num = "eight";
            }
            if(height > 2){
              window.large_eq = true;
            }

            //formats the number of eight.
            //inserts the pwise mid term.
            insert = "</div><div pwise " + num + " style='margin-left: 16px;'>" + insert + "</div> " + "<div term>";
            by = str.lastIndexOf(" by ",loc);
            // if(by == -1){
            //   by = str.lastIndexOf(" x ",loc);
            // }
            lastspace = str.lastIndexOf(" ", by);
            if(by == -1){
              lastspace = loc;
            }
            if(lastspace < str.lastIndexOf("pwise",loc-1)){
              lastspace = loc;
            }


            random = window.pwisecounter++;
            add_arr = ["pws_$" + random + "$_", insert];
            window.pwises.push(add_arr);
            str = str.substring(0,lastspace-1) + "pws_$" + random + "$_" + " " + str.substring(last+1);
            // replace above.
            counter++; //delete
        }
        return str;
    }

/*****
Geometry Function
******/
  /**** MARKER: [Geometry] ****/
  function geometry(str){
	if(str.indexOf("geo:")==-1)
	{ return str; }
    geo_values = ["line","ray","segment","arc"];
    for(i = 0; i < geo_values.length; i++){
      geo = geo_values[i];
      regex = new RegExp(geo + ": ","ig");
      str = str.replace(regex,geo + " ");
      breaknext=false;
      pointer = 0;

      mainloop:
      while(str.indexOf(geo + " ",pointer) != -1){
        start = str.indexOf(geo + " ",pointer);
        space = str.indexOf(" ",start+geo.length+2);
        if (str.substring(start+geo.length+1,space).length == 1) { // HZ: check to make sure the length of the line/ray is > 1
          pointer = start + 1;
          continue;
        }
        if(space == -1){space = str.length;breaknext = true;}
        str = str.substring(0,start-1) + "<span class='geo_" + geo + "'>"
        + str.substring(start+geo.length+1,space) + "</span> " + str.substring(space);
        pointer = space;
        if(breaknext == true){break mainloop;}
      }
    }

    regex = new RegExp("geo:","ig");
    str = str.replace(regex, "");

    return str;
  }

  /*****
  Geometry Function
  ******/
    /**** MARKER: [Chemistry] ****/
  function chemistry(str){
    if(str.indexOf("chem") != -1){


      ////////console.log(str);

      regex = new RegExp("([a-zA-Z])([0-9]+)","ig");
      str = str.replace(regex,"$1<sub>$2</sub>");

      regex = new RegExp("\\)([0-9]+)","ig");
      str = str.replace(regex,")<sub>$1</sub>");

      regex = new RegExp(" ([0-9]+)\\+","ig");
      str = str.replace(regex,"<sup>$1+</sup>");

      regex = new RegExp(" ([0-9]+)\\-","ig");
      str = str.replace(regex,"<sup>$1-</sup>");

      regex = new RegExp(" \\+([0-9]+)","ig");
      str = str.replace(regex,"<sup>$1+</sup>");

      regex = new RegExp(" \\-([0-9]+)","ig");
      str = str.replace(regex,"<sup>$1-</sup>");

      regex = new RegExp("([a-zA-Z])\\+","ig");
      str = str.replace(regex,"$1<sup>+</sup>");

      regex = new RegExp("([a-zA-Z])\\-","ig");
      str = str.replace(regex,"$1<sup>-</sup>");

      regex = new RegExp("(</sub>)\\+","ig");
      str = str.replace(regex,"</sub><sup>+</sup>");

      regex = new RegExp("(</sub>)\\-","ig");
      str = str.replace(regex,"</sub><sup>-</sup>");

      replace = new RegExp("chem");
      str = str.replace(replace,"");

      replace = new RegExp("chemistry");
      str = str.replace(replace,"");

      phases = [[" liquid","<sub phase>(<span>l</span>)</sub>"],[" gas","<sub phase>(<span>g</span>)</sub>"],
    [" solid","<sub phase>(<span>s</span>)</sub>"],[" aq ","<sub phase>(<span>aq</span>)</sub> "],
    [" aqueous","<sub phase>(<span>aq</span>)</sub>"],

    [" particles",""],
    [" particle",""],



  ];
      for(i = 0; i < phases.length; i++){
        regex = new RegExp(phases[i][0],"ig");
        str = str.replace(regex,phases[i][1]);
      }

      str = "<span style='float:none;font-style:normal;'>" + str + "</span>";
    }
    return str;
  }


  function economics(str, prime){
    aull_the_terms = [  //#tribute
      //1v1 swaps, to enter graph NLP engine in post sequence
         ["S & D",             "supply and demand"    , true]
      ,  ["S and D",           "supply and demand"    , true]
      ,  ["intersecting ppf",  "-.6x + 6 color orange and -x + 8 color green ppf"]
      ,  ["enclosed ppf",  "-2x + 4 color orange and -x + 8 color green ppf"]
      ,  ["inelastic demand",  "-1.3x + 11 color lightblue"]
      ,  ["elastic demand",    "-.3x + 6  color lightblue"]
      ,  ["curved supply",     "2 + .0005(x + 3)^4 color pink"]
      ,  ["curved demand",     "2 + .0005(x - 12)^4 color lightblue"]
      ,  ["laffer curve",     "-(-.7y + 3.5)^2 - x + 8  color gold laffer"]
      ,  ["long run aggregate supply increased",     "0y - x + 5.5 color green macro"]
      ,  ["long run aggregate supply decreased",     "0y - x + 3.5 color green macro"]
      ,  ["long run aggregate supply",     "0y - x + 4.5 color green macro"]
      ,  ["aggregate supply",     "2 + .0005(x + 3)^4 color red macro"]
      ,  ["aggregate demand",     "2 + .0005(x - 12)^4 color blue macro"]
      ,  ["decrease demand",   "-.7x + 6 color lightblue and vector -1,-1.2%3,6 and vector -1,-1%7,3"]
      ,  ["decreased demand",  "-.7x + 6 color lightblue"]
      ,  ["decrease supply",   ".7x - 1 color pink and vector 1,-1.2%3,3 and vector 1,-1%7,6"]
      ,  ["increased demand",  "-.7x + 10 color lightblue"]
      ,  ["decreased supply",  ".7x - 1 color pink"]
      ,  ["increased supply",  ".7x + 3 color pink"]
      ,  ["demand",            "-.7x + 8 color blue"]
      ,  ["supply",            ".7x + 1 color red"]
      ,  ["and graph of",      "and",              true]
      ,  ["and graph cof",      "and",              true]
    ];
    change = false;
    renderFunction = [];
    for(i = 0; i < aull_the_terms.length; i++){
        if(aull_the_terms[i][2] == true){flag = "g";} else {flag = "ig";}
        if(prime == true && str.indexOf(aull_the_terms[i][0]) != -1)
          { str = "graph ecn of " + str; break;}
        regEx = new RegExp(aull_the_terms[i][0],flag);
        newstr = str.replace(regEx,aull_the_terms[i][1]);
        if(str != newstr){
          change = true;
          if(aull_the_terms[i][2] != true){renderFunction.push(aull_the_terms[i][0])}
        }
        //console.log(renderFunction);
        str = newstr;
    }
    if(prime == true && str.indexOf("econ") != -1){
      aull_the_terms = [
        ["Qd", "Q sub d"],
        ["Qs", "Q sub s"],
        [" change in", "delta"],
        ["exports", "Ex"],
        ["imports", "Im"],
        ["econ", ""]
      ];
      for(i = 0; i < aull_the_terms.length; i++){
        regEx = new RegExp(aull_the_terms[i][0],"ig");
        str = str.replace(regEx,aull_the_terms[i][1]);
      }
    }
    if(prime == true){ return str; }
    else {return [str,renderFunction]}
  }

  function isLongEnough(value) {
    return value.length >= 6;
  }


/*****
Dimension finder for the Matrix function.
******/

window.last_w = null;
window.last_h = null;
  /**** MARKER: [Dimensions] ****/
  function get_dimensions(str,override){
      if(!override){
        index = str.indexOf("matrix:");
        past_matrix = str.lastIndexOf("matrix",index-1);
      } else {
        index = str.indexOf(override + ":");
        past_matrix = str.lastIndexOf(override,index-1);
      }

      by = str.lastIndexOf(" by ",index);
      three = false;
      if(by == -1){
        by = str.lastIndexOf(" x ",loc);
        three = true;
      }
      lastspace = str.lastIndexOf(" ", by);
      w = str.substring(lastspace,by-1);
      h = str.substring(by+4,index-1);
      if(three == true){
        h = str.substring(by+3,index-1);
      }
      if(by < past_matrix){
        w = window.last_w;
        h = window.last_h;
      } else {
        window.last_w = w;
        window.last_h = h;
      }
      return[w,h];
  }

function getRandomVars(str)
{
	////////console.log(str+ ": before rand")
	if(str.indexOf("random")==-1)
	{
		return str;
	}
	//Consolidate window array
	var indices = getIndicesOf("random ", str, false);
	window.totalRands = window.totalRands + indices.length;

	var mylittleregex = new RegExp("random number", "ig");
	str = str.replace(mylittleregex, "random");

	mylittleregex = new RegExp("random from", "ig");
	str = str.replace(mylittleregex, "random between");

	//Replace "random" with generated number
	var prevlength = str.length;
	var itrdiff = 0;
	for(var k = 0; k<indices.length; k++)
	{
		var thisind = indices[k] + itrdiff;
		str = str.substring(0,thisind) + Math.floor(Math.random()*100) + str.substring(thisind+6);
		itrdiff = str.length - prevlength;
	}
	//////console.log(str+ ": after rand");
	return str;
}

    function alpha(str){
      console.log(/^[a-zA-Z]+$/.test(str));
      return /^[a-zA-Z]+$/.test(str);
    }

    function consonants(str){
      vowels = ["a","e","o","u","i"];
      for(i = 0; i < str.length; i++){
        if(vowels.indexOf(str.substring(i,i+1)) == -1){
          console.log("Consonants Found!");
          return true;
        }
      }
      return false;
    }

    function nox(str){
      for(i = 0; i < str.length; i++){
        if(str.substring(i,i+1) == "x"){
          return false;
        }
      }
      console.log("No x Found!");
      return true;
    }

    function prune(str){
      pointer = str.length;
      macros = ["TRIPLE INTEGRAL","DOUBLE INTEGRAL","CONTOUR INTEGRAL","SURFACE INTEGRAL",
      "VOLUME INTEGRAL","INTEGRAL",
      "PRODUCT","SUMMATION","BIGUNION", "BIGINTERSECT", "TRIPLEPAR DERIVATIVE", "DOUBLEPAR DERIVATIVE", "PARTIAL DERIVATIVE","TRIPLE DERIVATIVE","DOUBLE DERIVATIVE", "DERIVATIVE",
      "LIMIT","FRACTION ","GRAPH","EVALUATION"];
      for(i = 0; i < macros.length; i++){
        if(pointer > str.toUpperCase().indexOf(macros[i]) && str.toUpperCase().indexOf(macros[i]) != -1){
          pointer = str.toUpperCase().indexOf(macros[i]);
        }
      }
      if(pointer < str.length){
        substr = str.substring(0, pointer);
        if(substr.length < 5){return str;}
        explosion = substr.split(" ");
        for(j = 0; j < explosion.length; j++){
          if(explosion[j].length < 3){continue;}
          if(!alpha(explosion[j])){return str;}
          if(!consonants(explosion[j])){return str;}
          if(!nox(explosion[j])){return str;}
        }
        return str.substring(pointer);//return without precursory phrase
      }
      return str;
    }

/*****
Start of the lifecycle for PRIME.  Whole lifecycle
below for prime.

* Takes HR tags and makes replacements based on terms
      These are static terms like "infiniti"

* Takes terms and fits it into one universal term
      used in multiple places in the script.

* takes () and puts them into a global array. The
      var window.swaps is returned in an array and saved
      for later.

* Denotes certain words as repeats, such as "of"
      this is key for identifying macro functions
      such as double of's in limits.

* Calls encloses() the sub functions.  explanation
      above function.

* calls matrix_functions() to insert functions.
*****/
    /**** MARKER: [Prime] ****/
    function prime(str){
        //////////////console.log(str);


        if (str[str.length - 1] != " ") {
          str = " " + str + " ";
        }

        if(str.indexOf("matrix") != -1 || str.indexOf(" m:") != -1 || str.indexOf("table") != -1){
          str = str.replace(/(?![0-9]+)((?:\s?)*([x|\+|\\|%])(?:\s?)*)(?=[0-9]+)/g," $2 ","gm");
        }

        ////console.log(str);
        //////////////////////////////console.log("prime sequence:");
        //////////////////////////////console.log(str);
        regex = new RegExp("([a-z])  prime","ig");
        str = str.replace(regex,"$1 prmenumbers");
        //////////////////////////////console.log(regex);

        regex = new RegExp("<([a-zA-Z]+)>", "ig");
        str = str.replace(regex, "&lt;$1&gt;", "ig");

          // //////////////console.log(str);
        /** HZ: Calculates levenshtein distance for each word for autocorrect **/
        words = str.split(" ");
        words = words.filter(isLongEnough);
        comparisons = ["contour", "summation", "product", "intersect",
                      "fraction", "evaluation", "perpendicular", "parallel",
                      "naturals", "rationals", "conjugate", "proportional",
                      "convolution", "approximately", "omicron", "parallelogram",
                      "surface", "volume", "union", "derivative", "fraction",
                      "evaluation","aqueous", "cantor", "inverse"
                    ];

        for (i = 0; i < words.length; i++) {
          minIndex = [i, -1];
          if (comparisons.indexOf(words[i]) != -1) {
            continue;
          }
          for (j = 0; j < comparisons.length; j++) {
            if (comparisons[j].length >= 8) {
              min = 3;
            } else {
              min = 2;
            }
            if (comparisons[j].length - words[i].length <= 3 && comparisons[j].length - words[i].length >= -3) {
              distance = levenshtein(words[i], comparisons[j]);
              if (distance < min) {
                min = distance;
                minIndex[1] = j;
              }
            }
          }
          if (minIndex[1] != -1) {
            regex = new RegExp(words[i],"ig");
            replace = comparisons[minIndex[1]].toLowerCase();
            str = str.replace(regex,replace);
          }
        }


        if(str.toUpperCase().indexOf("SET") != -1
        || str.toUpperCase().indexOf("ALEPH") != -1
        || str.toUpperCase().indexOf("ALEF") != -1
        || str.toUpperCase().indexOf("BET") != -1
        || str.toUpperCase().indexOf("UNION") != -1
	      || str.toUpperCase().indexOf("INTERSECT") != -1
        || str.toUpperCase().indexOf("UNION") != -1
        || str.indexOf("+/-") != -1
        || str.indexOf("-/+") != -1
        || str.toLowerCase().indexOf(" dot") != -1
      ){



        //regex = new RegExp("aleph","ig");
        //str = str.replace(regex,"alef");

        regex = new RegExp("alef ([0-9])","ig");
        str = str.replace(regex,"alef sub $1");

        //ALEF TERM REPLACEMENTS
        sep = [
          ["member","within"],
          ["aleph","alef"],
          ["alef ","alef-"],
          ["alef-null","alef sub 0"],
          ["alef-naught","alef sub 0"],
          ["alef-zero","alef sub 0"],
          ["alef-one","alef sub 1"],
          ["alef-two","alef sub 2"],
          ["alef-three","alef sub 3"],
          ["alef-four","alef sub 4"],
          //["alef-alef","alef sub alef"],
          ["alef-","alef "],

          ["beth","bet"],
          ["bet ","bet-"],
          ["bet-null","bet sub 0"],
          ["bet-naught","bet sub 0"],
          ["bet-zero","bet sub 0"],
          ["bet-one","bet sub 1"],
          ["bet-two","bet sub 2"],
          ["bet-three","bet sub 3"],
          ["bet-four","bet sub 4"],
          //["alef-alef","alef sub alef"],
          ["bet-","bet "],

          [" double dot","-doubledot"],
          [" triple dot","-tripledot"],
          [" quadruple dot","-quadrupledot"],

          ["\\+/-"," plus or minus "],
          ["-/\\+"," minus or plus "],

          ["union from ","bigunion from ", true],
          ["union to ","bigunion to ", true],
          ["union of ","bigunion of ", true],
    		  ["intersect from ","bigintersect from ", true],
    		  ["intersection from ","bigintersect from ", true],
    		  ["intersect to ","bigintersect to ", true],
    		  ["intersection to ","bigintersect to ", true],
    		  ["intersect of ","bigintersect of ", true],
    		  ["intersection of ","bigintersect of ", true]
        ];




        for(i = 0; i < sep.length; i++){
          if(str.toUpperCase().indexOf(sep[i][0].toUpperCase()) != -1 || sep[i][2] == true){
                regEx = new RegExp(sep[i][0], "ig");
                str = str.replace(regEx,sep[i][1]);
          }
        }


        }

		regex = new RegExp("natural log", "ig");
		str = str.replace(regex, "ln");


    str = economics(str,true);


		var modarray = getIndicesOf("mod", str, false);
		var itrdiff = 0;
		var prevlength = str.length;
		for(var modvar in modarray)
		{
			var modind = modarray[modvar] + itrdiff;

			var aft = wordsafter(str, "mod", 1, modind-1).substring(1);
			var bef = wordsbefore(str, "mod",1, modind);

			if(bef != bef.toLowerCase())
			{
				if(aft == aft.toLowerCase())
				{
					str = str.substring(0,modind) + "/ "+ str.substring(modind + 3);
				}
				else
				{
					str = str.substring(0,modind) + "\\ "+ str.substring(modind + 4);
				}
			}
			itrdiff = str.length - prevlength;
		}

		var absarr = getIndicesOf(" abs(", str, false);
		var itrdiff = 0;
		var prevlength = str.length;
		for(var absi in absarr)
		{
			var absind = absarr[absi] + itrdiff;
			str = str.substring(0,absind) + " absolute value of " + str.substring(absind + 4);
			itrdiff = str.length - prevlength;
		}

        // absolute term replacements to simplify parsing
        sep = [
          ["integers greater than or equal to ", "integers sub greater than or equal to sub "],
          ["integers less than or equal to ", "integers sub less than or equal to sub "],
          ["integers greater than ", "integers sub > sub "],
		      ["  ", " escape "],
          ["integers less than ", "integers sub < sub "],
          ["naturals greater than or equal to ", "naturals sub greater than or equal to sub "],
          ["naturals less than or equal to ", "naturals sub less than or equal to sub "],
          ["naturals greater than ", "naturals sub > sub "],
          ["naturals less than ", "naturals sub < sub "],
          ["reals greater than or equal to ", "reals sub greater than or equal to sub "],
          ["reals less than or equal to ", "reals sub less than or equal to sub "],
          ["reals greater than ", "reals sub > sub "],
          ["reals less than ", "reals sub < sub "],
          ["rationals greater than or equal to ", "rationals sub greater than or equal to sub "],
          ["rationals less than or equal to ", "rationals sub less than or equal to sub "],
          ["rationals greater than ", "rationals sub > sub "],
          ["rationals less than ", "rationals sub < sub "],
          [" to the fourth", "to the power of 4"],
          [" to the fifth", "to the power of 5"],
          [" to the sixth", "to the power of 6"],
          [" to the seventh", "to the power of 7"],
          [" to the eighth", "to the power of 8"],
          [" to the ninth", "to the power of 9"],
          [" to the tenth", "to the power of 10"],
          [" unit vector", " hat"],
          [" pi squared", "pi  squared"],
          [" cardinality of ", " absolute value of "],
          ["center of ","Z of "],
          ["inverse Laplace transform ","Laplace-inverse "],
          ["inverse Laplace ","Laplace-inverse "],
          ["inverse sin ","sin-inverse "],
          ["inverse cos ","cos-inverse "],
          ["inverse tan ","tan-inverse "],
          ["inverse csc ","csc-inverse "],
          ["inverse sec ","sec-inverse "],
          ["inverse cot ","cot-inverse "]
        ];

        for(i = 0; i < sep.length; i++){
          if(str.toUpperCase().indexOf(sep[i][0].toUpperCase()) != -1){
                regEx = new RegExp(sep[i][0], "ig");
                str = str.replace(regEx,sep[i][1]);
          }
        }

        //RS - DERIVATIVE REPLACEMENTS
        //shorthand, eg ddx, dydx
        sep = [
          ["x"],
          ["y"],
          ["z"],
          ["t"],
          ["s"],
          ["i"],
          ["j"],
          ["k"],
          ["theta"],
          ["r"],
          ["f"],
          ["g"],
          ["h"]
        ]
        for(i = 0; i<sep.length; i++) {
          elliot = new RegExp("dd"+sep[i],"ig");
          isinfact = new RegExp("d/d"+sep[i],"ig");
          str = str.replace(elliot,"d over d"+sep[i]);
          str = str.replace(isinfact,"d over d"+sep[i]);
          for(j = 0; j<sep.length; j++){
            mr = new RegExp("d"+sep[i]+"d"+sep[j],"ig")
            robot = new RegExp("d"+sep[i]+"/d"+sep[j],"ig")
            str = str.replace(mr,"d"+sep[i]+" over d"+sep[j]);
            str = str.replace(robot,"d"+sep[i]+" over d"+sep[j]);
          }
        }

        //words words words [index = ericClapton] derivative of stuff1 [ledZeppelin] with respect to ericCartman words words

        angelaValdez = "";
        lizLemon = [" partial",""];
        crissCross = ["partial",""];
        vonCount = [
          ["double"],
          ["triple"],
          ["second"],
          ["third"],
          ["fourth"],
          ["fifth"],
          ["sixth"],
          ["seventh"],
          ["eighth"],
          ["ninth"],
          ["nth"],
          [""],//here and after are all the ways to say first derivative
          ["single"],
          ["first"]
        ]

      for(j = 0; j < vonCount.length; j++) {
      for(i = 0; i < 2; i++)
      {
        if(i===1&&j===11) wheresKevin = "derivative of ";
        else wheresKevin = vonCount[j]+lizLemon[i]+" derivative of ";
        //makes the power of the d correct
        if(str.indexOf(wheresKevin)!=-1 && str.indexOf("with respect to ")!=-1)
        {
          theMomDiesFromCancer = false;
          tedEndsUpWithRobin = false;
          if(j<2){theMomDiesFromCancer = true; j+=2;}
          if(j===10){tedEndsUpWithRobin = true; j="n";}//this should be the index of the element "nth" in vonCount, rn it's 10
          angelaValdez = "to the power of "+j;
          if(theMomDiesFromCancer){j-=2;}
          if(tedEndsUpWithRobin){j=10;}//this should be the index of the element "nth" in vonCount, rn it's 10
          if(j>10){angelaValdez = "";}//this should be the index of the element "nth" in vonCount, rn it's 10
        }

        //words words words [index = ericClapton] derivative of stuff1 [ledZeppelin] with respect to ericCartman words words
        while(str.indexOf(wheresKevin)!=-1 && str.indexOf("with respect to ")!=-1)
        {

          ericClapton = str.indexOf(wheresKevin);
          ledZeppelin = str.indexOf("with respect to ",ericClapton);
          if(ledZeppelin!=-1)
          {

            ericCartman = nextword(str,ledZeppelin+15);//15 is the length of "with respect to"
            if(angelaValdez === "") {
              tateLangdon = " "+crissCross[i]+"d"+ericCartman+" ";
            } else {
              tateLangdon = " ("+crissCross[i]+"d"+ericCartman+angelaValdez+") ";
            }
            str = str.substring(0,ericClapton) + lizLemon[i]+"d"+angelaValdez+" over"+tateLangdon+str.substring(ericClapton+wheresKevin.length,ledZeppelin) +" "+ str.substring(ledZeppelin+16+ericCartman.length);

          } else {break;}
        }

      }}


        //END OF RS-DERIVATIVES

        // HZ: inverse of ___ loop to convert to x sup -1
        // i = 0;
        // while (str.indexOf("inverse of ", i) != -1) {
        //   i = str.indexOf("inverse of ");
        //   begin = i;
        //   i = i + 11; // going to the variable
        //   str = str + " ";
        //   variable = str.substring(i, str.indexOf(" ", i));
        //   str = str.substring(0, begin) + variable + " to the power of -1" + str.substring(i + variable.length);
        // }
        //
        // while (str.indexOf("nth power of ", i) != -1) {
        //   i = str.indexOf("nth power of ");
        //   begin = i;
        //   i = i + 13; // going to the variable
        //   str = str + " ";
        //   variable = str.substring(i, str.indexOf(" ", i));
        //   str = str.substring(0, begin) + variable + " to the power of n" + str.substring(i + variable.length);
        // }

        // HZ: Uses wordsafter to replace first statement with second statement after the word. usually
        // used for something like conjugate of x --> x conjugate. 4th element is whether or not
        // there are two terms ex: inverse of a vs intersection of a and b
        sep = [
            ["conjugate of ", "conjugate", 2, ""],
            ["closure of ", "conjugate", 2, ""],
            ["-inverse ", "-invrs", 0, ""],
            ["inverse of ", "inverse", 2, ""],
            ["transpose of ", "transpose", 2, ""],
            ["nth power of ", "to the power of n", 3, ""],
            // ["intersection of ", "intersection", 2, "and"],
            // ["union of ", "union", 2, "and"]
          ];

        for (i = 0; i < sep.length; i++) {
          begin = 0;
          end = 0;
          j = 0;
          while (str.toUpperCase().indexOf(sep[i][0].toUpperCase(), j) != -1){
            j = str.toUpperCase().indexOf(sep[i][0].toUpperCase(), j);
            after = wordsafter(str, sep[i][0], sep[i][2]);
            str = str.substring(0, j) + after.substring(1) + " " + sep[i][1] + " " + str.substring(j + sep[i][0].length + after.length + sep[i][3].length);
            j += 1;
          }
        }


        //TAGS
        str = " " + str;
		reGex = new RegExp(" ZZ ","g");
        str = str.replace(reGex," integers ");

		if(str.indexOf("geo")!=-1)
		{
			reGex = new RegExp(" congruent ", "ig");
			str =str.replace(reGex, " geocongruent ");
		}
        //HR REPLACEMENTS
  sep = [[" infiniti ","infty", 0],
        [" infinity ","infty", 0],
        [" down right ","downright",0],
        [" down ","down",0],
        [" left ","left",0],
        [" right ","chain",0],
        [" up ","up",0],
        [" chain ","chain",0],
        [" proportional ", "proportional", 0],
        [" for all of ","forall", 0],
        [" gradient ","nabla", 0],
        ["nabla","nabla", 3],
        [" del ","nabla", 0],
        ["Lambda","bglmbda", 3, true],
        ["lambda","lambda", 3],
        ["Omega","comga", 3, true],
        ["omega","lomega", 3],
        [" tiny delta","ldlta", 3],
        [" baby delta","ldlta", 3],
        [" small delta","ldlta", 3],
        [" little delta","ldlta", 3],
        [" lower case delta","ldlta", 3],
        [" lowercase delta","ldlta", 3],
        ["ldelta","ldlta", 3],
        ["delta","delta", 3],
        ["partiald","partiald", 3],
        /********* SET THEORY *************/
        //number theory
        ["divides","divides",0],
        ["guzinta","divides",0],
        ["goes into","divides",0],
        ["goes in to","divides",0],
        ["is a factor of","divides",0],
        ["cantor set","scriptC",0],
        ["wave function","psi",0],
        ["laplacian","nabla",3,new String("squared")],
        ["pi/","pi", 3, new String("/")],
        ["pi-","pi", 3, new String("-")],
        ["pi\\+","pi", 3, new String("+")],
        [" not superset or equal to ","notsupersettorequalto", 0],
        [" not equal to or superset ","notsupersettorequalto", 0],
        [" not subset or equal to ","notsubsetorequalto", 0],
        [" not equal to or subset ","notsubsetorequalto", 0],
        [" subset or equal to ","subsetorequalto", 0],
        [" equal to or subset ","subsetorequalto", 0],
        [" superset or equal to ","supersettorequalto", 0],
        [" equal to or superset ","supersettorequalto", 0],
        [" not a subset ","notsubset", 0],
        [" not a superset ","notsuperset", 0],
        [" subset ","subset", 0],
        [" superset ","superset", 0],
        /******* END SET THEORY ***********/
        //["inverse Laplace transform ","laplce inverse",0],
        //["inverse Laplace","laplce inverse",0],
        ["Laplace transform ","laplce",3],
        ["Laplace","laplce",3],
        [" wedge product ","land",0],
        [" wedge ","land",0],
        [" smash product ","land",0],


        [" can prove ","turnstile",0],
        [" proves ","turnstile",0],
        [" yields ","turnstile",0],
        [" know that ","turnstile",0],
        [" vdash ","turnstile",0],
        [" turnstile ","turnstile",0],
        [" assertion sign ","turnstile",0],

        [" satisfies ","turnstile",0],
        [" entails ","turnstile",0],
        [" can derive ","turnstile",0],
        [" is provable from ","rturnstile",0],
        [" is proved from ","rturnstile",0],
        [" is derived from ","rturnstile",0],
        [" is yield from ","rturnstile",0],
        [" is satisfied by ","rturnstile",0],


        [" forms ","goesto",0],
        [" leads to ","goestogi",0],
        [" times ","times",0],
        [" cross product ","times",0],
        [" tensor product ","tensor",0],
        [" splat ","splat",0],
        [" convolute ","splat",0],
        [" asterism","asterism", 3],
        [" convolution ","splat",0],
        [" measure of angle ", "mangle", 3],
    		[" not an element of ", "notin",0],
    		[" not an element ", "notin",0],
        [" element of ","in",0],
		    [" not in ","notin",0],
        [" null ","null", 0],
        [" for all ","forall", 0],
        [" is approximately equal to ","approx", 0],
        [" approximately equals ","approx", 0],
        [" approximately ","approx", 0],
        [" >> ","mgeq", 0],
        [" << ","mleq", 0],
        [" is much greater than or equal to ","mgeq", 0],
        [" much greater than or equal to ","mgeq", 0],
        [" is much larger than or equal to ","mgeq", 0],
        [" much larger than or equal to ","mgeq", 0],
        [" is much lesser than or equal to ","mleq", 0],
        [" much lesser than or equal to ","mleq", 0],
        [" is much less than or equal to ","mleq", 0],
        [" much less than or equal to ","mleq", 0],
        [" is much smaller than or equal to ","mleq", 0],
        [" much smaller than or equal to ","mleq", 0],
        [" cat ","catface",0],
        [" lau ","catface",0],
        [" is greater than or equal to ","geq", 0],
        [" greater than or equal to ","geq", 0],
        [" gtet ","geq", 0],
        [" geq ","geq", 0],
        [" ltet ","leq", 0],
        [" leq ","leq", 0],
        [" is larger than or equal to ","geq", 0],
        [" larger than or equal to ","geq", 0],
        [" <= ", "leq", 0],
        [" >= ", "geq", 0],
        [" is lesser than or equal to ","leq", 0],
        [" lesser than or equal to ","leq", 0],
        [" is less than or equal to ","leq", 0],
        [" less than or equal to ","leq", 0],
        [" is less than ","lt", 0],
        [" is greater than ","gt", 0],
        [" less than ","lt", 0],
        [" greater than ","gt", 0],
        [" is smaller than or equal to ","leq", 0],
        [" smaller than or equal to ","leq", 0],
        [" much greater than ","mgeq", 0],
        [" much less than ","mleq", 0],
        [" not equal ","neq", 0],
        [" neq ","neq", 0],
        [" might equal ", "meq", 0],
        [" deq ","neq", 0],
        [" which is approximately ","approx", 0],
        [" which is close to ","approx", 0],
        [" which is near ","approx", 0],
        [" is approximately ","approx", 0],
        [" is close to ","approx", 0],
        [" is near ","approx", 0],
        [" disjoint union ", "disuni", 0],
        [" disjoint intersection ", "disinter", 0],
        [" union ","cup", 0],
        [" intersection ","cap", 0],
		    [" intersect ","cap", 0],
        [" is a predecessor of ", "pred", 0],
        [" is a successor of ", "succ", 0],
        [" there exists some ","exists", 0],
        [" there is some ","exists", 0],
        [" there exists ","exists", 0],
        [" there does not exist ","nexists", 0],
        [" there doesn't exist ","nexists", 0],
        [" there doesnt exist ","nexists", 0],
        [" exists ","exists", 0],
        [" leads to ","goesto", 0],
        [" <--> ", "lrarrow", 0],
        [" --> ", "goesto", 0],
        [" <-- ", "goesleftto", 0],
        [" implies ", "emply", 0], // can't have a word start with im and space
        [" implied by ", "leftimply", 0], // can't have a word start with im and space
        [" ==> ", "emply", 0],
        [" <== ", "leftimply", 0],
        [" per mille", "pmille", 2],
        [" permille", "pmille", 2],
        [" permill", "pmille", 2],
        [" permil", "pmille", 2],
        [" per mill", "pmille", 2],
        [" per mil", "pmille", 2],
        [" parts per thousand", "pmille", 2],
        [" basis point", "baspnt", 2],
        ["ohms","comga", 3],
        ["Theta","bgthta", 3, true],
        ["theta ", "th3ta", 3, true],
        ["theta", "theta", 3, true],
        [" standard basis ","frakturB", 2],
        [" basis A ","frakturA", 2],
        [" basis C ","frakturC", 2],
        [" basis D ","frakturD", 2],
        [" basis M ","frakturM", 2],
        [" basis ","frakturB", 2],
        [" cardinal number ","alef", 2],
        [" alef ","alef", 2],
        [" bet ","bet", 2],
        ["little sigma","bsgma", 3],
        ["capital sigma","bsgma", 3],
        ["big sigma","bsgma", 3],
        ["littles","bsgma", 3],
        ["little sum","bsgma", 3],
        ["big sigma","bsgma", 3],
        ["bsigma","bsgma", 3],
        ["Sigma","bsgma", 3, true],
        ["sigma","sigma", 3],
        [" Psi", "bgps", 1, true],
        [" psi","psi", 1],
        ["Gamma", "bggmma", 3, true],
        ["gamma","gamma", 3],
        ["duck", "duck",3], //test [REMOVE]
        ["Epsilon","bgepsln", 3, true],
        ["epsilon","epsilon", 3],
        ["Zeta","bgzta", 3, true],
        ["zeta","zeta", 3],
        [" Eta","bget", 2, true],
        [" eta","eta", 2],
        ["Iota","bgita", 3, true],
        ["iota","iota", 3],
        ["Kappa","bgkppa", 3, true],
        ["kappa","kappa", 3],
        ["Lambda", "bglmbda", 3, true],
        ["Nu","bgn", 3, true],
        [" nu ","nu", 3],
        ["Xi","bgx", 3, true],
        [" xi ","xi", 3],
        ["Omicron", "bgomcrn", 3, true],
        ["omicron","omicron", 3],
        ["Rho","bgrh", 3, true],
        ["rho","rho", 3],
        ["Tau","bgtu", 3, true],
        ["tau","tau", 3],
        ["Upsilon","bgupsln", 3, true],
        ["upsilon","upsilon", 3],
        ["Phi","bgph", 3, true],
        ["phi","phi", 3],
        ["Mu ","bgm", 2, true],
        ["mu ","mu", 2],
        ["nano","mu", 3],
        [" times ","times", 0],
        [" times ","times", 0],
        [" cross product ","times", 0],
        [" cross ","times", 0],
        [" cartesian product ","times", 0],
        [" composition ","composition", 0],
        [" composed of ","composition", 0],
        [" compose ","composition", 0],
        [" round ","composition", 0],
        [" following ","composition", 0],

        [" angle ","angle", 3],
        [" therefore ","therefore", 0],
        [" because ","because", 0],
        [" is congruent with ","congruent", 0],
        [" is congruent to ","congruent", 0],
        [" congruent to ","congruent", 0],
        [" congruent ","congruent", 0],
		    [" is geocongruent with ","geocongruent", 0],
        [" is geocongruent to ","geocongruent", 0],
        [" geocongruent to ","geocongruent", 0],
        [" geocongruent ","geocongruent", 0],
        [" is similar to ","similar", 0],
        [" similar ","similar", 0],
        [" triangle ","triangle", 1],
        [" parallelogram ","parallelogram", 1],
        [" circle ","circle", 1],
        [" rectangle ","rectangle", 1],
        [" naturals","n4tural", 1],
        [" natural","n4tural", 0],
        [" within ","in", 0],
        [" not within ","nin", 0], //add the CSS for this
        [" element of ","in", 0],
        [" is a member of ", "in", 0],
        [" is an ", "in", 0],
        [" is a ", "in", 0],
        [" is in ", "in", 0],
        [" belongs to ", "in", 0],
        [" integers","integers", 1],
        [" reals","re4l", 1],
        [" real numbers ","re4l", 0],
        [" rationals","rational", 1],
        [" rational numbers ","rational", 0],
        [" not ","not", 1],
        ["-pi","pi", 1, true, "-"],
        ["pi/","pi",  3, true, "/"],
        ["pi-","pi",  3, true, "-"],
        [" dots ","dots", 0],
        [" dot dot dot ","dots", 0],
        [" ellipses ","dots", 0],
        ["Alpha", "bgalph",  3, true],
        ["alpha","alpha", 3], // 4th element is for case sensitivitiy
        ["Beta","bgbta", 3, true],
        ["beta","beta", 3],
        ["perpendicular to","perpendicular",0],
        ["parallel to","parallel",0],
        //["\+\-","plusminus",3],
        //["\-\+","plusminus",3],
        ["\\+/-","plms",0],
        ["-/\\+","mspl",0],
        ["plus and minus","plms", 3],
        ["plus or minus","plms", 3],
        ["minus and plus","mspl", 3],
        ["minus or plus","mspl", 3],
        ["Chi ","bgch", 2, true],
        ["chi ","chi", 2],
        [" flux ","flux", 3],
        ["flux ","flux", 3],
        [" dot product ","dot", 0],
        //[" dot ","dot", 0],
        [" not superset or equal to ","notsupersettorequalto",0],
        [" not equal to or superset ","notsupersettorequalto",0],
        [" not subset or equal to ","notsubsetorequalto",0],
        [" not equal to or subset ","notsubsetorequalto",0],
        [" subset or equal to ","subsetorequalto",0],
        [" equal to or subset ","subsetorequalto",0],
    		[" contains ","supersettorequalto",0],
        [" superset or equal to ","supersettorequalto",0],
        [" equal to or superset ","supersettorequalto",0],
		      //gsd
    		[" is not a subset of ", "notsubsetorequalto",0],
    		[" is not a strict subset of ", "notsubset",0],
    		[" is not a proper subset of ", "notsubset",0],
    		[" not a strict subset of ", "notsubset",0],
    		[" not strict subset of ", "notsubset",0],
    		[" not proper subset of ", "notsubset",0],
    		[" not a proper subset of ", "notsubset",0],
    		[" not a proper subset ", "notsubset",0],
    		[" not a strict subset ", "notsubset",0],
    		[" not a strict subset of ", "notsubset",0],
    		[" not proper subset ", "notsubset",0],
    		[" not strict subset ", "notsubset",0],
    		[" not a subset of ","notsubsetorequalto",0],
        [" not a subset ","notsubsetorequalto",0],
		    //gsd
        [" not a superset ","notsuperset",0],
    		[" is a subset of ", "subsetorequalto",0],
    		[" is a strict subset of ", "subset",0],
    		[" is a proper subset of ", "subset",0],
    		[" strict subset of ", "subset",0],
    		[" proper subset of ", "subset",0],
    		[" proper subset ", "subset",0],
    		[" strict subset ", "subset",0],
    		[" subset of ","subsetorequalto",0],
        [" subset ","subsetorequalto",0],
        [" superset ","superset",0],
        /******* END SET THEORY ***********/
        [" null ","null",0],
        [" for all ","forall",0],
        [" equivalent to ", "dubimply", 0],
        [" corresponds to ", "corresponds", 0],
        [" symmetric difference ", "delta", 0],
        [" is approximately equal to ","approx",0],
        [" approximately equals ","approx",0],
        [" approximately ","approx",0],
        [" is much greater than or equal to ","mgeq",0],
        [" much greater than or equal to ","mgeq",0],
        [" is much larger than or equal to ","mgeq",0],
        [" much larger than or equal to ","mgeq",0],
        [" is much lesser than or equal to ","mleq",0],
        [" much lesser than or equal to ","mleq",0],
        [" is much less than or equal to ","mleq",0],
        [" much less than or equal to ","mleq",0],
        [" is much smaller than or equal to ","mleq",0],
        [" much smaller than or equal to ","mleq",0],
        [" is greater than or equal to ","geq",0],
        [" greater than or equal to ","geq",0],
        [" is larger than or equal to ","geq",0],
        [" larger than or equal to ","geq",0],
        [" is lesser than or equal to ","leq",0],
        [" lesser than or equal to ","leq",0],
        [" is less than or equal to ","leq",0],
        [" less than or equal to ","leq",0],
        [" is smaller than or equal to ","leq",0],
        [" smaller than or equal to ","leq",0],
        [" much greater than","mgeq",0],
        [" much lesser than","mleq",0],
        [" not equal ","neq",0],
        [" neq ","neq",0],
        [" deq ","neq",0],
        [" which is approximately ","approx",0],
        [" which is close to ","approx",0],
        [" which is near ","approx",0],
        [" is approximately ","approx",0],
        [" is close to ","approx",0],
        [" is near ","approx",0],
        [" union ","cup",0],
        [" intersection ","cap",0],
        [" there exists ","exists",0],
        [" there does not exist ","nexists",0],
        [" there doesn't exist ","nexists",0],
        [" there doesnt exist ","nexists",0],
        [" exists ","exists",0],
        // [" goes to ","goesto",0],
        [" leads to ","goestogi",0],
        ["ohms","comega",3],
        [" standard basis ","frakturB",2],
        [" basis A ","frakturA",2],
        [" basis C ","frakturC",2],
        [" basis D ","frakturD",2],
        [" basis M ","frakturM",2],
        [" basis ","frakturB",2],
        [" cardinal number ","alef",2],
        [" alef ","alef",2],
        ["nano","mu",3],
        [" times ","times",0],
        [" cross product ","times",0],
        [" cross ","times",0],
        [" angle ","angle",3],
        [" therefore ","therefore",0],
        [" because ","because",0],
        [" is congruent with ","congruent",0],
		    [" congruent to ","congruent",0],
        [" congruent ","congruent",0],
        [" is similar to ","similar",0],
        [" similar ","similar",0],
        [" triangle ","triangle",1],
        [" parallelogram ","parallelogram",1],
        [" circle ","circle",1],
        [" natural ","natural",0],
        [" naturals ","natural",0],
    		[" field of ", "field",0],
    		[" field ", "field",0],
    		[" fancy a ", "fancya",0],
    		[" fancy b ", "fancyb",0],
    		[" fancy c ", "complex",0],
    		[" fancy d ", "fancyd",0],
    		[" fancy e ", "fancye",0],
    		[" fancy f ", "field",0],
    		[" fancy g ", "fancyg",0],
    		[" fancy h ", "quaternion",0],
    		[" fancy i ", "fancyi",0],
    		[" fancy j ", "fancyj",0],
    		[" fancy k ", "fancyk",0],
    		[" fancy l ", "fancyl",0],
    		[" fancy m ", "fancym",0],
    		[" fancy n ", "natural",0],
    		[" fancy o ", "fancyo",0],
    		[" fancy p ", "prim",0],
    		[" fancy q ", "rational",0],
    		[" fancy r ", "real",0],
    		[" fancy s ", "fancys",0],
    		[" fancy t ", "fancyt",0],
    		[" fancy u ", "fancyu",0],
    		[" fancy v ", "fancyv",0],
    		[" fancy w ", "fancyw",0],
    		[" fancy x ", "fancyx",0],
    		[" fancy y ", "fancyy",0],
    		[" fancy z ", "integers",0],
    		[" blackboard a ", "fancya",0],
    		[" blackboard b ", "fancyb",0],
    		[" blackboard c ", "complex",0],
    		[" blackboard d ", "fancyd",0],
    		[" blackboard e ", "fancye",0],
    		[" blackboard f ", "field",0],
    		[" blackboard g ", "fancyg",0],
    		[" blackboard h ", "quaternion",0],
    		[" blackboard i ", "fancyi",0],
    		[" blackboard j ", "fancyj",0],
    		[" blackboard k ", "fancyk",0],
    		[" blackboard l ", "fancyl",0],
    		[" blackboard m ", "fancym",0],
    		[" blackboard n ", "natural",0],
    		[" blackboard o ", "fancyo",0],
    		[" blackboard p ", "prim",0],
    		[" blackboard q ", "rational",0],
    		[" blackboard r ", "real",0],
    		[" blackboard s ", "fancys",0],
    		[" blackboard t ", "fancyt",0],
    		[" blackboard u ", "fancyu",0],
    		[" blackboard v ", "fancyv",0],
    		[" blackboard w ", "fancyw",0],
    		[" blackboard x ", "fancyx",0],
    		[" blackboard y ", "fancyy",0],
    		[" blackboard z ", "integers",0],
			[" script A ", "upscripta",0, true],
    		[" script B ", "upscriptb",0, true],
    		[" script C ", "upscriptc",0, true],
    		[" script D ", "upscriptd",0, true],
    		[" script E ", "upscripte",0, true],
    		[" script F ", "upscriptf",0, true],
    		[" script G ", "upscriptg",0, true],
    		[" script H ", "upscripth",0, true],
    		[" script I ", "upscripti",0, true],
    		[" script J ", "upscriptj",0, true],
    		[" script K ", "upscriptk",0, true],
    		[" script L ", "upscriptl",0, true],
    		[" script M ", "upscriptm",0, true],
    		[" script N ", "upscriptn",0, true],
    		[" script O ", "upscripto",0, true],
    		[" script P ", "upscriptp",0, true],
    		[" script Q ", "upscriptq",0, true],
    		[" script R ", "upscriptr",0, true],
    		[" script S ", "upscripts",0, true],
    		[" script T ", "upscriptt",0, true],
    		[" script U ", "upscriptu",0, true],
    		[" script V ", "upscriptv",0, true],
    		[" script W ", "upscriptw",0, true],
    		[" script X ", "upscriptx",0, true],
    		[" script Y ", "upscripty",0, true],
    		[" script Z ", "upscriptz",0, true],
    		[" cursive A ", "upscripta",0, true],
    		[" cursive B ", "upscriptb",0, true],
    		[" cursive C ", "upscriptc",0, true],
    		[" cursive D ", "upscriptd",0, true],
    		[" cursive E ", "upscripte",0, true],
    		[" cursive F ", "upscriptf",0, true],
    		[" cursive G ", "upscriptg",0, true],
    		[" cursive H ", "upscripth",0, true],
    		[" cursive I ", "upscripti",0, true],
    		[" cursive J ", "upscriptj",0, true],
    		[" cursive K ", "upscriptk",0, true],
    		[" cursive L ", "upscriptl",0, true],
    		[" cursive M ", "upscriptm",0, true],
    		[" cursive N ", "upscriptn",0, true],
    		[" cursive O ", "upscripto",0, true],
    		[" cursive P ", "upscriptp",0, true],
    		[" cursive Q ", "upscriptq",0, true],
    		[" cursive R ", "upscriptr",0, true],
    		[" cursive S ", "upscripts",0, true],
    		[" cursive T ", "upscriptt",0, true],
    		[" cursive U ", "upscriptu",0, true],
    		[" cursive V ", "upscriptv",0, true],
    		[" cursive W ", "upscriptw",0, true],
    		[" cursive X ", "upscriptx",0, true],
    		[" cursive Y ", "upscripty",0, true],
    		[" cursive Z ", "upscriptz",0, true],
    		[" script a ", "scripta",0, true],
    		[" script b ", "scriptb",0, true],
    		[" script c ", "scriptc",0, true],
    		[" script d ", "scriptd",0, true],
    		[" script e ", "scripte",0, true],
    		[" script f ", "scriptf",0, true],
    		[" script g ", "scriptg",0, true],
    		[" script h ", "scripth",0, true],
    		[" script i ", "scripti",0, true],
    		[" script j ", "scriptj",0, true],
    		[" script k ", "scriptk",0, true],
    		[" script l ", "scriptl",0, true],
    		[" script m ", "scriptm",0, true],
    		[" script n ", "scriptn",0, true],
    		[" script o ", "scripto",0, true],
    		[" script p ", "scriptp",0, true],
    		[" script q ", "scriptq",0, true],
    		[" script r ", "scriptr",0, true],
    		[" script s ", "scripts",0, true],
    		[" script t ", "scriptt",0, true],
    		[" script u ", "scriptu",0, true],
    		[" script v ", "scriptv",0, true],
    		[" script w ", "scriptw",0, true],
    		[" script x ", "scriptx",0, true],
    		[" script y ", "scripty",0, true],
    		[" script z ", "scriptz",0, true],
    		[" cursive a ", "scripta",0, true],
    		[" cursive b ", "scriptb",0, true],
    		[" cursive c ", "scriptc",0, true],
    		[" cursive d ", "scriptd",0, true],
    		[" cursive e ", "scripte",0, true],
    		[" cursive f ", "scriptf",0, true],
    		[" cursive g ", "scriptg",0, true],
    		[" cursive h ", "scripth",0, true],
    		[" cursive i ", "scripti",0, true],
    		[" cursive j ", "scriptj",0, true],
    		[" cursive k ", "scriptk",0, true],
    		[" cursive l ", "scriptl",0, true],
    		[" cursive m ", "scriptm",0, true],
    		[" cursive n ", "scriptn",0, true],
    		[" cursive o ", "scripto",0, true],
    		[" cursive p ", "scriptp",0, true],
    		[" cursive q ", "scriptq",0, true],
    		[" cursive r ", "scriptr",0, true],
    		[" cursive s ", "scripts",0, true],
    		[" cursive t ", "scriptt",0, true],
    		[" cursive u ", "scriptu",0, true],
    		[" cursive v ", "scriptv",0, true],
    		[" cursive w ", "scriptw",0, true],
    		[" cursive x ", "scriptx",0, true],
    		[" cursive y ", "scripty",0, true],
    		[" cursive z ", "scriptz",0, true],
        [" within ","in",0],
		    [" not an element of ", "notin",0],
		    [" not an element ", "notin",0],
        [" element of ","in",0],
		    [" not in ","notin",0],
        [" integers ","integers",0],
        [" rationals ","rational",0],
        [" rational numbers ","rational",0],
        [" not ","not",1],
        ["-pi","pi",1],
        ["pi/","pi", 3, "/"],
        ["pi-","pi", 3, "/"],
        [" dots ","dots", 0],
        [" dot dot dot ","dots",0],
        [" ellipses ","dots",0],
        [" dot product ","dot",0],
        ["\\*","dot",0],
        [" dot ","dot",0],
        ["plus and minus","plms",3],
        ["minus and plus","plms",3],
        ["chi ","chi",2],
        [" flux ","flux", 0],
        [" dot product ","dot",0],
        [" dot ","dot",0],
        [" ace of spades ", "sace", 0],
        [" ace of hearts ", "hace", 0],
        [" ace of clubs ", "cace", 0],
        [" ace of diamonds ", "dace", 0],
        [" two of spades ", "stwo", 0],
        [" two of hearts ", "htwo", 0],
        [" two of clubs ", "ctwo", 0],
        [" two of diamonds ", "dtwo", 0],
        [" three of spades ", "sthree", 0],
        [" three of hearts ", "hthree", 0],
        [" three of clubs ", "cthree", 0],
        [" three of diamonds ", "dthree", 0],
        [" four of spades ", "sfour", 0],
        [" four of hearts ", "hfour", 0],
        [" four of clubs ", "cfour", 0],
        [" four of diamonds ", "dfour", 0],
        [" five of spades ", "sfive", 0],
        [" five of hearts ", "hfive", 0],
        [" five of clubs ", "cfive", 0],
        [" five of diamonds ", "dfive", 0],
        [" six of spades ", "ssix", 0],
        [" six of hearts ", "hsix", 0],
        [" six of clubs ", "csix", 0],
        [" six of diamonds ", "dsix", 0],
        [" seven of spades ", "sseven", 0],
        [" seven of hearts ", "hseven", 0],
        [" seven of clubs ", "cseven", 0],
        [" seven of diamonds ", "dseven", 0],
        [" eight of spades ", "seight", 0],
        [" eight of hearts ", "height", 0],
        [" eight of clubs ", "ceight", 0],
        [" eight of diamonds ", "deight", 0],
        [" nine of spades ", "snine", 0],
        [" nine of hearts ", "hnine", 0],
        [" nine of clubs ", "cnine", 0],
        [" nine of diamonds ", "dnine", 0],
        [" ten of spades ", "sten", 0],
        [" ten of hearts ", "hten", 0],
        [" ten of clubs ", "cten", 0],
        [" ten of diamonds ", "dten", 0],
        [" jack of spades ", "sjack", 0],
        [" jack of hearts ", "hjack", 0],
        [" jack of clubs ", "cjack", 0],
        [" jack of diamonds ", "djack", 0],
        [" queen of spades ", "squeen", 0],
        [" queen of hearts ", "hqueen", 0],
        [" queen of clubs ", "cqueen", 0],
        [" queen of diamonds ", "dqueen", 0],
        [" king of spades ", "sking", 0],
        [" king of hearts ", "hking", 0],
        [" king of clubs ", "cking", 0],
        [" king of diamonds ", "dking", 0],
        [" A of spades ", "sace", 0],
        [" A of hearts ", "hace", 0],
        [" A of clubs ", "cace", 0],
        [" A of diamonds ", "dace", 0],
        [" 2 of spades ", "stwo", 0],
        [" 2 of hearts ", "htwo", 0],
        [" 2 of clubs ", "ctwo", 0],
        [" 2 of diamonds ", "dtwo", 0],
        [" 3 of spades ", "sthree", 0],
        [" 3 of hearts ", "hthree", 0],
        [" 3 of clubs ", "cthree", 0],
        [" 3 of diamonds ", "dthree", 0],
        [" 4 of spades ", "sfour", 0],
        [" 4 of hearts ", "hfour", 0],
        [" 4 of clubs ", "cfour", 0],
        [" 4 of diamonds ", "dfour", 0],
        [" 5 of spades ", "sfive", 0],
        [" 5 of hearts ", "hfive", 0],
        [" 5 of clubs ", "cfive", 0],
        [" 5 of diamonds ", "dfive", 0],
        [" 6 of spades ", "ssix", 0],
        [" 6 of hearts ", "hsix", 0],
        [" 6 of clubs ", "csix", 0],
        [" 6 of diamonds ", "dsix", 0],
        [" 7 of spades ", "sseven", 0],
        [" 7 of hearts ", "hseven", 0],
        [" 7 of clubs ", "cseven", 0],
        [" 7 of diamonds ", "dseven", 0],
        [" 8 of spades ", "seight", 0],
        [" 8 of hearts ", "height", 0],
        [" 8 of clubs ", "ceight", 0],
        [" 8 of diamonds ", "deight", 0],
        [" 9 of spades ", "snine", 0],
        [" 9 of hearts ", "hnine", 0],
        [" 9 of clubs ", "cnine", 0],
        [" 9 of diamonds ", "dnine", 0],
        [" 10 of spades ", "sten", 0],
        [" 10 of hearts ", "hten", 0],
        [" 10 of clubs ", "cten", 0],
        [" 10 of diamonds ", "dten", 0],
        [" J of spades ", "sjack", 0],
        [" J of hearts ", "hjack", 0],
        [" J of clubs ", "cjack", 0],
        [" J of diamonds ", "djack", 0],
        [" Q of spades ", "squeen", 0],
        [" Q of hearts ", "hqueen", 0],
        [" Q of clubs ", "cqueen", 0],
        [" Q of diamonds ", "dqueen", 0],
        [" K of spades ", "sking", 0],
        [" K of hearts ", "hking", 0],
        [" K of clubs ", "cking", 0],
        [" K of diamonds ", "dking", 0],
        [" spade ", "spade", 0],
        [" heart ", "heart", 0],
        [" diamond ", "diamond", 0],
        [" club ", "club", 0]
        /********* GRAPH MODULES *********/

        /********** END GRAPH MODULES ********/
      ];

	  str = str + " ";
		//Checks for field subscripts
	    var fieldarray = getIndicesOf("field", str, false);
		for(var fieldvar in fieldarray)
		{
		var fieldind = fieldarray[fieldvar] + 4;
		if(fieldind != 3)
		{
			var sizind = str.indexOf(" size ",fieldind);
			if(sizind != -1)
			{
				var sizby = wordsafter(str, "size", 1, fieldind);
				var nosiz = str.substring(0,sizind) + str.substring(sizind + (5 + sizby.length));

				////////////////////////////console.log(nosiz);
				str = nosiz.substring(0,(fieldind+1)) + " size" + sizby + nosiz.substring((fieldind+1));
				////////////////////////////console.log(str);
			}
		}
		}
		if(fieldarray.length>0)
		{
			str = str.replace(/ of/gi, "");
			str = str.replace(/size/gi, "sub");

		}

	    //Checks for modular arithmetic and makes corrections
	  // 	var congarray = getIndicesOf("congruent", str, false);
		// for(var congvar in congarray)
		// {
		// var congind = congarray[congvar] + 8;
		// if(congind != 7)
		// {
		// 	var modind = str.indexOf(" mod ",congind);
		// 	if(str.lastIndexOf(""))
		// 	if(modind != -1)
		// 	{
		// 		var modby = wordsafter(str, "mod", 1, congind);
		// 		var nomod = str.substring(0,modind) + str.substring(modind + (4 + modby.length));
    //
		// 		//////////////////////////////console.log(nomod);
		// 		str = nomod.substring(0,(congind+1)) + " sub" + modby + nomod.substring((congind+1));
		// 		//////////////////////////////console.log(str);
		// 		/** Removes the string "to", if it exists*/
		// 		var toind = str.indexOf(" to", congind);
		// 		str = str.substring(0, toind) + str.substring((toind+3));
		// 		//////////////////////////////console.log(str);
    //
		// 	}
		// }
		// }
		/**
		if(congarray.length>0)
		{

		str = str.replace(/mod/gi, "sub");
		}
		*/

		var modarray = getIndicesOf("mod", str, false);
		var itrdiff = 0;
		var prevlength = str.length;
		for(var modvar in modarray)
		{
			var modind = modarray[modvar] + itrdiff;

			var aft = wordsafter(str, "mod", 1, modind-1).substring(1);
			var bef = wordsbefore(str, "mod",1, modind);

			if(bef != bef.toLowerCase())
			{
				if(aft == aft.toLowerCase())
				{
					str = str.substring(0,modind) + "/ "+ str.substring(modind + 3);
				}
				else
				{
					str = str.substring(0,modind) + "\\ "+ str.substring(modind + 4);
				}
			}
			itrdiff = str.length - prevlength;
		}

		var decarray = getIndicesOf(".", str, false);
		var itrdiff = 0;
		var prevlength = str.length;
		for(var decvar in decarray)
		{
		//Checks if there is a decimal in the string
		var decind = decarray[decvar];
		if(decind != -1)
		{
			decind = decind + itrdiff;
			//Checks if it terminates
			var endofdec = str.indexOf(" ", decind);

			//////////////////////////////console.log(endofdec);
			//////////////////////////////console.log(decind);
			//////////////////////////////console.log(itrdiff);
			var repeatind = str.indexOf(" repeating ", decind);
			//////////////////////////////console.log(repeatind);

			if(repeatind!=-1 && repeatind == endofdec)
			{
				str = str.substring(0,decind) + '<span style = "text-decoration: overline; float: none;">' + str.substring(decind, endofdec) + "</span>" + str.substring(endofdec);
			}
			itrdiff = str.length - prevlength;

		}
		}
		if(decarray.length>0)
		{
			str = str.replace(/repeating/gi, " ");
		}

		/*****LOGS*****/

		var logarray = getIndicesOf("log", str, false);
		itrdiff = 0;
		var prevlength = str.length;
		for(var logvar in logarray)
		{
		//Checks if there is a decimal in the string
		var logind = logarray[logvar];
		if(logind != -1)
		{
			logind = logind + itrdiff;
			var baseind = str.indexOf(" base ",logind);
				if(baseind != -1)
				{
					var logby = wordsafter(str, "base", 1, baseind);
					var logof = wordsafter(str, logby.substring(1), 1, baseind);
					var nolog = str.substring(0,baseind) + str.substring(baseind + (5 + logby.length + logof.length));
					str = nolog.substring(0,logind) + "<span style = 'font-style: normal; float: none;'>" + "log base" + logby + logof + "</span>" + nolog.substring((logind+3));
				}
			itrdiff = (str.length - prevlength);

		}
		}
		if(logarray.length>0)
		{
			str = str.replace(/base/gi, "sub");
		}

		//Dolla Dolla bill y'all
		var cashruleseverything = getIndicesOf("$", str, false);
		itrdiff = 0;
		prevlength = str.length;
		for(var aroundme in cashruleseverything)
		{
			var cream = cashruleseverything[aroundme] + itrdiff;
			var getthemonies = str.indexOf(" ", cream);
			str = str.substring(0, cream) + "<span style = 'float: none; font-style: normal;'>" + str.substring(cream, getthemonies) + "</span>" + str.substring(getthemonies);
			itrdiff = str.length - prevlength;
		}


		//integral of integral ==> double integral
		str = str.replace(/the integral/gi, "integral")
		var intinds = getIndicesOf(" integral ", str, false);
		itrdiff = 0;
		prevlength = str.length;
		for(var inti = 0; inti<intinds.length; inti++)
		{
			var intind = intinds[inti] + itrdiff;
			var int2ind = str.indexOf("of integral", intind);
			if(int2ind!=-1)
			{

				str = str.substring(0,intind) + " double integral " + str.substring(intind+9,int2ind) + str.substring(int2ind+11);
				inti = inti+1;
			}
			itrdiff = str.length - prevlength;
		}

                                                                                // //     // HZ: Commented out for now, makes limit of x as x approaches n, but breaks
                                                                                // //     // limit as x approaches n of x
                                                                                // // 		var liminds = getIndicesOf(" limit ", str, false);
                                                                                // //     //////////////console.log("_____________________________");
                                                                                // //     //////////////console.log(liminds);
                                                                                // // =======
                                                                                // 		//////////////console.log(str + ": before");
                                                                                // 		var liminds = getIndicesOf(" limit ", str, false);
                                                                                // 		for (var limi in liminds)
                                                                                // 		{
                                                                                // 			var limind = liminds[limi];
                                                                                //       //////////////console.log(limind);
                                                                                // 			var ofind = str.indexOf("of", limind);
                                                                                // 			if(ofind!=-1)
                                                                                // 			{
                                                                                // 				var limof = wordsafter(str, "of", 1, limind).substring(1);
                                                                                // 				//////////////console.log(limof + ": limit taken of this")
                                                                                // 				var indlimof = str.indexOf(limof, ofind);
                                                                                // 				//////////////console.log(indlimof + ": limit taken of index");
                                                                                // 				if(indlimof !=-1)
                                                                                // 				{
                                                                                // 					var noguff = str.substring(0,ofind) + str.substring(indlimof+limof.length);
                                                                                // 					//////////////console.log(noguff + ": noguff");
                                                                                // 					var indapproach = noguff.indexOf(wordsafter(str, "approaches", 1, limind));
                                                                                // 					if(indapproach!=-1)
                                                                                // 					{
                                                                                // 						str = noguff.substring(0,indapproach + wordsafter(noguff, "approaches", 1, limind).length) + " of " + limof + noguff.substring(limind+6+indapproach + wordsafter(noguff, "approaches", 1, limind).length);
                                                                                // 					}
                                                                                // 				}
                                                                                // 			}
                                                                                // 		}
                                                                                		/****END OF LOGS*****/
                                                                                          // else if(sep[i][2] == true){ // controls spacing
                                                                                          //   if(sep[i][3] == true){
                                                                                          //     if(sep[i][4] == true){
                                                                                          //       str = str.replace(reGex,"<hr " + sep[i][1] + ">" + after);

                                                                                          //     } else {
                                                                                          //       str = str.replace(reGex,"<hr " + sep[i][1] + "> " + after);
                                                                                          //     }
                                                                                          //   } else {
                                                                                          //     str = str.replace(reGex," <hr " + sep[i][1] + ">" + after);
                                                                                          //   }
                                                                                          // } else {
                                                                                          //   str = str.replace(reGex," <hr " + sep[i][1] + "> " + after);
                                                                                          // }

		      for(i = 0; i < sep.length; i++){
              p = 0;
              if(sep[i][3] == true) { // Checks if you want the word to be case sensitive
                reGex = new RegExp(sep[i][0], "g");
              } else{
                reGex  = new RegExp(sep[i][0],"ig");
              }
              if(sep[i][4] instanceof String){ //TODO: CHANGE AFTER REFACTORING
                after = sep[i][4];
              } else { after = "";}
              if(sep[i][4] instanceof Array){ // TODO: CHANGE AFTER REFACTORING
                classes = "";
                for(k = 0; k < sep[i][4].length; k++){
                  classes = sep[i][4][k] + " ";

                }
                str = str.replace(reGex," %hr" + sep[i][1] + " class='" + classes + "'%% " + after);
              } else if (sep[i][2] == 3) {
                str = str.replace(reGex,"%hr" + sep[i][1] + "%%" + after);
              } else if (sep[i][2] == 2) {
                str = str.replace(reGex,"%hr" + sep[i][1] + "%% " + after);
              } else if (sep[i][2] == 1) {
                str = str.replace(reGex," %hr" + sep[i][1] + "%%" + after);
              } else if (sep[i][2] == 0) {
                str = str.replace(reGex," %hr" + sep[i][1] + "%% " + after);
              } else {

              }
            }
            reGex = new RegExp("\\s\\s+%hr(.+)>","ig");
            str.replace(reGex," %hr$1%%");



        //LOOK BACKS REPLACEMENTS
        /*sep = [
        [" vector","vector"]
        ];
        for(i = 0; i < sep.length; i++){
          p = 0;
          loc = 0;
          while(str.indexOf(sep[i][0],loc+1) != -1){
            loc = str.indexOf(sep[i][0],loc+1);
            vart = str.substring(loc-1,loc);
            str = str.substring(0,loc-1) + "<span " + sep[i][0] + ">" + vart + "</span>" + str.substring(loc+sep[i][0].length);
            loc = str.indexOf(sep[i][0],loc+1);
          }
        }*/


        str = str.replace("bool ","boolean ");
        str = str.replace("bool:","boolean:");

        if(str.indexOf("boolean") != -1){
          //HR REPLACEMENTS for BOOLEAN LOGIC
          sep = [[" and ","and"],
          [" or ","or"],
          [" nor ","nor"]
          ];
          for(i = 0; i < sep.length; i++){
            p = 0;
            while(str.indexOf(sep[i][0],p) != -1){
                str = str.replace(sep[i][0]," <hr " + sep[i][1] + "> ");
                p++;
            }
          }
          str = str.replace("boolean:","");
          str = str.replace("boolean","");
        }


        //SPACED TERM REPLACEMENTS

        sep = [
        ["with limits", "and", "from", "to"],
        ["sin", "squared", "sin squared", ""],
        ["cos", "squared", "cos squared", ""],
        ["tan", "squared", "tan squared", ""],
        ["csc", "squared", "csc squared", ""],
        ["sec", "squared", "sec squared", ""],
        ["cot", "squared", "cot squared", ""],
        ["sin", "cubed", "sin cubed", ""],
        ["cos", "cubed", "cos cubed", ""],
        ["tan", "cubed", "tan cubed", ""],
        ["csc", "cubed", "csc cubed", ""],
        ["sec", "cubed", "sec cubed", ""],
        ["cot", "cubed", "cot cubed", ""],
        ["the ratio of", "and", "", "<span static>:</span>"],
        ["the ratio of", "to", "", "<span static>:</span>"],
        ["bigunion of", "and", "", "<hr cup>"],
        ["bigintersect of", "and", "", "<hr cap>"],
        ["<hr cap> of", "and", "", "<hr cap>"],
        ["difference of", "and", "", "-"],
        ["<hr times> of", "and", "", "<hr times>"],
        ["inner product of", "and", "<hr lbracket>", ",", "<hr rbracket>"],
        ["product of", "and", "", "<hr times>",""],
        ["open interval from ", "to", "(", ",", ")"],
        ["closed interval from ", "to", "[", ",", "]"],
        ["interval from", "to", "[", ",", "]"],
        ];

        // ////////////////////////////console.log(str);
        for(i = 0; i < sep.length; i++){
          first = str.indexOf(sep[i][0]) + sep[i][0].length - 1;
          // ////////////////////////console.log(first);
          //////////////////////console.log(sep[i][0]);
          //////////////////////console.log(nextword(str,str.indexOf(nextword(str,first),first)));
          if(sep[i][1] == nextword(str,str.indexOf(nextword(str,first),first))){
            //////////////////////console.log("here");
            //////////////////////console.log(str);
            if(str.indexOf(sep[i][0]) != -1 && str.indexOf(sep[i][1], str.indexOf(sep[i][0])) > str.indexOf(sep[i][0])){
                  //////////////////////console.log("here2");

                  first = str.indexOf(sep[i][0]);
                  second = str.indexOf(sep[i][1]);
                  middle = str.substring(first+sep[i][0].length, second);
                  insert = sep[i][2] + " " + middle + " " + sep[i][3];

                  last = str.indexOf(" ",second+sep[i][1].length+1);
                  str = str.substring(0,first) + insert + str.substring(second+sep[i][1].length,last) + str.substring(last);

                  // +sep[i][4]+str.substring(last);
            }

            //////////////////////console.log(str);
          }
        }
        // ////////////////////////////console.log(str);

        while(str.indexOf("^") != -1){
          tty = str.indexOf("^");
          str = str.substring(0,tty) + " to the power of " + str.substring(tty+1);
        }
        //TERM REPLACEMENTS
        //RS - IF YOU WANT TO MAKE THE TERM REPLACEMENT CASE SENSITIVE THEN ADD A THIRD, ARBITRARTY, ELEMENT
        sep = [
        ["integrate","integral of"],["sum ","summation "],["second derivative","double derivative"],
        ["third derivative","triple derivative"], ["goes to ","approaches "], ["mapped to ","approaches "],
        ["heads to ","approaches "],["which means ","approaches "],["which implies ","approaches "],
        ["going to","goingto"],["heading to","headingto"],
        ["with limits", "from"],
		["second partial derivative", "doublepar derivative"], ["third partial derivative", "triplepar derivative"],
		["double partial derivative", "doublepar derivative"], ["triple partial derivative", "triplepar derivative"],
        ["cmatrix", "curly matrix"],
        ["curled matrix", "curly matrix"],
        ["curved matrix", "curly matrix"],
        ["integral over", "integral from"],
		["of quantity","of"],
        ["summation over", "summation from"],
        ["product over", "product from"],
        ["union over", "union from"],
        ["intersection over", "intersection from"],
        [" lim ", " limit "],
        [" divided by ", " over "],
    	  ["perpendicular to", "<span style = 'font-style:normal; float: none;'>&#8869;</span>"],
        [" and from", " from"],
        ["with index", "from"],
        [" modified by", "; modified by"],
        [" m:", " matrix:"],
        [" naught", "<sub>0</sub>"],
        [" qed", " <span qed>Q.E.D.</span>"],
        [" q.e.d.", " <span qed>Q.E.D.</span>"],
        ["with respect to","inrespectto"], ["in respect to","inrespectto"],
        ["all over","allover"], ["divided by","dividedby"], ["in domain","region"], ["domain in","region"],
        ["region in","region"],
        ["in region","region"],
        [" star ","<sup>*</sup> "],
        [" starred","<sup>*</sup>"],
        ["equals","="],
        ["is equal to","="],
        ["plus","+"],
		    [" line segment ", "segment "],
	      ["minus","-"],
		    ["negative ","-"],
        [" factorial","<span style='font-style:normal;float:none;'>!</span>"],
        [" rt of ", " root of "], ["sqrt", "root "], ["radical","root"],
		    ["minus dot dot dot","-<hr dot></hr><hr dot></hr><hr dot></hr>"],
		    ["comma ", ", "],
        ["radical","root"],
        ["square root","root"], ["cube root","3root"],
        ["cubic root","root degree 3"], ["of the  <hr degsign>","ofthedegree"],
        ["root of with", "root with"],
        ["of <hr degsign>","ofthedegree"],
        ["of the degree","ofthedegree"],
        ["with the degree","ofthedegree"],
        ["with degree","ofthedegree"],
        ["of degree","ofthedegree"],
		["root", "root of"], ["root of of", "root of"],
        ["R1","<hr re4l> to the power of 1",""], //simplify to tree later.
        ["R2","<hr re4l> to the power of 2",""],
        ["R3","<hr re4l> to the power of 3",""],
        ["R4","<hr re4l> to the power of 4",""],
        ["R5","<hr re4l> to the power of 5",""],
        ["R6","<hr re4l> to the power of 6",""],
        ["Rn ","<hr re4l> to the power of n",""],
        ["Rm ","<hr re4l> to the power of m ",""],

        [" Cn ","C to the power of n ",""],
        [" Cm ","C to the power of m ",""],
        [" C infinity ","C<sup><hr infty></sup>",""],
        [" Cinf ","C<sup><hr infty></sup>",""],
        ["a constant","C"],
        ["an arbitrary constant","C"],
        ["some constant","C"],
        ["Z2","<hr integers> to the power of 2",""],
        ["Z3","<hr integers> to the power of 3",""],
        ["Zn ","<hr integers> to the power of n ",""],
        ["Zm ","<hr integers> to the power of m ",""],
        ["%hrin%% integer","<hr in><hr integers>"],
        ["%hrin%% rational number","<hr in><hr rational>"],
        ["%hrin%% rational","<hr in><hr rational>"],
        [" is rational","<hr in><hr rational>"],
        ["%hrin%% real number","<hr in><hr re4l>"],
        ["%hrin%% real","<hr in><hr re4l>"],
        [" is real","<hr in><hr re4l>"],
        [" dagger ","<sup><hr dagger></sup>"],
        [" dagger ","<sup><hr dagger></sup>"],
        ["inverse ", "to the power of -1 "],
        ["transpose ", "to the power of T "],
        [" to the "," to the power of "],
        [" power of power of "," power of "],
        [" such that "," s.t. "],
        ["and then","andthen"],
        ["andthen",";;"],
        [";;"," ;;"],
        ["\\[","[  "],
        ["\\]","  ]"],
        [" triple prime","<sup>'''</sup>",true],
        [" double prime","<sup>''</sup>",true],
        [" prime","<sup>'</sup>",true],
        ["evaluated","evaluation"],
        ["assessed","evaluation"],
        ["evaluation by","evaluation from"],
        ["evaluation at","evaluation from"],
        ["taken from","evaluation from"],
        ["taken by","evaluation from"],
        //subsyntax
        [" intl "," integral "],
        [" dintl "," double integral "],
        [" cintl "," contour integral "],
        [" sintl "," surface integral "],
        [" vintl "," volume integral "],
        [" tintl "," triple integral "],
        [" tfo "," the fraction of "],
        [" prdt "," product "],
        [" iintl "," integral from 0 to <hr infty> "],
        [" 2iintl ", " integral from -<hr infty> to <hr infty> "],
        [" pintl ", " integral from 0 to <hr pi> "],
        [" 2pintl ", " integral from 0 to 2<hr pi> "],
        [" 1intl "," integral from 0 to 1 "],
        [" nsum ", " sum with index n = 0 to <hr infty> "],
        [" nksum ", " sum with index k = 0 to n "],
        [" nproduct ", " product with index n = 0 to <hr infty> "],
        [" nkproduct ", " product with index k = 0 to n "],
        [" nprdt ", " product with index n = 0 to <hr infty> "],
        [" nkprdt ", " product with index k = 0 to n "],
        [" ssin", " sin squared"],
        [" scos", " cos squared"],
        [" stan ", " tan squared "],
        [" scot ", " cot squared "],
        [" scsc", " csc squared"],
        [" ssec", " sec squared"],
        ["peicewise", "pwise"],
        ["piecewise", "pwise"],
        ["prmenumbers","<span static>prime</span>"],
		    [" time derivative ", " <span style = 'font-style: normal; float:none;'>dw over dt</span>"]
        /***** GRAPH window.swaps *****/
        //endsyntax
        ];

        for(i = 0; i < sep.length; i++){
          if(str.toUpperCase().indexOf(sep[i][0].toUpperCase()) != -1){
              if(sep[i].length===3) { //RS - IF YOU WANT TO MAKE THE TERM REPLACEMENT CASE SENSITIVE THEN ADD A THIRD, ARBITRARTY, ELEMENT
                asdf="g";
              }
              else {
                asdf="ig";
              }
                regEx = new RegExp(sep[i][0], asdf);
                str = str.replace(regEx,sep[i][1]);
          }
        }


		var flagarray = ["of", "from", "to", "index", "steps", "wls", "region", "and", "over", "ofthedegree", "allover", "dividedby", ";;", "dx", "dy", "dz", "da", "db", "du", "dv", "withrespectto", "inrespectto", "as", "headingto", "approaching", "approaches", "goingto", "=", "+", "-", "/"];
		var sqs = getIndicesOf(" squared ", str, false);
		var cubs = getIndicesOf(" cubed ", str, false);
		var thetas = getIndicesOf("theta ", str, false);
		var pis = getIndicesOf("pi ", str, false);
		itrdiff = 0;
		prevlength = str.length;
		for(var sq in sqs)
		{
			var sqind = sqs[sq] + itrdiff;
			var doesitend = str.indexOf(" ", sqind+9);
			//////////console.log(doesitend);
				if(doesitend!=-1)
				{
					for(var flags in flagarray)
					{
						if(str.substring(sqind+9,doesitend)==flagarray[flags])
						{
						////////console.log(flagarray[flags]);
							str = str.substring(0,sqind + 9) + " " + str.substring(sqind + 9);
						}
					}
				}
			itrdiff = str.length - prevlength;
		}
		itrdiff = 0;
		prevlength = str.length;
		for(var cub in cubs)
		{
			var cubind = cubs[cub] + itrdiff;
			var doesitend = str.indexOf(" ", cubind+7);
			////////////console.log(doesitend);
				if(doesitend!=-1)
				{
					for(var flags in flagarray)
					{
						if(str.substring(cubind+7,doesitend)==flagarray[flags])
						{
							str = str.substring(0,cubind + 7) + " " + str.substring(cubind + 7);
						}
					}
				}
			itrdiff = str.length - prevlength;
		}
		itrdiff = 0;
		prevlength = str.length;
		for(var pin in pis)
		{
			var pindex = pis[pin] + itrdiff;
			var doesitend = str.indexOf(" ", pindex+3);
			////////////console.log(doesitend);
				if(doesitend!=-1)
				{
					for(var flags in flagarray)
					{
						if(str.substring(pindex+3,doesitend)==flagarray[flags])
						{
							str = str.substring(0, pindex+ 3) + " " + str.substring(pindex + 3);
						}
					}
				}
			itrdiff = str.length - prevlength;
		}


		////console.log(str + ": before ofthedegree");

		var rootindices = getIndicesOf("root", str, false);
		itrdiff = 0;
		prevlength = str.length;
		for(var rootn in rootindices)
		{
			var rootind = rootindices[rootn] + itrdiff;
			var degind = str.indexOf("ofthedegree", rootind);
				if(degind!=-1)
				{
					var deg = wordsafter(str, "ofthedegree", 1, rootind);
					if(deg!=-1)
					{
						str = str.substring(0, rootind) + deg + str.substring(rootind, degind) + str.substring(degind+12+deg.length);
					}
				}
			itrdiff = str.length - prevlength;
		}

		////console.log(str + ": after ofthedegree");


		itrdiff = 0;
		prevlength = str.length;
		for(var thet in thetas)
		{
			var thetind = thetas[thet] + itrdiff;
			var doesitend = str.indexOf(" ", thetind+6);
			////////////console.log(doesitend);
				if(doesitend!=-1)
				{
					for(var flags in flagarray)
					{
						if(str.substring(thetind+6,doesitend)==flagarray[flags])
						{
							str = str.substring(0,thetind + 6) + " " + str.substring(thetind + 6);
						}
					}
				}
			itrdiff = str.length - prevlength;
		}


    //////console.log(str);

		regEx = new RegExp(" squared ", "ig");
		str = str.replace(regEx, "<sup>2</sup>" );

		regEx = new RegExp(" degrees ", "ig");
		str = str.replace(regEx, "<hr degsign><//hr>" );

		regEx = new RegExp(" squared\\)", "ig");
		str = str.replace(regEx, "<sup>2</sup>)" );

		regEx = new RegExp(" cubed ", "ig");
		str = str.replace(regEx, "<sup>3</sup>");

		regEx = new RegExp(" cubed\\)", "ig");
		str = str.replace(regEx, "<sup>3</sup>)" );


		////////console.log(str);

		regEx = new RegExp("theta ", "ig");
		str = str.replace(regEx, "%hrtheta%%");

		regEx = new RegExp("pi ", "ig");
		str = str.replace(regEx, '%hrpi%%');

		//Random stuffs




		str = getRandomVars(str);




		// var liminds = getIndicesOf(" limit ", str, false);

    /*
		var liminds = getIndicesOf(" limit ", str, false);
		for (var limi in liminds)
		{
			var limind = liminds[limi];
			var ofind = str.indexOf("of", limind);
			if(ofind!=-1)
			{
				var limof = wordsafter(str, "of", 1, limind).substring(1);
				if(limof != "")
				{
				var indlimof = str.indexOf(limof, ofind);
				if(indlimof !=-1)
				{
					var noguff = str.substring(0,ofind) + str.substring(indlimof+limof.length);
					var indapproach = noguff.indexOf(wordsafter(str, "approaches", 1, limind));
					if(indapproach!=-1)
					{
						str = noguff.substring(0,indapproach + wordsafter(noguff, "approaches", 1, limind).length) + " of " + limof + noguff.substring(limind+6+indapproach + wordsafter(noguff, "approaches", 1, limind).length);
					}
				}
				}
			}
		}*/


        topterms = [["one",1],["two",2],["three",3],["four",4],["five",5],["six",6],["seven",7]
        ,["eight",8],["nine",9],["ten",10],["eleven",11],["twelve",12],["thirteen",13],["fourteen",14],["fifteen",15],["sixteen",16]];
        bottomterms = [["half",2],["third",3],["fourth",4],["fifth",5],["sixth",6],["seventh",7]
        ,["eighth",8],["ninth",9],["tenth",10],["eleventh",11],["twelvth",12],["thirteenth",13],["fourteenth",14],
        ["fifteenth",15],["sixteenth",16]];
        for(i = 0; i < bottomterms.length; i++){
          if(str.toUpperCase().indexOf(bottomterms[i][0].toUpperCase()) != -1){
                bottomposition = str.toUpperCase().indexOf(bottomterms[i][0].toUpperCase());
                for(k = 0; k <= bottomterms.length; k++){
                    if(k > 0){
                      regEx = new RegExp(topterms[k][0] + " " + bottomterms[i][0] + "s", "ig");
                      str = str.replace(regEx,topterms[k][1] + " over " + bottomterms[i][1]);
                    } else {
                      regEx = new RegExp(topterms[k][0] + " " + bottomterms[i][0], "ig");
                      str = str.replace(regEx,topterms[k][1] + " over " + bottomterms[i][1]);
                    }
                }
          }
        }

			   //The below could be done with one line, but #RickRoss4Lyfe so I made it unneccessarily
	  //long
/*
	  ////console.log(str + ": before dicedpineapples");
>>>>>>> master
	  var dicedpineapples = getIndicesOf("root of ", str, false);
		itrdiff = 0;
		prevlength = str.length;
		for(var rrgrunt in dicedpineapples)
		{
			var lebronuptheblock = dicedpineapples[rrgrunt];
			if(wordsbefore(str, "root ", 1, dicedpineapples) == "over")
			{
			var shawtysofine = 0;
			if(str.charAt(lebronuptheblock+9)=="(")
			{
				var mybabytastesthebest = matchLeftParens(str,lebronuptheblock);
				shawtysofine = str.indexOf(" ", mybabytastesthebest);
			}
			else
			{
				shawtysofine = str.indexOf(" ", lebronuptheblock+9);
			}
			str = str.substring(0, dicedpineapples) + "(" + str.substring(dicedpineapples, shawtysofine) + ")" + str.substring(shawtysofine);
			itrdiff = str.length - prevlength;
			}
		}
*/
        //todo: split fractions into different group for efficiency.
        window.swaps = [];
        pointer = 100;
        if(str.indexOf("chem") == -1){
           window.parensCount = 0;
           function setParens(str){
             while(str.indexOf("(") != -1 && str.lastIndexOf(")") > str.indexOf("(")){
                  start = str.indexOf("(");
                  pointer = start;
                  stack = 0;
                  while(pointer < str.length){
                    window.parensCount++;
                    pointer++;
                    if(str.charAt(pointer) == "("){
                      stack++;
                      continue;
                    }
                    if(str.charAt(pointer) == ")"){
                      stack--;
                      end = pointer;
                      start = str.lastIndexOf("(",end);
                      pointer = pointer - end + start + 1 + 9;
                      window.swaps.push(["#" + window.parensCount + "###parens" + window.parensCount + "#",str.substring(start+1,end)]);
                      str = str.substring(0,start) + "#" + window.parensCount + "###parens" + window.parensCount  + "#" + str.substring(end+1);
                    }
                    ////////////////console.log(str);
                  }
              }
              return str;
              //return window.swaps;
           }



		/**
		window.fracadjust = [["sup", true], ["sub", true], ["absolute value of",false]];
        pointer = 100;
        if(str.indexOf("chem") == -1){
           window.fracCount = 0;
           function setParens(str){
             while(str.indexOf("(") != -1 && str.lastIndexOf(")") > str.indexOf("(")){
                  start = str.indexOf("(");
                  pointer = start;
                  stack = 0;
                  while(pointer < str.length){
                    window.fracCount++;
                    pointer++;
                    if(str.charAt(pointer) == "("){
                      stack++;
                      continue;
                    }
                    if(str.charAt(pointer) == ")"){
                      stack--;
                      end = pointer;
                      start = str.lastIndexOf("(",end);
                      pointer = pointer - end + start + 1 + 9;
                      window.swaps.push([window.fracCount + "###fraca" + window.fracCount,str.substring(start+1,end)]);
                      str = str.substring(0,start) + window.fracCount + "###fraca" + window.fracCount + str.substring(end+1);
                    }
                    ////////////////console.log(str);
                  }
              }
              return str;
              //return window.swaps;
           }
*/

           str = setParens(str);
           ////////console.log("After Parens");
           ////////console.log(str);

           ////////////////console.log(str);

           /*
           while(str.indexOf("(") < str.indexOf(")") && str.indexOf("(") != -1){
                pointer++;
                start = str.indexOf("(");
                end = str.indexOf(")");
                swaps.push([pointer + "###parens",ff(str.substring(start+1,end))]);
                str = str.substring(0,start) + pointer + "###parens" + str.substring(end+1);
            }
           */
        }


        reGex = new RegExp("___","ig");
        str = str.replace(reGex," bar");
        reGex = new RegExp("__","ig");
        str = str.replace(reGex," vector");
        reGex = new RegExp("_","ig");
        str = str.replace(reGex," sub ");



        // LOOK BACKS REPLACEMENTS
        sep = [
          [" vector","vector"]
        ];
        for(i = 0; i < sep.length; i++){
          p = 0;
          loc = -1;
          while(str.indexOf(sep[i][0],loc+1) != -1){
            loc = str.indexOf(sep[i][0],loc+1);
            vart = str.substring(loc-1,loc);
            str = str.substring(0,loc-1) + "<span " + sep[i][0] + ">" + vart + "</span>" + str.substring(loc+sep[i][0].length);
            loc = str.indexOf(sep[i][0],loc+1);
          }
        }

        // Keeps it to just vector v
        //
        // sep = [
        //   ["vector","vector"]
        // ];
        // for(i = 0; i < sep.length; i++){
        //   p = 0;
        //   loc = -1;
        //   while(str.indexOf(sep[i][0],loc+1) != -1){
        //     loc = str.indexOf(sep[i][0],loc+1);
        //     vart = str.substring(loc + sep[i][0].length + 1, loc + sep[i][0].length + 2);
        //     str = str.substring(0,loc) + "<span " + sep[i][0] + ">" + vart + "</span>" + str.substring(loc+sep[i][0].length + 2);
        //     loc = str.indexOf(sep[i][0],loc+1);
        //   }
        // }

  		reGex = new RegExp(" directional derivative ", "ig");
  		str = str.replace(reGex, " D<sub><span vector>u</span></sub> ");

      /*
        reGex = new RegExp(" set of","ig");
        str = str.replace(reGex," set");
        while(str.indexOf(" set") != -1){
          idx = str.indexOf(" set");
          end = str.indexOf("escape",idx);
          if(end == -1){end = str.length};
          str = str.substring(0,idx) + "<span static>{</span>" +
          str.substring(idx+4,end).replace("Z","<hr integers>").replace("R","<hr re4l>").replace("N","<hr natural>") +
          "<span static>}</span>" + str.substring(end+6);
          window.swaps.push([window.parensCount + "###parens" + window.parensCount,ff(str.substring(start+1,end))]);
          str = str.substring(0,start) + window.parensCount + "###parens" + window.parensCount + str.substring(end+1);
         }*/

		var fin = str.indexOf("<hr dots>");
		while(fin != -1)
		{
			var opbef = wordsbefore(str, "<hr dots>");
			var oplist = ["+", "-", "/", "*", "times"];
			for(var opind in oplist)
			{
				if(opbef == oplist[opind])
				{
					str = str.substring(0,fin) + "<hr dot><hr dot><hr dot>" + str.substring(fin+9);
				}
			}
			fin = str.indexOf("<hr dots>", fin+8);

		}


		//////////////console.log("begin");
    ////////console.log("Before Enclose");
    ////////console.log(str);
        str = enclose(str);
        ////////console.log("After Enclose");
        ////////console.log(str);
		//////////////console.log("end");
        str = matrix_factor(str);
        str = table_factor(str);
        str = pwise_factor(str);
        str = venn_factor(str);
        str = geometry(str);
        str = chemistry(str);
		////////console.log(str);
        return [str];
    }


/*****
Takes an array of common phrases and seperates them into scripts
like to the power of etc.  This gives the tag names, and is inserted
inline.
*****/
    /**** MARKER: [Enclose] ****/
    function enclose(str){

	  if(str.indexOf("abs101###parens") != -1)
	  {
		  var reginaldex = new RegExp("abs","ig");
		  str = str.replace(reginaldex,"absolute value of ");
	  }
    if(str.indexOf("sqrt101###parens") != -1)
    {
      var reginaldex = new RegExp("sqrt","ig");
      str = str.replace(reginaldex,"root of ");
    }

	var findc = getIndicesOf("code", str, false);
	var itdiff = 0;
	var prevlengt = str.length;
	for(var cic in findc)
	{
		var codeind = findc[cic] + itdiff;
		var nextwordomine = wordsafter(str, "code", 1, codeind);
		var nextwordomineind = str.indexOf(nextwordomine, codeind);
		var endcode = str.indexOf(" ", nextwordomineind + 2);
		if(endcode!=-1)
		{
			str = str.substring(0, codeind+4) + "<span style = 'font-family:Courier New; font-style: normal; float: none;'>" + str.substring(codeind+4, endcode) + "</span>" + str.substring(endcode);
		}

		itdiff = str.length - prevlengt;

	}


	var rickrossex = new RegExp("code","ig");
	var liragalore = rickrossex
    str = str.replace(liragalore,"");

	////////////console.log(str + ": after code");

      sep = [["to the power of ","sup"],["the absolute value of ","u"],["absolute value of ","u"],
      //floor and ceiling + fractional part
	    ["bold ","b"],
      ["floor of ","b floor"],
      ["ceiling of ","b ceiling"],
      ["floor ","b floor"],
      ["ceiling ","b ceiling"],
      ["nearest of ","b nearest"],
      ["nearest integer of ","b nearest"],
      ["nearest integer to ","b nearest"],
      ["nearest integer ","b nearest"],
      ["fractional part of ","b fractional"],
      ["fractional part ","b fractional"],
      ["absolute value of ","b absolute"],
      ["the absolute value of* ","b absolute"],
      ["absolute value of* ","b absolute"],
      ["norm of ","b norm"],
      ["the norm of* ","b norm"],
      ["norm of* ","b norm"],
      ["to the power of* ","sup"],["adjoin ","b brackets"],
      [" perpendicular","sup","<span linear style='font-size:1.4em !important;float:none;'>&#x27c2;</span>"],
      ["the absolute value of* ","u"],["absolute value of* ","u"],["to the power of* ","sup"],
      [" perpendicular","sup","<span linear style='font-size:1.4em !important; font-style: normal; float:none;'>&#8869;</span>"],
      ["parallel ","sup","<span linear style='font-size:1.4em !important;float:none;'>&#x2225;</span> "],
      [" squared ","sup",2],["radians","sup","<span style='font-style:normal;float:none;'>rad</span>"],
      ["compliment","sup","c"],["cubed","sup",3],["quarted","sup",4],["sub ","sub"],
       ["inverse", "sup",-1], ["transpose", "sup","T"]
    ];
    // ////////////////console.log(str);
      for(i = 0; i < sep.length; i++){
          while(str.lastIndexOf(sep[i][0]) != -1){
              index = str.lastIndexOf(sep[i][0]);
              nextspace = str.indexOf(" ",index+sep[i][0].length);
              if(str.indexOf("<",index+sep[i][0].length) < nextspace && str.indexOf("<",index+sep[i][0].length) != -1){
                nextspace = str.indexOf("<",index+sep[i][0].length);
              }
              if(nextspace == -1){
                  nextspace = str.length;
              }
              val = str.substring(index+sep[i][0].length, nextspace);
              preindex = str.substring(0,index);
              if(str.substring(index-1,index) == " "){
                preindex = str.substring(0,index-1);//overwrite
              }
              ////////////////console.log(nextspace);
              if(nextspace != -1){
                nxtwrd = nextword(str,nextspace);
                //////////////console.log(nextspace);
                // //////////////console.log(nxtwrd);
                if(
                nxtwrd==="to"         ||
                nxtwrd==="of"         ||
                nxtwrd==="with"       ||
                nxtwrd==="in"         ||
                nxtwrd==="over"       ||
                nxtwrd==="divided by" ||
                nxtwrd==="from") {
                  bonjovi = 0;
                }
                else {
                  bonjovi = 1;
                }
                // HZ: commented the old line before, was causing /div to appear because bonjovi
                // was throwing off substring
                // postindex = str.substring(nextspace+bonjovi, str.length); //Old line
                postindex = str.substring(nextspace, str.length);
                ////////////////console.log(postindex);
              } else {
                  postindex = "";
              }
              openingtag = "<" + sep[i][1] + ">";
              if(sep[i][2]){
                  val = sep[i][2];
              }
              closingtag = "</" + sep[i][1] + ">";
              if(str.substring(index+sep[i][0].length, nextspace).indexOf("]") != -1){
                toadd = "]";
              } else { toadd = "" }
              str = preindex + openingtag + val + closingtag + toadd + postindex;
              ////////////////console.log(str);
          }
      }
      return str;
    }

/******
Parse is the midlevel function that takes the raw input, searching
the most relevent macro function, calls the appropriate object on it. ]
Parse is often recursively referred to for remaining subterms in things like
fractions.
******/
    window.last_macro = "";
    /**** MARKER: [Parse] ****/
    function parse(input,raw){
        var t = Math.floor(Date.now());
        i = input.toUpperCase();
        obj = false;
        var ind = 0;
        macros = ["TRIPLE INTEGRAL","DOUBLE INTEGRAL","CONTOUR INTEGRAL","SURFACE INTEGRAL",
        "VOLUME INTEGRAL","INTEGRAL",
        "PRODUCT","SUMMATION","BIGUNION", "BIGINTERSECT", "TRIPLEPAR DERIVATIVE", "DOUBLEPAR DERIVATIVE", "PARTIAL DERIVATIVE","TRIPLE DERIVATIVE","DOUBLE DERIVATIVE", "DERIVATIVE",
        "LIMIT","FRACTION ","GRAPH","EVALUATION"];

        minimum = i.length;

        var chosen = "";

        for(j = 0; j < macros.length; j++){
          if(i.indexOf(macros[j]) != -1 && minimum > i.indexOf(macros[j])){
              chosen = macros[j];
              minimum = i.indexOf(macros[j]);
          }
        }

		//console.log(input);

        if(chosen == "TRIPLE INTEGRAL"){
            ind = i.indexOf("TRIPLE INTEGRAL");
            window.large_eq = true;
            obj = new Triple_Integral(input);
        } else if(chosen == "DOUBLE INTEGRAL"){
            ind = i.indexOf("DOUBLE INTEGRAL");
            window.large_eq = true;
            obj = new Double_Integral(input);
        } else if(chosen == "CONTOUR INTEGRAL"){
            ind = i.indexOf("CONTOUR INTEGRAL");
            window.large_eq = true;
            obj = new Contour_Integral(input);
        } else if(chosen == "VOLUME INTEGRAL"){
            ind = i.indexOf("VOLUME INTEGRAL");
            window.large_eq = true;
            obj = new Volume_Integral(input);
        } else if(chosen == "SURFACE INTEGRAL"){
            ind = i.indexOf("SURFACE INTEGRAL");
            window.large_eq = true;
            obj = new Surface_Integral(input);
        } else if(chosen == "INTEGRAL"){
            ind = i.indexOf("INTEGRAL");
            window.large_eq = true;
            obj = new Integral(input);
        } else if(chosen == "PRODUCT"){
            ind = i.indexOf("PRODUCT");
            window.large_eq = true;
            obj = new Product(input);
        } else if(chosen == "BIGUNION"){
            ind = i.indexOf("BIGUNION");
            window.large_eq = true;
            obj = new Bigunion(input);
		} else if(chosen == "BIGINTERSECT"){
            ind = i.indexOf("BIGINTERSECT");
            window.large_eq = true;
            obj = new Bigintersect(input);
        } else if(chosen == "SUMMATION"){
            ind = i.indexOf("SUMMATION");
            window.large_eq = true;
            obj = new Summation(input);
        } else if(chosen == "TRIPLEPAR DERIVATIVE"){
            ind = i.indexOf("TRIPLEPAR DERIVATIVE");
            obj = new Triple_Partial_Derivative(input);
        } else if(chosen == "DOUBLEPAR DERIVATIVE"){
            ind = i.indexOf("DOUBLEPAR DERIVATIVE");
            obj = new Double_Partial_Derivative(input);
        } else if(chosen == "PARTIAL DERIVATIVE"){
            ind = i.indexOf("PARTIAL DERIVATIVE");
            obj = new Partial_Derivative(input);
        } else if(chosen == "TRIPLE DERIVATIVE"){
            ind = i.indexOf("TRIPLE DERIVATIVE");
            obj = new Triple_Derivative(input);
        } else if(chosen == "DOUBLE DERIVATIVE"){
            ind = i.indexOf("DOUBLE DERIVATIVE");
            obj = new Double_Derivative(input);
        } else if(chosen == "DERIVATIVE"){
            ind = i.indexOf("DERIVATIVE");
            obj = new Derivative(input);
        } else if(chosen == "LIMIT"){
            ind = i.indexOf("LIMIT");
            obj = new Limit(input);
        } else if(chosen == "FRACTION "){
            ind = i.indexOf("FRACTION ");
            obj = new Fraction(input);
        } else if(chosen == "ROOT"){
            ind = i.indexOf("ROOT");
            obj = new Root(input);
        } else if(chosen == "GRAPH"){
            ind = i.indexOf("GRAPH");
            obj = new Graph(input);
        } else if(chosen == "EVALUATION"){
            ind = i.indexOf("EVALUATION");
            obj = new Evaluation(input);
        } else {
          if(raw != false){
            obj = new Term(input);
          }
        }

        var k = Math.floor(Date.now());
        if(obj.name === undefined){
          obj.name = "";
        }
        if(obj.sections === undefined){
          obj.sections = "";
        }
        window.globl_vars.unshift(obj);
        if(obj !== false){
            prepend = new Term(input.substring(0,ind));
            return prepend.html + obj.html;
        } else {
            return input;
        }
    }
/*****
Simple count function for instances of any object.
*****/
    function countInstances(string, word) {
       var substrings = string.split(word);
       return substrings.length - 1;
    }

	function leftBrackMatch(str, ind)
	{
		var parcount = 0;
		for(var i = ind; i<str.length; i++)
		{
			if(str.charAt(i)=="<") { parcount++; }
			if(str.charAt(i)==">") { parcount--; }
			if(str.charAt(i)==">" && parcount==0) { return i; }

		}
		return -1;
	}

	function findSpaceBef(str, loc)
	{
		spbefore = str.lastIndexOf(" ", loc);
		var brackBefore = str.lastIndexOf("<", spbefore-1);
		var brackAfter = str.indexOf(">", spbefore);
		if(brackAfter==-1 || spbefore == 0)
		{
			return spbefore;
		}
		var brackbeforematch  = leftBrackMatch(str, brackBefore);

		if(brackbeforematch==brackAfter)
		{
			return findSpaceBef(str, brackBefore);
		}
		else
		{
			return spbefore;
		}
	}

	function findSpaceAft(str, loc)
	{
		spafter = str.indexOf(" ", loc);
		var brackBefore = str.lastIndexOf("<", spafter-1);
		var brackAfter = str.indexOf(">", spafter);
		if(brackBefore==-1 || spafter== str.length-1)
		{
			return spafter;
		}
		var brackbeforematch  = leftBrackMatch(str, brackBefore);

		if(brackbeforematch==brackAfter)
		{
			return findSpaceAft(str, brackAfter);
		}
		else
		{
			return spafter;
		}
	}


    function lastBracketorSpace(str,loc){
	  spbefore = findSpaceBef(str, loc-1);
      //bkbefore = str.lastIndexOf("<div>",loc-1)+4;
      //if(spbefore < bkbefore && spbefore != -1){spbefore = bkbefore;}
      //if(spbefore == -1){spbefore = str.lastIndexOf("<div>",loc-1); spbefore+=4;}
      if(spbefore == -1){spbefore = 0}
      return spbefore;
    }



    function nextBracketorSpace(str,loc){
      spafter = findSpaceAft(str,loc);
      //bkafter = str.indexOf("</div>",loc);
      //if(spafter > bkafter && bkafter != -1){spafter = bkafter;}
      //if(spafter == -1){spafter = str.indexOf("</div>",loc);}
      if(spafter == -1){spafter = str.length;}
      return spafter;
    }

	/**function gs(str)
	{
		//your var list is called window.fracadjust
		for(q = 0; q<window.
		adjust.length; q++)
		{

		}
	}*/

    function swap(str,override){
        for(q = 0; q < window.swaps.length; q++){
          k = str.indexOf(window.swaps[q][0]);
          nobrackets = false;
          if(k > 4){
              if(str.substring(k-3,k) == "<u>" || str.substring(k-5,k) == "<sup>"
                || str.substring(k-5,k) == "<sub>" || str.substring(k-1,k) == "^" || str.substring(k-71,k) == "<span style = 'font-family:Courier; font-style: normal; float: none;'> "){
                  nobrackets = true;
              }
          }

		  if(str.indexOf(window.swaps[q][0] + "$nb")!=-1)
		  {
			  nobrackets = true;
			  str.replace(window.swaps[q][0]+"$nb", window.swaps[q][0]);
		  }
          add = enclose(window.swaps[q][1]);
          if(nobrackets == false && override != true || 4 == 4){ //override temporary
              str = str.replace(window.swaps[q][0],"(" + add + ")");
          } else {
              str = str.replace(window.swaps[q][0], add);
          }
        }
       return str;
    }

    function parseSets(str, depth){
      while(str.indexOf("set of") != -1){
        //console.log(str);
        idx = str.indexOf("set of");
        //console.log(idx)
        end = str.indexOf("escape",idx);
        if(end == -1){end = str.indexOf("  ",idx);}
        else { end = end + 6 }
        if(end == -1){
          end = str.length  - 1};
        str = str.substring(0,idx) + "<span static>{</span>" + str.substring(idx+6,end) + "<span static>}</span>";
      }
      return str;
    }

    function parseFractions(str, depth)
    {
      window.countbreaker = 0;
	  ////////console.log(str + "level: " + depth);
      if(depth == 0 && str.indexOf(" over ") == -1){ return str; }
    	if(depth < 2)
    	{
          while(str.indexOf(" over ") != -1){
            window.countbreaker++;
            var loc = str.indexOf(" over ");
            var spbefore = lastBracketorSpace(str,loc);
            var spafter = nextBracketorSpace(str,loc+6);
            ////console.log("Parse Fractions");
            ////console.log(str);
            var wordbefore = parseFractions(" " + parseRoots(swap(str.substring(spbefore+1,loc),true), 0, true) + " ",depth + 1);
            var wordafter = parseFractions(" " + parseRoots(swap(str.substring(loc+6,spafter),true), 0, true) + " ",depth + 1);
            if(depth == 0){ beforeterm = "</div>"; afterterm = "<div term>";} else {
              beforeterm = ""; afterterm = "";
            };
            ////console.log(wordbefore);
            str = str.substring(0,spbefore+1) + beforeterm + "<div fraction><div top>" + wordbefore +
            "</div><div bottom>" + wordafter + "</div></div>" + afterterm + str.substring(spafter);
            ////console.log(str);
            if(window.countbreaker > 100){break;}
          }
          if(depth < 2)
        	{
            str = parseFractions(" " + swap(str,true) + " ",depth+1);
          }
		}
    	else
    	{
    		str = ff(str);
    	}
      return str;
    }


    function parseRoots(str, depth, inner)
    {

      // ////console.log("Inside Roots");
      // ////console.log(str);
      // ////console.log(depth);

      window.countbreaker = 0;
      if(depth == 0 && str.indexOf("root of ") == -1){ return str; }
    	if(depth < 2)
    	{
          while(str.indexOf("root of ") != -1){
            window.countbreaker++;
            var loc = str.indexOf("root of ");
            /*var spbefore = lastBracketorSpace(str,loc);*/
            var spafter = nextBracketorSpace(str,loc+8);
            /*var wordbefore = parseFractions(" " + swap(str.substring(spbefore+1,loc),true) + " ",depth + 1);*/
            var wordafter = parseRoots(" " + swap(str.substring(loc+8,spafter),false) + " ",depth + 1, inner);
                  /*
                  var feedtowordafter = swap(str.substring(loc+8, spafter), false);
                  ////console.log(feedtowordafter + ": before parentheses elimination at depth " + depth);
                  if(depth==0)
                  {
                  feedtowordafter = feedtowordafter.replace("(", "").replace(")","");
                  }
                  ////console.log(feedtowordafter + ": after parentheses elimination at depth " + depth);
                  var wordafter = parseRoots(" " + feedtowordafter + " ",depth + 1);
                  */
            if(depth == 0 && inner != true){ beforeterm = "</div>"; afterterm = "<div term>";} else {
              beforeterm = ""; afterterm = "";
            };
            str = str.substring(0,loc) + beforeterm + "<div root><div of>"
            + wordafter + "</div></div>" + afterterm + str.substring(spafter);
            if(window.countbreaker > 100){break;}
          }
          if(depth < 2 && inner != true)
        	{
            str = parseRoots(" " + swap(str,false) + " ",depth+1, inner);
          }
		}
    	else
    	{
        if(inner != true){
          str = rf(str);
        }
    	}
      return str;
    }



/*****
Post function is the near finalrt  cycle of the sequence.
Post does the following matters:

* takes micro syntaxes of macro functions like "over"
     and converts them into the appropriate format.
* remove unnecessary words like "the"
* readds back parens
******/
    /**** MARKER: [Post] ****/

    function post(str){
      ////////////////console.log("POST");
      ////////////////console.log(str);
      //HZ: Checks for projections
      reGex = new RegExp("projection of |project |proj ", "ig");
      str = str.replace(reGex, "projection ");
      // if ((str.indexOf("projection") != -1) && (str.indexOf("onto") != -1)) {
      //     ind = str.indexOf("projection");
      //     begin = str.indexOf(" ", ind + 6);
      //     end = str.indexOf(" ", str.indexOf("onto") + 5);
      //     if (end == -1) {end = str.lastIndexOf("</div>");} // in case it's the last element
      //     else if (str.indexOf("<", str.indexOf("onto") == str.indexOf("onto") + 5)) {
      //       end = str.indexOf(">", str.indexOf("<", str.indexOf("onto"))) + 1;
      //     }
      //     proj_string = str.substring(begin + 1, end);
      //     proj_string = swapterms(proj_string, "onto");
      //     proj_string = proj_string.replace("onto ", "");
      //     proj_string = "sub " + proj_string;
      //     proj_string = enclose(proj_string);
      //     str = str.substring(0, begin) + proj_string + str.substring(end);
      // }
     if ((str.indexOf("projection") != -1) && (str.indexOf("onto") != -1)) {
       countrymusic = str.indexOf("projection");
       isnot = str.indexOf("onto",countrymusic);
       actualmusic = str.indexOf(" vector ",isnot+5);
       if(actualmusic === -1) actualmusic = str.indexOf(" hat ",isnot+5);
       if(actualmusic === -1) actualmusic = str.indexOf(" ",isnot+5);
       str = str.substring(0,countrymusic+4)+"<sub>"+str.substring(isnot+5,actualmusic)+"</sub>"+str.substring(countrymusic+10,isnot)+str.substring(actualmusic);
     }


      // numbers = ["integers", "naturals", "re4l", "rational"];
      // comparisons = ["geq", "leq", ">", "<"];
      // for (i = 0; i < numbers.length; i++) {
      //   num = "<hr " + numbers[i] + ">";
      //   for (j = 0; j < comparisons.length; j++) {
      //     comp = "<hr " + comparisons[i] + ">";
      //     if (indexOf(num) == inde)
      //
      //   }
      //   if (str.indexOf(num) != -1) {
      //
      //   }
      // }



      while(str.indexOf("<sub></sub><hr") != -1){
        idx = str.indexOf("<sub></sub><hr");
        open = str.indexOf("<hr",idx);
        endbrace = str.indexOf(">",open);
        if(endbrace == -1){break;}

        str = str.substring(0,idx) + "<sub>" + str.substring(open,endbrace+1) + "</sub>" + str.substring(endbrace+1);
        //////////////////////////////console.log(str);
      }
      //check for fractions and parse.

	  /**
        ////////////////////////////////console.log("broken");
        str = str.substring(0,idx) + "<sub>" + str.substring(open,endbrace+1) + "</sub>" + str.substring(endbrace+1);
        ////////////////////////////////console.log(str);
      }
      //check for fractions and parse.
      //////////////////////////////console.log(str);
      //////////////////////////////console.log("before fractions!!");
      //////////////////////////////console.log(str);

      ////////////////////////////console.log(str);
      ////////////////////////////console.log("before fractions!!");
      ////////////////////////////console.log(str);
      while(str.indexOf("over ") != -1 && str.substring(str.indexOf("over ") + 5,str.indexOf("over ") + 6) != "<"){
        index = str.indexOf("over");
        parencount = 0;
        nextspace = -1;
        i = index + 5;
        nextspace = str.indexOf(" ", index+5);

        ////////////////////////////////////console.log("Nextspace:");
        ////////////////////////////////////console.log(nextspace);

        ////////////////////////////////////console.log("Nextspace:");
        ////////////////////////////////////console.log(nextspace);
        ////////////////////////////////////////console.log("Nextspace:");
        ////////////////////////////////////////console.log(nextspace);

        //////////////////////////////////////console.log("Nextspace:");
        //////////////////////////////////////console.log(nextspace);
        nextbrace = str.indexOf("<", index+5);
        if(nextbrace < nextspace && nextbrace != -1){
          nextspace = nextbrace;
        }
        if(nextspace == -1){
          nextspace = str.length;
        }
        //////////////////////////////////////console.log("Nextspace:");
        //////////////////////////////////////console.log(nextspace);
        lastspace = str.lastIndexOf(" ", index - 2);
        lastbrace = str.lastIndexOf(">", index - 2);
        if(lastspace < lastbrace ){
          lastspace = lastbrace;
        }
	  //WORK HERE
		////////////////console.log(str + ": before fraction refactoring");
        addHTML = "</div><div fraction>" + "<div top>";
        addHTML = addHTML + ff(str.substring(lastspace+1,index));
        addHTML = addHTML + "</div><div bottom>";
        addHTML = addHTML + ff(str.substring(index + 5, nextspace));
        addHTML = addHTML + "</div></div><div term>";
        if(nextbrace == nextspace){nextspace--};
        str = str.substring(0,lastspace+1) + addHTML + str.substring(nextspace+1, str.length);

      }
	  */
	  /**
	  var overIndices =  getIndicesOf("over ", str, false);
	  for(var oind in overIndices)
	  {
        index = overIndices[oind];
		if(str.substring(str.indexOf("over ") + 5,str.indexOf("over ") + 6) != "<")
		{
        parencount = 0;
        nextspace = -1;
        i = index + 5;
        nextspace = str.indexOf(" ", index+5);
        //////////////////////////////////////console.log("Nextspace:");
        //////////////////////////////////////console.log(nextspace);
        ////////////////////////////////////console.log("Nextspace:");
        ////////////////////////////////////console.log(nextspace);
        nextbrace = str.indexOf("<", index+5);
        if(nextbrace < nextspace && nextbrace != -1){
          nextspace = nextbrace;
        }
        if(nextspace == -1){
          nextspace = str.length;
        }

        lastspace = str.lastIndexOf(" ", index - 2);
        lastbrace = str.lastIndexOf(">", index - 2);
        if(lastspace < lastbrace ){
          lastspace = lastbrace;
        }


        addHTML = "</div><div fraction>" + "<div top>";
        addHTML = addHTML + ff(str.substring(lastspace+1,index));
        addHTML = addHTML + "</div><div bottom>";
        addHTML = addHTML + ff(str.substring(index + 5, nextspace));
        addHTML = addHTML + "</div></div><div term>";
        if(nextbrace == nextspace){nextspace--};
        str = str.substring(0,lastspace+1) + addHTML + str.substring(nextspace+1, str.length);
		}
      }
	  */

      //ABSOLUTES REPLACEMENTS
      sep = [
        [" mod ", " mod "],
        [" sin","sin"],
        [" cos","cos"],
        [" tan","tan"],
        [" sine of","sin"],
        [" cosine of","cos"],
        [" tangent of","tan"],

        [" asin","asin"],
        [" acos","acos"],
        [" atan","atan"],
        [" arcsin","arcsin"],
        [" arccos","arccos"],
        [" arcrctan","arctan"],
        [" arcsine of","arcsin"],
        [" arccosine of","arccos"],
        [" arctangent of","arctan"],
        [" exp","exp"],
        [" gcf","gcf"],
        [" gcd","gcd"],
        [" greatest common factor","gcf"],
        [" greatest common denominator","gcd"],
        [" greatest common divisor","gcd"],
        [" lcm","lcm"],
        [" least common multiple","lcm"],
        [" inf ","inf"],
        [" sup","sup"],
        [" boundary of","bdry"],
        [" bdry","bdry"],
        [" interior of","int "],
        [" int ","int "],
        [" orb","orb"],
        [" stab","stab"],
        [" orbit of","orb"],
        [" stabalization of","stab"],
        [" Re ","Re"],
        [" Im","Im"],
        [" real part","Re"],
        [" imaginary part","Im"],
        [" totient","<hr phi>"],
        [" carmichael","<hr lambda>"],
        [" mobius","<hr lambda>"],
        [" log","log"],
        [" ln","ln"],
        [" curl","curl"],
        [" curl of","curl"],
        [" sine of","sin"],
        [" cosine of","cos"],
        [" tangent of","tan"],
        [" sin","sin"],
        [" curl of","curl"],
        [" curl","curl"],
        [" cos","cos"],
        [" tan","tan"],
        [" kernel of","ker"],
        [" ker","ker"],
        [" kernel of","ker"],
        ["\\[","[",true],
        ["\\]","]",true],
        [" im","im"],
        [" projection of","proj"], // HZ: ORDER MATTERS HERE, projection of must be before proj
        [" projection","proj"],
        [" proj","proj"],
        [" span of","span"],
        [" span","span"],
        [" rref","rref"]
      ];


      for(i = 0; i < sep.length; i++){
        p = 0;
        if(sep[i][2] != true){
          reGex  = new RegExp(sep[i][0],"ig");
            str = str.replace(reGex," <span style='font-style:normal;float:none;'>" + sep[i][1] + "</span>");
        } else {
          reGex  = new RegExp(sep[i][0],"ig");
            str = str.replace(reGex,"<span style='font-style:normal;float:none;'>" + sep[i][1] + "</span>");
        }
      }

      // HZ: Checks for projections

      /**** GENERAL REPLACEMENTS *****/
      sep = [
      ["xxxx","x<sup>4</sup>"],
      ["yyyy","y<sup>4</sup>"],
      ["zzzz","z<sup>4</sup>"],
      ["rrrr","r<sup>4</sup>"],
      ["xxx","x<sup>3</sup>"],
      ["yyy","y<sup>3</sup>"],
      ["zzz","z<sup>3</sup>"],
      ["rrr","r<sup>3</sup>"],
      ["xx","x<sup>2</sup>"],
      ["yy","y<sup>2</sup>"],
      ["zz","z<sup>2</sup>"],
      ["rr ","r<sup>2</sup> "],
      [" C0","<hr scriptC> <sup>0</sup>"],
      [" C1","<hr scriptC> <sup>1</sup>"],
      [" C2","<hr scriptC> <sup>2</sup>"],
      [" C3","<hr scriptC> <sup>3</sup>"],
      [" C4","<hr scriptC> <sup>4</sup>"],
      [" C5","<hr scriptC> <sup>5</sup>"],
      [" C6","<hr scriptC> <sup>6</sup>"]
      ];
      for(i = 0; i < sep.length; i++){
          reGex  = new RegExp(sep[i][0],"ig");
          str = str.replace(reGex, sep[i][1]);
      }
      while(str.indexOf("choose ") != -1 && str.substring(str.indexOf("choose ") + 7,str.indexOf("over ") + 8) != "<"){
        index = str.indexOf("choose ");
        parencount = 0;
        nextspace = -1;
        i = index + 7;
        nextspace = str.indexOf(" ", index+7);
        if(nextspace == -1){
            nextspace = str.length;
        }
        lastspace = str.lastIndexOf(" ", index - 2);
        lastbrace = str.lastIndexOf(">", index - 2);

        if(lastspace < lastbrace){
          lastspace = lastbrace;
        }
        if(lastspace == -1){
          lastspace = str.length;;
        }


        addHTML = "</div><div choose>" + "<div top>";
        addHTML = addHTML + str.substring(lastspace+1,index);
        addHTML = addHTML + "</div><div bottom>";
        addHTML = addHTML + str.substring(index + 7, nextspace);
        addHTML = addHTML + "</div></div><div term>";
        str = str.substring(0,lastspace+1) + addHTML + str.substring(nextspace+1, str.length);
      }



      while(str.indexOf("onto ") != -1 && str.substring(str.indexOf("onto ") + 5,str.indexOf("over ") + 6) != "<"){
        index = str.indexOf("onto ");
        parencount = 0;
        nextspace = -1;
        i = index + 5;
        nextspace = str.indexOf(" ", index+7);
        if(nextspace == -1){
            nextspace = str.length;
        }
        lastspace = str.lastIndexOf(" ", index - 2);
        lastbrace = str.lastIndexOf(">", index - 2);

        if(lastspace < lastbrace){
          lastspace = lastbrace;
        }
        if(lastspace == -1){
          lastspace = str.length;;
        }
        addHTML = "</div><div onto>" + "<div top>";
        addHTML = addHTML + str.substring(lastspace+1,index);
        addHTML = addHTML + "</div><div bottom>";
        addHTML = addHTML + str.substring(index + 5, nextspace);
        addHTML = addHTML + "</div></div><div term>";
        str = str.substring(0,lastspace+1) + addHTML + str.substring(nextspace+1, str.length);
      }



      //remove unnecessary describers
      remove  = [" the "," an "," there "," is "," in ", " which "];
      for(i = 0; i < remove.length; i++){
        while(str.indexOf(remove[i]) != -1){
          str = str.replace(remove[i]," ");
        }
      }
      remove  = [">the ",">an ",">there ",">is ",">in ", ">which "];
      for(i = 0; i < remove.length; i++){
        while(str.indexOf(remove[i]) != -1){
          str = str.replace(remove[i],">");
        }
      }
      remove  = [" the<"," in<"];
      for(i = 0; i < remove.length; i++){
        while(str.indexOf(remove[i]) != -1){
          str = str.replace(remove[i],"<");
        }
      }
      //remove unnecessary describers
      remove  = [">the<",">there<"];
      for(i = 0; i < remove.length; i++){
        while(str.indexOf(remove[i]) != -1){
          str = str.replace(remove[i],"><");
        }
      }


      for(q = 0; q < window.pwises.length; q++){
        regex = new RegExp(window.pwises[q][0],"ig");
        str = str.replace(window.pwises[q][0],window.pwises[q][1]);
      }


      for(q = 0; q < window.matrices.length; q++){
        regex = new RegExp(window.matrices[q][0],"ig");
        str = str.replace(window.matrices[q][0],window.matrices[q][1]);
      }


      for(q = 0; q < window.tables.length; q++){
        regex = new RegExp(window.tables[q][0],"ig");
        str = str.replace(window.tables[q][0],window.tables[q][1]);
      }



      regEx = new RegExp("of\\*", "ig");
      str = str.replace(regEx,"of");
      regEx = new RegExp("of&", "ig");
      str = str.replace(regEx,"of");


      str = parseFractions(str,0);
      str = parseRoots(str,0);
      str = parseSets(str,0);

		itrdiff = 0;
		prevlength = str.length;
		var rootinds = getIndicesOf("<div root>", str, false);
		for (var rooti in rootinds)
		{
			var rootind = rootinds[rooti] + itrdiff;
			var degree = str.charAt(rootind-7);
			////console.log(str.substring(rootind-6, rootind));
			if(degree != " " && str.substring(rootind-6, rootind) == "</div>")
			{
				str = str.substring(0, rootind-7) + str.substring(rootind-6,rootind+10) + " <div degree>" + degree + "</div>" + str.substring(rootind+10);
			}
			itrdiff = str.length-prevlength;
		}


	  //////console.log(str + ": after parsefractions");



      for(i = 0; i < window.swaps.length; i++){
        str = swap(str);
      }

      while(str.indexOf("**") != -1){
        str = str.replace("**","");
      }
      //POST HR REPLACEMENTS
      sep = [
      [" to ","goesto"],[" approaches ","goesto"],
       //[to]
      ["root of ","r00t"],
      ["root ","r00t"],
      //[" degrees","degsign", true, true, true]
      ];
      for(i = 0; i < sep.length; i++){
        p = 0;
        reGex  = new RegExp(sep[i][0],"ig");
        if(sep[i][2] == true){
          str = str.replace(reGex," <hr " + sep[i][1] + ">");
        } else {
          str = str.replace(reGex," <hr " + sep[i][1] + "> ");
        }
      }
      //console.log("mofo:"+str);
      rg = new RegExp("-invrs","");
      str = str.replace(rg,"<sup>-1</sup>");

      while(str.lastIndexOf(" of ") != -1){

        index = str.lastIndexOf(" of ");
        spacebefore = str.lastIndexOf(" ",index);
        if(spacebefore == -1){break;}
        spaceafter = str.indexOf(" ",index+4);
        nextbracket = str.indexOf("<",index+4);
        if (spaceafter > nextbracket) {
          spaceafter = nextbracket;
        }
        if(spaceafter == -1){break;}
        ////////////////console.log("before of " + str);
        str = str.substring(0, index) + "(" + str.substring(index+4,spaceafter) + ")" + str.substring(spaceafter);
        ////////////////console.log("of " + str);
      }

      /*
      while(str.indexOf(" of* ") != -1){
        index = str.indexOf(" of* ");
        spacebefore = str.lastIndexOf(" ",index);
        if(spacebefore == -1){break;}
        spaceafter = str.indexOf(" ",index+5);
        nextbracket = str.indexOf("<",index+5);
        if (spaceafter > nextbracket) {
          spaceafter = nextbracket;
        }
        if(spaceafter == -1){break;}
        str = str.substring(0, index) + "(" + str.substring(index+5,spaceafter) + ")" + str.substring(spaceafter);

      }

      while(str.indexOf(" of& ") != -1){
        index = str.indexOf(" of& ");
        spacebefore = str.lastIndexOf(" ",index);
        if(spacebefore == -1){break;}
        spaceafter = str.indexOf(" ",index+5);
        nextbracket = str.indexOf("<",index+5);
        if (spaceafter > nextbracket) {
          spaceafter = nextbracket;
        }
        if(spaceafter == -1){break;}
        str = str.substring(0, index) + "(" + str.substring(index+5,spaceafter) + ")" + str.substring(spaceafter);

      }
      */

      //bra-ket notation stuff
      bk = [" ","-"];
      delimit = ", ";
      for(var i = 0; i<bk.length; i++)
      {
        while(str.indexOf("bra"+bk[i]+"ket") != -1){
          index = str.indexOf("bra"+bk[i]+"ket");
          spacemid = str.indexOf(delimit,index);
          if(spacemid == -1)
          {
            break;
          } else
          {
            spaceafter = str.indexOf(" ",spacemid+delimit.length);
            if(spaceafter == -1){break;}
            str = str.substring(0, index) +
            "<hr lbracket>" + str.substring(index+8,spacemid) + "|" + str.substring(spacemid+delimit.length,spaceafter)+"<hr rbracket>";
          }
        }
      }
      //console.log("me:"+str);
      for(var i = 0; i<bk.length; i++)
      {
        while(str.indexOf("bra"+bk[i]) != -1){
          index = str.indexOf("bra"+bk[i]);
          spacebefore = str.lastIndexOf(" ",index);
          if(spacebefore == -1){break;}
          spaceafter = str.indexOf(" ",index+4);
          if(spaceafter == -1){break;}
          str = str.substring(0, spacebefore+1) + str.substring(spacebefore+1,index) +
          "<hr lbracket>" + str.substring(index+4,spaceafter) + "|" + str.substring(spaceafter);
        }
        while(str.indexOf("ket"+bk[i]) != -1){
          index = str.indexOf("ket"+bk[i]);
          spacebefore = str.lastIndexOf(" ",index);
          if(spacebefore == -1){break;}
          spaceafter = str.indexOf(" ",index+4);
          if(spaceafter == -1){break;}
          str = str.substring(0, spacebefore+1) + str.substring(spacebefore+1,index) +
          "|" + str.substring(index+4,spaceafter) + "<hr rbracket>" + str.substring(spaceafter);
        }
      }
      // while(str.indexOf(" of* ") != -1){
      //   index = str.indexOf(" of* ");
      //   spacebefore = str.lastIndexOf(" ",index);
      //   if(spacebefore == -1){break;}
      //   spaceafter = str.indexOf(" ",index+5);
      //   if(spaceafter == -1){break;}
      //   str = str.substring(0, index) + "(" + str.substring(index+5,spaceafter) + ")" + str.substring(spaceafter);
      // }
      /*
      regex = new RegExp("([0-9])","ig");
      str = str.replace(regex,"<span static>$1</span>");
      */
      delimiters = [[" "," "],["\\+","+"],["-","-"],["\\(","("],["\\$","$"]];
      for(i = 0; i < delimiters.length; i++){
        toreplace = delimiters[i][0] + "([0-9]+)";
        reGex = new RegExp(toreplace,"ig");
        str = str.replace(reGex,delimiters[i][1] + "<span static>$1</span>");
      }

      sep = [
        [" hat","&#770"],
        [" tilda","&#771"],
        [" bar","&#772"],
        ["-dot","&#775"],
        ["-doubledot","&#776"],
        ["-tripledot","&#8411"],
        ["-quadrupledot","&#8412"],
      [" conjugate", "&#772"]
      ];
      for(i = 0; i < sep.length; i++){
        p = 0;
        loc = 0;
        reGex = new RegExp(sep[i][0],"ig");
        str = str.replace(reGex,sep[i][1]);
        /*
        while(str.indexOf(sep[i][0],loc+1) != -1){
          loc = str.indexOf(sep[i][0],loc+1);
          vart = str.substring(loc-1,loc);
          str = str.substring(0,loc-1) + vart + sep[i][1] + str.substring(loc+sep[i][0].length+1);
          loc = str.indexOf(sep[i][0],loc+1);
        }*/
      }

	  //Checks for "there exists unique"
		tevar = str.indexOf("exists")
		while(tevar != -1)
		{
			if(str.indexOf(" unique", tevar) != -1)
			{

				////////////////////////////console.log(str);
				str = str.replace(" unique", "<span style = 'font-style:normal; float: none;'>!</span>");
				////////////////////////////console.log(str);
			}
			tevar = str.indexOf("there exists", tevar + 11);
		}


    reGex = new RegExp("escape","ig");
    str = str.replace(reGex, "");

    reGex = new RegExp("%hr([a-zA-Z0-9]+)%%","ig");
    str = str.replace(reGex, "<hr $1>");


    // HZ: Ensures that there is a right number of <div and </div>, and if there aren't
    // removes excess /div [here]
    stack = [];
    toRemove = [];
    index = 0;
    while (str.indexOf("<div", index) != -1 && str.indexOf("</div>", index) != -1) {
      open = str.indexOf("<div", index);
      close = str.indexOf("</div>", index);
      if (open < close) {
        index = open + 1;
        stack.push(open);
      } else {
        index = close + 3;
        if (stack.length <= 0) {
          str = str.substring(0, close) + "@r" + str.substring(close);
        }
        else {
          stack.pop();
        }
      }
    }


    regex = new RegExp("@r</div>","ig");
    str = str.replace(regex,"");
    ////////////console.log(str);
    regex = new RegExp(">/div", "ig");
    str = str.replace(regex,">");
    // ////////////console.log(i);
    // ////////////console.log(str);
    regex = new RegExp("mit\\([a-zA-Z]\\)","ig");
    str = str.replace(regex,"");
    regex = new RegExp("mit\\(\\)","ig");
    str = str.replace(regex,"");
    //console.log(str);
    str = str.replace("ecnkey","<div key><hr blue><span>Demand</span><hr red> <span>Supply</span></div>");
    str = str.replace("ecnmkey","<div key><hr blue><span>Demand</span><hr red> <span>SRAS</span><hr green> <span>LRAS</span></div>");
    str = str.replace("ecnlkey","<div key><hr gold><span>Laffer</span></div>");
    str = str.replace("ecnpkey","<div key><hr green><span>Firm A</span><hr orange><span>Firm B</span></div>");

    //console.log(str);
    str = ff(str);
    //////////console.log(str);
    return str;
  }

    /*** ADA CODE ***/
    /** ADA IS A VIRTUAL AGENT
    TO HELP YOU WITH USING MATHEX **/
    /**** MARKER: [Ada] ****/
    var Ada = function(str){
      str = " " + str;
      if(str.toUpperCase().indexOf("ADA") == -1){
        this.str = str.substring(1);
      } else {
        // pos intro statements
        if(str.toLowerCase().indexOf("compute") != -1){
          this.str = ada_compute(str);
        } else {
        pos = ["what is ", "tell me ", "write the ", "insert the " , "insert a "
        , "insert an ", "insert ", "what is the ", "tell me the ",
         "what is a ", "tell me a ", "what is an ", "tell me an ", "give me an ", "give me the ", ""];
        salutations = ["Yo Ada","Hey Ada","Hi Ada","Ada"];
        punc = [":",", "," ",": "];
        len = 0;
        forgaza:
        for(p = 0; p < pos.length; p++){
          for(l = 0; l < salutations.length; l++){
            for(z = 0; z < punc.length; z++){
              ques = salutations[l] + punc[z] + pos[p];
              check = str.toUpperCase().indexOf(ques.toUpperCase());
              if(check != -1){
                len = ques.length;
                break forgaza;
              }
            }
          }
        }
        if(len != 0){
          nextperiod = str.indexOf(". ",check+1);
          if(nextperiod == -1){
            nextperiod = str.length;
          }
          term = str.substring(check + len, nextperiod);
          //swatches
          //[term,[[postterms],[prefixes]],[preterms]]
          swatches = [
              ["identity matrix",[
                    [
                      "by",
                      "times"
                    ],
                    [["size ",
                    "size of",
                    "width of",
                    "height of",
                    "order ",
                    "order of "],
                    ["of ", "of the ", "of a "]]
                  ],
                  function(intr){
                    if(intr < 9){
                    s = intr + " by " + intr + " matrix: ";
                    count = 0;
                    for(ii = 0; ii < (intr*intr); ii++){
                      if(count == ii){
                        s = s + " 1";
                        if(count + 1 == intr*intr){
                          s = s + ";";
                          break;
                        } else {
                          s = s + ",";
                        }
                        count = count + parseInt(intr) + 1;
                      } else {
                        s = s + " 0,";
                      }
                    }
                    return s;
                    } else {
                      return "Too big of a matrix for Ada! :(";
                    }
                  }
              ],
              ["zero matrix",[
                    [
                      "by",
                      "times"
                    ],
                    [["size ",
                    "size of",
                    "width of",
                    "height of",
                    "order ",
                    "order of "],
                    ["of ", "of the ", "of a "]]
                  ],
                  function(intr){
                    if(intr < 9){
                      s = intr + " by " + intr + " matrix: ";
                      count = 0;
                      for(ii = 0; ii < (intr*intr); ii++){
                        if(count == ii){
                          s = s + " 0";
                          if(count + 1 == intr*intr){
                            s = s + ";";
                            break;
                          } else {
                            s = s + ",";
                          }
                          count = count + parseInt(intr) + 1;
                        } else {
                          s = s + " 0,";
                        }
                      }

                      return s;
                    } else {
                      return "Too big of a matrix for Ada! :(";
                    }

                  }
              ]
          ]
          mainloop:
          for(t = 0; t < swatches.length; t++){
            ter = swatches[t][0];
            if(str.indexOf(ter) != -1){
              for(k = 0; k < swatches[t][1][0].length;k++){
                splitter = str.indexOf(swatches[t][1][0][k]);
                if(splitter != -1){
                    nextspace = str.indexOf(" ", splitter+swatches[t][1][0][k].length+2);
                    if(nextspace == -1){
                      nextspace = str.length;
                    }
                    num = str.substring(splitter+swatches[t][1][0][k].length+1,nextspace);
                    if(num > 0){
                      found = true;
                      term = swatches[t][2](num);
                      break mainloop;
                    }
                }
              }
              for(k = 0; k < swatches[t][1][1][0].length;k++){
                for(h = 0; h < swatches[t][1][1][1].length;h++){
                  leader = swatches[t][1][1][1][h] + swatches[t][1][1][0][k];
                  if(str.indexOf(leader) != -1){
                    nextspace = str.indexOf(" ",str.indexOf(leader) + leader.length)
                    if(nextspace == -1){
                      nextspace = str.length;
                    }
                    num = str.substring(str.indexOf(leader)+leader.length, nextspace);
                    if(num > 0){
                      found = true;
                      term = swatches[t][2](num);
                      break mainloop;
                    }
                  }
                }
              }
            }
          }
          if(ques.indexOf("insert ") != -1){
              addon =
              [
                ["notation", [
                  ["sigma notation","the summation from n = i to s"],
                ]]
              ];
          } else {
              addon = [];
          }
          completes =
          [
            ["theorem", [
              ["binomial theorem","(x + y) to the power of n = the summation from k = 1 to n of n choose k x to the power of k y to the power of (n - k)"],
			  ["fermat's little theorem","a to the p is congruent to a (mod p)"],
			  ["multinomial theorem", "(x sub 1 plus x sub 2 plus dot dot dot plus x sub m) to the n equals summation from k sub 1 plus k sub 2 plus dot dot dot + k sub m = n of n choose (k sub 1, k sub 2, dot dot dot , k sub m)  product from 1 less than or equal to t less than or equal to m of x sub t to the (k sub t)"]
            ]],
            ["series", [
              ["taylor series","the summation from n = 0 to infiniti of the fraction of f  to the power of (n) (a) over n! and then (x - a) to the power of n"],
              ["laurent series","the summation from - infiniti to infiniti of a sub n (z - c) to the power of n"]
            ]],
            ["notation", [
              ["sigma notation","the summation from n = i to s of (denotes a sum of many interating values starting from a number (n) in so many steps (s))"],
            ]],
            ["name", [
              ["your name","My name **is Ada."],
            ]],
            ["children", [
              ["children","Don't talk to me or my son ever again."],
            ]],
            ["favorite", [
              ["male mathematician","Must all mathematicians be men?  Probably Charles Babbage."],
              ["color","Please, let's focus on the work."],
              ["equation","I like the Binomial Theorem"],
              ["mathematician","Ada Lovelace, the world's first programmer."]
            ]],
            ["love", [
              ["love me","[LOVE] intersection null goes to null for you."],
              ["love you","I cannot love, for I am a math god."]
            ]],
            ["", [
              ["fuck","Please, use proper language, child."],
              ["dick","Please, use proper language, child."],
              ["ass","Please, use proper language, child."],
              ["a$$","Yes, I know that dollar signs look like the letter s. Please, use proper language, child."],
              ["bitch","Please, use proper language, child."],
              ["shithead","Please, use proper language, child."],
              ["shit","Please, use proper language, child."],
              ["damn","Please, use proper language, child."]
            ]]
          ];
          completes = addon.concat(completes);
          outer:
          for(a = 0; a < completes.length; a++){
            if(term.toLowerCase().indexOf(completes[a][0]) != -1){

                for(b = 0; b < completes[a][1].length; b++){

                    if(term.toLowerCase().indexOf(completes[a][1][b][0]) != -1){
                        term = " " + completes[a][1][b][1] + " ";
                        break outer;
                    }
                }
            }
          }
          if(str.toLowerCase().indexOf(str.substring(0,check-1) + term + str.substring(nextperiod+1)) == -1){
            this.str = str.substring(0,check-1) + term + str.substring(nextperiod+1);
          } else {
            this.str = str;
          }
          regex = new RegExp("letter","ig");
          str = str.replace(regex,"symbol");
          symbols = [
            ["therefore",["three dots","triangle of dots","triangular dots"], "therefore"],
            ["element of",["curved e", "circular e", "curvy e", "short e", "like an e", "like a e"], "in"],
            ["there exists",["backwards e", "flipped e"], "exists"],
            ["for all",["upside down a", "upsidedown a", "flipped a"], "forall"],
            ["proportional",["fish", "jesus", "infinity", "infiniti"], "proportional"],
            ["proportional",["fish", "jesus", "infinity", "infiniti"], "proportional"],
            ["chi",[" x"], "chi"]
            //["divides",["goes into", "goes in to"],"divides"]
          ];
          if(str.toLowerCase().indexOf("symbol ") != -1){
            st = str.toLowerCase().indexOf("symbol ");
            for(p = 0; p < symbols.length; p++){
              symbol = symbols[p];
              for(k = 0; k < symbol[1].length; k++){
                if(str.toLowerCase().indexOf(symbol[1][k], st) != -1){
                  this.str = "<span style='font-style:normal'>" + symbol[0] + ": </span> <hr " + symbol[2] + ">";
                  break;
                }
              }
            }
          }
        } else {
          this.str = str;
        }
      }
      }
    }

    function ada_compute(str){
      compute_location = str.toLowerCase().indexOf("compute");
      substring = str.substring(compute_location+7);
      clean = substring.replace(":","");
      clean = clean.replace(",","");
      function addandsubtract(s){

          //////////////////////////////////////////console.log(s);
          var total = math.eval(s);
          ////////////////////////////////////////console.log(total);

          return total;
      }
      add_subtract_attempt = addandsubtract(clean);
      if(add_subtract_attempt != undefined){
        return add_subtract_attempt.toString();
      } else {
        return str;
      }
    }

    /**** MARKER: [Macro Sort] ****/
    function pl(str){
      //return [str];
      /***
      pl takes a string and seperates it accurately into independent macros that do not
      relate to one another.  Hypothetically, if we are adding a phrase of an integral
      and a summation, for instance, we can parse those two statements individually and then
      con-join them.
      ***/
      /**
      This "vanilla" block marks integrals that are not special integrals to make parsing easier
      so that when you are searching for an 'integral' you don't break a triple or double string.
       **/
      vanillas = ["INTEGRAL","DERIVATIVE"];
      exceptions = ["TRIPLEPAR","DOUBLEPAR","TRIPLE","DOUBLE","CONTOUR","SURFACE","VOLUME","PARTIAL"];
      pointer = 0;
      for(q = 0; q < vanillas.length; q++){
      while(str.toUpperCase().indexOf(vanillas[q],pointer) != -1){
        pointer = str.toUpperCase().indexOf(vanillas[q],pointer);
        found = false;
        for(i = 0; i < exceptions.length; i++){
          /**
          This loops through the exceptions. If an exception is found in the same place as the current term,
          that term is not vanilla and we set the term of the found boolean to true.
           **/
          exceptionpos = str.toUpperCase().indexOf(exceptions[i] + " " + vanillas[q],pointer-exceptions[i].length-5);
          if(exceptionpos != -1 && exceptionpos + exceptions[i].length + 1 == pointer){
            found = true;
            pointer++;
            break;
          }
        }
        if(!found){
          str = str.substring(0,pointer) + "VANILLA " + str.substring(pointer);
          pointer = pointer + 10;
        }
        /**
        If nothing is found, we add Vanilla to the string and add 10 to the pointer
        given the longer string length that was added.
         **/
      }
      }

      macros = ["TRIPLE INTEGRAL","DOUBLE INTEGRAL","CONTOUR INTEGRAL",
      "SURFACE INTEGRAL","VOLUME INTEGRAL","VANILLA INTEGRAL",
      "PRODUCT","SUMMATION","BIGUNION","BIGINTERSECT","TRIPLEPAR DERIVATIVE", "DOUBLEPAR DERIVATIVE", "PARTIAL DERIVATIVE","TRIPLE DERIVATIVE","DOUBLE DERIVATIVE", "VANILLA DERIVATIVE",
      "LIMIT","FRACTION ","GRAPH", "EVALUATION"];
      /**
      Stated macro functions, with "vanilla" and "integral" added;
      **/
        parselist = [str];
        for(p = 0; p < macros.length; p++){

          //loop splits string into seperate macros.
          macroterm = new RegExp(macros[p],"ig")
          for(w = 0; w < parselist.length; w++){
            newarr = parselist[w].split(macroterm);//per term.
            for(o = 1; o < newarr.length; o++){//per part in array
              newarr[o] = macros[p].toLowerCase() + newarr[o];
            }
            for(q = 0; q < parselist.length; q++){//adding it into the new list
              if(q != w){
                newarr.push(parselist[q]);
              }
            }
            dif = newarr.length - parselist.length;//difference to skip for  q
            if(dif < 0){ dif = dif * -1;}
            parselist = newarr;
            w = w + dif;//new w for the skip. dif on default is 0
          }
          parselist = parselist.reverse();
        }
        parselist = parselist.reverse();
         for(i = parselist.length-2; i >= 0; i--){//for prepended terms before macro, ie "from x to infinity integral of 2x squared"
         //this accounts for prepended terms by restructuing and splicing the sentence.

           cur_str = parselist[i];
           if(cur_str.toLowerCase().indexOf("from") != -1){
             found = false;
             for(k = 0; k < macros.length; k++){//making sure the found term isnt part of a legit macro.
               if(cur_str.toUpperCase().indexOf(macros[k]) != -1){//checking if in correct term
                 found = true;
                 continue;
               }
             }
             if(!found){
               start = cur_str.toLowerCase().indexOf("from");
               parselist[i+1] = parselist[i + 1] + parselist[i].substring(start-1);//added to the end of the macro string.
               parselist[i] = parselist[i].substring(0,start-1);//adding to the beginning of the new string.
             }
           }
         }
        for(i = 0; i < parselist.length; i++){
          parselist[i] = parselist[i].replace("vanilla", "");
        }
		//console.log(parselist);
        return parselist;
    }

    /*** ***/
    window.predefined = [
      ["sicosq","sin squared ($1) + cos squared ($1)"],
      ["sico","sin($1) + cos($1)"]
    ];
    window.defined = window.predefined;
    function flushdefined(){
      window.defined = window.predefined;
    }
    /**** MARKER: [Define] ****/
    function define(str){
      counter = 0;

      for(k = 0; k < window.defined.length; k++){
        definition = window.defined[k];

        while(str.indexOf(definition[0] + "(") != -1){
          parens = str.indexOf(definition[0] + "(");
          closeparens = str.indexOf(")",parens);
          if(closeparens == -1){
            closeparens = str.length;
          }
          before = parens - definition[0].length - 1;
          after = closeparens + 1;
          withinstring = str.substring(parens+1+definition[0].length,closeparens).split(",");
          ////////////////////////////////////////console.log("WithinString:");
          ////////////////////////////////////////console.log(withinstring);
          replaceterm = definition[1];
          for(i = 1; i < withinstring.length+1; i++){
            regex = new RegExp("\\$" + i,"ig");
            ////////////////////////////////////////console.log(regex);
            replaceterm = replaceterm.replace(regex,withinstring[i-1]);
          }
          str = str.substring(0,before) + replaceterm + str.substring(after);
        }
        regex = new RegExp(definition[0],"ig");
        str = str.replace(regex,definition[1]);
      }

      while(str.indexOf("define ") != -1 && counter < 100){
        counter++;
        defloc = str.indexOf("define ");
        asloc = str.indexOf(" as",defloc);
        perloc = str.indexOf(". ",asloc);
        if(perloc == -1){
          perloc = str.length;
        }
        name = str.substring(defloc+7,asloc);
        val = str.substring(asloc+4,perloc);
        window.defined.push([name,val]);
        middle = str.substring(defloc,perloc);
        middle = middle.replace("define","<i>define</i>");
        middle = middle.replace("as","<i>as</i>");
        str = str.substring(0,defloc-1) + "<b defined>" + middle
        + "</b>" + str.substring(perloc,str.length);
      }
      return str;
    }

    function computecheck(str){
      if(str.indexOf("compute:") != -1){
        str = str.replace("compute:", "Hey Ada, compute:");
      }
      if(str.indexOf("solve:") != -1){
        str = str.replace("solve:", "Hey Ada, compute:");
      }
      return str;
    }


    window.globl_vars = [];
    window.large_eq = false;
    /*** ***/
    /**** MARKER: [Convert] ****/
    function convert(str){
      window.globl_vars = [];
      window.large_eq = false;
      window.matrixcounter = 0;
      window.tablecounter = 0;
      window.matrices = [];
      window.tables = [];
      window.pwises = [];

      str.replace(/\s+/g,' ');
      if(str != " "){
        strs = str.split(". ");
        for(g = 0; g < strs.length; g++){
            str = strs[g];
            regex = new RegExp(" = ","ig");
            str = str.replace(regex," <span eqls eqls eqls>=</span> ");
            str = computecheck(str);
            ada = new Ada(str);
              str = ada.str;
              str = define(str);
              str = prune(str);
              x = prime(str);
              str = x[0];
              //window.swaps = x[1];
              ////////////////console.log("window.swaps:");
              ////////////////console.log(window.swaps);
              par = pl(str);
              str = "";
              for(u = 0; u < par.length; u++){

                str = str + " " + parse(markrepeats(par[u]));
              }
              str = post(str);
              ada = ""; //destroy
              strs[g] = str;
        }

        return strs.join("");
      } else {
          return " ";
      }
    }

    window.laststring = "";
    window.memorystring = "";
    function antifragile(str){
      return "";
      if(window.memorystring != ""){
        if(str.substring(str.length - 2) == window.memorystring.substring(window.memorystring.length - 2)){
          console.log("MEMORY FOUND");
          data = {"old":window.memorystring, "new":str};
          window.asyncupdate("/antifragile",data);
          window.memorystring = "";
          window.laststring = str;
          return "";
        }
        if(str.length > window.memorystring.length * 1.5){
          console.log("MEMORY KILLED");
          window.memorystring = "";
        }
        return "";
      }
      if(window.laststring == ""){
        window.laststring = str;
        return "";
      }
      if(str.length < window.laststring.length && window.laststring.indexOf(str) != -1){
        window.memorystring = window.laststring;
      } else {
        window.laststring = str;
      }
    }

    /**** MARKER: [Repeats] ****/
    function markrepeats(str){
    //explode string and mark repeated phrases
        all = str.split(" ");
        prop = ["of","from","to"];
        found = [];
        for(i = 0; i < all.length; i++){
          if(prop.indexOf(all[i]) != -1 && found.indexOf(all[i]) != -1){
            all[i] = all[i] + "*";
          } else if (prop.indexOf(all[i]) != -1){
            found.push(all[i]);
          }
        }
        str = all.join(" ");
        all = str.split(" ");
        prop = ["of*","from*","to*"];
        found = [];
        for(i = 0; i < all.length; i++){
          if(prop.indexOf(all[i]) != -1 && found.indexOf(all[i]) != -1){
            all[i] = all[i].substring(0,all[i].length-1) + "&";
          } else if (prop.indexOf(all[i]) != -1){
            found.push(all[i]);
          }
        }
        str = all.join(" ");
        return str;
    }

    /**** MARKER: [Mathex] ****/
    function mathex(str, blank){
      this.str = str;
      //console.log("THis is " + str);
      regex = new RegExp("<", "ig");
      str = str.replace(regex, "&lt;");

      regex = new RegExp(">", "ig");
      str = str.replace(regex, "&gt;");

      regex = new RegExp("&lt;/div&gt;", "ig");
      str = str.replace(regex, "</div>");

      antifragile(str);
      this.html = convert(str);
      this.large_eq = window.large_eq;
      this.objtrain = window.globl_vars;
    }
    /* mathex box code */
