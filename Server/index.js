const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser')

const greenText = '\x1b[32m';
const resetText = '\x1b[0m';
const orangeText = '\x1b[33m';

const testDataPatch = './data/testData.json'

app.use(fileUpload());
app.use(bodyParser.raw({inflate:true, limit: '1000kb', type: 'application/json'}));

app.post('/imgUpload', (req, res) => {
	console.log(orangeText + 'Сайт передал какую-то информацию, веду обработку... [img]' + resetText);
	try { 
		const { image } = req.files
		image.mv('./img/' + Math.floor(new Date().getTime() / 1000.0) +
		'-' + image.name)
		.then( data => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.status(200).send('Данные получены на сервер Node.js!');
			console.log('Данные записаны в ./img/' +
			Math.floor(new Date().getTime() / 1000.0) + '-' + image.name);
			console.log('ip: ' + req.socket.remoteAddress);
		})
		.catch(err => {
			res.status(500).send('Во время обработки полученных данных произошла ошибка!');
			console.log('Произошла ошибка сохранения полученной информации:\n' + err);
			console.log('ip: ' + req.socket.remoteAddress);
		})
	}
	catch (err) {
		res.status(500).send('Во время обработки полученных данных произошла ошибка!');
		console.log('Произошла ошибка при получении файла \"image\":\n' + err);
		console.log('ip: ' + req.socket.remoteAddress);
	}
});

app.post('/dataUpload', (req, res) => {
	console.log(orangeText + 'Сайт передал какую-то информацию, веду обработку... [JSON data]' + resetText);
	console.log('ip: ' + req.socket.remoteAddress);
	try {
		jsonData = JSON.parse(req.body);
		if (req.headers.authorization != 'Bearer dude stop, let me go!') {
			res.status(401).send('Неверный ключ авторизации или не указан вовсе.');
			console.log('Указан неверный ключ: ' + (req.headers.authorization == undefined?
						'<ключ отсутствует>': req.headers.authorization));
			return
		}
		console.log('Полученная иноформация:');
		console.log(jsonData);
		jsonServer = JSON.parse(fs.readFileSync(testDataPatch));
		jsonServer.serverObj.push(jsonData);
		fs.writeFileSync(testDataPatch, JSON.stringify(jsonServer, null, 4));
		res.status(201).send('Данные получены и сохранены на сервер Node.js!');
	} catch (err) {
		res.status(500).send('Во время обработки полученных данных произошла ошибка!');
		console.log('Во время обработки полученных данных произошла ошибка:\n' + err);
	}
});

app.get('/data', (req, res) => {
	let page = req.query.page? Number(req.query.page): 1;
	console.log(orangeText + `Сайт просит информацию... [JSON data страница ${page}]` + resetText);
	console.log('ip: ' + req.socket.remoteAddress);
	try {
		if (req.headers.authorization != 'Bearer dude stop, let me go!') {
			res.status(401).send('Неверный ключ авторизации или не указан вовсе.');
			console.log('Указан неверный ключ: ' + (req.headers.authorization == undefined?
						'<ключ отсутствует>': req.headers.authorization));
			return
		}
		console.log('Подготавливаю данные для ответа...');
		jsonServer = JSON.parse(fs.readFileSync(testDataPatch));
		let dataReply = [];
		for (let i = 5 * page - 5; i < 5 * page; i++) {
			if (jsonServer.serverObj[i]) {
				jsonServer.serverObj[i]["номер в системе"]= i + 1;
				dataReply.push(jsonServer.serverObj[i])
			}
		}
		let jsonReply = {
			"Номер страницы": page,
			"Получено объектов": dataReply.length
		}
		jsonReply.данные = dataReply;
		console.log(jsonReply);
		res.status(200).send(jsonReply);
	} catch (err) {
		res.status(500).send('Во время обработки полученных данных произошла ошибка!');
		console.log('Во время обработки полученных данных произошла ошибка:\n' + err);
	}
});

app.delete('/data', (req, res) => {
	let number = req.query.number? Number(req.query.number): 1;
	console.log(`Сайт пытается удалить информацию... [JSON data номер ${number}]`);
	console.log('ip: ' + req.socket.remoteAddress);
	try {
		if (req.headers.authorization != 'Bearer dude stop, let me go!') {
			res.status(401).send('Неверный ключ авторизации или не указан вовсе.');
			console.log('Указан неверный ключ: ' + (req.headers.authorization == undefined?
						'<ключ отсутствует>': req.headers.authorization));
			return
		}
		console.log('Удаляю информацию...');
		jsonServer = JSON.parse(fs.readFileSync(testDataPatch));
		if (jsonServer.serverObj[number - 1]) {
			console.log(jsonServer.serverObj[number - 1])
			let jsonReply = {"Удалённые данные": jsonServer.serverObj[number - 1]};
			jsonServer.serverObj.splice(number - 1, 1);
			fs.writeFileSync(testDataPatch, JSON.stringify(jsonServer, null, 4));
			res.status(200).send(jsonReply);
		} else {
			res.status(404).send(`Объекта под номером ${number} не существует!`);
			console.log(`Объекта под номером ${number} не существует!`);
		}
	} catch (err) {
		res.status(500).send('Во время обработки полученных данных произошла ошибка!');
		console.log('Во время обработки полученных данных произошла ошибка:\n' + err);
	}
});

app.listen(3005, () => {
	console.log('Запуск..');
	console.log(greenText + 'Жду запросы от сайта!');
});