const { returnMonth } = Calendar()

const container = document.querySelector('.js-get-month')
let month = ''
for (let i = 0; i < 12; i++) {
	container.innerHTML += returnMonth(i)
}

function Calendar() {
	let daysInMonth, firstDay, day

	const setMonth = month => {
		let frD
		daysInMonth = new Date(2020, month + 1, 0).getDate()
		frD = new Date(2020, month, 1).getDay()
		frD == 0 ? (firstDay = 6) : (firstDay = frD - 1)
	}

	const returnDay = dayClass => {
		let isDay = dayClass == 'calendar__day',
			days = `<div class="${dayClass}">${isDay ? day : ''}</div>`
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
			setMonth(m)

			let monthContain = ''
			const getWeeks = (i = 0) => {
				if (day <= daysInMonth) {
					monthContain += returnWeek(i)
					getWeeks(i + 1)
				}
			}
			getWeeks()
			return `<div calendar-month="${m}" class="calendar__month">
						${monthContain}
					</div>`
		}
	}
}
