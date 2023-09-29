/************************************************
		Проверка загруженного файла
		By lolmak
************************************************/

function uploadFile() {
	const textFile = document.getElementById('textFile');
	const file = textFile.files[0];
	if (!file) {
		console.warn('Остановка работы кнопки: Файл не выбран.');
		return;
	}
	if (/.+.txt/.test(file.name)) {
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
	} else {
		document.getElementById("result").style.color = "red";
		document.getElementById("fileName").innerHTML = file.name;
		document.getElementById("result").innerHTML = 'не является текстовым файлом!';
		document.getElementById("textInBorder").classList.remove("textBorder");
		document.getElementById("textInBorder").innerHTML = '';
	}
}