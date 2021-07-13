/* Preparing for output */
const set = []

/* Parsing */
var fs = require('fs')
var prototype = JSON.parse(fs.readFileSync("/ax/prototype.json", "utf-8"))
var data = JSON.parse(fs.readFileSync("/ax/data.json", "utf-8"))

/* Fetching prototypes */
let get_length = (object) => {
	return Object.keys(object).length
}
let get_prototype = (type) => {
	if (type in prototype)
	{
		return prototype[type]
	} else {
		console.log("unhappy in get_prototype")
	}
}

/* Requests */
let block_prototype = get_prototype("block")
let event_prototype = get_prototype("event")

/* Enumerate data */
let data_length = get_length(data)
let data_headers = []
let enumerate = 1
for (let key in data)
{
	let constructor = {}
	let current_key_length = get_length(key)
	let current_priority = (current_key_length >= 3) ? 0 : 1
	constructor.name = key
	constructor.priority = current_priority
	constructor.enumerate = enumerate
	enumerate++
	data_headers.push(constructor)
}
console.log(data_headers)