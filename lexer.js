function lexer(elementWithCode, configURL) 
{
    var codeText = elementWithCode.textContent;
    var config = getDataFromServer(configURL);
    var tokenList = [];
    var arrayOfConst = [];
    var arrayOfIdent = [];
    var cnstIndex = 0;
    var idIndex = 0;
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
                            if (config[key].link == "arrayOfIdent")
                            {
                                if (arrayOfIdent.includes(match))
                                { // если слово уже есть в массиве, добавляем ссылку на него
                                    match = [key, arrayOfIdent[arrayOfIdent.indexOf(match)]]
                                }
                                else
                                { // иначе добавляем его в массив и добавляем ссылку на него
                                    arrayOfIdent.push(match);
                                    match = [key, arrayOfIdent[idIndex]]
                                    idIndex++;
                                }
                            }
                            if (config[key].link == "arrayOfConst")
                            {
                                if (arrayOfConst.includes(match))
                                {
                                    match = [key, arrayOfConst[arrayOfConst.indexOf(match)]]
                                }
                                else
                                {
                                    arrayOfConst.push(match)
                                    match = [key, arrayOfConst[cnstIndex]]
                                    cnstIndex++;
                                }
                            }
                            
                        }
                        // добавить элемент в массив
                        tokenList.push(match);
                        break;
                    }
                }
            }
        }
    }
    if (ErrorList.length == 0)
        return [tokenList, arrayOfIdent, arrayOfConst];
    else
    {
        console.log(ErrorList);
        return "Found errors.";
    }
}