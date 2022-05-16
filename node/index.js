//var fs = require('fs');
var addEvent = function() {
    $('span[contenteditable="true"]').each(function() {
        $(this).keyup(function() {
            console.log($(this).text());
            $(this).parent().attr("v", $(this).text());
        });
    });
    //$("table tr");//$($($("table tr")[100]).find("td")[2]).attr("v");
	var return_tr = undefined;
    $("table tr").each(function() {
        var td = document.createElement('td');
        var button = document.createElement('button');
        button.onclick = function () {
            //console.log($(this));
            var ip = '';
            var user_name = '';
            var user_pass = '';
            var root_name = '';
            var root_pass = '';
            var system = '';
            var port = '';
			return_tr = $(this).parent().parent();
            return_tr.find("td").each(function(index) {
                var id = $(this).attr("id");
                console.log(id);
                if(id) {
                    if(id.indexOf('sjs-G') == 0) {
                        ip = $(this).attr("v");
                    } else if(id.indexOf('sjs-H') == 0) {
                        user_name = $(this).attr("v");
                    } else if(id.indexOf('sjs-I') == 0) {
                        user_pass = $(this).attr("v");
                    } else if(id.indexOf('sjs-J') == 0) {
                        root_name = $(this).attr("v");
                    } else if(id.indexOf('sjs-K') == 0) {
                        root_pass = $(this).attr("v");
                    } else if(id.indexOf('sjs-N') == 0) {
                        system = $(this).attr("v");
                    } else if(id.indexOf('sjs-AD') == 0) {
                        port = $(this).attr("v");
                    }
                }
            });
            console.log('ip', ip);
            console.log('user_name', user_name);
            console.log('user_pass', user_pass);
            console.log('root_name', root_name);
            console.log('root_pass', root_pass);
            console.log('system', system);
            console.log('port', port);
            $.ajax({
                dataType: "json",
                url: "getCPUInfo.json",
                data: {
                    ip,
                    user_name,
                    user_pass,
                    root_name,
                    root_pass,
                    system,
                    port,
                },
                success: function(response) {
                    console.log(response);
					if(response.code == 200) {
						return_tr.css("background-color", "#FBEEE6");
						return_tr.find("td").each(function(index) {
							var id = $(this).attr("id");
							console.log(id);
							if(id) {
								if(id.indexOf('sjs-N') == 0 && response.msg.vv !== undefined) {
									$(this).attr("v", response.msg.vv);
									$(this).find('span').text(response.msg.vv);
								} else if(id.indexOf('sjs-AF') == 0 && response.msg.port !== undefined) {
									$(this).attr("v", response.msg.port);
									$(this).find('span').text(response.msg.port);
								} else if(id.indexOf('sjs-P') == 0 && response.msg.tomcat_count !== undefined && response.msg.tomcat_count !== '0') {
									$(this).attr("v", response.msg.tomcat_count);
									$(this).find('span').text(response.msg.tomcat_count);
								} else if(id.indexOf('sjs-Q') == 0 && response.msg.weblogic_count !== undefined && response.msg.weblogic_count !== '0') {
									$(this).attr("v", response.msg.weblogic_count);
									$(this).find('span').text(response.msg.weblogic_count);
								} else if(id.indexOf('sjs-R') == 0 && response.msg.wlserver_version !== undefined) {
									$(this).attr("v", response.msg.wlserver_version);
									$(this).find('span').text(response.msg.wlserver_version);
								} else if(id.indexOf('sjs-S') == 0 && response.msg.java_count !== undefined) {
									$(this).attr("v", response.msg.java_count && response.msg.java_count !== undefined && response.msg.java_count != '0');
									$(this).find('span').text(response.msg.java_count);
								} else if(id.indexOf('sjs-T') == 0 && response.msg.java_version !== undefined) {
									$(this).attr("v", response.msg.java_version);
									$(this).find('span').text(response.msg.java_version);
								} else if(id.indexOf('sjs-U') == 0 && response.msg.mysql_count !== undefined && response.msg.mysql_count != '0') {
									$(this).attr("v", response.msg.mysql_count);
									$(this).find('span').text(response.msg.mysql_count);
								} else if(id.indexOf('sjs-V') == 0 && response.msg.redis_count !== undefined && response.msg.redis_count !== '0') {
									$(this).attr("v", response.msg.redis_count);
									$(this).find('span').text(response.msg.redis_count);
								} else if(id.indexOf('sjs-W') == 0 && response.msg.mongo_count !== undefined && response.msg.mongo_count !== '0') {
									$(this).attr("v", response.msg.mongo_count);
									$(this).find('span').text(response.msg.mongo_count);
								} else if(id.indexOf('sjs-X') == 0 && response.msg.memcache_count !== undefined && response.msg.memcache_count !== '0') {
									$(this).attr("v", response.msg.memcache_count);
									$(this).find('span').text(response.msg.memcache_count);
								} else if(id.indexOf('sjs-Y') == 0 && response.msg.nginx_count !== undefined && response.msg.nginx_count !== '0') {
									$(this).attr("v", response.msg.nginx_count);
									$(this).find('span').text(response.msg.nginx_count);
								} else if(id.indexOf('sjs-AG') == 0 && response.msg.cpu !== undefined) {
									$(this).attr("v", response.msg.cpu);
									$(this).find('span').text(response.msg.cpu);
								} else if(id.indexOf('sjs-AH') == 0 && response.msg.memory !== undefined) {
									$(this).attr("v", response.msg.memory);
									$(this).find('span').text(response.msg.memory);
								} else if(id.indexOf('sjs-AI') == 0 && response.msg.disk_use !== undefined) {
									$(this).attr("v", response.msg.disk_use);
									$(this).find('span').text(response.msg.disk_use);
								} else if(id.indexOf('sjs-AJ') == 0 && response.msg.disk !== undefined) {
									$(this).attr("v", response.msg.disk);
									$(this).find('span').text(response.msg.disk);
								}
							}
						});	
					}
                },
                error: function(response) {
                    console.log(response);
                }
            });
        };
        button.innerText = '获取';
        td.appendChild(button);
        this.appendChild(td);
    });
    console.log('结束');
};

