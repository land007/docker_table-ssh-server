//var fs = require('fs');
var ajaxget = false;
var ajaxgetTimeout;
var getCPUInfo = function(user_name, user_pass, root_name, root_pass, system, ip, port, return_tr) {
    if(user_name == undefined && root_name == undefined && user_pass == undefined && root_pass == undefined) {
        $('button')[index + 1].click();
        return;
    }
    console.log('system', system);
    console.log('port', port);
    if(port == undefined && port == '3389' && port == '33890' && port == '65089'  && port == '63389') {
        $('button')[index + 1].click();
        return;
    }
//			if(user_name == 'msa') {
//				user_name = '';
//				user_pass = '';
//			}
    if(ajaxget) {
        console.log('ajax zhong...');
        return;
    }
    ajaxget = true;
    // if(ajaxgetTimeout) {
        // clearTimeout(ajaxgetTimeout);
    // }
    // ajaxgetTimeout = setTimeout(function() {
        // ajaxget = false;
        // ajaxgetTimeout = undefined;
        // $('button')[index + 1].click();
    // }, 20000);
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
            ajaxget = false;
            console.log(response);
            if(response.code == 200) {
                if(response.msg.msg) {
                    console.log('response.msg.msg', response.msg.msg);
                    //$('button')[index + 1].click();
                    return;
                }
                return_tr.css("background-color", "#FBEEE6");
                return_tr.find("td").each(function(index) {
                    var id = $(this).attr("id");
                    //console.log(id);
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
                        } else if(id.indexOf('sjs-AN') == 0) {
                            if(response.msg.cpu) {
                                let time = moment().format('YYYY-MM-DD hh:mm:ss');
                                $(this).attr("v", time);
                                $(this).find('span').text(time);
                            }
                        } else if(id.indexOf('sjs-I') == 0) {
                            if(response.msg.passwd) {
                                $(this).attr("v", response.msg.passwd);
                                $(this).find('span').text(response.msg.passwd);
                            }
                        }
                    }
                });
                //$('button')[index + 1].click();
            }
        },
        error: function(response) {
            ajaxget = false;
            //$('button')[index + 1].click();
            console.log(response);
        }
    });
};
var telnet = function(ip, port, button) {
    $.ajax({
        dataType: "json",
        url: "telnet.json",
        data: {
            ip,
            port,
        },
        success: function(response) {
            console.log(response);
            if(response.code == 200) {
                //alert(response.msg);
                button.innerText = response.msg;
            }
        },
        error: function(response) {
            console.log(response);
        }
    });
};
var setPasswd = function(user_name, user_pass, root_name, root_pass, zhongjj_name, zhongjj_pass, system, ip, port, return_tr, button) {
    if(user_name == undefined && user_pass == undefined) {
        return;
    }
    console.log('system', system);
    console.log('port', port);
    if(port == undefined && port == '3389' && port == '33890' && port == '65089'  && port == '63389') {
        return;
    }
    $.ajax({
        dataType: "json",
        url: "setPasswd.json",
        data: {
            ip,
            user_name,
            user_pass,
            root_name,
            root_pass,
            zhongjj_name,
            zhongjj_pass,
            system,
            port,
        },
        success: function(response) {
            if(response.code == 200) {
                //alert(response.msg);
                button.innerText = response.msg;
            }
        },
        error: function(response) {
            console.log(response);
        }
    });
};

var bijiao = function(id, mns) {
    if(id === undefined) {
        return true;
    }
    id = id.replace(/[\d]/g, '');
    //console.log('id', id);
    for(let i in mns) {
        if(id == 'sjs-' + mns[i]) {
            return true;
        }
    }
    return false;
};

var MNS = 'A,B,C,D,G,H,I,J,K,N,AG,AH,AI,AJ,AN,BD,BE,BH'.split(',');
//var Length = 52;//MN('BD');
//console.log('Length', Length);

