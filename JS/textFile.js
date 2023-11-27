/************************************************
		Проверка загруженного файла
		By lolmak
************************************************/

const dateData = {
	monthFirstPart: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
					'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const tblHead = document.getElementById("excelTableHead");
const tblBody = document.getElementById("excelTableBody");
const tableData = [['⠀⠀⠀⠀⠀⠀⠀⠀'], ['⠀⠀⠀⠀⠀⠀⠀⠀'], ['ИС 22-01'], ['ИС 22-02'], ['ИС 21-01'], ['ИС 21-02']];

/************************************************
		Временная настройка часов
		В будущем они будут загружать через файл
		[<Учебная>, <Производственная>]
************************************************/

const IS2201 = [34, 0];
const IS2202 = [60, 72];
const IS2101 = [60, 72];
const IS2102 = [62, 90];

function uploadFile() {
	
	for (let month = 8; month < 12; month++) {
		for (let day = 1; day <= 31; day++) {
			const date = new Date(currentYear, month, day);
			if (date.getFullYear() === currentYear && date.getMonth() === month &&
			date.getDay() != 0 && date.getDay() != 6) {
				tableData[0].push(dateData.monthFirstPart[month])
				tableData[1].push(day.toString().padStart(2, '0') + '.' + month.toString().padStart(2, '0'));
			}
		}
	}
	console.log(tableData);
	
	for (let i = 0; i < 2; i++) {
		IS2201[i] = Math.ceil(IS2201[i] / 6);
		IS2202[i] = Math.ceil(IS2202[i] / 6);
		IS2101[i] = Math.ceil(IS2101[i] / 6);
		IS2102[i] = Math.ceil(IS2102[i] / 6);
	}
	console.log (IS2201, IS2202, IS2101, IS2102);
	
	
	
	while (document.querySelector("tr")) {
		try {
			tblHead.removeChild(document.querySelector("tr"));
		} catch (e) {}
		try {
			tblBody.removeChild(document.querySelector("tr"));
		} catch (e) {}
	}
	
	document.getElementById("result").innerHTML = 'Макс химичит с созданием учебного графика, пока что вся инфа отображается в консоле: Ctrl + shift + I => console';
	document.getElementById("textInBorder").classList.remove("textBorder");
	document.getElementById("textInBorder").innerHTML = '';
	
	const rowHead = document.createElement("tr");
	for (let i = 0; i < tableData[0].length; i++) {
		const cellHead = document.createElement("th");
		const cellTextHead = document.createTextNode(tableData[0][i] === undefined ? "-" : tableData[0][i]);
		cellHead.appendChild(cellTextHead);
		rowHead.appendChild(cellHead);
	}
	tblHead.appendChild(rowHead);
	
	for (let i = 1; i < tableData.length; i++) {
		const rowBody = document.createElement("tr");
		for (let j = 0; j < tableData[0].length; j++) {
			const cellBody = document.createElement("td");
			const cellTextBody = document.createTextNode(tableData[i][j] === undefined ? "-" : tableData[i][j]);
			cellBody.appendChild(cellTextBody);
			rowBody.appendChild(cellBody);
		}
		tblBody.appendChild(rowBody);
	}
	

	/********************************************************************************
	const textFile = document.getElementById('textFile');
	const file = textFile.files[0];
	
	const tblHead = document.getElementById("excelTableHead");
	const tblBody = document.getElementById("excelTableBody");
	if (!file) {
		console.warn('Остановка работы кнопки: Файл не выбран.');
		return;
	}
	while (document.querySelector("tr")) {
		try {
			tblHead.removeChild(document.querySelector("tr"));
		} catch (e) {}
		try {
			tblBody.removeChild(document.querySelector("tr"));
		} catch (e) {}
	}
	if (/.+\.txt/.test(file.name)) {
		console.info(file.name + ' является текстовым файлом.')
		document.getElementById("result").style.color = "green";
		document.getElementById("fileName").innerHTML = file.name;
		document.getElementById("result").innerHTML = 'имеет следующее содержание:';
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function (event) {
		const fileContents = event.target.result;
		console.log('Содержимое файла: ' + fileContents);
		document.getElementById("textInBorder").classList.add("textBorder");
		document.getElementById("textInBorder").innerHTML = fileContents;
  }
	} else if (/.+\.xlsx/.test(file.name)) {
		document.getElementById("result").style.color = "green";
		document.getElementById("fileName").innerHTML = file.name;
		document.getElementById("result").innerHTML = ' имеет следующее содержание:';
		document.getElementById("textInBorder").classList.remove("textBorder");
		document.getElementById("textInBorder").innerHTML = '';
		console.info(file.name + ' является EXCEL-файлом.');
		readXlsxFile(file).then((data) => {
			console.log(data);
			const nullPos = [];
			const rowHead = document.createElement("tr");
			for (let i = 0; i < data[0].length; i++) {
				if (data[0][i] != null) {
					const cellHead = document.createElement("th");
					const cellTextHead = document.createTextNode(data[0][i] === null ? "-" : data[0][i]);
					cellHead.appendChild(cellTextHead);
					rowHead.appendChild(cellHead);
				} else {
					fastCheck = 0;
					for (let j = 1; j < data.length; j++) {
						if (data[j][i] != null) {
							fastCheck = 1;
						}
					}
					if (fastCheck == 0) {
							nullPos.push(i);
					} else {
						const cellHead = document.createElement("th");
						const cellTextHead = document.createTextNode('-');
						cellHead.appendChild(cellTextHead);
						rowHead.appendChild(cellHead);
					}
				}
			}
			tblHead.appendChild(rowHead);
			console.log(data[0].length);
			for (let i = 1; i < data.length; i++) {
				const rowBody = document.createElement("tr");
				for (let j = 0; j < data[0].length; j++) {
					if (!nullPos.includes(j)) {
						const cellBody = document.createElement("td");
						const cellTextBody = document.createTextNode(data[i][j] === null ? "-" : data[i][j]);
						cellBody.appendChild(cellTextBody);
						rowBody.appendChild(cellBody);
					}
				}
				tblBody.appendChild(rowBody);
			}
		})
		.catch(err => {
			console.warn('Загруженный Excel-файл был повреждён. Сообщите об ошибке Максу!\n' + err);
			document.getElementById("result").style.color = "gold";
			document.getElementById("fileName").innerHTML = file.name;
			document.getElementById("result").innerHTML = ' ⚠️ Ваш EXECL-файл оказался повреждён или возникла непредвиденная ошибка.';
			document.getElementById("textInBorder").classList.remove("textBorder");
			document.getElementById("textInBorder").innerHTML = '';
		});
	} else if (/.+\.xls/.test(file.name)) {
		console.warn('Загруженный Excel-файл имеет неподходящий формат.');
		document.getElementById("result").style.color = "gold";
		document.getElementById("fileName").innerHTML = file.name;
		document.getElementById("result").innerHTML = ' ⚠️ Ваш EXECL-файл имеет временно неподдерживающийся формат xls. Пожалуйста, используйте формат xlsx.';
		document.getElementById("textInBorder").classList.remove("textBorder");
		document.getElementById("textInBorder").innerHTML = '';
	} else {
		console.info(file.name + ' не является текстовым файлом.')
		document.getElementById("result").style.color = "red";
		document.getElementById("fileName").innerHTML = file.name;
		document.getElementById("result").innerHTML = 'не является текстовым файлом!';
		document.getElementById("textInBorder").classList.remove("textBorder");
		document.getElementById("textInBorder").innerHTML = '';
	}
	**********************************************************************************************************/
}