const { returnMonth } = Calendar()

const container = document.querySelector('.js-get-month ')
const month = returnMonth(3)
container.innerHTML = month

function Calendar() {
	let daysInMonth,
		firstDay,
		day = 1

	const setMonth = month => {
		let frD
		daysInMonth = new Date(2020, month + 1, 0).getDate()
		frD = new Date(2020, month, 1).getDay()
		frD == 0 ? (firstDay = 6) : (firstDay = frD - 1)
	}

	const returnDay = noDay => {
		let days = `<div class="calendar__day ${noDay || day > daysInMonth ? '' : 'calendar__day--blue'}">${
			noDay || day > daysInMonth ? '' : day
		}</div>`
		noDay ? '' : (day = day + 1)
		return days
	}

	const returnWeek = iteration => {
		let days = ''
		let getDays = (firstDay, i = 0) => {
			if (i < 7) {
				if (firstDay > 0 && iteration == 0) {
					days += returnDay('true')
				} else {
					days += returnDay()
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
			setMonth(m)

			let monthContain = ''
			const getWeeks = (i = 0) => {
				if (day < daysInMonth) {
					monthContain += returnWeek(i)
					getWeeks(i + 1)
				}
			}
			getWeeks()
			return `<div data-month="${m}" class="calendar__month">
						${monthContain}
					</div>`
		}
	}
}