var hide = function(ip, port, button) {
    $("td").each(function(index) {
        let id = $(this).attr('id');
        if(!bijiao(id, MNS)) {
            $(this).hide();
        }
    });
};
var addEvent = function() {
    $('span[contenteditable="true"]').each(function() {
        $(this).keyup(function() {
            console.log($(this).text());
            $(this).parent().attr("v", $(this).text());
        });
    });
    //$("table tr");//$($($("table tr")[100]).find("td")[2]).attr("v");
	let return_tr = undefined;
    $("table tr").each(function(index) {
        let td = document.createElement('td');
        let button = document.createElement('button');
        button.onclick = function () {
            //console.log($(this));
            let ip = '';
            let user_name = '';
            let user_pass = '';
            let root_name = '';
            let root_pass = '';
            let zhongjj_name = '';
            let zhongjj_pass = '';
            let system = '';
            let port = '';
            let time = '';
			return_tr = $(this).parent().parent();
            return_tr.find("td").each(function() {
                let id = $(this).attr("id");
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
                    } else if(id.indexOf('sjs-AN') == 0) {
                        time = $(this).attr("v");
                    } else if(id.indexOf('sjs-BD') == 0) {
                        zhongjj_name = $(this).attr("v");
                    } else if(id.indexOf('sjs-BE') == 0) {
                        zhongjj_pass = $(this).attr("v");
                    }
                }
            });
			if(time && time.length == '2022-05-10 03:04:26'.length) {
				let seconds = moment().diff(moment(time, "YYYY-MM-DD HH:mm:ss"), "seconds");
				let mintus = (seconds/60);
				let hours = (mintus/60);
				let days = (hours/24);
				let month = (days/30);
				if(month == 0) {
					return;//超过一个月才获取新的
				}
			}
            console.log('ip', ip);
            console.log('port', port);
            // console.log('user_name', user_name);
            // console.log('user_pass', user_pass);
            // console.log('root_name', root_name);
            // console.log('root_pass', root_pass);
            getCPUInfo(user_name, user_pass, root_name, root_pass, system, ip, port, return_tr);
        };
        button.innerText = '获取';
        td.appendChild(button);

        let button2 = document.createElement('button');
        button2.onclick = function () {
            let ip = '';
            let user_name = '';
            let user_pass = '';
            let root_name = '';
            let root_pass = '';
            let zhongjj_name = '';
            let zhongjj_pass = '';
            let system = '';
            let port = '';
            let time = '';
			return_tr = $(this).parent().parent();
            return_tr.find("td").each(function() {
                let id = $(this).attr("id");
                //console.log(id);
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
                    } else if(id.indexOf('sjs-AN') == 0) {
                        time = $(this).attr("v");
                    } else if(id.indexOf('sjs-BD') == 0) {
                        zhongjj_name = $(this).attr("v");
                    } else if(id.indexOf('sjs-BE') == 0) {
                        zhongjj_pass = $(this).attr("v");
                    }
                }
            });
            console.log('ip', ip);
            console.log('port', port);
            telnet(ip, port, button2);
        };
        button2.innerText = 'ping';
        td.appendChild(button2);

        let button3 = document.createElement('button');
        button3.onclick = function () {
            let ip = '';
            let user_name = '';
            let user_pass = '';
            let root_name = '';
            let root_pass = '';
            let zhongjj_name = '';
            let zhongjj_pass = '';
            let system = '';
            let port = '';
            let time = '';
			return_tr = $(this).parent().parent();
            return_tr.find("td").each(function() {
                let id = $(this).attr("id");
                //console.log(id);
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
                    } else if(id.indexOf('sjs-AN') == 0) {
                        time = $(this).attr("v");
                    } else if(id.indexOf('sjs-BD') == 0) {
                        zhongjj_name = $(this).attr("v");
                    } else if(id.indexOf('sjs-BE') == 0) {
                        zhongjj_pass = $(this).attr("v");
                    }
                }
            });
            console.log('ip', ip);
            console.log('port', port);
            setPasswd(user_name, user_pass, root_name, root_pass, zhongjj_name, zhongjj_pass, system, ip, port, return_tr, button3);
        };
        button3.innerText = '重设';
        td.appendChild(button3);

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
