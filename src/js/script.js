const { loadEmployee, loadEventInformation } = Employee(),
	{ getYear } = Calendar()

const eventContainer = document.querySelector('.js-vacation-table')
eventContainer.addEventListener('mouseover', event => {
	if (
		event.target.hasAttribute('data-event-id') &&
		event.target.hasAttribute('data-event-id') !== event.relatedTarget.hasAttribute('data-event-id')
	)
		loadEventInformation(event.target.getAttribute('data-event-id'))
})
eventContainer.addEventListener('mouseover', event => {
	if (event.relatedTarget.hasAttribute('data-event-id') && !event.target.hasAttribute('data-event-id')) {
		document.querySelector('.js-vacation-table .calendar-event').remove()
	}
})

loadEmployee()

function Employee() {
	let employeeData = []

	const getEmployee = data => {
		employeeData = data
		addToContainer(getEmployeeContent(data), '.js-vacation-table')
		data.forEach(element => addEventsToCalendar(element))
	}

	const getEmployeeContent = data =>
		data
			.map(item => `<tr employee-id="${item.id}"> ${getContentOneEmployee(item) + getYear(item.id)} </tr>`)
			.join('')

	const getContentOneEmployee = data => {
		let { name, img } = data
		return `<td>
					<img class="vacation__employee-photo" src="${img}" alt="Employee image" />
					<div class="vacation__employee-name">${name}</div>
				</td>
				<td>${data.vacationDaysCount}/28</td>`
	}

	const addToContainer = (content, containerSelector) => {
		const container = document.querySelector(containerSelector)
		container.innerHTML += content
	}

	const addEventsToCalendar = data => {
		const { id, events } = data
		events.forEach(event => addOneEventOneEmployee(event, id))
	}

	const addOneEventOneEmployee = (data, employeeId) => {
		let { id, dateStart, dateEnd, name } = data,
			dateStartEvent = dateStart.split('.').map(parseFloat),
			dateEndEvent = dateEnd.split('.').map(parseFloat),
			startDay = dateStartEvent[0],
			startMonth = dateStartEvent[1],
			endDay = dateEndEvent[0],
			endMonth = dateEndEvent[1]

		const findDayContainer = (day, month) =>
			document.querySelector(`[data-day="${day}-${month - 1}-${employeeId}"]`)

		const addEventClassAndEventId = (dayContainer, month) => {
			dayContainer.classList.add(`calendar__day--${name}`)
			dayContainer.setAttribute('data-event-id', `${employeeId}-${id}-${month}`)
		}

		if (startMonth === endMonth) {
			for (let i = startDay; i <= endDay; i++) {
				addEventClassAndEventId(findDayContainer(i, startMonth), startMonth - 1)
			}
		} else {
			for (let i = startDay; i <= 31; i++) {
				const dayContainer = findDayContainer(i, startMonth)

				if (dayContainer) {
					addEventClassAndEventId(dayContainer, startMonth - 1)
				}
			}
			for (let i = 1; i <= endDay; i++) {
				addEventClassAndEventId(findDayContainer(i, endMonth), endMonth - 1)
			}
		}
	}

	const getCalendarEvent = (employeeInformation, eventInformation) => {
		const { name, img } = employeeInformation,
			{ name: eventName, dateStart, dateEnd } = eventInformation
		return `<div class="calendar-event">
					<div class="calendar-event__employee">
						<img class="calendar-event__employee-photo" src="${img}" alt="Employee image">
						<div class="calendar-event__employee-name">${name}</div>
					</div>
					<div class="calendar-event__information">
						<div class="calendar-event__date calendar-event__date--${eventName}">
							${dateStart}.2020 — ${dateEnd}.2020 (14д.)
						</div>
						<div class="calendar-event__name">отпуск</div>
					</div>
				</div>`
	}

	return {
		loadEmployee: () => {
			fetch('https://dzadranik.github.io/i-dex/src/js/vacation-calendar.json')
				.then(response => response.json())
				.then(data => getEmployee(data))
		},
		loadEventInformation: eventId => {
			let eventData = eventId.split('-').map(parseFloat)
			let employeeInformation = employeeData.find(item => item.id === eventData[0]),
				eventInformation = employeeInformation.events.find(event => event.id === eventData[1])
			addToContainer(
				getCalendarEvent(employeeInformation, eventInformation),
				`.js-month-${employeeInformation.id}-${eventData[2]}`
			)
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
					<div class="calendar__month js-month-${employeeId}-${m}">
						${monthContain}
					</div>
				</td>`
	}

	const setMonthData = monthIndex => {
		month = monthIndex
		daysInMonth = new Date(2020, monthIndex + 1, 0).getDate()
		let frD = new Date(2020, monthIndex, 1).getDay()
		frD === 0 ? (firstDay = 6) : (firstDay = frD - 1)
	}

	const getOneWeek = weekNumber => {
		let daysContent = '',
			getDays = (firstDay, i = 0) => {
				if (i < 7) {
					if ((firstDay > 0 && weekNumber === 0) || day > daysInMonth) {
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
		let isEmptyDay = dayClass === 'calendar__empty',
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
