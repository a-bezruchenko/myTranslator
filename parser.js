// todo:
// доделать case
// сделать возможность вызывать функции и писать выражения типа i := fun(i);


function parser(arrayOfTokens, configURL)
{
    var config = getDataFromServer(configURL);
    var start = ["@программа@"];
    var currentIndex = 0;
    var output = [];

    const PRINT_PROCESS_OF_DERIVATION = true; // печатать ли процесс вывода
    const PRINT_TERMINALS = false; // если равен false, то вывод терминалов не печатается

    function startRecursiveParse(stack) {
        var currentStackSymbol;
        var currentToken;
        var localAst = [];
        while (stack.length) {

            currentToken = arrayOfTokens[currentIndex];
            currentStackSymbol = stack.pop();

            if (currentStackSymbol[0]!='@') {// если текущий символ – терминал                     
                if (currentToken == currentStackSymbol ||
                    currentToken[0] == 'ident' && currentStackSymbol == 'id'||
                    currentToken[0].match(/.*?_const/) && currentStackSymbol == 'const')
                    {
                        if (PRINT_PROCESS_OF_DERIVATION && PRINT_TERMINALS)
                        {
                            if (currentToken != currentStackSymbol)
                                output.push(currentStackSymbol + " -> " + currentToken[1]);
                            else 
                                output.push(currentToken);
                        }
                        currentIndex += 1;
                        localAst.push({"type" : currentStackSymbol,
                            "body" : currentToken});
                    }
                else {
                    console.log("Ошибка: неожиданный терминал: "  + currentStackSymbol + 
                    ",хотя должен был быть: " + currentToken);
                    console.log("Содержимое стека: " + stack);
                    console.log("Остаток массива токенов: " + arrayOfTokens.slice(currentIndex, -1));

                    console.log("Текущий индекс: ", currentIndex);
                    throw 0;
                }
            }
            else {// текущий символ – нетерминал
                if (currentToken[0] == 'ident')
                    currentToken = 'id';
                    
                if (currentToken[0].match(/.*?_const/))
                    currentToken = 'const';

                if (config[currentStackSymbol] !== undefined) {
                    if (config[currentStackSymbol][currentToken] !== undefined) 
                    {
                        var production = config[currentStackSymbol][currentToken];

                        if (PRINT_PROCESS_OF_DERIVATION)
                            output.push(currentStackSymbol + " -> " + production.join(" "));

                        if (typeof(production) == 'object') 
                        {
                            // копируем массив продукций
                            // без этого массив правил будет изменяться
                            production = production.slice();

                            var newStack = [];
                            while (production.length)
                                newStack.push(production.pop());

                            localAst.push({"type" : currentStackSymbol,
                                            "body" : startRecursiveParse(newStack)});

                        }
                        else {
                            console.log("Ошибка: неверное правило. Правая часть не является массивом: " + currentStackSymbol + " " + production);
                            throw 2;
                        }
                    }
                    else if (config[currentStackSymbol]["EMPTY PRODUCTIONS"] !== undefined && 
                            config[currentStackSymbol]["EMPTY PRODUCTIONS"].indexOf(currentToken)!=-1)
                    {
                        if (PRINT_PROCESS_OF_DERIVATION)
                            output.push(currentStackSymbol + " ->   ");
/*
                        var newStack = [];

                        localAst.push({"type" : currentStackSymbol,
                            "body" : startRecursiveParse(newStack)});*/
                    }
                    else {                
                        console.log("Ошибка: для сочетания терминала и нетерминала не задано правило: " + currentToken + " " + currentStackSymbol);
                        throw 3;
                    }
                }
                else {
                    console.log("Ошибка: не удается найти правило для нетерминала: " + currentStackSymbol);
                    throw 4;
                }  
            }
        }
        if (currentIndex > arrayOfTokens.length) throw 5;
        return localAst;
    }

    try {
        if (PRINT_PROCESS_OF_DERIVATION)
            console.log("Вывод данной цепочки:");
        var ast = startRecursiveParse(start);
    }
    catch (error) {
        ast = error;
    }
    if (PRINT_PROCESS_OF_DERIVATION)
        console.log(output.join("\n"));
    return ast;
}