/* Draw */
/* Parsing */
var fs = require("fs")
var computed = JSON.parse(fs.readFileSync("/ax/compute_out.json", "utf-8"))
var types_lib = JSON.parse(fs.readFileSync("/ax/types_lib.json", "utf-8"))
console.log("[_____draw_loaded_____]")

let insert_tab = () => { return "\t" }
let insert_NL = () => { return "\n" }

let get_concated = (computed) => {
	let zapzap = ""
	zapzap += "<head>" + insert_NL() + insert_tab() + "<script type=\"text/javascript\">" + insert_NL() + insert_tab() + "window.onload = (function(){" + insert_NL()
	for (let key in computed)
	{
		for (let i in computed[key])
		{
			zapzap += insert_tab() + insert_tab() + computed[key][i] + insert_NL()
		}
	}
	zapzap += insert_tab() + "})" + insert_NL() + insert_tab() + "</script>" + insert_NL() + "</head>" + insert_NL() + "<body>" + insert_NL() + "</body>" + insert_NL()
	return zapzap
}

fs.writeFile("index.html", get_concated(computed), function (err) {
	if (err) return console.log(err)
	console.log("[_____html_created____]")
})