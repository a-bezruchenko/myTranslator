window.onload = start;

function start()
{
    console.log(parser(lexer(document.querySelector('code.language-js'),"lex_table.json")[0],"productionsTable.json",
    true, false, false))

    console.log(generateCode());
}