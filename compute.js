/* Compute */
/* Parsing */
var fs = require("fs")
var data = JSON.parse(fs.readFileSync("/ax/data.json", "utf-8"))
var system = JSON.parse(fs.readFileSync("/ax/system_out.json", "utf-8"))
var types_lib = JSON.parse(fs.readFileSync("/ax/types_lib.json", "utf-8"))
var prototype = JSON.parse(fs.readFileSync("/ax/prototype.json", "utf-8"))
console.log("[____compute_loaded___]")

/* Objects Parsing */
let ElementsArray = []
let NamesArray = []
let get_element = (type, key) => {
	let GetElementArray = []
	let Element = "let " + data[key]["id"] + " = document.createElement(\"" + type + "\")"
	GetElementArray.push(Element)
	let inner_string = (field) => { return "\"" + field + "\"" }
	let Attributes = (fcode) => {
		return ".setAttribute(" + inner_string(fcode) + "," + inner_string(data[key][fcode]) + ")"
	}
	for (let field in data[key])
	{
		if (field != "type") {
			GetElementArray.push(data[key]["id"] + Attributes(field))
		}
	}
	if ("parent" in data[key]) {
		if (data[key]["parent"] != "GLOBAL") {
			if (NamesArray.includes(data[key]["parent"])) {
				GetElementArray.push(data[key]["parent"] + ".appendChild(" + data[key]["id"] + ")")
			} else {
				console.log("<!> there is no parent " + data[key]["parent"])
				console.log(key + "\'s been upcast to body")
				GetElementArray.push("document.body.appendChild(" + data[key]["id"] + ")")
			}
		} else {
			GetElementArray.push("document.body.appendChild(" + data[key]["id"] + ")")
		}
	} else {
		GetElementArray.push("document.body.appendChild(" + data[key]["id"] + ")")
	}
	return GetElementArray
}
for (let key in data)
{
	if ("id" in data[key] && !("name" in data[key])) {
		ElementsArray.push(get_element(data[key]["type"], key))
		NamesArray.push(key)
	}
}
console.log("[____objects_parsed___]")

/* Output */
let get_output_line = () => {
	let OneLiner = {}
	for (let i = 0; i < NamesArray.length; i++)
	{
		let pair = { [NamesArray[i]] : ElementsArray[i] }
		OneLiner = { ...OneLiner, ...pair }
	}
	return OneLiner
}

let ObjectAsJSON = JSON.stringify(get_output_line())

fs.writeFile("compute_out.json", ObjectAsJSON, function (err) {
	if (err) return console.log(err)
	console.log("[_compute_out_success_]")
})