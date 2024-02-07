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
		icon: "https://media.tenor.com/SI5tOTnHS34AAAAi/verycat-twitch-cat-twitch-emote.gif?height=10px",
		button: "Ну... Имба",
	});
}

function catUploadHTTP() {
	const catFileHTTP = document.getElementById('catFile');
	const fileHTTP = catFileHTTP.files[0];
	if (!fileHTTP) {
		swal({
			icon: "https://cdn-icons-png.flaticon.com/512/1304/1304038.png",
			title: "Ошибка",
			text: "Выберите котека прежде чем отправить его на сервер.",
			button: "понятно"
		})
		return
	}

	var data = new FormData();
	data.append('image', fileHTTP, fileHTTP.name);
	let headers = '';
	switch (((fileHTTP.name).split('.')[1]).toLowerCase()) {
		case 'jpg':
			headers = 'image/jpeg';
			break
		case 'jpeg':
			headers = 'image/jpeg';
			break
		case 'png':
			headers = 'image/png';
			break
		case 'gif':
			headers = 'image/gif';
			break
		default:
			console.warn('Котек: Неизвестный формат файла.\n' +
			'Мы не знаем что это такое, если бы мы знали что это такое, мы не знаем что это такое :с');
			break
	}

	swal({
		icon: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/8/e/6/8e6f33126207a47f09f7c6ac5333057c1f45b5de.gif",
		title: "Производится загрузка на сервер..."
	})

	axios.post('http://46.160.202.45:3005/imgUpload', data, {
		headers: {
			'Content-Type': headers
		}
	})
	.then(response => {
		console.log('Запрос на сервер отправлен!\n' + 'Статус: ' +
		JSON.stringify(response.status) + '\nДата: ' +
		JSON.stringify(response.data));
		if (response.status == 200) {
			swal({
				icon: "https://static-00.iconduck.com/assets.00/success-icon-512x512-qdg1isa0.png",
				title: "Файл отправлен Максу и Санечке!",
				text: "Файл " + fileHTTP.name + " загружен на сервер!"
			})
		}
	})
	.catch(error => {
		console.error('Ошибка при отправке картинки:', error);
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