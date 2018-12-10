/****************************************************************************************
* Распечатать все правила из файла productionsTable для курсача.json
*/
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

/****************************************************************************************
* Распечатать все нетерминалы из файла productionsTable для курсача.json
*/
function printNontermsTable()
{
    var config = getDataFromServer("productionsTable для курсача.json");
    var nonterm_arr = [];
    for (nonterm in config)
        nonterm_arr.push(nonterm);

    console.log(nonterm_arr.join(", "));

}

/****************************************************************************************
* Распечатать все терминалы из файла productionsTable.json
*/
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

/****************************************************************************************
* Выдать переданное дерево в виде строки (нужно для вывода его на экран)
*/
function getStringTree(tree)
{
    return recursiveStrTree(tree[0]);

    function recursiveStrTree(node)
    {
        var text = "";
        if (node !== undefined)
        {
            if (node.body == [])
                text += node.type + "(ε)";
            else if (node.type == '(')
                text += '❲'; // технически, это не скобка, так что парсер на основе скобок работает корректно
            else if (node.type == ')')
                text += '❳';
            else if (node.type == "id" || node.type == "const")
                text += node.body[1];
            else if (typeof(node.body)=="string")
                text += node.type;
            else if (typeof(node.body) == "object")
            {
                text += node.type + '(' + recursiveStrTree(node.body[0]);

                if (node.body[1])
                {
                    for (key in node.body)
                    {
                        if (key!=0)
                            text += ", " + recursiveStrTree(node.body[key]);
                    }
                }
                text += ')';
            }
        }
        return text;
    }
}

/****************************************************************************************
* Упрощенная форма вызова парсера, принимает только флаги
*/
function parseThis(PRINT_PROCESS_OF_DERIVATION = true, OUTPUT_DERIVATION = false , PRINT_TERMINALS = false, PRINT_EPSILONS = false)
{
    return parser(lexer(document.querySelector('code.language-js'),"lex_table.json")[0],
    "productionsTable.json",
     PRINT_PROCESS_OF_DERIVATION,
     OUTPUT_DERIVATION,
     PRINT_TERMINALS,
     PRINT_EPSILONS);
}

/****************************************************************************************
* Возвращает строку с процессом вывода данного кода
*/
function getDerivation()
{
    return parseThis(false, true, false, true)[1].replace(/@(.*?)@/g, "<$1>");
}

/****************************************************************************************
* Возвращает код дерева в svg формате
*/
function getTreeAsText()
{
    return document.getElementById('run_out_id').innerHTML;
}