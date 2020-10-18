const { Router } = require('express');
const router = Router();
const fetch = require('node-fetch');
const { buscarPais, estado, direccion  } = require('../climaFunctions/index');
const apiKey = '3407ca5758a1ba34672b9703741afc01';
const apiUrl = 'https://api.openweathermap.org';



router.get('/actual/:latitud?/:longitud?', async (req,res) => {

    const { latitud, longitud } = req.query
    const url = new URL(`/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric&lang=sp`, apiUrl );

    await fetch(url)
    .then((data) => data.json())
    .then((data) => {

        const response = {
            date: new Date(data.dt).toTimeString(),
            clima: {
                estado: estado(data.weather[0].main),
                descripcion: data.weather[0].description
            },
            principal: {
                temperatura: data.main.temp,
                sensacion: data.main.feels_like,
                humedad: data.main.humidity,
                minima: data.main.temp_min,
                maxima: data.main.temp_max
            },
            viento: {
                velocidad: (parseFloat(data.wind.speed) * 3.6),
                direccion: direccion(data.wind.deg)
            },
            zona: {
                pais: buscarPais(data.sys.country),
                ciudad: data.name
            }
        };

        res.json(response);
    })
    .catch((error) => res.status(400).json(error))

})



router.get('/pronostico/:latitud?/:longitud?', async (req,res) => {

    const { latitud,longitud } = req.query
    const url = new URL(`/data/2.5/forecast?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric&lang=sp&cnt=37`, apiUrl );
    await fetch(url)
    .then((data) => data.json())
    .then((data) => {

        const positions = [5,13,21,29];
        const lista = [];

        for(let i of positions) {

            const info = data.list[i];

            const element = {
                date: info.dt_txt,
                clima: {
                    estado: estado(info.weather[0].main),
                    descripcion: info.weather[0].description
                },
                principal: {
                    temperatura: info.main.temp,
                    sensacion: info.main.feels_like,
                    humedad: info.main.humidity,
                    minima: info.main.temp_min,
                    maxima: info.main.temp_max
                },
                viento: {
                    velocidad: (parseFloat(info.wind.speed) * 3.6),
                    direccion: info.wind.deg
                }
            };

            lista.push(element);

        }

        res.json(lista);

    })
    .catch((error) => res.status(400).json(error))

})


module.exports = router