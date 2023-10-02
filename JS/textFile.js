/************************************************
		Проверка загруженного файла
		By lolmak
************************************************/

function uploadFile() {
	const textFile = document.getElementById('textFile');
	const file = textFile.files[0];
	
	const tblHead = document.getElementById("excelTableHead");
	const tblBody = document.getElementById("excelTableBody");
	
	var fastCheck = 0;
	
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
}