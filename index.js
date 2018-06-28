const puppeteer = require('puppeteer')
const querystring = require('querystring')
const fs = require('fs')

//recieve this value from cli param
const propType = process.argv[2]
const query = process.argv[3]

const params = {
	animacion: false,
	atributos: '',
	banos: 0,
	buscando: false,
	casaDepto: undefined,
	comuna: '',
	dibujaPoligono: false,
	dormitorios: 0,
	esPrimeraBusqueda: false,
	idZonaHomogenea: 0,
	idle: true,
	moneda: 'UF',
	ordenarDesc: false,
	ordenarPorMoneda: 'UFCLP',
	ordernarPorFechaPublicacion: false,
	ordernarPorPrecio: false,
	ordernarPorSuperficie: false,
	pagina: 1,
	precioDesde: 0,
	precioHasta: 0,
	resetMapa: false,
	superficieDesde: 0,
	superficieHasta: 0,
	textoBusqueda: 'santiago',
	tipoArriendo: false,
	tipoUltimasVentas: false,
	tipoVentaNuevo: false,
	tipoVentaUsado: true,
	tipoVista: 'mapa',
	viewport: '-34.179174753640794,-74.09059408474678,-32.3210778161376,-67.05938700009102',
	vuelveBuscar: false,
	region: '',
	zoom: 14,
}

function ConvertToCSV (objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	var str = '';

	for (var i = 0; i < array.length; i++) {
		var line = '';
		for (var index in array[i]) {
			if (line != '') line += ','

			line += array[i][index];
		}

		str += line + '\r\n';
	}

	return str;
}

