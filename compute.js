/* Compute */
/* Loading */
var fs = require("fs")
var data = JSON.parse(fs.readFileSync("/ax/data.json", "utf-8"))
var system = JSON.parse(fs.readFileSync("/ax/system_out.json", "utf-8"))

/* Templates */
let Templates = []
let get_template = (type) => {
	return "document.createElement(\"" + type + "\")"
}
for (let key in data)
{
	if ("type" in data[key]) {
		console.log(get_template(data[key]["type"]))
	}
}