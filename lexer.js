/********************************************************************************
По конфигурационному файлу с шаблонами лексем и элементу страницы, содержащему текст, выдать массив лексем, идентификаторов и констант


elementWithCode – элемент страницы, содержащий код

configURL – адрес, по которому брать файл с грамматикой
*/
function lexer(elementWithCode, configURL) 
{
    var codeText = elementWithCode.textContent;
    var config = getDataFromServer(configURL);
    var output = {tokenList:[], arrayOfConst:[], arrayOfIdent:[]};
    var indexes = {cnstIndex: 0, idIndex: 0}
    var match;
    var ErrorList = [];
    while (codeText)
    {
        for (const key in config) 
        {
            match = codeText.match(config[key].regexp);
            
            if (match)
            {
                match = match[0];
                // слово совпало с регуляркой, обрабатываем
                // если дошли до ключа error, значит, слова нет в словаре
                if (key === "error")
                {
                    if (ErrorList.length >= 50)
                    {
                        console.log(ErrorList);
                        console.log("Too many errors, stopping lexer.");
                        return "Found errors.";
                    }
                    else
                    {
                        codeText = codeText.replace(config[key].regexp, "");
                        ErrorList.push(match)
                        break;
                    }
                }
                // проверяем, чтобы слово находилось в списке нужных слов, либо чтобы этого списка не было
                var IsInList = (!(config[key].list)) || ((config[key].list) && (config[key].list).includes(match));
                if (!IsInList)
                {
                    // нет в списке нужных слов, пропускаем
                    continue;
                }
                else
                {
                    codeText = codeText.replace(config[key].regexp, "");

                    // если установлен флаг skip, то не добавляем в массив
                    if (config[key].skip == true || ErrorList.length > 0)
                        break;
                    else
                    {
                        // если есть link, добавляем слово туда
                        if (config[key].link)
                        {
                            // добавить match в массив идентификаторов или констант
                            // добавить в массив лексем указатель на match в массиве ид-ов или констант
                            if (config[key].link == "arrayOfConst" || config[key].link == "arrayOfIdent")
                            {
                                var link = config[key].link;
                                if (!output[link].includes(match))
                                {
                                    // иначе добавляем его в массив и добавляем ссылку на него
                                    output[link].push(match)
                                    indexes[link]++;
                                }
                                match = [key, output[link][output[link].indexOf(match)]]
                            }
                        }
                        // добавить элемент в массив
                        output.tokenList.push(match);
                        break;
                    }
                }
            }
        }
    }
    if (ErrorList.length != 0)
    {
        console.log(ErrorList);
        return "Found errors.";
    }
    else
    {
        return output;
    }
}