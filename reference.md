https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Usar_promesas leer y entender
https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Promise es solo la referencia, ver then y catch

https://nodejs.org/api/querystring.html para parsear url de toc toc

https://developer.mozilla.org/es/docs/Web/API/Document document arbol DOM

https://code.tutsplus.com/es/tutorials/the-30-css-selectors-you-must-memorize--net-16048 selectores css


//async/await
async function getPageAsyncAwait () {
    try {
        const page = await browser.newPage();
        return page;
    } catch (err) {
        console.log(err)
        return err
    }
}

const page = await getPageAsyncAwait()
console.log(page)





//promesas
function getPagePromises () {
    return browser.newPage()
}

let page; // t: 1

getPagePromises() // t: 2  -> 3 seg se demora en ejecutar
    .then((p) => { // t: 5 si es que el resultado es satisfactorio
        page = p //
    })
    .catch((err) => { // t: 5 si es que el resultado es rechazado
        console.log(err)
    })

console.log(page) // t: 3
