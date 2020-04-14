function Employee() {
	let employeesArray = []

	const addToContainer = (content, containerSelector) => {
		const container = document.querySelector(containerSelector)
		container.innerHTML += content
	}

	const displayEmployees = employees => {
		employeesArray = employees
		addToContainer(getEmployeesContent(), '.js-vacation-table')
	}

	const getEmployeesContent = () =>
		employeesArray.map(item => `<tr> ${getContentOneEmployee(item) + calendar.getYear(item.id)} </tr>`).join('')

	const getContentOneEmployee = employee => {
		let { name, img, vacationDaysCount } = employee
		return `<td>
					<img class="vacation__employee-photo" src="${img}" alt="Employee image" />
					<div class="vacation__employee-name">${name}</div>
				</td>
				<td>${vacationDaysCount}/28</td>`
	}

	const displayEmployeesEvents = () => {
		employeesArray.forEach(employee => addEventsToCalendar(employee))
	}

	const addEventsToCalendar = employee => {
		const { id, events } = employee
		events.forEach(event => addOneEvent(event, id))
	}

	const addOneEvent = (event, employeeId) => {
		let { id, name, dateStart, dateEnd } = event,
			dateStartEvent = dateStart.split('.').map(parseFloat),
			dateEndEvent = dateEnd.split('.').map(parseFloat),
			startDay = dateStartEvent[0],
			startMonth = dateStartEvent[1],
			endDay = dateEndEvent[0],
			endMonth = dateEndEvent[1]

		const findDayContainer = (day, month) => document.querySelector(`.js-day-${day}-${month - 1}-${employeeId}`)

		const addEventClassAndAttribute = (dayContainer, month) => {
			dayContainer.classList.add(`calendar__day--${name}`)
			dayContainer.setAttribute('data-event-id', `${employeeId}-${id}-${month}`)
		}

		if (startMonth === endMonth) {
			for (let i = startDay; i <= endDay; i++) {
				addEventClassAndAttribute(findDayContainer(i, startMonth), startMonth - 1)
			}
		} else {
			for (let i = startDay; i <= 31; i++) {
				const dayContainer = findDayContainer(i, startMonth)

				if (dayContainer) {
					addEventClassAndAttribute(dayContainer, startMonth - 1)
				}
			}
			for (let i = 1; i <= endDay; i++) {
				addEventClassAndAttribute(findDayContainer(i, endMonth), endMonth - 1)
			}
		}
	}

	const getCalendarEventContent = (employeeInformation, eventInformation) => {
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
						<div class="calendar-event__name">${getEventName(eventName)}</div>
					</div>
				</div>`
	}

	const getEventName = name => {
		return name === 'vacation'
			? 'отпуск'
			: name === 'red'
			? 'красная метка'
			: name === 'yellow'
			? 'желтая метка'
			: ''
	}

	return {
		loadEmployee: () => {
			fetch('https://dzadranik.github.io/i-dex/src/json/vacation-calendar.json')
				.then(response => response.json())
				.then(employees => {
					displayEmployees(employees)
					displayEmployeesEvents()
				})
		},
		displayEventInformation: eventId => {
			//eventId[day, month, employeeId]
			let eventIdArray = eventId.split('-').map(parseFloat),
				eventDay = eventIdArray[0],
				eventMonth = eventIdArray[1],
				eventEmployeeId = eventIdArray[2],
				employeeInformation = employeesArray.find(item => item.id === eventDay),
				eventInformation = employeeInformation.events.find(event => event.id === eventMonth)

			addToContainer(
				getCalendarEventContent(employeeInformation, eventInformation),
				`.js-month-${employeeInformation.id}-${eventEmployeeId}`
			)
		}
	}
}

function Calendar() {
	let daysInMonth, firstDay, month, employeeId, day, today, todayMonth
	// daysInMonth-количество дней в месяце,
	// firstDay-день недели первого дня,
	// month-индекс месяца,
	// employeeId- id сотрудника для формирования js-month-** класса,
	// day- счетчик дней

	const setEmployeeId = id => {
		return (employeeId = id)
	}

	const setMonthInformation = monthIndex => {
		let todayDate = new Date()
		today = todayDate.getDate()
		todayMonth = todayDate.getMonth()
		month = monthIndex
		daysInMonth = new Date(2020, monthIndex + 1, 0).getDate()
		let frD = new Date(2020, monthIndex, 1).getDay()
		frD === 0 ? (firstDay = 6) : (firstDay = frD - 1) //сделать отсчет дней недели с понедельника
	}

	const getYearContent = (i = 0, content = '') => {
		if (i < 12) {
			content += getOneMonth(i)
			return getYearContent(i + 1, content)
		} else {
			return content
		}
	}

	const getOneMonth = m => {
		day = 1
		setMonthInformation(m)
		//js-month-{employeeId}-{month} формируется класс для поиска дня => отобразить event
		return `<td>
					<div class="calendar__month js-month-${employeeId}-${m}"> 
						${getWeeks()}
					</div>
				</td>`
	}

	const getWeeks = (i = 0, content = '') => {
		if (day <= daysInMonth) {
			content += getOneWeek()
			return getWeeks(i + 1, content)
		} else {
			return content
		}
	}

	const getOneWeek = () => {
		return `<div class="calendar__week">
					${getDays()}
				</div>`
	}

	const getDays = (i = 0, daysContent = '') => {
		if (i < 7) {
			if ((firstDay > 0 && day < 7) || day > daysInMonth) {
				daysContent += getOneDay('calendar__empty')
				firstDay--
			} else {
				daysContent += getOneDay('calendar__day')
			}
			return getDays(i + 1, daysContent)
		}
		return daysContent
	}

	const getIsLastDay = () => {
		if (todayMonth < month) {
			return false
		}
		if (todayMonth === month) {
			return day < today
		}
		return true
	}

	const getOneDay = dayClass => {
		let isEmptyDay = dayClass === 'calendar__empty',
			isLastDay = getIsLastDay()
		!isEmptyDay ? day++ : ''
		//чтобы не вводить лишнюю переменную сначала прибавить день, а в формировании класса его вычесть
		return `<div class="${dayClass} ${!isEmptyDay ? `js-day-${day - 1}-${month}-${employeeId}` : ``} ${
			isLastDay && !isEmptyDay ? 'calendar__day--last' : ''
		}" ></div>`
	}

	return {
		getYear: id => {
			setEmployeeId(id)
			return getYearContent()
		}
	}
}

const employee = new Employee(),
	calendar = new Calendar()

window.addEventListener('load', () => {
	const eventContainer = document.querySelector('.js-vacation-table')

	eventContainer.addEventListener('mouseover', event => {
		if (event.target.dataset.eventId && event.target.dataset.eventId !== event.relatedTarget.dataset.eventId)
			employee.displayEventInformation(event.target.dataset.eventId)
		//event.relatedTarget проверка чтобы при движении из консоли не вылетала ошибка
		if (event.relatedTarget && event.relatedTarget.dataset.eventId && !event.target.dataset.eventId) {
			document.querySelector('.js-vacation-table .calendar-event').remove()
		}
	})
})
employee.loadEmployee()
