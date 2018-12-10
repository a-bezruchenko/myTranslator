/***************************************************************************************
Получить JSON-файл по указанному адресу

parseJSON – парсить ли файл
*/
function getDataFromServer(url, parseJSON = true) 
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status === 200) 
    {
        if (parseJSON)
        {
            try 
            {
                return (JSON.parse(xhr.responseText, 
                    function (key, value)
                    {
                        if (key === "regexp")
                                return new RegExp(value);
                        else
                            return value;
                    }
                ));
            } 
            catch (error) 
            {
                console.error('Ошибка при попытке распарсить JSON-файл: ', error);
            }
        }
        else
        {
            return (xhr.responseText);
        }
    }
    else 
    {
        console.error('Ошибка при запросе к серверу: ',xhr.status);
    }
}