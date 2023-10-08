/************************************************
		Котики какие-то...
		By lolmak
************************************************/

function catUpload() {
	swal({
		title: "lolmak",
		text: "Короче, кнопка теперь работает! " +
		"но я в душе не бум бум что она должна делать...",
		icon: "info",
		button: "пофиг!",
	});
}

var input = document.getElementById('catFile');
input.addEventListener('change', () => {
	const catFile = document.getElementById('catFile');
	const file = catFile.files[0];
	if (!file) {
		console.warn('Загружаемый файл не был выбран. Отменяем операцию.');
		return
	}
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function (event) {
		document.getElementById("imgCat").style.height = '';
		document.getElementById("imgCat").style.width = '';
		document.getElementById("imgCat").src = event.target.result;
		const imgCat = new Image();
		imgCat.src = event.target.result;
		imgCat.onload = () => {
			if (imgCat.height > 300) {
				document.getElementById("imgCat").style.height = '300px'
			};
			if (imgCat.width > 450) {
				document.getElementById("imgCat").style.width = '450px'
			}
		}
	}
})