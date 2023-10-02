/************************************************
		Проверка пред-загруженного файла
		By lolmak
************************************************/

var input = document.getElementById('textFile');
input.addEventListener('change', () => {
	var preFiles = document.getElementById('textFile');
	var lastPreFile = textFile.files[0];
	if (!lastPreFile) {
		return;
	};
	document.getElementById("PreFileInfo").innerHTML = 'Имя загруженного файла:';
	document.getElementById("preFileName").innerHTML = lastPreFile.name;
});