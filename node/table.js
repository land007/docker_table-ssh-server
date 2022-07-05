var export_xlsx = function() {
	var wb = XLSX.utils.table_to_book(document.getElementById("htmlout"));
	XLSX.writeFile(wb, "sheetjs.xlsx");
};
var ajaxget = false;
var ajaxgetTimeout;
$(function() {
    $('span[contenteditable="true"]').each(function() {
        $(this).keyup(function() {
            console.log($(this).text());
            $(this).parent().attr("v", $(this).text());
        });
    });
    //$("table tr");//$($($("table tr")[100]).find("td")[2]).attr("v");
	let return_tr = undefined;
	//let table_index = 1;
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
            console.log('user_name', user_name);
            console.log('user_pass', user_pass);
            console.log('root_name', root_name);
            console.log('root_pass', root_pass);
			if(user_name == undefined && root_name == undefined && root_name == undefined && user_pass == undefined && root_pass == undefined) {
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
				timeout : 20000,
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
					return_tr.find("td").each(function(index) {
						var id = $(this).attr("id");
						console.log(id);
						if(id) {
							if(id.indexOf('sjs-N') == 0) {
								$(this).attr("v", response.msg.vv);
								$(this).find('span').text(response.msg.vv);
							} else if(id.indexOf('sjs-AF') == 0) {
								$(this).attr("v", response.msg.port);
								$(this).find('span').text(response.msg.port);
							} else if(id.indexOf('sjs-P') == 0) {
								$(this).attr("v", response.msg.tomcat_count);
								$(this).find('span').text(response.msg.tomcat_count);
							} else if(id.indexOf('sjs-Q') == 0) {
								$(this).attr("v", response.msg.weblogic_count);
								$(this).find('span').text(response.msg.weblogic_count);
							} else if(id.indexOf('sjs-R') == 0) {
								$(this).attr("v", response.msg.wlserver_version);
								$(this).find('span').text(response.msg.wlserver_version);
							} else if(id.indexOf('sjs-S') == 0) {
								$(this).attr("v", response.msg.java_count);
								$(this).find('span').text(response.msg.java_count);
							} else if(id.indexOf('sjs-T') == 0) {
								$(this).attr("v", response.msg.java_version);
								$(this).find('span').text(response.msg.java_version);
							} else if(id.indexOf('sjs-U') == 0) {
								$(this).attr("v", response.msg.mysql_count);
								$(this).find('span').text(response.msg.mysql_count);
							} else if(id.indexOf('sjs-V') == 0) {
								$(this).attr("v", response.msg.redis_count);
								$(this).find('span').text(response.msg.redis_count);
							} else if(id.indexOf('sjs-W') == 0) {
								$(this).attr("v", response.msg.mongo_count);
								$(this).find('span').text(response.msg.mongo_count);
							} else if(id.indexOf('sjs-X') == 0) {
								$(this).attr("v", response.msg.memcache_count);
								$(this).find('span').text(response.msg.memcache_count);
							} else if(id.indexOf('sjs-Y') == 0) {
								$(this).attr("v", response.msg.nginx_count);
								$(this).find('span').text(response.msg.nginx_count);
							} else if(id.indexOf('sjs-AG') == 0) {
								$(this).attr("v", response.msg.cpu);
								$(this).find('span').text(response.msg.cpu);
							} else if(id.indexOf('sjs-AH') == 0) {
								$(this).attr("v", response.msg.memory);
								$(this).find('span').text(response.msg.memory);
							} else if(id.indexOf('sjs-AI') == 0) {
								$(this).attr("v", response.msg.disk_use);
								$(this).find('span').text(response.msg.disk_use);
							} else if(id.indexOf('sjs-AJ') == 0) {
								$(this).attr("v", response.msg.disk);
								$(this).find('span').text(response.msg.disk);
							} else if(id.indexOf('sjs-AN') == 0) {
								if(response.msg.cpu) {
									let time = moment().format('YYYY-MM-DD hh:mm:ss');
									$(this).attr("v", time);
									$(this).find('span').text(time);
								}
							}
						}
					});
					$('button')[index + 1].click();
//					table_index = index;
//					table_index++;
                },
                error: function(response) {
					ajaxget = false;
					$('button')[index + 1].click();
                    console.log(response);
                }
            });
        };
        button.innerText = '获取';
        td.appendChild(button);
        this.appendChild(td);
    });
    console.log('结束');
});
