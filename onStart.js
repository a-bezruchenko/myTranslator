window.onload = start;

function start()
{
    console.log(parser(lexer(document.querySelector('code.language-js'),"lex_table.json")[0],"productionsTable.json"))
}

function printProductionTable ()
{
    var config = getDataFromServer("productionsTable для курсача.json");
    var out_message = "";
    for (nonterm in config)
    {
        var product = config[nonterm];
        var temp_string = "";
        temp_string = temp_string + nonterm + ' ::= ';
        var temp = [];
        for (needed_term in product)
        {
            if (!product[needed_term] || needed_term =="EMPTY PRODUCTIONS")
            {
                if (temp_string.indexOf("ε")==-1)
                    temp.push("ε");
            }
            else if (temp_string.indexOf(product[needed_term].join(" "))==-1)
                temp.push(product[needed_term].join(" "))
        }
        temp_string += temp.join(" | ");
        out_message += temp_string + "\n";
    }
    console.log(out_message);
}

function printNontermsTable()
{
    var config = getDataFromServer("productionsTable для курсача.json");
    var nonterm_arr = [];
    for (nonterm in config)
        nonterm_arr.push(nonterm);

    console.log(nonterm_arr.join(", "));

}

function printTermsTable()
{
    var config = getDataFromServer("productionsTable.json");
    var term_arr = [];
    for (nonterm in config)
    {
        for (needed_term in config[nonterm])
        {
            for (key in config[nonterm][needed_term])
            {
                var term = config[nonterm][needed_term][key];
                if (term_arr.indexOf(term)==-1 && term[0]!='@')
                {
                    term_arr.push(term);
                } 
            }
        }
    }
    console.log(term_arr.sort().join(" "));
}

function getStringTree()
{
    var tree = parser(lexer(document.querySelector('code.language-js'),"lex_table.json")[0],"productionsTable.json");
    
    return recursiveStrTree(tree[0]);

    function recursiveStrTree(node)
    {
        var text = "";
        if (node !== undefined)
        {
            text += node.type;
            if (typeof(node.body) == "object")
            {
                text += '(' + recursiveStrTree(node.body[0]);

                if (node.body[1])
                {
                    for (key in node.body)
                    {
                        text += ", " + recursiveStrTree(node.body[key]);
                    }
                }
                text += ')';
            }
        }
        return text;
    }
}