var process_wb = (function() {
	var HTMLOUT = document.getElementById('htmlout');
	var XPORT = document.getElementById('xport');

	return function process_wb(wb) {
		XPORT.disabled = false;
		HTMLOUT.innerHTML = "";
		wb.SheetNames.forEach(function(sheetName) {
			var htmlstr = XLSX.utils.sheet_to_html(wb.Sheets[sheetName],{editable:true});
			HTMLOUT.innerHTML += htmlstr;
		});
		addEvent();
	};
})();

var do_file = (function() {
	return function do_file(files) {
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			data = new Uint8Array(data);
			process_wb(XLSX.read(data, {type: 'array'}));
		};
		reader.readAsArrayBuffer(f);
	};
})();

(function() {
	var drop = document.getElementById('drop');

	function handleDrop(e) {
		e.stopPropagation();
		e.preventDefault();
		do_file(e.dataTransfer.files);
	}

	function handleDragover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	}

	drop.addEventListener('dragenter', handleDragover, false);
	drop.addEventListener('dragover', handleDragover, false);
	drop.addEventListener('drop', handleDrop, false);
})();

(function() {
	var xlf = document.getElementById('xlf');
	function handleFile(e) { do_file(e.target.files); }
	xlf.addEventListener('change', handleFile, false);
})();

var export_xlsx = (function() {
	var wb = XLSX.utils.table_to_book(document.getElementById("htmlout"));
	XLSX.writeFile(wb, "sheetjs.xlsx");
//	/* pre-build the nwsaveas input element */
//	var HTMLOUT = document.getElementById('htmlout');
//	var input = document.createElement('input');
//	input.style.display = 'none';
//	input.setAttribute('nwsaveas', 'sheetjs.xlsx');
//	input.setAttribute('type', 'file');
//	document.body.appendChild(input);
//	input.addEventListener('cancel',function(){ alert("Save was canceled!"); });
//	input.addEventListener('change',function(e){
//		var filename=this.value, bookType=(filename.match(/[^\.]*$/)||["xlsx"])[0];
//		var wb = XLSX.utils.table_to_book(HTMLOUT);
//		var wbout = XLSX.write(wb, {type:'buffer', bookType:bookType});
//		fs.writeFile(filename, wbout, function(err) {
//			if(!err) return alert("Saved to " + filename);
//			alert("Error: " + (err.message || err));
//		});
//	});
//
//	return function() { input.click(); };
});
