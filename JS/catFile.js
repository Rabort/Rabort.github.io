/************************************************
		Котики какие-то...
		By lolmak
		Не какие-то, а очень даже красивые
		By Cat Customer
************************************************/

function catUpload() {
	swal({
		title: "lolmak&Cat Customer",
		text: "Эта кнопка просто имба!!! " +
		"Мы ее просто оставили, так, побаловаться",
		icon: "https://media.tenor.com/SI5tOTnHS34AAAAi/verycat-twitch-cat-twitch-emote.gif",
		button: "Ну... Имба",
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
});