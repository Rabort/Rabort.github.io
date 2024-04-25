/************************************************

	Расписание

************************************************/

const tblHead = document.getElementById("scheduleTableHead");
const tblBody = document.getElementById("scheduleTableBody");
const curseSelect = document.getElementById("curseSelect");
const lecturerSelect = document.getElementById("lecturerSelect");

const numberToAlphabet = {
  1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E',
  6: 'F', 7: 'G', 8: 'H', 9: 'I', 10: 'J',
  11: 'K', 12: 'L', 13: 'M', 14: 'N', 15: 'O',
  16: 'P', 17: 'Q', 18: 'R', 19: 'S', 20: 'T',
  21: 'U', 22: 'V', 23: 'W', 24: 'X', 25: 'Y',
  26: 'Z', 0: ''
};

function readScheduleFile(curseNum, lecturerNum) {
	const scheduleFileElement = document.getElementById('scheduleFile');
	const scheduleFile = scheduleFileElement.files[0];
	if (!scheduleFile) {
		document.getElementById("curseSelect").style.display = "none";
		document.getElementById("lecturerSelect").style.display = "none";
	}
	while (document.querySelector("tr")) {
		try {
			tblHead.removeChild(document.querySelector("tr"));
		} catch (e) {}
		try {
			tblBody.removeChild(document.querySelector("tr"));
		} catch (e) {}
	}
	while (document.getElementById("curseOption")) {
		try {
			curseSelect.removeChild(document.getElementById("curseOption"));
		} catch (e) {}
	}
	while (document.getElementById("lecturerOption")) {
		try {
			lecturerSelect.removeChild(document.getElementById("lecturerOption"));
		} catch (e) {}
	}
    const reader = new FileReader();
    reader.readAsArrayBuffer(scheduleFile); 
    reader.onload = function (readerOn) { 
        var scheduleFileData = readerOn.target.result; 
        var scheduleFileU8A = new Uint8Array(scheduleFileData); 
        var workbook = XLSX.read(scheduleFileU8A, {type:"array"});
		let curse = workbook.SheetNames[curseNum];
        console.log(workbook.Sheets[curse]);
		let headData = ['', ''];
		let brokenIndex = [];
		for (let firstLetter = 3; firstLetter <= 26; firstLetter++) {
			let index = numberToAlphabet[firstLetter] + '1';
			if (workbook.Sheets[curse][index]?.v) { 
				headData.push(workbook.Sheets[curse][index]?.v);
				if (firstLetter != 26) {
					if (workbook.Sheets[curse][numberToAlphabet[firstLetter + 1] + '1']?.v) {
						brokenIndex.push(numberToAlphabet[firstLetter + 1] + 'broke');
					}
				} else {
					if (workbook.Sheets[curse]['AA1']?.v) {
						brokenIndex.push('AAbroke');
					}
				}
			}
		}
		for (let firstLetter = 1; firstLetter <= 3; firstLetter++) {
			for (let secondLetter = 1; secondLetter <= 26; secondLetter++) {
				let index = numberToAlphabet[firstLetter] + numberToAlphabet[secondLetter] + '1';
				if (workbook.Sheets[curse][index]?.v) { 
					headData.push(workbook.Sheets[curse][index]?.v)
				}
			}
		}
		let underHeadData = ['День', '№ урока'];
		for (let i = 0; i < headData.length - 2; i++) {
			underHeadData.push('дисциплина', 'преподаватель', 'кабинет');
		}
		
		let bodyData = [];
		let indexData = [];
		let bodyDataIndexData = 0;
		for (i = 2; i < 150; i++) {
			bodyData.push([]);
			if (i % 2 == 0) {
				for (let firstLetter = 1; firstLetter <= 26; firstLetter++) {
					if (brokenIndex.includes(numberToAlphabet[firstLetter] + 'broke')) {
						indexData.push('ZZ' + i);
					}
					indexData.push(numberToAlphabet[firstLetter] + '' + i);
				}
				for (let firstLetter = 1; firstLetter <= 3; firstLetter++) {
					for (let secondLetter = 1; secondLetter <= 26; secondLetter++) {
						if (brokenIndex.includes(numberToAlphabet[firstLetter] + numberToAlphabet[secondLetter] + 'broke')) {
							indexData.push('ZZ' + i);
						}
						indexData.push(numberToAlphabet[firstLetter] + numberToAlphabet[secondLetter] + '' + i);
					}
				}
			
				indexData.forEach((column) => {
					if (workbook.Sheets[curse][column]?.v) {
						bodyData[bodyDataIndexData].push(workbook.Sheets[curse][column]?.v);
					} else {
						if (bodyData[bodyDataIndexData].length != 0) {
							bodyData[bodyDataIndexData].push('');
						}
					}
				});
				indexData = [];
				bodyDataIndexData++;
			} else {
				for (let firstLetter = 4; firstLetter <= 26; firstLetter++) {
					if (brokenIndex.includes(numberToAlphabet[firstLetter] + 'broke')) {
						indexData.push('ZZ' + i);
					}
					indexData.push(numberToAlphabet[firstLetter] + '' + i);
				}
				for (let firstLetter = 1; firstLetter <= 3; firstLetter++) {
					for (let secondLetter = 1; secondLetter <= 26; secondLetter++) {
						if (brokenIndex.includes(numberToAlphabet[firstLetter] + numberToAlphabet[secondLetter] + 'broke')) {
							indexData.push('ZZ' + i);
						}
						indexData.push(numberToAlphabet[firstLetter] + numberToAlphabet[secondLetter] + '' + i);
					}
				}
				
				let officeIndex = 3;
				if (bodyData[bodyDataIndexData - 1][1] == 1) {
					officeIndex = 4
				}
				let collumOfficeIndex = 2;
				indexData.forEach((column) => {
					if (collumOfficeIndex % 2 == 0) {
						if (workbook.Sheets[curse][column]?.v) {
							bodyData[bodyDataIndexData - 1].splice(officeIndex, 0, workbook.Sheets[curse][column]?.v);
							officeIndex += 3;
						} else {
							bodyData[bodyDataIndexData - 1].splice(officeIndex, 0, '');
							officeIndex += 3;
						}
					}
					collumOfficeIndex++;
				});
				indexData = [];
			}
		}
		
		let dayIndex = [[], [], []];
		for (let i = 0; i < bodyData.length; i++) {
			if (bodyData[i][1] == 1 || bodyData[i][1] == headData[2]) {
				dayIndex[0].push(i);
				dayIndex[2].push(i - 1);
				if (i != 0) {
					dayIndex[1].push(bodyData[i - 1][0]);
				}
			} else {
				bodyData[i].splice(underHeadData.length - 1);
			}
		}
		console.log(bodyData);
		
		
		/************************************************

			Отображение фильтра

		************************************************/
		document.getElementById("curseSelect").style.display = "block";
		document.getElementById("lecturerSelect").style.display = "block";
		let optionIndex = 0;
		workbook.SheetNames.forEach((course) => {
			const courseOption = document.createElement("option");
			const courseOptionText = document.createTextNode(course);
			courseOption.setAttribute('id', 'curseOption');
			courseOption.setAttribute('value', optionIndex);
			if (optionIndex == curseNum) {
				courseOption.setAttribute('selected', '');
			}
			courseOption.appendChild(courseOptionText);
			document.getElementById("curseSelect").appendChild(courseOption);
			optionIndex++;
		});
		let lecturerData = [];
		for (let i = 0; i < bodyData.length; i++) {
			for (let j = 0; j < underHeadData.length; j++) {
				if ((j + 1) % 3 == 0 && !dayIndex[0].includes(i)) {
					lecturerData.push(bodyData[i][j])
				} else if (j % 3 == 0 && j != 0 && dayIndex[0].includes(i)) {
					lecturerData.push(bodyData[i][j])
				}
			}
		}
		lecturerData = lecturerData.filter(item => item !== undefined);
		lecturerData = lecturerData.filter(item => item !== '');
		lecturerData = lecturerData.filter(item => item !== 'ДО');
		lecturerData = lecturerData.map(item => {
			if (item.includes(':2')) {
				return item.replace(':2', '');
			} else {
			return item;
			}
		});
		lecturerData = lecturerData.map(item => {
			if (item.includes(':1')) {
				return item.replace(':1', '');
			} else {
			return item;
			}
		});
		lecturerData = lecturerData.filter((item, index) => lecturerData.indexOf(item) === index);
		optionIndex = 0;
		console.log(lecturerData);
		lecturerData.forEach((lecturer) => {
			const lecturerOption = document.createElement("option");
			const lecturerOptionText = document.createTextNode(lecturer);
			lecturerOption.setAttribute('id', 'lecturerOption');
			lecturerOption.setAttribute('value', optionIndex);
			if (optionIndex == lecturerNum) {
				lecturerOption.setAttribute('selected', '');
			}
			lecturerOption.appendChild(lecturerOptionText);
			document.getElementById("lecturerSelect").appendChild(lecturerOption);
			optionIndex++;
		});
		
		/************************************************

			Фильтр выбора преподавателя

		************************************************/
		/*let lecturerBodyData = [['', ''], ['День', '№ урока']];
		let headDataLecturer = headData;
		for (let i = 3; i < headDataLecturer.length + 1; i += 3) {
			headDataLecturer.splice(i, 0, '', '');
		}
		if (lecturerNum != 'full') {
			for (let i = 0; i < bodyData.length; i++) {
				for (let j = 0; j < underHeadData.length; j++) {
					if ((j + 1) % 3 == 0 && !dayIndex[0].includes(i)) {
						if (bodyData[i][j].includes(lecturerData[lecturerNum])) {
							lecturerBodyData[0].push(headDataLecturer[i])
						}
					} else if (j % 3 == 0 && j != 0 && dayIndex[0].includes(i)) {
						if (bodyData[i][j] == lecturerData[lecturerNum]) {
							
						}
					}
				}
			}
		}
		console.log(lecturerBodyData)*/
		
		
		/************************************************

			Отображение таблицы

		************************************************/
		const rowHead = document.createElement("tr");
		for (let i = 0; i < headData.length; i++) {
			const cellHead = document.createElement("th");
			const cellTextHead = document.createTextNode(headData[i]);
			cellHead.appendChild(cellTextHead);
			if (i > 1) {
				cellHead.setAttribute('colspan', '3');
				cellHead.setAttribute('fat', '3');
			}
			if (i == 1) {
				cellHead.setAttribute('fat', '2');
			}
			rowHead.appendChild(cellHead);
		}
		tblHead.appendChild(rowHead);
		
		const rowBody = document.createElement("tr");
		for (let i = 0; i < underHeadData.length; i++) {
			const cellUndeHead = document.createElement("th");
			const cellTextUndeHead = document.createTextNode(underHeadData[i]);
			cellUndeHead.appendChild(cellTextUndeHead);
			if ((i + 1) % 3 == 0) {
				cellUndeHead.setAttribute('fat', '1');
			}
			if ((i + 2) % 3 == 0) {
				cellUndeHead.setAttribute('fat', '2');
			}
			cellUndeHead.setAttribute('fatDown', '1');
			rowBody.appendChild(cellUndeHead);
		}
		tblBody.appendChild(rowBody);
		
		for (let i = 0; i < bodyData.length; i++) {
			const secondRowBody = document.createElement("tr");
			for (let j = 0; j < underHeadData.length; j++) {
				if (bodyData[i][j] != undefined) {
					const cellBody = document.createElement("td");
					if (j == 0 && i == dayIndex[0][0]) {
						cellBody.setAttribute('rowspan', dayIndex[1][0]);
						cellBody.setAttribute('fatDown', '1');
					}
					if (j == 0 && i == dayIndex[0][1]) {
						cellBody.setAttribute('rowspan', dayIndex[1][1]);
						cellBody.setAttribute('fatDown', '1');
					}
					if (j == 0 && i == dayIndex[0][2]) {
						cellBody.setAttribute('rowspan', dayIndex[1][2]);
						cellBody.setAttribute('fatDown', '1');
					}
					if (j == 0 && i == dayIndex[0][3]) {
						cellBody.setAttribute('rowspan', dayIndex[1][3]);
						cellBody.setAttribute('fatDown', '1');
					}
					if (j == 0 && i == dayIndex[0][4]) {
						cellBody.setAttribute('rowspan', dayIndex[1][4]);
						cellBody.setAttribute('fatDown', '1');
					}
					if (i < dayIndex[0][5]) {
						secondRowBody.appendChild(cellBody);
					} else if (!dayIndex[0][5] && i < dayIndex[0][1]) {
						secondRowBody.appendChild(cellBody);
					}
					const cellTextBody = document.createTextNode(bodyData[i][j]);
					cellBody.appendChild(cellTextBody);
					if ((j - 1) % 3 == 0 && !dayIndex[0].includes(i)) {
						cellBody.setAttribute('fat', '1');
					} else if ((j - 2) % 3 == 0 && dayIndex[0].includes(i)) {
						cellBody.setAttribute('fat', '1');
					}
					if (j % 3 == 0 && !dayIndex[0].includes(i)) {
						cellBody.setAttribute('fat', '2');
					} else if ((j - 1) % 3 == 0 && dayIndex[0].includes(i)) {
						cellBody.setAttribute('fat', '2');
					}
					if (dayIndex[0].includes(i)) {
						cellBody.setAttribute('fatUp', '1');
					}
					if (dayIndex[2].includes(i)) {
						cellBody.setAttribute('fatDown', '1');
					}
				}
			}
			tblBody.appendChild(secondRowBody);
		}
    } 
}