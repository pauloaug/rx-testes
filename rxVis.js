module.exports = function () {

			var my = {},
			counter = 0,
			y0 = 50,
			svgExists = false,
			width = 800,
			height = 400,
			x0 = width * 0.8;
			lanesGap = function(){ return height/13 }
			minHW = d3.min([height,width])

			function newData(d, y, type) {

				// var d = my.appendMD5(data);

				// var x0 = width * 0.9;
				var y0 = y * lanesGap();
				var text = d.data.toString().substring(0,5);
				// console.log(text, d, parseInt( d.md5, 16 ));
				// console.log(d);

				var grupo = d3.select("svg g")
				.append("g")
				.attr("transform", `translate(${x0 + step}, ${y0})`);

				switch(type) {

					case "completed":
						grupo.append("line")
						.attr("stroke-width", "3")
						.attr("stroke", "black")
						.attr("x1", minHW/10)
						.attr("y1", -minHW/40)
						.attr("x2", minHW/10)
						.attr("y2", minHW/40);
					break;

					case "error":
						var g2 = grupo.append("g")
						// .attr("transform", `translate(${x0 + step + 2}, ${y0})`);

						var line1 = g2.append("line")
						.attr("dx", minHW/20)
						.attr("stroke-width", "3")
						.attr("stroke", "red")
						.attr("x1", -minHW/40 + minHW/10)
						.attr("y1", -minHW/40)
						.attr("x2", minHW/40  + minHW/10)
						.attr("y2", minHW/40);

						var line2 = g2.append("line")
						.attr("stroke-width", "3")
						.attr("stroke", "red")
						.attr("x1", -minHW/40 + minHW/10)
						.attr("y1", minHW/40)
						.attr("x2", minHW/40 + minHW/10)
						.attr("y2", -minHW/40);
					break;

					default:
						grupo.append("circle")
						.attr("r", minHW / 30)
						.attr("stroke-width", "1")
						.attr("stroke", "black")
						.attr("fill", color( parseInt( d.md5, 16 ) ));
							// .attr("fill", color(Math.random() * 10 | 0));

							grupo.append("text")
							.text(text)
							.attr("font-size", `${ (minHW / 500 ) * (1.5 - (0.15 * text.length))}em`)
							.attr("dy","0.35em")
							.attr("dx", `${-0.3 * text.length}em`);
						} 

				// return grupo.node();
				}	

			function grid () {
				var svg = d3.select("svg");

				for (var i = 0; i < Math.ceil(x0/10); i++) {
					svg.append("line")
					// .attr("id", `line${i}`)
					.attr("stroke-width", "1")
					.attr("stroke", "lightgrey")
					.attr("stroke-dasharray", 5)
					.attr("x1", x0/10 * i)
					.attr("y1", 0)
					.attr("x2", x0/10 * i)
					.attr("y2", height);
				}

				for (var i = 0; i < Math.floor(lanesGap()); i++) {
					svg.append("line")
					.attr("id", `line${i}`)
					.attr("stroke-width", "2")
					.attr("stroke", "grey")
					.attr("x1", 0)
					.attr("y1", lanesGap() * i)
					.attr("x2", x0)
					.attr("y2", lanesGap() * i)
					.attr("visibility", "hidden");
				}
			}


			function start () {
				if (!svgExists) {
					if (!d3.select("#rxVisSVG").node()) {
						svgExists = true;
						var div = d3.select("body").append("div")
						.attr("class", "rxVis");
						
						var svg = div.append("svg")
						.attr("class", "rxVisSVG")
						.attr("width", width)
						.attr("height", height);
						
						grid();

						svg.append("g").attr("class","g1");

						interval
						.subscribe( d => {
							var g1 = d3.select("svg g");
							g1.attr("transform", function(e){
								return `translate(${-d})`
							});
						});
					}
				}	
			}

			my.visualize = function( stream ) {
				
				start();

				var foo = 0;

				stream_MD5 = stream.map( my.appendMD5 );

				stream_MD5.first().subscribe( x=> {
					foo = ++counter;
					d3.select(`#line${counter}`)
					.attr("visibility", "visible");
				});
				
				stream_MD5.subscribe(
					function (x) {
						newData(x,foo)
					},
					function (err) {
						console.log('Error: %s', err);
						newData({"data": "foo"}, foo, "error");

					},
					function () {
						// console.log('Completed')

						var obj = {
							"data": "aaa"
						// "md5": md5( x.toString() )
						// "time": Date.now()
					}
					newData(obj, foo, "completed");
				}
				);
			}

			my.appendMD5 = function( d ) {
				var obj = d;
				console.log(d, d.md5);

				if ( !d.md5 ) {	
					obj = {
						"data": d,
						// "md5": md5( d.toString() ).toString().substring(0,5)
						"md5": md5( d.toString() ).toString().substring(0,5)
					};
					console.log(obj);
				}
				return obj;  
			}

			return my;

		};