async function toctoc () {
  try {
		// TODO: add support tu manage page's number
		// console.log('Extrayendo información. Página 1 de XX')

		// // const url = 'https://www.toctoc.com/'
		// // const url = 'https://www.toctoc.com/Search/Index/?param={Default:false}{estado:Nueva%20Usada}{comuna:Santiago}{region:Regi%C3%B3n%20Metropolitana}{superficieFD:null}{precioFH:null}{moneda:null}{dormitoriosFD:null}{dormitoriosFH:null}{banosFD:null}{banosFH:null}{latitud:-33.4488897}{longitud:-70.6692655}{viewport:-33.6741885,-70.83288190000002,-33.2713874,-70.4267807}{EsBusquedaTexto:true}{tv:m}{ecn:true}{ecu:true}{EsBusquedaValida:true}{tp:0}{textoBusqueda:santiago}'
		// // const url = 'https://www.toctoc.com/search/index2/?dormitorios=0&banos=0&superficieDesde=0&superficieHasta=0&precioDesde=0&precioHasta=0&moneda=UF&tipoArriendo=false&tipoVentaUsado=true&tipoVentaNuevo=true&tipoUltimasVentas=false&casaDepto=undefined&ordenarPorMoneda=UFCLP&ordenarDesc=false&ordernarPorFechaPublicacion=false&ordernarPorSuperficie=false&ordernarPorPrecio=false&pagina=1&textoBusqueda=santiago&tipoVista=lista&viewport=-34.2878148%2C-71.70881020000002%2C-32.919451%2C-69.76899430000003&comuna=Santiago&region=Regi%C3%B3n%20Metropolitana&atributos=&idle=false&zoom=14&buscando=true&vuelveBuscar=false&dibujaPoligono=true&resetMapa=true&animacion=true&idZonaHomogenea=0&esPrimeraBusqueda=false'
		// // const searchURL = `https://www.toctoc.com/search/index2/?${querystring.stringify(params)}`

		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		// let ready = false
		// await page.setRequestInterception(true)
		await page.setViewport({width:1920, height: 1080});

		// page.

		// page.on('request', request => {
		// 	// if (!ready) {
		// 	// 	console.log('resquest', request)
		// 	// 	ready = true
		// 	// }
		// 	request.continue();
		// })
		// JSON RESPONSE 'getpropiedades'
		const flag = 'https://www.toctoc.com/api/mapa/getpropiedades'
		// page.on('response', async (response) => {
		// 	if (response.ok) {
		// 		// console.log('url', response.url())
		// 		const url = response.url()
		// 		if (url.toLowerCase() === flag) {
		// 			if (!flagg) {
		// 				// console.log('url', url)
		// 				// console.log('status: ', response.status())
		// 				const json = await response.json()
		// 				console.log(json)
		// 				// console.log('')
		// 				// console.log('')
		// 			}
		// 		}
		// 	} else {
		// 		console.log('not response ok', response.url, response.status)
		// 	}
		// })
		// console.log(111)
		// const url = 'https://www.toctoc.com/search/index2/?dormitorios=0&banos=0&superficieDesde=0&superficieHasta=0&precioDesde=0&precioHasta=0&moneda=UF&tipoArriendo=false&tipoVentaUsado=true&tipoVentaNuevo=false&tipoUltimasVentas=false&casaDepto=undefined&ordenarPorMoneda=UFCLP&ordenarDesc=false&ordernarPorFechaPublicacion=false&ordernarPorSuperficie=false&ordernarPorPrecio=false&pagina=1&textoBusqueda=&tipoVista=mapa&viewport=-33.602863984550964%2C-72.41635396598548%2C-33.301501308961576%2C-68.9007504236576&comuna=&region=&atributos=&idle=false&zoom=9&buscando=false&vuelveBuscar=false&dibujaPoligono=true&resetMapa=true&animacion=false&idZonaHomogenea=0&esPrimeraBusqueda=false'
		
		//se asumira que el siguiente link entra directamente al panel de busqueda con nuevos y usados en true, sin campos en la barra de busqueda.
		// const url = 'https://www.toctoc.com/search/index2/?dormitorios=0&banos=0&superficieDesde=0&superficieHasta=0&precioDesde=0&precioHasta=0&moneda=UF&tipoArriendo=false&tipoVentaUsado=true&tipoVentaNuevo=false&tipoUltimasVentas=false&casaDepto=0&ordenarPorMoneda=UFCLP&ordenarDesc=false&ordernarPorFechaPublicacion=false&ordernarPorSuperficie=false&ordernarPorPrecio=false&pagina=1&textoBusqueda&tipoVista=mapa&viewport=-34.2878148%2C-71.70881020000002%2C-32.919451%2C-69.76899430000003&comuna=Las%20Condes&region=Regi%C3%B3n%20Metropolitana&atributos=&idle=false&zoom=12&buscando=false&vuelveBuscar=false&dibujaPoligono=true&resetMapa=true&animacion=false&idZonaHomogenea=0&esPrimeraBusqueda=false'
		const url = 'https://www.toctoc.com/search/index2/?dormitorios=0&banos=0&superficieDesde=0&superficieHasta=0&precioDesde=0&precioHasta=0&moneda=UF&tipoArriendo=true&tipoVentaUsado=false&tipoVentaNuevo=false&tipoUltimasVentas=false&casaDepto=&ordenarPorMoneda=UFCLP&ordenarDesc=false&ordernarPorFechaPublicacion=false&ordernarPorSuperficie=false&ordernarPorPrecio=false&pagina=2&textoBusqueda=%C3%B1u%C3%B1oa&tipoVista=&viewport=-34.2878148%2C-71.70881020000002%2C-32.919451%2C-69.76899430000003&comuna=%C3%91u%C3%B1oa&region=Regi%C3%B3n%20Metropolitana&atributos=&idle=false&zoom=14&buscando=false&vuelveBuscar=false&dibujaPoligono=true&resetMapa=true&animacion=false&idZonaHomogenea=0&esPrimeraBusqueda=false'
		await page.goto(url)
		 
		// const loginSelector = '#btnEntrar'
		// const login = await page.waitForSelector(loginSelector, true)
		// await login.click()
		 
		// const modalSelector = '#modalIngresoRegistro'
		// await page.waitForSelector(modalSelector, true)

		// const usernameSelector = '#IngresoUsuario_CorreoElectronico'
		// const username = await page.waitForSelector(usernameSelector)
		// await username.click()
		// await page.keyboard.type('matiassanchezu@gmail.com')

		// const passwordSelector = '#IngresoUsuario_Contrasena'
		// const password = await page.waitForSelector(passwordSelector)
		// await password.click()
		// await page.keyboard.type('matias123')

		// const loginButtonSelector = '#btnIngresoUsuarioPop'
		// const loginButton = await page.waitForSelector(loginButtonSelector)
		// await loginButton.click()

		// await page.waitFor(5000)

		// await page.evaluate((propType) => {
		// 	const filters = document.querySelector('#filtroTipos')
		// 	filters.className = filters.className.concat(' open')

		// 	const newP = (propType === 'new') ? true : false
		// 	const usedP = (propType === 'used') ? true : false
		// 	const rentP = (propType === 'rent') ? true : false

		// 	const newPropSelector =  '#check-venta-nuevo'
		// 	const usedPropSelector = '#check-venta-usados'
		// 	const rentPropSelector = '#check-arriendos'

		// 	const newProp = document.querySelector(newPropSelector)
		// 	const usedProp = document.querySelector(usedPropSelector)
		// 	const rentProp = document.querySelector(rentPropSelector)

		// 	// used when new prop type param is true
		// 	if (newP) {
		// 		if (!newProp.className.includes('on')) {
		// 			newProp.click()
		// 		}

		// 		if (usedProp.className.includes('on')) {
		// 			usedProp.click()
		// 		}

		// 		if (rentProp.className.includes('on')) {
		// 			rentProp.click()
		// 		}
		// 	}

		// 	// used when used prop type param is true
		// 	if (usedP) {
		// 		if (newProp.className.includes('on')) {
		// 			newProp.click()
		// 		}

		// 		if (!usedProp.className.includes('on')) {
		// 			usedProp.click()
		// 		}

		// 		if (rentProp.className.includes('on')) {
		// 			rentProp.click()
		// 		}
		// 	}

		// 	// used when new prop type param is true
		// 	if (rentP) {
		// 		if (newProp.className.includes('on')) {
		// 			newProp.click()
		// 		}

		// 		if (usedProp.className.includes('on')) {
		// 			usedProp.click()
		// 		}

		// 		if (!rentProp.className.includes('on')) {
		// 			rentProp.click()
		// 		}
		// 	}

		// 	if (!newP && !usedP && !rentP) {
		// 		if (!newProp.className.includes('on')) {
		// 			newProp.click()
		// 		}

		// 		if (!usedProp.className.includes('on')) {
		// 			usedProp.click()
		// 		}

		// 		if (!rentProp.className.includes('on')) {
		// 			rentProp.click()
		// 		}
		// 	}

		// 	filters.className = 'dropdown enuso'
		// }, propType)

		// await page.waitFor(3000)

		// await page.screenshot({path: 'page_11aa.png'})

		// await page.evaluate((text) => { (document.getElementById('TextoBusqueda')).value = text; }, 'Puerto Montt, Chile');

		// const searchSelector = '#TextoBusqueda'
		// const search = await page.waitForSelector(searchSelector)
		// await search.type('Puerto Montt, Chile', {delay: 500})

		// await page.type('Puerto Montt, Chile', {delay: 300})
		await page.screenshot({path: 'page_aaaa.png'})

		// await page.waitFor(5000)
		
		// const searchButtonSelector = '#barra_busqueda_mapa-v2 > nav > div.c-form-filtros.col-xs-3.col-md-3.col-lg-2 > form > div > span > button'
		// const searchButton = await page.waitForSelector(searchButtonSelector)
		// await searchButton.click()
		
		// await page.waitFor(10000)
		
		await page.screenshot({path: 'page_1.png'})
		//redirect to logged page

		// const logged
		/*
		prop {
			id string
			locality string
			link string
			type string
			property_name string
			email string
			phone string
			value number
			created_at date
			rooms number
			baths number
			m2_useful number
			m2_build
		}
		*/

		await page.screenshot({path: 'example.png'})

		// console.log('Extrayendo información general página 1/XX')
		const props = await page.evaluate(() => {
			const propsLi = document.querySelectorAll('#colLista > ul.content-resul > li')

			const newProps = []
			// propsLi.length
			for (let i = 0; i < propsLi.length; i++) {
				const propLi = propsLi[i]
				const prop = {}

				// id
				prop.id = i

				// locality
				{
					const copy = propLi
					const h3 = copy.querySelector('div.res-info h3')
					h3.querySelector('small').remove()
					prop.locality = h3.innerText
				}

				// value
				{
					const copy = propLi
					const currency = copy.querySelector('div.res-info > ul > li.precio > span.moneda')
					prop.currency = currency.innerText
				}

				// url
				{
					const copy = propLi
					const a = copy.querySelector('div.res-info > h4 > a')
					prop.url = a.href
				}

				newProps.push(prop)
			}

			return newProps
		})

		for (let i = 0; i < props.length; i++) {
			let prop = props[i]

			console.log(`Extrayendo información detallada propiedad ${i + 1}/${props.length}`)

			try {
				const browserProp = await puppeteer.launch()
				const pageProp = await browserProp.newPage()

				await pageProp.setViewport({width:1920, height: 1080});
				await pageProp.goto(prop.url)

				const details = await pageProp.evaluate(() => {
					const propDetail = {}

					// uf_value and clp_value
					{
						const firstValue = document.querySelector('#partialCabecera > div.wrap-hfijo > div > div > div > strong').innerText
						const secondValue = document.querySelector('#partialCabecera > div.wrap-hfijo > div > div > div > em > strong').innerText

						if (firstValue.includes('UF')) {
							propDetail.uf_value = firstValue.replace(/UF /g, '').replace(/\./g, '').replace(/,/g, '.')
							propDetail.clp_value = secondValue.replace(/\$ /g, '').replace(/\./g, '')
						} else if (firstValue.includes('$')) {
							propDetail.uf_value = secondValue.replace(/\$ /g, '').replace(/\./g, '')
							propDetail.clp_value = firstValue.replace(/UF /g, '').replace(/\./g, '').replace(/,/g, '.')
						} else {
							console.log('Error at parser uf and clp values')
						}
					}

					// published_date
					{
						const published_date = document.querySelector('#informacionBasica > div.panel-body > ul > li:nth-child(16)').innerText
						propDetail.published_date = published_date.replace('Fecha publicación: ', '')
					}

					//rooms
					{
						const rooms = document.querySelector('#informacionBasica > div.panel-body > ul > li.dormitorios > strong').innerText
						propDetail.rooms = rooms
					}

					//baths
					{
						const baths = document.querySelector('#informacionBasica > div.panel-body > ul > li.baños > strong').innerText
						propDetail.baths = baths
					}

					//m2 build
					{
						const m2_build = document.querySelector('#informacionBasica > div.panel-body > ul > li.metrosConstruidos > strong').innerText
						propDetail.m2_build = m2_build
					}

					//m2 build
					{
						const m2_build = document.querySelector('#informacionBasica > div.panel-body > ul > li.metrosConstruidos > strong').innerText
						propDetail.m2_build = m2_build
					}

					//m2 useful 
					{
						const m2_useful = document.querySelector('#informacionBasica > div.panel-body > ul > li.metrosUtiles > strong').innerText
						propDetail.m2_useful = m2_useful
					}

					return propDetail
				})

				// await pageProp.screenshot({path: 'example_antes1.png'})

				const loginSelector = '#btnEntrar'
				const login = await pageProp.waitForSelector(loginSelector, true)
				await login.click()

				const modalSelector = '#modalIngresoRegistro'
				await pageProp.waitForSelector(modalSelector, true)
		
				const usernameSelector = '#IngresoUsuario_CorreoElectronico'
				const username = await pageProp.waitForSelector(usernameSelector)
				await username.click()
				await pageProp.keyboard.type('matiassanchezu@gmail.com')
		
				const passwordSelector = '#IngresoUsuario_Contrasena'
				const password = await pageProp.waitForSelector(passwordSelector)
				await password.click()
				await pageProp.keyboard.type('matias123')

				// await pageProp.screenshot({path: 'example_antes2.png'})
		
				const loginButtonSelector = '#btnIngresoUsuarioPop'
				const loginButton = await pageProp.waitForSelector(loginButtonSelector)
				await loginButton.click()
		
				await pageProp.waitFor(3000)

				// await pageProp.screenshot({path: 'example_antes3.png'})
				

				const contactSelector = '#btnVerDatosContacto'
				// await pageProp.screenshot({path: 'example_1.png'})
				const contact = await pageProp.waitForSelector(contactSelector)
				await contact.click()

				// await pageProp.screenshot({path: 'example_2.png'})
				
				await pageProp.waitFor(3000)

				// await pageProp.screenshot({path: 'example_3.png'})

				const contactName = await pageProp.evaluate(() => document.querySelector('#partialInformacionContacto > div > div.panel-body > ul > li.btn-msn > div > h5 > strong').innerText)
				const contactEmail = await pageProp.evaluate(() => document.querySelector('#partialInformacionContacto > div > div.panel-body > ul > li.btn-msn > div > p:nth-child(2)').innerText)
				const contactPhone = await pageProp.evaluate(() => document.querySelector('#partialInformacionContacto > div > div.panel-body > ul > li.btn-msn > div > p:nth-child(3)').innerText)
				// console.log('contactName', contactName)
				details.property_name = contactName
				// details.email = contactEmail.replace('e-mail: ')
				details.email = contactEmail
				// details.phone = contactPhone.replace('Teléfono: ', '')
				details.phone = contactPhone

				await browserProp.close()
				prop = Object.assign(prop, details)
			} catch (err) {
				console.log(`catch error in Array.from(propsLi).map() with index ${i}`, err)
			}
		}

		fs.writeFileSync('out.csv', ConvertToCSV(props))
		
		await browser.close()
	} catch (err) {
		console.log('catch error in toctoc', err)
	}
}



toctoc()