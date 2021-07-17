/* System */
/* Parsing */
var fs = require("fs")
var prototype = JSON.parse(fs.readFileSync("/ax/prototype.json", "utf-8"))
var data = JSON.parse(fs.readFileSync("/ax/data.json", "utf-8"))
var block_types = JSON.parse(fs.readFileSync("/ax/types_lib.json", "utf-8"))
console.log("[________loaded_______]")

/* Fetching prototypes */
let get_length = (object) => { return Object.keys(object).length }
let get_prototype = (type) => { return prototype[type] }

/* Requests */
let block_prototype = get_prototype("block")
let event_prototype = get_prototype("event")

/* Check integrity by prototype */
let UNREPEATED_ITEMS = []
let integrity = (data, block_prototype, event_prototype) => {
	let flag = true
	for (let key in data)
	{
		if (UNREPEATED_ITEMS.length > 0) {
			/* Check for repeating items */
			if (UNREPEATED_ITEMS.includes(key) || UNREPEATED_ITEMS.includes(data[key]["id"])) {
				console.log("<!> repeated key or id in key " + key + " with id " + data[key]["id"])
				flag = false
				return flag
			} else {
				UNREPEATED_ITEMS.push(key)
				UNREPEATED_ITEMS.push(data[key]["id"])
			}
		} else {
			UNREPEATED_ITEMS.push(key)
			UNREPEATED_ITEMS.push(data[key]["id"])
		}
		if ("id" in data[key] && !("name" in data[key])) {
			/* Check if block */
			if (Object.keys(data[key]).length <= 1) {
				/* Check if more than 1 parameter presented */
				console.log("<!> invalid length of object in " + key)
				flag = false
				return flag
			}
			if (!("type" in data[key])) {
				/* Check if type presented in data[key] */
				console.log("<!> no type presented in " + key)
				flag = false
				return flag
			}
			for (let field in data[key])
			{
				if (data[key][field].length == 0) {
					/* Check if field is of 0 length */
					console.log("<!> length must be at least 1 char in " + field + " in " + key)
					flag = false
					return flag
				}
				if (!(isNaN(data[key][field][0]))) {
					/* Check if begins with char */
					console.log("<!> must begin with char type in " + field + " in " + key)
					flag = false
					return flag
				}
				if (!(field in block_prototype)) {
					/* Check if field presented in ptorotype */
					console.log("<!> bad parameter in " + key + " block declaration: " + field)
					flag = false
					return flag
				} else {
					if (field == "type" && !(data[key][field] in block_types["block_types"])) {
						/* Check if type presented in prototype */
						console.log("<!> bad type in " + key + " block declaration: " + data[key][field])
						flag = false
						return flag
					}
				}
			}
		} else if ("name" in data[key] && !("id" in data[key])) {
			/* Check if event */
			for (let field in data[key])
			{
				if (!(field in event_prototype)) {
					console.log("<!> bad parameter in " + key + " event declaration: " + field)
					flag = false
					return flag
				}
			}
		} else {
			console.log("<!> unmatching prototype in integrity")
			flag = false
		}
	}
	return flag
}
if (Object.keys(data).length == 0) {
	console.log("<!> data is empty")
	return
}
if (integrity(data, block_prototype, event_prototype)) 
{
	console.log("[__integrity_checked__]")
} else {
	console.log("[____bad_integrity____]")
	return
}

/* Enumerate data */
let data_headers = []
let enumerate = 1
for (let key in data)
{
	let constructor = {}
	let current_key_length = get_length(data[key])
	let current_priority = (current_key_length >= 3) ? 0 : 1
	constructor.name = key
	constructor.priority = current_priority
	constructor.enumerate = enumerate
	enumerate++
	data_headers.push(constructor)
}
console.log("[_headers_constructed_]")
for (let i = 0; i < data_headers.length; i++)
{
	let locin = JSON.stringify(data_headers[i])
	let concat = "\"" + i + "\"\:"
	data_headers[i] = concat + locin
}
let concat_all = ""
for (let i = 0; i < data_headers.length; i++)
{
	if (i === 0) concat_all += "{"
	concat_all += data_headers[i]
	if (i < data_headers.length-1) concat_all += ","
	if (i === data_headers.length-1) concat_all += "}"
}

fs.writeFile("system_out.json", concat_all, function (err) {
	if (err) return console.log(err)
  console.log("[__system_out_success_]")
})