const puppeteer = require('puppeteer')
const querystring = require('querystring')

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
	region: '',
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
	zoom: 14,
}

async function toctoc () {
  try {
		// TODO: add support tu manage page's number
		console.log('Extrayendo información. Página 1 de XX')

		// // const url = 'https://www.toctoc.com/'
		// // const url = 'https://www.toctoc.com/Search/Index/?param={Default:false}{estado:Nueva%20Usada}{comuna:Santiago}{region:Regi%C3%B3n%20Metropolitana}{superficieFD:null}{precioFH:null}{moneda:null}{dormitoriosFD:null}{dormitoriosFH:null}{banosFD:null}{banosFH:null}{latitud:-33.4488897}{longitud:-70.6692655}{viewport:-33.6741885,-70.83288190000002,-33.2713874,-70.4267807}{EsBusquedaTexto:true}{tv:m}{ecn:true}{ecu:true}{EsBusquedaValida:true}{tp:0}{textoBusqueda:santiago}'
		// // const url = 'https://www.toctoc.com/search/index2/?dormitorios=0&banos=0&superficieDesde=0&superficieHasta=0&precioDesde=0&precioHasta=0&moneda=UF&tipoArriendo=false&tipoVentaUsado=true&tipoVentaNuevo=true&tipoUltimasVentas=false&casaDepto=undefined&ordenarPorMoneda=UFCLP&ordenarDesc=false&ordernarPorFechaPublicacion=false&ordernarPorSuperficie=false&ordernarPorPrecio=false&pagina=1&textoBusqueda=santiago&tipoVista=lista&viewport=-34.2878148%2C-71.70881020000002%2C-32.919451%2C-69.76899430000003&comuna=Santiago&region=Regi%C3%B3n%20Metropolitana&atributos=&idle=false&zoom=14&buscando=true&vuelveBuscar=false&dibujaPoligono=true&resetMapa=true&animacion=true&idZonaHomogenea=0&esPrimeraBusqueda=false'
		// // const searchURL = `https://www.toctoc.com/search/index2/?${querystring.stringify(params)}`

		const browser = await puppeteer.launch()
		const page = await browser.newPage()

		const url = 'https://www.toctoc.com/search/index2/?dormitorios=0&banos=0&superficieDesde=0&superficieHasta=0&precioDesde=0&precioHasta=0&moneda=UF&tipoArriendo=false&tipoVentaUsado=true&tipoVentaNuevo=false&tipoUltimasVentas=false&casaDepto=undefined&ordenarPorMoneda=UFCLP&ordenarDesc=false&ordernarPorFechaPublicacion=false&ordernarPorSuperficie=false&ordernarPorPrecio=false&pagina=1&textoBusqueda=&tipoVista=mapa&viewport=-33.602863984550964%2C-72.41635396598548%2C-33.301501308961576%2C-68.9007504236576&comuna=&region=&atributos=&idle=false&zoom=9&buscando=false&vuelveBuscar=false&dibujaPoligono=true&resetMapa=true&animacion=false&idZonaHomogenea=0&esPrimeraBusqueda=false'
		await page.goto(url)

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
			m2 number
		}
		*/
		
		console.log('Extrayendo información general página 1/XX')
		const props = await page.evaluate(() => {
			const propsLi = document.querySelectorAll('#colLista > ul.content-resul > li')

			const newProps = []
			for (let i = 0; i < 2; i++) {
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

		for (let i = 0; i < 2; i++) {
			let prop = props[i]

			console.log(`Extrayendo información detallada propiedad ${i + 1}/${props.length}`)

			try {
				const browserProp = await puppeteer.launch()
				const pageProp = await browserProp.newPage()
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

					return propDetail
				})

				console.log('Login en toctoc...')

				await pageProp.evaluate(() => {
					const modal = document.querySelector('#modalIngresoRegistro')
					modal.style.display = 'block'
				})

				await pageProp.screenshot({path: 'example_b.png'})

				const loginSelector = '#IngresoUsuario_CorreoElectronico'
				const passwordSelector = '#IngresoUsuario_Contrasena'
				const buttonSelector = '#btnIngresoUsuarioPop'

				await pageProp.waitForSelector(loginSelector)
				await pageProp.click(loginSelector)
				await pageProp.keyboard.type('matiassanchezu@gmail.com')
				await pageProp.waitForSelector(passwordSelector)
				await pageProp.click(passwordSelector)
				await pageProp.keyboard.type('matias123')
				await pageProp.waitForSelector(buttonSelector)
				await pageProp.click(buttonSelector)

				await pageProp.screenshot({path: 'example_c.png'})

				await pageProp.waitForNavigation()

				await pageProp.screenshot({path: 'example_d.png'})

				const contactSelector = '#btnVerDatosContacto'
				await pageProp.screenshot({path: 'example_1.png'})
				await pageProp.waitForSelector(contactSelector)
				await pageProp.click(contactSelector)
				await pageProp.screenshot({path: 'example_2.png'})
				await pageProp.waitForNavigation()
				await pageProp.screenshot({path: 'example_3.png'})

				await browserProp.close()
				prop = Object.assign(prop, details)
			} catch (err) {
				console.log(`catch error in Array.from(propsLi).map() with index ${i}`, err)
			}
		}


		console.log('props:', props)
		
		// await page.type('#TextoBusqueda', 'santiago')
		// console.log(333)
		
		// const searchButton = '#btnBuscarHome'
		// await page.waitForSelector(searchButton)
		// console.log(444)
		// await page.click(searchButton)
		// console.log(555)
		
		//wait
		
		await page.screenshot({path: 'example.png'})
		console.log(999)
		
		await browser.close()
	} catch (err) {
		console.log('catch error in toctoc', err)
	}
}



toctoc()