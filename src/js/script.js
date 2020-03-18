const getDay = () => `<div class="day day--blue"></div>`

const getWeek = () => {
	let days = ''
	const getDays = (i = 0) => {
		if (i < 7) {
			days += getDay()
			getDays(i + 1)
		}
	}
	getDays()
	return `<div class="week">
                ${days}
            </div>`
}

const getMonth = amountWeek => {
	let month = ''
	const getWeeks = (i = 0) => {
		if (i < amountWeek) {
			month += getWeek()
			getWeeks(i + 1)
		}
	}
	getWeeks()
	return month
}

const month = getMonth(4)
