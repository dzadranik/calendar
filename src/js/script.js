const { getYear } = Calendar(),
	{ loadEmployee } = Employee()

loadEmployee()

function Employee() {
	const getEmployee = data => {
		addToContainer(getEmployeeContent(data))
		data.forEach(element => addEventsToCalendar(element))
	}

	const getEmployeeContent = data =>
		data
			.map(item => `<tr employee-id="${item.id}"> ${getContentOneEmployee(item) + getYear(item.id)} <tr/>`)
			.join('')

	const getContentOneEmployee = data => {
		let { name, img } = data
		return `<td>
					<img class="vacation__employee-photo" src="${img}" alt="Employee image" />
					<div class="vacation__employee-name">${name}</div>
				</td>
				<td>${data.vacationDaysCount}/28</td>`
	}

	const addToContainer = content => {
		const container = document.querySelector('.js-vacation-table')
		container.innerHTML = content
	}

	const addEventsToCalendar = data => {
		const { id, events } = data
		events.forEach(event => addEventOneEmployee(event, id))
	}

	const addEventOneEmployee = (data, employeeId) => {
		let { id, dateStart, dateEnd, name } = data,
			dateStartEvent = dateStart.split('.').map(parseFloat),
			dateEndEvent = dateEnd.split('.').map(parseFloat),
			startDay = dateStartEvent[0],
			startMonth = dateStartEvent[1],
			endDay = dateEndEvent[0],
			endMonth = dateEndEvent[1]

		const findDayContainer = (day, month) =>
			document.querySelector(`[data-day="${day}-${month - 1}-${employeeId}"]`)

		const addEventClass = day => day.classList.add(`calendar__day--${name}`)

		if (startMonth == endMonth) {
			for (let i = startDay; i <= endDay; i++) {
				addEventClass(findDayContainer(i, startMonth))
			}
		} else {
			for (let i = startDay; i <= 31; i++) {
				const dayContainer = findDayContainer(i, startMonth)

				if (dayContainer) {
					addEventClass(dayContainer)
				}
			}
			for (let i = 1; i <= endDay; i++) {
				addEventClass(findDayContainer(i, endMonth))
			}
		}
	}

	return {
		loadEmployee: () => {
			fetch('https://dzadranik.github.io/i-dex/src/js/vacation-calendar.json')
				.then(response => response.json())
				.then(data => getEmployee(data))
		}
	}
}

function Calendar() {
	let daysInMonth, firstDay, month, employeeId, day
	// daysInMonth-количество дней в месяце,
	// firstDay-день недели первого дня,
	// month-индекс месяца,
	// employeeId- id сотрудника,
	// day- счетчик дней

	const returnOneMonth = m => {
		day = 1
		setMonthData(m)

		let monthContain = ''
		const getWeeks = (i = 0) => {
			if (day <= daysInMonth) {
				monthContain += getOneWeek(i)
				getWeeks(i + 1)
			}
		}
		getWeeks()
		return `<td>
					<div class="calendar__month">
						${monthContain}
					</div>
				</td>`
	}

	const setMonthData = monthIndex => {
		month = monthIndex
		daysInMonth = new Date(2020, monthIndex + 1, 0).getDate()
		let frD = new Date(2020, monthIndex, 1).getDay()
		frD == 0 ? (firstDay = 6) : (firstDay = frD - 1)
	}

	const getOneWeek = weekNumber => {
		let daysContent = '',
			getDays = (firstDay, i = 0) => {
				if (i < 7) {
					if ((firstDay > 0 && weekNumber == 0) || day > daysInMonth) {
						daysContent += getOneDay('calendar__empty')
					} else {
						daysContent += getOneDay('calendar__day')
					}

					getDays(firstDay - 1, i + 1)
				}
			}
		getDays(firstDay)
		return `<div class="calendar__week">
					${daysContent}
				</div>`
	}

	const getOneDay = dayClass => {
		let isEmptyDay = dayClass == 'calendar__empty',
			dayContent = `<div class="${dayClass}" ${
				isEmptyDay ? '' : `data-day="${day}-${month}-${employeeId}"`
			}></div>`
		isEmptyDay ? '' : (day = day + 1)
		return dayContent
	}

	return {
		getYear: id => {
			employeeId = id
			let yearContent = ''
			const getYearContent = (i = 0) => {
				if (i < 12) {
					yearContent += returnOneMonth(i)
					getYearContent(i + 1)
				}
			}
			getYearContent()
			return yearContent
		}
	}
}
