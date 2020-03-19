const { returnMonth, returnYear } = Calendar(),
	{ getEmpoyee } = Employee()

getEmpoyee()

function Employee() {
	const loadEmployee = data => {
		addToContainer(getEmployeeContent(data))
		data.forEach(element => addEventsToCalendar(element))
	}

	const returnEmployeeContent = data => {
		let { name, img } = data
		return `<td>
					<img class="vacation__employee-photo" src="${img}" alt="Employee image" />
					<div class="vacation__employee-name">${name}</div>
				</td>
				<td>${data.vacationDaysCount}/28</td>`
	}
	const getEmployeeContent = data =>
		data
			.map(item => `<tr employee-id="${item.id}"> ${returnEmployeeContent(item) + returnYear(item.id)} <tr/>`)
			.join('')
	const addToContainer = content => {
		const container = document.querySelector('.js-vacation-table')
		container.innerHTML = content
	}
	const addEventsToCalendar = data => {
		const { id, events } = data
		events.forEach(event => addEventToCalendar(event, id))
	}

	const addEventToCalendar = (data, employeeId) => {
		const { id, dateStart, dateEnd, name } = data
		let dateStartArray = dateStart.split('.').map(parseFloat),
			dateEndArray = dateEnd.split('.').map(parseFloat),
			start = dateStartArray[0],
			end = dateEndArray[0]
		if (dateEndArray[1] == dateStartArray[1]) {
			for (start; start <= end; start++) {
				const day = document.querySelector(`[data-day="${start}-${dateEndArray[1] - 1}-${id}"]`)
				day.classList.add(`calendar__day--${name}`)
			}
		}
	}

	return {
		getEmpoyee: () => {
			fetch('https://dzadranik.github.io/i-dex/src/js/vacation-calendar.json')
				.then(response => response.json())
				.then(data => loadEmployee(data))
		}
	}
}

function Calendar() {
	let daysInMonth, firstDay, day, month, employeeId

	const setMonth = month => {
		let frD
		daysInMonth = new Date(2020, month + 1, 0).getDate()
		frD = new Date(2020, month, 1).getDay()
		frD == 0 ? (firstDay = 6) : (firstDay = frD - 1)
	}

	const returnDay = dayClass => {
		let isDay = dayClass == 'calendar__day',
			days = `<div class="${dayClass}" ${isDay ? `data-day="${day}-${month}-${employeeId}"` : ''}></div>`
		isDay ? (day = day + 1) : ''
		return days
	}

	const returnWeek = iteration => {
		let days = ''
		let getDays = (firstDay, i = 0) => {
			if (i < 7) {
				if ((firstDay > 0 && day && iteration == 0) || day > daysInMonth) {
					days += returnDay('calendar__empty')
				} else {
					days += returnDay('calendar__day')
				}

				getDays(firstDay - 1, i + 1)
			}
		}
		getDays(firstDay)
		return `<div class="calendar__week">
					${days}
				</div>`
	}

	return {
		returnMonth: m => {
			day = 1
			month = m
			setMonth(m)

			let monthContain = ''
			const getWeeks = (i = 0) => {
				if (day <= daysInMonth) {
					monthContain += returnWeek(i)
					getWeeks(i + 1)
				}
			}
			getWeeks()
			return `<td>
						<div class="calendar__month">
							${monthContain}
						</div>
					</td>`
		},
		returnYear: id => {
			let yearContent = ''
			employeeId = id
			const getYear = (i = 0) => {
				if (i < 12) {
					yearContent += returnMonth(i)
					getYear(i + 1)
				}
			}
			getYear()
			return yearContent
		}
	}
}
